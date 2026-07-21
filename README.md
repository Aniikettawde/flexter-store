# Flexter — Compression Tee Store

A single-product e-commerce site: Next.js 14 (App Router) + Tailwind +
Framer Motion on the front end, Supabase for order storage, Razorpay for
checkout.

## 1. Install

```bash
npm install
```

## 2. Set up Supabase

1. Create a project at supabase.com.
2. Open the SQL editor and run everything in `supabase/schema.sql` — this
   creates the `orders` table.
3. Copy your Project URL, `anon` public key, and `service_role` key from
   Project Settings → API.

## 3. Set up Razorpay

1. Create an account at razorpay.com and grab your **Test Mode** API
   Key ID and Key Secret from Settings → API Keys to develop locally.
   Switch to live keys only once you're ready to accept real payments.
2. No webhook is required for this flow — the client verifies the
   payment signature immediately after checkout via `/api/razorpay/verify`.
   If you want a second, server-side source of truth (recommended before
   going live), add a Razorpay webhook pointing at a new API route that
   listens for the `payment.captured` event.

## 4. Environment variables

Copy `.env.example` to `.env.local` and fill in the values from steps 2–3:

```bash
cp .env.example .env.local
```

## 5. Run locally

```bash
npm run dev
```

Visit http://localhost:3000. Use Razorpay's test card `4111 1111 1111 1111`,
any future expiry, any CVV, to complete a test payment.

## 6. Swap in real product photography (optional)

The product visual is a built-in line-art SVG (`components/TShirtArt.tsx`)
so the site works with zero assets. To use real photos instead:

1. In Supabase, go to Storage → create a bucket named `product-images`,
   set it to public.
2. Upload your photos.
3. Replace `<TShirtArt />` in `components/Hero.tsx`,
   `components/ProductShowcase.tsx`, and `components/CartDrawer.tsx` with a
   Next.js `<Image>` pointing at the public Supabase URL.

## 7. Editing the product

Everything about the single product — name, price, fabric copy, bullets —
lives in one file: `lib/product.ts`. Sizes live in the same file as the
`SIZES` array.

## 8. Deploying

This is a standard Next.js app — deploys cleanly to Vercel:

```bash
vercel
```

Add the same environment variables from `.env.local` to your Vercel
project settings before deploying. Remember to switch `RAZORPAY_KEY_ID` /
`RAZORPAY_KEY_SECRET` / `NEXT_PUBLIC_RAZORPAY_KEY_ID` to your **live** keys
once you're ready to accept real orders.

## Project structure

```
app/
  layout.tsx              Root layout — fonts, nav, cart drawer, checkout modal
  page.tsx                Home page (hero + product + specs + FAQ)
  product/page.tsx         Standalone minimal PDP (for direct links / ads)
  checkout/success/page.tsx Post-payment confirmation
  api/razorpay/order       Creates a Razorpay order + pending Supabase row
  api/razorpay/verify      Verifies payment signature, marks order paid
components/                All UI: Hero, ProductShowcase, CartDrawer, etc.
lib/
  product.ts               Single source of truth for the one product
  cart-store.ts             Zustand cart (persisted to localStorage)
  checkout-store.ts         Controls the shipping/checkout modal
  razorpay-client.ts        Browser-side Razorpay Checkout loader
  supabase.ts                Browser + service-role Supabase clients
supabase/schema.sql         Run once in the Supabase SQL editor
```
