import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts, getProductPrices } from '@/lib/db';
import { formatBDT } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const query = q.trim().toLowerCase();

  // সব প্রোডাক্ট এনে client-side filter করা হচ্ছে।
  // ডেটা বেশি হলে Supabase full-text search ব্যবহার করতে হবে।
  const all = await getAllProducts();
  const list = query
    ? all.filter((p) =>
        `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query)
      )
    : all;

  // প্রতিটি প্রোডাক্টের সেরা দাম আলাদাভাবে টানা (parallel)
  const withPrices = await Promise.all(
    list.map(async (p) => {
      const prices = await getProductPrices(p.id);
      const best = prices.sort((a, b) => a.currentPrice - b.currentPrice)[0] ?? null;
      return { product: p, best };
    })
  );

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `"${q}" এর ফলাফল` : 'সব প্রোডাক্ট'}
        <span className="text-base font-normal text-slate-500 ml-3">({list.length}টি)</span>
      </h1>

      {/* Search bar */}
      <form action="/search" className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="নাম, ব্র্যান্ড বা ক্যাটাগরি লিখুন..."
          className="w-full max-w-xl border rounded-xl p-3 dark:bg-slate-900 dark:border-slate-700"
        />
      </form>

      <div className="grid gap-4">
        {withPrices.length > 0 ? (
          withPrices.map(({ product: p, best }) => (
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
                  {best ? `সর্বনিম্ন ${formatBDT(best.currentPrice)}` : 'দাম পাওয়া যায়নি'}
                </div>
                <div className="text-sm text-slate-400">⭐ {p.rating}/5</div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            &ldquo;{q}&rdquo; নামে কোনো প্রোডাক্ট পাওয়া যায়নি।
          </div>
        )}
      </div>
    </main>
  );
}
