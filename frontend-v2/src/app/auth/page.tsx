"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useCustomerAuth } from "@/contexts/CustomerAuth";

type Mode = "signin" | "signup";

const STATS = [
  { value: "4,800+", label: "Verified vendors" },
  { value: "32K+",   label: "Successful bookings" },
  { value: "96%",    label: "Happy customers" },
  { value: "28",     label: "Cities covered" },
];

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp } = useCustomerAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    router.push("/discover");
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

          {/* Tab switcher */}
          <div className="mb-8 flex rounded-2xl p-1.5" style={{ border: "1px solid var(--border2)", background: "var(--bg2)" }}>
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
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

          <div className="mb-6">
            <h2 className="font-display text-3xl" style={{ color: "var(--text)" }}>
              {mode === "signin" ? "Welcome back" : "Join Happy Moments"}
            </h2>
            <p className="mt-1 text-xs" style={{ color: "var(--text3)" }}>
              {mode === "signin" ? "Sign in to access your saved vendors and bookings." : "Create a free account to start planning your event."}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl px-4 py-3 text-xs" style={{ border: "1px solid rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)", color: "#f87171" }}>{error}</div>
          )}
          {success && (
            <div className="mb-4 rounded-xl px-4 py-3 text-xs" style={{ border: "1px solid rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.08)", color: "#4ade80" }}>{success}</div>
          )}

          {/* Input styles */}
          {(() => {
            const inp = {
              className: "w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition",
              style: {
                border: "1px solid var(--border2)",
                background: "var(--bg)",
                color: "var(--text)",
              } as React.CSSProperties,
            };

            if (mode === "signin") return (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--text3)" }}>Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" {...inp} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--text3)" }}>Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" {...inp} className={inp.className + " pr-10"} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 transition hover:opacity-70" style={{ color: "var(--text3)" }}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                  style={{ background: "var(--gold)", color: "var(--bg)", boxShadow: "0 8px 24px rgba(201,168,76,0.25)" }}>
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            );

            return (
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
            );
          })()}

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
