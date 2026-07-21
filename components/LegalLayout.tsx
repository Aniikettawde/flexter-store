export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="pt-16">
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="font-mono text-xs tracking-[0.25em] text-dim uppercase mb-3">
            Last updated {updated}
          </p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl mb-10">
            {title}
          </h1>
          <div className="hairline mb-10" />
          <div className="space-y-8 text-sm leading-relaxed text-dim [&_h2]:text-paper [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-lg [&_h2]:mb-2 [&_strong]:text-paper [&_a]:text-paper [&_a]:underline [&_a]:underline-offset-4">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
