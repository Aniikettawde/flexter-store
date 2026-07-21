"use client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

let scriptPromise: Promise<boolean> | null = null;

function loadRazorpayScript(): Promise<boolean> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export type CheckoutItem = {
  size: string;
  qty: number;
  price: number;
};

export type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export async function startRazorpayCheckout(opts: {
  items: CheckoutItem[];
  customer: CustomerDetails;
  onSuccess: () => void;
  onDismiss?: () => void;
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("Couldn't load the payment gateway. Check your connection and try again.");
    return;
  }

  const orderRes = await fetch("/api/razorpay/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: opts.items, customer: opts.customer }),
  });

  if (!orderRes.ok) {
    const err = await orderRes.json().catch(() => ({}));
    alert(err?.message || "Couldn't start checkout. Please try again.");
    return;
  }

  const order = await orderRes.json();

  const rzp = new window.Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "Flexter",
    description: "Compression Tee — Order",
    order_id: order.id,
    prefill: {
      name: opts.customer.name,
      email: opts.customer.email,
      contact: opts.customer.phone,
    },
    theme: { color: "#0a0a0b" },
    handler: async function (response: any) {
      const verifyRes = await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });
      if (verifyRes.ok) {
        opts.onSuccess();
      } else {
        alert("Payment could not be verified. If money was deducted, it will be refunded automatically.");
      }
    },
    modal: {
      ondismiss: () => {
        opts.onDismiss?.();
      },
    },
  });

  rzp.on("payment.failed", function (resp: any) {
    alert("Payment failed: " + (resp?.error?.description || "please try again."));
  });

  rzp.open();
}
