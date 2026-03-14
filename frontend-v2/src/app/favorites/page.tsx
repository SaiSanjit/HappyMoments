"use client";

import Navbar from "@/components/layout/Navbar";
import { MOCK_VENDORS } from "@/lib/data";
import VendorCard from "@/components/shared/VendorCard";
import { Heart, LayoutGrid } from "lucide-react";

export default function FavoritesPage() {
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
                            <p className="text-brand-muted italic">24 vendors saved for your dream event</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-full border border-gray-200">
                        <button className="p-2 px-4 rounded-full bg-white shadow-sm text-brand-primary">
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {MOCK_VENDORS.map((v) => (
                        <VendorCard key={`fav-${v.id}`} vendor={v} />
                    ))}
                    {[...Array(4)].map((_, i) => (
                        <VendorCard
                            key={`fav-repeat-${i}`}
                            vendor={{ ...MOCK_VENDORS[i % MOCK_VENDORS.length], id: `fav-repeat-${i}` }}
                        />
                    ))}
                </div>

                {/* Empty State Mock */}
                {MOCK_VENDORS.length === 0 && (
                    <div className="py-40 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Heart size={40} />
                        </div>
                        <h3 className="text-2xl font-black mb-2">Create your first wishlist</h3>
                        <p className="text-brand-muted mb-8">Tap the heart on any vendor you love to save them here.</p>
                        <button className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                            Explore Vendors
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
