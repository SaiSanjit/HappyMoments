"use client";

import { Search, Calendar, Users, MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative h-[600px] w-full flex flex-col justify-center items-center px-4 md:px-8">
            {/* Background Image */}
            <div className="absolute inset-0 -z-10 bg-black">
                <Image
                    src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80"
                    alt="Beautiful event background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
            </div>

            {/* Content */}
            <div className="max-w-4xl w-full text-center text-white mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black tracking-tight mb-6"
                >
                    Make your moments <br className="hidden md:block" />
                    <span className="text-brand-primary">magical and easy.</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
                >
                    Discover elite photographers, decorators, and venues for your dream event.
                </motion.p>
            </div>

            {/* Search Bar / Panel */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-4xl glass rounded-3xl p-2 md:p-4 shadow-2xl flex flex-col md:flex-row items-center gap-2"
            >
                <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-white/20">
                    <MapPin size={20} className="text-brand-primary" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-brand-primary">Location</span>
                        <input
                            type="text"
                            placeholder="Where is your event?"
                            className="bg-transparent text-sm font-medium focus:outline-none placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-white/20">
                    <Calendar size={20} className="text-brand-primary" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-brand-primary">Date</span>
                        <span className="text-sm font-medium text-gray-400">Add dates</span>
                    </div>
                </div>

                <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 md:py-2">
                    <Users size={20} className="text-brand-primary" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-brand-primary">Guests</span>
                        <span className="text-sm font-medium text-gray-400">Add guests</span>
                    </div>
                </div>

                <button className="w-full md:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white p-4 md:p-6 rounded-2xl flex items-center justify-center transition-all hover:scale-105">
                    <Search size={24} strokeWidth={3} />
                    <span className="md:hidden ml-2 font-bold">Search Vendors</span>
                </button>
            </motion.div>
        </section>
    );
}
