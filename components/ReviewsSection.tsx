"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BadgeCheck, ChevronDown } from "lucide-react";

type Review = {
  id: string;
  name: string;
  rating: number; // 1-5
  title?: string;
  body: string;
  date: string; // display string
  verified: boolean;
  size?: string;
};

const DUMMY_REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Aditya",
    rating: 5,
    title: "Fits perfectly, great fabric",
    body: "Wasn't expecting the quality to be this good at this price. The fabric feels premium and the fit is exactly true to size. Ordered a medium, fits like it should.",
    date: "2 weeks ago",
    verified: true,
    size: "M",
  },
  {
    id: "r2",
    name: "Priya",
    rating: 4,
    title: "Good quality, delivery was quick",
    body: "Loved the print quality and the fabric feels breathable. Only reason for 4 stars is the color was slightly different from what I saw on screen, but still happy with it.",
    date: "3 weeks ago",
    verified: true,
    size: "S",
  },
  {
    id: "r3",
    name: "Rohan",
    rating: 5,
    title: "Bought a second one already",
    body: "First one fit so well I ordered another in a different colorway. Stitching is solid, doesn't feel like it'll wear out after a few washes.",
    date: "1 month ago",
    verified: true,
    size: "L",
  },
  {
    id: "r4",
    name: "Sneha Iyer",
    rating: 4,
    body: "Comfortable for daily wear, holds shape well after wash. Would've liked a bit more length but overall satisfied with the purchase.",
    date: "1 month ago",
    verified: true,
    size: "M",
  },
  {
    id: "r5",
    name: "fit verma",
    rating: 5,
    title: "Worth it",
    body: "Cash on delivery was smooth, packaging was neat, and the tee itself is genuinely nice. Sizing chart was accurate for me.",
    date: "1 month ago",
    verified: true,
    size: "XL",
  },
  {
    id: "r6",
    name: "sam",
    rating: 3,
    title: "Decent, sizing runs slightly large",
    body: "Product itself is nice but runs a little large. Would recommend sizing down if you like a more fitted look.",
    date: "2 months ago",
    verified: false,
    size: "M",
  },
];

function average(reviews: Review[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

function StarRow({
  rating,
  size = 16,
  interactive = false,
  onChange,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? rating;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(shown);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(i)}
            onMouseEnter={() => interactive && setHover(i)}
            onMouseLeave={() => interactive && setHover(null)}
            className={interactive ? "cursor-pointer" : "cursor-default"}
            aria-label={`${i} star${i > 1 ? "s" : ""}`}
          >
            <Star
              width={size}
              height={size}
              strokeWidth={1.4}
              className={filled ? "fill-amber-400 text-amber-400" : "text-dim"}
            />
          </button>
        );
      })}
    </div>
  );
}

// Supports partial fill (e.g. 4.4) for the headline stat
function StarRowPrecise({ rating, size = 20 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((i) => {
        const fillPct = Math.max(0, Math.min(1, rating - i)) * 100;
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Star width={size} height={size} strokeWidth={1.4} className="text-dim absolute inset-0" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPct}%` }}
            >
              <Star width={size} height={size} strokeWidth={1.4} className="fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ReviewsSection() {
  const STORAGE_KEY = "flexter-user-reviews";
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  // form state
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUserReviews(JSON.parse(stored));
    } catch {
      // ignore malformed storage
    }
  }, []);

  const allReviews = useMemo(
    () => [...userReviews, ...DUMMY_REVIEWS],
    [userReviews]
  );

  const avg = useMemo(() => average(allReviews), [allReviews]);
  const total = allReviews.length;

  const breakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // index 0 = 1 star ... index 4 = 5 star
    allReviews.forEach((r) => counts[r.rating - 1]++);
    return counts
      .map((c, i) => ({ star: i + 1, count: c, pct: total ? (c / total) * 100 : 0 }))
      .reverse(); // 5 star first
  }, [allReviews, total]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || rating === 0 || !body.trim()) {
      setError("Please add your name, a rating, and a short review.");
      return;
    }
    const newReview: Review = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      rating,
      body: body.trim(),
      date: "Just now",
      verified: false,
    };
    const next = [newReview, ...userReviews];
    setUserReviews(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable — review still shows for this session
    }
    setName("");
    setRating(0);
    setBody("");
    setError(null);
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <section id="reviews" className="px-4 sm:px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-xs tracking-[0.25em] text-dim uppercase">
            Reviews
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3">
            What people are saying
          </h2>
        </motion.div>

        {/* Summary */}
        <div className="grid sm:grid-cols-[auto_1fr] gap-10 sm:gap-16 mt-10">
          <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-2">
            <p className="font-mono text-5xl sm:text-6xl">{avg.toFixed(1)}</p>
            <div className="flex flex-col gap-1.5">
              <StarRowPrecise rating={avg} />
              <p className="text-xs text-dim">{total} reviews</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 max-w-md">
            {breakdown.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-3 text-dim font-mono">{star}</span>
                <Star width={12} height={12} className="fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-amber-400/80 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-dim font-mono text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hairline my-10" />

        {/* Write a review trigger */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-dim">
            Already own it? Let others know what you think.
          </p>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="h-11 px-6 rounded-full border border-line hover:border-paper/50 text-sm font-medium transition-colors"
          >
            {showForm ? "Cancel" : "Write a review"}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-6 p-6 rounded-2xl border border-line flex flex-col gap-4 max-w-lg">
                <div>
                  <p className="text-xs uppercase tracking-widest text-dim mb-2">
                    Your rating
                  </p>
                  <StarRow rating={rating} size={22} interactive onChange={setRating} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-dim mb-2">
                    Your name
                  </p>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ishaan Kapoor"
                    className="w-full h-11 rounded-full border border-line bg-transparent px-4 text-sm outline-none focus:border-paper/50 transition-colors"
                  />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-dim mb-2">
                    Your review
                  </p>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Tell us about the fit, fabric, and how it wore over time..."
                    rows={4}
                    className="w-full rounded-2xl border border-line bg-transparent px-4 py-3 text-sm outline-none focus:border-paper/50 transition-colors resize-none"
                  />
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <button
                  type="submit"
                  className="h-11 rounded-full bg-paper text-ink font-medium text-sm hover:bg-white transition-colors"
                >
                  Submit review
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {submitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-emerald-400 mt-4"
          >
            Thanks — your review has been posted.
          </motion.p>
        )}

        {/* Review list */}
        <div className="grid sm:grid-cols-2 gap-6 mt-10">
          {allReviews.slice(0, visibleCount).map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="p-5 rounded-2xl border border-line"
            >
              <div className="flex items-center justify-between">
                <StarRow rating={r.rating} size={14} />
                {r.verified && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <BadgeCheck width={13} height={13} />
                    Verified purchase
                  </span>
                )}
              </div>

              {r.title && (
                <p className="font-medium text-sm mt-3">{r.title}</p>
              )}
              <p className="text-sm text-dim mt-1.5 leading-relaxed">
                {r.body}
              </p>

              <div className="flex items-center gap-2 mt-4 text-xs text-dim">
                <span className="text-paper font-medium">{r.name}</span>
                <span>·</span>
                <span>{r.date}</span>
                {r.size && (
                  <>
                    <span>·</span>
                    <span>Size {r.size}</span>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {visibleCount < allReviews.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + 4)}
              className="flex items-center gap-2 h-11 px-6 rounded-full border border-line hover:border-paper/50 text-sm font-medium transition-colors"
            >
              Load more reviews
              <ChevronDown width={14} height={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}