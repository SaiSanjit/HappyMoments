"use client";

import Navbar from "@/components/layout/Navbar";
import { Star, Heart, Share, ShieldCheck, MapPin, Calendar, Users, Info } from "lucide-react";
import Image from "next/image";
import { MOCK_VENDORS } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useState } from "react";
import BookingFlow from "@/components/shared/BookingFlow";

export default function VendorProfile() {
    const vendor = MOCK_VENDORS[0]; // For prototype purposes
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">{vendor.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
                            <div className="flex items-center gap-1">
                                <Star size={16} className="fill-current" />
                                <span>{vendor.rating}</span>
                                <span className="text-brand-muted font-normal underline">({vendor.reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <ShieldCheck size={16} className="text-brand-accent pr-0.5" />
                                <span className="underline">Verified Vendor</span>
                            </div>
                            <div className="flex items-center gap-1 text-brand-muted">
                                <MapPin size={16} />
                                <span className="underline">{vendor.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold underline">
                            <Share size={16} /> Share
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold underline">
                            <Heart size={16} /> Save
                        </button>
                    </div>
                </div>

                {/* Gallery - Airbnb Style */}
                <div className="grid grid-cols-4 grid-rows-2 h-[300px] md:h-[450px] gap-2 rounded-2xl overflow-hidden mb-12">
                    <div className="col-span-4 md:col-span-2 row-span-2 relative group cursor-pointer overflow-hidden">
                        <Image
                            src={vendor.images[0]}
                            alt="Gallery 1"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="hidden md:block relative group cursor-pointer overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600"
                            alt="Gallery 2"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="hidden md:block relative group cursor-pointer overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600"
                            alt="Gallery 3"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="hidden md:block relative group cursor-pointer overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1522158634458-a5dc326f4e07?w=600"
                            alt="Gallery 4"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="hidden md:block relative group cursor-pointer overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600"
                            alt="Gallery 5"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>

                {/* Main Content + Booking Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between pb-8 border-b border-gray-200">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Managed by {vendor.name.split(' ')[0]}</h2>
                                <p className="text-brand-muted">Top-rated vendor with over 8 years of excellence</p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden relative">
                                <Image src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100" alt="Avatar" fill className="object-cover" />
                            </div>
                        </div>

                        <div className="py-8 space-y-8">
                            <div className="flex gap-4">
                                <ShieldCheck size={28} className="shrink-0" />
                                <div>
                                    <h3 className="font-bold">Verified Professional</h3>
                                    <p className="text-brand-muted text-sm">This vendor has passed our 10-point quality and reliability check.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Info size={28} className="shrink-0" />
                                <div>
                                    <h3 className="font-bold">Great Communication</h3>
                                    <p className="text-brand-muted text-sm">Responds within 2 hours on average.</p>
                                </div>
                            </div>
                        </div>

                        <div className="py-8 border-t border-gray-200">
                            <p className="text-gray-700 leading-relaxed">
                                Capturing the most beautiful moments of your life is our passion. We specialize in cinematic wedding photography and candid storytelling. With a team of professional artists, we ensure every smile, every tear, and every magical detail is preserved forever.
                            </p>
                            <button className="mt-4 font-bold underline">Show more</button>
                        </div>
                    </div>

                    {/* Sticky Booking Sidebar */}
                    <div className="relative">
                        <div className="sticky top-28 p-6 rounded-2xl border border-gray-200 shadow-xl bg-white space-y-6">
                            <div className="flex justify-between items-baseline">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black">{formatPrice(vendor.price)}</span>
                                    <span className="text-brand-muted italic text-sm">starting price</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-semibold">
                                    <Star size={12} className="fill-current" />
                                    <span>{vendor.rating}</span>
                                </div>
                            </div>

                            {/* Booking Inputs */}
                            <div className="rounded-xl border border-gray-400 overflow-hidden">
                                <div className="grid grid-cols-2">
                                    <div className="p-3 border-b border-gray-400">
                                        <label className="text-[10px] font-black uppercase text-brand-secondary">Date</label>
                                        <p className="text-sm">Add date</p>
                                    </div>
                                    <div className="p-3 border-b border-l border-gray-400">
                                        <label className="text-[10px] font-black uppercase text-brand-secondary">Duration</label>
                                        <p className="text-sm">Full Day</p>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <label className="text-[10px] font-black uppercase text-brand-secondary">Guests</label>
                                    <p className="text-sm">500+ guests</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsBookingOpen(true)}
                                className="w-full py-4 bg-brand-primary text-white rounded-xl font-black text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Check Availability
                            </button>

                            <p className="text-center text-sm text-brand-muted">
                                You won&apos;t be charged yet
                            </p>

                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between text-brand-muted underline">
                                    <span>Base Package</span>
                                    <span>{formatPrice(vendor.price)}</span>
                                </div>
                                <div className="flex justify-between text-brand-muted underline">
                                    <span>Booking Fee</span>
                                    <span>{formatPrice(1500)}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-200 flex justify-between font-black text-lg">
                                    <span>Total</span>
                                    <span>{formatPrice(vendor.price + 1500)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BookingFlow
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                vendorName={vendor.name}
            />
        </div>
    );
}
