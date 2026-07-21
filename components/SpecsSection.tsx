"use client";

import { motion } from "framer-motion";
import { PRODUCT } from "@/lib/product";

const SIZE_CHART = [
  { size: "S", chest: "34–36", length: "26" },
  { size: "M", chest: "38–40", length: "27" },
  { size: "L", chest: "42–44", length: "28" },
  { size: "XL", chest: "46–48", length: "29" },
  { size: "XXL", chest: "50–52", length: "30" },
];

export default function SpecsSection() {
  return (
    <section id="specs" className="relative py-24 sm:py-32 px-4 sm:px-6 border-t border-line">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-xs tracking-[0.25em] text-dim uppercase mb-3">
            Fabric &amp; fit
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-8">
            Made to hold, not to hide.
          </h2>

          <dl className="space-y-6">
            <div>
              <dt className="text-xs uppercase tracking-widest text-dim mb-1">
                Composition
              </dt>
              <dd className="text-sm">{PRODUCT.fabric}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-dim mb-1">
                Fit
              </dt>
              <dd className="text-sm">{PRODUCT.fit}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-dim mb-1">
                Care
              </dt>
              <dd className="text-sm">{PRODUCT.care}</dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass rounded-[1.5rem] p-6 sm:p-8"
        >
          <p className="text-xs uppercase tracking-widest text-dim mb-5">
            Sizing chart (inches)
          </p>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-dim text-left">
                <th className="pb-3 font-normal">Size</th>
                <th className="pb-3 font-normal">Chest</th>
                <th className="pb-3 font-normal">Length</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row, i) => (
                <tr key={row.size} className={i !== 0 ? "border-t border-line" : ""}>
                  <td className="py-3">{row.size}</td>
                  <td className="py-3">{row.chest}</td>
                  <td className="py-3">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-dim mt-5">
            Between sizes? The compression fit is meant to sit close — size
            up for a relaxed layer, size true for maximum support.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
