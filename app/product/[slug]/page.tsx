import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductBySlug, getProductPrices, getAllProductSlugs } from '@/lib/db';
import { formatBDT } from '@/lib/data';
import { AIReview } from '@/components/product/AIReview';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};

  const prices = await getProductPrices(p.id);
  const lowest = prices[0];
  const priceText = lowest ? ` – মাত্র ${formatBDT(lowest.currentPrice)}` : '';

  return {
    title: `${p.name} দাম ও রিভিউ বাংলাদেশ${priceText}`,
    description: `${p.name} এর AI রিভিউ, BDT দাম তুলনা ও স্পেসিফিকেশন। ${p.brand} | রেটিং: ${p.rating}/5`,
    keywords: [
      `${p.name}`,
      `${p.name} দাম`,
      `${p.name} price in Bangladesh`,
      `${p.brand} ${p.category}`,
      'BD product review',
    ],
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
  const p = await getProductBySlug(slug);
  if (!p) return notFound();

  const storePrices = await getProductPrices(p.id);
  const lowest = storePrices[0];

  // AIReview component-এ pass করার জন্য price summary
  const priceSummary = storePrices.map((s) => ({
    storeName: s.storeName,
    currentPrice: s.currentPrice,
  }));

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    brand: { '@type': 'Brand', name: p.brand },
    description: `${p.name} – AI-powered bilingual review for Bangladeshi users.`,
    image: p.heroImage || undefined,
    aggregateRating: p.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: p.rating,
          bestRating: 5,
          worstRating: 1,
          reviewCount: Math.max(1, Math.floor(p.rating * 20)),
        }
      : undefined,
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

        {/* ── Hero section ─────────────────────────────────── */}
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
            {lowest && (
              <a
                href={lowest.affiliateUrl !== '#' ? lowest.affiliateUrl : lowest.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
              >
                {lowest.storeName}-এ কিনুন →
              </a>
            )}
          </div>
        </div>

        {/* ── Main grid ─────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* AI Review – client component, auto-loads on mount */}
          <div className="md:col-span-2">
            <AIReview
              productId={p.id}
              productName={p.name}
              specs={p.specs}
              prices={priceSummary}
            />
          </div>

          {/* Price sidebar */}
          <aside className="card p-6 space-y-3 h-fit">
            <p className="text-sm text-slate-500 font-medium">সর্বনিম্ন দাম</p>
            <div className="text-2xl font-bold text-emerald-600">
              {lowest ? formatBDT(lowest.currentPrice) : 'N/A'}
            </div>
            {lowest && lowest.originalPrice > lowest.currentPrice && (
              <p className="text-sm text-slate-400 line-through">
                {formatBDT(lowest.originalPrice)}
              </p>
            )}
            <p className="text-xs text-slate-400">
              আপডেট: {lowest ? new Date(lowest.lastUpdated).toLocaleDateString('bn-BD') : '–'}
            </p>
          </aside>
        </div>

        {/* ── Specs ─────────────────────────────────────────── */}
        {Object.keys(p.specs).length > 0 && (
          <section className="card p-6">
            <h3 className="font-semibold mb-4">স্পেসিফিকেশন</h3>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k} className="border-b pb-2">
                  <dt className="text-xs text-slate-500">{k}</dt>
                  <dd className="font-medium text-sm">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* ── Price comparison ───────────────────────────────── */}
        {storePrices.length > 0 && (
          <section className="card p-6">
            <h3 className="font-semibold mb-4">বাংলাদেশের স্টোরে দাম তুলনা</h3>
            <div className="space-y-2">
              {storePrices.map((s) => (
                <div key={s.storeName} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <span className="flex items-center gap-2">
                    <a
                      href={s.affiliateUrl !== '#' ? s.affiliateUrl : s.storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-600 transition-colors font-medium"
                    >
                      {s.storeName}
                    </a>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        s.availability === 'in_stock'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {s.availability === 'in_stock' ? 'আছে' : 'নেই'}
                    </span>
                  </span>
                  <span className="font-semibold">{formatBDT(s.currentPrice)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
