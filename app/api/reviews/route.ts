import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = `Generate a bilingual (Bangla + English) product review for "${body.productName}".
Specs: ${JSON.stringify(body.specs)}
BDT price context: ${JSON.stringify(body.prices)}

Respond in JSON format:
{
  "summary_en": "...",
  "summary_bn": "...",
  "pros": ["...", "..."],
  "cons": ["...", "..."],
  "score": 8.5,
  "value_analysis": "..."
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const review = JSON.parse(response.choices[0].message.content ?? '{}');
    return NextResponse.json({ review });
  } catch (err) {
    console.error('Review API error:', err);
    return NextResponse.json({ error: 'Review generation failed' }, { status: 500 });
  }
}
