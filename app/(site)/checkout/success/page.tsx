"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Check, Copy, CopyCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const isCod = searchParams.get("method") === "cod";
  const orderNumber = searchParams.get("order");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!orderNumber) return;
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard access denied — nothing to do
    }
  };

  return (
    <div className="text-center max-w-sm">
      <div className="h-14 w-14 rounded-full bg-paper text-ink flex items-center justify-center mx-auto mb-6">
        <Check className="h-6 w-6" />
      </div>
      <h1 className="font-display font-bold text-2xl sm:text-3xl mb-3">
        Order confirmed.
      </h1>

      {orderNumber && (
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full border border-line hover:border-paper/40 transition-colors"
          aria-label="Copy order number"
        >
          <span className="font-mono text-sm tracking-wide">{orderNumber}</span>
          {copied ? (
            <CopyCheck className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-dim" />
          )}
        </button>
      )}

      <p className="text-dim text-sm">
        {isCod ? (
          <>
            Your Flexter Compression Tee is being prepared. Keep the amount
            ready — you&apos;ll pay in cash when it&apos;s delivered.
            You&apos;ll get a shipping update by email once it&apos;s on the
            way.
          </>
        ) : (
          <>
            Your Flexter Compression Tee is being prepared. You&apos;ll get a
            shipping update by email once it&apos;s on the way.
          </>
        )}
      </p>

      {orderNumber && (
        <p className="text-xs text-dim mt-3">
          Save this order number — quote it if you need to reach us about
          this order.
        </p>
      )}

      <Link
        href="/"
        className="inline-block mt-8 px-8 py-3.5 rounded-full border border-line hover:border-paper/40 text-sm font-medium transition-colors"
      >
        Back to Flexter
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-4 pt-16">
      {/* useSearchParams needs a Suspense boundary in the app router */}
      <Suspense fallback={null}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}