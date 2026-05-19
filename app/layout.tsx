import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  metadataBase: new URL('https://bdproduct.com.bd'),
  title: {
    default: 'BD Product – বাংলাদেশের সেরা প্রোডাক্ট রিভিউ ও দাম তুলনা',
    template: '%s | BD Product',
  },
  description:
    'বাংলাদেশের সেরা মোবাইল, ল্যাপটপ, ইলেকট্রনিক্স পণ্যের AI রিভিউ, BDT মূল্য তুলনা ও ডিল। Daraz, Pickaboo, Star Tech সহ সকল বাংলাদেশী স্টোরের লাইভ দাম।',
  keywords: [
    'বাংলাদেশ প্রোডাক্ট',
    'মোবাইল দাম বাংলাদেশ',
    'ল্যাপটপ দাম বাংলাদেশ',
    'Bangladesh product price',
    'mobile price in Bangladesh',
    'laptop price Bangladesh',
    'BD product review',
    'Daraz Bangladesh',
    'Pickaboo',
    'Star Tech',
  ],
  authors: [{ name: 'BD Product Team' }],
  creator: 'BD Product',
  publisher: 'BD Product',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    alternateLocale: 'en_US',
    siteName: 'BD Product',
    title: 'BD Product – বাংলাদেশের সেরা প্রোডাক্ট রিভিউ ও দাম তুলনা',
    description:
      'বাংলাদেশের সেরা মোবাইল, ল্যাপটপ পণ্যের AI রিভিউ এবং BDT মূল্য তুলনা।',
    url: 'https://bdproduct.com.bd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BD Product – AI-powered product reviews in Bangladesh',
    description: 'Bilingual AI reviews with live BDT pricing from BD stores.',
  },
  alternates: {
    canonical: 'https://bdproduct.com.bd',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
