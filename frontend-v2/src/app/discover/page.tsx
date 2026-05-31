"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Search, Star, BadgeCheck, MapPin, X,
  SlidersHorizontal, Grid3X3, Map, Bookmark,
  ChevronDown, Sparkles, CheckCircle,
  Camera, Building2, UtensilsCrossed, Palette,
  Smile, ClipboardList, Music2, Video,
  Filter, TrendingUp, Gem,
  DollarSign, Globe, Sliders,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllVendors, VendorFilters, getVendorCatalogImages } from "@/services/vendors";
import { EmptyVendorsIllustration } from "@/components/illustrations/EmptyVendorsIllustration";
import { Vendor } from "@/lib/supabase";
import MarketingNavbar from "@/components/home/MarketingNavbar";

const CATEGORIES = [
  { name: "Photography",    icon: Camera },
  { name: "Venues",         icon: Building2 },
  { name: "Catering",       icon: UtensilsCrossed },
  { name: "Decorators",     icon: Palette },
  { name: "Makeup",         icon: Smile },
  { name: "Event Planners", icon: ClipboardList },
  { name: "Entertainment",  icon: Music2 },
  { name: "Videography",    icon: Video },
];

const CITIES = ["Hyderabad", "Bangalore", "Mumbai", "Delhi NCR", "Chennai", "Jaipur", "Pune", "Kolkata"];

const SORT_OPTIONS = [
  { value: "rating",     label: "Top Rated",          icon: Star },
  { value: "price_asc",  label: "Price: Low → High",  icon: TrendingUp },
  { value: "price_desc", label: "Price: High → Low",  icon: TrendingUp },
  { value: "reviews",    label: "Most Reviewed",       icon: CheckCircle },
];

