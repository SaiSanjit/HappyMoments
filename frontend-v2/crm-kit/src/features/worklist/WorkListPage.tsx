"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Filter, Phone, Mail, MapPin, Check, MoreHorizontal, Clock } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

/**
 * If you have a worklist service, wire it here. Otherwise the page renders
 * a richly-detailed demo. Look for `LIVE_WORKLIST` below.
 */
// import { getWorklist, completeWorklistItem } from "@/services/crm";

interface Props { vendorId: string; }

type Kind = "call" | "send" | "visit" | "review";
type WorkItem = {
  id: string;
  kind: Kind;
  title: string;
  sub: string;
  lead: string;
  due: string;
  priority: "high" | "med" | "low";
  done?: boolean;
  soon?: boolean;
};
type Group = { label: string; tone: string; tag: string; items: WorkItem[] };

const DEMO_GROUPS: Group[] = [
  {
    label: "Overdue", tone: "var(--crm-status-lost-dot)", tag: "needs attention",
    items: [
      { id: "1", kind: "call",  title: "Call · Rohan Sharma",         sub: "Birthday inquiry from Nov 13 — 5 days unanswered",     lead: "L-1021", due: "2 days ago", priority: "high" },
      { id: "2", kind: "send",  title: "Send proposal · Sneha Roy",   sub: "Cradle ceremony · Chennai · ₹95k draft ready",         lead: "L-1019", due: "1 day ago",  priority: "med" },
    ],
  },
  {
    label: "Today", tone: "var(--crm-accent)", tag: "4 tasks",
    items: [
      { id: "3", kind: "call",   title: "Discovery call · Ananya & Vikram", sub: "10:00 AM · 30 min · Hyderabad wedding",              lead: "L-1024", due: "in 1 hr",  priority: "high", soon: true },
      { id: "4", kind: "visit",  title: "Site visit · Opal Gardens",         sub: "12:30 PM · with Neha & Karan",                       lead: "L-1022", due: "in 3 hrs", priority: "high" },
      { id: "5", kind: "send",   title: "Quote · Lakshmi & Suresh",          sub: "Wedding · Mar 22 · The Saga package",                lead: "L-1017", due: "by 3 PM",  priority: "med" },
      { id: "6", kind: "review", title: "Review contract · Amit Patel",     sub: "Anniversary · revised T&C from legal",               lead: "L-1018", due: "by EOD",   priority: "low" },
    ],
  },
  {
    label: "Tomorrow", tone: "var(--text2)", tag: "3 tasks",
    items: [
      { id: "7", kind: "call",  title: "Follow-up · Priya Mehta",      sub: "Engagement package questions",            lead: "L-1023", due: "Wed", priority: "med" },
      { id: "8", kind: "send",  title: "Moodboard · Diya & Arjun",     sub: "Wedding Dec '25 · floral direction",      lead: "L-1024", due: "Wed", priority: "med" },
      { id: "9", kind: "visit", title: "Venue scout · Banyan Estate",  sub: "for Avani & Rohan",                       lead: "—",      due: "Wed", priority: "low" },
    ],
  },
];

const KIND_STYLES: Record<Kind, { Icon: any; bg: string; fg: string }> = {
  call:   { Icon: Phone,  bg: "var(--crm-accent-soft)",        fg: "var(--crm-accent)" },
  send:   { Icon: Mail,   bg: "var(--crm-status-new-bg)",      fg: "var(--crm-status-new-text)" },
  visit:  { Icon: MapPin, bg: "var(--crm-status-won-bg)",      fg: "var(--crm-status-won-text)" },
  review: { Icon: Check,  bg: "var(--crm-status-progress-bg)", fg: "var(--crm-status-progress-text)" },
};

