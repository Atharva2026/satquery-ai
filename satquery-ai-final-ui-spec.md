# SATQUERY AI — Final UI Implementation Specification

## Build directive

Build SATQUERY AI as **AI-first entry → map-first answer → progressive disclosure**. Do not expose model routing, VQA, SAR processing, CRS, registration, or calibration in the default flow. Preserve all capabilities in an AI plan, Evidence view, Advanced view, and Audit view.

Primary object: an `AnalysisRun`. All pages read from the same run: answer, map layers, evidence, trace, and exports.

## Navigation

```text
SATQUERY AI     Analyze   Demo   Analyses   Reports          Profile
```

Settings, datasets, model registry, API, and team administration belong in Profile. Evidence, Compare, Audit, and Export are tabs inside `/analyses/[id]`.

## Screen 1 — Landing

**Purpose:** explain the product in 10 seconds and provide an immediate demo. **Primary user:** first-time visitor. **Primary CTA:** `Start analysis`. **Secondary CTA:** `Explore demo`.

```text
┌────────────────────────────────────────────────────────────┐
│ SATQUERY AI       Product  Demo  How it works  [Start →]   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ASK QUESTIONS ABOUT       [realistic dark Earth globe]     │
│ REMOTE-SENSING IMAGES.   [subtle orbit + observation arc]  │
│                                                            │
│ GET THE EVIDENCE.                                         │
│ Ask about one image, two dates, or optical + SAR imagery. │
│ [Start analysis]  [Explore demo]                          │
│                                                            │
│ Single-image VQA   Before/after change   Optical + SAR    │
└────────────────────────────────────────────────────────────┘
```

### Sections

1. Hero: headline, subheading, two CTAs, three capability chips, globe.
2. Interactive proof: real before/after image, question, map evidence, answer reveal.
3. Three workflows: Single image, Before + after, Optical + SAR.
4. Evidence-first results: answer linked to polygons, masks, and crops.
5. Agentic orchestration: Understand → Validate → Route → Analyze → Ground → Answer.
6. Remote-sensing adaptation: model card and supported task badges.
7. Confidence and uncertainty: finding, confidence, evidence basis, limitation.
8. Demo/benchmark proof: VQA, grounding/captioning, change, fusion.
9. Report/audit preview: PDF, GeoJSON, CSV, trace.
10. Final CTA: `Upload a scene and ask your first question`.

Background: `#050B14`; sections alternate `#07111F` and `#0B1628`. Real satellite imagery is used in proof sections; generated art is not used for evidence. First viewport enters with headline and CTA before the globe animation.

## Screen 2 — Home / Command Center

**Purpose:** calm re-entry and new-run creation. **CTA:** `New analysis`. Do not show a GIS console or model cards.

```text
┌──────────────────────────────────────────────────────────────┐
│ SATQUERY AI       Analyze  Demo  Analyses  Reports      [•••]│
├──────────────────────────────────────────────────────────────┤
│ Good afternoon, Anika                         [New analysis] │
│                                                              │
│ What do you want to know?                                    │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Ask about an image, a change, or optical + SAR imagery… │ │
│ └──────────────────────────────────────────────────────────┘ │
│ [Single image] [Before + after] [Optical + SAR]              │
│                                                              │
│ Continue analysis                                            │
│ [thumb] Built-up change near Pune · 2 hours ago  [Open]      │
│                                                              │
│ Recent analyses                 Saved areas       Reports     │
└──────────────────────────────────────────────────────────────┘
```

Empty state: three example questions plus `Run sample analysis`. Loading: skeleton composer and recent rows. Error: retain draft query and show retry. Mobile: composer first, mode chips second, recent runs below; no three-column cards.

## Screen 3 — Analyze / Question + Upload

**Purpose:** create a valid run without technical configuration. **Primary CTA:** `Continue`. **Secondary:** `Use sample`, `Save draft`.

