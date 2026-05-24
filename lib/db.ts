/**
 * lib/db.ts
 * সব Supabase query এখানে। Pages এই functions call করবে।
 */

import { supabase } from './supabase';
import type { Product, ProductPrice, StoreName } from './types';

// ─── Raw DB row types ──────────────────────────────────────────────────────

type DbSpec  = { spec_key: string; spec_value: string };
type DbPrice = {
  store_name: string;
  store_url: string | null;
  affiliate_url: string | null;
  current_price: number;
  original_price: number | null;
  discount_percent: number | null;
  availability: string;
  last_updated: string | null;
};
type DbProduct = {
  id: string;
  slug: string;
  name: string;
  rating: number;
  image_urls: string[] | null;
  categories: { name: string; slug: string } | null;
  brands: { name: string; slug: string } | null;
  product_specs: DbSpec[];
  product_prices: DbPrice[];
};

// ─── Mappers ───────────────────────────────────────────────────────────────

function mapProduct(raw: DbProduct): Product {
  const specs: Record<string, string> = {};
  for (const s of raw.product_specs ?? []) {
    specs[s.spec_key] = s.spec_value;
  }
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    brand: raw.brands?.name ?? 'Unknown',
    category: raw.categories?.name ?? 'Unknown',
    heroImage: raw.image_urls?.[0] ?? '',
    specs,
    rating: Number(raw.rating),
    popularity: 0, // DB-এ নেই, default 0
  };
}

function mapPrice(raw: DbPrice, productId: string): ProductPrice {
  return {
    productId,
    storeName: raw.store_name as StoreName,
    storeUrl: raw.store_url ?? '#',
    affiliateUrl: raw.affiliate_url ?? '#',
    currentPrice: Number(raw.current_price),
    originalPrice: Number(raw.original_price ?? raw.current_price),
    discountPercent: Number(raw.discount_percent ?? 0),
    availability: (raw.availability === 'in_stock' ? 'in_stock' : 'out_of_stock'),
    lastUpdated: raw.last_updated ?? new Date().toISOString(),
  };
}

// ─── Shared select string ─────────────────────────────────────────────────

const PRODUCT_SELECT = `
  id, slug, name, rating, image_urls,
  categories(name, slug),
  brands(name, slug),
  product_specs(spec_key, spec_value),
  product_prices(store_name, store_url, affiliate_url, current_price, original_price, discount_percent, availability, last_updated)
`.trim();

// ─── Query functions ──────────────────────────────────────────────────────

/** সব প্রোডাক্ট, rating অনুযায়ী সাজানো */
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('rating', { ascending: false });

  if (error) {
    console.error('[db] getAllProducts error:', error.message);
    return [];
  }
  return (data as DbProduct[]).map(mapProduct);
}

/** slug দিয়ে একটি প্রোডাক্ট খোঁজা */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapProduct(data as DbProduct);
}

/** একটি প্রোডাক্টের দামের তালিকা */
export async function getProductPrices(productId: string): Promise<ProductPrice[]> {
  const { data, error } = await supabase
    .from('product_prices')
    .select('store_name, store_url, affiliate_url, current_price, original_price, discount_percent, availability, last_updated')
    .eq('product_id', productId)
    .order('current_price', { ascending: true });

  if (error) {
    console.error('[db] getProductPrices error:', error.message);
    return [];
  }
  return (data as DbPrice[]).map((p) => mapPrice(p, productId));
}

/** ক্যাটাগরির slug দিয়ে প্রোডাক্ট তালিকা */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  // প্রথমে category ID বের করো
  const { data: cat, error: catErr } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .maybeSingle();

  if (catErr || !cat) return [];

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('category_id', cat.id)
    .order('rating', { ascending: false });

  if (error) {
    console.error('[db] getProductsByCategory error:', error.message);
    return [];
  }
  return (data as DbProduct[]).map(mapProduct);
}

/** সার্চ: নাম / ব্র্যান্ড / ক্যাটাগরিতে মেলে এমন প্রোডাক্ট */
export async function searchProducts(q: string): Promise<Product[]> {
  if (!q.trim()) return [];

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .or(
      `name.ilike.%${q}%,brands.name.ilike.%${q}%`
    )
    .limit(20);

  if (error) {
    console.error('[db] searchProducts error:', error.message);
    return [];
  }
  return (data as DbProduct[]).map(mapProduct);
}

/** সব ক্যাটাগরির তালিকা */
export async function getAllCategories(): Promise<{ name: string; slug: string }[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('name, slug')
    .order('name');

  if (error) {
    console.error('[db] getAllCategories error:', error.message);
    return [];
  }
  return data ?? [];
}

/** সব প্রোডাক্টের slug (Static Params-এর জন্য) */
export async function getAllProductSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from('products').select('slug');
  if (error) return [];
  return (data ?? []).map((r) => r.slug);
}

/** সর্বোচ্চ ছাড়ের ডিল — (product + price একসাথে) */
export type DealRow = {
  product: Product;
  price: ProductPrice;
};

export async function getTopDeals(limit = 4): Promise<DealRow[]> {
  const { data, error } = await supabase
    .from('product_prices')
    .select(`
      store_name, store_url, affiliate_url, current_price, original_price, discount_percent, availability, last_updated,
      products!inner(
        id, slug, name, rating, image_urls,
        categories(name, slug),
        brands(name, slug),
        product_specs(spec_key, spec_value),
        product_prices(store_name, store_url, affiliate_url, current_price, original_price, discount_percent, availability, last_updated)
      )
    `)
    .gt('discount_percent', 0)
    .order('discount_percent', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[db] getTopDeals error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    product: mapProduct(row.products as DbProduct),
    price: mapPrice(row as DbPrice, row.products.id),
  }));
}