export default function WorkListPage({ vendorId }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"mine" | "team" | "unassigned">("mine");

  const load = useCallback(async () => {
    setLoading(true);
    // const data = await getWorklist(vendorId, filter);
    // setGroups(transformIntoGroups(data));
    // For now, demo data:
    await new Promise((r) => setTimeout(r, 250));
    setGroups(DEMO_GROUPS);
    setLoading(false);
  }, [vendorId, filter]);

  useEffect(() => { load(); }, [load]);

  const totalTasks = groups.reduce((s, g) => s + g.items.length, 0);
  const completed  = groups.reduce((s, g) => s + g.items.filter((i) => i.done).length, 0);
  const overdueCt  = groups.find((g) => g.label === "Overdue")?.items.length ?? 0;
  const todayCt    = groups.find((g) => g.label === "Today")?.items.length ?? 0;
  const tomorrowCt = groups.find((g) => g.label === "Tomorrow")?.items.length ?? 0;

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="crm-page flex flex-col h-full" style={{ background: "var(--crm-bg)" }}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="px-7 pt-7 pb-5 flex-shrink-0" style={{ borderBottom: "1px solid var(--border2)" }}>
        <div className="flex items-end flex-wrap gap-4">
          <div>
            <p className="eyebrow">{today}</p>
            <h1 className="font-display mt-1.5" style={{ fontSize: 44, letterSpacing: "-0.025em", lineHeight: 1, color: "var(--crm-text)" }}>
              Worklist
            </h1>
            <p className="mt-2 text-[13.5px]" style={{ color: "var(--crm-muted)" }}>
              {overdueCt > 0 && <><span style={{ color: "var(--crm-status-lost-text)", fontWeight: 500 }}>{overdueCt} overdue</span> · </>}
              {todayCt} due today · {tomorrowCt} tomorrow
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <div className="flex rounded-[14px] p-[3px] gap-0.5" style={{ background: "var(--bg3)" }}>
              {(["mine", "team", "unassigned"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className="px-3 py-1.5 rounded-[10px] text-[12px] font-medium capitalize transition"
                  style={{
                    background: filter === k ? "var(--crm-surface)" : "transparent",
                    border: filter === k ? "1px solid var(--border)" : "1px solid transparent",
                    color: filter === k ? "var(--crm-text)" : "var(--crm-muted)",
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
            <Button variant="ghost"><Filter size={13} /> Filter</Button>
            <Button variant="primary"><Plus size={14} /> Add task</Button>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto p-7">
        {/* Progress strip */}
        <Card padded className="mb-[22px]">
          <div className="flex items-center flex-wrap gap-6">
            <div>
              <p className="eyebrow">Today's progress</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-display" style={{ fontSize: 36, letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {completed}<span style={{ color: "var(--crm-muted)", fontSize: 22 }}> / {todayCt}</span>
                </span>
                <span className="text-[12px]" style={{ color: "var(--crm-muted)" }}>tasks complete</span>
              </div>
            </div>

            <div className="flex-1 min-w-[200px] mx-9">
              <div className="h-2 rounded-full overflow-hidden flex" style={{ background: "var(--bg3)" }}>
                <div style={{ width: todayCt > 0 ? `${(completed / todayCt) * 100}%` : "0", background: "var(--crm-status-won-dot)" }} />
                <div style={{ width: "10%", background: "var(--crm-accent)" }} />
              </div>
              <div className="flex justify-between mt-2 text-[11px]" style={{ color: "var(--crm-muted)" }}>
                <span>Started at 9:18 AM</span>
                <span>On track to finish by 6 PM</span>
              </div>
            </div>

            <div className="flex gap-7 pl-9" style={{ borderLeft: "1px solid var(--border)" }}>
              <Mini n={groups.flatMap((g) => g.items).filter((i) => i.kind === "call").length}    l="calls" />
              <Mini n={groups.flatMap((g) => g.items).filter((i) => i.kind === "send").length}    l="proposals" />
              <Mini n={groups.flatMap((g) => g.items).filter((i) => i.kind === "visit").length}   l="visits" />
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 rounded-[var(--r-lg)] animate-pulse" style={{ background: "var(--bg3)" }} />
            ))}
          </div>
        ) : (
          groups.map((g) => (
            <div key={g.label} className="mb-[22px]">
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: g.tone }} />
                <h3 className="text-[14px] font-medium m-0" style={{ color: "var(--crm-text)" }}>{g.label}</h3>
                <span className="text-[11.5px]" style={{ color: "var(--crm-muted)" }}>· {g.tag}</span>
                {g.label === "Overdue" && (
                  <button className="ml-auto text-[12px]" style={{ color: "var(--crm-accent)" }}>Snooze all</button>
                )}
              </div>
              <Card>
                {g.items.map((it, i) => {
                  const S = KIND_STYLES[it.kind];
                  const Icon = S.Icon;
                  return (
                    <div key={it.id}
                      className="flex items-center gap-3.5 px-[18px] py-3.5"
                      style={{
                        borderBottom: i === g.items.length - 1 ? "none" : "1px solid var(--border2)",
                        background: it.soon ? "var(--crm-accent-soft)" : "transparent",
                      }}>
                      <Checkbox />
                      <div className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
                        style={{ background: S.bg, color: S.fg }}>
                        <Icon size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] font-medium" style={{ color: "var(--crm-text)" }}>{it.title}</div>
                        <div className="text-[11.5px] mt-0.5" style={{ color: "var(--crm-muted)" }}>{it.sub}</div>
                      </div>
                      <span className="font-mono text-[11px]" style={{ color: "var(--text4)" }}>{it.lead}</span>
                      <span className="text-[11.5px] font-medium text-right min-w-[88px]"
                        style={{
                          color: g.label === "Overdue" ? "var(--crm-status-lost-text)" :
                                 it.soon              ? "var(--crm-accent)" :
                                                        "var(--crm-muted)",
                        }}>
                        {it.due}
                      </span>
                      <PriorityDot p={it.priority} />
                      <button className="w-[22px] h-[22px] rounded-md flex items-center justify-center transition hover:bg-[var(--bg3)]"
                        style={{ color: "var(--crm-muted)" }}>
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  );
                })}
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Checkbox() {
  return (
    <div className="w-4 h-4 rounded shrink-0"
      style={{ background: "var(--crm-surface)", border: "1.5px solid var(--border)" }} />
  );
}

function Mini({ n, l }: { n: number; l: string }) {
  return (
    <div>
      <div className="font-display" style={{ fontSize: 22, letterSpacing: "-0.02em", lineHeight: 1 }}>{n}</div>
      <div className="text-[10.5px] uppercase tracking-[0.06em] mt-1" style={{ color: "var(--crm-muted)" }}>{l}</div>
    </div>
  );
}

function PriorityDot({ p }: { p: "high" | "med" | "low" }) {
  const c = {
    high: "var(--crm-priority-high-dot)",
    med:  "var(--crm-priority-med-dot)",
    low:  "var(--crm-priority-low-dot)",
  }[p];
  return <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c }} title={p} />;
}
