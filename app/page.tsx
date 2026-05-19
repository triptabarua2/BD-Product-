import type { Metadata } from 'next';
import Link from 'next/link';
import { categories, prices, products, formatBDT } from '@/lib/data';

export const metadata: Metadata = {
  title: 'BD Product – বাংলাদেশের সেরা প্রোডাক্ট রিভিউ ও দাম তুলনা',
  description:
    'AI-powered bilingual (বাংলা + English) product reviews with live BDT pricing. Compare prices from Daraz, Pickaboo, Star Tech and more.',
  alternates: { canonical: 'https://bdproduct.com.bd' },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BD Product',
  url: 'https://bdproduct.com.bd',
  description: 'Bangladesh product intelligence — AI reviews with BDT pricing',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://bdproduct.com.bd/search?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
};

export default function Home() {
  const trending = products.slice(0, 3);
  const deals = prices.sort((a, b) => b.discountPercent - a.discountPercent).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <main className="container py-10 space-y-10">
        {/* Hero */}
        <section className="card p-8 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
          <h1 className="text-4xl font-bold">Bangladesh Product Intelligence</h1>
          <p className="mt-3">AI-powered bilingual reviews with live BDT pricing.</p>
          <form action="/search" className="mt-6">
            <input
              name="q"
              placeholder="Search mobile, laptop, brand..."
              className="w-full max-w-xl rounded-xl p-3 text-slate-900"
            />
          </form>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">জনপ্রিয় ক্যাটাগরি</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categories.slice(0, 10).map((c) => (
              <Link
                key={c}
                href={`/category/${encodeURIComponent(c.toLowerCase().replace(/\s+/g, '-'))}`}
                className="card p-4 text-center hover:border-emerald-500 transition-colors"
              >
                {c}
              </Link>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">ট্রেন্ডিং প্রোডাক্ট</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {trending.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="card p-4 hover:border-emerald-500 transition-colors">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-slate-500">{p.brand}</div>
                <div className="mt-1 text-sm">⭐ {p.rating}/5</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Deals */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">সেরা ডিল</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {deals.map((d) => {
              const product = products.find((p) => p.id === d.productId)!;
              return (
                <div key={product.id + d.storeName} className="card p-4">
                  <div className="font-semibold">{product.name} @ {d.storeName}</div>
                  <div>
                    {formatBDT(d.currentPrice)}{' '}
                    <span className="line-through text-sm text-slate-400">{formatBDT(d.originalPrice)}</span>
                    <span className="ml-2 text-emerald-600 font-medium">-{d.discountPercent.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
