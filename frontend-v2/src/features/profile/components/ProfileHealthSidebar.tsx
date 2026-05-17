"use client";

import { CheckCircle } from "lucide-react";
import { VendorProfile } from "../ProfilePage";

interface CheckItem {
  label: string;
  points: number;
  done: boolean;
}

function computeHealth(draft: VendorProfile): { score: number; items: CheckItem[] } {
  const ai = draft.additional_info ?? {};
  const images = draft.catalog_images_metadata ?? [];

  const items: CheckItem[] = [
    {
      label: "Cover photo added",
      points: 15,
      done: images.length > 0,
    },
    {
      label: "3+ packages listed",
      points: 15,
      done: (draft.packages ?? []).length >= 3,
    },
    {
      label: "Story written",
      points: 15,
      done: (draft.quick_intro ?? draft.description ?? "").trim().length > 30,
    },
    {
      label: "City set",
      points: 10,
      done: !!(draft.address ?? "").trim(),
    },
    {
      label: "Languages added",
      points: 10,
      done: (draft.languages ?? []).length > 0,
    },
    {
      label: "Tagline added",
      points: 9,
      done: !!(ai.tagline ?? "").trim(),
    },
    {
      label: "Add a 60-second intro video",
      points: 8,
      done: false,
    },
    {
      label: "Add 5 more portfolio photos",
      points: 8,
      done: images.length >= 5,
    },
    {
      label: "Instagram linked",
      points: 5,
      done: !!(draft.instagram ?? "").trim(),
    },
    {
      label: "Founded year set",
      points: 5,
      done: !!(draft.experience ?? "").trim(),
    },
  ];

  const score = items
    .filter((i) => i.done)
    .reduce((sum, i) => sum + i.points, 0);

  return { score, items };
}

function ScoreRing({ score }: { score: number }) {
  const R = 40;
  const circ = 2 * Math.PI * R;
  const dash = (score / 100) * circ;
  const label =
    score >= 90
      ? "Excellent profile"
      : score >= 70
      ? "Strong profile"
      : score >= 50
      ? "Good profile"
      : "Needs work";

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0 w-[88px] h-[88px]">
        <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={R}
            fill="none"
            stroke="var(--border3)"
            strokeWidth="8"
          />
          <circle
            cx="48"
            cy="48"
            r={R}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-xl font-bold leading-none"
            style={{ color: "var(--text)" }}
          >
            {score}
          </span>
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            / 100
          </span>
        </div>
      </div>
      <div>
        <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
          {label}
        </p>
        <p
          className="text-xs mt-0.5 leading-snug"
          style={{ color: "var(--text-muted)" }}
        >
          {score < 100
            ? "Complete your profile to reach the top of search."
            : "Your profile is complete!"}
        </p>
      </div>
    </div>
  );
}

interface Props {
  draft: VendorProfile;
}

export default function ProfileHealthSidebar({ draft }: Props) {
  const { score, items } = computeHealth(draft);

  return (
    <aside
      className="rounded-2xl border p-5"
      style={{ background: "var(--bg2)", borderColor: "var(--border3)" }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[0.22em] mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        Profile Health
      </p>

      <ScoreRing score={score} />

      <div className="mt-4 flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            {item.done ? (
              <CheckCircle
                size={15}
                style={{ color: "var(--gold)", flexShrink: 0 }}
              />
            ) : (
              <div
                className="h-[15px] w-[15px] rounded-full border-2 shrink-0"
                style={{ borderColor: "var(--border2)" }}
              />
            )}
            <span
              className="flex-1 text-xs"
              style={{ color: item.done ? "var(--text)" : "var(--text-muted)" }}
            >
              {item.label}
            </span>
            {!item.done && (
              <span
                className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(201,168,76,0.12)",
                  color: "var(--gold)",
                }}
              >
                +{item.points}
              </span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
