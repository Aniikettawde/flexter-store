"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const totalQty = useCartStore((s) => s.totalQty());
  const openDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <Image
            src="/images/logo.png"
            alt="Flexter"
            width={28}
            height={28}
            className="h-6 w-6 object-contain transition-transform duration-300 group-hover:scale-110"
            priority
          />
          <span className="font-display font-bold tracking-wide text-sm sm:text-base">
            FLEXTER
          </span>
        </a>
         <nav className="hidden sm:flex items-center gap-8 text-sm text-dim">
          <a href="#product" className="hover:text-paper transition-colors">
            The Tee
          </a>
          <a href="#specs" className="hover:text-paper transition-colors">
            Fabric &amp; Fit
          </a>
          <a href="#faq" className="hover:text-paper transition-colors">
            Shipping
          </a>
          <Link href="/track" className="hover:text-paper transition-colors">
            Track order
          </Link>
        </nav>
        <button
          onClick={openDrawer}
          aria-label={`Open bag, ${totalQty} item${totalQty === 1 ? "" : "s"}`}
          className="relative h-10 w-10 flex items-center justify-center rounded-full border border-line hover:border-paper/40 transition-colors"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.6} />
          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-paper text-ink text-[10px] font-mono font-medium flex items-center justify-center">
              {totalQty}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}