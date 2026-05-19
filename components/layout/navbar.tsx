import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
export function Navbar(){return <header className='border-b'><div className='container py-4 flex justify-between'><Link href='/' className='font-bold text-xl'>BD Product</Link><nav className='flex gap-4 items-center text-sm'>{['search','compare','favorites','price-alerts','blog','admin'].map(p=><Link key={p} href={`/${p}`}>{p}</Link>)}<ThemeToggle/></nav></div></header>;}
