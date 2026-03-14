"use client";

import Navbar from "@/components/layout/Navbar";
import { Settings, Calendar, Heart, ShieldCheck, LogOut, ChevronRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_VENDORS } from "@/lib/data";
import VendorCard from "@/components/shared/VendorCard";

export default function UserDashboard() {
    const activeBookings = [
        {
            id: "bk-1",
            vendor: MOCK_VENDORS[0],
            date: "Oct 24, 2026",
            status: "Confirmed",
        }
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
                            <h2 className="text-2xl font-black">Sai Sanjit</h2>
                            <p className="text-brand-muted text-sm mt-1">Joined March 2024</p>

                            <div className="w-full mt-8 space-y-2">
                                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={20} className="text-gray-400" />
                                        <span className="font-semibold text-gray-700">My Bookings</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-primary" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Heart size={20} className="text-gray-400" />
                                        <span className="font-semibold text-gray-700">Favorites</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-primary" />
                                </button>
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
                            {[
                                { label: 'Active Bookings', value: '1' },
                                { label: 'Draft Requests', value: '3' },
                                { label: 'Messages', value: '12' },
                                { label: 'Favorite Vendors', value: '24' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-xs font-bold uppercase text-brand-muted tracking-wide">{stat.label}</p>
                                    <p className="text-2xl font-black mt-1">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Active Bookings Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-black italic">Upcoming Events</h3>
                                <Link href="#" className="text-sm font-bold underline">View All</Link>
                            </div>

                            <div className="space-y-4">
                                {activeBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                                        <div className="w-full md:w-32 h-24 rounded-xl relative overflow-hidden shrink-0">
                                            <Image src={booking.vendor.images[0]} alt="Vendor" fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h4 className="font-black text-lg">{booking.vendor.name}</h4>
                                            <p className="text-brand-muted text-sm">{booking.vendor.category} • {booking.date}</p>
                                        </div>
                                        <div className="px-4 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-black uppercase tracking-widest">
                                            {booking.status}
                                        </div>
                                        <button className="w-full md:w-auto px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm">
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Favorites Access */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-black italic">Recent Favorites</h3>
                                <Link href="#" className="text-sm font-bold underline">Go to Wishlist</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <VendorCard vendor={MOCK_VENDORS[1]} />
                                <VendorCard vendor={MOCK_VENDORS[2]} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
