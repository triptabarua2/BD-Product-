import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'আমাদের সম্পর্কে – BD Product',
  description: 'BD Product হলো বাংলাদেশের প্রথম AI-powered পণ্য রিভিউ ও দাম তুলনা প্ল্যাটফর্ম।',
  alternates: { canonical: 'https://bdproduct.com.bd/about' },
};
export default function AboutPage() {
  return (
    <main className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">আমাদের সম্পর্কে</h1>
      <div className="card p-6 space-y-4 text-slate-700 dark:text-slate-300">
        <p>BD Product হলো বাংলাদেশের প্রথম AI-powered পণ্য রিভিউ ও মূল্য তুলনা প্ল্যাটফর্ম। আমরা বাংলাদেশের ভোক্তাদের সঠিক পণ্য সঠিক দামে কিনতে সাহায্য করি।</p>
        <p>আমাদের AI সিস্টেম প্রতিটি পণ্যের বাংলা ও ইংরেজিতে বিস্তারিত রিভিউ তৈরি করে এবং Daraz, Pickaboo, Star Tech সহ সকল বড় বাংলাদেশী স্টোরের লাইভ দাম দেখায়।</p>
      </div>
    </main>
  );
}
