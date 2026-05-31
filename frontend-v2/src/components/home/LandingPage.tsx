"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sparkles, Search, Star, ArrowRight, BadgeCheck, Shield,
} from "lucide-react";
import MarketingNavbar from "./MarketingNavbar";
import ScatteredMosaic from "./ScatteredMosaic";
import {
  IconPhotography, IconVenues, IconCatering, IconDecoration,
  IconEntertainment, IconMakeup, IconPlanning, IconVideography,
} from "./AnimatedCategoryIcons";
import {
  IconMusic, IconNightlife, IconComedy, IconPerformances,
  IconFoodDrinks, IconFestsFairs, IconSocialMixers, IconScreenings,
  IconFitness, IconArtExhibitions, IconConferences, IconOpenMics,
} from "./EventCategoryIcons";
import { FEATURED_VENDORS, TRUST_MARKS } from "@/lib/homepage-data";

const CATEGORIES = [
  { name: "Photography",   AnimIcon: IconPhotography,   count: "740+",  href: "/discover?category=Photography" },
  { name: "Venues",        AnimIcon: IconVenues,        count: "420+",  href: "/discover?category=Venues" },
  { name: "Catering",      AnimIcon: IconCatering,      count: "510+",  href: "/discover?category=Catering" },
  { name: "Decoration",    AnimIcon: IconDecoration,    count: "360+",  href: "/discover?category=Decorators" },
  { name: "Entertainment", AnimIcon: IconEntertainment, count: "280+",  href: "/discover?category=Entertainment" },
  { name: "Makeup",        AnimIcon: IconMakeup,        count: "285+",  href: "/discover?category=Makeup" },
  { name: "Planning",      AnimIcon: IconPlanning,      count: "190+",  href: "/discover?category=Event+Planners" },
  { name: "Videography",   AnimIcon: IconVideography,   count: "320+",  href: "/discover?category=Videography" },
];

const EVENT_CATEGORIES = [
  { name: "Music",           AnimIcon: IconMusic,          href: "/discover?type=Music" },
  { name: "Nightlife",       AnimIcon: IconNightlife,       href: "/discover?type=Nightlife" },
  { name: "Comedy",          AnimIcon: IconComedy,          href: "/discover?type=Comedy" },
  { name: "Performances",    AnimIcon: IconPerformances,    href: "/discover?type=Performances" },
  { name: "Food & Drinks",   AnimIcon: IconFoodDrinks,      href: "/discover?type=Food" },
  { name: "Fests & Fairs",   AnimIcon: IconFestsFairs,      href: "/discover?type=Fests" },
  { name: "Social Mixers",   AnimIcon: IconSocialMixers,    href: "/discover?type=Social" },
  { name: "Screenings",      AnimIcon: IconScreenings,      href: "/discover?type=Screenings" },
  { name: "Fitness",         AnimIcon: IconFitness,         href: "/discover?type=Fitness" },
  { name: "Art Exhibitions", AnimIcon: IconArtExhibitions,  href: "/discover?type=Art" },
  { name: "Conferences",     AnimIcon: IconConferences,     href: "/discover?type=Conferences" },
  { name: "Open Mics",       AnimIcon: IconOpenMics,        href: "/discover?type=OpenMics" },
];

const HOW_IT_WORKS = [
  { num: "01", title: "Describe Your Celebration",  desc: "Share your event type, date, location, guest count, and style vision." },
  { num: "02", title: "Get Curated Matches",         desc: "Receive vendor shortlists ranked by quality, budget fit, and availability." },
  { num: "03", title: "Chat & Compare",              desc: "Message vendors, request quotes, share moodboards — all in one place." },
  { num: "04", title: "Book With Confidence",        desc: "Review proposals, confirm details, and secure your vendors effortlessly." },
];

const TESTIMONIALS = [
  { quote: "Happy Moments made our wedding feel truly effortless. The vendors were exceptional and the entire journey — from discovery to booking — was seamless.", name: "Priya & Rohan Mehta", event: "Wedding · Hyderabad", rating: 5 },
  { quote: "We found our dream photographer and caterer within hours. The curation quality is unlike anything we'd seen. Every vendor felt handpicked for us.", name: "Ananya Krishnamurthy", event: "Engagement · Bangalore", rating: 5 },
  { quote: "I was planning a corporate gala with tight timelines. Happy Moments gave us five perfect venue options within the day. Absolutely phenomenal.", name: "Vikram Desai", event: "Corporate Event · Mumbai", rating: 5 },
];

