"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield, AlertCircle, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

// The admin password should be set via environment variable in production.
// Fallback for local dev only.
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin2024";
const ADMIN_SESSION_KEY = "hm_admin_session";

type Stage = "login" | "forgot";

export function setAdminSession() {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ loggedIn: true, at: Date.now() }));
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminLoggedIn(): boolean {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return false;
    const { loggedIn, at } = JSON.parse(raw);
    // Session valid for 8 hours
    return loggedIn === true && Date.now() - at < 8 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("login");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAdminSession();
      router.push("/admin");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const inp = {
    className: "w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition",
    style: { border: "1px solid var(--border3)", background: "var(--bg)", color: "var(--text)" } as React.CSSProperties,
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-[400px]">

        {/* Back link */}
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-70" style={{ color: "var(--text3)" }}>
          <ArrowLeft size={13} /> Back to home
        </Link>

        <div className="rounded-2xl p-8" style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}>
          {/* Header */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <Shield size={26} style={{ color: "var(--gold)" }} />
            </div>
            <div>
              <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>Admin Console</h1>
              <p className="mt-1 text-xs" style={{ color: "var(--text3)" }}>Restricted access — Happy Moments platform</p>
            </div>
          </div>

          {/* ── Login form ── */}
          {stage === "login" && (
            <>
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
                  <AlertCircle size={13} /> {error}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text4)" }}>Admin Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" {...inp} className={inp.className + " pr-10"} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text4)" }}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button type="submit"
                  className="w-full rounded-xl py-3.5 text-sm font-bold transition hover:opacity-90"
                  style={{ background: "var(--gold)", color: "#000" }}>
                  Access Console
                </button>
              </form>
              <button onClick={() => { setStage("forgot"); setError(""); }} className="mt-4 w-full text-center text-xs font-semibold transition hover:opacity-70" style={{ color: "var(--gold)" }}>
                Forgot password?
              </button>
            </>
          )}

          {/* ── Forgot password ── */}
          {stage === "forgot" && (
            <div className="space-y-5">
              <button onClick={() => setStage("login")} className="flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-70" style={{ color: "var(--text3)" }}>
                <ArrowLeft size={13} /> Back
              </button>

              <div className="rounded-2xl p-5 text-center" style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)" }}>
                <Mail size={28} className="mx-auto mb-3" style={{ color: "var(--gold)" }} />
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Contact platform support</p>
                <p className="mt-2 text-xs leading-6" style={{ color: "var(--text3)" }}>
                  The admin password is a platform-level credential set in the server environment.
                  To reset it, contact the platform owner:
                </p>
                <a href="mailto:happymomentsforindia@gmail.com"
                  className="mt-3 inline-block rounded-xl px-5 py-2.5 text-xs font-bold transition hover:opacity-90"
                  style={{ background: "var(--gold)", color: "#000" }}>
                  happymomentsforindia@gmail.com
                </a>
                <p className="mt-4 text-[10px]" style={{ color: "var(--text4)" }}>
                  To change the password, update <code className="rounded px-1 py-0.5 text-[9px]" style={{ background: "var(--bg)", color: "var(--text3)" }}>NEXT_PUBLIC_ADMIN_PASSWORD</code> in your environment variables and redeploy.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
