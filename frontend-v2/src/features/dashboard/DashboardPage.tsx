"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardFilters, DashboardKPI, StatusBreakdown } from "@/lib/crm-types";
import {
  getDashboardKPI,
  getLeadStatusBreakdown,
  getOpportunityStatusBreakdown,
  getResources,
  getTerritories,
} from "@/services/crm";
import { CRMResource, CRMTerritory } from "@/lib/crm-types";
import KpiCard from "./components/KpiCard";
import DonutChart from "./components/DonutChart";
import { TrendingUp, Users, Trophy, DollarSign, Percent, Target } from "lucide-react";

interface Props { vendorId: string; }

const PERIOD_OPTIONS = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
  { value: "all", label: "All Time" },
] as const;

export default function DashboardPage({ vendorId }: Props) {
  const [filters, setFilters] = useState<DashboardFilters>({ period: "month" });
  const [kpi, setKpi] = useState<DashboardKPI | null>(null);
  const [leadBreakdown, setLeadBreakdown] = useState<StatusBreakdown[]>([]);
  const [optyBreakdown, setOptyBreakdown] = useState<StatusBreakdown[]>([]);
  const [resources, setResources] = useState<CRMResource[]>([]);
  const [territories, setTerritories] = useState<CRMTerritory[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [k, lb, ob] = await Promise.all([
      getDashboardKPI(vendorId, filters),
      getLeadStatusBreakdown(vendorId, filters),
      getOpportunityStatusBreakdown(vendorId, filters),
    ]);
    setKpi(k);
    setLeadBreakdown(lb);
    setOptyBreakdown(ob);
    setLoading(false);
  }, [vendorId, filters]);

  useEffect(() => {
    getResources(vendorId).then(setResources);
    getTerritories(vendorId).then(setTerritories);
  }, [vendorId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold mr-auto" style={{ color: "var(--text)" }}>
          Dashboard
        </h1>

        {/* Period */}
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--border3)" }}>
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilters((f) => ({ ...f, period: opt.value }))}
              className="px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: filters.period === opt.value ? "var(--gold)" : "var(--bg2)",
                color: filters.period === opt.value ? "#000" : "var(--text-muted)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Resource filter */}
        <select
          value={filters.resource_id || ""}
          onChange={(e) => setFilters((f) => ({ ...f, resource_id: e.target.value || undefined }))}
          className="rounded-lg px-3 py-1.5 text-xs outline-none"
          style={{ background: "var(--bg2)", border: "1px solid var(--border3)", color: "var(--text)" }}
        >
          <option value="">All Resources</option>
          {resources.map((r) => (
            <option key={r.id} value={r.id}>{r.resource_name}</option>
          ))}
        </select>

        {/* Territory filter */}
        <select
          value={filters.territory_id || ""}
          onChange={(e) => setFilters((f) => ({ ...f, territory_id: e.target.value || undefined }))}
          className="rounded-lg px-3 py-1.5 text-xs outline-none"
          style={{ background: "var(--bg2)", border: "1px solid var(--border3)", color: "var(--text)" }}
        >
          <option value="">All Territories</option>
          {territories.map((t) => (
            <option key={t.id} value={t.id}>{t.alias || `${t.city}, ${t.country}`}</option>
          ))}
        </select>
      </div>

      {/* KPI Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl animate-pulse" style={{ background: "var(--bg2)" }} />
          ))}
        </div>
      ) : kpi ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard label="Leads" value={kpi.leads_this_period} icon={Users} color="var(--gold)" />
          <KpiCard label="Opportunities" value={kpi.opportunities_created} icon={TrendingUp} color="#6366f1" />
          <KpiCard label="Deals Won" value={kpi.deals_won} icon={Trophy} color="#10b981" />
          <KpiCard
            label="Pipeline"
            value={`₹${(kpi.pipeline_value / 100000).toFixed(1)}L`}
            icon={DollarSign}
            color="#f59e0b"
          />
          <KpiCard label="Conversion" value={`${kpi.conversion_rate}%`} icon={Percent} color="#8b5cf6" />
          <KpiCard label="Avg Win%" value={`${kpi.avg_win_probability}%`} icon={Target} color="#3b82f6" />
        </div>
      ) : null}

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
        >
          <h3 className="mb-4 text-sm font-semibold" style={{ color: "var(--text)" }}>
            Lead Status Distribution
          </h3>
          {leadBreakdown.length > 0 ? (
            <DonutChart data={leadBreakdown} />
          ) : (
            <p className="text-center text-sm py-8" style={{ color: "var(--text-muted)" }}>
              No lead data for this period
            </p>
          )}
        </div>

        <div
          className="rounded-xl p-5"
          style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
        >
          <h3 className="mb-4 text-sm font-semibold" style={{ color: "var(--text)" }}>
            Opportunity Pipeline
          </h3>
          {optyBreakdown.length > 0 ? (
            <DonutChart data={optyBreakdown} />
          ) : (
            <p className="text-center text-sm py-8" style={{ color: "var(--text-muted)" }}>
              No opportunity data for this period
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
