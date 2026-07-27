"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "How long does shipping take?",
    a: "Orders ship within 2–4 business days and typically arrive within a week, depending on your pin code.",
  },
  {
    q: "What if the size doesn't fit?",
    a: "Unworn tees with tags attached can be exchanged for a different size within 7 days of delivery.",
  },
  {
    q: "Is cash on delivery available?",
    a: "Yes — for Pune addresses (pincodes starting with 411) you can pay online via Razorpay or choose cash on delivery at checkout.",
  },
  {
    q: "Do you deliver outside Pune?",
    a: "Not yet. We currently ship only within Pune (pincodes starting with 411) — we're working on expanding soon.",
  },
  {
    q: "Do you restock sizes?",
    a: "Yes. Each size is produced in small batches, so a sold-out size usually returns within a few weeks.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32 px-4 sm:px-6 border-t border-line">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs tracking-[0.25em] text-dim uppercase mb-3">
          Shipping &amp; returns
        </p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-10">
          Good to know.
        </h2>

        <div className="divide-y divide-line border-y border-line">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between py-5 text-left gap-4"
                >
                  <span className="font-medium text-sm sm:text-base">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 text-dim"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-dim pb-5 max-w-md">{f.a}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}