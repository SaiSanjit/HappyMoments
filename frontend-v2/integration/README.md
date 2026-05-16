# Happy Moments — Integration Kit

Production-ready files to port the premium redesign into your Next.js codebase at `frontend-v2/`.

## TL;DR

**Most of the visual upgrade comes from one file: `globals.css`.** Every CRM page already consumes `--crm-*` CSS variables, so remapping those values is enough. Only the admin page and (optionally) the leads page header are rewritten — everything else picks up the new look automatically.

---

## Folder map

```
integration/
├─ README.md                              ← you are here
├─ src/
│  ├─ app/
│  │  ├─ globals.css                      ★ Phase 1 — the big one
│  │  └─ admin/page.tsx                   ★ Phase 3 — rewritten
│  ├─ contexts/
│  │  └─ ThemeContext.tsx                 ★ Phase 4 — no-op stub
│  ├─ components/ui/                      ★ Phase 2 — optional primitives
│  │  ├─ Button.tsx
│  │  ├─ Card.tsx
│  │  ├─ StatusPill.tsx
│  │  ├─ Avatar.tsx
│  │  ├─ Sparkline.tsx
│  │  └─ Charts.tsx
│  └─ features/
│     └─ leads/
│        └─ LeadsPage.tsx                 ★ Phase 3 — editorial header (optional)
```

Every path mirrors `frontend-v2/src/`. Copy each file to its matching location.

---

## Phase 1 · Foundation (do this first, deploy immediately)

**Goal**: change one file, every page picks up the new look.

**What to do**:
1. Copy `integration/src/app/globals.css` → `frontend-v2/src/app/globals.css` (overwrite).
2. Run `npm run dev`.

That's it. Every CRM screen (Dashboard, Leads, Opportunities, Worklist, Chats, Discussions, Resources, Territories) now renders in the new warm-cream + terracotta palette because they all reference `var(--crm-*)`, `var(--bg)`, `var(--text)`, etc.

**Notes**:
- `dashboard.css` doesn't need changes — it already uses `--crm-*` tokens.
- All 8 swappable themes (`[data-theme="rose|emerald|sapphire|nautical|blueprint|indigo|light|sapphire-light"]`) are gone. The new file ignores any leftover `data-theme` attribute.
- Fonts (Instrument Serif + Geist) load via the `@import` line at the top.
- `ThemeContext` keeps compiling but does nothing useful — Phase 4 cleans it up.

---

## Phase 2 · Shared UI primitives (optional but recommended)

**Goal**: typed helpers you can drop into new code without reinventing inline styles.

**What to do**:
1. `mkdir -p frontend-v2/src/components/ui`
2. Copy the 6 files in `integration/src/components/ui/` to that folder.

**What's inside**:
- `Button` — `variant`: `primary | accent | ghost | quiet`; `size`: `sm | md | lg | icon | icon-sm`
- `Card` — cream-paper card with optional `padded` / `compact`
- `StatusPill` — typed `kind`: `new | contacted | proposal | negotiation | won | lost | commit | confirmed | pending`
- `Avatar` + `AvatarStack` — initials, hashed tone or explicit `tone` prop
- `Sparkline` — tiny SVG line chart
- `Charts` — `BarChart`, `Donut`, `ProgressBar`

All use only your existing dependencies (`clsx`, `lucide-react`, `react`). No new packages.

---

## Phase 3 · Screen ports

After Phase 1, almost every screen already looks premium because of the variable remap. **Only two screens benefit from a full rewrite**:

### `src/app/admin/page.tsx` ★ rewrite (was full of hard-coded hex)

The original admin page used inline `#c9a84c`, `#4ade80`, `#60a5fa` hex values that wouldn't pick up the new theme. The new version uses tokens throughout, restructured KPI cards with sparklines, top-cities ranking, polished activity feed timeline.

→ Copy `integration/src/app/admin/page.tsx` over `frontend-v2/src/app/admin/page.tsx`.

