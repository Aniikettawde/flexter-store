import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t border-line px-4 sm:px-6 py-10 pb-28 sm:pb-10">
      <div className="mx-auto max-w-6xl flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Flexter"
              width={24}
              height={24}
              className="h-5 w-5 object-contain"
            />
            <span className="font-display font-bold text-sm tracking-wide">
              FLEXTER
            </span>
          </div>
          <p className="text-xs text-dim">
            © {new Date().getFullYear()} Flexter. One tee. Zero compromise.
          </p>
          
          <a  href="mailto:info@flexter.in"
            className="text-xs text-dim hover:text-paper transition-colors"
          >
            info@flexter.in
          </a>
        </div>
        <div className="hairline" />
        <nav className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-xs text-dim">
          <a href="/privacy-policy" className="hover:text-paper transition-colors">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="hover:text-paper transition-colors">
            Terms of Service
          </a>
          <a href="/refund-policy" className="hover:text-paper transition-colors">
            Refund &amp; Return Policy
          </a>
        </nav>
      </div>
    </footer>
  );
}