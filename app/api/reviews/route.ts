import { NextRequest, NextResponse } from 'next/server';
import { groq } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, productName, specs, prices, language = 'en' } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // 1. Check if review already exists in Supabase
    const { data: existingReview } = await supabase
      .from('ai_reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('language', language)
      .single();

    if (existingReview) {
      return NextResponse.json({ review: existingReview, source: 'database' });
    }

    // 2. Generate with Groq
    const prompt = `Generate a bilingual (Bangla + English) product review for "${productName}".
Specs: ${JSON.stringify(specs)}
BDT price context: ${JSON.stringify(prices)}

Respond in JSON format only, no extra text:
{
  "summary": "...",
  "detailed_review": "...",
  "pros": ["...", "..."],
  "cons": ["...", "..."],
  "overall_score": 8.5
}`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const aiContent = JSON.parse(response.choices[0].message.content ?? '{}');

    // 3. Save to Supabase
    const { data: newReview, error: insertError } = await supabase
      .from('ai_reviews')
      .insert([
        {
          product_id: productId,
          language: language,
          summary: aiContent.summary,
          detailed_review: aiContent.detailed_review,
          pros: aiContent.pros,
          cons: aiContent.cons,
          overall_score: aiContent.overall_score,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json({ review: aiContent, source: 'groq_only' });
    }

    return NextResponse.json({ review: newReview, source: 'groq_generated' });
  } catch (err) {
    console.error('Review API error:', err);
    return NextResponse.json({ error: 'Review generation failed' }, { status: 500 });
  }
}
