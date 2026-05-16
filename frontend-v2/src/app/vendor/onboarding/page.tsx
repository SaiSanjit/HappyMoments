"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle, ArrowRight, ArrowLeft, Upload,
  X, Star, ImagePlus, Loader2, Building2, Tag,
  Camera, DollarSign, Eye, Globe, Phone, Mail,
  AlertCircle, ShieldCheck,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api-config";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { fetchIndiaGeo } from "@/lib/india-geo";
import type { GeoState } from "@/lib/india-geo";

const STEPS = [
  {
    num: 1, label: "Business Info", sub: "Your brand details",
    Icon: Building2,
    color: { ring: "#6366f1", bg: "rgba(99,102,241,0.12)", text: "#6366f1", glow: "rgba(99,102,241,0.25)" },
  },
  {
    num: 2, label: "Categories", sub: "Services & coverage",
    Icon: Tag,
    color: { ring: "#f59e0b", bg: "rgba(245,158,11,0.12)", text: "#f59e0b", glow: "rgba(245,158,11,0.25)" },
  },
  {
    num: 3, label: "Portfolio", sub: "Your best work",
    Icon: Camera,
    color: { ring: "#ec4899", bg: "rgba(236,72,153,0.12)", text: "#ec4899", glow: "rgba(236,72,153,0.25)" },
  },
  {
    num: 4, label: "Pricing", sub: "Packages & rates",
    Icon: DollarSign,
    color: { ring: "#14b8a6", bg: "rgba(20,184,166,0.12)", text: "#14b8a6", glow: "rgba(20,184,166,0.25)" },
  },
  {
    num: 5, label: "Preview", sub: "Review & submit",
    Icon: Eye,
    color: { ring: "#c9a84c", bg: "rgba(201,168,76,0.12)", text: "#c9a84c", glow: "rgba(201,168,76,0.25)" },
  },
];

const CATEGORIES = [
  "Photography", "Videography", "Venues", "Catering", "Decorators",
  "Makeup", "Event Planners", "Entertainment", "DJ & Sound",
  "Lighting", "Florists", "Invitation Design",
];

// Step 2 chip cities — kept as a static fallback list
const CITIES = [
  "Hyderabad", "Bangalore", "Mumbai", "Delhi", "Chennai",
  "Jaipur", "Pune", "Kolkata", "Ahmedabad", "Kochi",
];

const EVENT_TYPES = [
  "Weddings", "Engagements", "Baby Showers", "Birthdays",
  "Corporate Events", "Anniversaries", "Festivals", "Portraits",
];

const inputCls =
  "w-full rounded-xl border bg-[var(--border3)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text4)] focus:outline-none transition";

const inputStyle = (hasError: boolean) => ({
  borderColor: hasError ? "#f87171" : "var(--border2)",
  ...(hasError ? { boxShadow: "0 0 0 3px rgba(248,113,113,0.1)" } : {}),
});

const labelCls = "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text3)]";

// Validators
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPhone = (v: string) => /^[+]?[\d\s\-().]{8,15}$/.test(v.trim());
const isValidUrl = (v: string) => {
  if (!v.trim()) return true;
  try { new URL(v.startsWith("http") ? v : `https://${v}`); return true; } catch { return false; }
};

interface PortfolioFile {
  file: File;
  preview: string;
}

interface FieldErrors {
  businessName?: string;
  email?: string;
  phone?: string;
  city?: string;
  description?: string;
  years?: string;
  eventsCount?: string;
  website?: string;
  spocName?: string;
}