```text
┌──────────────────────────────────────────────────────────────┐
│ New analysis                                      [Save draft]│
│ What are you analyzing?                                      │
│ [ Single image ] [ Before + after ] [ Optical + SAR ]        │
│                                                              │
│ Add imagery                                                  │
│ ┌────────────────────┐ ┌────────────────────┐                │
│ │ Drop GeoTIFF/TIFF  │ │ T1 / image 1       │                │
│ │ [Browse files]     │ │ [Add imagery]      │                │
│ └────────────────────┘ └────────────────────┘                │
│                                                              │
│ What do you want to know?                                    │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ What changed between January and August?                 │ │
│ └──────────────────────────────────────────────────────────┘ │
│ Location: [Search place] [Draw AOI] [Upload GeoJSON]         │
│                                      [Continue →]             │
└──────────────────────────────────────────────────────────────┘
```

### Input modes

- Single image: one optical/multispectral or SAR input; VQA plus captioning or grounding.
- Before + after: two corresponding inputs; dates and spatial overlap required.
- Optical + SAR: co-registered optical and SAR inputs; registration and footprint checked.

### Upload card normal view

```text
┌──────────────────────────────────────┐
│ ✓ scene_aug.tif              [•••]   │
│ [thumbnail] Optical · Image 2        │
│ 22 Aug 2026 · 4096 × 4096            │
│ ✓ Compatible                          │
│ [View metadata]                       │
└──────────────────────────────────────┘
```

Advanced metadata expands dimensions, bands, bit depth, CRS, bounds, acquisition time, nodata, georeferencing, and registration. User-facing warnings say “Dates were not found” rather than only “missing metadata.”

## Screen 4 — Analysis Workspace

**Purpose:** run and inspect an active analysis. **Map is primary.** Use MapLibre or Mapbox, not Three.js.

```text
┌──────────────────────────────────────────────────────────────┐
│ ← Analyses   Built-up change near Pune   [Customize] [Export]│
│ Question: Did construction increase between Jan and Aug?    │
│ T1 Jan 14 → T2 Aug 22 · 4.2 km²                            │
├──────────────────────────────────┬───────────────────────────┤
│                                  │ AI FINDING                │
│              REAL MAP            │ 17 probable new           │
│ imagery · AOI · evidence         │ structures detected       │
│ [Search] [Draw] [Compare] [≡]    │                           │
│                                  │ System confidence 92%    │
│                                  │ Optical ✓  SAR ✓         │
│                                  │ 6 high-confidence areas  │
│                                  │                           │
│                                  │ [View evidence]           │
│                                  │ [Compare images]          │
│                                  │ [Generate report]         │
│                                  │ [Why this answer?]        │
├──────────────────────────────────┴───────────────────────────┤
│ Evidence 1  Evidence 2  Evidence 3       [Timeline collapsed]│
└──────────────────────────────────────────────────────────────┘
```

Default map layers: imagery, AOI, evidence polygons/masks, labels. Controls: search, draw AOI, fit, compare, layers. NIR, raw SAR, thresholds, model masks, and trace are hidden under Layers/Advanced.

## Screen 5 — Results

**Purpose:** answer four questions immediately: what, where, confidence, why.

```text
┌──────────────────────────────────────────────────────────────┐
│ ANALYSIS COMPLETE                      [Export] [Ask follow-up]│
├──────────────────────────────────┬───────────────────────────┤
│                                  │ AI FINDING                │
│        MAP WITH HIGHLIGHTS       │ 17 probable new           │
│  ① ② ③ ④ ⑤ ⑥ evidence regions  │ structures detected.       │
│                                  │                           │
│                                  │ System confidence         │
│                                  │ 92%  [High]               │
│                                  │ ████████████████░░        │
│                                  │                           │
│                                  │ Based on                  │
│                                  │ ✓ Optical temporal        │
│                                  │ ✓ SAR corroboration      │
│                                  │ ✓ Spatial grounding      │
│                                  │                           │
│                                  │ Jan 14 → Aug 22 · 4.2 km²│
│                                  │ [View evidence]           │
│                                  │ [Compare] [Report]        │
│                                  │ [Why this answer?]        │
└──────────────────────────────────┴───────────────────────────┘
```

Never show “92% accurate.” Label it `System confidence` and include an uncertainty sentence: “Cloud cover reduces certainty along the eastern edge.” Confidence color is not the only signal; use label, meter, and explanation.

## Screen 6 — Evidence / Why?

### Simple view

