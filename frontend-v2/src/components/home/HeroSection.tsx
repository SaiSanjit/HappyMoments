import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import MarketingNavbar from "@/components/home/MarketingNavbar";

const searchFields = [
  {
    label: "Event Type",
    value: "Wedding weekend",
    hint: "Luxury wedding, birthday, engagement...",
    icon: Sparkles,
  },
  {
    label: "Vendor Category",
    value: "Photography",
    hint: "Photo, venue, decor, catering...",
    icon: Search,
  },
  {
    label: "Location",
    value: "Hyderabad",
    hint: "City or destination event",
    icon: MapPin,
  },
  {
    label: "Budget + Date",
    value: "INR 8L - 15L",
    hint: "18 Dec 2026",
    icon: CalendarDays,
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[38px] border border-black/6 bg-white p-3 shadow-[0_30px_120px_rgba(15,23,38,0.12)] md:p-4">
      <div className="relative overflow-hidden rounded-[30px]">
        <Image
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2200&q=80"
          alt="Premium event planning hero"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,19,19,0.74)_0%,rgba(24,19,19,0.46)_48%,rgba(24,19,19,0.28)_100%)]" />

        <div className="relative min-h-[720px] px-5 pb-28 pt-5 md:px-8 md:pt-7 lg:px-10">
          <MarketingNavbar />

          <div className="mt-24 max-w-[680px] lg:mt-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/82 backdrop-blur-xl">
              <ShieldCheck size={14} className="text-brand-primary" />
              Trusted event vendor marketplace
            </div>

            <h1 className="mt-8 font-body text-[3.2rem] font-semibold leading-[0.95] tracking-[-0.04em] text-white md:text-[4.4rem] lg:text-[5.2rem]">
              Discover Your Perfect Event Vendors
            </h1>

            <p className="mt-6 max-w-[620px] text-lg leading-8 text-white/78 md:text-xl">
              Book verified photographers, venues, decorators, caterers, and planners for weddings,
              birthdays, baby showers, private parties, and every celebration that deserves a premium touch.
            </p>
          </div>

          <div className="absolute inset-x-5 bottom-8 md:inset-x-8 lg:inset-x-10">
            <div className="rounded-[32px] bg-white p-4 shadow-[0_24px_70px_rgba(15,23,38,0.16)] md:p-5">
              <div className="grid gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))_86px]">
                {searchFields.map((field, index) => (
                  <button
                    key={field.label}
                    className={[
                      "group flex items-center gap-4 rounded-[24px] px-4 py-4 text-left transition hover:bg-brand-bg",
                      index < searchFields.length - 1 ? "lg:border-r lg:border-black/8" : "",
                    ].join(" ")}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black/4 text-brand-muted">
                      {field.label === "Budget + Date" ? <Wallet size={18} /> : <field.icon size={18} />}
                    </div>
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-brand-muted">
                        {field.label}
                      </p>
                      <p className="mt-1 text-base font-semibold text-brand-secondary">{field.value}</p>
                      <p className="mt-1 text-sm text-brand-muted">{field.hint}</p>
                    </div>
                  </button>
                ))}

                <button className="flex h-[74px] w-[74px] items-center justify-center self-center rounded-full bg-black text-white shadow-[0_20px_45px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5">
                  <Search size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
