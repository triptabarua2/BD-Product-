import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common database operations
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getProductPrices(productId: string) {
  const { data, error } = await supabase
    .from('product_prices')
    .select('*')
    .eq('product_id', productId);
  
  if (error) throw error;
  return data;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function getBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function getProductSpecs(productId: string) {
  const { data, error } = await supabase
    .from('product_specs')
    .select('*')
    .eq('product_id', productId);
  
  if (error) throw error;
  return data;
}

export async function getAIReview(productId: string, language: string = 'en') {
  const { data, error } = await supabase
    .from('ai_reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('language', language)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

export async function addFavorite(userId: string, productId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, product_id: productId }]);
  
  if (error) throw error;
  return data;
}

export async function removeFavorite(userId: string, productId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  
  if (error) throw error;
}

export async function addPriceAlert(userId: string, productId: string, targetPrice: number) {
  const { data, error } = await supabase
    .from('price_alerts')
    .insert([{ user_id: userId, product_id: productId, target_price: targetPrice }]);
  
  if (error) throw error;
  return data;
}

export async function getPriceAlerts(userId: string) {
  const { data, error } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);
  
  if (error) throw error;
  return data;
}

export async function addComment(userId: string, productId: string, content: string) {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ user_id: userId, product_id: productId, content }]);
  
  if (error) throw error;
  return data;
}

export async function getComments(productId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function addRating(userId: string, productId: string, rating: number) {
  const { data, error } = await supabase
    .from('ratings')
    .insert([{ user_id: userId, product_id: productId, rating }]);
  
  if (error) throw error;
  return data;
}

export async function getRatings(productId: string) {
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('product_id', productId);
  
  if (error) throw error;
  return data;
}
