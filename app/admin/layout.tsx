export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-ink text-paper">
      <header className="border-b border-line px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-display font-bold text-sm tracking-wide">
            FLEXTER ADMIN
          </span>
          <nav className="flex items-center gap-4 text-xs text-dim">
            <Link href="/admin" className="hover:text-paper transition-colors">
              Orders
            </Link>
            <Link href="/admin/inventory" className="hover:text-paper transition-colors">
              Inventory
            </Link>
          </nav>
        </div>
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            className="text-xs text-dim hover:text-paper transition-colors"
          >
            Log out
          </button>
        </form>
      </header>
      <main className="px-6 py-8 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}