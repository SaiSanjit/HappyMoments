"use client";

import { Vendor } from "@/lib/supabase";
import { Star, Heart, BadgeCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getVendorCatalogImages } from "@/services/vendors";

interface VendorCardProps {
    vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [coverImg, setCoverImg] = useState<string | null>(
        vendor.cover_image_url || vendor.avatar_url || null
    );

    useEffect(() => {
        if (coverImg) return;
        // No direct URL stored — fetch first catalog image as cover
        getVendorCatalogImages(vendor.vendor_id).then((imgs) => {
            if (imgs.length > 0) setCoverImg(imgs[0]);
        });
    }, [vendor.vendor_id, coverImg]);

    const img = coverImg;
    const category = vendor.categories?.[0] || (vendor.category as string) || "";
    const city = vendor.address?.split(",").pop()?.trim() || "";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="group cursor-pointer flex flex-col gap-3"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={img}
                        alt={vendor.brand_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-3xl font-bold text-gray-300">
                        {vendor.brand_name[0]}
                    </div>
                )}

                {/* Favorite Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full transition-all hover:scale-110 glass"
                >
                    <Heart
                        size={20}
                        className={isFavorite ? "fill-brand-primary text-brand-primary" : "text-white"}
                    />
                </button>

                {/* Category Badge */}
                {category && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider glass text-white">
                        {category}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold truncate flex items-center gap-1">
                        {vendor.brand_name}
                        {vendor.verified && (
                            <BadgeCheck size={16} className="text-brand-accent fill-brand-accent/10" />
                        )}
                    </h3>
                    {vendor.rating && (
                        <div className="flex items-center gap-1 text-sm">
                            <Star size={14} className="fill-current text-brand-secondary" />
                            <span>{vendor.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {city && (
                    <p className="text-sm text-brand-muted truncate">{city}</p>
                )}

                <div className="mt-1 flex items-baseline gap-1">
                    {vendor.starting_price ? (
                        <>
                            <span className="font-bold text-lg text-brand-secondary">
                                {formatPrice(vendor.starting_price)}
                            </span>
                            <span className="text-sm text-brand-muted">starting</span>
                        </>
                    ) : (
                        <span className="text-sm text-brand-muted">Contact for pricing</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
