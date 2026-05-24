import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!q) return NextResponse.json([]);

  const { data, error } = await supabase
    .from('products')
    .select(`
      id, slug, name, rating,
      brands(name),
      categories(name)
    `)
    .ilike('name', `%${q}%`)
    .limit(8);

  if (error) {
    console.error('[api/search] error:', error.message);
    return NextResponse.json([]);
  }

  // UI-friendly format
  interface SearchProduct {
    id: string;
    slug: string;
    name: string;
    rating: number;
    brands: { name: string } | null;
    categories: { name: string } | null;
  }

  // UI-friendly format
  const suggestions = ((data as unknown as SearchProduct[]) ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brands?.name ?? '',
    category: p.categories?.name ?? '',
    rating: p.rating,
  }));

  return NextResponse.json(suggestions);
}
