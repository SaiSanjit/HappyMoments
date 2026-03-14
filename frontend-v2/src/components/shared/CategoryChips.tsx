"use client";

import { CATEGORIES } from "@/lib/data";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface CategoryChipsProps {
    onCategoryChange?: (categoryId: string) => void;
}

export default function CategoryChips({ onCategoryChange }: CategoryChipsProps) {
    const [activeCategory, setActiveCategory] = useState("all");

    const handleCategoryClick = (id: string) => {
        setActiveCategory(id);
        onCategoryChange?.(id);
    };

    return (
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 pt-4 px-4 md:px-8 bg-white border-b border-gray-100">
            {CATEGORIES.map((category) => {
                // @ts-ignore
                const Icon = LucideIcons[category.icon] || LucideIcons.Circle;
                const isActive = activeCategory === category.id;

                return (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={cn(
                            "flex flex-col items-center gap-2 min-w-fit transition-all relative pb-2",
                            isActive ? "text-brand-primary" : "text-brand-muted hover:text-brand-secondary"
                        )}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={cn("text-xs font-medium whitespace-nowrap")}>
                            {category.name}
                        </span>
                        {isActive && (
                            <motion.div
                                layoutId="activeCategory"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
