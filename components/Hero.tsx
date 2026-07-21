"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import CompressionField from "./CompressionField";
import TShirtArt from "./TShirtArt";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden pt-16"
    >
      <CompressionField />

      <div className="relative z-10 mx-auto max-w-6xl w-full px-4 sm:px-6 flex-1 flex flex-col lg:flex-row items-center gap-10 lg:gap-6 pt-10 lg:pt-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 w-full text-center lg:text-left"
        >
          <motion.p
            variants={item}
            className="font-mono text-xs sm:text-sm tracking-[0.25em] text-dim uppercase mb-5"
          >
            One tee. Zero compromise.
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display font-black leading-[0.95] tracking-tight text-[13vw] sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            ENGINEERED
            <br />
            <span className="text-dim">PRESSURE.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 text-dim text-base sm:text-lg max-w-md mx-auto lg:mx-0"
          >
            The Flexter Compression Tee. Four-way stretch fabric that holds
            muscle in place from warm-up to the last rep.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
          >
            <a
              href="#product"
              className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full bg-paper text-ink font-medium text-sm tracking-wide hover:bg-white transition-colors"
            >
              Shop the tee — ₹1,499
            </a>
            <a
              href="#specs"
              className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full border border-line hover:border-paper/40 font-medium text-sm tracking-wide transition-colors"
            >
              Fabric &amp; fit
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto"
        >
          <div className="relative glass rounded-[2rem] p-6 sm:p-10 animate-floatSlow">
            <TShirtArt className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]" />
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#product"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="relative z-10 mx-auto mb-8 flex flex-col items-center gap-2 text-dim text-xs tracking-widest uppercase"
        aria-label="Scroll to product details"
      >
        Scroll
        <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
      </motion.a>
    </section>
  );
}
