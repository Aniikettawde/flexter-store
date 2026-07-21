export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-ink text-paper">
      <header className="border-b border-line px-6 h-14 flex items-center justify-between">
        <span className="font-display font-bold text-sm tracking-wide">
          FLEXTER ADMIN
        </span>
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