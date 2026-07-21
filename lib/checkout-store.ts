"use client";

import { create } from "zustand";
import type { CartLine } from "./cart-store";

type CheckoutState = {
  isOpen: boolean;
  lines: CartLine[];
  open: (lines: CartLine[]) => void;
  close: () => void;
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  isOpen: false,
  lines: [],
  open: (lines) => set({ isOpen: true, lines }),
  close: () => set({ isOpen: false }),
}));
