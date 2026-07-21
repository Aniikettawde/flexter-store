"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden"
    >
      {/* Full-bleed photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-runner.png"
          alt="Man sprinting in the Flexter Compression Tee and matching compression leggings, black on black"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center] sm:object-[68%_18%]"
        />
        {/* Rich overlay: bottom-up scrim for text legibility + a cool
            left-to-right vignette so the tee stays visible while copy
            still reads clearly over the model. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/20 to-transparent" />
        <div className="absolute inset-0 bg-ink/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl w-full px-4 sm:px-6 pt-28 sm:pt-0">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-xl text-center sm:text-left mx-auto sm:mx-0 pb-16 sm:pb-24"
        >
          <motion.p
            variants={item}
            className="font-mono text-xs sm:text-sm tracking-[0.25em] text-dim uppercase mb-5"
          >
            One tee. Zero compromise.
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display font-black leading-[0.95] tracking-tight text-[15vw] sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            ENGINEERED
            <br />
            <span className="text-dim">PRESSURE.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 text-dim text-base sm:text-lg max-w-md mx-auto sm:mx-0"
          >
            The Flexter Compression Tee. Four-way stretch fabric that holds
            muscle in place from warm-up to the last rep.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3"
          >
            <a
              href="#product"
              className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full bg-paper text-ink font-medium text-sm tracking-wide hover:bg-white transition-colors"
            >
              Shop the tee — ₹1,499
            </a>
            <a
              href="#specs"
              className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full border border-paper/30 hover:border-paper/60 font-medium text-sm tracking-wide transition-colors backdrop-blur-sm"
            >
              Fabric &amp; fit
            </a>
          </motion.div>
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