export default function VendorOnboardingPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { toasts, dismiss, toast } = useToast();

  // Step 1 fields
  const [businessName, setBusinessName] = useState("");
  const [spocName, setSpocName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");

  // Email OTP verification
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [description, setDescription] = useState("");
  const [years, setYears] = useState("");
  const [eventsCount, setEventsCount] = useState("");
  const [website, setWebsite] = useState("");
  const [teamSize, setTeamSize] = useState("");

  // Step 2 fields
  const [selCategories, setSelCategories] = useState<string[]>([]);
  const [selEvents, setSelEvents] = useState<string[]>([]);
  const [selCities, setSelCities] = useState<string[]>([]);

  // Step 3 fields
  const [portfolioFiles, setPortfolioFiles] = useState<PortfolioFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 4 fields
  const [packages, setPackages] = useState([
    { name: "Starter", price: "", inclusions: "" },
    { name: "Classic", price: "", inclusions: "" },
    { name: "Luxury", price: "", inclusions: "" },
  ]);

  // Geo data fetched from API
  const [geoStates, setGeoStates] = useState<GeoState[]>([]);
  const [cityStateMap, setCityStateMap] = useState<Record<string, string>>({});
  const [geoLoading, setGeoLoading] = useState(true);
  const [geoError, setGeoError] = useState(false);

  useEffect(() => {
    fetchIndiaGeo()
      .then(({ states, cityStateMap }) => {
        setGeoStates(states);
        setCityStateMap(cityStateMap);
      })
      .catch(() => setGeoError(true))
      .finally(() => setGeoLoading(false));
  }, []);

  const allStateNames = geoStates.map((s) => s.name);
  const citiesForState = state
    ? (geoStates.find((s) => s.name === state)?.cities ?? [])
    : geoStates.flatMap((s) => s.cities).sort();

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const validateStep1 = (): { valid: boolean; count: number } => {
    const errs: FieldErrors = {};
    if (!businessName.trim()) errs.businessName = "What's your brand called? ✨";
    if (!spocName.trim()) errs.spocName = "Who should we contact? 👋";
    if (!email.trim()) errs.email = "We'll need your email 📬";
    else if (!isValidEmail(email)) errs.email = "Hmm, that email looks off 🤔";
    else if (!emailVerified) errs.email = "Please verify your email to continue ✉️";
    if (!phone.trim()) errs.phone = "Add a number we can reach you on 📱";
    else if (!isValidPhone(phone)) errs.phone = "That doesn't look like a valid number";
    if (!city.trim()) errs.city = "Pick your city 📍";
    if (!description.trim()) errs.description = "Tell us a little about yourself 🌟";
    else if (description.trim().length < 30) errs.description = "A tiny bit more — 30 chars min 💬";
    if (years && (isNaN(Number(years)) || Number(years) < 0 || Number(years) > 60))
      errs.years = "Between 0 and 60 years please";
    if (eventsCount && (isNaN(Number(eventsCount)) || Number(eventsCount) < 0))
      errs.eventsCount = "Should be a positive number";
    if (website && !isValidUrl(website)) errs.website = "Paste a valid URL (e.g. https://…)";
    setFieldErrors(errs);
    return { valid: Object.keys(errs).length === 0, count: Object.keys(errs).length };
  };

  const sendEmailOtp = async () => {
    if (!isValidEmail(email)) return;
    setOtpSending(true);
    setOtpError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/email/send-vendor-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: spocName }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setOtpValue("");
        toast("success", "Code sent!", `Check ${email} for your 6-digit code.`);
      } else {
        setOtpError(data.message || "Failed to send code. Try again.");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (otpValue.length !== 6) return;
    setOtpVerifying(true);
    setOtpError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/email/verify-vendor-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailVerified(true);
        setOtpSent(false);
        setOtpValue("");
        setFieldErrors((p) => ({ ...p, email: undefined }));
        toast("success", "Email verified!", "Your email address has been confirmed.");
      } else {
        setOtpError(data.message || "Incorrect code. Try again.");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      const { valid, count } = validateStep1();
      if (!valid) {
        toast(
          "warning",
          "Almost there — just a few things",
          count === 1
            ? "One field needs a little attention before we continue."
            : `${count} fields need a little attention before we move on.`
        );
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const uploadedUrls: string[] = [];
      const vendorSlug = `${businessName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

      for (const pf of portfolioFiles) {
        const ext = pf.file.name.split(".").pop() ?? "jpg";
        const path = `vendors/${vendorSlug}/portfolio/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from("vendor-assets")
          .upload(path, pf.file, { cacheControl: "3600", upsert: false });
        if (error) throw new Error(`Photo upload failed: ${error.message}`);
        const { data: urlData } = supabase.storage.from("vendor-assets").getPublicUrl(path);
        uploadedUrls.push(urlData.publicUrl);
      }

      const { error: insertError } = await supabase.from("vendor_applications").insert({
        brand_name: businessName,
        spoc_name: spocName,
        email,
        city,
        state,
        phone_number: phone,
        description,
        website: website || null,
        team_size: teamSize ? parseInt(teamSize) : null,
        years_experience: years ? parseInt(years) : null,
        events_completed: eventsCount ? parseInt(eventsCount) : null,
        categories: selCategories,
        event_types: selEvents,
        cities_served: selCities,
        portfolio_urls: uploadedUrls,
        cover_image_url: uploadedUrls[0] ?? null,
        video_url: videoUrl || null,
        instagram: instagram || null,
        packages: packages.filter((p) => p.price),
        status: "pending",
      });

      if (insertError) throw new Error(insertError.message);

      toast("success", "You're all set!", "We've received your application and will be in touch within 24–48 hours.");
      setTimeout(() => setSubmitted(true), 1200);
    } catch (err) {
      toast(
        "warning",
        "Something didn't go through",
        err instanceof Error && err.message
          ? err.message
          : "We couldn't submit your application right now. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const addFiles = useCallback((files: FileList | File[]) => {
    const valid = Array.from(files).filter(
      (f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024
    );
    const newEntries: PortfolioFile[] = valid.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setPortfolioFiles((prev) => [...prev, ...newEntries]);
  }, []);

  const removeFile = (index: number) => {
    setPortfolioFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const FieldError = ({ msg }: { msg?: string }) =>
    msg ? (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-1.5 flex items-center gap-1.5 text-[12px] font-semibold"
        style={{ color: "#ff6b6b" }}
      >
        <AlertCircle size={12} strokeWidth={2.5} style={{ flexShrink: 0 }} /> {msg}
      </motion.p>
    ) : null;

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
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="hidden w-[300px] shrink-0 flex-col lg:flex" style={{ background: "var(--bg2)", borderRight: "1px solid var(--border3)" }}>
        {/* Logo */}
        <div className="px-8 py-7" style={{ borderBottom: "1px solid var(--border3)" }}>
          <Link href="/" className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black"
              style={{ background: "linear-gradient(135deg, #c9a84c 0%, #e8d5a3 100%)", color: "#070503" }}
            >
              HM
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text)" }}>Happy Moments</p>
              <p className="text-[10px]" style={{ color: "var(--text4)" }}>Vendor Portal</p>
            </div>
          </Link>
        </div>

        {/* Step list */}
        <nav className="flex-1 px-5 py-8">
          <p className="mb-6 px-3 text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--text4)" }}>
            Onboarding Steps
          </p>

          <div className="flex flex-col">
            {STEPS.map((s, idx) => {
              const done = step > s.num;
              const active = step === s.num;
              const isLast = idx === STEPS.length - 1;
              const { Icon, color } = s;
              const lineIsFilled = step > s.num + 1 || (step > s.num);

              return (
                <div key={s.num} className="flex gap-3">
                  {/* Left column: icon + connector segment */}
                  <div className="flex w-[42px] shrink-0 flex-col items-center">
                    {/* Icon box */}
                    <motion.div
                      className="relative z-10 flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl"
                      animate={{
                        background: done
                          ? "rgba(74,222,128,0.15)"
                          : active
                          ? color.bg
                          : "var(--border3)",
                        boxShadow: active
                          ? `0 0 0 3px ${color.glow}, 0 4px 16px ${color.glow}`
                          : "none",
                      }}
                      transition={{ duration: 0.35 }}
                      style={{
                        border: `1.5px solid ${done ? "rgba(74,222,128,0.4)" : active ? color.ring : "var(--border2)"}`,
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {done ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          >
                            <CheckCircle size={18} color="#4ade80" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Icon size={18} color={active ? color.text : "var(--text4)"} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Pulse ring for active */}
                      {active && (
                        <>
                          <motion.div
                            className="absolute inset-0 rounded-xl"
                            initial={{ opacity: 0.4, scale: 1 }}
                            animate={{ opacity: 0, scale: 1.6 }}
                            transition={{
                              duration: 2.2,
                              repeat: Infinity,
                              ease: [0.2, 0.0, 0.4, 1.0],
                              repeatDelay: 0.4,
                            }}
                            style={{ border: `1.5px solid ${color.ring}` }}
                          />
                          <motion.div
                            className="absolute inset-0 rounded-xl"
                            initial={{ opacity: 0.25, scale: 1 }}
                            animate={{ opacity: 0, scale: 1.35 }}
                            transition={{
                              duration: 2.2,
                              repeat: Infinity,
                              ease: [0.2, 0.0, 0.4, 1.0],
                              repeatDelay: 0.4,
                              delay: 0.5,
                            }}
                            style={{ border: `1.5px solid ${color.ring}` }}
                          />
                        </>
                      )}
                    </motion.div>

                    {/* Connector segment between this icon and next */}
                    {!isLast && (
                      <div className="relative my-1 w-[2px] flex-1" style={{ background: "var(--border3)", borderRadius: 2, minHeight: 20 }}>
                        <motion.div
                          className="absolute inset-x-0 top-0 rounded-full"
                          style={{ background: lineIsFilled ? "#4ade80" : "transparent" }}
                          animate={{ height: lineIsFilled ? "100%" : "0%" }}
                          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right column: label card */}
                  <div className="flex flex-1 items-start pb-1" style={{ paddingTop: 0 }}>
                    <motion.div
                      className="mb-1 flex w-full items-center gap-2 rounded-2xl px-3 py-2.5"
                      animate={{ background: active ? color.bg : "transparent" }}
                      transition={{ duration: 0.3 }}
                      style={{ minHeight: 42 }}
                    >
                      <div className="flex-1">
                        <motion.p
                          className="text-sm font-semibold leading-tight"
                          animate={{ color: done ? "#4ade80" : active ? color.text : "var(--text4)" }}
                          transition={{ duration: 0.3 }}
                        >
                          {s.label}
                        </motion.p>
                        <motion.p
                          className="mt-0.5 text-[11px] leading-tight"
                          animate={{ color: "var(--text4)", opacity: active || done ? 0.8 : 0.4 }}
                          transition={{ duration: 0.3 }}
                        >
                          {s.sub}
                        </motion.p>
                      </div>
                      {!done && !active && (
                        <span className="text-[10px] font-bold tabular-nums" style={{ color: "var(--text4)", opacity: 0.4 }}>
                          {String(s.num).padStart(2, "0")}
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Progress bar */}
        <div className="px-7 pb-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text4)" }}>Progress</span>
            <motion.span
              className="text-[11px] font-bold tabular-nums"
              style={{ color: STEPS[step - 1].color.text }}
              key={step}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
          <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--border3)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${STEPS[0].color.ring}, ${STEPS[step - 1].color.ring})`,
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>

          {/* Step dots */}
          <div className="mt-3 flex justify-between px-0.5">
            {STEPS.map((s) => (
              <motion.div
                key={s.num}
                className="h-1.5 w-1.5 rounded-full"
                animate={{
                  background: step > s.num ? "#4ade80" : step === s.num ? s.color.ring : "var(--border2)",
                  scale: step === s.num ? 1.4 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────── */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        {/* Mobile step indicator */}
        <div className="flex items-center gap-1.5 border-b border-[var(--border3)] px-4 py-3 lg:hidden">
          {STEPS.map((s) => (
            <motion.div
              key={s.num}
              className="h-1.5 flex-1 rounded-full"
              animate={{
                background: step > s.num ? "#4ade80" : step === s.num ? s.color.ring : "var(--border3)",
              }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </div>

        <div className="mx-auto w-full max-w-2xl px-6 py-12">
          {/* Step header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="mb-10"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Step pill */}
              <motion.div
                className="mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
                style={{
                  background: STEPS[step - 1].color.bg,
                  border: `1px solid ${STEPS[step - 1].color.ring}40`,
                }}
              >
                {(() => { const { Icon } = STEPS[step - 1]; return <Icon size={12} style={{ color: STEPS[step - 1].color.text }} />; })()}
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.25em]"
                  style={{ color: STEPS[step - 1].color.text }}
                >
                  Step {step} of {STEPS.length} — {STEPS[step - 1].label}
                </span>
              </motion.div>

              <h1 className="font-display text-4xl text-[var(--text)]">
                {step === 1 && <>Tell us about your <em className="italic" style={{ color: STEPS[0].color.text }}>business.</em></>}
                {step === 2 && <>What do you <em className="italic" style={{ color: STEPS[1].color.text }}>specialise</em> in?</>}
                {step === 3 && <>Show your <em className="italic" style={{ color: STEPS[2].color.text }}>best work.</em></>}
                {step === 4 && <>Define your <em className="italic" style={{ color: STEPS[3].color.text }}>packages.</em></>}
                {step === 5 && <>Review your <em className="italic" style={{ color: STEPS[4].color.text }}>listing.</em></>}
              </h1>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >

          {/* ── Step 1: Business Info ── */}
          {step === 1 && (
            <div className="space-y-4">

              {/* Business name */}
              <div>
                <label className={labelCls}>
                  Business / Brand name <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                  value={businessName}
                  onChange={(e) => { setBusinessName(e.target.value); setFieldErrors((p) => ({ ...p, businessName: undefined })); }}
                  placeholder="e.g. Luminara Photography"
                  className={inputCls}
                  style={inputStyle(!!fieldErrors.businessName)}
                />
                <FieldError msg={fieldErrors.businessName} />
              </div>

              {/* Contact person */}
              <div>
                <label className={labelCls}>
                  Contact person (SPOC) <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                  value={spocName}
                  onChange={(e) => { setSpocName(e.target.value); setFieldErrors((p) => ({ ...p, spocName: undefined })); }}
                  placeholder="e.g. Ravi Sharma"
                  className={inputCls}
                  style={inputStyle(!!fieldErrors.spocName)}
                />
                <FieldError msg={fieldErrors.spocName} />
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-4">
                {/* Email with OTP verification */}
                <div>
                  <label className={labelCls}>
                    Email address <span style={{ color: "#f87171" }}>*</span>
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: emailVerified ? "#4ade80" : "var(--text4)" }} />
                    <input
                      type="email"
                      value={email}
                      disabled={emailVerified}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailVerified(false);
                        setOtpSent(false);
                        setOtpValue("");
                        setOtpError("");
                        setFieldErrors((p) => ({ ...p, email: undefined }));
                      }}
                      placeholder="you@brand.com"
                      className={inputCls + " pl-9 pr-20"}
                      style={{
                        ...inputStyle(!!fieldErrors.email),
                        ...(emailVerified ? { borderColor: "rgba(74,222,128,0.4)", opacity: 0.8 } : {}),
                      }}
                    />
                    {/* Verify / Verified badge */}
                    {emailVerified ? (
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold"
                        style={{ color: "#4ade80" }}
                      >
                        <ShieldCheck size={12} /> Verified
                      </span>
                    ) : isValidEmail(email) && !otpSent ? (
                      <button
                        type="button"
                        onClick={sendEmailOtp}
                        disabled={otpSending}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-[10px] font-bold transition disabled:opacity-50"
                        style={{ background: "rgba(99,102,241,0.15)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.3)" }}
                      >
                        {otpSending ? <Loader2 size={10} className="animate-spin" /> : "Send OTP"}
                      </button>
                    ) : null}
                  </div>

                  {/* OTP input row */}
                  <AnimatePresence>
                    {otpSent && !emailVerified && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otpValue}
                            onChange={(e) => {
                              setOtpValue(e.target.value.replace(/\D/g, ""));
                              setOtpError("");
                            }}
                            placeholder="6-digit code"
                            className={inputCls + " flex-1 text-center tracking-[0.3em] font-bold text-sm"}
                            style={{ borderColor: otpError ? "#f87171" : "rgba(99,102,241,0.4)", padding: "8px 12px" }}
                          />
                          <button
                            type="button"
                            onClick={verifyEmailOtp}
                            disabled={otpVerifying || otpValue.length !== 6}
                            className="rounded-xl px-4 py-2 text-xs font-bold transition disabled:opacity-40"
                            style={{ background: "#6366f1", color: "#fff" }}
                          >
                            {otpVerifying ? <Loader2 size={12} className="animate-spin" /> : "Verify"}
                          </button>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          {otpError ? (
                            <p className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#f87171" }}>
                              <AlertCircle size={11} /> {otpError}
                            </p>
                          ) : (
                            <p className="text-[11px]" style={{ color: "var(--text4)" }}>Check your inbox for the code</p>
                          )}
                          <button
                            type="button"
                            onClick={sendEmailOtp}
                            disabled={otpSending}
                            className="text-[11px] font-semibold transition hover:opacity-70 disabled:opacity-40"
                            style={{ color: "#6366f1" }}
                          >
                            Resend
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <FieldError msg={fieldErrors.email} />
                </div>

                <div>
                  <label className={labelCls}>
                    Phone / WhatsApp <span style={{ color: "#f87171" }}>*</span>
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text4)" }} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: undefined })); }}
                      placeholder="+91 98765 43210"
                      className={inputCls + " pl-9"}
                      style={inputStyle(!!fieldErrors.phone)}
                    />
                  </div>
                  <FieldError msg={fieldErrors.phone} />
                </div>
              </div>

              {/* City + State */}
              {geoError && (
                <p className="text-xs" style={{ color: "#f87171" }}>
                  Could not load location data. Please check your connection and refresh.
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    City <span style={{ color: "#f87171" }}>*</span>
                  </label>
                  <SelectDropdown
                    placeholder="Select city…"
                    options={citiesForState}
                    value={city}
                    loading={geoLoading}
                    onChange={(val) => {
                      setCity(val);
                      setFieldErrors((p) => ({ ...p, city: undefined }));
                      if (cityStateMap[val]) setState(cityStateMap[val]);
                    }}
                    hasError={!!fieldErrors.city}
                  />
                  <FieldError msg={fieldErrors.city} />
                </div>
                <div>
                  <label className={labelCls}>State</label>
                  <SelectDropdown
                    placeholder="Select state…"
                    options={allStateNames}
                    value={state}
                    loading={geoLoading}
                    onChange={(val) => {
                      setState(val);
                      if (city && cityStateMap[city] !== val) setCity("");
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>
                  Business description <span style={{ color: "#f87171" }}>*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setFieldErrors((p) => ({ ...p, description: undefined })); }}
                  placeholder="Tell clients what makes you unique — your style, approach, and what sets you apart..."
                  rows={4}
                  className={inputCls}
                  style={inputStyle(!!fieldErrors.description)}
                />
                <div className="mt-1 flex items-center justify-between">
                  <FieldError msg={fieldErrors.description} />
                  <span className="ml-auto text-[10px]" style={{ color: description.length < 30 ? "#f87171" : "var(--text4)" }}>
                    {description.length}/30 min
                  </span>
                </div>
              </div>

              {/* Years + Events + Team */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Years of exp.</label>
                  <input
                    type="number"
                    min={0} max={60}
                    value={years}
                    onChange={(e) => { setYears(e.target.value); setFieldErrors((p) => ({ ...p, years: undefined })); }}
                    placeholder="e.g. 7"
                    className={inputCls}
                    style={inputStyle(!!fieldErrors.years)}
                  />
                  <FieldError msg={fieldErrors.years} />
                </div>
                <div>
                  <label className={labelCls}>Events done</label>
                  <input
                    type="number"
                    min={0}
                    value={eventsCount}
                    onChange={(e) => { setEventsCount(e.target.value); setFieldErrors((p) => ({ ...p, eventsCount: undefined })); }}
                    placeholder="e.g. 150"
                    className={inputCls}
                    style={inputStyle(!!fieldErrors.eventsCount)}
                  />
                  <FieldError msg={fieldErrors.eventsCount} />
                </div>
                <div>
                  <label className={labelCls}>Team size</label>
                  <input
                    type="number"
                    min={1}
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    placeholder="e.g. 5"
                    className={inputCls}
                    style={inputStyle(false)}
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className={labelCls}>Website URL <span className="normal-case font-normal" style={{ color: "var(--text4)" }}>(optional)</span></label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text4)" }} />
                  <input
                    value={website}
                    onChange={(e) => { setWebsite(e.target.value); setFieldErrors((p) => ({ ...p, website: undefined })); }}
                    placeholder="https://yourbrand.com"
                    className={inputCls + " pl-9"}
                    style={inputStyle(!!fieldErrors.website)}
                  />
                </div>
                <FieldError msg={fieldErrors.website} />
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
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />

              {/* Upload zone */}
              <div>
                <label className={labelCls}>Portfolio Photos</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-14 text-center transition cursor-pointer"
                  style={{
                    borderColor: isDragging ? "rgba(201,168,76,0.7)" : "rgba(201,168,76,0.2)",
                    background: isDragging ? "rgba(201,168,76,0.07)" : "rgba(201,168,76,0.03)",
                  }}
                >
                  <Upload size={28} className="mb-3 text-[#c9a84c]" />
                  <p className="text-sm font-semibold text-[var(--text)]">Drag & drop photos here</p>
                  <p className="mt-1 text-xs text-[var(--text3)]">PNG, JPG, WEBP up to 10MB each · Min 5 photos recommended</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="mt-4 rounded-full border border-[rgba(201,168,76,0.3)] px-5 py-2 text-xs font-semibold text-[#c9a84c] transition hover:bg-[rgba(201,168,76,0.08)]"
                  >
                    Browse files
                  </button>
                </div>
              </div>

              {/* Thumbnail grid */}
              {portfolioFiles.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text3)]">
                      {portfolioFiles.length} photo{portfolioFiles.length !== 1 ? "s" : ""} selected
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1 text-[10px] font-semibold text-[#c9a84c] transition hover:opacity-70"
                    >
                      <ImagePlus size={12} /> Add more
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                    {portfolioFiles.map((pf, i) => (
                      <div key={i} className="group relative aspect-square overflow-hidden rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pf.preview}
                          alt={`Portfolio ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 rounded-full bg-[#c9a84c] px-1.5 py-0.5 text-[8px] font-bold text-[var(--bg)]">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 opacity-0 transition group-hover:opacity-100"
                        >
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video URL */}
              <div>
                <label className={labelCls}>Showreel / Video URL (optional)</label>
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className={inputCls}
                />
              </div>

              {/* Instagram */}
              <div>
                <label className={labelCls}>Instagram handle (optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text3)]">@</span>
                  <input
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="yourbrand"
                    className={inputCls + " pl-8"}
                  />
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

          </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <motion.button
                onClick={() => setStep(step - 1)}
                disabled={submitting}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition disabled:opacity-40"
                style={{ borderColor: "var(--border2)", color: "var(--text3)" }}
              >
                <ArrowLeft size={14} /> Back
              </motion.button>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-2 text-xs font-semibold transition"
                style={{ color: "var(--text3)" }}
              >
                <ArrowLeft size={13} /> Back to site
              </Link>
            )}

            {step < STEPS.length ? (
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold"
                style={{
                  background: STEPS[step - 1].color.ring,
                  color: "#fff",
                  boxShadow: `0 8px 24px ${STEPS[step - 1].color.glow}`,
                }}
              >
                Continue <ArrowRight size={14} />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={submitting}
                whileHover={submitting ? {} : { scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: STEPS[step - 1].color.ring,
                  color: "#fff",
                  boxShadow: `0 8px 24px ${STEPS[step - 1].color.glow}`,
                }}
              >
                {submitting ? (
                  <><Loader2 size={14} className="animate-spin" /> Submitting…</>
                ) : (
                  <>Submit Listing <CheckCircle size={14} /></>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
