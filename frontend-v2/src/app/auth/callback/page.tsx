"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { supabase, Customer } from "@/lib/supabase";
import { useCustomerAuth } from "@/contexts/CustomerAuth";

export default function CustomerAuthCallbackPage() {
  const router = useRouter();
  const { setCustomerFromOAuth } = useCustomerAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Give Supabase a moment to parse the OAuth hash/code from the URL
      await new Promise((r) => setTimeout(r, 500));
      if (cancelled) return;

      const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
      if (cancelled) return;

      if (sessionErr || !session) {
        setError("Authentication failed. Please try again.");
        return;
      }

      const email = session.user.email;
      if (!email) {
        setError("Could not retrieve email from Google account.");
        return;
      }

      // Look up existing customer
      const { data: existing } = await supabase
        .from("customers")
        .select("*")
        .ilike("email", email)
        .single();

      if (cancelled) return;

      if (existing) {
        setCustomerFromOAuth(existing as Customer, true);
        router.replace("/discover");
        return;
      }

      // Auto-create customer row for first-time Google sign-in
      const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split("@")[0];
      const { data: created, error: insertErr } = await supabase
        .from("customers")
        .insert({
          full_name: fullName,
          email: email.toLowerCase(),
          password_hash: "",
          mobile_number: "",
          status: "verified",
          login_count: 0,
        })
        .select("*")
        .single();

      if (cancelled) return;

      if (insertErr || !created) {
        setError("Failed to create your account. Please try again.");
        return;
      }

      setCustomerFromOAuth(created as Customer, true);
      router.replace("/discover");
    };

    run();
    return () => { cancelled = true; };
  }, [setCustomerFromOAuth, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4" style={{ background: "var(--bg)" }}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
        <Sparkles size={26} style={{ color: "var(--gold)" }} />
      </div>

      {error ? (
        <div className="w-full max-w-sm text-center">
          <p className="mb-2 text-base font-semibold" style={{ color: "var(--text)" }}>Sign-in failed</p>
          <p className="mb-6 text-sm" style={{ color: "var(--text3)" }}>{error}</p>
          <button
            onClick={() => router.replace("/auth")}
            className="rounded-xl px-6 py-2.5 text-sm font-bold transition hover:opacity-90"
            style={{ background: "var(--gold)", color: "#000" }}
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-base font-semibold" style={{ color: "var(--text)" }}>Signing you in…</p>
          <p className="mt-1 text-sm" style={{ color: "var(--text3)" }}>Please wait while we verify your account.</p>
        </div>
      )}
    </div>
  );
}
