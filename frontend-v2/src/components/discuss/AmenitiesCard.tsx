"use client";

import { CheckCircle, XCircle, Sparkles, Users, Home, TreePine } from "lucide-react";
import type { AmenitiesCardData } from "./types";

interface Props {
  data: AmenitiesCardData;
  sentAt: string;
}

export default function AmenitiesCard({ data, sentAt }: Props) {
  const included = data.amenities.filter((a) => a.included);
  const excluded = data.amenities.filter((a) => !a.included);

  return (
    <div
      className="w-full max-w-sm overflow-hidden rounded-2xl border"
      style={{
        background: "linear-gradient(135deg, #0f0c08 0%, #1a150e 100%)",
        borderColor: "rgba(201,168,76,0.25)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,168,76,0.1)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{
          background: "linear-gradient(90deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "rgba(201,168,76,0.15)" }}
          >
            <Sparkles size={15} style={{ color: "#c9a84c" }} />
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "#c9a84c" }}>
              Amenities Overview
            </p>
            <p className="text-sm font-semibold" style={{ color: "#e8ddd0" }}>
              {data.venue_name}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Event types & capacity */}
        <div className="flex flex-wrap gap-2">
          {data.event_types.map((et) => (
            <span
              key={et}
              className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
              style={{ background: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              {et}
            </span>
          ))}
        </div>

        {(data.capacity.indoor || data.capacity.outdoor) && (
          <div className="flex gap-4">
            {data.capacity.indoor && (
              <div className="flex items-center gap-1.5">
                <Home size={12} style={{ color: "#6e6358" }} />
                <span className="text-xs" style={{ color: "#a99e94" }}>
                  Indoor: <span style={{ color: "#e8ddd0" }}>{data.capacity.indoor.toLocaleString()} pax</span>
                </span>
              </div>
            )}
            {data.capacity.outdoor && (
              <div className="flex items-center gap-1.5">
                <TreePine size={12} style={{ color: "#6e6358" }} />
                <span className="text-xs" style={{ color: "#a99e94" }}>
                  Outdoor: <span style={{ color: "#e8ddd0" }}>{data.capacity.outdoor.toLocaleString()} pax</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Included amenities */}
        {included.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#6e6358" }}>
              Included
            </p>
            {included.map((a) => (
              <div key={a.id} className="flex items-start gap-2">
                <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: "#4ade80" }} />
                <div>
                  <span className="text-xs font-medium" style={{ color: "#e8ddd0" }}>{a.name}</span>
                  {a.description && (
                    <p className="text-[10px]" style={{ color: "#6e6358" }}>{a.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Excluded amenities */}
        {excluded.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#6e6358" }}>
              Not Included
            </p>
            {excluded.map((a) => (
              <div key={a.id} className="flex items-start gap-2">
                <XCircle size={13} className="mt-0.5 shrink-0" style={{ color: "#f87171" }} />
                <span className="text-xs" style={{ color: "#6e6358" }}>{a.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Highlights */}
        {data.highlights.length > 0 && (
          <div
            className="rounded-xl px-4 py-3"
            style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.1)" }}
          >
            <p className="text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: "#c9a84c" }}>
              Highlights
            </p>
            <ul className="space-y-1">
              {data.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-xs" style={{ color: "#a99e94" }}>
                  <span style={{ color: "#c9a84c" }}>·</span> {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {data.notes && (
          <p className="text-xs italic" style={{ color: "#6e6358" }}>{data.notes}</p>
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
        <span className="flex items-center gap-1 text-[10px]" style={{ color: "#c9a84c" }}>
          <Users size={10} /> From Vendor
        </span>
      </div>
    </div>
  );
}
