---
name: motion-svg
description: Create animated SVG illustrations for any page context in any app. Handles empty states, onboarding, success states, and decorative use. Outputs ready-to-use React TSX with Framer Motion. Works across CRM, e-commerce, SaaS, social, healthcare, education, and more.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Motion SVG Illustration Generator

> **Philosophy:** Every illustration tells a story. The metaphor should make the user feel *understood*, not lost. Animation is communication — every motion must have meaning.

---

## ⚡ What This Skill Does

**Input:** Page context (e.g. "customers", "empty cart", "API keys") + app type  
**Output:** A production-ready `[Context]Illustration.tsx` React component

**Use cases beyond empty states:**
- Empty states (no data yet)
- Onboarding / feature introduction screens
- Success / completion states
- Loading placeholders
- Sidebar / card decorative accents
- Dashboard hero banners
- Modal / drawer empty content

---

## 1. Universal Context → Metaphor Library

### How to Use This Library

1. Find your **app type** in the table below
2. Match your **page context** to a metaphor
3. Note the **emotional tone** — this drives animation personality selection
4. If your context isn't listed, use the **Derivation Algorithm** at the bottom

---

### CRM / Sales

| Context | Primary Metaphor | Secondary Elements | Emotion |
|---------|-----------------|-------------------|---------|
| customers / accounts | Building facade / address card | Windows, door, person silhouette | Trustworthy, organized |
| leads | Magnifying glass / funnel | Search circles, target, arrow | Curious, active |
| opportunities / deals | Kanban board / trophy | Cards moving across stages, podium | Progressive, winning |
| contacts / people | ID badge / person card | Avatar circle, text lines, tick | Personal, connected |
| pipeline / stages | Flowing path / road map | Arrows, milestones, progress dots | Moving forward |
| reports / analytics | Bar chart / trend line | Rising bars, upward arrow | Insightful, upward |
| diary / activity | Notebook / calendar page | Pages, pen, clock | Reflective, organized |
| inbox / work items | Inbox tray / mailbox | Papers, checkmark, sparkles | Accomplished, clear |
| chat / messages | Speech bubbles | Double bubble, dots | Conversational, warm |
| attachments / files | Document / paperclip | Paper stack, clip, corner fold | Structured |
| products | 3D box / cube stack | Isometric cubes, orbital ring | Solid, valuable |
| team / users | People cluster / org chart | Avatars in a network | Collaborative |
| notifications | Bell / alert badge | Ring indicator, pulse dot | Attentive |
| calendar / schedule | Calendar grid / clock | Date cell highlight, clock hands | Time-aware |

---

### E-Commerce / Marketplace

| Context | Primary Metaphor | Secondary Elements | Emotion |
|---------|-----------------|-------------------|---------|
| empty cart / bag | Shopping bag / cart | Empty bag outline, price tag | Inviting, ready |
| wishlist / saved | Heart / bookmark | Floating hearts, ribbon | Desirable |
| orders / purchases | Package / box | Shipping box, tracking dots | Anticipation |
| products / catalog | Product card / shelf | Stacked cards, price badge | Browsable |
| search results | Magnifying glass | Search circle, empty result lines | Curious |
| reviews / ratings | Star / speech bubble | Star cluster, quote marks | Social trust |
| returns / refunds | Return arrow / receipt | Circular arrow, paper | Resolution |
| promotions / deals | Tag / badge | Price tag, scissors, ribbon | Exciting, urgent |

---

### SaaS / Developer Tools

| Context | Primary Metaphor | Secondary Elements | Emotion |
|---------|-----------------|-------------------|---------|
| API keys / tokens | Key / lock | Key icon, shield, dots | Secure |
| integrations | Plug / connector | Plug + socket, chain links | Connected |
| logs / events | Terminal / scroll | Lines of code, cursor blink | Technical |
| webhooks | Broadcast / signal | Radio waves, endpoint dots | Transmitting |
| usage / billing | Meter / gauge | Dial, bar fill, currency symbol | Measured |
| teams / members | Avatar cluster | People circles, invite badge | Collaborative |
| projects / repos | Folder / branch | Folder stack, git branch | Organized |
| deployments | Rocket / cloud | Launch trail, cloud target | Launch ready |
| settings / config | Gear / sliders | Cog wheel, toggle switches | Controlled |
| analytics | Dashboard / chart | Bar grid, trend line, dot | Insightful |