/* ─── Vendor Card ──────────────────────────────────────────────────────────── */
function VendorCard({ vendor, index }: { vendor: Vendor; index: number }) {
  const [saved, setSaved]       = useState(false);
  const [coverImg, setCoverImg] = useState<string | null>(
    vendor.cover_image_url || vendor.avatar_url || null
  );

  useEffect(() => {
    if (coverImg) return;
    getVendorCatalogImages(vendor.vendor_id).then((imgs) => {
      if (imgs.length > 0) setCoverImg(imgs[0]);
    });
  }, [vendor.vendor_id, coverImg]);

  const category = vendor.categories?.[0] || (vendor.category as string) || "Vendor";
  const city     = vendor.address?.split(",").pop()?.trim() || "";
  const rating   = vendor.rating?.toFixed(1);
  const href     = `/vendor/${vendor.slug || vendor.vendor_id}`;

  /* Zomato-style green rating badge bg */
  const ratingBg = "#1a6621";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group flex flex-col overflow-hidden rounded-[18px] cursor-pointer"
      style={{ background: "var(--bg2)" }}
    >
      <Link href={href} className="contents">
        {/* ── IMAGE ── */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
          {coverImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImg}
              alt={vendor.brand_name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-5xl font-bold"
              style={{ background: "linear-gradient(135deg, var(--bg3), var(--border2))", color: "var(--text4)" }}
            >
              {vendor.brand_name[0]}
            </div>
          )}

          {/* Subtle top scrim so badges are always readable */}
          <div
            className="absolute inset-x-0 top-0 h-20 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)" }}
          />

          {/* Top-left: verified / featured badge */}
          {vendor.verified && (
            <div
              className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ background: "rgba(88,28,235,0.88)", backdropFilter: "blur(6px)" }}
            >
              <Gem size={9} className="text-white" />
              <span className="text-[10px] font-bold text-white tracking-wide">AI Pick</span>
            </div>
          )}

          {/* Top-right: save/bookmark (square-ish, Zomato style) */}
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSaved(!saved); }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Bookmark
              size={15}
              style={{
                color: saved ? "var(--gold)" : "rgba(255,255,255,0.85)",
                fill: saved ? "var(--gold)" : "none",
                transition: "all 0.18s",
              }}
            />
          </motion.button>

          {/* Bottom promo strip — full-width, pinned to bottom of image */}
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-4 py-2.5"
            style={{ background: "rgba(88,28,235,0.88)", backdropFilter: "blur(2px)" }}
          >
            <Gem size={10} className="text-white/80 shrink-0" />
            <p className="text-[11px] font-semibold text-white truncate">
              {vendor.starting_price
                ? `Starting ₹${vendor.starting_price.toLocaleString("en-IN")}`
                : vendor.verified
                ? "Verified Professional"
                : "Get a personalised quote"}
            </p>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="px-3.5 pt-3 pb-3.5 flex flex-col gap-1.5">
          {/* Name */}
          <h3 className="text-[15px] font-bold leading-snug line-clamp-1" style={{ color: "var(--text)" }}>
            {vendor.brand_name}
          </h3>

          {/* Rating + category + price */}
          <div className="flex items-center gap-2 flex-wrap">
            {rating && (
              <div
                className="flex items-center gap-1 rounded-md px-2 py-0.5"
                style={{ background: ratingBg }}
              >
                <Star size={10} className="text-white" style={{ fill: "white" }} />
                <span className="text-[11px] font-bold text-white">{rating}</span>
                {vendor.review_count ? (
                  <span className="text-[10px] text-white/60">({vendor.review_count})</span>
                ) : null}
              </div>
            )}
            {!rating && (
              <div
                className="flex items-center gap-1 rounded-md px-2 py-0.5"
                style={{ background: "rgba(201,168,76,0.18)" }}
              >
                <span className="text-[11px] font-semibold" style={{ color: "var(--gold)" }}>New</span>
              </div>
            )}
            <span className="text-[11px]" style={{ color: "var(--text4)" }}>•</span>
            <span className="text-[12px]" style={{ color: "var(--text3)" }}>{category}</span>
            {vendor.starting_price && (
              <>
                <span className="text-[11px]" style={{ color: "var(--text4)" }}>•</span>
                <span className="text-[12px]" style={{ color: "var(--text3)" }}>
                  ₹{vendor.starting_price.toLocaleString("en-IN")} onwards
                </span>
              </>
            )}
          </div>

          {/* Location */}
          {city && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin size={11} style={{ color: "var(--text4)", flexShrink: 0 }} />
              <span className="text-[12px]" style={{ color: "var(--text4)" }}>{city}</span>
              {vendor.verified && (
                <>
                  <span className="text-[11px]" style={{ color: "var(--text4)" }}>•</span>
                  <BadgeCheck size={12} style={{ color: "var(--gold)" }} />
                  <span className="text-[11px]" style={{ color: "var(--gold)" }}>Verified</span>
                </>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Skeleton ─────────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[18px] animate-pulse" style={{ background: "var(--bg2)" }}>
      {/* Image area with fake promo strip */}
      <div className="relative" style={{ aspectRatio: "16/10", background: "var(--bg3)" }}>
        <div className="absolute bottom-0 left-0 right-0 h-9" style={{ background: "rgba(88,28,235,0.3)" }} />
      </div>
      {/* Content */}
      <div className="px-3.5 pt-3 pb-3.5 space-y-2.5">
        <div className="h-4 w-3/5 rounded-lg" style={{ background: "var(--bg3)" }} />
        <div className="flex items-center gap-2">
          <div className="h-5 w-10 rounded-md" style={{ background: "var(--bg3)" }} />
          <div className="h-3 w-24 rounded-md" style={{ background: "var(--bg3)" }} />
        </div>
        <div className="h-3 w-2/5 rounded-md" style={{ background: "var(--bg3)" }} />
      </div>
    </div>
  );
}

/* ─── Sidebar ──────────────────────────────────────────────────────────────── */
interface SidebarProps {
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;
  selectedCities: string[];
  setSelectedCities: (v: string[]) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (v: boolean) => void;
  availableOnly: boolean;
  setAvailableOnly: (v: boolean) => void;
  minPrice: number;
  setMinPrice: (v: number) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  hasFilters: boolean;
  clearFilters: () => void;
}

function Sidebar({
  selectedCategories, setSelectedCategories,
  selectedCities, setSelectedCities,
  verifiedOnly, setVerifiedOnly,
  availableOnly, setAvailableOnly,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  hasFilters, clearFilters,
}: SidebarProps) {
  const toggle = (arr: string[], setArr: (a: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const SectionLabel = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
    <div className="mb-4 flex items-center gap-2">
      <div
        className="flex h-6 w-6 items-center justify-center rounded-md"
        style={{ background: "rgba(201,168,76,0.12)" }}
      >
        <Icon size={12} style={{ color: "var(--gold)" }} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--text2)" }}>
        {label}
      </p>
    </div>
  );

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <div
      onClick={onChange}
      className="relative h-5 w-9 cursor-pointer rounded-full flex-shrink-0 transition-colors duration-200"
      style={{ background: value ? "var(--gold)" : "var(--border2)" }}
    >
      <span
        className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
        style={{
          transform: value ? "translateX(16px)" : "translateX(2px)",
          transition: "transform 0.2s ease",
        }}
      />
    </div>
  );

  return (
    <aside
      className="flex w-full flex-col gap-7 lg:w-[240px] lg:shrink-0 rounded-2xl p-5"
      style={{ background: "var(--bg2)", border: "1px solid var(--border2)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: "var(--gold)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>Filters</span>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-[10px] font-semibold transition hover:opacity-70"
            style={{ color: "var(--text3)" }}
          >
            <X size={10} /> Reset
          </button>
        )}
      </div>

      <div className="h-px" style={{ background: "var(--border3)" }} />

      {/* Categories */}
      <div>
        <SectionLabel icon={Grid3X3} label="Category" />
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map(({ name, icon: Icon }) => {
            const active = selectedCategories.includes(name);
            return (
              <button
                key={name}
                onClick={() => toggle(selectedCategories, setSelectedCategories, name)}
                className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center transition-all"
                style={{
                  background: active ? "rgba(201,168,76,0.14)" : "var(--bg3)",
                  border: active ? "1px solid rgba(201,168,76,0.5)" : "1px solid transparent",
                  color: active ? "var(--gold)" : "var(--text3)",
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span className="text-[10px] font-medium leading-tight">{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px" style={{ background: "var(--border3)" }} />

      {/* Budget */}
      <div>
        <SectionLabel icon={DollarSign} label="Budget Range" />
        <div className="space-y-4">
          <div className="flex gap-2">
            <div
              className="flex-1 rounded-xl px-3 py-2.5 text-center"
              style={{ background: "var(--bg3)", border: "1px solid var(--border3)" }}
            >
              <p className="text-[9px] font-medium uppercase tracking-wider mb-0.5" style={{ color: "var(--text4)" }}>Min</p>
              <p className="text-xs font-bold" style={{ color: "var(--text)" }}>
                ₹{minPrice.toLocaleString("en-IN")}
              </p>
            </div>
            <div
              className="flex-1 rounded-xl px-3 py-2.5 text-center"
              style={{ background: "var(--bg3)", border: "1px solid var(--border3)" }}
            >
              <p className="text-[9px] font-medium uppercase tracking-wider mb-0.5" style={{ color: "var(--text4)" }}>Max</p>
              <p className="text-xs font-bold" style={{ color: "var(--text)" }}>
                {maxPrice === 500000 ? "Any" : `₹${maxPrice.toLocaleString("en-IN")}`}
              </p>
            </div>
          </div>
          <div className="space-y-2.5 px-1">
            <input
              type="range" min={0} max={500000} step={5000} value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#c9a84c]"
              style={{ accentColor: "#c9a84c" }}
            />
            <input
              type="range" min={0} max={500000} step={5000} value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#c9a84c" }}
            />
          </div>
        </div>
      </div>

      <div className="h-px" style={{ background: "var(--border3)" }} />

      {/* Cities */}
      <div>
        <SectionLabel icon={Globe} label="City" />
        <div className="flex flex-wrap gap-1.5">
          {CITIES.map((city) => {
            const active = selectedCities.includes(city);
            return (
              <button
                key={city}
                onClick={() => toggle(selectedCities, setSelectedCities, city)}
                className="rounded-full px-3 py-1.5 text-[11px] font-medium transition-all"
                style={{
                  background: active ? "rgba(201,168,76,0.14)" : "var(--bg3)",
                  border: active ? "1px solid rgba(201,168,76,0.5)" : "1px solid var(--border3)",
                  color: active ? "var(--gold)" : "var(--text3)",
                }}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px" style={{ background: "var(--border3)" }} />

      {/* Preferences */}
      <div>
        <SectionLabel icon={Sliders} label="Preferences" />
        <div className="space-y-3.5">
          {[
            { label: "Verified vendors only", sub: "Vetted & quality assured", value: verifiedOnly, set: setVerifiedOnly },
            { label: "Currently available",   sub: "Open for new bookings",    value: availableOnly, set: setAvailableOnly },
          ].map(({ label, sub, value, set }) => (
            <label key={label} className="flex cursor-pointer items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium leading-tight" style={{ color: "var(--text2)" }}>{label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--text4)" }}>{sub}</p>
              </div>
              <Toggle value={value} onChange={() => set(!value)} />
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function DiscoverPage() {
  const [vendors, setVendors]   = useState<Vendor[]>([]);
  const [loading, setLoading]   = useState(true);
  const [view, setView]         = useState<"grid" | "map">("grid");
  const [aiBannerDismissed, setAiBannerDismissed] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [activeSort, setActiveSort] = useState(SORT_OPTIONS[0]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery]             = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities]       = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly]           = useState(false);
  const [availableOnly, setAvailableOnly]         = useState(false);
  const [minPrice, setMinPrice]                   = useState(0);
  const [maxPrice, setMaxPrice]                   = useState(500000);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    const filters: VendorFilters = {
      category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
      city:     selectedCities.length === 1 ? selectedCities[0] : undefined,
      verified: verifiedOnly || undefined,
      search:   searchQuery || undefined,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice < 500000 ? maxPrice : undefined,
    };
    const data = await getAllVendors(filters);
    setVendors(data);
    setLoading(false);
  }, [selectedCategories, selectedCities, verifiedOnly, availableOnly, searchQuery, minPrice, maxPrice]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const clearFilters = () => {
    setSelectedCategories([]); setSelectedCities([]);
    setVerifiedOnly(false); setAvailableOnly(false);
    setMinPrice(0); setMaxPrice(500000); setSearchQuery("");
  };

  const hasFilters = selectedCategories.length > 0 || selectedCities.length > 0 ||
    verifiedOnly || availableOnly || !!searchQuery || minPrice > 0 || maxPrice < 500000;

  const activeFilterCount = selectedCategories.length + selectedCities.length +
    (verifiedOnly ? 1 : 0) + (availableOnly ? 1 : 0);

  const sidebarProps = {
    selectedCategories, setSelectedCategories,
    selectedCities, setSelectedCities,
    verifiedOnly, setVerifiedOnly,
    availableOnly, setAvailableOnly,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    hasFilters, clearFilters,
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
        <MarketingNavbar />
      </header>

      <div className="mx-auto max-w-[1480px] px-4 pt-28 pb-20 md:px-8">

        {/* ── Hero heading ── */}
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: "var(--gold)" }}>
            Vendor Marketplace
          </p>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text)" }}>
            Find Your Perfect Vendor
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text3)" }}>
            Curated professionals for every celebration
          </p>
        </div>

        {/* ── Search + toolbar ── */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text4)" }} />
            <input
              type="text"
              placeholder="Search vendors, categories, cities…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl py-3.5 pl-11 pr-10 text-sm focus:outline-none transition-all"
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border2)",
                color: "var(--text)",
              }}
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X size={13} style={{ color: "var(--text3)" }} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="relative flex items-center gap-2 rounded-2xl px-4 py-3.5 text-xs font-semibold transition lg:hidden"
            style={{ background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--text2)" }}
          >
            <SlidersHorizontal size={14} /> Filters
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
                style={{ background: "var(--gold)", color: "#000" }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 rounded-2xl px-4 py-3.5 text-xs font-semibold transition hover:opacity-80"
              style={{ background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--text2)" }}
            >
              <activeSort.icon size={13} style={{ color: "var(--gold)" }} />
              {activeSort.label}
              <ChevronDown
                size={13}
                style={{
                  transform: sortOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                  color: "var(--text3)",
                }}
              />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-2xl shadow-2xl"
                  style={{ background: "var(--bg2)", border: "1px solid var(--border2)" }}
                >
                  {SORT_OPTIONS.map((opt) => {
                    const active = activeSort.value === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => { setActiveSort(opt); setSortOpen(false); }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-xs transition hover:opacity-80"
                        style={{
                          background: active ? "rgba(201,168,76,0.08)" : "transparent",
                          color: active ? "var(--gold)" : "var(--text2)",
                          borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent",
                        }}
                      >
                        <opt.icon size={12} />
                        {opt.label}
                        {active && <CheckCircle size={11} className="ml-auto" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View toggle */}
          <div
            className="flex items-center rounded-2xl p-1 gap-0.5"
            style={{ border: "1px solid var(--border2)", background: "var(--bg2)" }}
          >
            {(["grid", "map"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all"
                style={{
                  background: view === v ? "rgba(201,168,76,0.14)" : "transparent",
                  color: view === v ? "var(--gold)" : "var(--text3)",
                }}
              >
                {v === "grid" ? <Grid3X3 size={13} /> : <Map size={13} />}
                <span className="hidden sm:inline capitalize">{v}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── AI banner ── */}
        <AnimatePresence>
          {!aiBannerDismissed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="mb-5 flex items-center gap-3 rounded-2xl px-5 py-4"
                style={{
                  background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.03) 100%)",
                  border: "1px solid rgba(201,168,76,0.2)",
                }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0"
                  style={{ background: "rgba(201,168,76,0.15)" }}
                >
                  <Sparkles size={15} style={{ color: "var(--gold)" }} />
                </div>
                <p className="flex-1 text-xs" style={{ color: "var(--text2)" }}>
                  <span className="font-semibold" style={{ color: "var(--gold)" }}>AI Curated</span>
                  {" "}— Results ranked by portfolio quality, response rate & event-style compatibility.
                </p>
                <button onClick={() => setAiBannerDismissed(true)}>
                  <X size={14} style={{ color: "var(--text4)" }} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Active filter chips ── */}
        <AnimatePresence>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text4)" }}>
                  Active:
                </span>
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== cat))}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition hover:opacity-80"
                    style={{ background: "rgba(201,168,76,0.14)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.3)" }}
                  >
                    {cat} <X size={9} />
                  </button>
                ))}
                {selectedCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCities(selectedCities.filter((c) => c !== city))}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition hover:opacity-80"
                    style={{ background: "rgba(201,168,76,0.14)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.3)" }}
                  >
                    <MapPin size={9} /> {city} <X size={9} />
                  </button>
                ))}
                {verifiedOnly && (
                  <button
                    onClick={() => setVerifiedOnly(false)}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition hover:opacity-80"
                    style={{ background: "rgba(201,168,76,0.14)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.3)" }}
                  >
                    <BadgeCheck size={9} /> Verified <X size={9} />
                  </button>
                )}
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-semibold underline transition hover:opacity-70"
                  style={{ color: "var(--text4)" }}
                >
                  Clear all
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Zomato-style horizontal quick-filter chips ── */}
        <div className="mb-6 -mx-4 md:-mx-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 md:px-8 pb-1">
            <button
              onClick={() => setSelectedCategories([])}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all"
              style={{
                background: selectedCategories.length === 0 ? "var(--gold)" : "var(--bg2)",
                color: selectedCategories.length === 0 ? "#000" : "var(--text2)",
                border: selectedCategories.length === 0 ? "none" : "1px solid var(--border2)",
              }}
            >
              All Vendors
            </button>
            {CATEGORIES.map(({ name, icon: Icon }) => {
              const active = selectedCategories.includes(name);
              return (
                <button
                  key={name}
                  onClick={() =>
                    setSelectedCategories(
                      active ? selectedCategories.filter((c) => c !== name) : [...selectedCategories, name]
                    )
                  }
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all"
                  style={{
                    background: active ? "rgba(201,168,76,0.14)" : "var(--bg2)",
                    color: active ? "var(--gold)" : "var(--text2)",
                    border: active ? "1px solid rgba(201,168,76,0.4)" : "1px solid var(--border2)",
                  }}
                >
                  <Icon size={12} />
                  {name}
                </button>
              );
            })}
            {/* Quick: Verified */}
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all"
              style={{
                background: verifiedOnly ? "rgba(201,168,76,0.14)" : "var(--bg2)",
                color: verifiedOnly ? "var(--gold)" : "var(--text2)",
                border: verifiedOnly ? "1px solid rgba(201,168,76,0.4)" : "1px solid var(--border2)",
              }}
            >
              <BadgeCheck size={12} /> Verified only
            </button>
          </div>
        </div>

        {/* ── Layout: sidebar + grid ── */}
        <div className="flex gap-7 items-start">
          {/* Desktop sidebar */}
          <div className="hidden lg:block sticky top-28 self-start">
            <Sidebar {...sidebarProps} />
          </div>

          {/* Mobile sidebar drawer */}
          <AnimatePresence>
            {mobileSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 lg:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.5)" }} />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                  className="absolute inset-y-0 left-0 w-[300px] overflow-y-auto p-5"
                  style={{ background: "var(--bg)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Filters</p>
                    <button onClick={() => setMobileSidebarOpen(false)}>
                      <X size={18} style={{ color: "var(--text3)" }} />
                    </button>
                  </div>
                  <Sidebar {...sidebarProps} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: "var(--text3)" }}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "var(--gold)" }} />
                    Searching…
                  </span>
                ) : (
                  <>
                    <span className="font-bold" style={{ color: "var(--text)" }}>{vendors.length}</span>
                    {" "}vendor{vendors.length !== 1 ? "s" : ""} found
                  </>
                )}
              </p>
            </div>

            {/* Map placeholder */}
            {view === "map" ? (
              <div
                className="flex h-[600px] items-center justify-center rounded-2xl"
                style={{ border: "1px solid var(--border2)", background: "var(--bg2)" }}
              >
                <div className="text-center">
                  <Map size={40} className="mx-auto mb-4" style={{ color: "var(--text3)" }} />
                  <p className="text-sm font-semibold" style={{ color: "var(--text2)" }}>Interactive Map</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text3)" }}>Explore vendors by location</p>
                </div>
              </div>

            /* Skeleton */
            ) : loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>

            /* Empty */
            ) : vendors.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-40 h-40 mb-4" style={{ color: "var(--gold)" }}>
                  <EmptyVendorsIllustration className="overflow-visible" />
                </div>
                <h3 className="text-base font-semibold" style={{ color: "var(--text)" }}>No vendors found</h3>
                <p className="mt-2 max-w-xs text-xs" style={{ color: "var(--text3)" }}>
                  Try adjusting your filters or search query to discover more vendors.
                </p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-5 rounded-full px-5 py-2.5 text-xs font-semibold transition hover:opacity-80"
                    style={{ background: "rgba(201,168,76,0.14)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.3)" }}
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>

            /* Grid */
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {vendors.map((v, i) => (
                  <VendorCard key={v.vendor_id} vendor={v} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
