"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCT, type Size } from "./product";

export type CartLine = {
  size: Size;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (size: Size, qty?: number) => void;
  updateQty: (size: Size, qty: number) => void;
  removeLine: (size: Size) => void;
  clearCart: () => void;
  totalQty: () => number;
  totalAmount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isDrawerOpen: false,
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      addToCart: (size, qty = 1) => {
        const lines = [...get().lines];
        const existing = lines.find((l) => l.size === size);
        if (existing) {
          existing.qty += qty;
        } else {
          lines.push({ size, qty });
        }
        set({ lines, isDrawerOpen: true });
      },
      updateQty: (size, qty) => {
        if (qty <= 0) {
          get().removeLine(size);
          return;
        }
        set({
          lines: get().lines.map((l) => (l.size === size ? { ...l, qty } : l)),
        });
      },
      removeLine: (size) => {
        set({ lines: get().lines.filter((l) => l.size !== size) });
      },
      clearCart: () => set({ lines: [] }),
      totalQty: () => get().lines.reduce((sum, l) => sum + l.qty, 0),
      totalAmount: () =>
        get().lines.reduce((sum, l) => sum + l.qty * PRODUCT.price, 0),
    }),
    { name: "flexter-cart" }
  )
);
