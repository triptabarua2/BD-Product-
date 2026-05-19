import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed categories
    const categories = [
      { name: 'Mobile Phones', slug: 'mobile-phones' },
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Tablets', slug: 'tablets' },
      { name: 'Headphones', slug: 'headphones' },
      { name: 'Cameras', slug: 'cameras' },
      { name: 'Smart Watches', slug: 'smart-watches' },
      { name: 'Home Appliances', slug: 'home-appliances' },
      { name: 'Kitchen Appliances', slug: 'kitchen-appliances' },
      { name: 'Beauty Products', slug: 'beauty-products' },
      { name: 'Health Products', slug: 'health-products' },
    ];

    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .insert(categories)
      .select();

    if (categoryError) throw categoryError;
    console.log(`✓ Seeded ${categoryData.length} categories`);

    // Seed brands
    const brands = [
      { name: 'Samsung', slug: 'samsung' },
      { name: 'Apple', slug: 'apple' },
      { name: 'Xiaomi', slug: 'xiaomi' },
      { name: 'Asus', slug: 'asus' },
      { name: 'Dell', slug: 'dell' },
      { name: 'Sony', slug: 'sony' },
      { name: 'LG', slug: 'lg' },
      { name: 'Walton', slug: 'walton' },
    ];

    const { data: brandData, error: brandError } = await supabase
      .from('brands')
      .insert(brands)
      .select();

    if (brandError) throw brandError;
    console.log(`✓ Seeded ${brandData.length} brands`);

    // Seed products
    const products = [
      {
        name: 'Samsung Galaxy A55',
        slug: 'samsung-galaxy-a55',
        category_id: categoryData[0].id,
        brand_id: brandData[0].id,
        description: 'Latest Samsung Galaxy A55 with advanced features',
        image_urls: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97'],
        rating: 4.5,
      },
      {
        name: 'Xiaomi Redmi Note 13 Pro',
        slug: 'xiaomi-redmi-note-13-pro',
        category_id: categoryData[0].id,
        brand_id: brandData[2].id,
        description: 'Powerful Xiaomi Redmi Note 13 Pro smartphone',
        image_urls: ['https://images.unsplash.com/photo-1585060544812-6b45742d762f'],
        rating: 4.4,
      },
      {
        name: 'Asus Vivobook 15',
        slug: 'asus-vivobook-15',
        category_id: categoryData[1].id,
        brand_id: brandData[3].id,
        description: 'Lightweight and powerful Asus Vivobook 15 laptop',
        image_urls: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45'],
        rating: 4.3,
      },
    ];

    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert(products)
      .select();

    if (productError) throw productError;
    console.log(`✓ Seeded ${productData.length} products`);

    // Seed product prices
    const prices = [
      {
        product_id: productData[0].id,
        store_name: 'Daraz Bangladesh',
        store_url: 'https://daraz.com.bd',
        current_price: 54999,
        original_price: 59999,
        discount_percent: 8.3,
        availability: 'in_stock',
      },
      {
        product_id: productData[0].id,
        store_name: 'Star Tech',
        store_url: 'https://startech.com.bd',
        current_price: 55990,
        original_price: 59999,
        discount_percent: 6.7,
        availability: 'in_stock',
      },
      {
        product_id: productData[1].id,
        store_name: 'Pickaboo',
        store_url: 'https://pickaboo.com',
        current_price: 38999,
        original_price: 42999,
        discount_percent: 9.3,
        availability: 'in_stock',
      },
      {
        product_id: productData[2].id,
        store_name: 'Ryans Computers',
        store_url: 'https://ryans.com',
        current_price: 78999,
        original_price: 85999,
        discount_percent: 8.1,
        availability: 'in_stock',
      },
    ];

    const { data: priceData, error: priceError } = await supabase
      .from('product_prices')
      .insert(prices)
      .select();

    if (priceError) throw priceError;
    console.log(`✓ Seeded ${priceData.length} product prices`);

    console.log('✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
