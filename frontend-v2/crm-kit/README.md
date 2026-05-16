# Happy Moments — Vendor CRM Kit

Production-ready files for the redesigned vendor CRM. Drop into your Next.js codebase as instructed.

This kit ports the exact UI shown in the design canvas (warm cream + terracotta, editorial premium) into TSX files that consume your existing data hooks (`useResourceAuth`, `getLeads`, `getDashboardKPI`, `getOpportunities`, etc.).

---

## 🎯 Antigravity prompt (paste this into your assistant)

> Read `crm-kit/README.md` and apply the integration to `frontend-v2/` in three phases. After **each phase**, run `npm run dev`, verify the dev server compiles with no errors, take a screenshot of the listed pages, and stop for me to confirm before proceeding.
>
> **Phase 1** — Foundation (one file, biggest visual impact):
> 1. Overwrite `frontend-v2/src/app/globals.css` with `crm-kit/src/app/globals.css`.
> 2. Restart dev server. Visit `/vendor-dashboard`, `/vendor-dashboard/leads`, `/vendor-dashboard/opportunities`. Confirm the new warm-cream + terracotta theme has taken over. Screenshot.
>
> **Phase 2** — UI primitives + screen rewrites (the kit's bulk):
> 1. Copy the entire `crm-kit/src/components/ui/` directory into `frontend-v2/src/components/ui/`.
> 2. Overwrite these screen files (paths match exactly):
>    - `frontend-v2/src/features/dashboard/DashboardPage.tsx`
>    - `frontend-v2/src/features/leads/LeadsPage.tsx`
>    - `frontend-v2/src/features/leads/components/LeadTable.tsx`
>    - `frontend-v2/src/features/opportunities/OpportunitiesPage.tsx`
>    - `frontend-v2/src/features/worklist/WorkListPage.tsx`
>    - `frontend-v2/src/features/chats/ChatsPage.tsx`
> 3. Restart dev server. Confirm every page above renders with the new design and no console errors. Screenshot each.
>
> **Phase 3** — Cleanup:
> 1. Overwrite `frontend-v2/src/contexts/ThemeContext.tsx` with `crm-kit/src/contexts/ThemeContext.tsx` (no-op stub for backwards compat).
> 2. Grep the codebase for `useTheme(`, `setTheme(`, `<ThemeProvider`. Find any visible theme-switcher UI in the topbar / settings / vendor-dashboard layout and **delete** it.
> 3. Run `npm run lint` and fix any unused-import warnings introduced by the deletions.
>
> Don't change any data hooks, modals (LeadWizard, LeadDetailFull, OptyWizard, OptyDetailFull), or service files — the kit is built to consume them as-is.

---

## Folder map

```
crm-kit/
├─ README.md                                              ← this file
└─ src/
   ├─ app/
   │  └─ globals.css                                      ★ Phase 1
   ├─ contexts/
   │  └─ ThemeContext.tsx                                 ★ Phase 3
   ├─ components/
   │  └─ ui/                                              ★ Phase 2 — primitives
   │     ├─ Button.tsx
   │     ├─ Card.tsx
   │     ├─ StatusPill.tsx
   │     ├─ Avatar.tsx
   │     ├─ Sparkline.tsx
   │     └─ Charts.tsx
   └─ features/                                           ★ Phase 2 — screen rewrites
      ├─ dashboard/DashboardPage.tsx
      ├─ leads/LeadsPage.tsx
      ├─ leads/components/LeadTable.tsx
      ├─ opportunities/OpportunitiesPage.tsx
      ├─ worklist/WorkListPage.tsx
      └─ chats/ChatsPage.tsx
```

Every path mirrors `frontend-v2/src/`. Copy each file to its matching location.

---

## What each file does

### Phase 1 — globals.css

The single biggest change. Replaces the entire multi-theme system (8 swappable themes: rose, emerald, sapphire, nautical, blueprint, indigo, sapphire-light, light) with **one curated theme**: warm cream `#f6f1e9` backgrounds, terracotta `#c96442` accent, Instrument Serif + Geist typography.

- All existing CSS variable names (`--bg`, `--crm-*`, `--gold`, `--nav-*`) are preserved, so screens you don't rewrite still pick up the new colors automatically.
- All `[data-theme="..."]` selectors are inert — leaving them in code is harmless.
- Fonts load via the `@import` line at the top.

### Phase 2 — UI primitives (`components/ui/`)

Six reusable components used by every rewritten screen. Pure TSX + your existing deps (`clsx`, `lucide-react`).

- `Button` — variants: `primary | accent | ghost | quiet`, sizes: `sm | md | lg | icon | icon-sm`
- `Card` — cream paper with `padded` / `compact` options
- `StatusPill` — typed `kind`: `new | contacted | proposal | negotiation | won | lost | commit | confirmed | pending`
- `Avatar` (+ `AvatarStack`) — initials with hashed or explicit tone
- `Sparkline` — tiny SVG line chart with filled area
- `Charts` — `BarChart`, `Donut`, `ProgressBar`

### Phase 2 — Screen rewrites

| File | What changed | Data integration |
|---|---|---|
| `dashboard/DashboardPage.tsx` | Editorial welcome header, KPI cards with sparklines, conversion funnel, hottest-leads with conic-gradient score rings, today's schedule, customer review distribution | Uses `getDashboardKPI`, `getLeadStatusBreakdown`, `getOpportunityStatusBreakdown`, `getResources`, `getTerritories` |
| `leads/LeadsPage.tsx` | Editorial header with stage-chip filters, refined search, polished view toggle | Uses `getLeads`, `useResourceAuth`. Keeps existing `LeadWizard` and `LeadDetailFull` modals |
| `leads/components/LeadTable.tsx` | New table with avatar, lead#, event venue, date·guests, budget, status pill, derived lead score bar, source. Kanban view with column totals and value | Pure component — receives `leads`, `loading`, `view`, `onSelect`, `onRefresh` from `LeadsPage` |
| `opportunities/OpportunitiesPage.tsx` | Editorial header, kanban with HOT-deal pulse indicator, priority badges, win-% bars, value-per-stage in column header. Table view also redesigned | Uses `getOpportunities`. Keeps existing `OptyWizard` and `OptyDetailFull` modals |
| `worklist/WorkListPage.tsx` | Grouped Overdue / Today / Tomorrow with progress strip, mini-stats (calls/proposals/visits), color-coded kind icons | **Demo data** — see "Worklist service" note below |
| `chats/ChatsPage.tsx` | 3-pane inbox: thread list / conversation / lead context. Typing indicator, attachment cards, quick-action sidebar with timeline | **Demo data** — see "Chats service" note below |

### Phase 3 — ThemeContext stub

A no-op replacement that keeps `import { useTheme } from "@/contexts/ThemeContext"` working everywhere while you migrate. Once you've removed all theme-switcher UI, you can delete this file entirely and the `<ThemeProvider>` wrapper from `app/layout.tsx`.

---

## ⚠️ Data integration notes

### Already wired
- **Dashboard** — fully consumes your existing service functions
- **Leads** — fully wired (table + kanban + modals)
- **Opportunities** — fully wired (table + kanban + modals)

### Demo data, ready to swap
- **Worklist** — `WorkListPage.tsx` uses an inline `DEMO_GROUPS` constant. When you have a worklist service, swap the `load()` function body to fetch from it and transform the response into `Group[]`.
- **Chats** — `ChatsPage.tsx` uses inline `DEMO_THREADS` and `DEMO_MESSAGES`. Real wiring would call `getChatRooms(vendorId)` and `getMessages(roomId)` (or equivalent). The component is structured so this is a 4-line swap — see the `useEffect` blocks marked `// Real:`.

The TypeScript types (`CRMChatRoom`, `CRMMessage`, `CRMWorklist`) already exist in your `lib/crm-types.ts` — the kit just bypasses them for the demo. Mapping shape is straightforward.

---

## Verifying after each phase

After **Phase 1**, you should see:
- ✅ Warm cream backgrounds across every CRM screen
- ✅ Terracotta accent on buttons, active states, focus rings
- ✅ Status pills are dark text on tinted-light backgrounds (high contrast)
- ✅ Typography feels editorial — Instrument Serif on serif text
- ✅ All your modals (lead create, opportunity create, etc.) still open and work

After **Phase 2**, you should see:
- ✅ Dashboard has a giant "Good morning, {name}" headline in serif
- ✅ Leads table has avatars, score bars, refined stage chip filters
- ✅ Pipeline kanban has column totals and HOT indicators
- ✅ Worklist has the Overdue/Today/Tomorrow grouping
- ✅ Chats shows the 3-pane editorial inbox
- ✅ No console errors

After **Phase 3**:
- ✅ `grep -r "data-theme" frontend-v2/src` returns nothing meaningful
- ✅ Theme switcher UI is gone from the topbar/settings
- ✅ `npm run lint` passes

---

## Common gotchas

**"Cannot find module '@/components/ui/Button'"**
You're on Phase 2 before copying the primitives. Copy `crm-kit/src/components/ui/*` into `frontend-v2/src/components/ui/` first.

**"Module not found: Can't resolve '@/services/crm'"**
The imports assume your service file is at `frontend-v2/src/services/crm.ts`. Adjust the import path if yours differs.

**Theme didn't change after copying globals.css**
Hard restart `npm run dev`. Next.js's CSS hot-reload sometimes caches the old theme. If still stuck, delete `.next/` and re-run.

**Status pills look pale**
Verify the new `--crm-status-*-text` values came through from globals.css (they're calibrated for the light cream surfaces — dark text on tinted background, opposite of the previous dark-background system).

**Lint errors on unused imports after Phase 3**
Search for `useTheme` / `setTheme` consumers and delete those branches. The stub keeps imports compiling; lint catches the dead code.

---

## Locked design decisions

```
accent:    #c96442  (terracotta — single brand color)
density:   compact-cozy hybrid (22px card padding, 14px row padding)
radius:    --r-md: 14px  ·  --r-lg: 22px
typography: Instrument Serif (display) + Geist (UI/body)
mode:      single light theme — no toggle
```

To change later:
- Accent: search `c96442` and `a44d31` in `globals.css`
- Radius: edit `--r-md` and `--r-lg` at the top of `:root`
- Density: edit padding values in the rewritten screen files

---

That's the kit. Hand it to Antigravity with the prompt at the top, sit back, and ship. 🍂
