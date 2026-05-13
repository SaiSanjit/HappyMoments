"use client";

import { useMemo, useState } from "react";
import { Calculator, Landmark, Users2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const eventMultipliers: Record<string, number> = {
  wedding: 4200,
  birthday: 1600,
  engagement: 2400,
  corporate: 2800,
};

const cityMultipliers: Record<string, number> = {
  Hyderabad: 1,
  Bangalore: 1.18,
  Mumbai: 1.32,
  Delhi: 1.22,
  Jaipur: 1.08,
};

export default function BudgetPlannerSection() {
  const [guestCount, setGuestCount] = useState(180);
  const [city, setCity] = useState("Hyderabad");
  const [eventType, setEventType] = useState("wedding");

  const budget = useMemo(() => {
    const perGuest = eventMultipliers[eventType] ?? eventMultipliers.wedding;
    const cityMultiplier = cityMultipliers[city] ?? 1;
    const total = Math.round(guestCount * perGuest * cityMultiplier);

    return {
      total,
      venue: Math.round(total * 0.34),
      decor: Math.round(total * 0.18),
      photo: Math.round(total * 0.13),
      food: Math.round(total * 0.25),
      planning: Math.round(total * 0.1),
    };
  }, [city, eventType, guestCount]);

  const breakdown = [
    { label: "Venue", value: budget.venue },
    { label: "Food & hospitality", value: budget.food },
    { label: "Decor & styling", value: budget.decor },
    { label: "Photo & video", value: budget.photo },
    { label: "Planning & coordination", value: budget.planning },
  ];

  return (
    <section className="px-4 py-24 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1320px] gap-8 rounded-[36px] border border-brand-border bg-[linear-gradient(180deg,#fffdfa_0%,#f7f0e7_100%)] p-8 shadow-[0_30px_85px_rgba(15,23,38,0.06)] md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-primary">
            <Calculator size={14} />
            Budget planner preview
          </div>
          <h2 className="mt-6 font-display text-4xl leading-none text-brand-secondary md:text-5xl">
            Estimate event budgets before you shortlist vendors.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-brand-muted md:text-lg">
            This preview creates a conversion-friendly first step for guests who need financial clarity
            before they begin chatting, comparing, and booking.
          </p>

          <div className="mt-8 grid gap-4">
            <label className="space-y-2">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-brand-muted">Guest Count</span>
              <div className="flex items-center gap-3 rounded-[22px] border border-brand-border bg-white px-4 py-4">
                <Users2 size={18} className="text-brand-primary" />
                <input
                  type="range"
                  min={50}
                  max={600}
                  step={10}
                  value={guestCount}
                  onChange={(event) => setGuestCount(Number(event.target.value))}
                  className="w-full accent-[var(--color-brand-primary)]"
                />
                <span className="w-14 text-right text-sm font-semibold text-brand-secondary">{guestCount}</span>
              </div>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-brand-muted">City</span>
                <select
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="w-full rounded-[22px] border border-brand-border bg-white px-4 py-4 text-sm text-brand-secondary outline-none transition focus:border-brand-primary"
                >
                  {Object.keys(cityMultipliers).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-brand-muted">Event Type</span>
                <select
                  value={eventType}
                  onChange={(event) => setEventType(event.target.value)}
                  className="w-full rounded-[22px] border border-brand-border bg-white px-4 py-4 text-sm text-brand-secondary outline-none transition focus:border-brand-primary"
                >
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="engagement">Engagement</option>
                  <option value="corporate">Corporate</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-5 rounded-[30px] bg-brand-secondary p-6 text-white md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-white/58">Estimated total budget</p>
              <p className="mt-4 font-display text-5xl leading-none md:text-6xl">
                {formatPrice(budget.total)}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-brand-primary">
              <Landmark size={24} />
            </div>
          </div>

          <div className="grid gap-3">
            {breakdown.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/6 px-4 py-4"
              >
                <span className="text-sm text-white/72">{item.label}</span>
                <span className="text-sm font-semibold text-white">{formatPrice(item.value)}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              `About ${Math.round(budget.total / guestCount).toLocaleString("en-IN")} per guest`,
              "Ideal for early-stage planning conversations",
              "Ready to evolve into full package comparison",
            ].map((item) => (
              <div key={item} className="rounded-[18px] border border-white/10 bg-black/12 px-4 py-3 text-sm text-white/70">
                {item}
              </div>
            ))}
          </div>

          <button className="rounded-full bg-brand-primary px-5 py-4 text-sm font-semibold text-brand-secondary transition hover:-translate-y-0.5">
            Unlock Full Budget Planner
          </button>
        </div>
      </div>
    </section>
  );
}
