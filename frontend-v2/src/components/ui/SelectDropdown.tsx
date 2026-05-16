"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Check, Loader2 } from "lucide-react";

interface SelectDropdownProps {
  label?: string;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
  searchable?: boolean;
  required?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export function SelectDropdown({
  placeholder = "Select…",
  options,
  value,
  onChange,
  hasError = false,
  searchable = true,
  loading = false,
  disabled = false,
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const select = useCallback((opt: string) => {
    onChange(opt);
    setOpen(false);
    setQuery("");
  }, [onChange]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search when opens
  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => searchRef.current?.focus(), 60);
    }
  }, [open, searchable]);

  const isDisabled = disabled || loading;

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !isDisabled && setOpen((o) => !o)}
        className="w-full rounded-xl border px-4 py-3 text-sm text-left transition flex items-center justify-between gap-2"
        style={{
          background: "var(--border3)",
          borderColor: hasError ? "#f87171" : open ? "rgba(201,168,76,0.45)" : "var(--border2)",
          color: value ? "var(--text)" : "var(--text4)",
          boxShadow: hasError
            ? "0 0 0 3px rgba(248,113,113,0.1)"
            : open
            ? "0 0 0 3px rgba(201,168,76,0.08)"
            : "none",
          outline: "none",
          opacity: isDisabled ? 0.6 : 1,
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
      >
        <span className="truncate">
          {loading ? "Loading…" : (value || placeholder)}
        </span>
        <div className="shrink-0">
          {loading ? (
            <Loader2 size={14} className="animate-spin" style={{ color: "var(--text4)" }} />
          ) : (
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <ChevronDown size={15} style={{ color: "var(--text4)" }} />
            </motion.div>
          )}
        </div>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl"
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* Search */}
            {searchable && (
              <div
                className="flex items-center gap-2.5 border-b px-3.5 py-2.5"
                style={{ borderColor: "var(--border3)" }}
              >
                <Search size={13} style={{ color: "var(--text4)", flexShrink: 0 }} />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  style={{ color: "var(--text)", caretColor: "var(--gold)" }}
                />
              </div>
            )}

            {/* Options */}
            <div className="max-h-[220px] overflow-y-auto py-1.5">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-xs" style={{ color: "var(--text4)" }}>
                  No matches found
                </p>
              ) : (
                filtered.map((opt, idx) => {
                  const selected = opt === value;
                  return (
                    <button
                      key={`${opt}-${idx}`}
                      type="button"
                      onClick={() => select(opt)}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-sm transition"
                      style={{
                        background: selected ? "rgba(201,168,76,0.08)" : "transparent",
                        color: selected ? "var(--gold)" : "var(--text)",
                      }}
                      onMouseEnter={(e) => {
                        if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = selected ? "rgba(201,168,76,0.08)" : "transparent";
                      }}
                    >
                      <span>{opt}</span>
                      {selected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          <Check size={13} style={{ color: "var(--gold)" }} />
                        </motion.div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
