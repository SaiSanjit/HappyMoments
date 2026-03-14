"use client";

import Image from "next/image";
import { Vendor } from "@/lib/data";
import { Star, Heart, BadgeCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

interface VendorCardProps {
    vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

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
                <Image
                    src={vendor.images[0]}
                    alt={vendor.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

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
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider glass text-white">
                    {vendor.category}
                </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold truncate flex items-center gap-1">
                        {vendor.name}
                        {vendor.isVerified && (
                            <BadgeCheck size={16} className="text-brand-accent fill-brand-accent/10" />
                        )}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                        <Star size={14} className="fill-current text-brand-secondary" />
                        <span>{vendor.rating}</span>
                    </div>
                </div>

                <p className="text-sm text-brand-muted truncate">
                    {vendor.location}
                </p>

                <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-bold text-lg text-brand-secondary">
                        {formatPrice(vendor.price)}
                    </span>
                    <span className="text-sm text-brand-muted">starting</span>
                </div>
            </div>
        </motion.div>
    );
}
