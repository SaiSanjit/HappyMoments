"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  MessageCircle, Send, Loader2, ChevronRight, User,
  Clock, ShieldCheck, Plus, LayoutTemplate, IndianRupee,
  X,
} from "lucide-react";
import { EmptyDiscussionsIllustration } from "@/components/illustrations/EmptyDiscussionsIllustration";
import {
  getVendorDiscussions, getMessages, sendTextMessage, sendCardMessage,
  subscribeToMessages, markMessagesRead, confirmAgreement,
} from "@/services/discussions";
import type {
  Discussion, DiscussionMessage, AmenitiesCardData, PricingCardData,
  CounterOfferData, AgreementData,
} from "@/components/discuss/types";
import AmenitiesCard from "@/components/discuss/AmenitiesCard";
import PricingCard from "@/components/discuss/PricingCard";
import CounterOfferCard from "@/components/discuss/CounterOfferCard";
import AgreementCard from "@/components/discuss/AgreementCard";
import VendorAmenitiesBuilder from "@/components/discuss/VendorAmenitiesBuilder";
import VendorPricingBuilder from "@/components/discuss/VendorPricingBuilder";

type TemplatePanel = "none" | "amenities" | `pricing_${number}`;

interface Props {
  vendorId: string;
  vendorName?: string;
  vendorHighlights?: string[];
}

