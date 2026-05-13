"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Send, Loader2, MessageSquare, ArrowLeftRight,
  ShieldCheck, X, IndianRupee, AlertCircle,
} from "lucide-react";
import { getVendorBySlug } from "@/services/vendors";
import {
  getOrCreateDiscussion, getMessages, sendTextMessage, sendCardMessage,
  subscribeToMessages, markMessagesRead, createAgreement, confirmAgreement, getAgreement,
} from "@/services/discussions";
import type { Discussion, DiscussionMessage, PricingCardData, CounterOfferData, AgreementData } from "@/components/discuss/types";
import AmenitiesCard from "@/components/discuss/AmenitiesCard";
import PricingCard from "@/components/discuss/PricingCard";
import CounterOfferCard from "@/components/discuss/CounterOfferCard";
import AgreementCard from "@/components/discuss/AgreementCard";
import type { Vendor } from "@/lib/supabase";
import MarketingNavbar from "@/components/home/MarketingNavbar";

// ── Counter-offer modal ────────────────────────────────────────

interface CounterOfferModalProps {
  pricingCard: PricingCardData;
  pricingMsgId: string;
  onSend: (data: CounterOfferData) => void;
  onClose: () => void;
}

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function CounterOfferModal({ pricingCard, pricingMsgId, onSend, onClose }: CounterOfferModalProps) {
  const includedItems = pricingCard.items.filter((i) => i.included);
  const [accepted, setAccepted] = useState<Record<string, boolean>>(
    Object.fromEntries(includedItems.map((i) => [i.id, true])),
  );
  const [counterPrices, setCounterPrices] = useState<Record<string, string>>({});
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [comments, setComments] = useState("");

  const proposedTotal = includedItems.reduce((sum, item) => {
    if (!accepted[item.id]) return sum;
    const cp = counterPrices[item.id];
    return sum + (cp ? parseFloat(cp) || 0 : item.total);
  }, 0);

  const handleSend = () => {
    const counterItems = includedItems.map((item) => ({
      id: item.id,
      name: item.name,
      accepted: !!accepted[item.id],
      original_price: item.total,
      counter_price: accepted[item.id] && counterPrices[item.id] ? parseFloat(counterPrices[item.id]) : undefined,
      note: itemNotes[item.id] || undefined,
    }));

    onSend({
      type: "counter_offer",
      referencing_message_id: pricingMsgId,
      variant_name: pricingCard.variant_name,
      items: counterItems,
      proposed_total: proposedTotal,
      comments,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ background: "var(--bg2)", border: "1px solid rgba(251,146,60,0.25)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--border3)", background: "rgba(251,146,60,0.06)" }}
        >
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "#fb923c" }}>Counter Offer</p>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Re: {pricingCard.variant_name}</p>
          </div>
          <button onClick={onClose} style={{ color: "var(--text3)" }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          <p className="text-xs" style={{ color: "var(--text3)" }}>
            Toggle items you want, set your counter price, or leave blank to accept the quoted price.
          </p>
          {includedItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden"
              style={{
                background: accepted[item.id] ? "rgba(251,146,60,0.05)" : "var(--bg3)",
                border: `1px solid ${accepted[item.id] ? "rgba(251,146,60,0.2)" : "var(--border2)"}`,
              }}
            >
              <div className="flex items-center gap-3 px-3 py-2.5">
                <button
                  onClick={() => setAccepted((p) => ({ ...p, [item.id]: !p[item.id] }))}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                  style={{
                    background: accepted[item.id] ? "rgba(251,146,60,0.2)" : "rgba(232,221,208,0.06)",
                    border: `1px solid ${accepted[item.id] ? "rgba(251,146,60,0.4)" : "rgba(232,221,208,0.12)"}`,
                  }}
                >
                  {accepted[item.id] && <span style={{ color: "#fb923c", fontSize: 10, fontWeight: 700 }}>✓</span>}
                </button>
                <span className="flex-1 text-xs font-medium" style={{ color: accepted[item.id] ? "var(--text)" : "var(--text3)" }}>
                  {item.name}
                </span>
                <span className="text-xs" style={{ color: "var(--text3)" }}>{fmt(item.total)}</span>
              </div>
              {accepted[item.id] && (
                <div className="px-3 pb-2.5 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder={`Counter price (₹)`}
                    value={counterPrices[item.id] || ""}
                    onChange={(e) => setCounterPrices((p) => ({ ...p, [item.id]: e.target.value }))}
                    className="rounded-lg px-3 py-1.5 text-xs outline-none"
                    style={{ background: "rgba(0,0,0,0.2)", color: "var(--text)", border: "1px solid var(--border3)" }}
                  />
                  <input
                    placeholder="Note (optional)"
                    value={itemNotes[item.id] || ""}
                    onChange={(e) => setItemNotes((p) => ({ ...p, [item.id]: e.target.value }))}
                    className="rounded-lg px-3 py-1.5 text-xs outline-none"
                    style={{ background: "rgba(0,0,0,0.2)", color: "var(--text2)", border: "1px solid var(--border3)" }}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Proposed total */}
          <div
            className="rounded-xl px-4 py-3 flex justify-between"
            style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}
          >
            <span className="text-sm font-bold" style={{ color: "var(--text)" }}>Proposed Total</span>
            <span className="text-base font-bold" style={{ color: "#fb923c" }}>{fmt(proposedTotal)}</span>
          </div>

          <textarea
            rows={2}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add a note to the vendor…"
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
            style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
          />
        </div>

        <div className="shrink-0 px-5 py-4" style={{ borderTop: "1px solid var(--border3)" }}>
          <button
            onClick={handleSend}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition hover:opacity-80"
            style={{ background: "rgba(251,146,60,0.15)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)" }}
          >
            <ArrowLeftRight size={15} /> Send Counter Offer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────

export default function DiscussPage() {
  const params = useParams();
  const router = useRouter();
  const vendorSlug = params.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [counterTarget, setCounterTarget] = useState<{ msg: DiscussionMessage; data: PricingCardData } | null>(null);
  const [agreementId, setAgreementId] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const customerId = typeof window !== "undefined" ? parseInt(localStorage.getItem("customer_id") || "0") : 0;
  const customerName = typeof window !== "undefined" ? localStorage.getItem("customer_name") || "You" : "You";

  useEffect(() => {
    if (!customerId) { setAuthError(true); setLoading(false); return; }

    getVendorBySlug(vendorSlug).then(async (v) => {
      if (!v) { setLoading(false); return; }
      setVendor(v);

      const disc = await getOrCreateDiscussion(v.vendor_id, customerId, customerName);
      if (!disc) { setLoading(false); return; }
      setDiscussion(disc);

      const msgs = await getMessages(disc.id);
      setMessages(msgs);
      await markMessagesRead(disc.id, "customer");

      // Check for existing agreement
      const ag = await getAgreement(disc.id);
      if (ag) setAgreementId(ag.id);

      setLoading(false);
    });
  }, [vendorSlug, customerId, customerName]);

  // Real-time subscription
  useEffect(() => {
    if (!discussion) return;
    const sub = subscribeToMessages(discussion.id, (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      markMessagesRead(discussion.id, "customer");
    });
    return () => { sub.unsubscribe(); };
  }, [discussion]);

  // Auto-scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendText = async () => {
    if (!input.trim() || !discussion || sending) return;
    setSending(true);
    const msg = await sendTextMessage(discussion.id, "customer", customerName, input.trim());
    if (msg) setMessages((prev) => [...prev, msg]);
    setInput("");
    setSending(false);
  };

  const handleCounterOffer = useCallback(async (data: CounterOfferData) => {
    if (!discussion) return;
    setCounterTarget(null);
    const msg = await sendCardMessage(discussion.id, "customer", customerName, "counter_offer", data);
    if (msg) setMessages((prev) => [...prev, msg]);
  }, [discussion, customerName]);

  const handleAcceptPricing = useCallback(async (pricingMsg: DiscussionMessage) => {
    if (!discussion || !vendor) return;
    const pd = pricingMsg.card_data as PricingCardData;
    const agreementData: AgreementData = {
      type: "agreement",
      agreement_id: "",
      items: pd.items.filter((i) => i.included).map((i) => ({ name: i.name, price: i.total })),
      total: pd.grand_total,
      event_date: pd.event_date,
      terms: "50% advance payment required within 7 days to confirm booking. Balance due on the event day.",
      notes: pd.notes,
      vendor_confirmed: false,
      customer_confirmed: true,
    };

    const ag = await createAgreement(discussion.id, vendor.vendor_id, customerId, agreementData);
    if (!ag) return;
    setAgreementId(ag.id);

    const cardWithId: AgreementData = { ...agreementData, agreement_id: ag.id };
    const msg = await sendCardMessage(discussion.id, "customer", customerName, "agreement", cardWithId);
    if (msg) setMessages((prev) => [...prev, msg]);
  }, [discussion, vendor, customerId, customerName]);

  const handleCustomerConfirmAgreement = useCallback(async () => {
    if (!agreementId) return;
    await confirmAgreement(agreementId, "customer");
    setMessages((prev) =>
      prev.map((m) => {
        if (m.message_type !== "agreement") return m;
        const d = m.card_data as AgreementData;
        return { ...m, card_data: { ...d, customer_confirmed: true } };
      }),
    );
  }, [agreementId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--gold)" }} />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4" style={{ background: "var(--bg)" }}>
        <AlertCircle size={32} style={{ color: "#f87171" }} />
        <p className="text-sm" style={{ color: "var(--text2)" }}>Please sign in to discuss with vendors.</p>
        <Link href="/auth/login" className="text-sm font-semibold" style={{ color: "var(--gold)" }}>
          Sign In
        </Link>
      </div>
    );
  }

  if (!vendor || !discussion) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4" style={{ background: "var(--bg)" }}>
        <p className="text-sm" style={{ color: "var(--text2)" }}>Vendor not found.</p>
        <Link href="/discover" className="text-sm font-semibold" style={{ color: "var(--gold)" }}>Back to Discover</Link>
      </div>
    );
  }

  const isAgreed = discussion.status === "agreed";

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--bg)" }}>
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
        <MarketingNavbar />
      </header>

      {/* Chat header */}
      <div
        className="fixed inset-x-0 z-40 flex items-center gap-3 px-4 py-3 pt-20 md:pt-20 mt-4 md:px-8"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--border3)" }}
      >
        <Link
          href={`/vendor/${vendorSlug}`}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition"
          style={{ color: "var(--text2)" }}
        >
          <ArrowLeft size={16} /> {vendor.brand_name}
        </Link>
        <span style={{ color: "var(--text4)" }}>·</span>
        <div className="flex items-center gap-1.5">
          <MessageSquare size={13} style={{ color: "var(--gold)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>Discuss</span>
        </div>
        {isAgreed && (
          <span
            className="ml-auto flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold"
            style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}
          >
            <ShieldCheck size={11} /> Agreement Finalised
          </span>
        )}
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-4 pt-44 pb-28 md:px-8 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <MessageSquare size={24} style={{ color: "var(--gold)" }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Start the conversation</p>
            <p className="text-xs text-center max-w-xs" style={{ color: "var(--text3)" }}>
              Ask {vendor.brand_name} about amenities, availability, or request a price proposal.
            </p>
            {/* Quick starters */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {[
                "What amenities do you provide?",
                "Can you share your pricing?",
                "Do you handle corporate events?",
                "What's the maximum capacity?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="rounded-full px-4 py-1.5 text-xs font-medium transition hover:opacity-80"
                  style={{ background: "var(--bg3)", color: "var(--text2)", border: "1px solid var(--border2)" }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isCustomer = msg.sender_type === "customer";

          if (msg.message_type === "text") {
            return (
              <div key={msg.id} className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
                <div className="max-w-xs">
                  {!isCustomer && (
                    <p className="text-[10px] mb-1 ml-1" style={{ color: "var(--text3)" }}>{vendor.brand_name}</p>
                  )}
                  <div
                    className="rounded-2xl px-4 py-3 text-sm"
                    style={{
                      background: isCustomer ? "rgba(201,168,76,0.15)" : "var(--bg3)",
                      color: isCustomer ? "#e8ddd0" : "var(--text2)",
                      border: `1px solid ${isCustomer ? "rgba(201,168,76,0.25)" : "var(--border2)"}`,
                      borderBottomRightRadius: isCustomer ? 4 : undefined,
                      borderBottomLeftRadius: isCustomer ? undefined : 4,
                    }}
                  >
                    {msg.content}
                  </div>
                  <p className="text-[10px] mt-1 mx-1" style={{ color: "var(--text4)" }}>
                    {new Date(msg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          }

          if (msg.message_type === "amenities_card" && msg.card_data) {
            return (
              <div key={msg.id} className="flex justify-start">
                <div>
                  <p className="text-[10px] mb-1 ml-1" style={{ color: "var(--text3)" }}>{vendor.brand_name}</p>
                  <AmenitiesCard data={msg.card_data as import("@/components/discuss/types").AmenitiesCardData} sentAt={msg.created_at} />
                </div>
              </div>
            );
          }

          if (msg.message_type === "pricing_card" && msg.card_data) {
            const pd = msg.card_data as PricingCardData;
            return (
              <div key={msg.id} className="flex justify-start">
                <div>
                  <p className="text-[10px] mb-1 ml-1" style={{ color: "var(--text3)" }}>{vendor.brand_name}</p>
                  <PricingCard
                    data={pd}
                    sentAt={msg.created_at}
                    isCustomerView
                    onCounterOffer={() => setCounterTarget({ msg, data: pd })}
                    onAccept={() => handleAcceptPricing(msg)}
                  />
                </div>
              </div>
            );
          }

          if (msg.message_type === "counter_offer" && msg.card_data) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div>
                  <CounterOfferCard data={msg.card_data as CounterOfferData} sentAt={msg.created_at} />
                </div>
              </div>
            );
          }

          if (msg.message_type === "agreement" && msg.card_data) {
            const ag = msg.card_data as AgreementData;
            const canConfirm = !ag.customer_confirmed && isCustomer;
            return (
              <div key={msg.id} className="flex justify-center">
                <AgreementCard
                  data={ag}
                  sentAt={msg.created_at}
                  isCustomerView
                  onCustomerConfirm={canConfirm ? handleCustomerConfirmAgreement : undefined}
                />
              </div>
            );
          }

          return null;
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      {!isAgreed && (
        <div
          className="fixed inset-x-0 bottom-0 px-4 py-4 md:px-8"
          style={{ background: "var(--bg)", borderTop: "1px solid var(--border3)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex gap-3 items-end max-w-3xl mx-auto">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendText(); }
              }}
              placeholder={`Message ${vendor.brand_name}…`}
              className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none resize-none"
              style={{
                background: "var(--bg3)",
                color: "var(--text)",
                border: "1px solid var(--border2)",
                maxHeight: 120,
              }}
            />
            <button
              onClick={handleSendText}
              disabled={!input.trim() || sending}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition disabled:opacity-40"
              style={{ background: "var(--gold)", color: "var(--bg)" }}
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
          <p className="mt-2 text-center text-[10px]" style={{ color: "var(--text4)" }}>
            You can also request amenity details or a price proposal — ask the vendor directly.
          </p>
        </div>
      )}

      {isAgreed && (
        <div
          className="fixed inset-x-0 bottom-0 px-4 py-4 md:px-8 text-center"
          style={{ background: "var(--bg)", borderTop: "1px solid rgba(74,222,128,0.2)" }}
        >
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={14} style={{ color: "#4ade80" }} />
            <span className="text-xs font-semibold" style={{ color: "#4ade80" }}>
              Agreement is finalised. Expect a follow-up from {vendor.brand_name}.
            </span>
          </div>
        </div>
      )}

      {/* Counter offer modal */}
      {counterTarget && (
        <CounterOfferModal
          pricingCard={counterTarget.data}
          pricingMsgId={counterTarget.msg.id}
          onSend={handleCounterOffer}
          onClose={() => setCounterTarget(null)}
        />
      )}
    </div>
  );
}
