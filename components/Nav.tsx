"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/lib/cart-store";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const totalQty = useCartStore((s) => s.totalQty());
  const openDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change / resize back to desktop, and
  // lock body scroll while it's open so the page behind doesn't scroll.
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "#product", label: "The Tee" },
    { href: "#specs", label: "Fabric & Fit" },
    { href: "#faq", label: "Shipping" },
    { href: "/track", label: "Track order" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? "glass-strong" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
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
  {navLinks.map((link) =>
    link.href.startsWith("#") ? (
      <a
        key={link.href}
        href={link.href}
        className="hover:text-paper transition-colors"
      >
        {link.label}
      </a>
    ) : (
      <Link
        key={link.href}
        href={link.href}
        className="hover:text-paper transition-colors"
      >
        {link.label}
      </Link>
    )
  )}
</nav>

        <div className="flex items-center gap-2">
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

          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="sm:hidden h-10 w-10 flex items-center justify-center rounded-full border border-line hover:border-paper/40 transition-colors"
          >
            {menuOpen ? (
              <X className="h-4 w-4" strokeWidth={1.6} />
            ) : (
              <Menu className="h-4 w-4" strokeWidth={1.6} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="sm:hidden overflow-hidden border-t border-line"
          >
        <div className="px-4 py-4 flex flex-col gap-1">
  {navLinks.map((link) =>
    link.href.startsWith("#") ? (
      <a
        key={link.href}
        href={link.href}
        onClick={() => setMenuOpen(false)}
        className="py-3 text-sm text-dim hover:text-paper transition-colors border-b border-line/50 last:border-0"
      >
        {link.label}
      </a>
    ) : (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => setMenuOpen(false)}
        className="py-3 text-sm text-dim hover:text-paper transition-colors border-b border-line/50 last:border-0"
      >
        {link.label}
      </Link>
    )
  )}
</div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}