---

### Social / Community

| Context | Primary Metaphor | Secondary Elements | Emotion |
|---------|-----------------|-------------------|---------|
| feed / posts | Card stack / scroll | Post cards, avatar dots | Engaging |
| friends / followers | Connected people | Person circles, link line | Connected |
| messages / DMs | Chat bubble | Double bubble, typing dots | Conversational |
| notifications | Bell | Ring animation, badge dot | Attentive |
| media / photos | Camera / gallery | Camera frame, image placeholder | Creative |
| comments | Speech bubble + text | Nested bubbles, quote | Discussive |
| events | Calendar + balloon | Date circle, celebration marks | Festive |
| groups / channels | Overlapping circles | People cluster, shared ring | Community |

---

### Healthcare / Wellness

| Context | Primary Metaphor | Secondary Elements | Emotion |
|---------|-----------------|-------------------|---------|
| patients / records | Clipboard / folder | Medical cross, file lines | Professional, caring |
| appointments | Calendar + clock | Time slot, checkmark | Scheduled, calm |
| prescriptions | Pill / bottle | Capsule shape, cross symbol | Clinical, clear |
| vitals / metrics | Heart rate / line | Pulse line, heart | Vital, monitoring |
| reports | Document + chart | Paper, bar graph, pen | Informative |
| messages | Stethoscope + bubble | Medical bubble, care icon | Warm, professional |

---

### Education / Learning

| Context | Primary Metaphor | Secondary Elements | Emotion |
|---------|-----------------|-------------------|---------|
| courses / lessons | Book / screen | Open book, play button | Learning, curious |
| students | Person + graduation cap | Avatar, cap, diploma | Achievement |
| assignments | Checklist / pencil | Paper lines, checkboxes, pen | Structured |
| grades / results | Report card / star | Grade paper, star badge | Evaluative |
| discussions | Bubble + lightbulb | Speech bubble, idea spark | Collaborative |
| progress | Progress bar / path | Fill bar, milestone dots | Growing |

---

### Derivation Algorithm (Unknown Contexts)

If your context isn't in any table above, follow this chain:

```
1. VERB → What is the user DOING on this page?
   └─ Searching? → Magnifying glass metaphor
   └─ Creating?  → Plus/pencil/blank canvas metaphor
   └─ Reviewing? → Document/clipboard/checklist metaphor
   └─ Waiting?   → Hourglass/clock/progress metaphor
   └─ Sending?   → Arrow/envelope/broadcast metaphor
   └─ Connecting?→ Link/plug/handshake metaphor

2. NOUN → What physical object represents this concept?
   └─ Data / Records → Document, folder, stack of cards
   └─ People        → Person silhouette, ID badge, avatar circle
   └─ Money         → Coin, card, meter, price tag
   └─ Communication → Bubble, envelope, signal waves
   └─ Time          → Clock, calendar, timeline
   └─ Space / Place → Building, pin, map

3. EMOTION → What should the user FEEL here?
   └─ Trust    → Stable shapes (rectangle, solid circle)
   └─ Progress → Diagonal lines, arrows pointing right/up
   └─ Calm     → Round shapes, soft curves
   └─ Energy   → Diagonal composition, multiple moving elements
   └─ Clarity  → Minimal elements, centered checkmark

4. FALLBACK → Use a geometric metaphor:
   └─ Circle  = wholeness, focus, completion
   └─ Triangle = direction, progress, hierarchy
   └─ Square   = stability, data, container
```

---

## 2. SVG Construction Guide

### Coordinate System (Mandatory)

```
viewBox="0 0 120 120"   → All coordinates are in a 120×120 unit grid
```

