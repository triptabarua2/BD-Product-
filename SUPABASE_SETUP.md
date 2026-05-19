# Supabase Integration Guide

This document outlines the Supabase integration for the BD Product application.

## Project Details

- **Project Name**: BD Product
- **Project ID**: zjwqpetdvyfyjojvemam
- **Region**: ap-northeast-1 (Tokyo)
- **Status**: ACTIVE_HEALTHY
- **Database**: PostgreSQL 17.6.1

## API Credentials

- **Supabase URL**: https://zjwqpetdvyfyjojvemam.supabase.co
- **Publishable Key**: sb_publishable_5Nc1m09m-wJfCPUAk83ykg_5lOnkHC5
- **Anon Key**: (See .env.local)

## Environment Setup

### 1. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://zjwqpetdvyfyjojvemam.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

The `.env.local` file has already been created with the necessary Supabase credentials.

### 2. Database Schema

The following tables have been created in Supabase:

#### Core Tables
- **users**: User authentication and profiles
- **categories**: Product categories
- **brands**: Product brands
- **products**: Main product information

#### Product Details
- **product_specs**: Product specifications
- **product_prices**: Current prices from different stores
- **price_history**: Historical price tracking
- **affiliate_links**: Affiliate URLs for products

#### User Features
- **ai_reviews**: AI-generated product reviews
- **favorites**: User favorite products
- **price_alerts**: Price alert subscriptions
- **comments**: User comments on products
- **ratings**: User product ratings

## Installation

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Seed Database

To populate the database with initial data:

```bash
npm run db:seed-supabase
```

This will insert sample categories, brands, products, and prices.

## Usage

### Importing Supabase Client

```typescript
import { supabase } from '@/lib/supabase';
```

### Using Helper Functions

The `lib/supabase.ts` file provides helper functions for common operations:

```typescript
// Get all products
const products = await getProducts();

// Get product by slug
const product = await getProductBySlug('samsung-galaxy-a55');

// Get product prices
const prices = await getProductPrices(productId);

// Get categories
const categories = await getCategories();

// Get AI review
const review = await getAIReview(productId, 'en');

// Manage favorites
await addFavorite(userId, productId);
await removeFavorite(userId, productId);
const favorites = await getFavorites(userId);

// Price alerts
await addPriceAlert(userId, productId, targetPrice);
const alerts = await getPriceAlerts(userId);

// Comments
await addComment(userId, productId, 'Great product!');
const comments = await getComments(productId);

// Ratings
await addRating(userId, productId, 5);
const ratings = await getRatings(productId);
```

## API Routes

### Search API
- **Endpoint**: `/api/search`
- **Method**: GET/POST
- **Description**: Search products by name or category

### Reviews API
- **Endpoint**: `/api/reviews`
- **Method**: GET/POST
- **Description**: Get or create product reviews

### Price Updates API
- **Endpoint**: `/api/prices/update`
- **Method**: POST
- **Description**: Update product prices (scheduled task)

## Database Maintenance

### Backup
Regular backups are automatically handled by Supabase. Access backups through the Supabase dashboard.

### Monitoring
Monitor database performance and logs through:
1. Supabase Dashboard > Project > Database
2. Check query performance and connection stats

### Row Level Security (RLS)

For production, enable Row Level Security policies:

```sql
-- Example: Users can only see their own data
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Troubleshooting

### Connection Issues
1. Verify environment variables are correctly set
2. Check Supabase project status in dashboard
3. Ensure IP is whitelisted (if applicable)

### Query Errors
1. Check table names and column names match schema
2. Verify foreign key relationships
3. Review Supabase logs: Dashboard > Project > Logs

### Performance Issues
1. Add indexes to frequently queried columns
2. Optimize queries to reduce data fetched
3. Use pagination for large result sets

## Next Steps

1. **Authentication**: Implement Supabase Auth for user management
2. **RLS Policies**: Set up Row Level Security for data protection
3. **Edge Functions**: Deploy serverless functions for backend logic
4. **Realtime**: Enable Supabase Realtime for live updates
5. **Storage**: Set up Supabase Storage for product images

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Integration](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
