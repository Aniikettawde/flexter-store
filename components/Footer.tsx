import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative border-t border-line px-4 sm:px-6 py-10 pb-28 sm:pb-10">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Logo className="h-5 w-5" />
          <span className="font-display font-bold text-sm tracking-wide">
            FLEXTER
          </span>
        </div>
        <p className="text-xs text-dim">
          © {new Date().getFullYear()} Flexter. One tee. Zero compromise.
        </p>
        <div className="flex items-center gap-5 text-xs text-dim">
          <a href="mailto:hello@flexter.in" className="hover:text-paper transition-colors">
            hello@flexter.in
          </a>
        </div>
      </div>
    </footer>
  );
}