Layout zones:
```
┌─────────────────────────────────────────────┐
│  Y: 10-25   Sparkle / accent zone           │
│  Y: 20-55   Upper illustration body          │
│  Y: 50-75   Primary focal element zone       │
│  Y: 65-90   Base / tray / ground zone        │
│  Y: 85-110  Shadow / footer zone             │
│                                              │
│  Center: (60, 60)    Safe margin: ≥10px      │
└─────────────────────────────────────────────┘
```

### SVG Path Command Reference

```
M x y        → Move to (x, y) — start or jump
L x y        → Line to (x, y)
H x          → Horizontal line to x
V y          → Vertical line to y
C x1 y1 x2 y2 x y  → Cubic bezier (smooth curves)
Q x1 y1 x y → Quadratic bezier (simpler curve)
A rx ry r large sweep x y → Arc segment
Z            → Close path back to start
```

### Reusable Shape Recipes

**Document / Paper (upright):**
```
M 35 25 L 75 25 L 85 35 L 85 85 L 35 85 Z
(corner fold: M 75 25 L 75 35 L 85 35)
```

**Person silhouette (head + shoulders):**
```
Head:      <circle cx="60" cy="38" r="12" />
Shoulders: <path d="M 40 75 Q 60 58 80 75" />
```

**Inbox tray:**
```
M 16 65 H 104 V 76 C 104 81.5 99.5 86 94 86 H 26 C 20.5 86 16 81.5 16 76 Z
```

**Kanban card:**
```
<rect x="25" y="35" width="30" height="40" rx="4" />
```

**Speech bubble:**
```
M 30 40 Q 30 30 45 30 H 80 Q 90 30 90 42 Q 90 54 80 54 H 52 L 42 62 L 44 54 H 45 Q 30 54 30 42 Z
```

**Checkmark:**
```
M 48 50 L 55 57 L 70 40  (stroke only, no fill)
```

**Key shape:**
```
<circle cx="45" cy="55" r="12" />  (key head)
<path d="M 55 55 H 80 V 62 H 72 V 68 H 65 V 62 H 55" />  (key shaft + teeth)
```

**Sparkle (4-point star) — 3 sizes to always include:**

Large (use near top-left, r≈6):
```
M 20 30 L 22.5 35.5 L 28 38 L 22.5 40.5 L 20 46 L 17.5 40.5 L 12 38 L 17.5 35.5 Z
```
Medium (use near top-right, r≈4):
```
M 95 20 L 96.5 24 L 100 25.5 L 96.5 27 L 95 31 L 93.5 27 L 90 25.5 L 93.5 24 Z
```
Small (use near bottom-right, r≈3):
```
M 85 85 L 86 88 L 89 89 L 86 90 L 85 93 L 84 90 L 81 89 L 84 88 Z
```

To reposition a sparkle, change the `M cx cy` anchor — all other points are relative offsets.

### Color Rules (Portable to Any App)

| Element | Fill | Stroke |
|---------|------|--------|
| Background glow | `fill="currentColor" fillOpacity="0.05"` | none |
| Primary shapes | `fill="white"` | `stroke="currentColor" strokeWidth="3"` |
| Filled accent | `fill="currentColor"` | none |
| Secondary / ghost | `fill="#F8FAFC"` or `fill="currentColor" fillOpacity="0.1"` | `stroke="currentColor"` |
| Sparkles | `fill="currentColor"` | none |
| Lines / checkmarks | `fill="none"` | `stroke="white" strokeWidth="3.5"` |

**How color adapts to any app:**
```tsx
// The SVG inherits color from its text-color class
// Set this on the <svg> or a wrapper <div>:
<svg className="text-blue-600 overflow-visible" ...>   // Tailwind
<svg style={{ color: 'var(--brand)' }} ...>            // CSS variable
<svg className={styles.brandColor} ...>                // CSS module
```

> ⚠️ **Never hardcode hex colors** except `#F8FAFC` (neutral secondary fill).  
> Everything else uses `currentColor` so the illustration adapts to any brand color.

---

## 3. Animation Personalities

Pick **one personality** based on the page's emotional tone.

