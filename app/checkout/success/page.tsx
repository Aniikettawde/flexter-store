"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const isCod = searchParams.get("method") === "cod";

  return (
    <div className="text-center max-w-sm">
      <div className="h-14 w-14 rounded-full bg-paper text-ink flex items-center justify-center mx-auto mb-6">
        <Check className="h-6 w-6" />
      </div>
      <h1 className="font-display font-bold text-2xl sm:text-3xl mb-3">
        Order confirmed.
      </h1>
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