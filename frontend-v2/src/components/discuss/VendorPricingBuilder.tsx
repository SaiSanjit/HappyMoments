"use client";

import { useState } from "react";
import { Plus, Trash2, Send, X, ChevronDown, ChevronUp } from "lucide-react";
import type { PricingCardData, PricingLineItem } from "./types";

const CATEGORIES = ["Venue", "Catering", "Decoration", "AV & Lighting", "Photography", "Entertainment", "Logistics", "Other"];

const STARTER_ITEMS: PricingLineItem[] = [
  { id: "venue", category: "Venue", name: "Venue Rental (8 hrs)", description: "Full venue access", quantity: 1, unit: "event", unit_price: 150000, total: 150000, included: true },
  { id: "catering", category: "Catering", name: "Catering (per plate)", description: "Multi-cuisine buffet", quantity: 200, unit: "plates", unit_price: 800, total: 160000, included: true },
  { id: "decoration", category: "Decoration", name: "Decoration Package", description: "Floral & theme décor", quantity: 1, unit: "event", unit_price: 75000, total: 75000, included: true },
  { id: "av", category: "AV & Lighting", name: "AV & Sound System", description: "Professional setup", quantity: 1, unit: "event", unit_price: 25000, total: 25000, included: true },
];

const VARIANT_NAMES = ["Basic Package", "Standard Package", "Premium Package", "Royal Package"];

interface Props {
  variantNumber: number;
  onSend: (card: PricingCardData) => void;
  onClose: () => void;
}

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function calcTotal(items: PricingLineItem[], discount: number, taxPct: number) {
  const subtotal = items.filter((i) => i.included).reduce((s, i) => s + i.total, 0);
  const afterDiscount = subtotal - discount;
  const taxes = Math.round(afterDiscount * (taxPct / 100));
  return { subtotal, taxes, grand_total: afterDiscount + taxes };
}

