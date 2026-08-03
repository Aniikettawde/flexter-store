"use client";

import { useState, useRef } from "react";
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

const COD_CHARGE = 50;


// We currently only ship out of Pune — every serviceable pincode starts with 411.
const isServiceablePincode = (pincode: string) => /^411\d{3}$/.test(pincode.trim());

type PaymentMethod = "prepaid" | "cod";

function successUrl(method: PaymentMethod, orderNumber?: string | null) {
  const qp = new URLSearchParams({ method });
  if (orderNumber) qp.set("order", orderNumber);
  return `/checkout/success?${qp.toString()}`;
}

export default function CheckoutModal() {
  const { isOpen, lines, close } = useCheckoutStore();
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [pincodeError, setPincodeError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("prepaid");
  // Synchronous guard — React state updates aren't immediate, so a fast
  // double-click/tap could fire handleSubmit twice before `submitting`
  // re-renders. This ref blocks the second call the instant it happens.
  const isSubmittingRef = useRef(false);

  const amount = lines.reduce((sum, l) => sum + l.qty * PRODUCT.price, 0);
  const codCharge = paymentMethod === "cod" ? COD_CHARGE : 0;
  const totalAmount = amount + codCharge;

  // Pincode restriction only applies to COD — prepaid ships pan-India.
  const pincodeValid = paymentMethod === "cod" ? isServiceablePincode(form.pincode) : true;

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "pincode") setPincodeError(false);
  };

 const handlePincodeBlur = () => {
    if (paymentMethod === "cod" && form.pincode.trim().length > 0) {
      setPincodeError(!isServiceablePincode(form.pincode));
    }
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current) return;
    if (paymentMethod === "cod" && !pincodeValid) {
      setPincodeError(true);
      document
        .getElementById("pincode-field")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    isSubmittingRef.current = true;
    setSubmitting(true);
    try {
      if (paymentMethod === "cod") {
       const res = await fetch("/api/orders/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: lines.map((l) => ({ size: l.size, qty: l.qty, price: PRODUCT.price })),
            customer: form,
            amount: totalAmount,
          }),
        });
        if (!res.ok) throw new Error("Failed to place COD order");
        const data = await res.json().catch(() => ({}));
        clearCart();
        close();
        setForm(emptyForm);
        router.push(successUrl("cod", data?.order?.order_number));
      } else {
        await startRazorpayCheckout({
          items: lines.map((l) => ({ size: l.size, qty: l.qty, price: PRODUCT.price })),
          customer: form,
          onSuccess: (orderNumber) => {
            clearCart();
            close();
            setForm(emptyForm);
            router.push(successUrl("prepaid", orderNumber));
          },
          onDismiss: () => {
            setSubmitting(false);
            isSubmittingRef.current = false;
          },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
      isSubmittingRef.current = false;
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
             <p className="text-xs text-dim bg-white/[0.03] border border-line rounded-xl px-3.5 py-2.5">
                Prepaid orders ship anywhere in India. Cash on delivery is
                currently available only within Pune (pincodes starting with 411).
              </p>

              <Field label="Full name" value={form.name} onChange={handleChange("name")} required />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Email" type="email" value={form.email} onChange={handleChange("email")} required />
                <Field label="Phone" type="tel" value={form.phone} onChange={handleChange("phone")} required />
              </div>
              <Field label="Address" value={form.address} onChange={handleChange("address")} required />
              <div className="grid grid-cols-3 gap-3">
                <Field label="City" value={form.city} onChange={handleChange("city")} required />
                <Field label="State" value={form.state} onChange={handleChange("state")} required />
                <div id="pincode-field">
                  <Field
                    label="Pincode"
                    value={form.pincode}
                    onChange={handleChange("pincode")}
                    onBlur={handlePincodeBlur}
                    required
                    error={pincodeError}
                    inputMode="numeric"
                    maxLength={6}
                  />
                </div>
              </div>
                {pincodeError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 -mt-2"
                >
                  Cash on delivery isn't available here yet — COD only ships
                  within Pune (pincode must start with 411). Switch to
                  "Pay online" to ship to this address.
                </motion.p>
              )}

              <div>
                <p className="text-xs uppercase tracking-widest text-dim mb-2 mt-2">
                  Payment method
                </p>
                <div className="grid grid-cols-2 gap-3">
                   <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("prepaid");
                      setPincodeError(false);
                    }}
                    aria-pressed={paymentMethod === "prepaid"}
                    className={`h-12 rounded-xl border text-sm font-medium transition-colors ${
                      paymentMethod === "prepaid"
                        ? "bg-paper text-ink border-paper"
                        : "border-line text-paper hover:border-paper/50"
                    }`}
                  >
                    Pay online
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    aria-pressed={paymentMethod === "cod"}
                    className={`h-12 rounded-xl border text-sm font-medium transition-colors ${
                      paymentMethod === "cod"
                        ? "bg-paper text-ink border-paper"
                        : "border-line text-paper hover:border-paper/50"
                    }`}
                  >
                    Cash on delivery
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-line space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dim">
                    {lines.reduce((s, l) => s + l.qty, 0)} item(s)
                  </span>
                  <span className="font-mono">₹{amount.toLocaleString("en-IN")}</span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex items-center justify-between text-xs text-dim">
                    <span>COD charges</span>
                    <span className="font-mono">₹{COD_CHARGE}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm font-medium pt-1">
                  <span>Total</span>
                  <span className="font-mono">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

             <button
                type="submit"
                disabled={submitting || lines.length === 0 || (paymentMethod === "cod" && !pincodeValid)}
                className="w-full h-14 rounded-full bg-paper text-ink font-medium text-sm tracking-wide hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                {submitting
                  ? paymentMethod === "cod"
                    ? "Placing order…"
                    : "Opening payment…"
                  : paymentMethod === "cod" && !pincodeValid
                  ? "Enter a valid Pune pincode for COD"
                  : paymentMethod === "cod"
                  ? `Place order · Pay ₹${totalAmount.toLocaleString("en-IN")} on delivery`
                  : `Pay ₹${amount.toLocaleString("en-IN")}`}
              </button>
              <p className="text-[11px] text-dim text-center pb-2">
                {paymentMethod === "cod"
                  ? "Cash on delivery orders are confirmed by our team before dispatch."
                  : "Payments are processed securely by Razorpay."}{" "}
                By ordering, you agree to our{" "}
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
  onBlur,
  type = "text",
  required = false,
  error = false,
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  type?: string;
  required?: boolean;
  error?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
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
        onBlur={onBlur}
        required={required}
        inputMode={inputMode}
        maxLength={maxLength}
        className={`w-full h-11 rounded-xl bg-white/[0.04] border px-3.5 text-sm outline-none transition-colors ${
          error
            ? "border-red-400/60 focus:border-red-400"
            : "border-line focus:border-paper/40"
        }`}
      />
    </label>
  );
}