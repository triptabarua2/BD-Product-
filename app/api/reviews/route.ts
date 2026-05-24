import { NextRequest, NextResponse } from 'next/server';
import { groq } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────

interface ReviewBody {
  productId: string;
  productName: string;
  specs?: Record<string, string>;
  prices?: { storeName: string; currentPrice: number }[];
  language?: 'bn' | 'en';
}

// ─── Rate limiting (simple in-memory, production-এ Redis ব্যবহার করুন) ──

const requestLog = new Map<string, number[]>();
const RATE_LIMIT = 10;         // প্রতি IP-তে সর্বোচ্চ request
const RATE_WINDOW = 60_000;    // ১ মিনিটে

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW);
  times.push(now);
  requestLog.set(ip, times);
  return times.length > RATE_LIMIT;
}

// ─── Prompt builder ───────────────────────────────────────────────────────

function buildPrompt(
  productName: string,
  specs: Record<string, string>,
  prices: { storeName: string; currentPrice: number }[],
  language: 'bn' | 'en'
): string {
  const langInstruction =
    language === 'bn'
      ? 'বাংলা ভাষায় লিখুন (মিশ্র English ঠিক আছে technical terms-এর জন্য)।'
      : 'Write in English.';

  const priceContext = prices.length
    ? prices.map((p) => `${p.storeName}: ৳${p.currentPrice.toLocaleString()}`).join(', ')
    : 'Price not available';

  return `You are a Bangladeshi tech reviewer. ${langInstruction}

Generate a concise product review for "${productName}" for a Bangladeshi audience.
Specs: ${JSON.stringify(specs)}
BDT prices: ${priceContext}

Respond ONLY with valid JSON, no extra text or markdown:
{
  "summary": "2-3 sentence overall verdict",
  "detailed_review": "3-4 paragraph detailed review",
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2"],
  "overall_score": 8.5
}`;
}

// ─── Route handler ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'অনেক বেশি request। একটু অপেক্ষা করুন।' },
      { status: 429 }
    );
  }

  // Parse body
  let body: ReviewBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    productId,
    productName = 'Unknown Product',
    specs = {},
    prices = [],
    language = 'bn',
  } = body;

  if (!productId) {
    return NextResponse.json({ error: 'productId প্রয়োজন।' }, { status: 400 });
  }

  // 1. Supabase cache চেক করো
  const { data: cached } = await supabase
    .from('ai_reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('language', language)
    .maybeSingle();

  if (cached) {
    return NextResponse.json({ review: cached, source: 'database' });
  }

  // 2. Groq দিয়ে review generate করো
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return NextResponse.json(
      { error: 'GROQ_API_KEY সেট নেই। .env.local চেক করুন।' },
      { status: 503 }
    );
  }

  let aiContent: {
    summary: string;
    detailed_review: string;
    pros: string[];
    cons: string[];
    overall_score: number;
  };

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: buildPrompt(productName, specs, prices, language),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
      max_tokens: 1200,
    });

    const raw = response.choices[0]?.message?.content ?? '{}';
    aiContent = JSON.parse(raw);

    // Basic validation
    if (!aiContent.summary || !Array.isArray(aiContent.pros)) {
      throw new Error('AI response format incorrect');
    }
  } catch (err) {
    console.error('[reviews] Groq error:', err);
    return NextResponse.json(
      { error: 'AI review generate করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' },
      { status: 502 }
    );
  }

  // 3. Supabase-এ save করো (cache miss → save করো)
  const { data: saved, error: insertErr } = await supabase
    .from('ai_reviews')
    .insert({
      product_id: productId,
      language,
      summary: aiContent.summary,
      detailed_review: aiContent.detailed_review,
      pros: aiContent.pros,
      cons: aiContent.cons,
      overall_score: aiContent.overall_score,
    })
    .select()
    .single();

  if (insertErr) {
    console.error('[reviews] Supabase insert error:', insertErr.message);
    // DB save ব্যর্থ হলেও AI content দাও
    return NextResponse.json({ review: aiContent, source: 'groq_only' });
  }

  return NextResponse.json({ review: saved, source: 'groq_generated' });
}