export default function VendorPricingBuilder({ variantNumber, onSend, onClose }: Props) {
  const [variantName, setVariantName] = useState(VARIANT_NAMES[variantNumber - 1] || `Package ${variantNumber}`);
  const [eventDate, setEventDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [items, setItems] = useState<PricingLineItem[]>(
    STARTER_ITEMS.map((i) => ({ ...i, id: `${i.id}_${variantNumber}` })),
  );
  const [discountAmount, setDiscountAmount] = useState("0");
  const [discountReason, setDiscountReason] = useState("");
  const [taxPct, setTaxPct] = useState("5");
  const [notes, setNotes] = useState("");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Add new item state
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Venue");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemQty, setNewItemQty] = useState("1");
  const [newItemUnit, setNewItemUnit] = useState("event");
  const [showAddItem, setShowAddItem] = useState(false);

  const totals = calcTotal(items, parseInt(discountAmount) || 0, parseFloat(taxPct) || 0);

  const toggleItem = (id: string) =>
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, included: !i.included, total: !i.included ? i.quantity * i.unit_price : i.total } : i));

  const updateItem = (id: string, field: keyof PricingLineItem, value: string | number | boolean) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const updated = { ...i, [field]: value };
        if (field === "quantity" || field === "unit_price") {
          updated.total = updated.quantity * updated.unit_price;
        }
        return updated;
      }),
    );
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const addItem = () => {
    if (!newItemName.trim() || !newItemPrice) return;
    const qty = parseInt(newItemQty) || 1;
    const unitPrice = parseFloat(newItemPrice.replace(/,/g, "")) || 0;
    const id = `custom_${Date.now()}`;
    setItems((prev) => [
      ...prev,
      { id, category: newItemCategory, name: newItemName.trim(), quantity: qty, unit: newItemUnit, unit_price: unitPrice, total: qty * unitPrice, included: true },
    ]);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemQty("1");
    setShowAddItem(false);
  };

  const handleSend = () => {
    const { subtotal, taxes, grand_total } = totals;
    const discount = parseInt(discountAmount) || 0;
    const card: PricingCardData = {
      type: "pricing_card",
      variant_name: variantName,
      variant_number: variantNumber,
      event_date: eventDate || undefined,
      valid_until: validUntil || undefined,
      items,
      subtotal,
      discount: discount > 0 ? { amount: discount, reason: discountReason || undefined } : undefined,
      taxes,
      grand_total,
      notes: notes || undefined,
    };
    onSend(card);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{ borderBottom: "1px solid var(--border3)" }}
      >
        <div>
          <p className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "var(--gold)" }}>
            Template · Variant {variantNumber}
          </p>
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Pricing Proposal
          </p>
        </div>
        <button onClick={onClose} style={{ color: "var(--text3)" }}>
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Package name & dates */}
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "var(--text3)" }}>
              Package Name
            </label>
            <input
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "var(--text3)" }}>
                Event Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "var(--text3)" }}>
                Valid Until
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
              />
            </div>
          </div>
        </div>

        {/* Line items */}
        <div>
          <label className="block text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--text3)" }}>
            Line Items
          </label>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: item.included ? "rgba(201,168,76,0.05)" : "var(--bg3)",
                  border: `1px solid ${item.included ? "rgba(201,168,76,0.15)" : "var(--border2)"}`,
                }}
              >
                {/* Summary row */}
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition"
                    style={{
                      background: item.included ? "rgba(201,168,76,0.2)" : "rgba(232,221,208,0.06)",
                      border: `1px solid ${item.included ? "rgba(201,168,76,0.4)" : "rgba(232,221,208,0.12)"}`,
                    }}
                  >
                    {item.included && <span style={{ color: "var(--gold)", fontSize: 10, fontWeight: 700 }}>✓</span>}
                  </button>
                  <span
                    className="flex-1 text-xs font-medium truncate"
                    style={{ color: item.included ? "var(--text)" : "var(--text3)" }}
                  >
                    {item.name}
                  </span>
                  {item.included && (
                    <span className="text-xs font-semibold shrink-0" style={{ color: "var(--gold)" }}>
                      {fmt(item.total)}
                    </span>
                  )}
                  <button
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                    style={{ color: "var(--text3)" }}
                  >
                    {expandedItem === item.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                  <button onClick={() => removeItem(item.id)} style={{ color: "var(--text4)" }}>
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Expanded edit row */}
                {expandedItem === item.id && (
                  <div className="px-3 pb-3 space-y-2 border-t" style={{ borderColor: "var(--border3)" }}>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text4)" }}>Category</label>
                        <select
                          value={item.category}
                          onChange={(e) => updateItem(item.id, "category", e.target.value)}
                          className="w-full rounded-lg px-2 py-1.5 text-[11px] outline-none mt-1"
                          style={{ background: "var(--bg4)", color: "var(--text2)", border: "1px solid var(--border3)" }}
                        >
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text4)" }}>Unit</label>
                        <input
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                          className="w-full rounded-lg px-2 py-1.5 text-[11px] outline-none mt-1"
                          style={{ background: "var(--bg4)", color: "var(--text2)", border: "1px solid var(--border3)" }}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text4)" }}>Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 1)}
                          className="w-full rounded-lg px-2 py-1.5 text-[11px] outline-none mt-1"
                          style={{ background: "var(--bg4)", color: "var(--text2)", border: "1px solid var(--border3)" }}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text4)" }}>Unit Price (₹)</label>
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateItem(item.id, "unit_price", parseFloat(e.target.value) || 0)}
                          className="w-full rounded-lg px-2 py-1.5 text-[11px] outline-none mt-1"
                          style={{ background: "var(--bg4)", color: "var(--text2)", border: "1px solid var(--border3)" }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text4)" }}>Description</label>
                      <input
                        value={item.description || ""}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        placeholder="Optional description"
                        className="w-full rounded-lg px-2 py-1.5 text-[11px] outline-none mt-1"
                        style={{ background: "var(--bg4)", color: "var(--text2)", border: "1px solid var(--border3)" }}
                      />
                    </div>
                    <p className="text-[10px] font-semibold" style={{ color: "var(--gold)" }}>
                      Line total: {fmt(item.quantity * item.unit_price)}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Add item form */}
            {showAddItem ? (
              <div
                className="rounded-xl px-3 py-3 space-y-2"
                style={{ background: "var(--bg3)", border: "1px solid var(--border2)" }}
              >
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Item name"
                    className="col-span-2 rounded-lg px-3 py-2 text-xs outline-none"
                    style={{ background: "var(--bg4)", color: "var(--text)", border: "1px solid var(--border3)" }}
                  />
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="rounded-lg px-2 py-2 text-xs outline-none"
                    style={{ background: "var(--bg4)", color: "var(--text2)", border: "1px solid var(--border3)" }}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder="Unit (event/plates…)"
                    className="rounded-lg px-2 py-2 text-xs outline-none"
                    style={{ background: "var(--bg4)", color: "var(--text2)", border: "1px solid var(--border3)" }}
                  />
                  <input
                    type="number"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    placeholder="Qty"
                    className="rounded-lg px-2 py-2 text-xs outline-none"
                    style={{ background: "var(--bg4)", color: "var(--text2)", border: "1px solid var(--border3)" }}
                  />
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="Unit price (₹)"
                    className="rounded-lg px-2 py-2 text-xs outline-none"
                    style={{ background: "var(--bg4)", color: "var(--text2)", border: "1px solid var(--border3)" }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addItem}
                    className="flex-1 rounded-lg py-2 text-xs font-semibold"
                    style={{ background: "rgba(201,168,76,0.15)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.25)" }}
                  >
                    Add Item
                  </button>
                  <button
                    onClick={() => setShowAddItem(false)}
                    className="rounded-lg px-3 py-2 text-xs"
                    style={{ background: "var(--bg4)", color: "var(--text3)", border: "1px solid var(--border3)" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddItem(true)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-medium transition hover:opacity-80"
                style={{ background: "var(--bg3)", color: "var(--text3)", border: "1px dashed var(--border2)" }}
              >
                <Plus size={13} /> Add Line Item
              </button>
            )}
          </div>
        </div>

        {/* Discount & tax */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "var(--text3)" }}>
                Discount (₹)
              </label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "var(--text3)" }}>
                Tax %
              </label>
              <input
                type="number"
                value={taxPct}
                onChange={(e) => setTaxPct(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
              />
            </div>
          </div>
          {parseInt(discountAmount) > 0 && (
            <input
              value={discountReason}
              onChange={(e) => setDiscountReason(e.target.value)}
              placeholder="Discount reason (e.g. early booking)"
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
            />
          )}
        </div>

        {/* Live totals preview */}
        <div
          className="rounded-xl px-4 py-3 space-y-1.5"
          style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}
        >
          <div className="flex justify-between text-xs" style={{ color: "var(--text3)" }}>
            <span>Subtotal</span><span>{fmt(totals.subtotal)}</span>
          </div>
          {parseInt(discountAmount) > 0 && (
            <div className="flex justify-between text-xs" style={{ color: "#4ade80" }}>
              <span>Discount</span><span>- {fmt(parseInt(discountAmount))}</span>
            </div>
          )}
          {totals.taxes > 0 && (
            <div className="flex justify-between text-xs" style={{ color: "var(--text3)" }}>
              <span>Tax ({taxPct}%)</span><span>{fmt(totals.taxes)}</span>
            </div>
          )}
          <div
            className="flex justify-between pt-1.5"
            style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}
          >
            <span className="text-sm font-bold" style={{ color: "var(--text)" }}>Grand Total</span>
            <span className="text-base font-bold" style={{ color: "var(--gold)" }}>{fmt(totals.grand_total)}</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "var(--text3)" }}>
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. Price valid for June 2026 bookings only"
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
            style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
          />
        </div>
      </div>

      {/* Send */}
      <div className="shrink-0 px-5 py-4" style={{ borderTop: "1px solid var(--border3)" }}>
        <button
          onClick={handleSend}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #e8d5a3)",
            color: "#070503",
            boxShadow: "0 8px 24px rgba(201,168,76,0.3)",
          }}
        >
          <Send size={15} /> Send Pricing Proposal
        </button>
      </div>
    </div>
  );
}
