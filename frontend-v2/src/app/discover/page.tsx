"use client";

import Navbar from "@/components/layout/Navbar";
import { Filter, Map, List, ChevronDown } from "lucide-react";
import { MOCK_VENDORS } from "@/lib/data";
import VendorCard from "@/components/shared/VendorCard";
import { useState } from "react";
import { cn, formatPrice } from "@/lib/utils";

export default function DiscoveryPage() {
    const [view, setView] = useState<'list' | 'map'>('list');

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* Search & Filter Header (Sticky below navbar) */}
            <div className="pt-24 md:pt-20 border-b border-gray-100 bg-white sticky top-0 z-30">
                <div className="max-w-[2000px] mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full md:w-auto">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-gray-900 transition-all font-semibold text-sm">
                            <Filter size={16} /> Filters
                        </button>
                        <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden md:block" />

                        {["Price Range", "Experience", "Verified Only", "Immediate Booking"].map((f) => (
                            <button key={f} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-gray-900 transition-all font-semibold text-sm whitespace-nowrap">
                                {f} <ChevronDown size={14} />
                            </button>
                        ))}
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center bg-gray-100 p-1 rounded-full border border-gray-200">
                        <button
                            onClick={() => setView('list')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all",
                                view === 'list' ? "bg-white shadow-sm text-brand-primary" : "text-gray-500"
                            )}
                        >
                            <List size={16} /> List
                        </button>
                        <button
                            onClick={() => setView('map')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all",
                                view === 'map' ? "bg-white shadow-sm text-brand-primary" : "text-gray-500"
                            )}
                        >
                            <Map size={16} /> Map
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* List View */}
                <div className={cn(
                    "flex-1 overflow-y-auto px-4 md:px-8 py-8",
                    view === 'map' ? "hidden lg:block lg:max-w-[60%]" : "block"
                )}>
                    <div className="mb-6">
                        <p className="text-sm font-bold text-brand-muted italic">Showing 48 premium vendors in Hyderabad</p>
                    </div>

                    <div className={cn(
                        "grid gap-x-6 gap-y-10",
                        view === 'map' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    )}>
                        {MOCK_VENDORS.map((v) => (
                            <VendorCard key={v.id} vendor={v} />
                        ))}
                        {/* Visual duplication */}
                        {[...Array(12)].map((_, i) => (
                            <VendorCard
                                key={`disc-${i}`}
                                vendor={{ ...MOCK_VENDORS[i % MOCK_VENDORS.length], id: `disc-${i}` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Map View Placeholder */}
                {(view === 'map' || true) && (
                    <div className={cn(
                        "flex-1 relative bg-gray-100 overflow-hidden",
                        view === 'list' ? "hidden lg:block" : "block"
                    )}>
                        <div className="absolute inset-0 bg-[#E5E3DF] flex items-center justify-center">
                            {/* This would be the interactive map */}
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <Map className="text-brand-primary" size={32} />
                                </div>
                                <h4 className="text-xl font-black italic text-gray-700">Interactive Map Experience</h4>
                                <p className="text-gray-500 max-w-sm mx-auto mt-2">Discover vendors by their physical studios and service regions across the city.</p>
                            </div>

                            {/* Mock Map Pins */}
                            {MOCK_VENDORS.map((v, i) => (
                                <div
                                    key={`pin-${i}`}
                                    style={{ top: `${20 + (i * 15)}%`, left: `${30 + (i * 20)}%` }}
                                    className="absolute animate-bounce"
                                >
                                    <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-gray-200 font-bold text-sm cursor-pointer hover:scale-110 transition-transform">
                                        {formatPrice(v.price)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
