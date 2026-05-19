import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products, prices, categories, formatBDT } from '@/lib/data';

type Props = { params: Promise<{ slug: string }> };

function slugToName(slug: string) {
  return categories.find(
    (c) => c.toLowerCase().replace(/\s+/g, '-') === slug
  );
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.toLowerCase().replace(/\s+/g, '-') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slugToName(slug);
  if (!name) return {};
  return {
    title: `${name} দাম ও রিভিউ বাংলাদেশ`,
    description: `বাংলাদেশে ${name} এর সেরা দাম, রিভিউ ও তুলনা।`,
    alternates: { canonical: `https://bdproduct.com.bd/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const name = slugToName(slug);
  if (!name) return notFound();

  const items = products.filter((p) => p.category === name);

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-6">{name}</h1>
      {items.length === 0 ? (
        <p className="text-slate-500">এই ক্যাটাগরিতে কোনো প্রোডাক্ট নেই।</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((p) => {
            const best = prices
              .filter((x) => x.productId === p.id)
              .sort((a, b) => a.currentPrice - b.currentPrice)[0];
            return (
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
            );
          })}
        </div>
      )}
    </main>
  );
}
