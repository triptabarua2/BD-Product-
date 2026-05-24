create table if not exists users(id uuid primary key, email text unique not null, full_name text, created_at timestamptz default now());
create table if not exists categories(id uuid primary key default gen_random_uuid(), name text unique not null, slug text unique not null);
create table if not exists brands(id uuid primary key default gen_random_uuid(), name text unique not null, slug text unique not null);
create table if not exists products(id uuid primary key default gen_random_uuid(), category_id uuid references categories(id), brand_id uuid references brands(id), name text not null, slug text unique not null, description text, image_urls text[], rating numeric(3,2) default 0, created_at timestamptz default now());
create table if not exists product_specs(id uuid primary key default gen_random_uuid(), product_id uuid references products(id) on delete cascade, spec_key text not null, spec_value text not null);
create table if not exists ai_reviews(id uuid primary key default gen_random_uuid(), product_id uuid references products(id) on delete cascade, language text not null, summary text, detailed_review text, pros text[], cons text[], overall_score numeric(3,1), updated_at timestamptz default now());
create table if not exists product_prices(id uuid primary key default gen_random_uuid(), product_id uuid references products(id) on delete cascade, store_name text not null, store_url text, current_price numeric(12,2) not null, original_price numeric(12,2), discount_percent numeric(5,2), availability text not null, affiliate_url text, last_updated timestamptz default now());
create table if not exists price_history(id uuid primary key default gen_random_uuid(), product_id uuid references products(id) on delete cascade, store_name text not null, price numeric(12,2) not null, recorded_at timestamptz default now());
create table if not exists price_alerts(id uuid primary key default gen_random_uuid(), user_id uuid references users(id), product_id uuid references products(id), target_price numeric(12,2), is_active boolean default true);
create table if not exists comments(id uuid primary key default gen_random_uuid(), user_id uuid references users(id), product_id uuid references products(id), content text not null, created_at timestamptz default now());
create table if not exists ratings(id uuid primary key default gen_random_uuid(), user_id uuid references users(id), product_id uuid references products(id), rating int check (rating between 1 and 5));
create table if not exists favorites(id uuid primary key default gen_random_uuid(), user_id uuid references users(id), product_id uuid references products(id), created_at timestamptz default now());
create table if not exists affiliate_links(id uuid primary key default gen_random_uuid(), product_id uuid references products(id), store_name text not null, affiliate_url text not null, commission_rate numeric(5,2));

-- ─── Index (query speed) ──────────────────────────────────────────────────
create index if not exists idx_products_slug        on products(slug);
create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_products_brand_id    on products(brand_id);
create index if not exists idx_product_prices_product_id on product_prices(product_id);
create index if not exists idx_price_history_product_id  on price_history(product_id);

-- ─── Unique constraint ────────────────────────────────────────────────────
alter table ai_reviews
  add constraint if not exists uq_ai_reviews_product_language unique (product_id, language);

-- ─── Unique ratings per user per product ─────────────────────────────────
alter table ratings
  add constraint if not exists uq_ratings_user_product unique (user_id, product_id);
