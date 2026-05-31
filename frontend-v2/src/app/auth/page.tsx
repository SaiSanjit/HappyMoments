"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles, Star, RotateCcw, CheckCircle2 } from "lucide-react";
import { useCustomerAuth } from "@/contexts/CustomerAuth";

type Mode = "signin" | "signup" | "forgot";
type ForgotStep = "email" | "otp" | "newpass";

const STATS = [
  { value: "4,800+", label: "Verified vendors" },
  { value: "32K+",   label: "Successful bookings" },
  { value: "96%",    label: "Happy customers" },
  { value: "28",     label: "Cities covered" },
];

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

function getStrength(pw: string): "weak" | "medium" | "strong" {
  if (pw.length < 6) return "weak";
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pw);
  if (pw.length >= 8 && hasLetter && (hasDigit || hasSpecial)) return "strong";
  return "medium";
}

const STRENGTH_COLOR = { weak: "#f87171", medium: "#fbbf24", strong: "#4ade80" };
const STRENGTH_LABEL = { weak: "Weak", medium: "Medium", strong: "Strong" };
const STRENGTH_FILL = { weak: 1, medium: 2, strong: 3 };

function AuthInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/discover";

  const { signIn, signInWithGoogle, signUp, sendResetOtp, verifyResetOtp, resetPassword } = useCustomerAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Sign in / sign up fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const resetForgot = () => {
    setForgotStep("email");
    setForgotEmail("");
    setForgotOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError("");
    setSuccess("");
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    setSuccess("");
    if (m !== "forgot") resetForgot();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error: err } = await signIn(email, password, rememberMe);
    setLoading(false);
    if (err) { setError(err); return; }
    router.push(redirectTo);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error: err } = await signUp(name, email, password, mobile);
    setLoading(false);
    if (err) { setError(err); return; }
    setSuccess("Account created! You can now sign in.");
    setMode("signin");
  };

  const handleForgotSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(""); setLoading(true);
    const { error: err } = await sendResetOtp(forgotEmail);
    setLoading(false);
    if (err) { setError(err); return; }
    setForgotStep("otp");
    setSuccess(`Reset code sent to ${forgotEmail}`);
  };

  const handleForgotVerifyOtp = useCallback(async () => {
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
      handleForgotVerifyOtp();
    }
  }, [forgotOtp, forgotStep, loading, handleForgotVerifyOtp]);

  const handleForgotResetPassword = async (e: React.FormEvent) => {
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
    setMode("signin");
  };

  const strength = getStrength(password);

  const inp = {
    className: "w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition",
    style: {
      border: "1px solid var(--border2)",
      background: "var(--bg)",
      color: "var(--text)",
    } as React.CSSProperties,
  };

  return (
    <div className="grid min-h-screen transition-colors duration-300 lg:grid-cols-2" style={{ background: "var(--bg)" }}>
      {/* ── Left brand panel ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex" style={{ background: "var(--bg2)", borderRight: "1px solid var(--border3)" }}>
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(45deg, rgba(201,168,76,0.03) 0px, rgba(201,168,76,0.03) 1px, transparent 1px, transparent 10px)",
        }} />
        <div className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(ellipse at 30% 60%, rgba(201,168,76,0.09) 0%, transparent 60%)",
        }} />

        <Link href="/" className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold" style={{ background: "var(--gold)", color: "var(--bg)" }}>HM</div>
          <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--text)" }}>Happy Moments</span>
        </Link>

        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em]"
            style={{ border: "1px solid rgba(201,168,76,0.25)", background: "rgba(201,168,76,0.08)", color: "var(--gold)" }}>
            <ShieldCheck size={11} /> Trusted marketplace
          </div>

          <h1 className="font-display text-5xl leading-[0.9] xl:text-6xl" style={{ color: "var(--text)" }}>
            Plan your <em className="italic" style={{ color: "var(--gold)" }}>perfect</em><br />celebration.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7" style={{ color: "var(--text3)" }}>
            Access thousands of verified vendors across photography, venues, catering, decor, and more — all in one place.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl p-4" style={{ border: "1px solid var(--border3)", background: "var(--bg3)" }}>
                <p className="text-2xl font-semibold" style={{ color: "var(--text)" }}>{s.value}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--text3)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl p-5" style={{ border: "1px solid var(--border)", background: "rgba(201,168,76,0.05)" }}>
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} className="fill-[#c9a84c] text-[#c9a84c]" />)}
            </div>
            <p className="font-display text-sm italic leading-7" style={{ color: "var(--text2)" }}>
              &ldquo;Found our dream photographer and venue within hours. The curation is unlike anything we&apos;d seen.&rdquo;
            </p>
            <p className="mt-3 text-[10px] font-semibold" style={{ color: "var(--text3)" }}>— Ananya K., Bangalore</p>
          </div>
        </div>

        <p className="relative text-xs" style={{ color: "var(--text4)" }}>© {new Date().getFullYear()} Happy Moments India</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold" style={{ background: "var(--gold)", color: "var(--bg)" }}>HM</div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>Happy Moments</span>
          </div>

          <Link href="/" className="mb-6 flex items-center gap-2 text-xs font-semibold transition hover:opacity-70"
            style={{ color: "var(--text3)" }}>
            <ArrowLeft size={13} /> Back to home
          </Link>

          {/* ── Forgot password header ── */}
          {mode === "forgot" && (
            <div className="mb-8">
              <button onClick={() => switchMode("signin")} className="mb-5 flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-70" style={{ color: "var(--text3)" }}>
                <ArrowLeft size={13} /> Back to sign in
              </button>

              <div className="mb-6 flex items-center gap-2">
                {(["email", "otp", "newpass"] as ForgotStep[]).map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition"
                      style={{
                        background: forgotStep === step ? "var(--gold)" : ["email","otp","newpass"].indexOf(forgotStep) > i ? "rgba(201,168,76,0.2)" : "var(--bg2)",
                        color: forgotStep === step ? "var(--bg)" : ["email","otp","newpass"].indexOf(forgotStep) > i ? "var(--gold)" : "var(--text4)",
                        border: forgotStep === step ? "none" : "1px solid var(--border2)",
                      }}>
                      {["email","otp","newpass"].indexOf(forgotStep) > i ? <CheckCircle2 size={12} /> : i + 1}
                    </div>
                    {i < 2 && <div className="h-px w-6 transition" style={{ background: ["email","otp","newpass"].indexOf(forgotStep) > i ? "var(--gold)" : "var(--border2)" }} />}
                  </div>
                ))}
                <span className="ml-1 text-xs" style={{ color: "var(--text3)" }}>
                  {forgotStep === "email" ? "Enter email" : forgotStep === "otp" ? "Verify code" : "New password"}
                </span>
              </div>

              <h2 className="font-display text-3xl" style={{ color: "var(--text)" }}>Reset password</h2>
              <p className="mt-1 text-xs" style={{ color: "var(--text3)" }}>
                {forgotStep === "email" && "Enter your account email. We'll send a 6-digit reset code."}
                {forgotStep === "otp" && `Enter the 6-digit code sent to ${forgotEmail}.`}
                {forgotStep === "newpass" && "Choose a strong new password for your account."}
              </p>
            </div>
          )}

          {/* ── Normal mode: Google + tabs ── */}
          {mode !== "forgot" && (
            <>
              <div className="mb-6">
                <h2 className="font-display text-3xl" style={{ color: "var(--text)" }}>
                  {mode === "signin" ? "Welcome back" : "Join Happy Moments"}
                </h2>
                <p className="mt-1 text-xs" style={{ color: "var(--text3)" }}>
                  {mode === "signin" ? "Sign in to access your saved vendors and bookings." : "Create a free account to start planning your event."}
                </p>
              </div>

              {/* Google button */}
              <button type="button" onClick={() => signInWithGoogle()}
                className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl py-3 text-sm font-semibold transition hover:opacity-80"
                style={{ background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--text)" }}>
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Divider */}
              <div className="relative mb-5 flex items-center gap-3">
                <div className="flex-1" style={{ height: 1, background: "var(--border2)" }} />
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text4)" }}>or</span>
                <div className="flex-1" style={{ height: 1, background: "var(--border2)" }} />
              </div>

              {/* Tab switcher */}
              <div className="mb-8 flex rounded-2xl p-1.5" style={{ border: "1px solid var(--border2)", background: "var(--bg2)" }}>
                {(["signin", "signup"] as Mode[]).map((m) => (
                  <button key={m} onClick={() => switchMode(m)}
                    className="flex-1 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition"
                    style={{
                      background: mode === m ? "rgba(201,168,76,0.12)" : "transparent",
                      color:      mode === m ? "var(--gold)" : "var(--text3)",
                      border:     mode === m ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent",
                    }}>
                    {m === "signin" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>
            </>
          )}

          {error && (
            <div className="mb-4 rounded-xl px-4 py-3 text-xs" style={{ border: "1px solid rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)", color: "#f87171" }}>{error}</div>
          )}
          {success && (
            <div className="mb-4 rounded-xl px-4 py-3 text-xs" style={{ border: "1px solid rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.08)", color: "#4ade80" }}>{success}</div>
          )}

          {/* ── Sign In form ── */}
          {mode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--text3)" }}>Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" {...inp} />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--text3)" }}>Password</label>
                  <button type="button" onClick={() => { setForgotEmail(email); switchMode("forgot"); }}
                    className="text-[10px] font-semibold transition hover:opacity-70" style={{ color: "var(--gold)" }}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" {...inp} className={inp.className + " pr-10"} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 transition hover:opacity-70" style={{ color: "var(--text3)" }}>
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
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                style={{ background: "var(--gold)", color: "var(--bg)", boxShadow: "0 8px 24px rgba(201,168,76,0.25)" }}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          )}

          {/* ── Sign Up form ── */}
          {mode === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              {[
                { label: "Full name",      type: "text",  value: name,   set: setName,   ph: "Your full name" },
                { label: "Email",          type: "email", value: email,  set: setEmail,  ph: "you@example.com" },
                { label: "Mobile number",  type: "tel",   value: mobile, set: setMobile, ph: "+91 98765 43210" },
              ].map(({ label, type, value, set, ph }) => (
                <div key={label}>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--text3)" }}>{label}</label>
                  <input type={type} required value={value} onChange={(e) => set(e.target.value)} placeholder={ph} {...inp} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--text3)" }}>Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 chars" {...inp} className={inp.className + " pr-9"} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }}>
                      {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {password.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((seg) => (
                          <div key={seg} className="h-1 flex-1 rounded-full transition-all"
                            style={{ background: STRENGTH_FILL[strength] >= seg ? STRENGTH_COLOR[strength] : "var(--border2)" }} />
                        ))}
                      </div>
                      <p className="text-[10px] font-semibold" style={{ color: STRENGTH_COLOR[strength] }}>
                        {STRENGTH_LABEL[strength]}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--text3)" }}>Confirm</label>
                  <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" {...inp} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                style={{ background: "var(--gold)", color: "var(--bg)", boxShadow: "0 8px 24px rgba(201,168,76,0.25)" }}>
                {loading ? "Creating account..." : <><Sparkles size={13} /> Create free account</>}
              </button>
            </form>
          )}

          {/* ── Forgot password: Step 1 — Email ── */}
          {mode === "forgot" && forgotStep === "email" && (
            <form onSubmit={handleForgotSendOtp} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--text3)" }}>Account Email</label>
                <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@example.com" {...inp} />
              </div>
              <button type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "var(--gold)", color: "var(--bg)", boxShadow: "0 8px 24px rgba(201,168,76,0.25)" }}>
                {loading ? "Sending..." : "Send reset code"}
              </button>
            </form>
          )}

          {/* ── Forgot password: Step 2 — OTP ── */}
          {mode === "forgot" && forgotStep === "otp" && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--text3)" }}>6-Digit Reset Code</label>
                <input
                  type="text"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="••••••"
                  maxLength={6}
                  inputMode="numeric"
                  autoFocus
                  className="w-full rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none"
                  style={{ border: "1px solid var(--border2)", background: "var(--bg)", color: "var(--text)" }}
                />
                <p className="mt-2 text-center text-[10px]" style={{ color: "var(--text3)" }}>
                  {loading ? "Verifying…" : `Sent to ${forgotEmail}`}
                </p>
              </div>
              <button type="button" onClick={() => setForgotStep("email")} className="w-full text-center text-xs transition hover:opacity-70" style={{ color: "var(--text3)" }}>
                <RotateCcw size={11} className="inline mr-1" />
                Resend or change email
              </button>
            </div>
          )}

          {/* ── Forgot password: Step 3 — New password ── */}
          {mode === "forgot" && forgotStep === "newpass" && (
            <form onSubmit={handleForgotResetPassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--text3)" }}>New Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" {...inp} className={inp.className + " pr-10"} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--text3)" }}>Confirm New Password</label>
                <input type={showPassword ? "text" : "password"} required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Repeat password" {...inp} />
              </div>
              <button type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "var(--gold)", color: "var(--bg)", boxShadow: "0 8px 24px rgba(201,168,76,0.25)" }}>
                {loading ? "Resetting..." : <><CheckCircle2 size={14} /> Set new password</>}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-[10px]" style={{ color: "var(--text4)" }}>
            By continuing, you agree to our{" "}
            <span className="cursor-pointer underline" style={{ color: "var(--text3)" }}>Terms of Service</span> and{" "}
            <span className="cursor-pointer underline" style={{ color: "var(--text3)" }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthInner />
    </Suspense>
  );
}
