"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Check, Share2 } from "lucide-react";
import TShirtArt from "./TShirtArt";
import { PRODUCT, SIZES, type Size } from "@/lib/product";
import { useCartStore } from "@/lib/cart-store";
import { useCheckoutStore } from "@/lib/checkout-store";
import ProductGallery from "./ProductGallery";

// TODO: once confirmed, update PRODUCT.price in lib/product.ts to 699 so
// cart/checkout totals match this sale price. This constant only drives
// the display here — the strike-through MRP is kept separate.
const SALE_PRICE = 699;
const MRP = 1499;

const SALE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function useCountdown() {
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    const storageKey = "flexter-sale-end";
    let endsAt = Number(localStorage.getItem(storageKey));
    if (!endsAt || endsAt < Date.now()) {
      endsAt = Date.now() + SALE_DURATION_MS;
      localStorage.setItem(storageKey, String(endsAt));
    }

    const tick = () => setMsLeft(Math.max(0, endsAt - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (msLeft === null) return null;

  const totalSeconds = Math.floor(msLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export default function ProductShowcase() {
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const countdown = useCountdown();

  const addToCart = useCartStore((s) => s.addToCart);
  const openCheckout = useCheckoutStore((s) => s.open);

  const [inventory, setInventory] = useState<Record<Size, number> | null>(null);

  useEffect(() => {
    fetch("/api/inventory")
      .then((r) => r.json())
      .then((d) => setInventory(d.inventory))
      .catch(() => setInventory(null));
  }, []);

  const stockFor = (s: Size | null) => (s ? inventory?.[s] ?? 0 : 0);

  const requireSize = () => {
    if (!size) {
      setSizeError(true);
      // scroll the size selector into view so the prompt is visible
      document
        .getElementById("size-selector")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setSizeError(false), 1600);
      return false;
    }
    return true;
  };

  const handleSelectSize = (s: Size) => {
    setSize(s);
    setSizeError(false);
    setQty(1);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${PRODUCT.name} — Flexter`,
      text: `${PRODUCT.name} · ₹${SALE_PRICE.toLocaleString("en-IN")} (was ₹${MRP.toLocaleString("en-IN")})`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 1600);
      }
    } catch {
      // user cancelled the native share sheet — nothing to do
    }
  };

  const handleAddToCart = () => {
    if (!requireSize()) return;
    if (stockFor(size) === 0) return;
    addToCart(size!, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (!requireSize()) return;
    if (stockFor(size) === 0) return;
    openCheckout([{ size: size!, qty }]);
  };

  return (
    <section id="product" className="relative pt-24 pb-0 sm:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:sticky lg:top-28"
        >
          <div className="max-w-sm mx-auto lg:mx-0">
            <ProductGallery images={PRODUCT.images} alt={PRODUCT.name} />
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-xs tracking-[0.25em] text-dim uppercase">
            {PRODUCT.sku}
          </p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3">
                {PRODUCT.name}
              </h2>
              <p className="text-dim mt-1">{PRODUCT.colorway}</p>
            </div>
            <button
              onClick={handleShare}
              aria-label="Share this product"
              className="relative shrink-0 h-10 w-10 mt-3 flex items-center justify-center rounded-full border border-line hover:border-paper/40 transition-colors"
            >
              <Share2 className="h-4 w-4" strokeWidth={1.6} />
              {shareCopied && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 right-0 text-[11px] font-mono bg-paper text-ink px-2 py-1 rounded-full whitespace-nowrap"
                >
                  Link copied
                </motion.span>
              )}
            </button>
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <p className="font-mono text-2xl sm:text-3xl">
              ₹{SALE_PRICE.toLocaleString("en-IN")}
            </p>
            <p className="font-mono text-base sm:text-lg text-dim line-through">
              ₹{MRP.toLocaleString("en-IN")}
            </p>
            <p className="text-xs font-medium text-emerald-400">
              {Math.round(((MRP - SALE_PRICE) / MRP) * 100)}% off
            </p>
          </div>

          <p className="text-dim mt-6 leading-relaxed max-w-md">
            {PRODUCT.description}
          </p>

          <div className="hairline my-8" />

          <ul className="space-y-3">
            {PRODUCT.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 h-1 w-4 bg-paper/30 rounded-full shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="hairline my-8" />

          {/* Size selector */}
          <div id="size-selector">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest text-dim">
                Size
              </p>
              {sizeError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400"
                >
                  Please select a size
                </motion.p>
              )}
            </div>
            <motion.div
              animate={sizeError ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {SIZES.map((s) => {
                const outOfStock = inventory !== null && stockFor(s) === 0;
                return (
                  <button
                    key={s}
                    onClick={() => !outOfStock && handleSelectSize(s)}
                    disabled={outOfStock}
                    aria-pressed={size === s}
                    className={`h-11 min-w-[2.75rem] px-3 rounded-full border text-sm font-medium transition-all ${
                      outOfStock
                        ? "opacity-30 cursor-not-allowed border-line text-paper"
                        : size === s
                        ? "bg-paper text-ink border-paper"
                        : sizeError
                        ? "border-red-400/60 text-paper"
                        : "border-line text-paper hover:border-paper/50"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </motion.div>
            {size && (
              <p className="text-xs text-dim mt-2.5">
                {stockFor(size) > 0
                  ? `${stockFor(size)} in stock in size ${size}`
                  : `Out of stock in size ${size}`}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest text-dim mb-3">
              Quantity
            </p>
            <div className="inline-flex items-center gap-4 border border-line rounded-full px-2 py-1.5">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono w-4 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(stockFor(size), q + 1))}
                aria-label="Increase quantity"
                disabled={!size || qty >= stockFor(size)}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Actions — hidden on mobile, replaced by sticky BuyBar */}
          <div className="hidden sm:flex gap-3 mt-10">
            <button
              onClick={handleAddToCart}
              disabled={!!size && stockFor(size) === 0}
              className="flex-1 h-14 rounded-full border border-line hover:border-paper/50 font-medium text-sm tracking-wide transition-colors relative overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {justAdded ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" /> Added to bag
                </span>
              ) : (
                "Add to bag"
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!!size && stockFor(size) === 0}
              className="flex-1 h-14 rounded-full bg-paper text-ink hover:bg-white font-medium text-sm tracking-wide transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Buy now
            </button>
          </div>

          <p className="text-xs text-dim mt-5 pb-32 sm:pb-0">
             Cash on delivery
            available In Pune Only· Ships in 2–4 business days
          </p>
        </motion.div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40">
        {countdown && (
          <div className="glass-strong border-b border-line px-4 py-1.5 flex items-center justify-center gap-1.5 text-[11px] text-dim">
            <span>Sale ends in</span>
            <span className="font-mono text-paper tabular-nums">
              {countdown.days}d {String(countdown.hours).padStart(2, "0")}h{" "}
              {String(countdown.minutes).padStart(2, "0")}m{" "}
              {String(countdown.seconds).padStart(2, "0")}s
            </span>
          </div>
        )}
        <div className="glass-strong px-4 py-3 flex items-center gap-3">
          <div className="shrink-0 font-mono text-sm">
            ₹{(SALE_PRICE * qty).toLocaleString("en-IN")}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!!size && stockFor(size) === 0}
            className="flex-1 h-12 rounded-full border border-line font-medium text-sm active:scale-[0.97] transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {justAdded ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4" /> Added
              </span>
            ) : (
              "Add to bag"
            )}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!!size && stockFor(size) === 0}
            className="flex-1 h-12 rounded-full bg-paper text-ink font-medium text-sm active:scale-[0.97] transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Buy now
          </button>
        </div>
      </div>
    </section>
  );
}