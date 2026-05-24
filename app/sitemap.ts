import type { MetadataRoute } from 'next';
import { getAllProductSlugs, getAllCategories } from '@/lib/db';

const BASE = 'https://bdproduct.com.bd';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, categories] = await Promise.all([
    getAllProductSlugs(),
    getAllCategories(),
  ]);

  const productUrls: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE}/product/${slug}`,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE}/category/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    { url: BASE, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/search`, changeFrequency: 'weekly', priority: 0.5 },
    ...categoryUrls,
    ...productUrls,
  ];
}
