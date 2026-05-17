"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import VendorCard from "@/components/shared/VendorCard";
import { Heart, LayoutGrid } from "lucide-react";
import { EmptyFavoritesIllustration } from "@/components/illustrations/EmptyFavoritesIllustration";
import { getAllVendors } from "@/services/vendors";
import { Vendor } from "@/lib/supabase";
import Link from "next/link";

export default function FavoritesPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllVendors().then((data) => {
            setVendors(data.slice(0, 8));
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="pt-32 pb-20 max-w-7xl mx-auto w-full px-4 md:px-8">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-brand-primary rounded-2xl text-white shadow-lg shadow-brand-primary/20">
                            <Heart size={24} className="fill-current" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black">My Wishlist</h1>
                            <p className="text-brand-muted italic">Vendors saved for your dream event</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-full border border-gray-200">
                        <button className="p-2 px-4 rounded-full bg-white shadow-sm text-brand-primary">
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square rounded-xl bg-gray-100 mb-3" />
                                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : vendors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {vendors.map((v) => (
                            <Link key={v.vendor_id} href={`/vendor/${v.slug || v.vendor_id}`}>
                                <VendorCard vendor={v} />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center flex flex-col items-center">
                        <div className="w-44 h-44 mb-4" style={{ color: "#f43f5e" }}>
                            <EmptyFavoritesIllustration className="overflow-visible" />
                        </div>
                        <h3 className="text-2xl font-black mb-2">Create your first wishlist</h3>
                        <p className="text-brand-muted mb-8">Tap the heart on any vendor you love to save them here.</p>
                        <Link href="/discover">
                            <button className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                                Explore Vendors
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
