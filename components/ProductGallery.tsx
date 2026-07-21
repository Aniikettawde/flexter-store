"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

export default function ProductGallery({
  images,
  alt,
}: {
  images: readonly string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const go = (nextIndex: number) => {
    setDirection(nextIndex > index ? 1 : -1);
    setIndex((nextIndex + images.length) % images.length);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50) go(index + 1);
    else if (info.offset.x > 50) go(index - 1);
  };

  return (
    <div>
      <div className="glass rounded-[2rem] overflow-hidden relative aspect-square">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt={`${alt} — photo ${index + 1} of ${images.length}`}
              fill
              sizes="(max-width: 768px) 90vw, 500px"
              className="object-cover"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous photo"
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full glass items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next photo"
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full glass items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-paper" : "w-1.5 bg-paper/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}