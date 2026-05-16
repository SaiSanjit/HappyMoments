"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Search, Plus, Phone, Calendar, MoreHorizontal, Check, Send,
  Camera, Tag, Sparkles, Download, ChevronRight,
} from "lucide-react";

import { CRMChatRoom, CRMMessage } from "@/lib/crm-types";
// If your services file has these, uncomment:
// import { getChatRooms, getMessages, sendMessage } from "@/services/crm";

import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";

interface Props { vendorId: string; }

/* ─────────────────────────────────────────────────────────────────
   Demo data — replace with calls to your services/crm.ts equivalents.
   ───────────────────────────────────────────────────────────────── */

const DEMO_THREADS = [
  { id: "t1", name: "Ananya & Vikram",  preview: "Yes that works for us! Should we lock down the…",     time: "2m",        unread: 2, status: "negotiation" as const, you: false, online: true,  event: "Wedding · Dec 14",     score: 92, budget: "₹18 L",  source: "Instagram", owner: "Rashmi K." },
  { id: "t2", name: "Priya Mehta",      preview: "Could you share the engagement package details?",     time: "1h",        unread: 1, status: "proposal"    as const, you: false, online: true,  event: "Engagement",            score: 78, budget: "₹3.2 L", source: "Referral",  owner: "Arjun M." },
  { id: "t3", name: "Neha & Karan",     preview: "Loved the moodboard! Just one small change — could we…", time: "3h",   unread: 0, status: "contacted"   as const, you: true,                    event: "Sangeet · Jan 8",       score: 64, budget: "₹6.5 L", source: "Website",   owner: "Rashmi K." },
  { id: "t4", name: "Rohan Sharma",     preview: "Hi, found you through your Insta. Quick question…",   time: "Yesterday", unread: 3, status: "new"          as const, you: false,                  event: "Birthday",              score: 51, budget: "₹85 K",  source: "Instagram", owner: "—" },
  { id: "t5", name: "Lakshmi & Suresh", preview: "Sent over the venue PDF as requested.",                time: "Mon",       unread: 0, status: "proposal"    as const, you: true,                    event: "Wedding · Mar 22",      score: 84, budget: "₹25 L",  source: "Referral",  owner: "Arjun M." },
  { id: "t6", name: "Aisha & Imran",    preview: "Thank you so much! See you on the 2nd ✨",             time: "Sun",       unread: 0, status: "won"          as const, you: false,                  event: "Mehndi · Dec 2",        score: 100, budget: "₹2.8 L", source: "Google",    owner: "Arjun M." },
  { id: "t7", name: "Tara Sengupta",    preview: "We've decided to go with another vendor — really…",    time: "Nov 12",    unread: 0, status: "lost"        as const, you: false,                  event: "Baby shower",           score: 22, budget: "₹60 K",  source: "Website",   owner: "Priya N." },
];

const DEMO_MESSAGES = [
  { id: "m1", from: "them" as const, time: "Yesterday, 5:42 PM", body: "Hi Asha! We're getting married on December 14th in Hyderabad — saw your Falaknuma series and we're absolutely in love. Are you available?" },
  { id: "m2", from: "me"   as const, time: "Yesterday, 6:18 PM", body: "Hi Ananya! Thank you, that means a lot. December 14 is open — I'd love to meet. Can I send a quick deck of recent work so you can get a feel for our style?" },
  { id: "m3", from: "them" as const, time: "Yesterday, 6:20 PM", body: "Yes please!" },
  { id: "m4", from: "me"   as const, time: "Yesterday, 6:34 PM", body: "Here you go.", attach: { name: "atelier-deck-2025.pdf", size: "4.2 MB" } },
  { id: "m5", from: "them" as const, time: "Today, 11:02 AM",    body: "Okay this is gorgeous. We talked it over and want to go with The Celebration package + drone. Could you send a formal quote?" },
  { id: "m6", from: "me"   as const, time: "Today, 11:48 AM",    body: "On it. I'll have the proposal in your inbox by 1 PM. One question — would you like us to do a pre-wedding shoot? We have a slot in Goa on Nov 30.", quote: true },
  { id: "m7", from: "them" as const, time: "Today, 12:14 PM",    body: "Yes that works for us! Should we lock down the Goa date now?" },
];

type Thread = (typeof DEMO_THREADS)[number];
type Msg = (typeof DEMO_MESSAGES)[number];

/* ─────────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────────── */

