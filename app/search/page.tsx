import Link from 'next/link';
import Image from 'next/image';
import { products, prices, formatBDT } from '@/lib/data';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const list = products.filter((p) =>
    `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results for "{q}"</h1>
      <div className="grid gap-4">
        {list.length > 0 ? (
          list.map((p) => {
            const best = prices
              .filter((x) => x.productId === p.id)
              .sort((a, b) => a.currentPrice - b.currentPrice)[0];
            return (
              <Link
                href={`/product/${p.slug}`}
                className="card p-4 flex gap-4 items-center hover:border-emerald-500 transition-colors"
                key={p.id}
              >
                {p.heroImage && (
                  <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0 bg-white border">
                    <Image src={p.heroImage} alt={p.name} fill className="object-contain p-2" />
                  </div>
                )}
                <div>
                  <div className="font-bold text-lg">{p.name}</div>
                  <div className="text-slate-500">{p.brand} · {p.category}</div>
                  <div className="text-emerald-600 font-semibold mt-1">
                    {best ? `Starting from ${formatBDT(best.currentPrice)}` : 'Price N/A'}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-500">No products found matching your search.</div>
        )}
      </div>
    </main>
  );
}
