"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search, Star, BadgeCheck, MapPin, X,
  SlidersHorizontal, Grid3X3, Map, Heart,
  ChevronDown, Sparkles, CheckCircle,
} from "lucide-react";
import { getAllVendors, VendorFilters, getVendorCatalogImages } from "@/services/vendors";
import { EmptyVendorsIllustration } from "@/components/illustrations/EmptyVendorsIllustration";
import { Vendor } from "@/lib/supabase";
import MarketingNavbar from "@/components/home/MarketingNavbar";

const CATEGORIES = [
  "Photography", "Venues", "Catering", "Decorators",
  "Makeup", "Event Planners", "Entertainment", "Videography",
];

const CITIES = ["Hyderabad", "Bangalore", "Mumbai", "Delhi NCR", "Chennai", "Jaipur", "Pune", "Kolkata"];

const SORT_OPTIONS = [
  { value: "rating",     label: "Top Rated" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "reviews",    label: "Most Reviewed" },
];

function VendorCard({ vendor }: { vendor: Vendor }) {
  const [liked, setLiked] = useState(false);
  const [coverImg, setCoverImg] = useState<string | null>(
    vendor.cover_image_url || vendor.avatar_url || null
  );

  useEffect(() => {
    if (coverImg) return;
    getVendorCatalogImages(vendor.vendor_id).then((imgs) => {
      if (imgs.length > 0) setCoverImg(imgs[0]);
    });
  }, [vendor.vendor_id, coverImg]);

  const img = coverImg;
  const category = vendor.categories?.[0] || (vendor.category as string) || "Vendor";
  const city = vendor.address?.split(",").pop()?.trim() || "";

  return (
    <div
      className="group relative overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1"
      style={{ background: "var(--bg2)", border: "1px solid var(--border2)" }}
    >
      <div className="relative h-52 overflow-hidden" style={{ background: "var(--bg3)" }}>
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={vendor.brand_name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl font-bold" style={{ color: "var(--text4)" }}>
            {vendor.brand_name[0]}
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />

        {vendor.verified && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold"
            style={{ background: "var(--gold)", color: "var(--bg)" }}>
            <BadgeCheck size={9} /> AI Pick
          </div>
        )}

        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition hover:opacity-90"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <Heart size={14} style={{ color: liked ? "var(--gold)" : "var(--text3)", fill: liked ? "var(--gold)" : "none" }} />
        </button>

        <div className="absolute bottom-3 left-3 flex items-center gap-1">
          <Star size={10} className="fill-[#c9a84c] text-[#c9a84c]" />
          <span className="text-xs font-semibold text-white">{vendor.rating?.toFixed(1) ?? "New"}</span>
          {vendor.review_count && <span className="text-xs text-white/50">({vendor.review_count})</span>}
        </div>
      </div>

      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--gold)" }}>{category}</p>
        <h3 className="mt-1 text-sm font-semibold leading-snug line-clamp-1" style={{ color: "var(--text)" }}>{vendor.brand_name}</h3>
        {city && (
          <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: "var(--text3)" }}>
            <MapPin size={10} /> {city}
          </p>
        )}
        {vendor.caption && (
          <p className="mt-2 text-xs leading-5 line-clamp-2" style={{ color: "var(--text3)" }}>{vendor.caption}</p>
        )}
        <div className="mt-4 flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border3)" }}>
          {vendor.starting_price ? (
            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              ₹{vendor.starting_price.toLocaleString("en-IN")}
              <span className="ml-1 text-xs font-normal" style={{ color: "var(--text3)" }}>onwards</span>
            </span>
          ) : (
            <span className="text-xs" style={{ color: "var(--text3)" }}>Price on request</span>
          )}
          <Link
            href={`/vendor/${vendor.slug || vendor.vendor_id}`}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:opacity-80"
            style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)" }}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl p-4" style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}>
      <div className="h-52 rounded-xl" style={{ background: "var(--bg3)" }} />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-1/3 rounded" style={{ background: "var(--bg3)" }} />
        <div className="h-4 w-2/3 rounded" style={{ background: "var(--bg3)" }} />
        <div className="h-3 w-1/2 rounded" style={{ background: "var(--bg3)" }} />
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "map">("grid");
  const [aiBannerDismissed, setAiBannerDismissed] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [activeSort, setActiveSort] = useState(SORT_OPTIONS[0]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);

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

  const toggle = (arr: string[], setArr: (a: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const clearFilters = () => {
    setSelectedCategories([]); setSelectedCities([]);
    setVerifiedOnly(false); setAvailableOnly(false);
    setMinPrice(0); setMaxPrice(500000); setSearchQuery("");
  };

  const hasFilters = selectedCategories.length > 0 || selectedCities.length > 0 ||
    verifiedOnly || availableOnly || searchQuery || minPrice > 0 || maxPrice < 500000;

  const chipStyle = (active: boolean) => ({
    borderColor: active ? "rgba(201,168,76,0.5)" : "var(--border2)",
    background:  active ? "rgba(201,168,76,0.12)" : "transparent",
    color:       active ? "var(--gold)" : "var(--text3)",
  });

  const toggleStyle = (active: boolean) => ({
    background: active ? "var(--gold)" : "var(--border2)",
    transition: "background 0.2s",
  });

  const Sidebar = () => (
    <aside className="flex w-full flex-col gap-6 lg:w-[260px] lg:shrink-0">
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "var(--gold)" }}>Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => toggle(selectedCategories, setSelectedCategories, cat)}
              className="rounded-full border px-3 py-1.5 text-xs font-medium transition"
              style={chipStyle(selectedCategories.includes(cat))}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "var(--gold)" }}>Budget Range</p>
        <div className="space-y-3">
          <input type="range" min={0} max={500000} step={5000} value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full accent-[#c9a84c]" />
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--text3)" }}>
            <span>₹{minPrice.toLocaleString("en-IN")}</span>
            <span>₹{maxPrice.toLocaleString("en-IN")}</span>
          </div>
          <input type="range" min={0} max={500000} step={5000} value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#c9a84c]" />
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "var(--gold)" }}>City</p>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <button key={city} onClick={() => toggle(selectedCities, setSelectedCities, city)}
              className="rounded-full border px-3 py-1.5 text-xs font-medium transition"
              style={chipStyle(selectedCities.includes(city))}>
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "var(--gold)" }}>Preferences</p>
        {[
          { label: "Verified only",       value: verifiedOnly,  set: setVerifiedOnly },
          { label: "Currently available", value: availableOnly, set: setAvailableOnly },
        ].map(({ label, value, set }) => (
          <label key={label} className="flex cursor-pointer items-center justify-between">
            <span className="text-xs" style={{ color: "var(--text2)" }}>{label}</span>
            <div onClick={() => set(!value)} className="relative h-5 w-9 rounded-full transition-colors cursor-pointer"
              style={toggleStyle(value)}>
              <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform"
                style={{ transform: value ? "translateX(16px)" : "translateX(2px)" }} />
            </div>
          </label>
        ))}
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="flex items-center gap-2 text-xs font-semibold underline transition hover:opacity-70"
          style={{ color: "var(--text3)" }}>
          <X size={12} /> Clear all filters
        </button>
      )}
    </aside>
  );

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: "var(--bg)" }}>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
        <MarketingNavbar />
      </header>

      <div className="mx-auto max-w-[1480px] px-4 pt-24 pb-16 md:px-8">
        {/* Search bar */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }} />
            <input
              type="text" placeholder="Search vendors, categories, cities..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none transition"
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border2)",
                color: "var(--text)",
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X size={14} style={{ color: "var(--text3)" }} />
              </button>
            )}
          </div>

          <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold transition lg:hidden"
            style={{ background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--text2)" }}>
            <SlidersHorizontal size={14} /> Filters
            {hasFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold"
                style={{ background: "var(--gold)", color: "var(--bg)" }}>
                {selectedCategories.length + selectedCities.length + (verifiedOnly ? 1 : 0)}
              </span>
            )}
          </button>

          <div className="relative">
            <button onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold transition hover:opacity-80"
              style={{ background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--text2)" }}>
              {activeSort.label} <ChevronDown size={13} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-xl shadow-lg"
                style={{ background: "var(--bg2)", border: "1px solid var(--border2)" }}>
                {SORT_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => { setActiveSort(opt); setSortOpen(false); }}
                    className="flex w-full items-center justify-between px-4 py-3 text-xs transition hover:opacity-80"
                    style={{ color: activeSort.value === opt.value ? "var(--gold)" : "var(--text2)" }}>
                    {opt.label}
                    {activeSort.value === opt.value && <CheckCircle size={12} style={{ color: "var(--gold)" }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center rounded-xl p-1" style={{ border: "1px solid var(--border2)", background: "var(--bg2)" }}>
            {(["grid", "map"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition"
                style={{
                  background: view === v ? "rgba(201,168,76,0.12)" : "transparent",
                  color: view === v ? "var(--gold)" : "var(--text3)",
                }}>
                {v === "grid" ? <Grid3X3 size={13} /> : <Map size={13} />}
                <span className="hidden sm:inline capitalize">{v}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI banner */}
        {!aiBannerDismissed && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl px-5 py-4"
            style={{ border: "1px solid var(--border)", background: "rgba(201,168,76,0.06)" }}>
            <Sparkles size={16} style={{ color: "var(--gold)" }} className="shrink-0" />
            <p className="flex-1 text-xs" style={{ color: "var(--text2)" }}>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>AI Curated</span> — Results ranked by portfolio quality, response rate, and event-style compatibility.
            </p>
            <button onClick={() => setAiBannerDismissed(true)}>
              <X size={14} style={{ color: "var(--text3)" }} />
            </button>
          </div>
        )}

        <div className="flex gap-8">
          <div className="hidden lg:block"><Sidebar /></div>

          {/* Mobile sidebar */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)}>
              <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.5)" }} />
              <div className="absolute inset-y-0 left-0 w-80 overflow-y-auto p-6" style={{ background: "var(--bg2)" }}
                onClick={(e) => e.stopPropagation()}>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Filters</p>
                  <button onClick={() => setMobileSidebarOpen(false)}><X size={18} style={{ color: "var(--text3)" }} /></button>
                </div>
                <Sidebar />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="mb-5">
              <p className="text-xs" style={{ color: "var(--text3)" }}>
                {loading ? "Searching..." : `${vendors.length} vendor${vendors.length !== 1 ? "s" : ""} found`}
              </p>
            </div>

            {view === "map" ? (
              <div className="flex h-[600px] items-center justify-center rounded-2xl"
                style={{ border: "1px solid var(--border2)", background: "var(--bg2)" }}>
                <div className="text-center">
                  <Map size={40} className="mx-auto mb-4" style={{ color: "var(--text3)" }} />
                  <p className="text-sm font-semibold" style={{ color: "var(--text2)" }}>Interactive Map</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text3)" }}>Explore vendors by location</p>
                </div>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : vendors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-40 h-40 mb-2" style={{ color: "var(--gold)" }}>
                  <EmptyVendorsIllustration className="overflow-visible" />
                </div>
                <h3 className="text-base font-semibold" style={{ color: "var(--text)" }}>No vendors found</h3>
                <p className="mt-2 max-w-xs text-xs" style={{ color: "var(--text3)" }}>
                  Try adjusting your filters or search query to discover more vendors.
                </p>
                {hasFilters && (
                  <button onClick={clearFilters} className="mt-5 rounded-full px-5 py-2.5 text-xs font-semibold transition hover:opacity-80"
                    style={{ background: "rgba(201,168,76,0.12)", color: "var(--gold)" }}>
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {vendors.map((v) => <VendorCard key={v.vendor_id} vendor={v} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
