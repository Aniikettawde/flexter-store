"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Check } from "lucide-react";
import TShirtArt from "./TShirtArt";
import { PRODUCT, SIZES, type Size } from "@/lib/product";
import { useCartStore } from "@/lib/cart-store";
import { useCheckoutStore } from "@/lib/checkout-store";

export default function ProductShowcase() {
  const [size, setSize] = useState<Size>("M");
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const addToCart = useCartStore((s) => s.addToCart);
  const openCheckout = useCheckoutStore((s) => s.open);

  const handleAddToCart = () => {
    addToCart(size, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBuyNow = () => {
    openCheckout([{ size, qty }]);
  };

  return (
    <section id="product" className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:sticky lg:top-28"
        >
          <div className="glass rounded-[2rem] p-8 sm:p-12 max-w-sm mx-auto lg:mx-0">
            <TShirtArt className="w-full h-auto" />
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
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3">
            {PRODUCT.name}
          </h2>
          <p className="text-dim mt-1">{PRODUCT.colorway}</p>

          <p className="font-mono text-2xl sm:text-3xl mt-6">
            ₹{PRODUCT.price.toLocaleString("en-IN")}
          </p>

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
          <div>
            <p className="text-xs uppercase tracking-widest text-dim mb-3">
              Size
            </p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`h-11 min-w-[2.75rem] px-3 rounded-full border text-sm font-medium transition-all ${
                    size === s
                      ? "bg-paper text-ink border-paper"
                      : "border-line text-paper hover:border-paper/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
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
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                aria-label="Increase quantity"
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Actions — hidden on mobile, replaced by sticky BuyBar */}
          <div className="hidden sm:flex gap-3 mt-10">
            <button
              onClick={handleAddToCart}
              className="flex-1 h-14 rounded-full border border-line hover:border-paper/50 font-medium text-sm tracking-wide transition-colors relative overflow-hidden"
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
              className="flex-1 h-14 rounded-full bg-paper text-ink hover:bg-white font-medium text-sm tracking-wide transition-colors"
            >
              Buy now
            </button>
          </div>

          <p className="text-xs text-dim mt-5 pb-24 sm:pb-0">
            Free shipping across India · Cash on delivery not available ·
            Ships in 2–4 business days
          </p>
        </motion.div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 glass-strong px-4 py-3 flex items-center gap-3">
        <div className="shrink-0 font-mono text-sm">
          ₹{(PRODUCT.price * qty).toLocaleString("en-IN")}
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 h-12 rounded-full border border-line font-medium text-sm active:scale-[0.97] transition-transform"
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
          className="flex-1 h-12 rounded-full bg-paper text-ink font-medium text-sm active:scale-[0.97] transition-transform"
        >
          Buy now
        </button>
      </div>
    </section>
  );
}
