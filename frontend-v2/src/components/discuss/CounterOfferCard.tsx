"use client";

import { ArrowLeftRight, CheckCircle, XCircle } from "lucide-react";
import type { CounterOfferData } from "./types";

interface Props {
  data: CounterOfferData;
  sentAt: string;
}

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function CounterOfferCard({ data, sentAt }: Props) {
  const accepted = data.items.filter((i) => i.accepted);
  const rejected = data.items.filter((i) => !i.accepted);

  return (
    <div
      className="w-full max-w-sm overflow-hidden rounded-2xl border"
      style={{
        background: "linear-gradient(135deg, #0a0805 0%, #110e0a 100%)",
        borderColor: "rgba(251,146,60,0.25)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(251,146,60,0.08)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{
          background: "rgba(251,146,60,0.08)",
          borderBottom: "1px solid rgba(251,146,60,0.15)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "rgba(251,146,60,0.15)" }}
          >
            <ArrowLeftRight size={14} style={{ color: "#fb923c" }} />
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "#fb923c" }}>
              Counter Offer
            </p>
            <p className="text-sm font-semibold" style={{ color: "#e8ddd0" }}>
              Re: {data.variant_name}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Accepted items (possibly with counter prices) */}
        {accepted.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#6e6358" }}>
              Requested Items
            </p>
            {accepted.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: "#4ade80" }} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium" style={{ color: "#e8ddd0" }}>{item.name}</p>
                    {item.note && (
                      <p className="text-[10px]" style={{ color: "#6e6358" }}>{item.note}</p>
                    )}
                  </div>
                </div>
                {item.counter_price !== undefined ? (
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold" style={{ color: "#fb923c" }}>
                      {fmt(item.counter_price)}
                    </p>
                    <p className="text-[10px] line-through" style={{ color: "#6e6358" }}>
                      {fmt(item.original_price)}
                    </p>
                  </div>
                ) : (
                  <span className="text-xs font-semibold shrink-0" style={{ color: "#a99e94" }}>
                    {fmt(item.original_price)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Rejected items */}
        {rejected.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#6e6358" }}>
              Not Required
            </p>
            {rejected.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <XCircle size={13} style={{ color: "#f87171" }} className="shrink-0" />
                <span className="text-xs line-through" style={{ color: "#6e6358" }}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Proposed total */}
        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between"
          style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.15)" }}
        >
          <span className="text-sm font-bold" style={{ color: "#e8ddd0" }}>Proposed Total</span>
          <span className="text-lg font-bold" style={{ color: "#fb923c" }}>
            {fmt(data.proposed_total)}
          </span>
        </div>

        {/* Customer comments */}
        {data.comments && (
          <div
            className="rounded-xl px-4 py-3"
            style={{ background: "rgba(232,221,208,0.04)", border: "1px solid rgba(232,221,208,0.08)" }}
          >
            <p className="text-[10px] font-semibold tracking-widest uppercase mb-1" style={{ color: "#6e6358" }}>
              Note from Customer
            </p>
            <p className="text-xs" style={{ color: "#a99e94" }}>{data.comments}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-2.5 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(232,221,208,0.06)" }}
      >
        <span className="text-[10px]" style={{ color: "#3d3630" }}>
          {new Date(sentAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
        </span>
        <span className="text-[10px]" style={{ color: "#fb923c" }}>From Customer</span>
      </div>
    </div>
  );
}
