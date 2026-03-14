"use client";

import { Search, Menu, UserCircle, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-4",
                isScrolled ? "bg-white shadow-sm" : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-1">
                    <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xl italic">H</span>
                    </div>
                    <span className={cn(
                        "text-xl font-black tracking-tighter hidden sm:block",
                        isScrolled ? "text-brand-primary" : "text-white"
                    )}>
                        HappyMoments
                    </span>
                </Link>

                {/* Search Bar (Mini version when scrolled) */}
                <div className={cn(
                    "hidden md:flex items-center gap-4 px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white",
                    !isScrolled && "opacity-0 scale-95 pointer-events-none"
                )}>
                    <span className="text-sm font-semibold border-r border-gray-200 pr-4">Anywhere</span>
                    <span className="text-sm font-semibold border-r border-gray-200 pr-4">Any Category</span>
                    <span className="text-sm text-gray-500 pr-2">Add guests</span>
                    <div className="bg-brand-primary p-2 rounded-full text-white">
                        <Search size={16} />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <button className={cn(
                        "hidden lg:block text-sm font-semibold transition-colors",
                        isScrolled ? "text-gray-700 hover:bg-gray-100 p-3 rounded-full" : "text-white hover:bg-white/10 p-3 rounded-full"
                    )}>
                        Switch to Hosting
                    </button>

                    <button className={cn(
                        "p-3 rounded-full transition-colors",
                        isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                    )}>
                        <Globe size={18} />
                    </button>

                    {/* User Menu */}
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer">
                        <Menu size={18} className="ml-1 text-gray-600" />
                        <UserCircle size={32} className="text-gray-400" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
