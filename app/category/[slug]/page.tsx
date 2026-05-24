import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllCategories, getProductsByCategory, getProductPrices } from '@/lib/db';
import { formatBDT } from '@/lib/data';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: `${cat.name} দাম ও রিভিউ বাংলাদেশ`,
    description: `বাংলাদেশে ${cat.name} এর সেরা দাম, রিভিউ ও তুলনা।`,
    alternates: { canonical: `https://bdproduct.com.bd/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const categories = await getAllCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return notFound();

  const products = await getProductsByCategory(slug);

  // প্রতিটির সেরা দাম সমান্তরালে লোড করা
  const withPrices = await Promise.all(
    products.map(async (p) => {
      const prices = await getProductPrices(p.id);
      const best = prices.sort((a, b) => a.currentPrice - b.currentPrice)[0] ?? null;
      return { product: p, best };
    })
  );

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-2">{cat.name}</h1>
      <p className="text-slate-500 mb-6">{products.length}টি প্রোডাক্ট পাওয়া গেছে</p>

      {withPrices.length === 0 ? (
        <p className="text-slate-500 py-12 text-center">এই ক্যাটাগরিতে কোনো প্রোডাক্ট নেই।</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {withPrices.map(({ product: p, best }) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="card p-4 hover:border-emerald-500 transition-colors space-y-3"
            >
              {p.heroImage && (
                <div className="aspect-square relative rounded-xl overflow-hidden bg-white border">
                  <Image src={p.heroImage} alt={p.name} fill className="object-contain p-4" />
                </div>
              )}
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-slate-500">{p.brand}</div>
                <div className="mt-1 font-medium text-emerald-600">
                  {best ? formatBDT(best.currentPrice) : 'N/A'}
                </div>
                <div className="text-sm">⭐ {p.rating}/5</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
