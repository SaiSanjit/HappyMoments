import Link from "next/link";
import { FOOTER_LINK_GROUPS } from "@/lib/homepage-data";

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-[#0f1726] px-4 pb-10 pt-16 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 grid gap-6 rounded-[34px] border border-white/10 bg-white/6 p-8 backdrop-blur-sm lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-brand-primary">
              Ready to start planning?
            </p>
            <h2 className="mt-4 max-w-[15ch] font-display text-4xl leading-none text-white md:text-5xl">
              Build a premium vendor shortlist with confidence.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-brand-primary px-6 py-4 text-sm font-semibold text-brand-secondary transition hover:-translate-y-0.5"
            >
              Start Planning
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/12 px-6 py-4 text-sm font-semibold text-white transition hover:border-brand-primary hover:text-brand-primary"
            >
              Explore Vendors
            </Link>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f1d4a2_0%,#b78442_100%)] text-sm font-bold text-brand-secondary">
                HM
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Happy Moments</p>
                <p className="text-sm text-white/55">Premium vendor discovery and planning ecosystem</p>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/64">
              Built for trust-led discovery, fast vendor conversations, premium planning workflows,
              and the future of intelligent event commerce.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FOOTER_LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/78">{group.title}</h3>
                <div className="mt-4 space-y-3">
                  {group.links.map((label) => (
                    <Link key={label} href="/" className="block text-sm text-white/58 transition hover:text-white">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Happy Moments. Designed for premium event commerce.</p>
          <div className="flex gap-5">
            <Link href="/" className="transition hover:text-white">Instagram</Link>
            <Link href="/" className="transition hover:text-white">LinkedIn</Link>
            <Link href="/" className="transition hover:text-white">Pinterest</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
