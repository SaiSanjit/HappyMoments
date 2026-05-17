"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useCustomerAuth } from "@/contexts/CustomerAuth";
import { supabase } from "@/lib/supabase";
import { getLikedVendors } from "@/services/liked-vendors";
import {
  User, Heart, Calendar, Shield, LogOut, Edit3, MapPin,
  Phone, Mail, ChevronRight, Star, MessageCircle,
  Eye, EyeOff, CheckCircle2, Loader2, Camera, BadgeCheck,
  Clock, X, Save,
} from "lucide-react";

type Tab = "overview" | "bookings" | "saved" | "profile" | "security";

// Shape returned by the backend liked-vendors service
interface LikedVendorRow {
  vendor_id: number | string;
  brand_name: string;
  categories?: string[];
  category?: string | string[];
  avatar_url?: string;
  cover_image_url?: string;
  rating?: number;
  starting_price?: number;
  verified?: boolean;
  slug?: string;
  liked_at: string;
}

interface DiscussionRow {
  id: string;
  vendor_id: string;
  subject: string | null;
  status: string;
  last_message: string | null;
  created_at: string;
}

// ── Avatar with initials ────────────────────────────────────────────────────
function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-black"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, var(--gold), #e8c96a)",
        color: "var(--bg)",
        fontSize: size * 0.33,
      }}>
      {initials || <User size={size * 0.45} />}
    </div>
  );
}

// ── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, sub }: { label: string; value: string | number; icon: React.ElementType; sub?: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl p-5" style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text4)" }}>{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "rgba(201,168,76,0.1)" }}>
          <Icon size={15} style={{ color: "var(--gold)" }} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-black" style={{ color: "var(--text)" }}>{value}</p>
        {sub && <p className="mt-0.5 text-xs" style={{ color: "var(--text4)" }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    active:    { bg: "rgba(74,222,128,0.1)",  fg: "#4ade80", label: "Active" },
    agreed:    { bg: "rgba(201,168,76,0.1)",  fg: "var(--gold)", label: "Agreed" },
    closed:    { bg: "rgba(148,163,184,0.1)", fg: "#94a3b8", label: "Closed" },
  };
  const s = map[status] ?? { bg: "rgba(148,163,184,0.1)", fg: "#94a3b8", label: status };
  return (
    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

export default function CustomerDashboard() {
  const router = useRouter();
  const { customer, loading: authLoading, signOut, updateProfile, sendResetOtp, verifyResetOtp, resetPassword } = useCustomerAuth();
  const [tab, setTab] = useState<Tab>("overview");

  // Liked vendors
  const [likedVendors, setLikedVendors] = useState<LikedVendorRow[]>([]);
  const [likedLoading, setLikedLoading] = useState(true);

  // Discussions / bookings
  const [discussions, setDiscussions] = useState<DiscussionRow[]>([]);
  const [discLoading, setDiscLoading] = useState(true);

  // Profile edit
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Security / change password
  const [pwStep, setPwStep] = useState<"idle" | "otp_sent" | "otp_verified">("idle");
  const [pwOtp, setPwOtp] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !customer) router.push("/auth");
  }, [authLoading, customer, router]);

  const fetchLikedVendors = useCallback(async () => {
    if (!customer) return;
    setLikedLoading(true);
    try {
      // Use the backend service which handles the customer_liked_vendors table
      const result = await getLikedVendors(customer.id);
      if (result.success && Array.isArray(result.data)) {
        // Sort by liked_at descending
        const sorted = [...result.data].sort(
          (a: LikedVendorRow, b: LikedVendorRow) =>
            new Date(b.liked_at).getTime() - new Date(a.liked_at).getTime()
        );
        setLikedVendors(sorted);
      }
    } catch (err) {
      console.error("fetchLikedVendors error:", err);
    }
    setLikedLoading(false);
  }, [customer]);

  const fetchDiscussions = useCallback(async () => {
    if (!customer) return;
    setDiscLoading(true);
    const { data, error } = await supabase
      .from("discussions")
      .select("id, vendor_id, subject, status, last_message, created_at")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) console.error("fetchDiscussions error:", error);
    setDiscussions((data as DiscussionRow[]) ?? []);
    setDiscLoading(false);
  }, [customer]);

  useEffect(() => {
    fetchLikedVendors();
    fetchDiscussions();
  }, [fetchLikedVendors, fetchDiscussions]);

  useEffect(() => {
    if (customer) {
      setEditName(customer.full_name ?? "");
      setEditMobile(customer.mobile_number ?? "");
      setEditLocation(customer.location ?? "");
    }
  }, [customer]);

  const handleSaveProfile = async () => {
    setProfileSaving(true); setProfileMsg("");
    const { error } = await updateProfile({ full_name: editName, mobile_number: editMobile, location: editLocation });
    setProfileSaving(false);
    if (error) { setProfileMsg(`Error: ${error}`); return; }
    setProfileMsg("Profile updated!");
    setEditMode(false);
    setTimeout(() => setProfileMsg(""), 3000);
  };

  const handleSendPwOtp = async () => {
    if (!customer) return;
    setPwError(""); setPwLoading(true);
    const { error } = await sendResetOtp(customer.email);
    setPwLoading(false);
    if (error) { setPwError(error); return; }
    setPwStep("otp_sent");
    setPwMsg(`Reset code sent to ${customer.email}`);
  };

  const handleVerifyPwOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setPwError(""); setPwLoading(true);
    const { error } = await verifyResetOtp(customer.email, pwOtp);
    setPwLoading(false);
    if (error) { setPwError(error); return; }
    setPwStep("otp_verified"); setPwMsg("");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setPwError("");
    if (pwNew !== pwConfirm) { setPwError("Passwords do not match."); return; }
    if (pwNew.length < 6) { setPwError("Password must be at least 6 characters."); return; }
    setPwLoading(true);
    const { error } = await resetPassword(customer.email, pwOtp, pwNew);
    setPwLoading(false);
    if (error) { setPwError(error); return; }
    setPwMsg("Password updated successfully!");
    setPwStep("idle"); setPwOtp(""); setPwNew(""); setPwConfirm("");
    setTimeout(() => setPwMsg(""), 4000);
  };

  const handleSignOut = () => { signOut(); router.push("/"); };

  if (authLoading || !customer) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
        <Loader2 size={28} className="animate-spin" style={{ color: "var(--gold)" }} />
      </div>
    );
  }

  const joinedYear = new Date(customer.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const completionFields = [customer.full_name, customer.email, customer.mobile_number, customer.location];
  const completionPct = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  const TABS: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "overview",  label: "Overview",     icon: User },
    { id: "bookings",  label: "Bookings",      icon: Calendar, count: discussions.length },
    { id: "saved",     label: "Saved",         icon: Heart, count: likedVendors.length },
    { id: "profile",   label: "Personal Info", icon: Edit3 },
    { id: "security",  label: "Security",      icon: Shield },
  ];

  const inp = {
    className: "w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition",
    style: { border: "1px solid var(--border3)", background: "var(--bg)", color: "var(--text)" } as React.CSSProperties,
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden pt-16" style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border3)" }}>
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(45deg, rgba(201,168,76,0.025) 0px, rgba(201,168,76,0.025) 1px, transparent 1px, transparent 12px)",
        }} />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2" style={{
          background: "radial-gradient(ellipse at 80% 50%, rgba(201,168,76,0.07) 0%, transparent 65%)",
        }} />

        <div className="relative mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar name={customer.full_name || "U"} size={80} />
                <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "var(--bg)", border: "2px solid var(--border3)" }}>
                  <Camera size={12} style={{ color: "var(--text3)" }} />
                </button>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>{customer.full_name}</h1>
                  {customer.status === "verified" && (
                    <BadgeCheck size={18} style={{ color: "var(--gold)" }} />
                  )}
                </div>
                <p className="mt-0.5 text-sm" style={{ color: "var(--text3)" }}>Member since {joinedYear}</p>
                {customer.location && (
                  <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: "var(--text4)" }}>
                    <MapPin size={11} /> {customer.location}
                  </p>
                )}
              </div>
            </div>

            {/* Profile completion */}
            <div className="flex flex-col gap-2 sm:items-end">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold" style={{ color: "var(--text3)" }}>Profile {completionPct}% complete</p>
                {completionPct === 100 && <CheckCircle2 size={13} style={{ color: "var(--gold)" }} />}
              </div>
              <div className="h-1.5 w-36 overflow-hidden rounded-full" style={{ background: "var(--border3)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${completionPct}%`, background: "var(--gold)" }} />
              </div>
              {completionPct < 100 && (
                <button onClick={() => setTab("profile")} className="text-[10px] font-semibold transition hover:opacity-70" style={{ color: "var(--gold)" }}>
                  Complete your profile →
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 flex gap-1 overflow-x-auto pb-px">
            {TABS.map(({ id, label, icon: Icon, count }) => (
              <button key={id} onClick={() => setTab(id)}
                className="flex shrink-0 items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-bold transition"
                style={{
                  background: tab === id ? "var(--bg)" : "transparent",
                  color: tab === id ? "var(--gold)" : "var(--text4)",
                  borderBottom: tab === id ? "2px solid var(--gold)" : "2px solid transparent",
                }}>
                <Icon size={13} />
                {label}
                {count !== undefined && count > 0 && (
                  <span className="rounded-full px-1.5 py-0.5 text-[9px] font-black" style={{ background: "rgba(201,168,76,0.15)", color: "var(--gold)" }}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* ─── OVERVIEW ─── */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Saved Vendors" value={likedVendors.length} icon={Heart} sub="in your wishlist" />
              <StatCard label="Discussions" value={discussions.length} icon={MessageCircle} sub="with vendors" />
              <StatCard label="Active Talks" value={discussions.filter(d => d.status === "active").length} icon={Clock} sub="ongoing" />
              <StatCard label="Agreed Deals" value={discussions.filter(d => d.status === "agreed").length} icon={CheckCircle2} sub="finalised" />
            </div>

            {/* Recent saved vendors */}
            {likedVendors.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-black" style={{ color: "var(--text)" }}>Recently Saved</h3>
                  <button onClick={() => setTab("saved")} className="text-xs font-semibold transition hover:opacity-70" style={{ color: "var(--gold)" }}>
                    View all →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {likedVendors.slice(0, 4).map((v) => (
                    <Link key={v.vendor_id} href={`/vendor/${v.slug || v.vendor_id}`}
                      className="group flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-0.5"
                      style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}>
                      <div className="aspect-video overflow-hidden bg-gradient-to-br from-[rgba(201,168,76,0.1)] to-[rgba(201,168,76,0.03)]">
                        {v.avatar_url ? (
                          <img src={v.avatar_url} alt={v.brand_name} className="h-full w-full object-cover transition group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-2xl font-black" style={{ color: "var(--gold)" }}>
                            {v.brand_name?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-bold leading-4" style={{ color: "var(--text)" }}>{v.brand_name}</p>
                        {(v.categories?.[0] ?? (Array.isArray(v.category) ? v.category[0] : v.category)) && (
                          <p className="mt-0.5 text-[10px]" style={{ color: "var(--text4)" }}>
                            {v.categories?.[0] ?? (Array.isArray(v.category) ? v.category[0] : v.category)}
                          </p>
                        )}
                        {v.rating ? (
                          <div className="mt-1.5 flex items-center gap-1">
                            <Star size={10} className="fill-[#c9a84c] text-[#c9a84c]" />
                            <span className="text-[10px] font-bold" style={{ color: "var(--text3)" }}>{v.rating}</span>
                          </div>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent discussions */}
            {discussions.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-black" style={{ color: "var(--text)" }}>Recent Discussions</h3>
                  <button onClick={() => setTab("bookings")} className="text-xs font-semibold transition hover:opacity-70" style={{ color: "var(--gold)" }}>
                    View all →
                  </button>
                </div>
                <div className="space-y-2">
                  {discussions.slice(0, 3).map((d) => {
                    const vendorKey = d.vendor_id;
                    const displayName = d.subject ?? `Discussion with vendor`;
                    return (
                      <Link key={d.id} href={`/vendor/${vendorKey}/discuss`}
                        className="flex items-center justify-between rounded-xl px-4 py-3.5 transition hover:opacity-80"
                        style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "rgba(201,168,76,0.1)" }}>
                            <MessageCircle size={14} style={{ color: "var(--gold)" }} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{displayName}</p>
                            <p className="text-[10px]" style={{ color: "var(--text4)" }}>
                              {new Date(d.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={d.status} />
                          <ChevronRight size={14} style={{ color: "var(--text4)" }} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state */}
            {likedVendors.length === 0 && discussions.length === 0 && (
              <div className="flex flex-col items-center gap-5 rounded-2xl py-16 text-center" style={{ border: "1px dashed var(--border3)" }}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "rgba(201,168,76,0.08)" }}>
                  <Star size={28} style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <p className="font-bold" style={{ color: "var(--text)" }}>Start your event journey</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text4)" }}>Browse vendors and save your favourites to see them here.</p>
                </div>
                <Link href="/discover" className="rounded-xl px-6 py-2.5 text-sm font-bold transition hover:opacity-90" style={{ background: "var(--gold)", color: "var(--bg)" }}>
                  Explore vendors
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ─── BOOKINGS / DISCUSSIONS ─── */}
        {tab === "bookings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black" style={{ color: "var(--text)" }}>Your Discussions</h3>
              <Link href="/discover" className="rounded-xl px-4 py-2 text-xs font-bold transition hover:opacity-90" style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.25)" }}>
                Browse vendors
              </Link>
            </div>
            {discLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin" style={{ color: "var(--gold)" }} />
              </div>
            ) : discussions.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-2xl py-16 text-center" style={{ border: "1px dashed var(--border3)" }}>
                <MessageCircle size={32} style={{ color: "var(--text4)" }} />
                <div>
                  <p className="font-bold" style={{ color: "var(--text)" }}>No discussions yet</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text4)" }}>When you start a conversation with a vendor, it appears here.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {discussions.map((d) => (
                  <Link key={d.id} href={`/vendor/${d.vendor_id}/discuss`}
                    className="flex items-center justify-between rounded-2xl px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-sm"
                    style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl font-black text-sm" style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)" }}>
                        <MessageCircle size={16} style={{ color: "var(--gold)" }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
                          {d.subject ?? "Venue & Pricing Discussion"}
                        </p>
                        {d.last_message && (
                          <p className="mt-0.5 text-[10px] truncate max-w-[220px]" style={{ color: "var(--text4)" }}>{d.last_message}</p>
                        )}
                        <p className="mt-0.5 text-[10px] flex items-center gap-1" style={{ color: "var(--text4)" }}>
                          <Clock size={9} />
                          {new Date(d.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={d.status} />
                      <ChevronRight size={15} style={{ color: "var(--text4)" }} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── SAVED VENDORS ─── */}
        {tab === "saved" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black" style={{ color: "var(--text)" }}>Saved Vendors <span className="text-base font-semibold" style={{ color: "var(--text4)" }}>({likedVendors.length})</span></h3>
              <Link href="/discover" className="rounded-xl px-4 py-2 text-xs font-bold transition hover:opacity-90" style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.25)" }}>
                Discover more
              </Link>
            </div>
            {likedLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin" style={{ color: "var(--gold)" }} />
              </div>
            ) : likedVendors.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-2xl py-16 text-center" style={{ border: "1px dashed var(--border3)" }}>
                <Heart size={32} style={{ color: "var(--text4)" }} />
                <div>
                  <p className="font-bold" style={{ color: "var(--text)" }}>No saved vendors</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text4)" }}>Tap the heart on any vendor to save them here.</p>
                </div>
                <Link href="/discover" className="rounded-xl px-6 py-2.5 text-sm font-bold transition hover:opacity-90" style={{ background: "var(--gold)", color: "var(--bg)" }}>
                  Explore vendors
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {likedVendors.map((v) => (
                  <Link key={v.vendor_id} href={`/vendor/${v.slug || v.vendor_id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1"
                    style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}>
                    <div className="relative aspect-video overflow-hidden" style={{ background: "rgba(201,168,76,0.05)" }}>
                      {v.avatar_url ? (
                        <img src={v.avatar_url} alt={v.brand_name} className="h-full w-full object-cover transition group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-3xl font-black" style={{ color: "var(--gold)", opacity: 0.5 }}>
                          {v.brand_name?.[0]}
                        </div>
                      )}
                      {v.verified && (
                        <div className="absolute right-2 top-2 rounded-full p-1" style={{ background: "var(--bg)" }}>
                          <BadgeCheck size={12} style={{ color: "var(--gold)" }} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                      <p className="text-xs font-black leading-4" style={{ color: "var(--text)" }}>{v.brand_name}</p>
                      {(v.categories?.[0] ?? (Array.isArray(v.category) ? v.category[0] : v.category)) && (
                        <p className="text-[10px]" style={{ color: "var(--text4)" }}>
                          {v.categories?.[0] ?? (Array.isArray(v.category) ? v.category[0] : v.category)}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        {v.rating ? (
                          <div className="flex items-center gap-1">
                            <Star size={10} className="fill-[#c9a84c] text-[#c9a84c]" />
                            <span className="text-[10px] font-bold" style={{ color: "var(--text3)" }}>{v.rating}</span>
                          </div>
                        ) : <span />}
                        {v.starting_price ? <p className="text-[10px] font-semibold" style={{ color: "var(--text3)" }}>from ₹{Number(v.starting_price).toLocaleString("en-IN")}</p> : null}
                      </div>
                      {v.liked_at && (
                        <p className="text-[9px]" style={{ color: "var(--text4)" }}>
                          Saved {new Date(v.liked_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── PERSONAL INFO ─── */}
        {tab === "profile" && (
          <div className="max-w-lg space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black" style={{ color: "var(--text)" }}>Personal Information</h3>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition hover:opacity-90" style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.25)" }}>
                  <Edit3 size={12} /> Edit
                </button>
              ) : (
                <button onClick={() => { setEditMode(false); setEditName(customer.full_name ?? ""); setEditMobile(customer.mobile_number ?? ""); setEditLocation(customer.location ?? ""); }}
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition hover:opacity-90" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }}>
                  <X size={12} /> Cancel
                </button>
              )}
            </div>

            {profileMsg && (
              <div className="rounded-xl px-4 py-3 text-xs" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>
                {profileMsg}
              </div>
            )}

            <div className="space-y-4 rounded-2xl p-6" style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}>
              {/* Read-only field */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text4)" }}>
                  <Mail size={10} className="inline mr-1" />Email (cannot be changed)
                </label>
                <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text3)" }}>
                  {customer.email}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text4)" }}>
                  <User size={10} className="inline mr-1" />Full Name
                </label>
                {editMode ? (
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your full name" {...inp} />
                ) : (
                  <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }}>
                    {customer.full_name || <span style={{ color: "var(--text4)" }}>Not set</span>}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text4)" }}>
                  <Phone size={10} className="inline mr-1" />Mobile Number
                </label>
                {editMode ? (
                  <input type="tel" value={editMobile} onChange={(e) => setEditMobile(e.target.value)} placeholder="+91 98765 43210" {...inp} />
                ) : (
                  <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }}>
                    {customer.mobile_number || <span style={{ color: "var(--text4)" }}>Not set</span>}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text4)" }}>
                  <MapPin size={10} className="inline mr-1" />City / Location
                </label>
                {editMode ? (
                  <input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} placeholder="e.g. Hyderabad" {...inp} />
                ) : (
                  <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }}>
                    {customer.location || <span style={{ color: "var(--text4)" }}>Not set</span>}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text4)" }}>
                  Account Status
                </label>
                <div className="flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: "var(--bg)", border: "1px solid var(--border3)" }}>
                  <BadgeCheck size={14} style={{ color: customer.status === "verified" ? "var(--gold)" : "var(--text4)" }} />
                  <span className="text-sm font-semibold capitalize" style={{ color: "var(--text)" }}>{customer.status}</span>
                </div>
              </div>

              {editMode && (
                <button onClick={handleSaveProfile} disabled={profileSaving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--gold)", color: "var(--bg)" }}>
                  {profileSaving ? <Loader2 size={15} className="animate-spin" /> : <><Save size={15} /> Save changes</>}
                </button>
              )}
            </div>

            {/* Sign out */}
            <button onClick={handleSignOut} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition hover:opacity-80" style={{ background: "rgba(248,113,113,0.08)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
              <LogOut size={15} /> Sign out
            </button>
          </div>
        )}

        {/* ─── SECURITY ─── */}
        {tab === "security" && (
          <div className="max-w-lg space-y-6">
            <h3 className="text-lg font-black" style={{ color: "var(--text)" }}>Account Security</h3>

            {/* Change password */}
            <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "rgba(201,168,76,0.1)" }}>
                  <Shield size={18} style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Change Password</p>
                  <p className="text-xs" style={{ color: "var(--text4)" }}>We&apos;ll send a reset code to your email first.</p>
                </div>
              </div>

              {pwMsg && (
                <div className="rounded-xl px-4 py-2.5 text-xs" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>{pwMsg}</div>
              )}
              {pwError && (
                <div className="rounded-xl px-4 py-2.5 text-xs" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>{pwError}</div>
              )}

              {pwStep === "idle" && (
                <button onClick={handleSendPwOtp} disabled={pwLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--gold)", color: "var(--bg)" }}>
                  {pwLoading ? <Loader2 size={15} className="animate-spin" /> : "Send reset code to email"}
                </button>
              )}

              {pwStep === "otp_sent" && (
                <form onSubmit={handleVerifyPwOtp} className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text4)" }}>6-digit code sent to {customer.email}</label>
                    <input
                      type="text"
                      value={pwOtp}
                      onChange={(e) => setPwOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="••••••"
                      maxLength={6}
                      inputMode="numeric"
                      className="w-full rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-[0.4em] focus:outline-none"
                      style={{ border: "1px solid var(--border3)", background: "var(--bg)", color: "var(--text)" }}
                    />
                  </div>
                  <button type="submit" disabled={pwLoading || pwOtp.length < 6}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
                    style={{ background: "var(--gold)", color: "var(--bg)" }}>
                    {pwLoading ? <Loader2 size={15} className="animate-spin" /> : "Verify code"}
                  </button>
                </form>
              )}

              {pwStep === "otp_verified" && (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text4)" }}>New Password</label>
                    <div className="relative">
                      <input type={showNewPw ? "text" : "password"} value={pwNew} onChange={(e) => setPwNew(e.target.value)} placeholder="Min. 6 characters" required {...inp} className={inp.className + " pr-10"} />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text4)" }}>
                        {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text4)" }}>Confirm New Password</label>
                    <input type={showNewPw ? "text" : "password"} value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} placeholder="Repeat password" required {...inp} />
                  </div>
                  <button type="submit" disabled={pwLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
                    style={{ background: "var(--gold)", color: "var(--bg)" }}>
                    {pwLoading ? <Loader2 size={15} className="animate-spin" /> : <><CheckCircle2 size={15} /> Update password</>}
                  </button>
                </form>
              )}
            </div>

            {/* Account info */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text4)" }}>Account Details</p>
              {[
                { label: "Email", value: customer.email, icon: Mail },
                { label: "Member since", value: joinedYear, icon: Calendar },
                { label: "Status", value: customer.status, icon: BadgeCheck },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border3)" }}>
                  <div className="flex items-center gap-2">
                    <Icon size={13} style={{ color: "var(--text4)" }} />
                    <span className="text-xs font-semibold" style={{ color: "var(--text3)" }}>{label}</span>
                  </div>
                  <span className="text-xs font-semibold capitalize" style={{ color: "var(--text)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
