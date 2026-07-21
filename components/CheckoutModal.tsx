"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCheckoutStore } from "@/lib/checkout-store";
import { useCartStore } from "@/lib/cart-store";
import { PRODUCT } from "@/lib/product";
import { startRazorpayCheckout } from "@/lib/razorpay-client";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CheckoutModal() {
  const { isOpen, lines, close } = useCheckoutStore();
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const amount = lines.reduce((sum, l) => sum + l.qty * PRODUCT.price, 0);

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await startRazorpayCheckout({
        items: lines.map((l) => ({ size: l.size, qty: l.qty, price: PRODUCT.price })),
        customer: form,
        onSuccess: () => {
          clearCart();
          close();
          setForm(emptyForm);
          router.push("/checkout/success");
        },
        onDismiss: () => setSubmitting(false),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[100] w-full sm:max-w-md sm:rounded-[1.75rem] glass-strong max-h-[92dvh] overflow-y-auto"
            role="dialog"
            aria-label="Shipping details"
          >
            <div className="sticky top-0 glass-strong flex items-center justify-between px-5 sm:px-6 h-16 border-b border-line z-10">
              <h2 className="font-display font-bold text-sm tracking-wide">
                SHIPPING DETAILS
              </h2>
              <button
                onClick={close}
                aria-label="Close"
                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-6 space-y-4">
              <div className="flex items-center justify-between text-sm pb-2">
                <span className="text-dim">
                  {lines.reduce((s, l) => s + l.qty, 0)} item(s)
                </span>
                <span className="font-mono">₹{amount.toLocaleString("en-IN")}</span>
              </div>

              <Field label="Full name" value={form.name} onChange={handleChange("name")} required />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Email" type="email" value={form.email} onChange={handleChange("email")} required />
                <Field label="Phone" type="tel" value={form.phone} onChange={handleChange("phone")} required />
              </div>
              <Field label="Address" value={form.address} onChange={handleChange("address")} required />
              <div className="grid grid-cols-3 gap-3">
                <Field label="City" value={form.city} onChange={handleChange("city")} required />
                <Field label="State" value={form.state} onChange={handleChange("state")} required />
                <Field label="Pincode" value={form.pincode} onChange={handleChange("pincode")} required />
              </div>

              <button
                type="submit"
                disabled={submitting || lines.length === 0}
                className="w-full h-14 rounded-full bg-paper text-ink font-medium text-sm tracking-wide hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? "Opening payment…" : `Pay ₹${amount.toLocaleString("en-IN")}`}
              </button>
              <p className="text-[11px] text-dim text-center pb-2">
                Payments are processed securely by Razorpay. By paying, you
                agree to our{" "}
                <a href="/terms-of-service" className="underline underline-offset-4 hover:text-paper">
                  Terms
                </a>{" "}
                and{" "}
                <a href="/refund-policy" className="underline underline-offset-4 hover:text-paper">
                  Refund Policy
                </a>
                .
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-widest text-dim mb-1.5">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full h-11 rounded-xl bg-white/[0.04] border border-line px-3.5 text-sm focus:border-paper/40 outline-none transition-colors"
      />
    </label>
  );
}
