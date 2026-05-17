"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Building2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Stage = "loading" | "form" | "success" | "error";

export default function VendorResetPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Supabase appends the access token as a hash — give it time to parse
    const timer = setTimeout(async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        setErrorMsg("This reset link is invalid or has expired. Please request a new one.");
        setStage("error");
      } else {
        setStage("form");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (updateError) { setError(updateError.message); return; }
    setStage("success");
    setTimeout(() => router.push("/vendor/login"), 3000);
  };

  const inp = {
    className: "w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all",
    style: {
      background: "var(--bg)",
      border: "1px solid var(--border3)",
      color: "var(--text)",
    } as React.CSSProperties,
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl p-8" style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}>
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: "var(--gold-soft)" }}>
              <Building2 size={28} style={{ color: "var(--gold)" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Vendor Portal</h1>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Reset your password</p>
            </div>
          </div>

          {/* Loading */}
          {stage === "loading" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 size={28} className="animate-spin" style={{ color: "var(--gold)" }} />
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Validating reset link…</p>
            </div>
          )}

          {/* Error state */}
          {stage === "error" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <AlertCircle size={40} style={{ color: "#f87171" }} />
              <p className="text-sm" style={{ color: "var(--text)" }}>{errorMsg}</p>
              <Link href="/vendor/login"
                className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "var(--gold)", color: "#000" }}>
                Back to login
              </Link>
            </div>
          )}

          {/* Success state */}
          {stage === "success" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle2 size={40} style={{ color: "#4ade80" }} />
              <div>
                <p className="font-semibold" style={{ color: "var(--text)" }}>Password updated!</p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Redirecting you to the login page…</p>
              </div>
            </div>
          )}

          {/* Form */}
          {stage === "form" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <p className="rounded-lg px-4 py-2.5 text-sm" style={{ background: "#fee2e2", color: "#dc2626" }}>{error}</p>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-muted)" }}>New Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" {...inp} className={inp.className + " pr-10"} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-muted)" }}>Confirm New Password</label>
                <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" {...inp} />
              </div>
              <button type="submit" disabled={loading}
                className="mt-1 w-full rounded-lg py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--gold)", color: "#000" }}>
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
