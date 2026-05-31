"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Eye, EyeOff, ArrowLeft, Mail, KeyRound, TrendingUp,
  Users, Star, BarChart2, Send, CheckCircle2, Loader2,
} from "lucide-react";
import Link from "next/link";
import { useVendorAuth } from "@/contexts/VendorAuth";
import { supabase } from "@/lib/supabase";

type LoginMode = "password" | "otp";
type OtpStep = "email" | "verify";
type ForgotStage = "idle" | "input" | "sent";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8196H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
      <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8196L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
      <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
      <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
    </svg>
  );
}

const VENDOR_FEATURES = [
  { icon: BarChart2, title: "Pipeline Analytics", desc: "Track leads, opportunities, and closures in real time." },
  { icon: Users, title: "CRM Built-in", desc: "Manage your entire sales team from a single dashboard." },
  { icon: TrendingUp, title: "Revenue Insights", desc: "See which events and services drive your growth." },
];

const TESTIMONIAL = {
  quote: "Happy Moments transformed how we manage bookings. Revenue up 3x in six months.",
  name: "Rohan Mehta",
  role: "Founder, Atelier Frame Co.",
  city: "Hyderabad",
};

export default function VendorLoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, sendOTP, verifyOTP } = useVendorAuth();

  const [mode, setMode] = useState<LoginMode>("password");
  const [otpStep, setOtpStep] = useState<OtpStep>("email");
  const [forgotStage, setForgotStage] = useState<ForgotStage>("idle");
  const [rememberMe, setRememberMe] = useState(false);

  // Password mode
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP mode
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const reset = () => { setError(""); setInfo(""); };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault(); reset(); setLoading(true);
    const { error: err } = await signIn(email, password, rememberMe);
    setLoading(false);
    if (err) { setError(err); return; }
    router.push("/vendor-dashboard");
  };

  const handleSendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault(); reset(); setLoading(true);
    const { error: err } = await sendOTP(otpEmail);
    setLoading(false);
    if (err) { setError(err); return; }
    setInfo(`Magic code sent to ${otpEmail}`);
    setOtpStep("verify");
  };

  const handleVerifyOTP = useCallback(async () => {
    if (loading) return;
    reset(); setLoading(true);
    const { error: err } = await verifyOTP(otpEmail, otp, rememberMe);
    setLoading(false);
    if (err) { setError(err); return; }
    router.push("/vendor-dashboard");
  }, [loading, otpEmail, otp, rememberMe, verifyOTP, router]);

  // Auto-submit OTP when all 6 digits are entered
  useEffect(() => {
    if (otp.length === 6 && otpStep === "verify" && !loading) {
      handleVerifyOTP();
    }
  }, [otp, otpStep, loading, handleVerifyOTP]);

  const handleGoogleLogin = async () => { reset(); await signInWithGoogle(); };

  const switchMode = (m: LoginMode) => {
    setMode(m); setOtpStep("email"); setOtp(""); setForgotStage("idle"); reset();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    await supabase.auth.resetPasswordForEmail(forgotEmail.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/vendor/auth/reset-password`,
    });
    setForgotLoading(false);
    setForgotStage("sent");
  };

  const inp = {
    className: "w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition",
    style: { border: "1px solid var(--border3)", background: "var(--bg)", color: "var(--text)" } as React.CSSProperties,
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_520px]" style={{ background: "var(--bg)" }}>

      {/* ── LEFT: Brand panel ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-14 lg:flex"
        style={{ background: "var(--bg2)", borderRight: "1px solid var(--border3)" }}>

        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(135deg, rgba(201,168,76,0.025) 0px, rgba(201,168,76,0.025) 1px, transparent 1px, transparent 12px)",
        }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-96" style={{
          background: "radial-gradient(ellipse at 20% 100%, rgba(201,168,76,0.12) 0%, transparent 65%)",
        }} />

        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black" style={{ background: "var(--gold)", color: "var(--bg)" }}>HM</div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: "var(--text)" }}>Happy Moments</p>
            <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--text4)" }}>Vendor Portal</p>
          </div>
        </Link>

        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.07)", color: "var(--gold)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
            India&apos;s #1 event vendor platform
          </div>

          <h1 className="text-5xl font-black leading-[1.05] xl:text-6xl" style={{ color: "var(--text)" }}>
            Your business,<br /><span style={{ color: "var(--gold)" }}>amplified.</span>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7" style={{ color: "var(--text3)" }}>
            Join 4,800+ verified vendors managing their entire event business — from discovery to deal — on one intelligent platform.
          </p>

          <div className="mt-10 space-y-4">
            {VENDOR_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
                  <Icon size={16} style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{title}</p>
                  <p className="mt-0.5 text-xs leading-5" style={{ color: "var(--text4)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl p-5" style={{ border: "1px solid var(--border3)", background: "rgba(201,168,76,0.04)" }}>
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} className="fill-[#c9a84c] text-[#c9a84c]" />)}
            </div>
            <p className="text-sm italic leading-7" style={{ color: "var(--text2)" }}>
              &ldquo;{TESTIMONIAL.quote}&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black" style={{ background: "var(--gold)", color: "var(--bg)" }}>
                {TESTIMONIAL.name[0]}
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{TESTIMONIAL.name}</p>
                <p className="text-[10px]" style={{ color: "var(--text4)" }}>{TESTIMONIAL.role} · {TESTIMONIAL.city}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color: "var(--text4)" }}>© {new Date().getFullYear()} Happy Moments India · Vendor Portal</p>
      </div>

      {/* ── RIGHT: Form panel ── */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">

          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black" style={{ background: "var(--gold)", color: "var(--bg)" }}>HM</div>
            <span className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--text)" }}>Happy Moments · Vendors</span>
          </div>

          <Link href="/" className="mb-6 flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-70" style={{ color: "var(--text3)" }}>
            <ArrowLeft size={13} /> Back to home
          </Link>

          {/* Header */}
          {forgotStage === "idle" && (
            <div className="mb-8">
              <h2 className="text-3xl font-black" style={{ color: "var(--text)" }}>Welcome back</h2>
              <p className="mt-1.5 text-xs" style={{ color: "var(--text3)" }}>Sign in to your vendor dashboard.</p>
            </div>
          )}

          {forgotStage === "input" && (
            <div className="mb-8">
              <button onClick={() => setForgotStage("idle")} className="mb-4 flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-70" style={{ color: "var(--text3)" }}>
                <ArrowLeft size={13} /> Back to sign in
              </button>
              <h2 className="text-3xl font-black" style={{ color: "var(--text)" }}>Forgot password?</h2>
              <p className="mt-1.5 text-xs" style={{ color: "var(--text3)" }}>Enter your vendor email and we&apos;ll send a reset link.</p>
            </div>
          )}

          {forgotStage === "sent" && (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "rgba(201,168,76,0.1)" }}>
                <Send size={28} style={{ color: "var(--gold)" }} />
              </div>
              <h2 className="text-2xl font-black" style={{ color: "var(--text)" }}>Check your inbox</h2>
              <p className="mt-2 text-sm" style={{ color: "var(--text3)" }}>
                We sent a password reset link to <span className="font-semibold" style={{ color: "var(--gold)" }}>{forgotEmail}</span>
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--text4)" }}>The link is valid for 1 hour. Check spam if you don&apos;t see it.</p>
              <button onClick={() => { setForgotStage("idle"); setForgotEmail(""); }} className="mt-6 text-xs font-semibold transition hover:opacity-70" style={{ color: "var(--gold)" }}>
                Back to sign in
              </button>
            </div>
          )}

          {/* Forgot password form */}
          {forgotStage === "input" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text3)" }}>Vendor Email</label>
                <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="your@email.com" {...inp} />
              </div>
              <button type="submit" disabled={forgotLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--gold)", color: "#000" }}>
                {forgotLoading ? <Loader2 size={16} className="animate-spin" /> : "Send reset link"}
              </button>
            </form>
          )}

          {/* Main login form */}
          {forgotStage === "idle" && (
            <>
              {/* Google Sign-in */}
              <button type="button" onClick={handleGoogleLogin}
                className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl py-3 text-sm font-semibold transition hover:opacity-80"
                style={{ background: "var(--bg2)", border: "1px solid var(--border3)", color: "var(--text)" }}>
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Divider */}
              <div className="relative mb-5 flex items-center gap-3">
                <div className="flex-1" style={{ height: 1, background: "var(--border3)" }} />
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text4)" }}>or</span>
                <div className="flex-1" style={{ height: 1, background: "var(--border3)" }} />
              </div>

              {/* Mode tabs */}
              <div className="mb-5 flex rounded-xl p-1" style={{ background: "var(--bg)", border: "1px solid var(--border3)" }}>
                {([["password", "Password", KeyRound], ["otp", "Email OTP", Mail]] as const).map(([m, label, Icon]) => (
                  <button key={m} type="button" onClick={() => switchMode(m as LoginMode)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold uppercase tracking-wide transition"
                    style={{
                      background: mode === m ? "var(--gold)" : "transparent",
                      color: mode === m ? "#000" : "var(--text-muted)",
                    }}>
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Error / Info */}
              {error && (
                <div className="mb-4 rounded-xl px-4 py-2.5 text-xs" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171" }}>{error}</div>
              )}
              {info && (
                <div className="mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: "var(--gold)" }}>
                  <CheckCircle2 size={13} />{info}
                </div>
              )}

              {/* Password form */}
              {mode === "password" && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text3)" }}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required {...inp} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text3)" }}>Password</label>
                      <button type="button" onClick={() => { setForgotEmail(email); setForgotStage("input"); }} className="text-[10px] font-semibold transition hover:opacity-70" style={{ color: "var(--gold)" }}>
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required {...inp} className={inp.className + " pr-10"} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:opacity-50"
                    style={{ background: "var(--gold)", color: "#000", boxShadow: "0 8px 24px rgba(201,168,76,0.2)" }}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign In"}
                  </button>
                </form>
              )}

              {/* OTP: Email step */}
              {mode === "otp" && otpStep === "email" && (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text3)" }}>Registered Email</label>
                    <input type="email" value={otpEmail} onChange={(e) => setOtpEmail(e.target.value)} placeholder="your@email.com" required {...inp} />
                    <p className="mt-1.5 text-[10px]" style={{ color: "var(--text4)" }}>We&apos;ll send a magic login code to this address.</p>
                  </div>
                  <button type="submit" disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:opacity-50"
                    style={{ background: "var(--gold)", color: "#000", boxShadow: "0 8px 24px rgba(201,168,76,0.2)" }}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : "Send Code"}
                  </button>
                </form>
              )}

              {/* OTP: Verify step */}
              {mode === "otp" && otpStep === "verify" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text3)" }}>One-Time Code</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="••••••"
                      maxLength={6}
                      inputMode="numeric"
                      autoFocus
                      className="w-full rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none"
                      style={{ border: "1px solid var(--border3)", background: "var(--bg)", color: "var(--text)" }}
                    />
                    <div className="mt-1.5 flex items-center justify-between">
                      <p className="text-[10px]" style={{ color: "var(--text4)" }}>
                        {loading ? "Verifying…" : `Sent to ${otpEmail}`}
                      </p>
                      <button type="button" onClick={() => { setOtpStep("email"); setOtp(""); reset(); }}
                        className="text-[10px] font-semibold transition hover:opacity-70" style={{ color: "var(--gold)" }}>
                        Change email
                      </button>
                    </div>
                  </div>

                  {/* Remember me for OTP too */}
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded accent-[#c9a84c]" />
                    <span className="text-xs" style={{ color: "var(--text3)" }}>Remember me</span>
                  </label>

                  <button type="button" onClick={() => handleSendOTP()} disabled={loading}
                    className="w-full text-center text-xs transition hover:opacity-70 disabled:opacity-40" style={{ color: "var(--text4)" }}>
                    Didn&apos;t receive it? <span style={{ color: "var(--gold)" }}>Resend</span>
                  </button>
                </div>
              )}

              <div className="mt-6 border-t pt-5 text-center text-xs" style={{ borderColor: "var(--border3)", color: "var(--text4)" }}>
                Are you a team member?{" "}
                <Link href="/vendor/resource/login" className="font-semibold" style={{ color: "var(--gold)" }}>
                  Resource login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