> **Verify** that your `@/components/ui/*` imports resolve. If you skipped Phase 2, replace each `<Button>` / `<Card>` / `<StatusPill>` etc. with inline equivalents — or just copy Phase 2 first.

### `src/features/leads/LeadsPage.tsx` (optional rewrite)

Phase 1 already styles the existing LeadsPage fine. The new version adds an editorial header with a font-display title, segmented stage-chip filters with counts, and refined search/filter controls. Preserves your existing `LeadWizard` / `LeadDetailFull` modal flow, `getLeads` data hook, and `useResourceAuth`.

→ Copy `integration/src/features/leads/LeadsPage.tsx` if you want the upgrade. Skip otherwise.

### Other CRM screens (Dashboard, Opportunities, Worklist, Chats)

**Do nothing — Phase 1 fixes them.** They already consume `--crm-text`, `--crm-surface`, `--crm-accent`, `--crm-status-*`, so the new globals.css remap covers them. If you want the deeper editorial polish (font-display headers, sparklines, conic-gradient score rings) shown in the mockup canvas, do those as a v2 pass — they're not required to ship.

---

## Phase 4 · Cleanup

1. Copy `integration/src/contexts/ThemeContext.tsx` over `frontend-v2/src/contexts/ThemeContext.tsx` (replaces it with a no-op stub).
2. Search the codebase for theme-switcher UI: `useTheme`, `setTheme`. Most likely it lives in your topnav or settings page — remove the toggle.
3. Once nothing imports the stub, you can delete `ThemeContext.tsx` entirely and remove `<ThemeProvider>` from `app/layout.tsx`.

```bash
# Find consumers
grep -rn "useTheme\|setTheme\|ThemeProvider" frontend-v2/src
```

---

## Order of operations (recommended)

```
1. Phase 1 → ship → admire
2. Phase 2 → ship (no visible change, but tools are in place)
3. Phase 3a (admin) → ship → admire the admin
4. Phase 3b (leads) → ship if you like the editorial header
5. Phase 4 → ship → remove dead code
```

Each phase is independent and reversible. If Phase 3a breaks anything, Phase 1 still ships safely on its own.

---

## Things not in this kit

These screens were mocked in the canvas but don't have corresponding files in your current codebase, so I didn't pre-build the production version:

- `app/discover/[id]/page.tsx` — vendor public profile (the artboard JSX is your blueprint)
- `app/booking/checkout/page.tsx` — 4-step checkout flow
- `app/vendor-dashboard/profile/page.tsx` — profile editor for vendors
- `app/auth/[signin|signup]/page.tsx` — auth split-screen

When you're ready to build these as real pages, the JSX in this project's `artboards/*.jsx` files is a direct reference — translate inline-styles to Tailwind + your token system.

---

## Sanity checks

After Phase 1, you should see:
- ✅ Background changes from dark/themed to warm cream
- ✅ Sidebars/topbars are subtly lighter (cream paper)
- ✅ Buttons & accents are terracotta orange (`#c96442`)
- ✅ Status pills use dark text on light tinted backgrounds (high contrast)
- ✅ Typography feels editorial — Instrument Serif on headings, Geist on body
- ✅ All existing functionality unchanged (modals open, data loads, etc.)

If you see white backgrounds or no color change at all, your build probably cached the old CSS — restart `npm run dev`.

If status pill text looks too light against the cream surfaces, check that the new `--crm-status-*-text` values came through (they're calibrated dark-on-light, opposite of the previous dark-bg system).

---

## Final tweak values (locked from the prototype)

```
accent:   #c96442   (terracotta)
density:  compact
radius:   22px  →  --r-lg
```

These are hard-coded in `globals.css`. To change later, edit:
- Accent: search `c96442` and `a44d31` in `globals.css`
- Radius: `--r-lg: 22px` near the top
- Density: padding/spacing values throughout (no global density token)

Happy shipping. 🍂