```text
┌──────────────────────────────────────────────────────────────┐
│ WHY THIS ANSWER?                              [Close]         │
│ 6 high-confidence regions                                  │
│                                                              │
│ [Region 1] New rectangular structure       [Open on map]    │
│ ┌─────────────┬─────────────┐                              │
│ │ BEFORE      │ AFTER       │ Optical: supports             │
│ │ crop        │ crop        │ SAR: supports · High         │
│ └─────────────┴─────────────┘                              │
│                                                              │
│ [Region 2] Possible construction             Moderate       │
│ [Region 3] Vegetation cleared                 High           │
└──────────────────────────────────────────────────────────────┘
```

Each evidence item contains location, before/after crop where applicable, detected change, optical basis, SAR basis, temporal basis, confidence, limitations, and map focus action.

### Expert view

The Evidence tab is a full investigation screen: region list, map, crop viewer, sensor tabs, geometry, source tiles, mask/box, model evidence reference, quality notes, and export selection. Same evidence IDs power the report and audit.

## Screen 7 — Demo / Pitch Mode

```text
┌──────────────────────────────────────────────────────────────┐
│ SATQUERY AI DEMO CENTER                  [Enter Pitch Mode]  │
│ Demonstrate the complete system in under two minutes.       │
├──────────────────────────────────────────────────────────────┤
│ [Single-image VQA] [Grounding] [Before/After] [Optical+SAR] │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ BEFORE / AFTER CHANGE                                   │ │
│ │ [T1 thumbnail]  [T2 thumbnail]                          │ │
│ │ “What changed between these dates?”                     │ │
│ │ [Run this example]       [View trace]                    │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ Input → Task → Specialist models → Evidence → Answer        │
└──────────────────────────────────────────────────────────────┘
```

Pitch Mode is a curated read-only sequence: Ask → Route → Analyze → Ground → Explain. Precomputed runs must be labeled `Precomputed demonstration`; provide `Run live` where possible. Include one example for VQA, one for grounding, one for temporal change, and one for optical–SAR fusion.

## AI plan

```text
┌─────────────────────────────────────────────────────────┐
│ AI ANALYSIS PLAN                                        │
│ I understood your request                               │
│                                                         │
│ Task      Change detection                              │
│ Inputs    T1 + T2                                       │
│ Area      Selected overlap                              │
│ Time      Jan 14 → Aug 22                               │
│                                                         │
│ I will compare the images, locate candidate changes,    │
│ and cross-check optical evidence with SAR if available. │
│                                                         │
│ [Run analysis]                         [Customize]     │
└─────────────────────────────────────────────────────────┘
```

Use editable chips, not a configuration form. Required missing information creates one clarification question. `Customize` opens a compact drawer for dates, sensor preference, AOI, thresholds, and output type. Full model/metadata controls belong in Advanced.

## Progress experience

Show six product steps, with optional technical details:

1. Understanding your question.
2. Validating imagery.
3. Selecting the workflow.
4. Comparing and interpreting imagery.
5. Grounding findings on the map.
6. Building and checking evidence.

Each row is `queued → active → complete`; transitions use 180ms ease-out and a subtle cyan active pulse. Show artifacts when ready, not chain-of-thought. Model names appear only in Technical details. Error states preserve artifacts and offer retry/cancel.

## Map specification

Use MapLibre GL JS by default; use Mapbox GL JS only if hosted styles/geocoding justify provider lock-in. Use a dark low-detail basemap. Imagery is a raster source; evidence is GeoJSON/vector source. AOI is a cyan outline with low-opacity fill. Evidence polygons are blue/cyan; uncertainty is amber hatch/opacity; abstention is red. Temporal mode adds a T1/T2 swipe and compact timeline. Optical/SAR mode adds a two-option sensor toggle and an `Agreement` layer. Do not use a globe, heavy 3D terrain, or raw model output in the default workspace.

## Progressive disclosure

**Level 1 — Answer:** finding, confidence, map, evidence count, dates, actions.

**Level 2 — Why:** imagery, sensor agreement, temporal comparison, evidence regions, limitations.

**Level 3 — Audit:** task classification, models, versions, parameters, CRS, metadata, intermediate outputs, trace, hashes, reproducibility, exports.

Navigation is always visible as `Answer | Evidence | Compare | Audit`; the default opens Answer.

## 3D globe

