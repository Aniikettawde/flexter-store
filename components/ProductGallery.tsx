"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0, scale: 0.98 }),
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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const go = (nextIndex: number) => {
    setDirection(nextIndex > index ? 1 : -1);
    setIndex((nextIndex + images.length) % images.length);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50) go(index + 1);
    else if (info.offset.x > 50) go(index - 1);
  };

  // Keyboard nav while the lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, index]);

  return (
    <div>
      {/* Main image */}
      <div className="glass rounded-[2rem] overflow-hidden relative aspect-square group">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
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

        {/* Zoom hint */}
        <button
          onClick={() => setLightboxOpen(true)}
          aria-label="View full size"
          className="absolute bottom-3 right-3 h-9 w-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
        >
          <ZoomIn className="h-4 w-4" strokeWidth={1.6} />
        </button>

        {/* Photo counter */}
        {images.length > 1 && (
          <span className="absolute top-3 right-3 glass rounded-full px-2.5 py-1 text-[11px] font-mono text-paper/80">
            {index + 1} / {images.length}
          </span>
        )}

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

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 mt-4 overflow-x-auto pb-1 no-scrollbar">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => go(i)}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === index}
              className={`relative shrink-0 h-16 w-16 rounded-xl overflow-hidden border transition-all ${
                i === index
                  ? "border-paper"
                  : "border-line opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
              className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-4 sm:inset-10 z-[120] flex items-center justify-center"
              role="dialog"
              aria-modal="true"
              aria-label={`${alt} — full size photo`}
            >
              <button
                onClick={() => setLightboxOpen(false)}
                aria-label="Close"
                className="absolute top-0 right-0 sm:-top-2 sm:-right-2 h-10 w-10 rounded-full glass-strong flex items-center justify-center hover:bg-white/10 transition-colors z-10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative w-full h-full max-w-2xl max-h-[80vh] mx-auto">
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
                      sizes="90vw"
                      className="object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => go(index - 1)}
                    aria-label="Previous photo"
                    className="absolute left-0 sm:-left-14 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass-strong flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => go(index + 1)}
                    aria-label="Next photo"
                    className="absolute right-0 sm:-right-14 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass-strong flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[11px] font-mono text-paper/60">
                    {index + 1} / {images.length}
                  </span>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}