export default function DiscussionsPage({ vendorId, vendorName = "Your Venue", vendorHighlights = [] }: Props) {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [active, setActive] = useState<Discussion | null>(null);
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [templatePanel, setTemplatePanel] = useState<TemplatePanel>("none");
  const [pricingVariantCount, setPricingVariantCount] = useState(1);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getVendorDiscussions(vendorId).then((d) => {
      setDiscussions(d);
      setLoading(false);
    });
  }, [vendorId]);

  const openDiscussion = useCallback(async (disc: Discussion) => {
    setActive(disc);
    setTemplatePanel("none");
    const msgs = await getMessages(disc.id);
    setMessages(msgs);
    await markMessagesRead(disc.id, "vendor");
  }, []);

  // Real-time for active discussion
  useEffect(() => {
    if (!active) return;
    const sub = subscribeToMessages(active.id, (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      markMessagesRead(active.id, "vendor");
    });
    return () => { sub.unsubscribe(); };
  }, [active]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendText = async () => {
    if (!input.trim() || !active || sending) return;
    setSending(true);
    const msg = await sendTextMessage(active.id, "vendor", vendorName, input.trim());
    if (msg) setMessages((prev) => [...prev, msg]);
    setInput("");
    setSending(false);
  };

  const handleSendAmenities = async (card: AmenitiesCardData) => {
    if (!active) return;
    setTemplatePanel("none");
    const msg = await sendCardMessage(active.id, "vendor", vendorName, "amenities_card", card);
    if (msg) setMessages((prev) => [...prev, msg]);
    setDiscussions((prev) =>
      prev.map((d) => d.id === active.id ? { ...d, last_message: "📋 Sent Amenities Overview" } : d),
    );
  };

  const handleSendPricing = async (card: PricingCardData) => {
    if (!active) return;
    setTemplatePanel("none");
    const msg = await sendCardMessage(active.id, "vendor", vendorName, "pricing_card", card);
    if (msg) {
      setMessages((prev) => [...prev, msg]);
      setPricingVariantCount((n) => n + 1);
    }
    setDiscussions((prev) =>
      prev.map((d) => d.id === active.id ? { ...d, last_message: `💰 Sent ${card.variant_name}` } : d),
    );
  };

  const handleVendorConfirmAgreement = useCallback(async (agreementId: string) => {
    await confirmAgreement(agreementId, "vendor");
    setMessages((prev) =>
      prev.map((m) => {
        if (m.message_type !== "agreement") return m;
        const d = m.card_data as AgreementData;
        return { ...m, card_data: { ...d, vendor_confirmed: true } };
      }),
    );
    if (active) {
      setDiscussions((prev) =>
        prev.map((d) => d.id === active.id ? { ...d, status: "agreed" } : d),
      );
    }
  }, [active]);

  const templateVariantNumber = () => {
    if (typeof templatePanel === "string" && templatePanel.startsWith("pricing_")) {
      return parseInt(templatePanel.split("_")[1]);
    }
    return 1;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--gold)" }} />
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ color: "var(--text)" }}>
      {/* ── Thread list ── */}
      <div
        className="flex w-72 shrink-0 flex-col border-r overflow-hidden"
        style={{ borderColor: "var(--border3)", background: "var(--bg2)" }}
      >
        <div className="px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border3)" }}>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--text3)" }}>
            Discussions
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--text4)" }}>
            {discussions.length} active thread{discussions.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {discussions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-5 text-center gap-4">
              <div className="w-28 h-28" style={{ color: "var(--gold)" }}>
                <EmptyDiscussionsIllustration className="overflow-visible" />
              </div>
              <p className="text-xs" style={{ color: "var(--text3)" }}>
                No discussions yet. Customers can start one from your vendor profile.
              </p>
            </div>
          )}
          {discussions.map((disc) => (
            <button
              key={disc.id}
              onClick={() => openDiscussion(disc)}
              className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:opacity-90"
              style={{
                background: active?.id === disc.id ? "rgba(201,168,76,0.06)" : "transparent",
                borderBottom: "1px solid var(--border3)",
                borderLeft: `3px solid ${active?.id === disc.id ? "var(--gold)" : "transparent"}`,
              }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--bg3)" }}
              >
                <User size={16} style={{ color: "var(--text3)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                    {disc.customer_name || "Customer"}
                  </p>
                  {disc.status === "agreed" && (
                    <ShieldCheck size={12} style={{ color: "#4ade80" }} />
                  )}
                </div>
                <p className="text-xs truncate mt-0.5" style={{ color: "var(--text3)" }}>
                  {disc.last_message || "No messages yet"}
                </p>
                <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: "var(--text4)" }}>
                  <Clock size={9} />
                  {new Date(disc.last_message_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                </p>
              </div>
              <ChevronRight size={13} style={{ color: "var(--text4)" }} className="mt-1 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat area ── */}
      {!active ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4" style={{ background: "var(--bg)" }}>
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}
          >
            <MessageCircle size={28} style={{ color: "var(--gold)" }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Select a discussion</p>
          <p className="text-xs" style={{ color: "var(--text3)" }}>
            Click a thread on the left to start responding.
          </p>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex flex-1 flex-col overflow-hidden" style={{ background: "var(--bg)" }}>
            {/* Chat header */}
            <div
              className="flex items-center justify-between px-5 py-3.5 shrink-0"
              style={{ borderBottom: "1px solid var(--border3)", background: "var(--bg2)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: "var(--bg3)" }}
                >
                  <User size={15} style={{ color: "var(--text3)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    {active.customer_name || "Customer"}
                  </p>
                  {active.customer_email && (
                    <p className="text-[10px]" style={{ color: "var(--text3)" }}>{active.customer_email}</p>
                  )}
                </div>
              </div>
              {active.status === "agreed" && (
                <span
                  className="flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold"
                  style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}
                >
                  <ShieldCheck size={11} /> Agreed
                </span>
              )}
            </div>

            {/* Messages scroll */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg) => {
                const isVendor = msg.sender_type === "vendor";

                if (msg.message_type === "text") {
                  return (
                    <div key={msg.id} className={`flex ${isVendor ? "justify-end" : "justify-start"}`}>
                      <div className="max-w-xs">
                        <div
                          className="rounded-2xl px-4 py-3 text-sm"
                          style={{
                            background: isVendor ? "rgba(201,168,76,0.12)" : "var(--bg3)",
                            color: isVendor ? "#e8ddd0" : "var(--text2)",
                            border: `1px solid ${isVendor ? "rgba(201,168,76,0.2)" : "var(--border2)"}`,
                            borderBottomRightRadius: isVendor ? 4 : undefined,
                            borderBottomLeftRadius: isVendor ? undefined : 4,
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
                    <div key={msg.id} className="flex justify-end">
                      <AmenitiesCard data={msg.card_data as AmenitiesCardData} sentAt={msg.created_at} />
                    </div>
                  );
                }

                if (msg.message_type === "pricing_card" && msg.card_data) {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <PricingCard data={msg.card_data as PricingCardData} sentAt={msg.created_at} />
                    </div>
                  );
                }

                if (msg.message_type === "counter_offer" && msg.card_data) {
                  return (
                    <div key={msg.id} className="flex justify-start">
                      <CounterOfferCard data={msg.card_data as CounterOfferData} sentAt={msg.created_at} />
                    </div>
                  );
                }

                if (msg.message_type === "agreement" && msg.card_data) {
                  const ag = msg.card_data as AgreementData;
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <AgreementCard
                        data={ag}
                        sentAt={msg.created_at}
                        isVendorView
                        onVendorConfirm={
                          !ag.vendor_confirmed && ag.agreement_id
                            ? () => handleVendorConfirmAgreement(ag.agreement_id)
                            : undefined
                        }
                      />
                    </div>
                  );
                }

                return null;
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input + template buttons */}
            {active.status !== "agreed" && (
              <div
                className="shrink-0 px-5 py-4 space-y-3"
                style={{ borderTop: "1px solid var(--border3)", background: "var(--bg2)" }}
              >
                {/* Template picker */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTemplatePanel(templatePanel === "amenities" ? "none" : "amenities")}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition hover:opacity-80"
                    style={{
                      background: templatePanel === "amenities" ? "rgba(201,168,76,0.15)" : "var(--bg3)",
                      color: templatePanel === "amenities" ? "var(--gold)" : "var(--text3)",
                      border: `1px solid ${templatePanel === "amenities" ? "rgba(201,168,76,0.3)" : "var(--border2)"}`,
                    }}
                  >
                    <LayoutTemplate size={12} /> Amenities Card
                  </button>
                  {[1, 2, 3, 4].slice(0, pricingVariantCount + 1 <= 4 ? pricingVariantCount : 4).map((n) => (
                    <button
                      key={n}
                      onClick={() => setTemplatePanel(templatePanel === `pricing_${n}` ? "none" : `pricing_${n}`)}
                      className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition hover:opacity-80"
                      style={{
                        background: templatePanel === `pricing_${n}` ? "rgba(201,168,76,0.12)" : "var(--bg3)",
                        color: templatePanel === `pricing_${n}` ? "var(--gold)" : "var(--text3)",
                        border: `1px solid ${templatePanel === `pricing_${n}` ? "rgba(201,168,76,0.25)" : "var(--border2)"}`,
                      }}
                    >
                      <IndianRupee size={12} /> Pricing #{n}
                    </button>
                  ))}
                  {pricingVariantCount < 4 && (
                    <button
                      onClick={() => { setPricingVariantCount((n) => Math.min(n + 1, 4)); }}
                      className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium"
                      style={{ background: "var(--bg3)", color: "var(--text4)", border: "1px dashed var(--border2)" }}
                    >
                      <Plus size={12} /> Add Variant
                    </button>
                  )}
                </div>

                {/* Text input */}
                <div className="flex gap-3 items-end">
                  <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendText(); }
                    }}
                    placeholder={`Reply to ${active.customer_name || "customer"}…`}
                    className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none resize-none"
                    style={{
                      background: "var(--bg3)",
                      color: "var(--text)",
                      border: "1px solid var(--border2)",
                      maxHeight: 100,
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
              </div>
            )}
          </div>

          {/* ── Template panel (slide-in) ── */}
          {templatePanel !== "none" && (
            <div
              className="flex w-80 shrink-0 flex-col border-l overflow-hidden"
              style={{ borderColor: "var(--border3)", background: "var(--bg2)" }}
            >
              {templatePanel === "amenities" && (
                <VendorAmenitiesBuilder
                  venueName={vendorName}
                  highlights={vendorHighlights}
                  onSend={handleSendAmenities}
                  onClose={() => setTemplatePanel("none")}
                />
              )}
              {templatePanel.startsWith("pricing_") && (
                <VendorPricingBuilder
                  variantNumber={templateVariantNumber()}
                  onSend={handleSendPricing}
                  onClose={() => setTemplatePanel("none")}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
