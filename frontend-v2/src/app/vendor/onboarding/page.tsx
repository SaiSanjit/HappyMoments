"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle, ArrowRight, ArrowLeft, Upload,
  Plus, Trash2, X, Star,
} from "lucide-react";

const STEPS = [
  { num: 1, label: "Business Info" },
  { num: 2, label: "Categories" },
  { num: 3, label: "Portfolio" },
  { num: 4, label: "Pricing" },
  { num: 5, label: "Preview" },
];

const CATEGORIES = [
  "Photography", "Videography", "Venues", "Catering", "Decorators",
  "Makeup", "Event Planners", "Entertainment", "DJ & Sound",
  "Lighting", "Florists", "Invitation Design",
];

const CITIES = [
  "Hyderabad", "Bangalore", "Mumbai", "Delhi NCR", "Chennai",
  "Jaipur", "Pune", "Kolkata", "Ahmedabad", "Kochi",
];

const EVENT_TYPES = [
  "Weddings", "Engagements", "Baby Showers", "Birthdays",
  "Corporate Events", "Anniversaries", "Festivals", "Portraits",
];

const inputCls =
  "w-full rounded-xl border border-[var(--border2)] bg-[var(--border3)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text4)] focus:border-[rgba(201,168,76,0.35)] focus:outline-none transition";

const labelCls = "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text3)]";

