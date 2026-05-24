'use client';

import { useEffect, useState } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────

type Language = 'bn' | 'en';

interface ReviewData {
  summary: string;
  detailed_review: string;
  pros: string[];
  cons: string[];
  overall_score: number;
}

interface Props {
  productId: string;
  productName: string;
  specs: Record<string, string>;
  prices: { storeName: string; currentPrice: number }[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(100, (score / 10) * 100);
  const color =
    score >= 8 ? 'bg-emerald-500' : score >= 6 ? 'bg-yellow-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-3 mt-1">
      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold tabular-nums">{score.toFixed(1)}/10</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mt-4" />
      <div className="flex gap-3 mt-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24" />
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24" />
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export function AIReview({ productId, productName, specs, prices }: Props) {
  const [review, setReview] = useState<ReviewData | null>(null);
  const [source, setSource] = useState<string>('');
  const [language, setLanguage] = useState<Language>('bn');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadReview(lang: Language) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productName,
          specs,
          prices,
          language: lang,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'রিভিউ লোড ব্যর্থ হয়েছে।');
      }

      setReview(data.review as ReviewData);
      setSource(data.source ?? '');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'অজানা সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  }

  // Mount-এ auto-load
  useEffect(() => {
    loadReview(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function switchLanguage(lang: Language) {
    if (lang === language) return;
    setLanguage(lang);
    setReview(null);
    loadReview(lang);
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <section className="card p-6 space-y-4">
      {/* Header + language toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-semibold text-xl flex items-center gap-2">
          🤖 AI রিভিউ
          {source === 'database' && (
            <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              cached
            </span>
          )}
        </h2>
        <div className="flex rounded-lg overflow-hidden border dark:border-slate-700 text-sm">
          {(['bn', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => switchLanguage(lang)}
              disabled={loading}
              className={`px-3 py-1.5 transition-colors ${
                language === lang
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {lang === 'bn' ? 'বাংলা' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading && <Skeleton />}

      {error && !loading && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-4 text-sm flex flex-col gap-2">
          <span>⚠️ {error}</span>
          <button
            onClick={() => loadReview(language)}
            className="self-start text-xs underline hover:no-underline"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {review && !loading && (
        <div className="space-y-5">
          {/* Overall score */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">সামগ্রিক স্কোর</p>
            <ScoreBar score={review.overall_score} />
          </div>

          {/* Summary */}
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{review.summary}</p>

          {/* Pros & Cons */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Pros */}
            {review.pros?.length > 0 && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-4">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-2">
                  ✅ সুবিধা
                </p>
                <ul className="space-y-1.5">
                  {review.pros.map((pro, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                      <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {review.cons?.length > 0 && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/40 p-4">
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2">
                  ❌ অসুবিধা
                </p>
                <ul className="space-y-1.5">
                  {review.cons.map((con, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                      <span className="text-red-400 mt-0.5 shrink-0">•</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Detailed review */}
          {review.detailed_review && (
            <details className="group">
              <summary className="cursor-pointer text-sm text-emerald-600 hover:text-emerald-700 font-medium select-none list-none flex items-center gap-1">
                <span className="transition-transform group-open:rotate-90">▶</span>
                বিস্তারিত রিভিউ পড়ুন
              </summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {review.detailed_review}
              </p>
            </details>
          )}

          <p className="text-xs text-slate-400">
            এই রিভিউটি Groq AI দ্বারা তৈরি। তথ্য যাচাই করে নিন।
          </p>
        </div>
      )}
    </section>
  );
}
