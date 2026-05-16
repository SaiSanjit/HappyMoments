"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Building2, ArrowLeft, Mail, KeyRound } from "lucide-react";
import Link from "next/link";
import { useVendorAuth } from "@/contexts/VendorAuth";

type LoginMode = "password" | "otp";
type OtpStep = "email" | "verify";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8196H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
      <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8196L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
      <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
      <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
    </svg>
  );
}

export default function VendorLoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, sendOTP, verifyOTP } = useVendorAuth();

  const [mode, setMode] = useState<LoginMode>("password");
  const [otpStep, setOtpStep] = useState<OtpStep>("email");

  // Password mode fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP mode fields
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const resetState = () => {
    setError("");
    setInfo("");
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    router.push("/vendor-dashboard");
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    setLoading(true);
    const { error: err } = await sendOTP(otpEmail);
    setLoading(false);
    if (err) { setError(err); return; }
    setInfo(`OTP sent to ${otpEmail}. Check your inbox.`);
    setOtpStep("verify");
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    setLoading(true);
    const { error: err } = await verifyOTP(otpEmail, otp);
    setLoading(false);
    if (err) { setError(err); return; }
    router.push("/vendor-dashboard");
  };

  const handleGoogleLogin = async () => {
    resetState();
    await signInWithGoogle();
  };

  const switchMode = (m: LoginMode) => {
    setMode(m);
    setOtpStep("email");
    setOtp("");
    resetState();
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
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
        >
          {/* Header */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl"
              style={{ background: "var(--gold-soft)" }}
            >
              <Building2 size={28} style={{ color: "var(--gold)" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                Vendor Portal
              </h1>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                Sign in to manage your business
              </p>
            </div>
          </div>

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border3)",
              color: "var(--text)",
            }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-6 flex items-center gap-3">
            <div className="flex-1" style={{ height: 1, background: "var(--border3)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>or</span>
            <div className="flex-1" style={{ height: 1, background: "var(--border3)" }} />
          </div>

          {/* Mode tabs */}
          <div
            className="mb-6 flex rounded-xl p-1"
            style={{ background: "var(--bg)", border: "1px solid var(--border3)" }}
          >
            <button
              type="button"
              onClick={() => switchMode("password")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition"
              style={{
                background: mode === "password" ? "var(--gold)" : "transparent",
                color: mode === "password" ? "#000" : "var(--text-muted)",
              }}
            >
              <KeyRound size={13} />
              Password
            </button>
            <button
              type="button"
              onClick={() => switchMode("otp")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition"
              style={{
                background: mode === "otp" ? "var(--gold)" : "transparent",
                color: mode === "otp" ? "#000" : "var(--text-muted)",
              }}
            >
              <Mail size={13} />
              Email OTP
            </button>
          </div>

          {/* Error / Info messages */}
          {error && (
            <p className="mb-4 rounded-lg px-4 py-2.5 text-sm" style={{ background: "#fee2e2", color: "#dc2626" }}>
              {error}
            </p>
          )}
          {info && (
            <p className="mb-4 rounded-lg px-4 py-2.5 text-sm" style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)" }}>
              {info}
            </p>
          )}

          {/* Password login form */}
          {mode === "password" && (
            <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  {...inp}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    {...inp}
                    className={inp.className + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="mt-1.5 text-right">
                  <button
                    type="button"
                    onClick={() => switchMode("otp")}
                    className="text-xs transition-opacity hover:opacity-70"
                    style={{ color: "var(--gold)" }}
                  >
                    Forgot password? Use email OTP
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-lg py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--gold)", color: "#000" }}
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          )}

          {/* OTP login form */}
          {mode === "otp" && (
            <>
              {otpStep === "email" && (
                <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                      Registered Email
                    </label>
                    <input
                      type="email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      {...inp}
                    />
                    <p className="mt-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                      Enter the email address linked to your vendor account.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: "var(--gold)", color: "#000" }}
                  >
                    {loading ? "Sending…" : "Send OTP"}
                  </button>
                </form>
              )}

              {otpStep === "verify" && (
                <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                      One-Time Password
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-digit code"
                      required
                      maxLength={6}
                      inputMode="numeric"
                      {...inp}
                    />
                    <div className="mt-1.5 flex items-center justify-between">
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Sent to {otpEmail}
                      </p>
                      <button
                        type="button"
                        onClick={() => { setOtpStep("email"); setOtp(""); resetState(); }}
                        className="text-xs transition-opacity hover:opacity-70"
                        style={{ color: "var(--gold)" }}
                      >
                        Change email
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: "var(--gold)", color: "#000" }}
                  >
                    {loading ? "Verifying…" : "Verify & Sign In"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="text-center text-xs transition-opacity hover:opacity-70 disabled:opacity-50"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Didn&apos;t receive it? <span style={{ color: "var(--gold)" }}>Resend OTP</span>
                  </button>
                </form>
              )}
            </>
          )}

          <div className="mt-6 border-t pt-6 text-center text-sm" style={{ borderColor: "var(--border3)", color: "var(--text-muted)" }}>
            Are you a team member?{" "}
            <Link href="/vendor/resource/login" className="font-medium" style={{ color: "var(--gold)" }}>
              Resource login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
