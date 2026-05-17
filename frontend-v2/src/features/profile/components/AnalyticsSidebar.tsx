"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Metric {
  label: string;
  value: string;
  delta: string;
  positive: boolean | null;
}

interface Props {
  vendorId: string;
}

function TrendIcon({ positive }: { positive: boolean | null }) {
  if (positive === null) return <Minus size={12} style={{ color: "var(--text-muted)" }} />;
  return positive
    ? <TrendingUp size={12} style={{ color: "#22c55e" }} />
    : <TrendingDown size={12} style={{ color: "#f87171" }} />;
}

export default function AnalyticsSidebar({ vendorId }: Props) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendorId) return;
    (async () => {
      // Count contacted_vendors in last 30 days as a proxy for profile views
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const [{ count: views }, { count: reviews }] = await Promise.all([
        supabase
          .from("contacted_vendors")
          .select("*", { count: "exact", head: true })
          .eq("vendor_id", vendorId)
          .gte("created_at", since),
        supabase
          .from("liked_vendors")
          .select("*", { count: "exact", head: true })
          .eq("vendor_id", vendorId),
      ]);

      setReviewCount(reviews ?? 0);

      setMetrics([
        {
          label: "Profile views",
          value: (views ?? 0).toLocaleString(),
          delta: "",
          positive: null,
        },
        {
          label: "Saves / Likes",
          value: (reviews ?? 0).toLocaleString(),
          delta: "",
          positive: null,
        },
        {
          label: "Avg. response time",
          value: "—",
          delta: "",
          positive: null,
        },
        {
          label: "Bookings this month",
          value: "—",
          delta: "",
          positive: null,
        },
      ]);
      setLoading(false);
    })();
  }, [vendorId]);

  return (
    <aside
      className="rounded-2xl border p-5"
      style={{ background: "var(--bg2)", borderColor: "var(--border3)" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-4" style={{ color: "var(--text-muted)" }}>
        Last 30 Days
      </p>

      {loading ? (
        <div className="flex justify-center py-4">
          <div
            className="h-5 w-5 animate-spin rounded-full border-2"
            style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{m.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{m.value}</span>
                {m.delta && (
                  <span className="flex items-center gap-0.5 text-[10px]" style={{ color: m.positive ? "#22c55e" : "#f87171" }}>
                    <TrendIcon positive={m.positive} />
                    {m.delta}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review request CTA */}
      {reviewCount > 0 && (
        <div
          className="mt-4 rounded-xl border p-3"
          style={{ borderColor: "var(--gold)", background: "rgba(201,168,76,0.06)" }}
        >
          <div className="flex items-start gap-2 mb-2">
            <span style={{ color: "var(--gold)" }}>✦</span>
            <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
              {reviewCount} customer{reviewCount !== 1 ? "s" : ""} can leave a review
            </p>
          </div>
          <p className="text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>
            Send a one-tap request to collect feedback from recent events.
          </p>
          <button
            className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ background: "var(--gold)", color: "#1a1612" }}
            onClick={() => console.log("Send review requests")}
          >
            <Send size={11} />
            Send requests
          </button>
        </div>
      )}
    </aside>
  );
}
