"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCustomerAuth } from "@/contexts/CustomerAuth";
import { LogOut, User } from "lucide-react";

const navLinks = [
  { label: "Home",       href: "/" },
  { label: "Vendors",    href: "/discover" },
  { label: "About us",   href: "/" },
  { label: "Contact us", href: "/" },
];

export default function MarketingNavbar() {
  const { customer, signOut } = useCustomerAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 px-4 md:px-8"
      style={{
        paddingTop: scrolled ? "10px" : "20px",
        transition: "padding 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <nav
        className="rounded-full px-4 md:px-6"
        style={{
          background:       scrolled ? "var(--nav-bg)"     : "transparent",
          border:           `1px solid ${scrolled ? "var(--nav-border)" : "transparent"}`,
          boxShadow:        scrolled ? "0 8px 40px rgba(0,0,0,0.22)" : "none",
          backdropFilter:   scrolled ? "blur(22px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(22px)" : "none",
          padding:          scrolled ? "8px 16px" : "8px 0",
          transition:       "background 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1), padding 0.5s cubic-bezier(0.16,1,0.3,1), backdrop-filter 0.5s",
        }}
      >
        <div className="flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
              style={{ background: "var(--nav-cta-bg)", color: "var(--nav-cta-text)" }}
            >
              HM
            </div>
            <p
              className="text-sm font-semibold tracking-[0.16em] uppercase"
              style={{ color: "var(--nav-text)" }}
            >
              Happy Moments
            </p>
          </Link>

          {/* Nav links */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm font-medium transition-opacity duration-200 hover:opacity-100"
                style={{ color: "var(--nav-muted)" }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Auth controls */}
          <div className="flex items-center gap-2.5">
            {customer ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden md:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition hover:opacity-90"
                  style={{
                    background: "var(--nav-btn-bg)",
                    border: "1px solid var(--nav-btn-border)",
                    color: "var(--nav-text)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <User size={13} /> {customer.full_name.split(" ")[0]}
                </Link>
                <button
                  onClick={signOut}
                  className="rounded-full p-2 transition hover:opacity-90"
                  style={{
                    background: "var(--nav-btn-bg)",
                    border: "1px solid var(--nav-btn-border)",
                    color: "var(--nav-text)",
                    backdropFilter: "blur(12px)",
                  }}
                  title="Sign out"
                >
                  <LogOut size={13} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="hidden rounded-full px-4 py-2 text-xs font-medium transition hover:opacity-90 md:inline-flex"
                  style={{
                    background: "var(--nav-btn-bg)",
                    border: "1px solid var(--nav-btn-border)",
                    color: "var(--nav-text)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/auth"
                  className="rounded-full px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
                  style={{
                    background: "var(--nav-cta-bg)",
                    color: "var(--nav-cta-text)",
                    boxShadow: "0 6px 20px rgba(201,168,76,0.25)",
                  }}
                >
                  Start Planning
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
