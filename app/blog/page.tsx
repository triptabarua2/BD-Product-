import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'ব্লগ – BD Product',
  description: 'বাংলাদেশের টেক পণ্য নিয়ে সর্বশেষ নিবন্ধ ও রিভিউ।',
  alternates: { canonical: 'https://bdproduct.com.bd/blog' },
};
export default function BlogPage() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold mb-4">ব্লগ</h1>
      <p className="text-slate-500">近 শীঘ্রই আসছে...</p>
    </main>
  );
}