### A — Confident & Organized
*Accounts, contacts, settings, records*
```
Entrance:  spring, stiffness: 120, damping: 15
Infinite:  gentle float  y: [0, -4, 0], duration 3-4s, ease: "easeInOut"
Stagger:   0.1s between elements
Feel:      calm, stable, professional
```

### B — Active & Searching
*Leads, search results, pipelines, deployments*
```
Entrance:  easeOut, duration 0.5s
Infinite:  scale pulse [1, 1.05, 1] or slow rotation
Stagger:   0.15s
Feel:      dynamic, scanning, moving
```

### C — Accomplished & Clear
*Inbox, tasks, completed states, notifications*
```
Entrance:  spring, stiffness: 200, damping: 12  (bouncy)
Infinite:  sparkle pulse [0.8, 1.2, 0.8], duration 2s
Stagger:   0.1s
Feel:      done, satisfied, clean
```

### D — Collaborative & Warm
*Team, chat, community, social feed, messages*
```
Entrance:  easeOut with y offset
Infinite:  gentle bobbing y: [0, -3, 0], alternate elements
Stagger:   0.2s (slower, relaxed)
Feel:      human, social, warm
```

### E — Analytical & Structured
*Analytics, reports, billing, API, logs*
```
Entrance:  easeOut, duration 0.4s
Infinite:  none, OR very subtle opacity pulse [0.8, 1, 0.8]
Stagger:   0.05s (quick cascade)
Feel:      precise, data-driven, clear
```

---

## 4. Motion Patterns (Framer Motion)

### Entry Animations

```tsx
// Standard entry — background/structural elements
initial={{ y: 20, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}

// Spring entry — primary focal element (ALWAYS use spring here)
initial={{ scale: 0, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 12 }}

// Rotated entry — papers, cards, documents
initial={{ opacity: 0, rotate: -15 }}
animate={{ opacity: 1, rotate: -5 }}
transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}

// Slide up from below — trays, bars, base elements
initial={{ y: 10, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.4, ease: "easeOut" }}
```

### Infinite Loop Animations

```tsx
// Gentle float — documents, icons, secondary elements
animate={{ y: [0, -5, 0] }}
transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}

// Sparkle pulse — after main elements appear
animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}

// Slow rotation — gears, search rings, orbital elements
animate={{ rotate: 360 }}
transition={{ duration: 8, repeat: Infinity, ease: "linear" }}

// Breathing scale — focal accent element
animate={{ scale: [1, 1.05, 1] }}
transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}

// Typing dots — chat, message contexts (3 elements, staggered)
animate={{ y: [0, -4, 0] }}
transition={{ duration: 0.8, repeat: Infinity, delay: 0.0 }}  // dot 1
transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }} // dot 2
transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}  // dot 3
```

### Path Drawing (Lines, Connectors, Trend Lines)

```tsx
<motion.path
  initial={{ pathLength: 0, opacity: 0 }}
  animate={{ pathLength: 1, opacity: 1 }}
  transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
  d="M 25 78 C 44 66 63 51 82 40"
  stroke="currentColor"
  strokeWidth="2.5"
  strokeLinecap="round"
  fill="none"
/>
```

### Scale-Y Entry (Bar Charts)

```tsx
// Each bar scales up from its base
<motion.rect
  x="25" y="45" width="14" height="45" rx="3"
  fill="currentColor" fillOpacity="0.15"
  initial={{ scaleY: 0 }}
  animate={{ scaleY: 1 }}
  transition={{ delay: 0.1, duration: 0.5, ease: "easeOut", originY: 1 }}
  style={{ transformOrigin: "bottom" }}
/>
```

### Stagger Delay Pattern

```
Layer 0 — Background glow:      no animation (static)
Layer 1 — Background shapes:    delay: 0.0–0.1
Layer 2 — Main body:            delay: 0.2–0.3
Layer 3 — Primary focal:        delay: 0.4  (always spring)
Layer 4 — Sparkle 1 (large):    delay: 0.6
Layer 5 — Sparkle 2 (medium):   delay: 0.8
Layer 6 — Sparkle 3 (small):    delay: 1.0
```

---

## 5. Component Template

### File Naming Convention

