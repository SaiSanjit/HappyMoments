"use client";

import { Vendor } from "@/lib/supabase";
import { Star, Heart, BadgeCheck, MapPin, ArrowRight, Camera, Building2, UtensilsCrossed, Palette, Smile, ClipboardList, Music2, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getVendorCatalogImages } from "@/services/vendors";
import Link from "next/link";

interface VendorCardProps {
    vendor: Vendor;
    index?: number;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    photography:    Camera,
    venues:         Building2,
    catering:       UtensilsCrossed,
    decorators:     Palette,
    makeup:         Smile,
    "event planners": ClipboardList,
    entertainment:  Music2,
    videography:    Video,
};

export default function VendorCard({ vendor, index = 0 }: VendorCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [hovered, setHovered]       = useState(false);
    const [coverImg, setCoverImg]     = useState<string | null>(
        vendor.cover_image_url || vendor.avatar_url || null
    );

    useEffect(() => {
        if (coverImg) return;
        getVendorCatalogImages(vendor.vendor_id).then((imgs) => {
            if (imgs.length > 0) setCoverImg(imgs[0]);
        });
    }, [vendor.vendor_id, coverImg]);

    const category = vendor.categories?.[0] || (vendor.category as string) || "";
    const city     = vendor.address?.split(",").pop()?.trim() || "";
    const CatIcon  = CATEGORY_ICONS[category.toLowerCase()] ?? Camera;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="group relative overflow-hidden rounded-2xl flex flex-col cursor-pointer"
            style={{
                background: "var(--bg2)",
                border: "1px solid var(--border2)",
                boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.35)" : "0 2px 12px rgba(0,0,0,0.12)",
                transform: hovered ? "translateY(-6px)" : "translateY(0)",
                transition: "box-shadow 0.35s ease, transform 0.35s ease",
            }}
        >
            {/* Image */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                {coverImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={coverImg}
                        alt={vendor.brand_name}
                        className="h-full w-full object-cover"
                        style={{
                            transform: hovered ? "scale(1.07)" : "scale(1)",
                            transition: "transform 0.5s ease",
                        }}
                    />
                ) : (
                    <div
                        className="flex h-full w-full items-center justify-center text-5xl font-bold"
                        style={{
                            background: "linear-gradient(135deg, var(--bg3) 0%, var(--border2) 100%)",
                            color: "var(--text4)",
                        }}
                    >
                        {vendor.brand_name[0]}
                    </div>
                )}

                {/* Gradient overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)",
                    }}
                />

                {/* Category badge */}
                {category && (
                    <div
                        className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md"
                        style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.12)" }}
                    >
                        <CatIcon size={11} style={{ color: "var(--gold)" }} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white">{category}</span>
                    </div>
                )}

                {/* Heart button */}
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md"
                    style={{
                        background: isFavorite ? "rgba(239,68,68,0.85)" : "rgba(0,0,0,0.55)",
                        border: "1px solid rgba(255,255,255,0.12)",
                    }}
                >
                    <Heart
                        size={15}
                        style={{
                            color: isFavorite ? "#fff" : "rgba(255,255,255,0.8)",
                            fill: isFavorite ? "#fff" : "none",
                            transition: "all 0.2s",
                        }}
                    />
                </motion.button>

                {/* Verified */}
                {vendor.verified && (
                    <div
                        className="absolute left-3 bottom-[68px] flex items-center gap-1 rounded-full px-2.5 py-1"
                        style={{ background: "var(--gold)", color: "#000" }}
                    >
                        <BadgeCheck size={10} />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Verified</span>
                    </div>
                )}

                {/* Rating row */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between">
                    <div className="flex items-center gap-1.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={11}
                                style={{
                                    fill: i < Math.round(vendor.rating ?? 0) ? "#c9a84c" : "transparent",
                                    color: i < Math.round(vendor.rating ?? 0) ? "#c9a84c" : "rgba(255,255,255,0.3)",
                                }}
                            />
                        ))}
                        <span className="ml-1 text-xs font-semibold text-white">{vendor.rating?.toFixed(1) ?? "New"}</span>
                        {vendor.review_count ? (
                            <span className="text-[10px] text-white/50">({vendor.review_count})</span>
                        ) : null}
                    </div>
                </div>

                {/* Hover CTA */}
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ duration: 0.22 }}
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ background: "rgba(0,0,0,0.28)" }}
                        >
                            <Link
                                href={`/vendor/${vendor.slug || vendor.vendor_id}`}
                                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold backdrop-blur-sm"
                                style={{ background: "var(--gold)", color: "#000" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                View Profile <ArrowRight size={14} />
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <h3 className="text-sm font-semibold leading-snug line-clamp-1" style={{ color: "var(--text)" }}>
                    {vendor.brand_name}
                </h3>

                {city && (
                    <p className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text3)" }}>
                        <MapPin size={11} style={{ color: "var(--gold)", flexShrink: 0 }} />
                        {city}
                    </p>
                )}

                {vendor.caption && (
                    <p className="text-xs leading-relaxed line-clamp-2 flex-1" style={{ color: "var(--text3)" }}>
                        {vendor.caption}
                    </p>
                )}

                <div
                    className="flex items-center justify-between pt-3 mt-auto"
                    style={{ borderTop: "1px solid var(--border3)" }}
                >
                    {vendor.starting_price ? (
                        <div>
                            <span className="text-base font-bold" style={{ color: "var(--text)" }}>
                                ₹{vendor.starting_price.toLocaleString("en-IN")}
                            </span>
                            <span className="ml-1 text-[11px]" style={{ color: "var(--text4)" }}>onwards</span>
                        </div>
                    ) : (
                        <span className="text-xs italic" style={{ color: "var(--text4)" }}>Price on request</span>
                    )}

                    <Link
                        href={`/vendor/${vendor.slug || vendor.vendor_id}`}
                        className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition hover:opacity-80"
                        style={{
                            background: "rgba(201,168,76,0.12)",
                            color: "var(--gold)",
                            border: "1px solid rgba(201,168,76,0.25)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        View <ArrowRight size={11} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
