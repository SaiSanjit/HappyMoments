# Vendor Profile Editor

## Goal
Add a "Profile" tab to the vendor dashboard CRM where vendors can edit their public studio page — matching the design in `Vendor _ Profile editor.html`.

---

## Layout (two-column)
```
┌─────────────────────────────────────────────────────┐
│  Top Bar: breadcrumb · title · status · Preview · Publish  │
├──────────────────────────────┬──────────────────────┤
│  Gallery                     │  Profile Health      │
│  Basics                      │  (score + checklist) │
│  Your Story                  ├──────────────────────┤
│  Packages                    │  Last 30 Days        │
│                              │  (analytics)         │
│                              ├──────────────────────┤
│                              │  Review Request CTA  │
└──────────────────────────────┴──────────────────────┘
```

---

## Data Mapping (vendors table → UI fields)
| UI Field       | DB Column / Source                         |
|----------------|--------------------------------------------|
| Studio name    | `brand_name`                               |
| Tagline        | `additional_info->>'tagline'`              |
| Category       | `categories[0]`                            |
| Founded        | `experience` (or `additional_info->>'founded'`) |
| City           | `address`                                  |
| Languages      | `additional_info->>'languages'`            |
| Your Story     | `description`                              |
| Packages       | `packages` (jsonb[])                       |
| Gallery        | `vendor_media` table + `cover_image_url`   |
| Live status    | `verified` boolean                         |

---

## Tasks

- [ ] **T1: Wire up the tab** — Add `"profile"` to `Tab` type, `PAGE_TITLES`, and `renderTab()` in [vendor-dashboard/page.tsx](src/app/vendor-dashboard/page.tsx). Verify: tab renders without crash.

- [ ] **T2: Add sidebar nav item** — Add `{ key: "profile", label: "Profile", icon: UserCircle, tier: "primary" }` to `NAV_ITEMS` in [CRMSidebar.tsx](src/app/vendor-dashboard/components/CRMSidebar.tsx) and to the mobile group "Overview". Verify: icon visible in sidebar.

- [ ] **T3: ProfilePage layout** — Create `src/features/profile/ProfilePage.tsx`. Fetches vendor data from Supabase (`vendors` + `vendor_media`), manages local draft state, renders two-column layout (main + sidebar sticky). Passes props to sub-components. Has `isDirty` and `isSaving` state.

- [ ] **T4: ProfileTopBar** — Create `src/features/profile/components/ProfileTopBar.tsx`. Shows: `PROFILE · PUBLIC LISTING` breadcrumb, `"Your studio page"` title, Live/Draft status pill (green if `verified`), last-edited relative time, monthly visits count, auto-save indicator, `Preview live` button (opens `/vendor/{slug}` in new tab), `Publish changes` button (calls save).

- [ ] **T5: GallerySection** — Create `src/features/profile/components/GallerySection.tsx`. Displays cover photo (hero 4×5) and up to 4 portfolio thumbnails from `vendor_media`. Upload area (drag or click) calls existing media upload API. Shows photo count and "Manage all photos →" link. First image gets "Cover" badge. No drag-to-reorder in v1 (deferred).

- [ ] **T6: BasicsSection** — Create `src/features/profile/components/BasicsSection.tsx`. Form fields: Studio Name (`brand_name`), Tagline (`additional_info.tagline`), Category (single-select from `CATEGORIES`), Founded (year input mapped from `experience`), City (`address`), Languages (`additional_info.languages` as comma-separated chips). All fields update local draft state on change.

- [ ] **T7: StorySection** — Create `src/features/profile/components/StorySection.tsx`. Textarea bound to `description`, 600-char limit counter shown bottom-right. "Polish with AI" button (sparkles icon) — sends current text to `/api/vendor/polish-story` (stub for now, logs to console). Hint text: "Couples spend longer here than anywhere else on your page."

- [ ] **T8: PackagesSection** — Create `src/features/profile/components/PackagesSection.tsx`. Lists existing `packages` jsonb[] cards (name + price). "+ Add package" button opens inline form to add a new package (name, price, description). Delete button per card. Hint: "Three is the sweet spot."

- [ ] **T9: ProfileHealthSidebar** — Create `src/features/profile/components/ProfileHealthSidebar.tsx`. Computes score (0–100) from checklist: cover photo added (+15), 3+ packages (+15), story written (+15), 60-sec intro video (+8), 5+ portfolio photos (+8), city set (+10), languages set (+10), tagline set (+9), founded set (+5), Instagram linked (+5). Circular progress ring (SVG). Renders checklist with check/grey icons and `+N` badges for incomplete items.

- [ ] **T10: AnalyticsSidebar** — Create `src/features/profile/components/AnalyticsSidebar.tsx`. "LAST 30 DAYS" panel with 4 metrics: Profile views, Inquiry rate (%), Avg. quote time, Bookings — each with trend arrow and delta. For v1: fetch from a Supabase RPC or hardcode zeros with a "data loading soon" note. Also renders "N customers can leave reviews" CTA card with "Send requests" button (stub).

- [ ] **T11: Save logic** — In `ProfilePage.tsx`, implement `handleSave()`: UPSERTs draft to `vendors` table via Supabase client (`update` where `vendor_id = X`). Sets `updated_at = now()`. Shows toast on success/failure. "Publish changes" button triggers save + sets `isDirty = false`.

---

## File Structure
```
src/features/profile/
  ProfilePage.tsx
  components/
    ProfileTopBar.tsx
    GallerySection.tsx
    BasicsSection.tsx
    StorySection.tsx
    PackagesSection.tsx
    ProfileHealthSidebar.tsx
    AnalyticsSidebar.tsx
```

## Done When
- [ ] Vendor can navigate to Profile tab from the dashboard sidebar
- [ ] All 6 editable sections render with live vendor data
- [ ] Editing any field marks the page dirty; "Publish changes" saves to Supabase
- [ ] Profile Health score updates reactively as fields are filled
- [ ] "Preview live" opens the vendor's public page in a new tab
