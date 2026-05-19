import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'যোগাযোগ করুন – BD Product',
  description: 'BD Product টিমের সাথে যোগাযোগ করুন।',
  alternates: { canonical: 'https://bdproduct.com.bd/contact' },
};
export default function ContactPage() {
  return (
    <main className="container py-10 max-w-xl">
      <h1 className="text-3xl font-bold mb-4">যোগাযোগ করুন</h1>
      <div className="card p-6 space-y-4">
        <p className="text-slate-600 dark:text-slate-400">আমাদের সাথে যোগাযোগ করতে নিচের ইমেইলে লিখুন:</p>
        <a href="mailto:hello@bdproduct.com.bd" className="text-emerald-600 font-medium">hello@bdproduct.com.bd</a>
      </div>
    </main>
  );
}
