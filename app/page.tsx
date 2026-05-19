import Link from 'next/link';
import { categories, prices, products, formatBDT } from '@/lib/data';
export default function Home(){
 const trending=products.slice(0,3); const deals=prices.sort((a,b)=>b.discountPercent-a.discountPercent).slice(0,4);
 return <main className='container py-10 space-y-10'>
  <section className='card p-8 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white'><h1 className='text-4xl font-bold'>Bangladesh Product Intelligence</h1><p className='mt-3'>AI-powered bilingual reviews with live BDT pricing.</p><form action='/search' className='mt-6'><input name='q' placeholder='Search mobile, laptop, brand...' className='w-full max-w-xl rounded-xl p-3 text-slate-900'/></form></section>
  <section><h2 className='text-2xl font-semibold mb-4'>Popular categories</h2><div className='grid grid-cols-2 md:grid-cols-5 gap-3'>{categories.slice(0,10).map(c=><Link key={c} href={`/category/${encodeURIComponent(c.toLowerCase().replace(/\s+/g,'-'))}`} className='card p-4'>{c}</Link>)}</div></section>
  <section><h2 className='text-2xl font-semibold mb-4'>Trending products</h2><div className='grid md:grid-cols-3 gap-4'>{trending.map(p=><Link key={p.id} href={`/product/${p.slug}`} className='card p-4'><div className='font-semibold'>{p.name}</div><div>{p.brand}</div><div>{p.rating}/5</div></Link>)}</div></section>
  <section><h2 className='text-2xl font-semibold mb-4'>Featured deals</h2><div className='grid md:grid-cols-2 gap-4'>{deals.map(d=>{const product=products.find(p=>p.id===d.productId)!; return <div key={product.id+d.storeName} className='card p-4'><div className='font-semibold'>{product.name} @ {d.storeName}</div><div>{formatBDT(d.currentPrice)} <span className='line-through text-sm'>{formatBDT(d.originalPrice)}</span></div></div>})}</div></section>
 </main>}
