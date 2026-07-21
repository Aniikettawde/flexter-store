"use client";

import { motion } from "framer-motion";

/**
 * A stack of hairlines that squeeze toward the center on load, echoing the
 * compression banding of the fabric itself. Deliberately quiet — this is
 * the one animated flourish the design spends its budget on.
 */
export default function CompressionField({ lines = 14 }: { lines?: number }) {
  const items = Array.from({ length: lines });
  const mid = (lines - 1) / 2;

  return (
    <div className="compression-field">
      {items.map((_, i) => {
        const distanceFromMid = Math.abs(i - mid);
        const startTop = (i / (lines - 1)) * 100;
        return (
          <motion.div
            key={i}
            className="compression-band"
            style={{ top: `${startTop}%` }}
            initial={{ scaleX: 0.3, opacity: 0 }}
            animate={{
              scaleX: 1,
              opacity: 0.35 - distanceFromMid * 0.02,
            }}
            transition={{
              duration: 1.4,
              delay: 0.03 * i,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        );
      })}
    </div>
  );
}