Marketing only. Earth is 52–60% of hero height at a 38° oblique angle; dark night-side terminator, restrained city lights, blue atmosphere, faint cloud layer, five to seven satellites, three low-opacity orbital paths, and three observation arcs. Rotation is 0.01–0.03 rad/s. One arc pulse every 5–8 seconds. Pointer parallax is 2–4px. No country labels, dense grids, clickable satellites, neon network web, or fake “live” claims. On scroll, globe fades/slides aside while the real satellite proof section enters. Mobile uses a static WebP/poster or reduced canvas.

Use React Three Fiber, Three.js, and Drei with `ssr:false`, dynamic import, capped pixel ratio, KTX2/WebP textures, and a static fallback. Use `satellite.js` only when showing real orbital data. Use Cesium only later for terrain/3D Tiles; it is not required for the marketing hero. Next.js supports dynamic/lazy loading for this client-only visual. [web:77][web:78]

## Design system

```css
--bg:#07111F; --surface:#0B1628; --panel:#101C2E;
--elevated:#142238; --input:#0D192A; --border:#24344A;
--text:#E8F0F7; --muted:#8EA4B8;
--blue:#20A4F3; --cyan:#22C7D6; --success:#19C37D;
--warning:#F5A524; --danger:#F05D6C;
```

Inter: 12px metadata, 14px controls, 16px body, 20px card title, 28px result, 48–64px hero. JetBrains Mono only for coordinates, IDs, timestamps, and technical values. Four-pixel spacing base; 12px controls; 16px input gaps; 24px card padding; 32–48px section spacing. Radius: 8px controls, 12px cards, 16px hero surfaces. One primary CTA per view. Avoid glassmorphism and large shadows.

## Animation

| Surface | Trigger | Timing | Purpose |
|---|---|---|---|
| Globe | page load | slow linear | global observation context |
| Query plan | submit | 220ms ease-out | make interpretation explicit |
| Progress | step change | 180ms ease | communicate state |
| Evidence | result ready | 450ms ease-out | guide attention to regions |
| Drawer | Why click | 240ms ease | preserve map context |
| Compare | drag/toggle | direct | inspect imagery |
| Report | generation | real job status | communicate background work |

Support `prefers-reduced-motion`; pause WebGL offscreen.

## React structure

```text
src/app/
  page.tsx
  analyze/page.tsx
  demo/page.tsx
  pitch/page.tsx
  analyses/page.tsx
  analyses/[id]/page.tsx
  analyses/[id]/evidence/page.tsx
  analyses/[id]/audit/page.tsx
  reports/page.tsx
  settings/page.tsx
src/components/
  layout/AppShell.tsx
  landing/GlobeHero.tsx
  landing/ProofDemo.tsx
  analyze/AnalysisModePicker.tsx
  analyze/AnalysisComposer.tsx
  upload/ImageUploader.tsx
  upload/ImageFileCard.tsx
  upload/MetadataDisclosure.tsx
  ai/InterpretationChips.tsx
  ai/AnalysisPlan.tsx
  ai/AnalysisProgress.tsx
  map/AnalysisMap.tsx
  map/AoiDrawControl.tsx
  map/LayerMenu.tsx
  map/TemporalCompare.tsx
  result/ResultCard.tsx
  result/ConfidenceMeter.tsx
  evidence/EvidenceViewer.tsx
  evidence/EvidenceDrawer.tsx
  audit/ExecutionTrace.tsx
  audit/AdvancedPanel.tsx
  reports/ReportPreview.tsx
```

Use one shared `AnalysisShell`; mode-specific components are slots, not separate product trees.

## Recommended libraries

- Existing Next.js, React, TypeScript, Tailwind, shadcn/ui, Lucide.
- React Three Fiber, Three.js, Drei for marketing globe.
- `three-globe`/`r3f-globe` only if it accelerates arcs and satellite layers.
- MapLibre GL JS for operational map; Mapbox as hosted alternative.
- `geotiff.js` for preview/metadata where appropriate; server-side raster pyramids for large files.
- `@mapbox/mapbox-gl-draw` or MapLibre-compatible drawing control for AOI.
- `satellite.js` only for real TLE orbit positions.
- Motion library only for UI transitions; avoid adding a large animation system.
- PostGIS/GeoJSON utilities server-side for geometry validation and simplification.