```
Empty[Context]Illustration.tsx     → for empty states
[Context]Illustration.tsx          → for onboarding / generic
[Context]SuccessIllustration.tsx   → for success/completion states
```

### Standard TSX Template

```tsx
import React from 'react';
import { motion } from 'framer-motion';

export const Empty[Context]Illustration: React.FC = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[your-brand-color] overflow-visible"
      // Replace text-[your-brand-color] with your app's color class:
      // Tailwind:      className="text-blue-600 overflow-visible"
      // CSS variable:  style={{ color: 'var(--color-brand)' }}
    >
      {/* ── Layer 0: Background Glow (always present, static) ─────────── */}
      <circle cx="60" cy="60" r="50" fill="currentColor" fillOpacity="0.05" />

      {/* ── Layer 1: Background / structural shapes — delay 0.0–0.1 ───── */}
      {/* e.g. back paper, base platform, shadow ellipse */}

      {/* ── Layer 2: Main illustration body — delay 0.2–0.3 ────────────── */}
      {/* e.g. front paper, tray, building, document */}

      {/* ── Layer 3: Primary focal element — delay 0.4, SPRING ──────────── */}
      {/* e.g. checkmark circle, avatar, key, chart peak */}
      <motion.g
        initial={{ scale: 0, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 12 }}
      >
        {/* focal shape goes here */}
      </motion.g>

      {/* ── Layer 4–6: Sparkles — delays 0.6, 0.8, 1.0 ─────────────────── */}
      <motion.path
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.6, 0.5] }}
        transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
        d="M20 30L22.5 35.5L28 38L22.5 40.5L20 46L17.5 40.5L12 38L17.5 35.5L20 30Z"
        fill="currentColor"
      />
      <motion.path
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.8, 0.6] }}
        transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
        d="M95 20L96.5 24L100 25.5L96.5 27L95 31L93.5 27L90 25.5L93.5 24L95 20Z"
        fill="currentColor"
      />
      <motion.path
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
        transition={{ delay: 1.0, duration: 0.8, type: "spring" }}
        d="M85 85L86 88L89 89L86 90L85 93L84 90L81 89L84 88L85 85Z"
        fill="currentColor"
      />
    </svg>
  );
};
```

---

## 6. Non-Empty-State Use Cases

### Onboarding / Feature Introduction

```tsx
// Large centered illustration on a welcome screen
<div className="flex flex-col items-center gap-6 p-12">
  <div className="w-48 h-48 text-blue-600">
    <ProductsIllustration />
  </div>
  <h2 className="text-2xl font-semibold">Welcome to your Inventory</h2>
  <p className="text-gray-500 text-center max-w-xs">
    Add your first product to start tracking stock and sales.
  </p>
</div>
```

### Success / Completion State

```tsx
// After submitting a form, closing a deal, or completing onboarding
// Swap the color to your success color
<div className="flex flex-col items-center gap-4 text-green-600">
  <div className="w-32 h-32">
    <OrderSuccessIllustration />
  </div>
  <h3>Order placed!</h3>
</div>
```

### Sidebar / Card Decorative Accent

```tsx
// Subtle decorative illustration in a card or panel header
<div className="relative overflow-hidden rounded-2xl bg-blue-50 p-6">
  <div className="absolute -right-4 -top-4 w-24 h-24 opacity-15 text-blue-600">
    <AnalyticsIllustration />
  </div>
  <h3 className="relative z-10">Monthly Report</h3>
</div>
```

### Modal / Drawer Empty Content

```tsx
// When a side panel or modal has no data yet
<div className="flex flex-col items-center gap-3 py-12">
  <div className="w-28 h-28 text-gray-400">
    <EmptyAttachmentsIllustration />
  </div>
  <p className="text-sm text-gray-500">No files yet. Drag & drop to upload.</p>
</div>
```

### Dashboard Hero / Welcome Banner

```tsx
// Large decorative illustration behind a greeting card
<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
  <div className="absolute right-0 top-0 w-48 h-48 opacity-10 text-blue-700">
    <LeadsIllustration />
  </div>
  <div className="relative z-10">
    <p className="text-sm text-blue-600 font-medium">Good morning</p>
    <h1 className="text-3xl font-bold mt-1">Ready to close deals?</h1>
  </div>
</div>
```

