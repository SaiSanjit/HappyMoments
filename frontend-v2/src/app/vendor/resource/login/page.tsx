"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Users, ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useResourceAuth } from "@/contexts/ResourceAuth";

type Stage = "login" | "forgot";
type ForgotStep = "email" | "otp" | "newpass";

export default function ResourceLoginPage() {
  const router = useRouter();
  const { signIn, sendResetOtp, verifyResetOtp, resetPassword } = useResourceAuth();

  const [stage, setStage] = useState<Stage>("login");
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");
  const [rememberMe, setRememberMe] = useState(false);

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot fields
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForgot = () => {
    setForgotStep("email");
    setForgotEmail("");
    setForgotOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email, password, rememberMe);
    setLoading(false);
    if (err) { setError(err); return; }
    router.push("/vendor-dashboard");
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(""); setLoading(true);
    const { error: err } = await sendResetOtp(forgotEmail);
    setLoading(false);
    if (err) { setError(err); return; }
    setForgotStep("otp");
    setSuccess(`Reset code sent to ${forgotEmail}`);
  };

  const handleVerifyOtp = useCallback(async () => {
    if (loading) return;
    setError(""); setLoading(true);
    const { error: err } = await verifyResetOtp(forgotEmail, forgotOtp);
    setLoading(false);
    if (err) { setError(err); return; }
    setSuccess("");
    setForgotStep("newpass");
  }, [forgotEmail, forgotOtp, loading, verifyResetOtp]);

  // Auto-submit OTP when all 6 digits are entered
  useEffect(() => {
    if (forgotOtp.length === 6 && forgotStep === "otp" && !loading) {
      handleVerifyOtp();
    }
  }, [forgotOtp, forgotStep, loading, handleVerifyOtp]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmNewPassword) { setError("Passwords do not match."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error: err } = await resetPassword(forgotEmail, forgotOtp, newPassword);
    setLoading(false);
    if (err) { setError(err); return; }
    setSuccess("Password reset successfully! Please sign in.");
    resetForgot();
    setStage("login");
  };

  const inp = {
    className: "w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition",
    style: { border: "1px solid var(--border3)", background: "var(--bg)", color: "var(--text)" } as React.CSSProperties,
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">

        <Link href="/vendor/login" className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-70" style={{ color: "var(--text3)" }}>
          <ArrowLeft size={13} /> Vendor owner login
        </Link>

        <div className="rounded-2xl p-8" style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}>

          {/* Header */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <Users size={26} style={{ color: "var(--gold)" }} />
            </div>
            <div>
              {stage === "login" ? (
                <>
                  <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>Team Login</h1>
                  <p className="mt-1 text-xs" style={{ color: "var(--text3)" }}>Sign in with your resource credentials</p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>Reset Password</h1>
                  <p className="mt-1 text-xs" style={{ color: "var(--text3)" }}>
                    {forgotStep === "email" && "Enter your account email for a reset code."}
                    {forgotStep === "otp" && `Enter the 6-digit code sent to ${forgotEmail}.`}
                    {forgotStep === "newpass" && "Choose a strong new password."}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Step indicator for forgot flow */}
          {stage === "forgot" && (
            <div className="mb-6 flex items-center justify-center gap-2">
              {(["email", "otp", "newpass"] as ForgotStep[]).map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition"
                    style={{
                      background: forgotStep === step ? "var(--gold)" : ["email","otp","newpass"].indexOf(forgotStep) > i ? "rgba(201,168,76,0.2)" : "var(--bg)",
                      color: forgotStep === step ? "#000" : ["email","otp","newpass"].indexOf(forgotStep) > i ? "var(--gold)" : "var(--text4)",
                      border: forgotStep === step ? "none" : "1px solid var(--border3)",
                    }}>
                    {["email","otp","newpass"].indexOf(forgotStep) > i ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                  {i < 2 && <div className="h-px w-6" style={{ background: ["email","otp","newpass"].indexOf(forgotStep) > i ? "var(--gold)" : "var(--border3)" }} />}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl px-4 py-2.5 text-xs" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>{error}</div>
          )}
          {success && (
            <div className="mb-4 rounded-xl px-4 py-2.5 text-xs" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}>{success}</div>
          )}

          {/* ── Login form ── */}
          {stage === "login" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text3)" }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required {...inp} />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text3)" }}>Password</label>
                  <button type="button" onClick={() => { setForgotEmail(email); setStage("forgot"); setError(""); setSuccess(""); }}
                    className="text-[10px] font-semibold transition hover:opacity-70" style={{ color: "var(--gold)" }}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required {...inp} className={inp.className + " pr-10"} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex cursor-pointer items-center gap-2.5">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded accent-[#c9a84c]" />
                <span className="text-xs" style={{ color: "var(--text3)" }}>Remember me</span>
              </label>

              <button type="submit" disabled={loading}
                className="w-full rounded-xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: "var(--gold)", color: "#000", boxShadow: "0 8px 24px rgba(201,168,76,0.2)" }}>
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          )}

          {/* ── Forgot: Step 1 — Email ── */}
          {stage === "forgot" && forgotStep === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text3)" }}>Account Email</label>
                <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="your@email.com" {...inp} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full rounded-xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: "var(--gold)", color: "#000" }}>
                {loading ? "Sending…" : "Send reset code"}
              </button>
              <button type="button" onClick={() => { resetForgot(); setStage("login"); }}
                className="w-full text-center text-xs font-semibold transition hover:opacity-70" style={{ color: "var(--text3)" }}>
                <ArrowLeft size={11} className="inline mr-1" /> Back to sign in
              </button>
            </form>
          )}

          {/* ── Forgot: Step 2 — OTP ── */}
          {stage === "forgot" && forgotStep === "otp" && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text3)" }}>6-Digit Reset Code</label>
                <input
                  type="text"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="••••••"
                  maxLength={6}
                  inputMode="numeric"
                  autoFocus
                  className="w-full rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none"
                  style={{ border: "1px solid var(--border3)", background: "var(--bg)", color: "var(--text)" }}
                />
                <p className="mt-2 text-center text-[10px]" style={{ color: "var(--text3)" }}>
                  {loading ? "Verifying…" : `Sent to ${forgotEmail}`}
                </p>
              </div>
              <button type="button" onClick={() => setForgotStep("email")} className="w-full text-center text-xs transition hover:opacity-70" style={{ color: "var(--text3)" }}>
                <RotateCcw size={11} className="inline mr-1" /> Resend or change email
              </button>
            </div>
          )}

          {/* ── Forgot: Step 3 — New password ── */}
          {stage === "forgot" && forgotStep === "newpass" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text3)" }}>New Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" {...inp} className={inp.className + " pr-10"} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text3)" }}>Confirm Password</label>
                <input type={showPassword ? "text" : "password"} required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Repeat password" {...inp} />
              </div>
              <button type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: "var(--gold)", color: "#000" }}>
                {loading ? "Resetting…" : <><CheckCircle2 size={14} /> Set new password</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
