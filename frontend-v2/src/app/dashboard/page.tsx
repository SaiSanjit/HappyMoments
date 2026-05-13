"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Settings, Calendar, Heart, ShieldCheck, LogOut, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import VendorCard from "@/components/shared/VendorCard";
import { getAllVendors } from "@/services/vendors";
import { Vendor } from "@/lib/supabase";

export default function UserDashboard() {
    const [featuredVendors, setFeaturedVendors] = useState<Vendor[]>([]);

    useEffect(() => {
        getAllVendors().then((data) => setFeaturedVendors(data.slice(0, 2)));
    }, []);

    const stats = [
        { label: "Active Bookings", value: "1" },
        { label: "Draft Requests", value: "3" },
        { label: "Messages", value: "12" },
        { label: "Favorite Vendors", value: "24" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="pt-24 pb-20 flex-1 max-w-7xl mx-auto w-full px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Profile Summary */}
                    <div className="lg:w-80 shrink-0">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4 relative">
                                <User size={48} className="text-brand-primary" />
                                <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm">
                                    <Settings size={14} />
                                </button>
                            </div>
                            <h2 className="text-2xl font-black">My Account</h2>
                            <p className="text-brand-muted text-sm mt-1">Joined March 2024</p>

                            <div className="w-full mt-8 space-y-2">
                                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={20} className="text-gray-400" />
                                        <span className="font-semibold text-gray-700">My Bookings</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-primary" />
                                </button>
                                <Link href="/favorites" className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Heart size={20} className="text-gray-400" />
                                        <span className="font-semibold text-gray-700">Favorites</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-primary" />
                                </Link>
                                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={20} className="text-gray-400" />
                                        <span className="font-semibold text-gray-700">Verification</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-primary" />
                                </button>
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <button className="w-full flex items-center gap-3 p-3 text-red-500 font-bold">
                                        <LogOut size={20} /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Dashboard Content */}
                    <div className="flex-1 space-y-10">
                        {/* Stats Header */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-xs font-bold uppercase text-brand-muted tracking-wide">{stat.label}</p>
                                    <p className="text-2xl font-black mt-1">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Quick Favorites Access */}
                        {featuredVendors.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-black italic">Recent Favorites</h3>
                                    <Link href="/favorites" className="text-sm font-bold underline">Go to Wishlist</Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {featuredVendors.map((v) => (
                                        <Link key={v.vendor_id} href={`/vendor/${v.slug || v.vendor_id}`}>
                                            <VendorCard vendor={v} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
