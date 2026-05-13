import Image from "next/image";
import { Heart, MapPin, MessageCircleMore, Scale, ShieldCheck, Star } from "lucide-react";
import { FeaturedVendor } from "@/lib/homepage-data";
import { formatPrice } from "@/lib/utils";

interface FeaturedVendorCardProps {
  vendor: FeaturedVendor;
}

export default function FeaturedVendorCard({ vendor }: FeaturedVendorCardProps) {
  return (
    <article className="group overflow-hidden rounded-[30px] border border-brand-border bg-white shadow-[0_24px_65px_rgba(15,23,38,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,23,38,0.12)]">
      <div className="relative h-[280px] overflow-hidden">
        <Image
          src={vendor.image}
          alt={vendor.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,38,0.03)_20%,rgba(15,23,38,0.68)_100%)]" />
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <div className="rounded-full border border-white/18 bg-black/20 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-md">
            {vendor.topTag}
          </div>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/18 bg-white/12 text-white backdrop-blur-md transition hover:bg-white/18"
            aria-label={`Save ${vendor.name}`}
          >
            <Heart size={18} />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/62">{vendor.category}</p>
            <h3 className="mt-2 font-display text-3xl leading-none text-white">{vendor.name}</h3>
          </div>
          <div className="rounded-2xl border border-white/16 bg-black/18 px-3 py-2 text-right backdrop-blur-md">
            <div className="flex items-center justify-end gap-1 text-sm text-white">
              <Star size={14} className="fill-brand-primary text-brand-primary" />
              {vendor.rating.toFixed(1)}
            </div>
            <p className="mt-1 text-xs text-white/65">{vendor.reviews} reviews</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-brand-muted">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-secondary/4 px-3 py-2">
            <MapPin size={15} className="text-brand-primary" />
            {vendor.location}
          </div>
          {vendor.verified && (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">
              <ShieldCheck size={15} />
              Verified
            </div>
          )}
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-2 text-brand-secondary">
            {vendor.availability}
          </div>
        </div>

        <div className="grid gap-3 rounded-[24px] bg-brand-bg p-4 text-sm text-brand-muted sm:grid-cols-2">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brand-muted">Pricing</p>
            <p className="mt-2 text-lg font-semibold text-brand-secondary">
              {formatPrice(vendor.priceFrom)}
              <span className="text-sm font-medium text-brand-muted"> starting</span>
            </p>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brand-muted">Response</p>
            <p className="mt-2 text-lg font-semibold text-brand-secondary">{vendor.replyTime}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-secondary px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
            <MessageCircleMore size={16} />
            Quick Chat
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-border px-4 py-3 text-sm font-semibold text-brand-secondary transition hover:border-brand-primary/50 hover:text-brand-primary">
            <Scale size={16} />
            Compare
          </button>
          <button className="rounded-full border border-brand-border px-4 py-3 text-sm font-semibold text-brand-secondary transition hover:border-brand-primary/50 hover:text-brand-primary">
            Save
          </button>
        </div>
      </div>
    </article>
  );
}