### Feature Highlight / Tooltip Callout

```tsx
// Small illustration beside a feature callout or tooltip
<div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
  <div className="w-12 h-12 flex-shrink-0 text-amber-500">
    <NotificationsIllustration />
  </div>
  <div>
    <p className="font-medium text-amber-900">Enable notifications</p>
    <p className="text-sm text-amber-700">Never miss a follow-up again.</p>
  </div>
</div>
```

---

## 7. Step-by-Step Generation Examples

### Example 1: CRM — Reports / Analytics Page

**Context:** "reports page is empty, no reports generated yet"  
**App type:** CRM  

**Step 1 — Metaphor:**
- Verb: Reviewing → document/chart metaphor
- Noun: Analytics → bar chart, trend line, rising bars
- Emotion: Insightful, upward → Personality E (Analytical)

**Step 2 — Shape plan (120×120 grid):**
```
Background glow:  circle cx=60 cy=60 r=50
Baseline:         M 20 90 H 100
Bar 1 (short):    rect x=25, y=75, w=14, h=15 — delay 0.1
Bar 2 (medium):   rect x=46, y=60, w=14, h=30 — delay 0.15
Bar 3 (tallest):  rect x=67, y=42, w=14, h=48 — delay 0.2
Trend line:       M 32 82 C 46 68 60 55 74 46 — pathLength — delay 0.4
Circle peak:      circle cx=74 cy=46 r=5 — spring — delay 0.5
Sparkles:         top-left, top-right, bottom-right — delays 0.6/0.8/1.0
```

**Step 3 — Animation plan:**
- Bars: `scaleY` 0→1, easeOut, cascade delays 0.1/0.15/0.2 (use `style={{ transformOrigin: "bottom" }}`)
- Trend line: pathLength 0→1, delay 0.4
- Peak circle: spring, delay 0.5
- Sparkles: spring at 0.6/0.8/1.0

---

### Example 2: E-Commerce — Empty Cart

**Context:** "user's shopping cart is empty"  
**App type:** E-commerce  

**Step 1 — Metaphor:**
- Verb: Browsing/buying → shopping bag metaphor
- Noun: Cart → shopping bag with empty interior
- Emotion: Inviting, ready to fill → Personality C (Accomplished, light)

**Step 2 — Shape plan:**
```
Background glow:  circle cx=60 cy=60 r=50
Bag body:         M 30 50 Q 30 40 40 40 H 80 Q 90 40 90 50 L 85 85 Q 85 90 80 90 H 40 Q 35 90 35 85 Z
Bag handles:      M 45 40 Q 45 28 60 28 Q 75 28 75 40  (stroke only)
Price tag:        circle cx=80 cy=75 r=8 + string line
Tag text lines:   2 horizontal lines inside tag
Sparkles: top-left, top-right, bottom-right
```

**Step 3 — Animation plan:**
- Bag body + handles: spring entry, delay 0.2
- Price tag: spring, delay 0.4 (focal element)
- Infinite: bag gentle float y: [0, -4, 0], duration 3s
- Sparkles: 0.6/0.8/1.0

---

### Example 3: SaaS — No API Keys

**Context:** "developer dashboard, no API keys created yet"  
**App type:** SaaS / Developer Tools  

**Step 1 — Metaphor:**
- Verb: Creating/securing → key metaphor
- Noun: API key → key icon with shield
- Emotion: Secure, technical → Personality E (Analytical) + slight A (Confident)

**Step 2 — Shape plan:**
```
Background glow:  circle cx=60 cy=60 r=50
Shield:           M 60 25 L 85 35 L 85 60 Q 85 80 60 90 Q 35 80 35 60 L 35 35 Z — bg
Key head:         circle cx=60 cy=52 r=11 — filled currentColor
Key hole:         circle cx=60 cy=52 r=5 — filled white
Key shaft:        M 68 52 H 90 V 59 H 82 V 65 H 75 V 59 H 68 — stroke white
Code lines:       3 short horizontal lines below shield (dotted pattern)
Sparkles: corners
```

