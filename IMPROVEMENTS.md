# SATQUERY AI — Static Frontend Improvement Opportunities

> All improvements below are achievable with the current static/mock frontend — no backend, no real APIs, no database required.

---

## 1. Framework & Dependencies Cleanup

| Area | Current State | Improvement |
|:---|:---|:---|
| **Next.js version** | Pinned at `13.5.1` (Sep 2023) | Upgrade to Next.js 14+ for faster builds, Turbopack, and improved App Router stability |
| **React version** | `18.2.0` | Upgrade to React 18.3+ for latest fixes and deprecation warnings ahead of React 19 |
| **`package.json` name** | Set to generic `"nextjs"` | Rename to `"satquery-ai"` for clarity |
| **`metadataBase`** | Hardcoded to `http://localhost:3000` in [layout.tsx](file:///Users/atharvashah/Downloads/SATQUERY-AI/app/layout.tsx#L20) | Use `process.env.NEXT_PUBLIC_BASE_URL` or the Vercel deployment URL |
| **Unused dependencies** | `@supabase/supabase-js`, `react-hook-form`, `zod`, `vaul`, `react-resizable-panels` are installed but never imported | Remove them — reduces install time and bundle size |
| **Missing `devDependencies`** | `@types/*`, `eslint`, `typescript`, `postcss`, `tailwindcss` are all in `dependencies` | Move build-only packages to `devDependencies` |

---

## 2. Map & Imagery Interaction

| Area | Current State | Improvement |
|:---|:---|:---|
| **Fake map** | [SatelliteMap.tsx](file:///Users/atharvashah/Downloads/SATQUERY-AI/components/satquery/SatelliteMap.tsx) uses `<img>` + CSS `scale()` for zoom | Integrate **Leaflet** (free, no API key) with OpenStreetMap tiles — gives real pan/zoom/coordinates with zero cost |
| **AOI drawing** | Mouse drag creates a pixel-percentage rectangle | Use Leaflet Draw to output actual GeoJSON bounding boxes with real lat/lng |
| **Evidence bounding boxes** | CSS-positioned `<button>` overlays on a static image | Convert to Leaflet vector layers (L.rectangle) so boxes move/scale with the map properly |
| **Zoom counter** | Fake zoom level (8–18) with CSS transform | Real Leaflet zoom handles tile resolution changes automatically |
| **No location search** | Users can't search by place name | Add Nominatim geocoder (free, no key) — user types "Mumbai" → map flies to it |
| **Stock imagery** | Pexels satellite photos used everywhere | Replace with real free satellite tiles from **ESRI World Imagery** or **Sentinel-2 Cloudless** (both free, no API key) |

---

## 3. UX Polish & Interactions

| Area | Current State | Improvement |
|:---|:---|:---|
| **No loading skeletons** | Pages flash from empty → loaded content | Add animated skeleton shimmer placeholders for the datasets grid, analysis history cards, and report sections |
| **No page transitions** | Route changes are instant jumps | Add Framer Motion `AnimatePresence` page transitions for a polished feel |
| **Panel collapse is abrupt** | Left sidebar snaps between 360px and 8px | Add a smooth width animation with `transition: width 300ms ease` |
| **No onboarding tour** | First-time users see an empty state with no guidance | Add a 4-step tooltip tour: Task Cards → Query Input → AOI → Run Button (use a lightweight library like `react-joyride`) |
| **No query history** | Users can't recall previous queries | Store query history in `localStorage` and show a "Recent Queries" dropdown above the query input |
| **No analysis session persistence** | Refreshing the page loses all workspace state | Persist `selectedTask`, `query`, `analysisResults`, and `aoiRegion` to `localStorage` so state survives refresh |
| **Favicon** | Uses default Next.js favicon | Add a custom SatQuery AI branded favicon |
| **Theme remnants** | [A4ReportViewer.tsx](file:///Users/atharvashah/Downloads/SATQUERY-AI/components/satquery/A4ReportViewer.tsx) and [reports/[id]/page.tsx](file:///Users/atharvashah/Downloads/SATQUERY-AI/app/reports/%5Bid%5D/page.tsx) still use `dark:` dual-theme Tailwind classes | Convert to single dark palette — the app is always dark mode, so `dark:` prefixes are dead code |

---

## 4. Mock Data & Demo Realism

| Area | Current State | Improvement |
|:---|:---|:---|
| **Only 3 scenarios** | `analyzeQuery()` always returns Urban Expansion, Flood Detection, or Military Activity | Add 5–8 more scenarios: deforestation, wildfire damage, crop health, coastal erosion, solar farm detection, port activity |
| **Same results regardless of query** | Scenario selection ignores user's actual question | Use keyword matching on the query text to route to the most relevant scenario (e.g., "flood" → flood scenario, "forest" → deforestation) |
| **Fake chat responses** | [ChatFollowUp.tsx](file:///Users/atharvashah/Downloads/SATQUERY-AI/components/satquery/ChatFollowUp.tsx) returns hardcoded strings via string matching | Expand the response templates with more variety; add randomized phrasing so repeated questions don't give identical answers |
| **Static dates** | T1 = "14 Jan 2026", T2 = "22 Aug 2026" everywhere | Generate relative dates dynamically (e.g., T2 = today, T1 = 6 months ago) so the demo always feels current |
| **No analysis progress detail** | Running analysis shows a generic spinner | Add a multi-step progress indicator: "Loading imagery…" → "Running VLM inference…" → "Cross-sensor fusion…" → "Calibrating confidence…" with realistic timing |
| **Demo scenario cards** | Selecting a demo scenario pre-fills query but doesn't feel interactive | Add a brief description tooltip and a small preview thumbnail on each scenario chip |

---

## 5. Component Architecture

| Area | Current State | Improvement |
|:---|:---|:---|
| **Prop drilling** | Workspace page passes 10+ props through 3–4 levels | Create a `WorkspaceContext` (React Context) for shared state: `selectedTask`, `query`, `results`, `aoi`, `layers` |
| **Giant components** | [QueryPanel.tsx](file:///Users/atharvashah/Downloads/SATQUERY-AI/components/satquery/QueryPanel.tsx) handles task selection, config, query input, AND run logic in one file | Split into: `TaskGrid.tsx`, `TaskConfigPanel.tsx`, `QueryInput.tsx`, `RunAnalysisButton.tsx` |
| **Inline styles** | Many components mix Tailwind classes with inline `style={{}}` objects | Move all styles to Tailwind classes or CSS modules for consistency |
| **No reusable `Card` wrapper** | Similar card patterns (border, bg, rounded, padding) repeated across 20+ components | Extract a `<GlassCard>` or `<PanelCard>` component that encapsulates the common dark card styling |
| **Hardcoded colors** | `#07111F`, `#101C2E`, `#24344A`, `#20A4F3` appear as raw hex in 40+ files | Move all brand colors to `tailwind.config.ts` as named tokens: `bg-surface-primary`, `border-muted`, `text-accent` |
| **No error boundaries** | A single component crash kills the entire page | Wrap major sections (Map, QueryPanel, DecisionPanel) in `<ErrorBoundary>` components with graceful fallback UI |

---

## 6. Performance (Frontend Only)

| Area | Current State | Improvement |
|:---|:---|:---|
| **No `next/image`** | All images use raw `<img>` tags with full-size Pexels URLs | Use `next/image` with `width`, `height`, `priority`, and `placeholder="blur"` for automatic optimization |
| **Heavy PDF export** | `jspdf` (~280KB) loads eagerly on report pages | Lazy-load with `dynamic(() => import(...), { ssr: false })` — only load when user clicks "Export PDF" |
| **A4ReportViewer is 49KB** | Renders even if user hasn't navigated to reports | Already route-separated, but ensure no pre-fetching unless hovered |
| **No memoization** | Evidence card lists, sensor agreement charts re-render on every parent state change | Add `React.memo()` to pure display components: `EvidenceCard`, `ConfidenceMeter`, `SensorAgreement`, `DecisionBadge` |
| **Unnecessary re-renders** | Typing in query input re-renders the entire workspace panel | Isolate the query input state from the rest of the panel using a separate component or `useDeferredValue` |

---

## 7. Accessibility (a11y)

| Area | Current State | Improvement |
|:---|:---|:---|
| **No ARIA labels on icon buttons** | Zoom in/out, grid toggle, panel collapse use icon-only `<button>` with no text | Add `aria-label="Zoom in"`, `aria-label="Collapse panel"`, etc. |
| **Color contrast** | `#718096` text on `#0B1628` background = ~3.5:1 ratio (fails WCAG AA for small text) | Bump muted text color to `#8FA0B5` (~4.7:1) or lighter |
| **No focus rings** | Custom buttons suppress browser focus outlines without visible replacements | Add `focus-visible:ring-2 focus-visible:ring-[#20A4F3]` to all interactive elements |
| **Keyboard navigation** | Task cards, object chips, sensor toggles are mouse-click only | Add `onKeyDown` handlers for `Enter`/`Space` on all custom clickable elements; ensure proper `tabIndex` |
| **No skip-nav link** | Keyboard users must tab through the entire TopNav to reach content | Add a hidden "Skip to main content" link that appears on focus |
| **Evidence map regions** | `<button>` overlays lack descriptive text | Add `aria-label="Evidence region EV-1001: Urban expansion, 94% confidence"` |

---

## 8. Developer Experience

| Area | Current State | Improvement |
|:---|:---|:---|
| **No Prettier** | Code formatting varies across files | Add `.prettierrc` with consistent rules (single quotes, trailing commas, 100 char width) |
| **No pre-commit hooks** | Nothing prevents pushing unformatted or broken code | Add `husky` + `lint-staged` to auto-format and lint on commit |
| **Minimal ESLint** | Only `next/core-web-vitals` rules | Add `@typescript-eslint/strict`, `import/order`, `react/jsx-no-leaked-render` for stricter catching |
| **No `README.md`** | Missing or minimal project readme | Add a proper README with: project description, screenshots, setup instructions, architecture overview |
| **No `.env.example`** | No documentation of environment variables | Create `.env.example` listing any config vars (even if currently none — sets the pattern) |
| **No GitHub Actions CI** | No automated checks on push/PR | Add a simple CI workflow: `lint` → `typecheck` → `build` — catches breaks before merge |

---

## 9. Data Export Improvements

| Area | Current State | Improvement |
|:---|:---|:---|
| **GeoJSON export** | Exports evidence boxes with CSS percentage coordinates | Convert to proper WGS84 coordinates (even if mock — use realistic lat/lng ranges based on scenario location) |
| **No CSV export** | Evidence data only viewable in the UI | Add a "Download CSV" button on the evidence page: columns for ID, Type, Confidence, Sensors, Coordinates |
| **PDF content** | [pdf-export.ts](file:///Users/atharvashah/Downloads/SATQUERY-AI/lib/pdf-export.ts) renders a 6-page report but many sections are partially hardcoded | Make all PDF sections fully dynamic from the `AnalysisResult` object — especially the evidence table and sensor readings |
| **No shareable analysis URLs** | Analysis IDs exist but state isn't URL-serializable | Encode analysis params into URL search params (`?task=change&query=...&scenario=flood`) so users can share/bookmark |

---

## 10. Visual & Branding

| Area | Current State | Improvement |
|:---|:---|:---|
| **No 404 page** | Default Next.js 404 | Create a branded `not-found.tsx` matching the dark enterprise theme |
| **No loading page** | Default Next.js loading behavior | Create a branded `loading.tsx` with the SatQuery logo + spinner |
| **Generic `<title>` per page** | Only root layout has a title; sub-pages don't override | Add unique `<title>` and `meta description` per route (Analysis History, Evidence Inspector, Reports, etc.) |
| **No OG images** | No social preview images for sharing | Generate static OG images for key pages (homepage, workspace) |
| **Landing page** | Root `/` redirects straight to workspace | Add a proper landing/hero page showcasing the product with a "Launch Workspace →" CTA |

---

## Priority Ranking (Static Frontend)

> [!TIP]
> **Highest-impact improvements that require zero backend work:**

| Priority | Improvement | Effort | Impact |
|:---:|:---|:---:|:---:|
| 🥇 | **Integrate Leaflet with free satellite tiles** — instantly makes the map real | Medium | 🔥🔥🔥 |
| 🥈 | **Add more mock scenarios + keyword matching** — demo feels intelligent | Low | 🔥🔥🔥 |
| 🥉 | **localStorage persistence** — state survives refresh | Low | 🔥🔥 |
| 4 | **Design system tokens in Tailwind config** — cleaner code, easier theming | Low | 🔥🔥 |
| 5 | **Component splitting + WorkspaceContext** — cleaner architecture | Medium | 🔥🔥 |
| 6 | **Loading skeletons + page transitions** — premium feel | Low | 🔥🔥 |
| 7 | **Accessibility pass** — ARIA labels, focus rings, contrast | Low | 🔥 |
| 8 | **CI pipeline (lint → typecheck → build)** — catches regressions | Low | 🔥 |
| 9 | **Landing page** — proper first impression | Medium | 🔥 |
| 10 | **Upgrade Next.js + cleanup unused deps** — modern stack, smaller bundle | Low | 🔥 |
