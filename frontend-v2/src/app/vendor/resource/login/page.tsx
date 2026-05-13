"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useResourceAuth } from "@/contexts/ResourceAuth";

export default function ResourceLoginPage() {
  const router = useRouter();
  const { signIn } = useResourceAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    router.push("/vendor-dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">
        <Link
          href="/vendor/login"
          className="mb-8 inline-flex items-center gap-2 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={16} />
          Vendor owner login
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
              <Users size={28} style={{ color: "var(--gold)" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                Team Login
              </h1>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                Sign in with your resource credentials
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border3)",
                  color: "var(--text)",
                }}
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
                  className="w-full rounded-lg px-4 py-2.5 pr-10 text-sm outline-none transition-all"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border3)",
                    color: "var(--text)",
                  }}
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
            </div>

            {error && (
              <p className="rounded-lg px-4 py-2.5 text-sm" style={{ background: "#fee2e2", color: "#dc2626" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--gold)", color: "#000" }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