**Step 3 — Animation plan:**
- Shield: easeOut, delay 0.1
- Key: spring, delay 0.4 (focal)
- Code lines: pathLength 0→1, stagger 0.3/0.4/0.5
- Infinite: shield very subtle opacity [0.8, 1, 0.8], duration 3s
- Sparkles: 0.6/0.8/1.0

---

## 8. Integration Patterns

### As a React Component Prop

```tsx
// Generic empty state wrapper (adapt to your app's component)
<EmptyStateWrapper
  icon={<EmptyCartIllustration />}
  title="Your cart is empty"
  description="Browse products and add them here."
  action={<Button>Browse Products</Button>}
/>
```

### Standalone in a Flex Layout

```tsx
<div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
  <div className="w-40 h-40 text-blue-600">
    <EmptyOrdersIllustration />
  </div>
  <div className="text-center">
    <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
    <p className="text-sm text-gray-500 mt-1">Your first order will appear here.</p>
  </div>
</div>
```

### As Decorative Background (Clipped, Low Opacity)

```tsx
<div className="relative overflow-hidden">
  {/* Decorative — hidden from screen readers */}
  <div aria-hidden="true" className="absolute inset-0 flex items-center justify-end pr-4 opacity-[0.07] text-blue-800">
    <div className="w-64 h-64">
      <AnalyticsIllustration />
    </div>
  </div>
  {/* Actual content on top */}
  <div className="relative z-10 p-8">
    ...
  </div>
</div>
```

### Without React (Plain SVG in HTML)

```html
<!-- Paste the SVG directly into HTML, set color via CSS -->
<div style="width: 160px; height: 160px; color: #2563eb;">
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
       style="width: 100%; height: 100%; overflow: visible;">
    <!-- SVG content here — animations require Framer Motion or CSS @keyframes -->
  </svg>
</div>
```

> For HTML-only (no React), replace Framer Motion `motion.*` elements with CSS `@keyframes` + `animation` properties. The shapes and paths are identical.

---

## 9. Delivery Checklist

### SVG Quality
- [ ] `viewBox="0 0 120 120"` on `<svg>`
- [ ] `fill="none"` on `<svg>` (shapes control their own fill)
- [ ] `overflow-visible` on `<svg>` (sparkles can exceed viewBox)
- [ ] No hardcoded hex colors except `#F8FAFC`
- [ ] All strokes use `strokeLinejoin="round"` and `strokeLinecap="round"`
- [ ] Background glow circle present (static, no animation needed)
- [ ] 3 sparkles present at different corners and sizes

### Animation Quality
- [ ] Every `motion.*` element has `initial` + `animate` props
- [ ] Primary focal element uses `type: "spring"` (not easeOut)
- [ ] Sparkles appear AFTER main elements (delay ≥ 0.6s)
- [ ] Stagger delays increase progressively through layers
- [ ] At least 1 infinite loop present for atmosphere
- [ ] Infinite loops do NOT start immediately — add `delay: 1+` to avoid clash with entrance

### Color Portability
- [ ] Color class (`text-[color]`) set on the `<svg>` or wrapper `<div>`, not hardcoded
- [ ] Component accepts optional `className` prop if it may be reused with different colors

### Accessibility
- [ ] Illustration is decorative — no `role="img"` or `<title>` needed for empty states
- [ ] Add `aria-hidden="true"` when used purely as a decorative background
- [ ] Framer Motion automatically respects `prefers-reduced-motion` — no extra work needed

---

## Related Skills

| Skill | When to Use |
|-------|-------------|
| [frontend-design](../frontend-design/SKILL.md) | For overall UI/UX design decisions before building |
| [animation-guide](../frontend-design/animation-guide.md) | For animation timing principles and easing decisions |
| [tailwind-patterns](../tailwind-patterns/SKILL.md) | For integrating illustrations with Tailwind CSS layout |
| [web-design-guidelines](../web-design-guidelines/SKILL.md) | After building — audit for accessibility and performance |
