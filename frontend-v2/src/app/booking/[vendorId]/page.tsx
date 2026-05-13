"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Send, Paperclip, CheckCircle,
  ChevronRight, Calendar, MapPin, Users, Star,
  BadgeCheck, Shield,
} from "lucide-react";

const STEPS = [
  "Package Selected",
  "Negotiate & Chat",
  "Confirm Details",
  "Payment",
];

type MessageRole = "vendor" | "user";
interface Message {
  role: MessageRole;
  text: string;
  time: string;
}

const QUICK_REPLIES = [
  "Can you customise this package?",
  "What dates are available?",
  "Can we schedule a call?",
  "Send me a proposal",
];

const INITIAL_MESSAGES: Message[] = [
  {
    role: "vendor",
    text: "Hello! Thanks for reaching out through Happy Moments. I'd love to be part of your special day. What kind of event are you planning?",
    time: "10:02 AM",
  },
  {
    role: "user",
    text: "Hi! We're planning our wedding reception for November 12th. Looking at the Classic Package.",
    time: "10:05 AM",
  },
  {
    role: "vendor",
    text: "That's a beautiful date! The Classic Package covers 8 hours of coverage with a full edited album. For a November booking, I can also include a complimentary engagement shoot. Shall I send over the detailed proposal?",
    time: "10:07 AM",
  },
];