export default function ChatsPage({ vendorId }: Props) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string>("t1");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("Yes — let me hold November 30 in Goa for you. I'll send a brief contract for the pre-wedding shoot.");
  const [filter, setFilter] = useState<"all"|"unread"|"hot"|"closed">("all");
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  /* ── Load threads ─────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      // Real: const data = await getChatRooms(vendorId);
      // setThreads(data.map(mapRoomToThread));
      await new Promise((r) => setTimeout(r, 200));
      setThreads(DEMO_THREADS);
      setLoading(false);
    })();
  }, [vendorId]);

  /* ── Load messages for active thread ──────────────────────── */
  useEffect(() => {
    (async () => {
      // Real: const msgs = await getMessages(activeId);
      // setMessages(msgs.map(mapMessage));
      setMessages(DEMO_MESSAGES);
    })();
  }, [activeId]);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "end" });
  }, [messages.length, activeId]);

  const filtered = threads.filter((t) => {
    if (filter === "unread") return t.unread > 0;
    if (filter === "hot")    return t.status === "negotiation";
    if (filter === "closed") return t.status === "won" || t.status === "lost";
    return true;
  });
  const newCt = threads.filter((t) => t.unread > 0).length;
  const active = threads.find((t) => t.id === activeId) ?? threads[0];

  const onSend = () => {
    if (!draft.trim()) return;
    // Real: await sendMessage(activeId, draft);
    setMessages((m) => [...m, { id: `me-${Date.now()}`, from: "me", time: "Just now", body: draft }]);
    setDraft("");
  };

  return (
    <div className="crm-page flex h-full" style={{ background: "var(--crm-bg)" }}>

      {/* ── Thread list (left) ───────────────────────────────────── */}
      <aside className="w-[340px] flex-shrink-0 flex flex-col"
        style={{ borderRight: "1px solid var(--border)", background: "var(--bg2)" }}>
        <div className="px-[18px] pt-5 pb-3.5" style={{ borderBottom: "1px solid var(--border2)" }}>
          <div className="flex items-center">
            <h2 className="font-display m-0" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>Inbox</h2>
            {newCt > 0 && (
              <span className="ml-2.5 text-[11px] font-semibold px-1.5 py-[2px] rounded-full"
                style={{ background: "var(--crm-accent)", color: "#fff" }}>
                {newCt} new
              </span>
            )}
            <button className="ml-auto w-8 h-8 rounded-[10px] flex items-center justify-center transition"
              style={{ color: "var(--crm-muted)", background: "var(--bg3)" }}>
              <Plus size={13} />
            </button>
          </div>

          <div className="relative mt-3">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--crm-muted)" }} />
            <input
              placeholder="Search conversations"
              className="rounded-[14px] pl-[30px] pr-3 py-2 text-[12px] outline-none w-full"
              style={{ background: "var(--crm-surface)", border: "1px solid var(--border)", color: "var(--crm-text)" }}
            />
          </div>

          <div className="flex gap-1 mt-3">
            {(["all", "unread", "hot", "closed"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className="px-2.5 h-[26px] rounded-[8px] text-[11px] font-medium capitalize transition"
                style={{
                  background: filter === k ? "var(--crm-text)" : "transparent",
                  color:      filter === k ? "var(--bg2)" : "var(--crm-muted)",
                  border:     "1px solid " + (filter === k ? "var(--crm-text)" : "var(--border)"),
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-[18px] py-3.5 animate-pulse"
                style={{ borderBottom: "1px solid var(--border2)" }}>
                <div className="h-3 rounded w-32 mb-2" style={{ background: "var(--bg3)" }} />
                <div className="h-2.5 rounded w-44" style={{ background: "var(--bg3)" }} />
              </div>
            ))
            : filtered.map((t) => {
              const isActive = t.id === activeId;
              return (
                <button key={t.id} onClick={() => setActiveId(t.id)}
                  className="w-full text-left flex gap-3 px-[18px] py-3.5 transition"
                  style={{
                    borderBottom: "1px solid var(--border2)",
                    background: isActive ? "var(--crm-surface)" : "transparent",
                    borderLeft: "3px solid " + (isActive ? "var(--crm-accent)" : "transparent"),
                  }}>
                  <div className="relative shrink-0">
                    <Avatar name={t.name} size={38} />
                    {t.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
                        style={{ background: "var(--crm-status-won-dot)", border: "2px solid var(--bg2)" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] truncate" style={{ color: "var(--crm-text)", fontWeight: t.unread ? 600 : 500 }}>
                        {t.name}
                      </span>
                      <span className="text-[10.5px] ml-auto shrink-0" style={{ color: "var(--text4)" }}>{t.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {t.you && <span className="text-[11px]" style={{ color: "var(--crm-muted)" }}>You: </span>}
                      <span className="text-[12px] truncate flex-1 min-w-0"
                        style={{
                          color: t.unread ? "var(--text2)" : "var(--crm-muted)",
                          fontWeight: t.unread ? 500 : 400,
                        }}>{t.preview}</span>
                      {t.unread > 0 && (
                        <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
                          style={{ background: "var(--crm-accent)", color: "#fff" }}>
                          {t.unread}
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5">
                      <StatusPill kind={t.status}>{t.status[0].toUpperCase() + t.status.slice(1)}</StatusPill>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </aside>

      {/* ── Conversation (middle) ────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0" style={{ background: "var(--crm-bg)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-[26px] py-[18px]"
          style={{ borderBottom: "1px solid var(--border2)", background: "var(--bg2)" }}>
          <Avatar name={active?.name ?? "?"} size={40} />
          <div>
            <div className="text-[14px] font-medium" style={{ color: "var(--crm-text)" }}>{active?.name}</div>
            <div className="text-[11.5px] flex items-center gap-1.5 mt-0.5" style={{ color: "var(--crm-muted)" }}>
              {active?.online && <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--crm-status-won-dot)" }} />}
              {active?.online ? "Active now · " : ""}{active?.event}
            </div>
          </div>
          <div className="ml-auto flex gap-1.5">
            <Button variant="ghost" size="sm"><Phone size={12} /> Call</Button>
            <Button variant="ghost" size="sm"><Calendar size={12} /> Schedule</Button>
            <Button variant="accent" size="sm">Send proposal</Button>
            <Button variant="ghost" size="icon-sm"><MoreHorizontal size={14} /></Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-[26px] pt-[26px] pb-[18px]">
          <div className="text-center text-[11px] mb-6" style={{ color: "var(--text4)" }}>
            <span className="px-3.5" style={{ background: "var(--crm-bg)" }}>Conversation started · Nov 14</span>
            <div className="h-px -mt-[7px] relative -z-10" style={{ background: "var(--border2)" }} />
          </div>
          <div className="grid gap-3">
            {messages.map((m) => <Bubble key={m.id} m={m} />)}

            {/* Typing indicator */}
            <div className="flex gap-2.5 items-end">
              <Avatar name={active?.name ?? "?"} size={26} />
              <div className="px-3.5 py-2.5 flex gap-1 items-center"
                style={{
                  background: "var(--crm-surface)", border: "1px solid var(--border)",
                  borderRadius: "16px 16px 16px 4px",
                }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "var(--text4)",
                      animation: `pulse 1.4s ${i * 0.2}s ease-in-out infinite`,
                    }} />
                ))}
              </div>
            </div>
            <div ref={endRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="px-[26px] pt-4 pb-[22px]" style={{ borderTop: "1px solid var(--border2)", background: "var(--bg2)" }}>
          <div className="rounded-[var(--r-lg)] p-3.5"
            style={{ background: "var(--crm-surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onSend(); }
              }}
              placeholder="Write a reply…"
              className="w-full bg-transparent border-none outline-none resize-none text-[13.5px] leading-[1.55] min-h-[56px]"
              style={{ color: "var(--crm-text)", fontFamily: "var(--font-body-stack)" }}
            />
            <div className="flex items-center gap-1.5 mt-2 pt-2.5"
              style={{ borderTop: "1px solid var(--border2)" }}>
              <Button variant="quiet" size="icon-sm"><Tag size={13} /></Button>
              <Button variant="quiet" size="icon-sm"><Camera size={13} /></Button>
              <Button variant="quiet" size="icon-sm"><Calendar size={13} /></Button>
              <Button variant="quiet" size="icon-sm"><Sparkles size={13} /></Button>
              <Button variant="quiet" size="sm" className="ml-1">Templates ▾</Button>
              <Button variant="accent" size="sm" className="ml-auto" onClick={onSend}>
                Send <Send size={11} />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Lead context (right) ─────────────────────────────────── */}
      <aside className="w-[280px] flex-shrink-0 overflow-y-auto px-[18px] py-[22px]"
        style={{ borderLeft: "1px solid var(--border)", background: "var(--bg2)" }}>
        <p className="eyebrow">Lead context</p>
        <div className="mt-3.5 grid gap-3">
          <Side k="Status"  v={<StatusPill kind={active?.status ?? "new"}>{(active?.status ?? "new").replace(/^\w/, (c) => c.toUpperCase())}</StatusPill>} />
          <Side k="Score"   v={<span className="font-mono text-[12px] font-semibold" style={{ color: "var(--crm-text)" }}>{active?.score ?? 0} / 100</span>} />
          <Side k="Event"   v={<span className="text-[12px]">{active?.event}</span>} />
          <Side k="Budget"  v={<span className="text-[12px] font-medium">{active?.budget}</span>} />
          <Side k="Source"  v={<span className="text-[12px]">{active?.source}</span>} />
          <Side k="Owner"   v={
            <span className="text-[12px] flex items-center gap-1.5">
              {active?.owner !== "—" && <Avatar name={active?.owner ?? "?"} size={18} />}
              {active?.owner}
            </span>
          } />
        </div>

        <p className="eyebrow mt-[22px]">Quick actions</p>
        <div className="mt-3 grid gap-1.5">
          <SideAction Icon={ChevronRight} label="Convert to opportunity" />
          <SideAction Icon={Calendar}     label="Schedule site visit" />
          <SideAction Icon={Send}         label="Generate quote" />
          <SideAction Icon={Check}        label="Mark as closed-won" />
        </div>

        <p className="eyebrow mt-[22px]">Timeline</p>
        <div className="mt-3 relative">
          <div className="absolute left-[4px] top-1.5 bottom-1.5 w-px" style={{ background: "var(--border2)" }} />
          {[
            { t: "Today",     e: "Negotiation entered" },
            { t: "Today",     e: "Proposal sent" },
            { t: "Yesterday", e: "Brief shared" },
            { t: "Nov 14",    e: "Lead created · Instagram" },
          ].map((tl, i) => (
            <div key={i} className="flex gap-2.5 py-1.5 relative">
              <span className="w-[9px] h-[9px] rounded-full mt-1 relative z-[1] shrink-0"
                style={{
                  background: i === 0 ? "var(--crm-accent)" : "var(--text4)",
                  border: "2px solid var(--bg2)",
                }} />
              <div className="flex-1">
                <div className="text-[12px]" style={{ color: "var(--text2)" }}>{tl.e}</div>
                <div className="text-[10.5px] mt-[1px]" style={{ color: "var(--text4)" }}>{tl.t}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────── */

function Bubble({ m }: { m: Msg }) {
  const isMe = m.from === "me";
  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
      <div
        className="max-w-[62%] px-[15px] py-[11px] text-[13.5px] leading-[1.55]"
        style={{
          background: isMe ? "var(--crm-text)" : "var(--crm-surface)",
          color:      isMe ? "var(--bg2)" : "var(--text2)",
          borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          border: isMe ? "1px solid var(--crm-text)" : "1px solid var(--border2)",
          boxShadow: isMe ? "none" : "0 1px 0 rgba(28,25,21,0.03)",
        }}
      >
        {m.body}
        {m.attach && (
          <div className="mt-2.5 px-3 py-2.5 rounded-lg flex items-center gap-2.5"
            style={{ background: isMe ? "rgba(255,255,255,0.10)" : "var(--bg3)" }}>
            <div className="w-7 h-8 rounded flex items-center justify-center text-[9px] font-mono"
              style={{
                background: isMe ? "rgba(255,255,255,0.15)" : "var(--bg4)",
                color: isMe ? "var(--bg2)" : "var(--text2)",
              }}>PDF</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium truncate">{m.attach.name}</div>
              <div className="text-[10.5px] opacity-70">{m.attach.size}</div>
            </div>
            <Download size={13} />
          </div>
        )}
      </div>
      <div className="text-[10.5px] mt-1 px-1" style={{ color: "var(--text4)" }}>
        {m.time}
        {isMe && <Check size={11} className="inline ml-1.5 -mb-0.5" style={{ color: "var(--crm-status-won-dot)" }} />}
        {m.quote && <span className="ml-2" style={{ color: "var(--crm-accent)" }}>· proposal attached</span>}
      </div>
    </div>
  );
}

function Side({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2.5">
      <span className="text-[11px]" style={{ color: "var(--crm-muted)" }}>{k}</span>
      <span style={{ color: "var(--text2)" }}>{v}</span>
    </div>
  );
}

function SideAction({ Icon, label }: { Icon: any; label: string }) {
  return (
    <button
      className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] rounded-[10px] transition text-left"
      style={{ color: "var(--text2)", border: "1px solid var(--border)", background: "transparent" }}
    >
      <Icon size={13} /> {label}
    </button>
  );
}
