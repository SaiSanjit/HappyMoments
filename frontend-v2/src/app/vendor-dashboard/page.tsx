"use client";

import Navbar from "@/components/layout/Navbar";
import { LayoutDashboard, Image as ImageIcon, MessageSquare, BarChart3, Star, TrendingUp, Users, Target } from "lucide-react";
import Image from "next/image";
import { MOCK_VENDORS } from "@/lib/data";

export default function VendorDashboard() {
    const stats = [
        { label: "Profile Views", value: "2,482", trend: "+12.5%", icon: BarChart3 },
        { label: "Total Bookings", value: "148", trend: "+5.2%", icon: Target },
        { label: "Active Inquiries", value: "24", trend: "+18%", icon: MessageSquare },
        { label: "Avg. Rating", value: "4.9", trend: "0.0%", icon: Star },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="pt-24 pb-20 flex-1 max-w-7xl mx-auto w-full px-4 md:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black">Vendor command center</h1>
                        <p className="text-brand-muted">Welcome back, {MOCK_VENDORS[0].name}</p>
                    </div>
                    <button className="bg-brand-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors">
                        Manage Portfolio
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gray-50 rounded-2xl text-brand-secondary">
                                    <stat.icon size={20} />
                                </div>
                                <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-full">
                                    <TrendingUp size={12} /> {stat.trend}
                                </div>
                            </div>
                            <p className="text-sm font-bold text-brand-muted uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-black mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed: Recent Inquiries */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="font-black text-lg">Recent Inquiries</h3>
                                <button className="text-sm font-bold text-brand-primary underline underline-offset-4">View All</button>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {["SJ", "AK", "RM"][item - 1]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-gray-900 line-clamp-1">Inquiry for Wedding Photography</h4>
                                                <span className="text-xs text-brand-muted">2h ago</span>
                                            </div>
                                            <p className="text-sm text-brand-muted line-clamp-1 italic">&quot;Hi, we are looking for a photographer for our wedding on Oct 24...&quot;</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Portfolio Highlights Grid */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-black text-lg">Portfolio Preview</h3>
                                <button className="text-sm font-bold flex items-center gap-1">
                                    <ImageIcon size={16} /> Edit Gallery
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="aspect-square bg-gray-100 rounded-xl relative overflow-hidden group">
                                        <Image
                                            src={`https://images.unsplash.com/photo-${1519741497674 - 611481863552 + i}?w=400`}
                                            alt="Portfolio"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Tips & Analytics */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-brand-secondary to-black rounded-3xl p-8 text-white shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <BarChart3 size={20} />
                                </div>
                                <h3 className="font-black italic">Peak Interest</h3>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                Your profile is getting <span className="text-white font-bold">24% more traffic</span> on weekends. Consider running a weekend-only promotional package.
                            </p>
                            <button className="w-full py-3 bg-white text-brand-secondary rounded-xl font-black text-sm transition-all hover:scale-105 active:scale-95">
                                Run Promotion
                            </button>
                        </div>

                        <div className="bg-brand-primary/10 rounded-3xl p-8 border border-brand-primary/20">
                            <h3 className="font-black text-brand-primary mb-2 flex items-center gap-2">
                                <Users size={20} /> Audience Insight
                            </h3>
                            <p className="text-sm text-brand-primary/80">Most of your inquiries come from couples in <span className="font-bold">Hyderabad & Bangalore</span>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
