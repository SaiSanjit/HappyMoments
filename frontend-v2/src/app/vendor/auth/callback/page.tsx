"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { useVendorAuth } from "@/contexts/VendorAuth";

export default function VendorAuthCallbackPage() {
  const router = useRouter();
  const { handleOAuthCallback } = useVendorAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Give Supabase a moment to parse the OAuth hash/code from the URL
      await new Promise((r) => setTimeout(r, 500));
      if (cancelled) return;

      const { error: err } = await handleOAuthCallback();
      if (cancelled) return;

      if (err) {
        setError(err);
      } else {
        router.replace("/vendor-dashboard");
      }
    };

    run();
    return () => { cancelled = true; };
  }, [handleOAuthCallback, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4" style={{ background: "var(--bg)" }}>
      <div
        className="flex h-14 w-14 items-center justify-center rounded-xl"
        style={{ background: "var(--gold-soft)" }}
      >
        <Building2 size={28} style={{ color: "var(--gold)" }} />
      </div>

      {error ? (
        <div className="w-full max-w-sm text-center">
          <p className="mb-2 text-base font-semibold" style={{ color: "var(--text)" }}>
            Sign-in failed
          </p>
          <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
            {error}
          </p>
          <button
            onClick={() => router.replace("/vendor/login")}
            className="rounded-lg px-6 py-2.5 text-sm font-semibold"
            style={{ background: "var(--gold)", color: "#000" }}
          >
            Back to login
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-base font-semibold" style={{ color: "var(--text)" }}>
            Signing you in…
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Please wait while we verify your account.
          </p>
        </div>
      )}
    </div>
  );
}
