"use client";

import { ShieldCheck, CheckCircle2, Clock, Sparkles } from "lucide-react";
import type { AgreementData } from "./types";

interface Props {
  data: AgreementData;
  sentAt: string;
  onVendorConfirm?: () => void;
  onCustomerConfirm?: () => void;
  isVendorView?: boolean;
  isCustomerView?: boolean;
}

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function AgreementCard({
  data,
  sentAt,
  onVendorConfirm,
  onCustomerConfirm,
  isVendorView,
  isCustomerView,
}: Props) {
  const isFinalized = data.vendor_confirmed && data.customer_confirmed;

  return (
    <div
      className="w-full max-w-sm overflow-hidden rounded-2xl border"
      style={{
        background: isFinalized
          ? "linear-gradient(135deg, #071407 0%, #0c1c0a 100%)"
          : "linear-gradient(135deg, #0f0c08 0%, #1a150e 100%)",
        borderColor: isFinalized ? "rgba(74,222,128,0.3)" : "rgba(201,168,76,0.25)",
        boxShadow: isFinalized
          ? "0 16px 48px rgba(0,0,0,0.5), 0 0 40px rgba(74,222,128,0.08)"
          : "0 16px 48px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{
          background: isFinalized ? "rgba(74,222,128,0.08)" : "rgba(201,168,76,0.08)",
          borderBottom: `1px solid ${isFinalized ? "rgba(74,222,128,0.2)" : "rgba(201,168,76,0.15)"}`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: isFinalized ? "rgba(74,222,128,0.15)" : "rgba(201,168,76,0.15)" }}
          >
            {isFinalized ? (
              <ShieldCheck size={15} style={{ color: "#4ade80" }} />
            ) : (
              <Sparkles size={15} style={{ color: "#c9a84c" }} />
            )}
          </div>
          <div>
            <p
              className="text-[10px] font-medium tracking-widest uppercase"
              style={{ color: isFinalized ? "#4ade80" : "#c9a84c" }}
            >
              {isFinalized ? "✓ Final Agreement" : "Draft Agreement"}
            </p>
            <p className="text-sm font-semibold" style={{ color: "#e8ddd0" }}>
              {isFinalized ? "Booking Confirmed" : "Pending Confirmation"}
            </p>
          </div>
        </div>

        {data.event_date && (
          <p className="mt-2 text-[10px]" style={{ color: "#6e6358" }}>
            Event Date: <span style={{ color: "#a99e94" }}>{data.event_date}</span>
          </p>
        )}
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Agreed items */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#6e6358" }}>
            Agreed Items
          </p>
          {data.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={11} style={{ color: isFinalized ? "#4ade80" : "#c9a84c" }} />
                <span className="text-xs" style={{ color: "#a99e94" }}>{item.name}</span>
              </div>
              <span className="text-xs font-semibold" style={{ color: "#e8ddd0" }}>
                {fmt(item.price)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          className="rounded-xl px-4 py-3 flex justify-between items-center"
          style={{
            background: isFinalized ? "rgba(74,222,128,0.08)" : "rgba(201,168,76,0.06)",
            border: `1px solid ${isFinalized ? "rgba(74,222,128,0.2)" : "rgba(201,168,76,0.15)"}`,
          }}
        >
          <span className="text-sm font-bold" style={{ color: "#e8ddd0" }}>Agreed Total</span>
          <span className="text-xl font-bold" style={{ color: isFinalized ? "#4ade80" : "#c9a84c" }}>
            {fmt(data.total)}
          </span>
        </div>

        {/* Terms */}
        {data.terms && (
          <div
            className="rounded-xl px-4 py-3"
            style={{ background: "rgba(232,221,208,0.04)", border: "1px solid rgba(232,221,208,0.06)" }}
          >
            <p className="text-[10px] font-semibold tracking-widest uppercase mb-1" style={{ color: "#6e6358" }}>
              Terms
            </p>
            <p className="text-xs" style={{ color: "#a99e94" }}>{data.terms}</p>
          </div>
        )}

        {data.notes && (
          <p className="text-[10px] italic" style={{ color: "#6e6358" }}>{data.notes}</p>
        )}

        {/* Confirmation status */}
        <div className="flex gap-2">
          {(["vendor", "customer"] as const).map((role) => {
            const confirmed = role === "vendor" ? data.vendor_confirmed : data.customer_confirmed;
            return (
              <div
                key={role}
                className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2"
                style={{
                  background: confirmed ? "rgba(74,222,128,0.08)" : "rgba(232,221,208,0.04)",
                  border: `1px solid ${confirmed ? "rgba(74,222,128,0.2)" : "rgba(232,221,208,0.06)"}`,
                }}
              >
                {confirmed ? (
                  <CheckCircle2 size={14} style={{ color: "#4ade80" }} />
                ) : (
                  <Clock size={14} style={{ color: "#6e6358" }} />
                )}
                <span className="text-[10px] capitalize font-medium" style={{ color: confirmed ? "#4ade80" : "#6e6358" }}>
                  {role}
                </span>
                <span className="text-[9px]" style={{ color: confirmed ? "#4ade80" : "#3d3630" }}>
                  {confirmed ? "Confirmed" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        {!isFinalized && (
          <>
            {isVendorView && !data.vendor_confirmed && onVendorConfirm && (
              <button
                onClick={onVendorConfirm}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition hover:opacity-80"
                style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }}
              >
                <ShieldCheck size={15} /> Confirm as Vendor
              </button>
            )}
            {isCustomerView && !data.customer_confirmed && onCustomerConfirm && (
              <button
                onClick={onCustomerConfirm}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition hover:opacity-80"
                style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }}
              >
                <ShieldCheck size={15} /> Confirm Agreement
              </button>
            )}
          </>
        )}

        {isFinalized && (
          <div className="text-center py-2">
            <p className="text-xs font-semibold" style={{ color: "#4ade80" }}>
              This agreement is finalised and binding.
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "#6e6358" }}>
              Reference this document for your booking.
            </p>
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
        <span className="text-[10px]" style={{ color: isFinalized ? "#4ade80" : "#c9a84c" }}>
          {isFinalized ? "✓ Finalised" : "Awaiting confirmation"}
        </span>
      </div>
    </div>
  );
}
