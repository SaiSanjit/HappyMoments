"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";

const vendorStacks: Record<string, string[]> = {
  wedding: ["Editorial photographer", "Luxury venue shortlist", "Planner-led decor partner"],
  birthday: ["Creative decorator", "Entertainment + DJ", "Custom cake and catering team"],
  engagement: ["Proposal photographer", "Intimate venue", "Floral styling specialist"],
  corporate: ["Corporate planner", "AV + stage vendor", "Guest management partner"],
};

export default function AiConciergeSection() {
  const [eventType, setEventType] = useState("wedding");
  const [style, setStyle] = useState("Classic luxury");
  const [city, setCity] = useState("Hyderabad");
  const [guests, setGuests] = useState("180");

  const recommendations = useMemo(() => {
    const baseStack = vendorStacks[eventType] ?? vendorStacks.wedding;
    return [
      `Match event tone to ${style.toLowerCase()} vendor portfolios`,
      `Prioritize vendors actively booking in ${city}`,
      `Shortlist capacity-fit teams for approximately ${guests} guests`,
      ...baseStack,
    ];
  }, [city, eventType, guests, style]);

  return (
    <section className="px-4 py-24 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[34px] bg-brand-secondary p-8 text-white shadow-[0_30px_90px_rgba(15,23,38,0.14)] md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/72">
            <Sparkles size={14} className="text-brand-primary" />
            AI recommendation engine
          </div>

          <h2 className="mt-7 font-display text-4xl leading-none md:text-5xl">
            Tell us about your event, and we&apos;ll recommend the perfect vendors.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72 md:text-lg">
            Our next-gen planning flow is designed to evolve into a full concierge system with vendor comparison,
            chat context, budgets, reviews, and booking intelligence layered into one place.
          </p>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {[
              { label: "Best for", value: "High-intent planners" },
              { label: "Output", value: "Shortlists + next steps" },
              { label: "Future layer", value: "Quotes + booking logic" },
            ].map((item) => (
              <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/6 p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/52">{item.label}</p>
                <p className="mt-2 text-sm font-medium text-white/82">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/60">Event Type</span>
              <select
                value={eventType}
                onChange={(event) => setEventType(event.target.value)}
                className="w-full rounded-[20px] border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-primary"
              >
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday Party</option>
                <option value="engagement">Engagement</option>
                <option value="corporate">Corporate Event</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/60">Style</span>
              <input
                value={style}
                onChange={(event) => setStyle(event.target.value)}
                className="w-full rounded-[20px] border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-primary"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/60">City</span>
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="w-full rounded-[20px] border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-primary"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/60">Guests</span>
              <input
                value={guests}
                onChange={(event) => setGuests(event.target.value)}
                className="w-full rounded-[20px] border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-primary"
              />
            </label>
          </div>

          <button className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-4 text-sm font-semibold text-brand-secondary transition hover:-translate-y-0.5">
            Generate My Recommendations
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="premium-panel rounded-[34px] p-8 md:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-brand-primary">
                Smart shortlist preview
              </p>
              <h3 className="mt-3 font-display text-4xl leading-none text-brand-secondary">
                Concierge-quality matching
              </h3>
            </div>
            <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/12 text-brand-primary md:flex">
              <Wand2 size={24} />
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {recommendations.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-brand-border bg-white px-5 py-4 text-sm font-medium text-brand-secondary shadow-[0_14px_35px_rgba(15,23,38,0.04)]"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 rounded-[26px] bg-brand-bg p-5 md:grid-cols-3">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-brand-muted">Expected shortlist</p>
              <p className="mt-2 text-2xl font-semibold text-brand-secondary">6 premium matches</p>
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-brand-muted">Fastest response</p>
              <p className="mt-2 text-2xl font-semibold text-brand-secondary">12 minutes</p>
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-brand-muted">Planning confidence</p>
              <p className="mt-2 text-2xl font-semibold text-brand-secondary">High-fit stack</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