const QUICK_CHIPS = ["Wedding", "Birthday", "Corporate", "Engagement", "Baby Shower"];
const TRUST_LABELS = [...TRUST_MARKS, "Planner Circle", "Celebration Guild", ...TRUST_MARKS, "Planner Circle", "Celebration Guild"];

export default function LandingPage() {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeChip, setActiveChip] = useState("Wedding");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Fixed nav (self-contained) ── */}
      <MarketingNavbar />

      {/* ── Hero ── */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-24 transition-colors duration-300"
        style={{ background: "var(--bg)" }}
      >
        {/* Scattered illustration mosaic */}
        <ScatteredMosaic />

        {/* Dark vignette — keeps center text readable over the mosaic */}
        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 50% 50%, transparent 0%, var(--bg) 72%)",
          }}
        />

        {/* Gold glow */}
        <div className="pointer-events-none absolute inset-0 z-[4]" aria-hidden>
          <div className="absolute left-1/2 top-1/2 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.13) 0%, transparent 68%)" }} />
        </div>

        {/* Hero content — sits above mosaic + vignette */}
        <div className="relative z-10 flex flex-col items-center">

        {/* AI badge */}
        <div
          className="mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2"
          style={{
            border: "1px solid rgba(201,168,76,0.30)",
            background: "rgba(201,168,76,0.07)",
            color: "var(--gold)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
          }}
        >
          <Sparkles size={11} /> AI-Powered Event Planning
        </div>

        {/* Headline */}
        <h1
          className="max-w-3xl text-center font-display text-[clamp(3rem,9vw,6rem)] leading-[0.88]"
          style={{ color: "var(--text)" }}
        >
          Plan Your <em className="italic" style={{ color: "var(--gold)" }}>Perfect</em>
          <br />Celebration
        </h1>
        <p
          className="mt-6 max-w-lg text-center leading-8 md:text-lg"
          style={{
            color: "var(--text3)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            fontWeight: 400,
            letterSpacing: "0.01em",
          }}
        >
          Discover 4,800+ verified photographers, venues, caterers, and luxury event vendors — curated for every celebration.
        </p>

        {/* Search bar */}
        <div className="relative mt-10 w-full max-w-2xl">
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-4 backdrop-blur-xl transition-all"
            style={{
              background: "var(--bg2)",
              border: `1px solid ${isFocused ? "rgba(201,168,76,0.4)" : "var(--border)"}`,
              boxShadow: isFocused ? "0 0 0 4px rgba(201,168,76,0.06)" : "var(--card-shadow)",
            }}
          >
            <Search size={17} className="shrink-0" style={{ color: "var(--text3)" }} />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search photographers, venues, caterers..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
              style={{ color: "var(--text)", caretColor: "var(--gold)" }}
            />
            {isFocused && (
              <div className="flex shrink-0 items-center gap-[3px]" aria-hidden>
                {[0, 0.1, 0.2, 0.1, 0].map((delay, i) => (
                  <div key={i} className="w-[3px] rounded-full bg-[var(--gold)]"
                    style={{ animation: `wave 1.1s ease-in-out ${delay}s infinite`, color: "var(--gold)" }} />
                ))}
              </div>
            )}
            <button
              onClick={() => window.location.assign(`/discover${searchValue ? `?search=${encodeURIComponent(searchValue)}` : ""}`)}
              className="shrink-0 rounded-xl px-5 py-2.5 text-xs font-bold transition hover:opacity-90"
              style={{ background: "var(--gold)", color: "var(--bg)" }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Quick chips */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveChip(chip)}
              className="rounded-full px-4 py-2 transition"
              style={{
                border: `1px solid ${activeChip === chip ? "rgba(201,168,76,0.5)" : "var(--border2)"}`,
                background: activeChip === chip ? "rgba(201,168,76,0.1)" : "transparent",
                color: activeChip === chip ? "var(--gold)" : "var(--text3)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                fontWeight: activeChip === chip ? 600 : 500,
                letterSpacing: "0.02em",
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {[
            { value: "4,800+", label: "Verified vendors" },
            { value: "32K+",   label: "Events planned" },
            { value: "28",     label: "Cities covered" },
            { value: "96%",    label: "Happy clients" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 rounded-2xl px-5 py-3 backdrop-blur-md"
              style={{ border: "1px solid var(--border2)", background: "var(--bg2)" }}>
              <span style={{ color: "var(--text)", fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em" }}>{s.value}</span>
              <span style={{ color: "var(--text3)", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
        </div>{/* end z-10 content wrapper */}

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="h-10 w-[1px]" style={{ background: "linear-gradient(to bottom, transparent, var(--gold))" }} />
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text3)" }}>Scroll</span>
        </div>
      </section>

      {/* ── Trust marquee ── */}
      <div
        className="overflow-hidden py-5 transition-colors duration-300"
        style={{ borderTop: "1px solid var(--border3)", borderBottom: "1px solid var(--border3)", background: "var(--bg4)" }}
      >
        <div className="marquee-track items-center gap-14">
          {TRUST_LABELS.map((label, i) => (
            <span
              key={i}
              className="shrink-0"
              style={{
                color: "var(--text4)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "9px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.38em",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="px-4 py-24 transition-colors duration-300 md:px-8" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="reveal mb-12 text-center">
            <p style={{ color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: "12px" }}>All Categories</p>
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: "var(--text)" }}>
              Every vendor you need,{" "}
              <em className="italic" style={{ color: "var(--gold)" }}>in one place.</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map(({ name, AnimIcon, count, href }, i) => (
              <Link
                key={name}
                href={href}
                className="reveal group relative overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1.5"
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border2)",
                  transitionDelay: `${i * 50}ms`,
                  boxShadow: "var(--card-shadow)",
                }}
              >
                {/* Scene illustration fills card top */}
                <div className="relative h-44 w-full overflow-hidden">
                  <AnimIcon />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
                    style={{ background: "linear-gradient(to bottom, transparent, var(--bg2))" }}
                  />
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.13), transparent 70%)" }}
                  />
                </div>
                {/* Label */}
                <div className="px-4 pb-4 pt-1">
                  <p style={{ color: "var(--text)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "-0.01em" }}>{name}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p style={{ color: "var(--text3)", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 400 }}>{count} vendors</p>
                    <span style={{ color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em" }}>Explore →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Explore Events ── */}
      <section className="px-4 py-24 transition-colors duration-300 md:px-8" style={{ background: "var(--bg4)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="reveal mb-12 text-center">
            <p style={{ color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: "12px" }}>Explore Events</p>
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: "var(--text)" }}>
              Find your next{" "}
              <em className="italic" style={{ color: "var(--gold)" }}>unforgettable night.</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {EVENT_CATEGORIES.map(({ name, AnimIcon, href }, i) => (
              <Link
                key={name}
                href={href}
                className="reveal group relative overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1.5"
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border2)",
                  transitionDelay: `${i * 40}ms`,
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <AnimIcon />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
                    style={{ background: "linear-gradient(to bottom, transparent, var(--bg2))" }}
                  />
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.10), transparent 70%)" }}
                  />
                </div>
                <div className="px-4 pb-4 pt-1">
                  <p style={{ color: "var(--text)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "-0.01em" }}>{name}</p>
                  <span style={{ color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em" }}>Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Vendors ── */}
      <section className="px-4 py-24 transition-colors duration-300 md:px-8" style={{ background: "var(--bg4)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="reveal mb-10 flex items-end justify-between">
            <div>
              <p style={{ color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: "12px" }}>Featured</p>
              <h2 className="font-display text-4xl md:text-5xl" style={{ color: "var(--text)" }}>Top-rated vendors</h2>
            </div>
            <Link href="/discover"
              className="hidden items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition hover:opacity-80 md:flex"
              style={{ border: "1px solid var(--border)", color: "var(--gold)" }}
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <div className="no-scrollbar flex gap-5 overflow-x-auto pb-4">
            {FEATURED_VENDORS.map((vendor) => (
              <div key={vendor.id}
                className="group w-[280px] shrink-0 overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1"
                style={{ border: "1px solid var(--border2)", background: "var(--bg2)" }}
              >
                <div className="relative h-44 overflow-hidden" style={{ background: "var(--bg3)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={vendor.image} alt={vendor.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {vendor.verified && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold" style={{ background: "var(--gold)", color: "var(--bg)" }}>
                      <BadgeCheck size={9} /> AI Pick
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1">
                    <Star size={10} className="fill-[#c9a84c] text-[#c9a84c]" />
                    <span className="text-xs font-semibold text-white">{vendor.rating}</span>
                    <span className="text-xs text-white/50">({vendor.reviews})</span>
                  </div>
                </div>
                <div className="p-4">
                  <p style={{ color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em" }}>{vendor.category}</p>
                  <h3 className="mt-1 leading-snug" style={{ color: "var(--text)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "-0.01em" }}>{vendor.name}</h3>
                  <p className="mt-1" style={{ color: "var(--text3)", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 400 }}>{vendor.location}</p>
                  <div className="mt-3 flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border3)" }}>
                    <span style={{ color: "var(--text)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "-0.01em" }}>
                      From ₹{vendor.priceFrom.toLocaleString("en-IN")}
                    </span>
                    <Link href={`/vendor/${vendor.id}`}
                      className="rounded-lg px-3 py-1.5 transition hover:opacity-80"
                      style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-4 py-24 transition-colors duration-300 md:px-8" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="reveal mb-14 text-center">
            <p style={{ color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: "12px" }}>Process</p>
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: "var(--text)" }}>
              From dream to <em className="italic" style={{ color: "var(--gold)" }}>done.</em>
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.num} className="reveal rounded-2xl p-7" style={{ border: "1px solid var(--border3)", background: "var(--bg2)", transitionDelay: `${i * 90}ms` }}>
                <span className="font-display text-5xl font-light" style={{ color: "rgba(201,168,76,0.25)" }}>{step.num}</span>
                <h3 className="mt-5" style={{ color: "var(--text)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "-0.01em" }}>{step.title}</h3>
                <p className="mt-2.5 leading-6" style={{ color: "var(--text3)", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 400 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="px-4 py-24 transition-colors duration-300 md:px-8" style={{ background: "var(--bg4)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="reveal mb-14 text-center">
            <p style={{ color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: "12px" }}>Stories</p>
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: "var(--text)" }}>
              Moments of <em className="italic" style={{ color: "var(--gold)" }}>pure joy.</em>
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="reveal rounded-2xl p-7" style={{ border: "1px solid var(--border2)", background: "var(--bg2)", transitionDelay: `${i * 100}ms` }}>
                <div className="mb-5 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={11} className="fill-[#c9a84c] text-[#c9a84c]" />
                  ))}
                </div>
                <blockquote className="font-display text-[1.05rem] italic leading-8" style={{ color: "var(--text2)" }}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-7 flex items-center gap-3 pt-5" style={{ borderTop: "1px solid var(--border3)" }}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold" style={{ background: "rgba(201,168,76,0.12)", color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ color: "var(--text)", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>{t.name}</p>
                    <p className="mt-0.5" style={{ color: "var(--text3)", fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 400 }}>{t.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden px-4 py-28 transition-colors duration-300 md:px-8" style={{ background: "var(--bg)" }}>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <div className="h-[600px] w-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(201,168,76,0.13) 0%, transparent 70%)" }} />
        </div>
        <div className="reveal relative mx-auto max-w-2xl text-center">
          <p style={{ color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: "16px" }}>Get Started</p>
          <h2 className="font-display text-5xl leading-[0.88] md:text-6xl" style={{ color: "var(--text)" }}>
            Your celebration<br />
            <em className="italic" style={{ color: "var(--gold)" }}>starts here.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-sm leading-7" style={{ color: "var(--text3)", fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 400 }}>
            Join thousands of families who&apos;ve discovered their dream vendors on Happy Moments.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/discover"
              className="rounded-full px-8 py-4 transition hover:-translate-y-0.5 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-lt) 100%)", color: "var(--bg)", boxShadow: "0 8px 30px rgba(201,168,76,0.3)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.01em" }}
            >
              Browse Vendors
            </Link>
            <Link href="/auth"
              className="rounded-full px-8 py-4 transition hover:opacity-80"
              style={{ border: "1px solid rgba(201,168,76,0.3)", color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Vendor CTA ── */}
      <section className="px-4 py-24 transition-colors duration-300 md:px-8" style={{ background: "var(--bg4)", borderTop: "1px solid var(--border3)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="reveal overflow-hidden rounded-3xl" style={{ border: "1px solid rgba(201,168,76,0.2)", background: "var(--bg2)" }}>
            <div className="grid md:grid-cols-2">
              {/* Left: text */}
              <div className="flex flex-col justify-center px-10 py-14 md:px-14">
                <p style={{ color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: "16px" }}>
                  For Vendors
                </p>
                <h2 className="font-display text-4xl leading-[1.05] md:text-5xl" style={{ color: "var(--text)" }}>
                  Grow your business<br />
                  <em className="italic" style={{ color: "var(--gold)" }}>with us.</em>
                </h2>
                <p className="mt-5 leading-7 max-w-sm" style={{ color: "var(--text3)", fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 400 }}>
                  Join 4,800+ verified vendors already booking events through Happy Moments. Get discovered by couples and families planning their perfect celebration.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="/vendor/onboarding"
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold transition hover:-translate-y-0.5 hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-lt) 100%)", color: "var(--bg)", fontFamily: "'Inter', sans-serif", fontSize: "13px", boxShadow: "0 8px 24px rgba(201,168,76,0.28)", letterSpacing: "0.01em" }}
                  >
                    List Your Business <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/vendor/login"
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 transition hover:opacity-80"
                    style={{ border: "1px solid rgba(201,168,76,0.3)", color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}
                  >
                    Vendor Sign In
                  </Link>
                </div>
              </div>

              {/* Right: stat grid */}
              <div className="flex items-center justify-center px-10 py-14 md:border-l md:px-14" style={{ borderColor: "rgba(201,168,76,0.12)" }}>
                <div className="grid grid-cols-2 gap-5 w-full max-w-xs">
                  {[
                    { value: "4,800+", label: "Active vendors" },
                    { value: "32K+",   label: "Events booked" },
                    { value: "28",     label: "Cities covered" },
                    { value: "Free",   label: "To list & join" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex flex-col gap-1 rounded-2xl p-5"
                      style={{ border: "1px solid var(--border3)", background: "var(--bg)" }}
                    >
                      <span style={{ color: "var(--text)", fontFamily: "'Inter', sans-serif", fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em" }}>{s.value}</span>
                      <span style={{ color: "var(--text3)", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 400 }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-4 py-16 transition-colors duration-300 md:px-8" style={{ background: "var(--bg4)", borderTop: "1px solid var(--border3)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-10 md:grid-cols-[200px_1fr]">
            <div>
              <Link href="/" className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl font-black"
                  style={{
                    background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-lt) 100%)",
                    color: "var(--bg)",
                    fontSize: "11px",
                    letterSpacing: "0.04em",
                  }}
                >HM</div>
                <div>
                  <p className="brand-text uppercase" style={{ color: "var(--text)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em" }}>Happy Moments</p>
                  <p style={{ color: "var(--text3)", fontSize: "9px", fontFamily: "'Inter', sans-serif", fontWeight: 400, marginTop: "2px" }}>Luxury event marketplace</p>
                </div>
              </Link>
              <p className="mt-5 leading-6" style={{ color: "var(--text3)", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 400 }}>
                Connecting you with the finest event vendors across India.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                { title: "Company", links: [{ label: "About", href: "/" }, { label: "Careers", href: "/" }, { label: "Press", href: "/" }, { label: "Contact", href: "/" }] },
                { title: "Vendors", links: [{ label: "Become a Vendor", href: "/vendor/onboarding" }, { label: "Vendor Sign In", href: "/vendor/login" }, { label: "Verification", href: "/" }, { label: "Pricing", href: "/" }] },
                { title: "Support", links: [{ label: "Help Center", href: "/" }, { label: "Safety", href: "/" }, { label: "Booking Policy", href: "/" }, { label: "Community", href: "/" }] },
                { title: "Legal",   links: [{ label: "Privacy", href: "/" }, { label: "Terms", href: "/" }, { label: "Cookie Settings", href: "/" }] },
              ].map((group) => (
                <div key={group.title}>
                  <p style={{ color: "var(--gold)", fontFamily: "'Inter', sans-serif", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.28em", marginBottom: "16px" }}>{group.title}</p>
                  <ul className="space-y-3">
                    {group.links.map(({ label, href }) => (
                      <li key={label}>
                        <Link href={href} className="transition hover:opacity-80" style={{ color: "var(--text3)", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 400 }}>{label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row" style={{ borderTop: "1px solid var(--border3)" }}>
            <p style={{ color: "var(--text4)", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 400 }}>© {new Date().getFullYear()} Happy Moments India. All rights reserved.</p>
            <div className="flex items-center gap-2" style={{ color: "var(--text4)", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 400 }}>
              <Shield size={11} style={{ color: "var(--gold)" }} /> Verified vendor marketplace
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
