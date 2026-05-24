import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts, getAllCategories, getTopDeals } from '@/lib/db';
import { formatBDT } from '@/lib/data';

// প্রতি request-এ fresh data (দাম পরিবর্তন হতে পারে)
export const dynamic = 'force-dynamic';

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

export default async function Home() {
  const [allProducts, categories, deals] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getTopDeals(4),
  ]);

  const trending = allProducts.slice(0, 3);

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
        {categories.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">জনপ্রিয় ক্যাটাগরি</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.slice(0, 10).map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="card p-4 text-center hover:border-emerald-500 transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending */}
        {trending.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">ট্রেন্ডিং প্রোডাক্ট</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {trending.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="card p-4 hover:border-emerald-500 transition-colors flex gap-4 items-center"
                >
                  {p.heroImage && (
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0 bg-white border">
                      <Image src={p.heroImage} alt={p.name} fill className="object-contain p-1" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-slate-500">{p.brand}</div>
                    <div className="mt-1 text-sm">⭐ {p.rating}/5</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Deals */}
        {deals.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">সেরা ডিল</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {deals.map(({ product, price }) => (
                <Link
                  key={product.id + price.storeName}
                  href={`/product/${product.slug}`}
                  className="card p-4 flex gap-4 items-center hover:border-emerald-500 transition-colors"
                >
                  {product.heroImage && (
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0 bg-white border">
                      <Image src={product.heroImage} alt={product.name} fill className="object-contain p-1" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{product.name} @ {price.storeName}</div>
                    <div>
                      {formatBDT(price.currentPrice)}{' '}
                      <span className="line-through text-sm text-slate-400">{formatBDT(price.originalPrice)}</span>
                      <span className="ml-2 text-emerald-600 font-medium">-{price.discountPercent.toFixed(0)}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {allProducts.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg">ডেটাবেসে এখনো কোনো প্রোডাক্ট নেই।</p>
            <p className="text-sm mt-2">
              <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">pnpm db:seed-supabase</code> চালান।
            </p>
          </div>
        )}
      </main>
    </>
  );
}
