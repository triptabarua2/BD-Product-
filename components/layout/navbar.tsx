import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

const navLinks = [
  { href: '/search', label: 'খোঁজুন' },
  { href: '/compare', label: 'তুলনা' },
  { href: '/favorites', label: 'পছন্দের' },
  { href: '/price-alerts', label: 'দাম আলার্ট' },
  { href: '/blog', label: 'ব্লগ' },
];

export function Navbar() {
  return (
    <header className="border-b sticky top-0 z-50 bg-white dark:bg-slate-950">
      <div className="container py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-emerald-600">
          BD Product 🇧🇩
        </Link>
        <nav className="flex gap-4 items-center text-sm">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-emerald-600 transition-colors hidden sm:block">
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
