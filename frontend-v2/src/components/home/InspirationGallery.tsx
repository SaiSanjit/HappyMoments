import Image from "next/image";
import { INSPIRATION_ITEMS } from "@/lib/homepage-data";
import SectionHeading from "@/components/home/SectionHeading";

export default function InspirationGallery() {
  return (
    <section className="px-4 py-24 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading
          eyebrow="Inspiration gallery"
          title="Visual references that keep planning energy high."
          description="A Pinterest-inspired exploration zone helps users imagine the outcome, save ideas, and keep moving deeper into the marketplace."
          align="center"
        />

        <div className="mt-14 grid auto-rows-[240px] gap-5 md:grid-cols-3">
          {INSPIRATION_ITEMS.map((item) => (
            <article
              key={item.title}
              className={`group relative overflow-hidden rounded-[28px] border border-brand-border shadow-[0_18px_60px_rgba(15,23,38,0.08)] ${item.span}`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,20,0.04)_20%,rgba(10,12,20,0.7)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-3xl leading-none text-white">{item.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/76">{item.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
