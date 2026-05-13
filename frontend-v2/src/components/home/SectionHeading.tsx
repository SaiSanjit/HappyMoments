interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={[
        "max-w-4xl",
        isCentered ? "mx-auto text-center" : "",
      ].join(" ")}
    >
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.35em] text-brand-primary">
        {eyebrow}
      </p>
      <h2
        className={[
          "mt-4 max-w-[16ch] font-display text-[2.9rem] leading-[0.94] text-brand-secondary md:text-[3.4rem]",
          isCentered ? "mx-auto" : "",
        ].join(" ")}
      >
        {title}
      </h2>
      <p className="mt-5 text-base leading-7 text-brand-muted md:text-lg">
        {description}
      </p>
    </div>
  );
}