export default function BookingPage() {
  const params = useParams();
  const [currentStep] = useState(1);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { role: "user", text: input, time: now }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "vendor",
          text: "Thanks for sharing that! I'll put together a custom proposal for you. Can you share the venue details so I can plan the logistics?",
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1200);
  };

  const PAYMENT_OPTIONS = [
    { id: "upi", label: "UPI / Google Pay", detail: "Instant transfer" },
    { id: "card", label: "Credit / Debit Card", detail: "Visa, Mastercard, RuPay" },
    { id: "netbanking", label: "Net Banking", detail: "All major banks" },
    { id: "emi", label: "EMI (0% interest)", detail: "3, 6, 12 months" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      {/* ── Step bar ────────────────────────────────────────── */}
      <header className="border-b border-[var(--border3)] bg-[var(--bg2)] px-4 py-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center gap-3">
            <Link
              href="/discover"
              className="flex items-center gap-2 text-xs font-semibold text-[var(--text3)] transition hover:text-[var(--text2)]"
            >
              <ArrowLeft size={13} /> Back
            </Link>
            <span className="ml-1 text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              Booking Flow
            </span>
          </div>

          <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
            {STEPS.map((step, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <div key={step} className="flex items-center">
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{
                        background: done
                          ? "rgba(74,222,128,0.15)"
                          : active
                          ? "rgba(201,168,76,0.15)"
                          : "var(--border3)",
                        border: `1px solid ${done ? "rgba(74,222,128,0.4)" : active ? "rgba(201,168,76,0.4)" : "var(--border2)"}`,
                        color: done ? "#4ade80" : active ? "#c9a84c" : "var(--text4)",
                      }}
                    >
                      {done ? <CheckCircle size={11} /> : i + 1}
                    </div>
                    <span
                      className="text-[11px] font-medium whitespace-nowrap"
                      style={{ color: active ? "var(--text)" : done ? "var(--text3)" : "var(--text4)" }}
                    >
                      {step}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <ChevronRight size={13} className="mx-3 shrink-0 text-[var(--text4)]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6 md:px-8">
        {/* ── Chat panel ── */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border2)] bg-[var(--bg2)]">
          {/* Vendor header */}
          <div className="flex items-center gap-3 border-b border-[var(--border3)] px-5 py-4">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.1)] text-sm font-bold text-[#c9a84c]">
              A
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg2)] bg-[#4ade80]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">Atelier Frame Collective</p>
              <p className="text-[10px] text-[#4ade80]">Online · Replies in ~18 min</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <Star size={11} className="fill-[#c9a84c] text-[#c9a84c]" />
              <span className="text-xs font-semibold text-[var(--text)]">4.9</span>
              <span className="text-[10px] text-[var(--text3)]">(184)</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6"
                  style={
                    msg.role === "user"
                      ? {
                          background: "rgba(201,168,76,0.14)",
                          color: "var(--text)",
                          borderBottomRightRadius: "4px",
                        }
                      : {
                          background: "var(--border3)",
                          color: "var(--text2)",
                          border: "1px solid var(--border2)",
                          borderBottomLeftRadius: "4px",
                        }
                  }
                >
                  {msg.text}
                  <p className="mt-1.5 text-[10px] opacity-50">{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          <div className="flex gap-2 overflow-x-auto px-5 pb-3 no-scrollbar">
            {QUICK_REPLIES.map((qr) => (
              <button
                key={qr}
                onClick={() => setInput(qr)}
                className="shrink-0 rounded-full border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.05)] px-3 py-1.5 text-[10px] font-medium text-[#c9a84c] transition hover:bg-[rgba(201,168,76,0.12)]"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-[var(--border3)] px-4 py-4">
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border2)] bg-[var(--border3)] px-4 py-3">
              <button className="shrink-0 text-[var(--text3)] transition hover:text-[var(--text2)]">
                <Paperclip size={16} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text4)] focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#c9a84c] text-[var(--bg)] transition hover:bg-[#e8d5a3] disabled:opacity-40"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="hidden w-[340px] shrink-0 flex-col gap-5 lg:flex">
          {/* Booking summary */}
          <div className="rounded-2xl border border-[rgba(201,168,76,0.15)] bg-[var(--bg2)] p-5">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a84c]">
              Booking Summary
            </p>
            {/* Vendor info */}
            <div className="flex items-center gap-3 border-b border-[var(--border3)] pb-4 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.08)] text-sm font-bold text-[#c9a84c]">
                A
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text)]">Atelier Frame Collective</p>
                <div className="mt-0.5 flex items-center gap-1">
                  <BadgeCheck size={10} className="text-[#c9a84c]" />
                  <span className="text-[10px] text-[var(--text3)]">Verified · Photography</span>
                </div>
              </div>
            </div>

            {/* Event details */}
            <div className="space-y-3 border-b border-[var(--border3)] pb-4 mb-4">
              {[
                { icon: Calendar, label: "Event date", value: "November 12, 2025" },
                { icon: MapPin, label: "Location", value: "Hyderabad, Telangana" },
                { icon: Users, label: "Guests", value: "~250 guests" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={13} className="shrink-0 text-[#c9a84c]" />
                  <div className="flex-1">
                    <p className="text-[10px] text-[var(--text3)]">{label}</p>
                    <p className="text-xs font-medium text-[var(--text)]">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Package */}
            <div className="mb-4 rounded-xl border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#c9a84c]">
                Classic Package
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--text)]">₹1,20,000</p>
              <div className="mt-2 space-y-1">
                {["8 hours coverage", "2 photographers", "Full edited album", "Same-day preview"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-[10px] text-[var(--text3)]">
                    <CheckCircle size={9} className="text-[#c9a84c]" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment section */}
          <div className="rounded-2xl border border-[var(--border2)] bg-[var(--bg2)] p-5">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a84c]">
              Payment
            </p>

            {/* Milestone schedule */}
            <div className="mb-4 space-y-2">
              {[
                { label: "Booking advance (30%)", amount: "₹36,000", due: "Due now" },
                { label: "Mid-event payment (40%)", amount: "₹48,000", due: "30 days before" },
                { label: "Final payment (30%)", amount: "₹36,000", due: "Day of event" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between rounded-xl border border-[var(--border3)] px-3 py-2.5"
                >
                  <div>
                    <p className="text-[10px] font-medium text-[var(--text2)]">{m.label}</p>
                    <p className="text-[9px] text-[var(--text4)]">{m.due}</p>
                  </div>
                  <span className="text-xs font-semibold text-[var(--text)]">{m.amount}</span>
                </div>
              ))}
            </div>

            {/* Payment options */}
            <div className="mb-4 space-y-2">
              {PAYMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition"
                  style={{
                    borderColor:
                      selectedPayment === opt.id
                        ? "rgba(201,168,76,0.35)"
                        : "var(--border2)",
                    background:
                      selectedPayment === opt.id
                        ? "rgba(201,168,76,0.06)"
                        : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={selectedPayment === opt.id}
                    onChange={() => setSelectedPayment(opt.id)}
                    className="accent-[#c9a84c]"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[var(--text)]">{opt.label}</p>
                    <p className="text-[10px] text-[var(--text3)]">{opt.detail}</p>
                  </div>
                </label>
              ))}
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9a84c] py-3.5 text-sm font-bold text-[var(--bg)] shadow-[0_8px_24px_rgba(201,168,76,0.25)] transition hover:-translate-y-0.5 hover:bg-[#e8d5a3]">
              Pay ₹36,000 now
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-[var(--text4)]">
              <Shield size={10} className="text-[#c9a84c]" />
              Secure · Encrypted · Escrow-protected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