## Current → new

| Current | Action | New location |
|---|---|---|
| Task cards | simplify | inferred interpretation chips |
| Configuration panel | hide | Customize drawer / Advanced |
| Query | keep | composer at top of Analyze |
| Run button | simplify | Run analysis after plan |
| Dense map controls | simplify | Search, Draw, Compare, Layers |
| Timeline | contextualize | temporal mode only |
| Decision Engine | redesign | Result card |
| Checklist | move | Progress and Audit |
| Evidence cards | keep | map-linked Evidence view |
| Execution trace | keep | Audit tab |
| Reports | keep | Export action and Reports page |
| Globe | narrow scope | landing and Pitch Mode only |

## Hackathon priority

### Must build first

1. Four routes: Landing, Home, Analyze, Analysis.
2. Two preloaded demo runs: temporal and optical–SAR.
3. Upload cards with compatibility states.
4. AI interpretation chips and plan.
5. Progress state machine.
6. Map with AOI and evidence polygons.
7. Result card and simple Why drawer.
8. Observable trace with task, model, parameters, outputs.

### Should build

- Single-image VQA and grounding demos.
- T1/T2 swipe.
- GeoJSON/CSV/PDF export.
- Advanced metadata and Audit page.
- Mobile bottom sheets.

### Nice to have

- Live catalog search.
- Follow-up questions.
- Saved areas and alerts.
- Globe orbit data from live TLEs.

### Do not build yet

- Full Cesium terrain.
- Complex project management.
- Permanent 3D dashboard globe.
- Arbitrary model-builder UI.
- Large provider marketplace.
- Real-time satellite operations unless required by backend.

## Consolidated implementation flow

### Landing → Home
**Data:** marketing content, demo manifest, static globe poster. **Components:** `GlobeHero`, `ProofDemo`, `StartButton`. **Interaction:** Start creates draft run or opens Home. **Tech:** Next.js server-rendered page; client-only globe lazy-loaded.

### Home → Analyze
**Data:** recent `AnalysisRun` summaries. **Components:** `AnalysisComposer`, mode picker, recent list. **Interaction:** query or mode starts draft. **Tech:** React form state and server action/API.

### Analyze → Upload
**Data:** files, inferred metadata, AOI. **Components:** `ImageUploader`, file cards, metadata disclosure. **Interaction:** drag/drop, assign T1/T2, confirm modality, draw/search AOI. **Tech:** upload presigned URL; metadata inspection service.

### Upload → AI Plan
**Data:** question, input manifest, validation results. **Components:** `AIInterpretation`, `AnalysisPlan`. **Interaction:** edit chips, clarify missing fields, customize optional values. **Tech:** typed plan JSON from backend.

### Plan → Analysis
**Data:** confirmed plan version. **Components:** `AnalysisProgress`. **Interaction:** Run, cancel, retry, view technical details. **Tech:** SSE/WebSocket run events.

### Analysis → Result
**Data:** answer, confidence, evidence package, map layers. **Components:** `AnalysisMap`, `ResultCard`, `SensorAgreement`. **Interaction:** focus evidence, compare, report. **Tech:** MapLibre raster/vector sources and persisted run state.

### Result → Evidence
**Data:** evidence IDs, crops, geometries, basis, limitations. **Components:** `EvidenceDrawer`, `EvidenceViewer`. **Interaction:** select region, open map, inspect optical/SAR/temporal basis. **Tech:** synchronized map and evidence state.

### Evidence → Audit
**Data:** trace events, model registry entries, parameters, input hashes, artifacts. **Components:** `ExecutionTrace`, `AdvancedPanel`. **Interaction:** expand steps, download audit bundle, reproduce run. **Tech:** immutable event log and artifact references.

### Any state → Report
**Data:** canonical answer/evidence/audit package. **Components:** `ReportPreview`, `ReportActions`. **Interaction:** choose PDF, GeoJSON, CSV, audit. **Tech:** asynchronous export job with progress.

## Final build instruction

Do not build a generic chatbot, a permanent GIS workstation, or a decorative Web3 globe. Build a calm question-and-upload flow; automatically route the request; show a precise plan; render a real map; lead with a plain-language result; make every claim clickable to evidence; and keep models, metadata, parameters, and trace one level deeper.
