-- Run this once in the Supabase SQL editor.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  razorpay_order_id text not null,
  razorpay_payment_id text,
  razorpay_signature text,
  status text not null default 'created', -- created | paid | failed
  amount integer not null,               -- amount in paise
  currency text not null default 'INR',
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null,
  items jsonb not null,                  -- [{ size, qty, price }]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Orders are written only by the server (service role key), never directly
-- from the browser, so no public insert/select policy is defined here.
-- The service role key bypasses RLS by design.

create index if not exists orders_razorpay_order_id_idx
  on public.orders (razorpay_order_id);

-- Optional: storage bucket for product photography if you want to swap
-- the built-in line-art illustration for real product photos.
-- Create a bucket named "product-images" from the Supabase Storage tab,
-- make it public, then reference the public URL from lib/products.ts.
