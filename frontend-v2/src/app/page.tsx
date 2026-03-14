"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import CategoryChips from "@/components/shared/CategoryChips";
import VendorCard from "@/components/shared/VendorCard";
import { MOCK_VENDORS } from "@/lib/data";
import { useState } from "react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredVendors = selectedCategory === "all"
    ? MOCK_VENDORS
    : MOCK_VENDORS.filter(v => v.category.toLowerCase() === selectedCategory);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Category Bar (Sticky) */}
      <div className="sticky top-[72px] z-40">
        <CategoryChips onCategoryChange={setSelectedCategory} />
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}

          {/* Repeat for visual density in prototype */}
          {[...Array(8)].map((_, i) => (
            <VendorCard
              key={`repeat-${i}`}
              vendor={{ ...MOCK_VENDORS[i % MOCK_VENDORS.length], id: `repeat-${i}` }}
            />
          ))}
        </div>
      </div>

      {/* Footer / Mobile Bottom Nav Placeholder */}
      <footer className="h-60 bg-brand-bg mt-20 border-t border-brand-border flex items-center justify-center">
        <p className="text-brand-muted font-medium">© 2026 HappyMoments Discovery Platform</p>
      </footer>
    </main>
  );
}
