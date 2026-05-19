import Link from 'next/link';
import { products, prices, formatBDT } from '@/lib/data';
export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}){const {q=''}=await searchParams; const list=products.filter(p=>`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q.toLowerCase()));
return <main className='container py-8'><h1 className='text-2xl font-bold mb-4'>Search Results</h1><div className='space-y-3'>{list.map(p=>{const best=prices.filter(x=>x.productId===p.id).sort((a,b)=>a.currentPrice-b.currentPrice)[0];return <Link href={`/product/${p.slug}`} className='card p-4 block' key={p.id}>{p.name} - {p.brand}<div>From {best?formatBDT(best.currentPrice):'N/A'}</div></Link>})}</div></main>}
