"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Star, Heart, Share2, ShieldCheck, MapPin, MessageSquare,
  Phone, ChevronRight, ArrowLeft, Sparkles, Clock,
  Package, BadgeCheck, ExternalLink, CheckCircle, MessagesSquare,
} from "lucide-react";
import { getVendorBySlug, getVendorCatalogImages } from "@/services/vendors";
import { Vendor } from "@/lib/supabase";
import MarketingNavbar from "@/components/home/MarketingNavbar";

const TABS = ["Overview", "Packages", "Portfolio", "Reviews"] as const;
type Tab = (typeof TABS)[number];

function formatPrice(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function VendorProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [liked, setLiked] = useState(false);
  const [catalogImages, setCatalogImages] = useState<string[]>([]);

  useEffect(() => {
    getVendorBySlug(id).then((data) => {
      if (!data) setNotFound(true);
      else {
        setVendor(data);
        // catalog_images_metadata holds vendor-ordered photos (set via profile editor).
        // It lives on the vendor record but isn't in the Vendor type, so we cast.
        const meta = (data as unknown as Record<string, unknown>).catalog_images_metadata;
        if (Array.isArray(meta) && meta.length > 0) {
          setCatalogImages(
            (meta as Array<{ media_url: string }>).map((m) => m.media_url).filter(Boolean)
          );
        } else {
          // Fallback for vendors without catalog_images_metadata (legacy / bulk-uploaded)
          getVendorCatalogImages(data.vendor_id).then(setCatalogImages);
        }
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
          <MarketingNavbar />
        </header>
        <div className="mx-auto max-w-7xl animate-pulse px-4 pt-28 pb-16 md:px-8">
          <div className="mb-8 grid grid-cols-4 grid-rows-2 gap-2 h-[380px]">
            <div className="col-span-4 row-span-2 rounded-2xl bg-[var(--bg3)] md:col-span-2" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="hidden rounded-xl bg-[var(--bg3)] md:block" />
            ))}
          </div>
          <div className="h-6 w-1/3 rounded bg-[var(--bg3)]" />
          <div className="mt-3 h-4 w-1/4 rounded bg-[var(--bg3)]" />
        </div>
      </div>
    );
  }

  if (notFound || !vendor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--bg)]">
        <p className="text-xl font-semibold text-[var(--text)]">Vendor not found</p>
        <Link href="/discover" className="flex items-center gap-2 text-sm font-semibold text-[#c9a84c] hover:underline">
          <ArrowLeft size={15} /> Back to discover
        </Link>
      </div>
    );
  }

  const categories = (vendor.categories?.length ? vendor.categories : [vendor.category as string]).filter(Boolean);
  const city = vendor.address?.split(",").pop()?.trim() || vendor.address || "";
  const galleryImgs = [
    ...catalogImages,
    vendor.cover_image_url,
    vendor.avatar_url,
  ].filter((v): v is string => Boolean(v)).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 5);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
        <MarketingNavbar />
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--text3)]">
          <Link href="/" className="transition hover:text-[var(--text2)]">Home</Link>
          <ChevronRight size={12} />
          <Link href="/discover" className="transition hover:text-[var(--text2)]">Vendors</Link>
          <ChevronRight size={12} />
          <span className="text-[var(--text2)]">{vendor.brand_name}</span>
        </nav>

        {/* Gallery — 5-cell grid */}
        <div
          className="mb-10 overflow-hidden rounded-2xl"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gridTemplateRows: "220px 180px",
            gap: "6px",
            height: "406px",
          }}
        >
          {/* Main cell (2×2) */}
          <div
            className="relative overflow-hidden bg-[var(--bg3)]"
            style={{ gridColumn: "1", gridRow: "1 / 3" }}
          >
            {galleryImgs[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={galleryImgs[0]}
                alt={vendor.brand_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-5xl font-bold text-[var(--text4)]">
                {vendor.brand_name[0]}
              </div>
            )}
          </div>

          {/* Side cells */}
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="relative overflow-hidden bg-[var(--bg3)]">
              {galleryImgs[idx] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={galleryImgs[idx]}
                  alt={`${vendor.brand_name} ${idx}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, rgba(201,168,76,0.04) 0px, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 8px)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Profile body */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
          {/* ── Left content ── */}
          <div>
            {/* Header */}
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.07)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#c9a84c]"
                    >
                      {cat}
                    </span>
                  ))}
                  {vendor.verified && (
                    <span className="flex items-center gap-1 rounded-full border border-[var(--border2)] bg-[var(--border3)] px-3 py-1 text-[10px] font-semibold text-[var(--text2)]">
                      <ShieldCheck size={11} className="text-[#c9a84c]" /> Verified
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl text-[var(--text)] md:text-4xl">{vendor.brand_name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--text3)]">
                  {vendor.rating && (
                    <span className="flex items-center gap-1">
                      <Star size={13} className="fill-[#c9a84c] text-[#c9a84c]" />
                      <span className="font-semibold text-[var(--text)]">{vendor.rating.toFixed(1)}</span>
                      {vendor.review_count && <span>({vendor.review_count} reviews)</span>}
                    </span>
                  )}
                  {city && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {city}
                    </span>
                  )}
                  {vendor.events_completed && (
                    <span>{vendor.events_completed}+ events</span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-full border border-[var(--border2)] px-3 py-2 text-xs font-semibold text-[var(--text3)] transition hover:border-[rgba(201,168,76,0.3)] hover:text-[var(--text2)]">
                  <Share2 size={12} /> Share
                </button>
                <button
                  onClick={() => setLiked(!liked)}
                  className="flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition"
                  style={{
                    borderColor: liked ? "rgba(201,168,76,0.4)" : "var(--border2)",
                    background: liked ? "rgba(201,168,76,0.1)" : "transparent",
                    color: liked ? "#c9a84c" : "var(--text3)",
                  }}
                >
                  <Heart size={12} className={liked ? "fill-[#c9a84c]" : ""} /> Save
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8 flex overflow-x-auto border-b border-[var(--border2)] no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="shrink-0 -mb-px border-b-2 px-5 py-3 text-sm font-semibold transition"
                  style={{
                    borderColor: activeTab === tab ? "#c9a84c" : "transparent",
                    color: activeTab === tab ? "#c9a84c" : "var(--text3)",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ── Overview ── */}
            {activeTab === "Overview" && (
              <div className="space-y-8">
                {/* Spoc */}
                <div className="flex items-center gap-4 border-b border-[var(--border3)] pb-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.08)] text-lg font-bold text-[#c9a84c]">
                    {(vendor.spoc_name || vendor.brand_name)[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text)]">
                      Managed by {vendor.spoc_name || vendor.brand_name}
                    </p>
                    {vendor.experience && (
                      <p className="text-xs text-[var(--text3)]">{vendor.experience} of experience</p>
                    )}
                  </div>
                </div>

                {/* About */}
                {(vendor.detailed_intro || vendor.quick_intro) && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#c9a84c]">About</h3>
                    <p className="text-sm leading-7 text-[var(--text2)]">
                      {vendor.detailed_intro || vendor.quick_intro}
                    </p>
                  </div>
                )}

                {/* Highlights grid */}
                {vendor.highlight_features && vendor.highlight_features.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#c9a84c]">
                      Highlights
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {vendor.highlight_features.map((feat) => (
                        <div
                          key={feat}
                          className="flex items-start gap-3 rounded-xl border border-[var(--border3)] bg-[var(--bg2)] px-4 py-3"
                        >
                          <CheckCircle size={14} className="mt-0.5 shrink-0 text-[#c9a84c]" />
                          <span className="text-xs leading-5 text-[var(--text2)]">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialties */}
                {vendor.specialties && vendor.specialties.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#c9a84c]">
                      Specialties
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {vendor.specialties.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-[var(--border2)] bg-[var(--bg2)] px-3 py-1.5 text-xs text-[var(--text2)]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trust panel */}
                <div className="rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-5 space-y-5">
                  {vendor.verified && (
                    <div className="flex gap-3">
                      <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#c9a84c]" />
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">Verified Professional</p>
                        <p className="text-xs text-[var(--text3)]">Portfolio reviewed, identity checked, category verified.</p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Clock size={18} className="mt-0.5 shrink-0 text-[#c9a84c]" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">Fast Response</p>
                      <p className="text-xs text-[var(--text3)]">Typically replies within 2 hours on WhatsApp.</p>
                    </div>
                  </div>
                  {vendor.events_completed ? (
                    <div className="flex gap-3">
                      <Sparkles size={18} className="mt-0.5 shrink-0 text-[#c9a84c]" />
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{vendor.events_completed}+ events completed</p>
                        <p className="text-xs text-[var(--text3)]">Proven track record across weddings, parties, and corporate events.</p>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* External links */}
                <div className="flex flex-wrap gap-3">
                  {vendor.whatsapp_number && (
                    <a
                      href={`https://wa.me/91${vendor.whatsapp_number.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-[rgba(74,222,128,0.25)] bg-[rgba(74,222,128,0.07)] px-4 py-2.5 text-xs font-semibold text-[#4ade80] transition hover:bg-[rgba(74,222,128,0.14)]"
                    >
                      <Phone size={12} /> WhatsApp
                    </a>
                  )}
                  {vendor.instagram && (
                    <a
                      href={vendor.instagram.startsWith("http") ? vendor.instagram : `https://instagram.com/${vendor.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-[var(--border2)] px-4 py-2.5 text-xs font-semibold text-[var(--text2)] transition hover:border-[rgba(201,168,76,0.3)] hover:text-[#c9a84c]"
                    >
                      <ExternalLink size={12} /> Instagram
                    </a>
                  )}
                  {vendor.google_maps_link && (
                    <a
                      href={vendor.google_maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-[var(--border2)] px-4 py-2.5 text-xs font-semibold text-[var(--text2)] transition hover:border-[rgba(201,168,76,0.3)] hover:text-[#c9a84c]"
                    >
                      <ExternalLink size={12} /> View on Maps
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* ── Packages ── */}
            {activeTab === "Packages" && (
              <div className="space-y-4">
                {vendor.packages && vendor.packages.length > 0 ? (
                  vendor.packages.map((pkg, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.08)] text-[#c9a84c]">
                            <Package size={16} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[var(--text)]">{pkg.name}</h3>
                            {pkg.description && (
                              <p className="mt-1 text-xs text-[var(--text3)]">{pkg.description}</p>
                            )}
                          </div>
                        </div>
                        {pkg.price ? (
                          <span className="shrink-0 text-lg font-semibold text-[#c9a84c]">
                            {formatPrice(pkg.price)}
                          </span>
                        ) : null}
                      </div>
                      {pkg.inclusions && pkg.inclusions.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {pkg.inclusions.map((inc) => (
                            <li key={inc} className="flex items-center gap-2 text-xs text-[var(--text2)]">
                              <ChevronRight size={11} className="shrink-0 text-[#c9a84c]" /> {inc}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-8 text-center">
                    <p className="text-sm text-[var(--text3)]">Contact vendor for detailed package pricing.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Portfolio ── */}
            {activeTab === "Portfolio" && (
              <div>
                {catalogImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {catalogImages.map((src, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-[var(--bg3)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`${vendor.brand_name} portfolio ${i + 1}`} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-8 text-center">
                    <p className="text-sm text-[var(--text3)]">Portfolio available via Instagram or on request.</p>
                    {vendor.instagram && (
                      <a
                        href={vendor.instagram.startsWith("http") ? vendor.instagram : `https://instagram.com/${vendor.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 rounded-full border border-[rgba(201,168,76,0.25)] px-5 py-2.5 text-xs font-semibold text-[#c9a84c] transition hover:bg-[rgba(201,168,76,0.08)]"
                      >
                        <ExternalLink size={13} /> View on Instagram
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Reviews ── */}
            {activeTab === "Reviews" && (
              <div className="space-y-4">
                {vendor.rating ? (
                  <div className="flex items-center gap-5 rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-6">
                    <span className="font-display text-5xl text-[var(--text)]">{vendor.rating.toFixed(1)}</span>
                    <div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.round(vendor.rating!) ? "fill-[#c9a84c] text-[#c9a84c]" : "text-[var(--text4)]"}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-[var(--text3)]">{vendor.review_count} reviews</p>
                    </div>
                  </div>
                ) : null}
                <div className="rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-8 text-center">
                  <p className="text-sm text-[var(--text3)]">Detailed reviews coming soon.</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Sticky booking panel ── */}
          <div className="relative">
            <div
              className="sticky top-28 rounded-2xl border border-[rgba(201,168,76,0.15)] bg-[var(--bg2)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              style={{ backdropFilter: "blur(12px)" }}
            >
              {/* Price */}
              <div className="mb-4">
                {vendor.starting_price ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-[var(--text)]">
                      {formatPrice(vendor.starting_price)}
                    </span>
                    <span className="text-xs text-[var(--text3)]">starting price</span>
                  </div>
                ) : (
                  <span className="text-sm text-[var(--text3)]">Contact for pricing</span>
                )}
                {vendor.rating && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <Star size={12} className="fill-[#c9a84c] text-[#c9a84c]" />
                    <span className="text-sm font-semibold text-[var(--text)]">{vendor.rating.toFixed(1)}</span>
                    {vendor.review_count ? (
                      <span className="text-xs text-[var(--text3)]">({vendor.review_count})</span>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Availability */}
              {vendor.currently_available !== undefined && (
                <div
                  className="mb-4 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
                  style={{
                    background: vendor.currently_available
                      ? "rgba(74,222,128,0.08)"
                      : "rgba(248,113,113,0.08)",
                    color: vendor.currently_available ? "#4ade80" : "#f87171",
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: vendor.currently_available ? "#4ade80" : "#f87171" }}
                  />
                  {vendor.currently_available ? "Currently available" : "Currently booked"}
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-3">
                {vendor.whatsapp_number && (
                  <a
                    href={`https://wa.me/91${vendor.whatsapp_number.replace(/\D/g, "")}?text=Hi%2C%20I%27m%20interested%20in%20your%20services.%20I%20found%20you%20on%20Happy%20Moments.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9a84c] py-3.5 text-sm font-semibold text-[var(--bg)] shadow-[0_8px_24px_rgba(201,168,76,0.25)] transition hover:-translate-y-0.5 hover:bg-[#e8d5a3]"
                  >
                    <MessageSquare size={15} /> Chat on WhatsApp
                  </a>
                )}
                {vendor.phone_number && (
                  <a
                    href={`tel:${vendor.phone_number}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border2)] py-3.5 text-sm font-semibold text-[var(--text2)] transition hover:border-[rgba(201,168,76,0.3)] hover:text-[#c9a84c]"
                  >
                    <Phone size={15} /> Call Now
                  </a>
                )}
                {!vendor.phone_number && !vendor.whatsapp_number && (
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9a84c] py-3.5 text-sm font-semibold text-[var(--bg)] transition hover:-translate-y-0.5">
                    <MessageSquare size={15} /> Send Inquiry
                  </button>
                )}

                {/* Discuss CTA */}
                <Link
                  href={`/vendor/${id}/discuss`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-semibold transition hover:border-[rgba(201,168,76,0.4)] hover:text-[#c9a84c]"
                  style={{
                    borderColor: "rgba(201,168,76,0.2)",
                    color: "var(--text2)",
                    background: "rgba(201,168,76,0.04)",
                  }}
                >
                  <MessagesSquare size={15} /> Discuss &amp; Negotiate
                </Link>
              </div>

              <p className="mt-3 text-center text-[10px] text-[var(--text3)]">
                You won&apos;t be charged yet
              </p>

              {/* Quick details */}
              <div className="mt-5 space-y-3 border-t border-[var(--border3)] pt-5">
                {vendor.address && (
                  <div className="flex items-start gap-2 text-xs text-[var(--text3)]">
                    <MapPin size={12} className="mt-0.5 shrink-0" />
                    <span>{vendor.address}</span>
                  </div>
                )}
              </div>

              {/* Trust pills */}
              <div className="mt-5 space-y-2">
                {[
                  { icon: ShieldCheck, label: "Verified vendor" },
                  { icon: BadgeCheck, label: "Happy Moments curated" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-[var(--text3)]">
                    <Icon size={12} className="text-[#c9a84c]" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
