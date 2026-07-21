"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useCheckoutStore } from "@/lib/checkout-store";
import { PRODUCT } from "@/lib/product";
import TShirtArt from "./TShirtArt";

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, lines, updateQty, totalAmount } =
    useCartStore();
  const openCheckout = useCheckoutStore((s) => s.open);

  const handleCheckout = () => {
    closeDrawer();
    openCheckout(lines);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[80] h-[100dvh] w-full max-w-sm glass-strong flex flex-col"
            role="dialog"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between px-5 sm:px-6 h-16 border-b border-line shrink-0">
              <h2 className="font-display font-bold text-sm tracking-wide">
                YOUR BAG
              </h2>
              <button
                onClick={closeDrawer}
                aria-label="Close bag"
                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6">
              {lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-dim">
                  <ShoppingBag className="h-8 w-8" strokeWidth={1.3} />
                  <p className="text-sm">Your bag is empty.</p>
                  <a
                    href="#product"
                    onClick={closeDrawer}
                    className="text-xs underline underline-offset-4 hover:text-paper"
                  >
                    Go to the tee
                  </a>
                </div>
              ) : (
                <ul className="space-y-5">
                  {lines.map((line) => (
                    <li key={line.size} className="flex gap-4">
                      <div className="h-20 w-20 shrink-0 rounded-xl glass p-2">
                        <TShirtArt className="w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{PRODUCT.name}</p>
                        <p className="text-xs text-dim mt-0.5">
                          Size {line.size}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="inline-flex items-center gap-3 border border-line rounded-full px-1.5 py-1">
                            <button
                              onClick={() => updateQty(line.size, line.qty - 1)}
                              aria-label="Decrease quantity"
                              className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-white/5"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-mono text-xs w-3 text-center">
                              {line.qty}
                            </span>
                            <button
                              onClick={() => updateQty(line.size, line.qty + 1)}
                              aria-label="Increase quantity"
                              className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-white/5"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="font-mono text-sm">
                            ₹{(PRODUCT.price * line.qty).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="px-5 sm:px-6 py-5 border-t border-line shrink-0">
                <div className="flex items-center justify-between mb-4 text-sm">
                  <span className="text-dim">Subtotal</span>
                  <span className="font-mono">
                    ₹{totalAmount().toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full h-13 sm:h-12 rounded-full bg-paper text-ink font-medium text-sm py-3.5 hover:bg-white transition-colors"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
