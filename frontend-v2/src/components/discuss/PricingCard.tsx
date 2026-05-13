"use client";

import { IndianRupee, Tag, MessageCircle, CheckCircle2 } from "lucide-react";
import type { PricingCardData } from "./types";

interface Props {
  data: PricingCardData;
  sentAt: string;
  onCounterOffer?: () => void;
  onAccept?: () => void;
  isCustomerView?: boolean;
}

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const VARIANT_COLORS = [
  { bg: "rgba(201,168,76,0.12)", border: "rgba(201,168,76,0.25)", accent: "#c9a84c" },
  { bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.25)", accent: "#818cf8" },
  { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", accent: "#4ade80" },
  { bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)", accent: "#fb923c" },
];

export default function PricingCard({ data, sentAt, onCounterOffer, onAccept, isCustomerView }: Props) {
  const theme = VARIANT_COLORS[(data.variant_number - 1) % 4];
  const includedItems = data.items.filter((i) => i.included);

  const categoryGroups = includedItems.reduce<Record<string, typeof includedItems>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div
      className="w-full max-w-sm overflow-hidden rounded-2xl border"
      style={{
        background: "linear-gradient(135deg, #0f0c08 0%, #1a150e 100%)",
        borderColor: theme.border,
        boxShadow: `0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 ${theme.bg}`,
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "rgba(0,0,0,0.3)" }}
            >
              <IndianRupee size={15} style={{ color: theme.accent }} />
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-widest uppercase" style={{ color: theme.accent }}>
                Price Proposal
              </p>
              <p className="text-sm font-semibold" style={{ color: "#e8ddd0" }}>
                {data.variant_name}
              </p>
            </div>
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold"
            style={{ background: "rgba(0,0,0,0.3)", color: theme.accent }}
          >
            #{data.variant_number}
          </span>
        </div>

        {(data.event_date || data.valid_until) && (
          <div className="mt-3 flex flex-wrap gap-3">
            {data.event_date && (
              <span className="text-[10px]" style={{ color: "#6e6358" }}>
                Event: <span style={{ color: "#a99e94" }}>{data.event_date}</span>
              </span>
            )}
            {data.valid_until && (
              <span className="text-[10px]" style={{ color: "#6e6358" }}>
                Valid till: <span style={{ color: "#a99e94" }}>{data.valid_until}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Line items grouped by category */}
      <div className="px-5 py-4 space-y-4">
        {Object.entries(categoryGroups).map(([cat, items]) => (
          <div key={cat}>
            <p className="text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: "#6e6358" }}>
              {cat}
            </p>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: "#e8ddd0" }}>{item.name}</p>
                    {item.description && (
                      <p className="text-[10px]" style={{ color: "#6e6358" }}>{item.description}</p>
                    )}
                    {item.quantity > 1 && (
                      <p className="text-[10px]" style={{ color: "#6e6358" }}>
                        {item.quantity} {item.unit} × {fmt(item.unit_price)}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-semibold shrink-0" style={{ color: "#e8ddd0" }}>
                    {fmt(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Totals */}
        <div
          className="rounded-xl space-y-2 px-4 py-3"
          style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(232,221,208,0.06)" }}
        >
          <div className="flex justify-between text-xs" style={{ color: "#a99e94" }}>
            <span>Subtotal</span>
            <span>{fmt(data.subtotal)}</span>
          </div>
          {data.discount && data.discount.amount > 0 && (
            <div className="flex justify-between text-xs" style={{ color: "#4ade80" }}>
              <span className="flex items-center gap-1">
                <Tag size={10} /> Discount
                {data.discount.reason && <span style={{ color: "#6e6358" }}>({data.discount.reason})</span>}
              </span>
              <span>- {fmt(data.discount.amount)}</span>
            </div>
          )}
          {data.taxes > 0 && (
            <div className="flex justify-between text-xs" style={{ color: "#6e6358" }}>
              <span>Taxes & Fees</span>
              <span>{fmt(data.taxes)}</span>
            </div>
          )}
          <div
            className="flex justify-between pt-2 mt-1"
            style={{ borderTop: "1px solid rgba(232,221,208,0.1)" }}
          >
            <span className="text-sm font-bold" style={{ color: "#e8ddd0" }}>Grand Total</span>
            <span className="text-lg font-bold" style={{ color: theme.accent }}>
              {fmt(data.grand_total)}
            </span>
          </div>
        </div>

        {data.notes && (
          <p className="text-[10px] italic" style={{ color: "#6e6358" }}>{data.notes}</p>
        )}

        {/* Customer actions */}
        {isCustomerView && (
          <div className="flex gap-2 pt-1">
            {onCounterOffer && (
              <button
                onClick={onCounterOffer}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition hover:opacity-80"
                style={{ background: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <MessageCircle size={12} /> Counter Offer
              </button>
            )}
            {onAccept && (
              <button
                onClick={onAccept}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition hover:opacity-80"
                style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}
              >
                <CheckCircle2 size={12} /> Accept
              </button>
            )}
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
        <span className="text-[10px]" style={{ color: theme.accent }}>
          From Vendor
        </span>
      </div>
    </div>
  );
}
