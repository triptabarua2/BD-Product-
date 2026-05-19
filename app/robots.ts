import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/price-alerts/', '/favorites/'],
      },
    ],
    sitemap: 'https://bdproduct.com.bd/sitemap.xml',
    host: 'https://bdproduct.com.bd',
  };
}