export default function VendorOnboardingPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 fields
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [years, setYears] = useState("");
  const [eventsCount, setEventsCount] = useState("");

  // Step 2 fields
  const [selCategories, setSelCategories] = useState<string[]>([]);
  const [selEvents, setSelEvents] = useState<string[]>([]);
  const [selCities, setSelCities] = useState<string[]>([]);

  // Step 4 fields
  const [packages, setPackages] = useState([
    { name: "Starter", price: "", inclusions: "" },
    { name: "Classic", price: "", inclusions: "" },
    { name: "Luxury", price: "", inclusions: "" },
  ]);

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const toggle = (arr: string[], setArr: (a: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const ChipGroup = ({
    items,
    selected,
    setSelected,
  }: {
    items: string[];
    selected: string[];
    setSelected: (a: string[]) => void;
  }) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => toggle(selected, setSelected, item)}
          className="rounded-full border px-3 py-1.5 text-xs font-medium transition"
          style={{
            borderColor: selected.includes(item)
              ? "rgba(201,168,76,0.5)"
              : "var(--border2)",
            background: selected.includes(item)
              ? "rgba(201,168,76,0.12)"
              : "transparent",
            color: selected.includes(item) ? "#c9a84c" : "var(--text3)",
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.25)]">
          <CheckCircle size={36} className="text-[#c9a84c]" />
        </div>
        <h1 className="font-display text-4xl text-[var(--text)]">
          You&apos;re on your way!
        </h1>
        <p className="mt-4 max-w-sm text-sm text-[var(--text3)]">
          Your vendor application has been submitted. Our team will review and verify your listing within 24–48 hours.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { num: "1", label: "Application reviewed by team" },
            { num: "2", label: "Portfolio & credentials verified" },
            { num: "3", label: "Listing goes live on marketplace" },
          ].map((s) => (
            <div
              key={s.num}
              className="rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-5"
            >
              <span className="font-display text-3xl text-[rgba(201,168,76,0.3)]">{s.num}</span>
              <p className="mt-2 text-xs text-[var(--text3)]">{s.label}</p>
            </div>
          ))}
        </div>
        <Link
          href="/"
          className="mt-10 rounded-full border border-[rgba(201,168,76,0.25)] px-8 py-3.5 text-sm font-semibold text-[#c9a84c] transition hover:bg-[rgba(201,168,76,0.08)]"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="hidden w-[280px] shrink-0 flex-col border-r border-[var(--border3)] bg-[var(--bg2)] lg:flex">
        <div className="border-b border-[var(--border3)] px-8 py-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c9a84c] text-xs font-bold text-[var(--bg)]">
              HM
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              Happy Moments
            </span>
          </Link>
          <p className="mt-3 text-xs text-[var(--text3)]">Vendor Onboarding</p>
        </div>

        <nav className="flex-1 px-6 py-8">
          <div className="space-y-2">
            {STEPS.map((s) => {
              const done = step > s.num;
              const active = step === s.num;
              return (
                <div key={s.num} className="flex items-center gap-3">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition"
                    style={{
                      background: done
                        ? "rgba(74,222,128,0.15)"
                        : active
                        ? "rgba(201,168,76,0.15)"
                        : "var(--border3)",
                      border: `1px solid ${done ? "rgba(74,222,128,0.3)" : active ? "rgba(201,168,76,0.4)" : "var(--border2)"}`,
                      color: done ? "#4ade80" : active ? "#c9a84c" : "var(--text4)",
                    }}
                  >
                    {done ? <CheckCircle size={13} /> : s.num}
                  </div>
                  <span
                    className="text-xs font-medium transition"
                    style={{ color: active ? "var(--text)" : done ? "var(--text2)" : "var(--text4)" }}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Progress */}
        <div className="px-6 pb-8">
          <div className="mb-2 flex justify-between text-[10px] text-[var(--text3)]">
            <span>Progress</span>
            <span className="text-[#c9a84c]">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border2)]">
            <div
              className="h-full rounded-full bg-[#c9a84c] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────── */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        {/* Mobile step indicator */}
        <div className="flex items-center gap-2 border-b border-[var(--border3)] px-4 py-3 lg:hidden">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{
                background:
                  step > s.num
                    ? "#4ade80"
                    : step === s.num
                    ? "#c9a84c"
                    : "var(--border2)",
              }}
            />
          ))}
        </div>

        <div className="mx-auto w-full max-w-2xl px-6 py-12">
          {/* Step header */}
          <div className="mb-10">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#c9a84c]">
              <span>Step {step} of {STEPS.length}</span>
              <span>—</span>
              <span>{STEPS[step - 1].label}</span>
            </div>
            <h1 className="font-display text-4xl text-[var(--text)]">
              {step === 1 && <>Tell us about your <em className="italic text-[#c9a84c]">business.</em></>}
              {step === 2 && <>What do you <em className="italic text-[#c9a84c]">specialise</em> in?</>}
              {step === 3 && <>Show your <em className="italic text-[#c9a84c]">best work.</em></>}
              {step === 4 && <>Define your <em className="italic text-[#c9a84c]">packages.</em></>}
              {step === 5 && <>Review your <em className="italic text-[#c9a84c]">listing.</em></>}
            </h1>
          </div>

          {/* ── Step 1: Business Info ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Business / Brand name</label>
                <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Luminara Photography" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>City</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Hyderabad" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>State</label>
                  <input value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g. Telangana" className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Phone / WhatsApp number</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Business description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell clients what makes you unique, your style, and experience..."
                  rows={4}
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Years of experience</label>
                  <input value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 7" type="number" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Events completed</label>
                  <input value={eventsCount} onChange={(e) => setEventsCount(e.target.value)} placeholder="e.g. 150" type="number" className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Categories ── */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <label className={labelCls + " mb-3"}>Service Categories</label>
                <ChipGroup items={CATEGORIES} selected={selCategories} setSelected={setSelCategories} />
              </div>
              <div>
                <label className={labelCls + " mb-3"}>Event Types</label>
                <ChipGroup items={EVENT_TYPES} selected={selEvents} setSelected={setSelEvents} />
              </div>
              <div>
                <label className={labelCls + " mb-3"}>Cities Served</label>
                <ChipGroup items={CITIES} selected={selCities} setSelected={setSelCities} />
              </div>
            </div>
          )}

          {/* ── Step 3: Portfolio ── */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Upload zone */}
              <div>
                <label className={labelCls}>Portfolio Photos</label>
                <div
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.03)] px-8 py-14 text-center transition hover:border-[rgba(201,168,76,0.4)] cursor-pointer"
                >
                  <Upload size={28} className="mb-3 text-[#c9a84c]" />
                  <p className="text-sm font-semibold text-[var(--text)]">Drag & drop photos here</p>
                  <p className="mt-1 text-xs text-[var(--text3)]">PNG, JPG up to 10MB each · Min 5 photos recommended</p>
                  <button className="mt-4 rounded-full border border-[rgba(201,168,76,0.3)] px-5 py-2 text-xs font-semibold text-[#c9a84c] transition hover:bg-[rgba(201,168,76,0.08)]">
                    Browse files
                  </button>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className={labelCls}>Showreel / Video URL (optional)</label>
                <input placeholder="https://youtube.com/..." className={inputCls} />
              </div>

              {/* Instagram */}
              <div>
                <label className={labelCls}>Instagram handle (optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text3)]">@</span>
                  <input placeholder="yourbrand" className={inputCls + " pl-8"} />
                </div>
              </div>

              {/* Cover photo note */}
              <div className="rounded-xl border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)] px-4 py-3 text-xs text-[var(--text2)]">
                <span className="font-semibold text-[#c9a84c]">Tip:</span> Your first uploaded photo will be used as the cover image on your vendor card.
              </div>
            </div>
          )}

          {/* ── Step 4: Pricing ── */}
          {step === 4 && (
            <div className="space-y-5">
              {packages.map((pkg, i) => (
                <div key={i} className="rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#c9a84c]">
                      {pkg.name} Package
                    </span>
                    <span className="text-[10px] text-[var(--text4)]">
                      {i === 0 ? "Entry level" : i === 1 ? "Most popular" : "Premium"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Package name</label>
                      <input
                        value={pkg.name}
                        onChange={(e) => {
                          const updated = [...packages];
                          updated[i].name = e.target.value;
                          setPackages(updated);
                        }}
                        placeholder="e.g. Starter"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Price (INR)</label>
                      <input
                        value={pkg.price}
                        onChange={(e) => {
                          const updated = [...packages];
                          updated[i].price = e.target.value;
                          setPackages(updated);
                        }}
                        placeholder="e.g. 50000"
                        type="number"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className={labelCls}>Inclusions (comma-separated)</label>
                    <textarea
                      value={pkg.inclusions}
                      onChange={(e) => {
                        const updated = [...packages];
                        updated[i].inclusions = e.target.value;
                        setPackages(updated);
                      }}
                      placeholder="e.g. 8 hours coverage, 2 photographers, edited album..."
                      rows={2}
                      className={inputCls}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Step 5: Preview ── */}
          {step === 5 && (
            <div className="space-y-6">
              {/* Preview card */}
              <div className="overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.2)] bg-[var(--bg2)]">
                <div className="flex h-48 items-center justify-center bg-[var(--bg3)]">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.08)] text-2xl font-bold text-[#c9a84c]">
                      {businessName?.[0] || "B"}
                    </div>
                    <p className="text-xs text-[var(--text3)]">Cover photo area</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#c9a84c]">
                    {selCategories[0] || "Category"}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--text)]">
                    {businessName || "Your Business Name"}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--text3)]">{city || "City"}</p>
                  <div className="mt-3 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} className="fill-[#c9a84c] text-[#c9a84c]" />
                    ))}
                    <span className="ml-1 text-xs text-[var(--text3)]">New listing</span>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-5">
                <p className="mb-4 text-xs font-semibold text-[var(--text)]">Listing Checklist</p>
                {[
                  { label: "Business name", done: !!businessName },
                  { label: "Categories selected", done: selCategories.length > 0 },
                  { label: "Cities covered", done: selCities.length > 0 },
                  { label: "Pricing added", done: packages.some((p) => p.price) },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-3 py-2">
                    <CheckCircle
                      size={14}
                      className={done ? "text-[#4ade80]" : "text-[var(--text4)]"}
                    />
                    <span className={`text-xs ${done ? "text-[var(--text2)]" : "text-[var(--text4)]"}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[var(--text3)]">
                By submitting, you confirm that all provided information is accurate. Our team will review and verify your listing before it goes live.
              </p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-10 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 rounded-full border border-[var(--border2)] px-5 py-3 text-sm font-semibold text-[var(--text3)] transition hover:border-[rgba(201,168,76,0.3)] hover:text-[var(--text2)]"
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-2 text-xs font-semibold text-[var(--text3)] transition hover:text-[var(--text2)]"
              >
                <ArrowLeft size={13} /> Back to site
              </Link>
            )}

            {step < STEPS.length ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 rounded-full bg-[#c9a84c] px-6 py-3 text-sm font-bold text-[var(--bg)] shadow-[0_8px_24px_rgba(201,168,76,0.25)] transition hover:-translate-y-0.5 hover:bg-[#e8d5a3]"
              >
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                className="flex items-center gap-2 rounded-full bg-[#c9a84c] px-6 py-3 text-sm font-bold text-[var(--bg)] shadow-[0_8px_24px_rgba(201,168,76,0.25)] transition hover:-translate-y-0.5 hover:bg-[#e8d5a3]"
              >
                Submit Listing <CheckCircle size={14} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
