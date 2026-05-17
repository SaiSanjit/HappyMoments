"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCustomerAuth } from "@/contexts/CustomerAuth";
import { LogOut, User, Search, ChevronDown, X } from "lucide-react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { label: "Photography",   href: "/discover?category=Photography" },
  { label: "Venues",        href: "/discover?category=Venues" },
  { label: "Catering",      href: "/discover?category=Catering" },
  { label: "Decoration",    href: "/discover?category=Decorators" },
  { label: "Entertainment", href: "/discover?category=Entertainment" },
  { label: "Makeup",        href: "/discover?category=Makeup" },
  { label: "Planning",      href: "/discover?category=Event+Planners" },
  { label: "Videography",   href: "/discover?category=Videography" },
];

const navLinks = [
  { label: "Vendors",    href: "/discover",    dropdown: false },
  { label: "Categories", href: "#",            dropdown: true  },
  { label: "About",      href: "/",            dropdown: false },
];

export default function MarketingNavbar() {
  const { customer, signOut } = useCustomerAuth();
  const router = useRouter();

  const [dropOpen, setDropOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus input when search expands
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = () => {
    if (searchVal.trim()) {
      router.push(`/discover?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal("");
    }
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div
        style={{
          background: "var(--nav-bg)",
          borderBottom: "1px solid var(--nav-border)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.10)",
        }}
      >
        <nav className="mx-auto flex h-[62px] max-w-7xl items-center gap-6 px-5 md:px-8">

          {/* ── Logo ── */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src="/logo.svg"
              alt="Happy Moments"
              style={{ height: 42, width: "auto", flexShrink: 0 }}
            />
            <span
              className="brand-text hidden sm:block"
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--nav-text)",
              }}
            >
              Happy Moments
            </span>
          </Link>

          {/* ── Divider ── */}
          <div style={{ width: 1, height: 20, background: "var(--nav-border)", flexShrink: 0 }} className="hidden md:block" />

          {/* ── Nav links ── */}
          <div className="hidden items-center gap-0.5 md:flex">
            {navLinks.map(({ label, href, dropdown }) =>
              dropdown ? (
                <div key={label} ref={dropRef} className="relative">
                  <button
                    onClick={() => setDropOpen((o) => !o)}
                    className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition-colors duration-150"
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: dropOpen ? "var(--nav-text)" : "var(--nav-muted)",
                      background: dropOpen ? "rgba(255,255,255,0.06)" : "transparent",
                    }}
                  >
                    {label}
                    <ChevronDown
                      size={13}
                      style={{
                        color: "var(--nav-muted)",
                        transition: "transform 0.2s",
                        transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>

                  {/* Dropdown panel */}
                  {dropOpen && (
                    <div
                      className="absolute left-0 top-[calc(100%+10px)] w-56 rounded-2xl p-2"
                      style={{
                        background: "var(--nav-bg)",
                        border: "1px solid var(--nav-border)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.28em",
                          textTransform: "uppercase",
                          color: "var(--gold)",
                          padding: "6px 10px 4px",
                        }}
                      >
                        Browse by Category
                      </p>
                      {CATEGORIES.map(({ label: cat, href: catHref }) => (
                        <Link
                          key={cat}
                          href={catHref}
                          onClick={() => setDropOpen(false)}
                          className="flex items-center rounded-lg px-3 py-2 transition-colors duration-150 hover:bg-white/5"
                          style={{ fontSize: 13, fontWeight: 500, color: "var(--nav-muted)" }}
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={label}
                  href={href}
                  className="rounded-lg px-3.5 py-2 transition-colors duration-150 hover:bg-white/5"
                  style={{ fontSize: 13, fontWeight: 500, color: "var(--nav-muted)" }}
                >
                  {label}
                </Link>
              )
            )}
          </div>

          {/* ── Spacer ── */}
          <div className="flex-1" />

          {/* ── Inline search ── */}
          <div className="hidden items-center md:flex">
            {searchOpen ? (
              <div
                className="flex items-center gap-2 rounded-full px-3.5 py-2"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid var(--nav-border)",
                  width: 220,
                  transition: "width 0.25s ease",
                }}
              >
                <Search size={13} style={{ color: "var(--nav-muted)", flexShrink: 0 }} />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search vendors..."
                  className="flex-1 bg-transparent focus:outline-none"
                  style={{ fontSize: 12, fontWeight: 400, color: "var(--nav-text)", caretColor: "var(--gold)" }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchVal(""); }}>
                  <X size={12} style={{ color: "var(--nav-muted)" }} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center rounded-full p-2 transition-colors duration-150 hover:bg-white/5"
                style={{ color: "var(--nav-muted)" }}
                title="Search"
              >
                <Search size={16} />
              </button>
            )}
          </div>

          {/* ── Auth controls ── */}
          <div className="flex shrink-0 items-center gap-2">
            {customer ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden md:inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors duration-150 hover:bg-white/5"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--nav-text)",
                    border: "1px solid var(--nav-btn-border)",
                    background: "var(--nav-btn-bg)",
                  }}
                >
                  <User size={13} />
                  {customer.full_name.split(" ")[0]}
                </Link>
                <button
                  onClick={signOut}
                  title="Sign out"
                  className="flex items-center justify-center rounded-full p-2 transition-colors duration-150 hover:bg-white/5"
                  style={{
                    border: "1px solid var(--nav-btn-border)",
                    background: "var(--nav-btn-bg)",
                    color: "var(--nav-muted)",
                  }}
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="hidden rounded-full px-4 py-2 transition-colors duration-150 hover:bg-white/5 md:inline-flex"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--nav-muted)",
                  }}
                >
                  Sign in
                </Link>

                <Link
                  href="/vendor/onboarding"
                  className="hidden rounded-full px-4 py-2 transition-colors duration-150 hover:bg-white/5 md:inline-flex"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--nav-muted)",
                    border: "1px solid var(--nav-border)",
                  }}
                >
                  Join as Vendor
                </Link>

                {/* Subtle divider before CTA */}
                <div style={{ width: 1, height: 18, background: "var(--nav-border)" }} className="hidden md:block" />

                <Link
                  href="/auth"
                  className="inline-flex items-center rounded-full px-5 py-2 transition-all duration-150 hover:-translate-y-px"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-lt) 100%)",
                    color: "var(--nav-cta-text)",
                    boxShadow: "0 2px 8px rgba(201,168,76,0.20)",
                    letterSpacing: "0.01em",
                  }}
                >
                  Start Planning
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Bottom gold rule */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.25) 30%, rgba(201,168,76,0.25) 70%, transparent 100%)",
          }}
        />
      </div>
    </header>
  );
}
