import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prices, products, formatBDT } from '@/lib/data';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) return {};

  const storePrices = prices.filter((x) => x.productId === p.id).sort((a, b) => a.currentPrice - b.currentPrice);
  const lowest = storePrices[0];
  const priceText = lowest ? ` – মাত্র ${formatBDT(lowest.currentPrice)}` : '';

  return {
    title: `${p.name} দাম ও রিভিউ বাংলাদেশ${priceText}`,
    description: `${p.name} এর AI রিভিউ, BDT দাম তুলনা ও স্পেসিফিকেশন। ${p.brand} | রেটিং: ${p.rating}/5`,
    keywords: [`${p.name}`, `${p.name} দাম`, `${p.name} price in Bangladesh`, `${p.brand} ${p.category}`, 'BD product review'],
    alternates: { canonical: `https://bdproduct.com.bd/product/${slug}` },
    openGraph: {
      title: `${p.name} – দাম ও AI রিভিউ`,
      description: `${p.name} এর সেরা দাম ও বিস্তারিত রিভিউ বাংলাদেশে।`,
      url: `https://bdproduct.com.bd/product/${slug}`,
      images: p.heroImage ? [{ url: p.heroImage, alt: p.name }] : [],
    },
  };
}

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) return notFound();

  const storePrices = prices.filter((x) => x.productId === p.id).sort((a, b) => a.currentPrice - b.currentPrice);
  const lowest = storePrices[0];

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    brand: { '@type': 'Brand', name: p.brand },
    description: `${p.name} – AI-powered bilingual review for Bangladeshi users.`,
    image: p.heroImage || undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: p.rating,
      bestRating: 5,
      worstRating: 1,
      reviewCount: Math.floor(p.popularity * 2),
    },
    offers: lowest
      ? {
          '@type': 'Offer',
          priceCurrency: 'BDT',
          price: lowest.currentPrice,
          availability:
            lowest.availability === 'in_stock'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: lowest.storeName },
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <main className="container py-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {p.heroImage && (
            <div className="w-full md:w-1/3 aspect-square relative rounded-2xl overflow-hidden border bg-white shadow-sm">
              <Image
                src={p.heroImage}
                alt={p.name}
                fill
                className="object-contain p-4"
                priority
              />
            </div>
          )}
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-bold">{p.name}</h1>
            <p className="text-xl text-slate-500 font-medium">
              {p.brand} · {p.category} · ⭐ {p.rating}/5
            </p>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-emerald-600">
                {lowest ? formatBDT(lowest.currentPrice) : 'N/A'}
              </div>
              {lowest && lowest.discountPercent > 0 && (
                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {lowest.discountPercent.toFixed(0)}% OFF
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* AI Review */}
          <section className="md:col-span-2 card p-6">
            <h2 className="font-semibold text-xl">AI Review (English + বাংলা)</h2>
            <p className="mt-3">
              Excellent all-rounder for Bangladeshi users. এই প্রোডাক্টটি দৈনন্দিন ব্যবহার,
              ক্যামেরা, এবং ব্যাটারি লাইফে ভালো পারফর্ম করে। Value score: 8.7/10.
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-1">
              <li>✅ Pros: Reliable performance, strong display, good resale.</li>
              <li>❌ Cons: Charger speed could be faster.</li>
            </ul>
          </section>

          {/* Price Summary */}
          <aside className="card p-6 space-y-2">
            <div className="text-lg font-bold text-emerald-600">
              {lowest ? formatBDT(lowest.currentPrice) : 'N/A'}
            </div>
            <div className="text-sm text-slate-500">সর্বনিম্ন দাম</div>
            <div className="text-sm">Best for: Students, office users</div>
            <div className="text-xs text-slate-400">
              আপডেট: {new Date().toLocaleString('bn-BD')}
            </div>
          </aside>
        </div>

        {/* Specs */}
        {Object.keys(p.specs).length > 0 && (
          <section className="card p-6">
            <h3 className="font-semibold mb-3">স্পেসিফিকেশন</h3>
            <dl className="grid grid-cols-2 gap-2">
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k} className="border-b pb-1">
                  <dt className="text-xs text-slate-500">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Price Comparison */}
        <section className="card p-6">
          <h3 className="font-semibold mb-3">বাংলাদেশের স্টোরে দাম তুলনা</h3>
          <div className="space-y-2">
            {storePrices.map((s) => (
              <div key={s.storeName} className="flex justify-between border-b pb-2">
                <span>
                  {s.storeName}{' '}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.availability === 'in_stock' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {s.availability === 'in_stock' ? 'আছে' : 'নেই'}
                  </span>
                </span>
                <span className="font-semibold">{formatBDT(s.currentPrice)}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
