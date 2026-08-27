# SATQUERY AI — Second-Pass UX Refinement & Implementation Blueprint

**Date:** 27 August 2026  
**Scope:** Frontend UX, information architecture, interaction design, and implementation structure. The AI architecture is preserved.

## 1. Critique of the first proposal

### What was too generic

The first proposal correctly recommended “AI-first entry + map-first answer + progressive disclosure,” but it did not specify the exact states, component contracts, copy, validation behavior, or page-level layouts needed by a developer. It also described broad inspiration without sufficiently separating the problem statement’s mandatory benchmark workflows from future platform features.

### What was underspecified

- Whether the user starts with a query, an upload, or a mode.
- How single-image, temporal, and optical–SAR inputs differ in the UI.
- Exact upload validation and compatibility rules.
- What happens when dates, CRS, registration, or modality metadata are missing.
- The boundary between “confidence,” model score, and evidence quality.
- The data contract shared by map, answer, report, and audit views.
- The exact mobile composition.
- What a judge can demonstrate in two minutes.

### Where it could still overwhelm

A plan containing task, imagery, sensors, dates, AOI, workflow, evidence, and confidence can become another configuration screen. The solution is to show only a **four-chip interpretation** first: `Task`, `Inputs`, `Area`, `Time`. Put workflow details in a one-click “How it will work” expansion.

### Where it could become generic AI SaaS

A large chat box, bento feature cards, glowing gradients, and vague “AI-powered insights” language would erase the distinctive product. Every major marketing and product section should show a remote-sensing artifact: an image pair, mask, evidence crop, sensor comparison, or auditable run.

### 3D globe risk

A globe is decoration if it does not transition into a real analysis, identify the supported modalities, or communicate observation coverage. Keep it on the marketing hero, use real satellite imagery in the proof section, and do not use a 3D globe as the operational analysis map.

### Architecture represented too weakly

The first proposal under-emphasized remote-sensing adaptation, benchmark readiness, file compatibility, model registry, and the observable execution trace. These now become first-class UX artifacts.

### Hackathon changes

Add a Demo Center, Pitch Mode, preloaded sample analyses, one-click “Run this example,” and a visible trace that names the selected specialist models. A judge should see the complete loop without needing to upload or configure data manually.

### Analyst changes

Add reproducible run IDs, immutable input metadata, comparison controls, evidence IDs, model/version details, thresholds, CRS, export formats, and an advanced evidence view. Analysts get depth through inspection, not default density.

### Keep exactly

Keep natural-language querying, automatic routing, map-grounded results, optical/SAR/temporal support, confidence and uncertainty, evidence generation, reports, and auditability. These are the core differentiators.

## 2. Final product model

```text
Home / Demo
    ↓
Choose: Single image | Before + after | Optical + SAR
    ↓
Upload or select sample
    ↓
Ask a question
    ↓
Review four-chip AI interpretation
    ↓
Run analysis
    ↓
Answer + map evidence + confidence
    ↓
Why? → evidence details
Audit → models, parameters, metadata, reproducibility
```

The primary analysis object owns all related views:

`Answer | Evidence | Compare | Audit | Export`

## 3. Final navigation

```text
SATQUERY AI       Analyze   Demo   Analyses   Reports        Profile
```

- **Analyze:** new analysis launcher and active workspace.
- **Demo:** benchmark and pitch demonstrations.
- **Analyses:** history, saved runs, and project filters.
- **Reports:** PDF, GeoJSON, CSV, and audit exports.
- **Profile menu:** Settings, datasets/catalog, model registry, API, team access.
- **Evidence and Audit:** tabs under an analysis, not global navigation.

## 4. Landing page specification

### Navbar

Logo: `SATQUERY AI` with a small orbital-dot mark.  
Links: `Product`, `Demo`, `How it works`, `Use cases`.  
Actions: `Sign in`, filled `Start analysis`.

### Hero

```text
┌────────────────────────────────────────────────────────────┐
│ SATQUERY AI       Product  Demo  How it works  [Start →]   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ASK QUESTIONS ABOUT        [dark Earth / observation globe] │
│ REMOTE-SENSING IMAGES.     [3–5 restrained arcs/satellites] │
│ GET THE EVIDENCE.                                         │
│                                                            │
│ Ask about one image, two dates, or optical + SAR imagery.  │
│ [Start analysis]  [Explore demo]                          │
│                                                            │
│ Single-image VQA   Before/after change   Optical + SAR    │
└────────────────────────────────────────────────────────────┘
```

The hero must say “images,” not only “Earth,” because the evaluated input scope is uploaded remote-sensing imagery.

### Section sequence

1. **Hero:** clear promise and three supported modes. Visual: WebGL Earth plus tiny modality chips. Animation: slow rotation only.
2. **Interactive proof:** a real image pair, question composer, and answer reveal. Show “7 candidate regions” becoming highlighted polygons.
3. **Three workflows:** Single image, Before + after, Optical + SAR. Each card contains a real input thumbnail and a sample question.
4. **Evidence-first answer:** split view of answer text, evidence crop, and map polygon. CTA: `See how evidence works`.
5. **Agentic orchestration:** five-node visual: Understand → Validate → Route → Analyze → Ground. Expandable model/tool trace.
6. **Remote-sensing adaptation:** explain that specialist models are adapted to remote-sensing imagery; show a model card, not an abstract brain graphic.
7. **Confidence with limitations:** confidence meter paired with “what supports this” and “what remains uncertain.”
8. **Benchmark readiness:** public-task cards for VQA, captioning/grounding, CDVQA-style change, and optical–SAR fusion.
9. **Exports and audit:** report preview with PDF, GeoJSON, CSV, and execution summary.
10. **Final CTA:** “Upload a scene and ask your first question.”

## 5. 3D globe art direction

### Placement

- Full or partial hero background on desktop.
- Static poster or simplified CSS/raster fallback on mobile and weak GPUs.
- No persistent globe in the dashboard.
- Optional small globe thumbnail only in Home’s “global coverage” empty state.

### Exact scene

- Camera: 38° latitude-like oblique view; Earth occupies 52–60% of the canvas height.
- View: limb and night-side terminator visible; India/South Asia subtly toward the visual center-right, not a glowing national target.
- Earth: dark blue-black night surface, restrained city lights, faint cloud layer, thin cyan atmospheric rim.
- Satellites: 5–7 small silhouettes, varied distance; only two catch highlights.
- Orbits: three thin elliptical tracks, opacity 0.12–0.28; never a dense wireframe.
- Data arcs: three short arcs connecting observation regions; arcs pulse once every 5–8 seconds.
- Labels: no country labels by default; one tiny “Earth observation” annotation may appear after scroll.
- AOI: never show a random AOI on the hero. On the interactive demo, transition from a selected India AOI to the real analysis map.
- Stars: sparse and static.

### Interaction

- Pointer movement: maximum 2–4px camera parallax; no spinning on cursor.
- Scroll: globe slowly moves aside/fades as the proof section enters; it does not fly through the Earth.
- Click: one CTA can focus the analysis composer; satellites and arcs are not clickable features.
- Reduced motion: static Earth poster with a single glow.
- Mobile: Earth cropped to the right/top 40% of hero, text and CTA remain above the fold.

The visual communicates global observation, orbiting sensors, and data connected to places. It does not claim that the globe is a live operational satellite tracker.

## 6. Technology decision

| Area | Recommendation | Why | Main limitation |
|---|---|---|---|
| Marketing globe | Three.js + React Three Fiber + Drei | React-native scene composition, custom shaders, good Next.js integration | WebGL bundle and GPU cost |
| Globe data layers | `three-globe` or `r3f-globe` | Arcs, points, paths, labels, satellite examples | Less precise than a GIS engine |
| Real orbital position | `satellite.js` | Use only when showing actual TLE-based positions | Requires current orbital data and careful labeling |
| Analytical map | MapLibre GL JS | Vector/raster layers, GeoJSON evidence, provider flexibility | Requires tile/style infrastructure |
| Hosted map alternative | Mapbox GL JS | Strong polish, geocoding, styles, ecosystem | Provider cost/lock-in |
| Precision 3D globe | CesiumJS | WGS84, terrain, 3D Tiles, high-precision geospatial visualization | Overkill for hero and heavier integration |
| AOI geometry | GeoJSON + MapLibre draw tooling | Same evidence geometry can be rendered and exported | Large geometries need simplification/server tiling |

`three-globe` provides paths, arcs, countries, clouds, day/night, labels, and satellite examples; its R3F bindings make it a practical prototype source. [web:68] CesiumJS is the appropriate later choice for precision terrain or 3D Tiles rather than the first dashboard version. [web:18]

**Final stack:** R3F/Drei/Three.js for the optional marketing scene; MapLibre for analysis; PostGIS/GeoJSON for geometry; `satellite.js` only for real orbit data; no Cesium until terrain or 3D Tiles are a demonstrated requirement.

## 7. Home / Command Center

### Purpose
Fast re-entry and one obvious new-analysis action. Primary user: first-time and returning user. CTA: `New analysis`.

```text
┌──────────────────────────────────────────────────────────────┐
│ SATQUERY AI       Analyze  Demo  Analyses  Reports     [•••] │
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
│ [thumbnail] Built-up area change · Pune · 2 hours ago        │
│                                                              │
│ Recent analyses       Saved areas       Reports               │
└──────────────────────────────────────────────────────────────┘
```

Empty state: three example questions and a `Run sample analysis` button. Loading: skeleton for recent runs. Error: preserve the question and offer retry. Do not show model cards, raw datasets, or a full map before analysis.

Mobile: composer first, then horizontal sample cards, then recent analyses. No multi-column dashboard.

## 8. Analyze launcher and upload

### Analyze wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ New analysis                                      [Save draft]│
│ Choose a starting point                                      │
│ [ Single image ] [ Before + after ] [ Optical + SAR ]        │
│                                                              │
│ Add imagery                                                  │
│ ┌────────────────────┐  ┌────────────────────┐               │
│ │ Drag GeoTIFF/TIFF  │  │ T1 / Optical       │               │
│ │ or [Browse files]  │  │ [Add image]        │               │
│ └────────────────────┘  └────────────────────┘               │
│                                                              │
│ What do you want to know?                                    │
│ [__________________________________________________________] │
│                                        [Continue →]          │
└──────────────────────────────────────────────────────────────┘
```

### Upload normal view

Each file card shows thumbnail, inferred label (`Optical`, `SAR`, `T1`, `T2`), file name, date, and a status badge: `Compatible`, `Needs review`, or `Unsupported`.

### Advanced metadata view

Expandable `View metadata` shows dimensions, band count, bit depth, CRS, geotransform, spatial bounds, acquisition time, nodata percentage, registration status, and parser warnings. A normal user sees only a plain-language summary; analysts can inspect raw fields.

### Validation messages

- “This GeoTIFF is readable and georeferenced.”
- “We found two images, but their footprints do not fully overlap.”
- “Dates were not found. Assign T1 and T2 manually.”
- “This JPEG is allowed for benchmark demos, but geospatial coordinates are unavailable.”
- “SAR modality could not be confidently inferred. Confirm it.”

Do not block the user with CRS terminology unless it affects the analysis.

## 9. AI plan and analysis progress

### Plan card

```text
┌─────────────────────────────────────────────────────────┐
│ AI ANALYSIS PLAN                                        │
│ I understood your question                              │
│                                                         │
│ Task       Change detection                             │
│ Inputs     T1 + T2                                      │
│ Area       Selected image overlap                       │
│ Time       Jan 14 → Aug 22                              │
│                                                         │
│ I will compare the images, locate candidate changes,    │
│ and cross-check optical evidence with SAR if available. │
│                                                         │
│ [Start analysis]                         [Customize]   │
└─────────────────────────────────────────────────────────┘
```

This is good UX if it is a confirmation, not a configuration form. Keep four rows visible and put the specialist sequence behind `How this works`.

### Progress screen

Use a centered run card over a dimmed map preview. Show six user-facing stages, not every agent:

1. Understanding your question.
2. Validating imagery.
3. Selecting the right workflow.
4. Comparing and interpreting imagery.
5. Grounding findings on the map.
6. Building and checking evidence.

Each row transitions `queued → active → complete`; a completed row can reveal one artifact. Model names appear only in the optional `Technical details` drawer. Never show chain-of-thought.

Animation: 180ms row transitions; active cyan pulse; artifact thumbnails fade in; no spinner-only state. On provider delay, say “Imagery service is taking longer than expected” with `Keep waiting` and `Cancel`.

## 10. Analysis workspace

```text
┌──────────────────────────────────────────────────────────────┐
│ ← Analyses   Built-up change near Pune   [Customize] [Export]│
├──────────────────────────────────────────────────────────────┤
│ Question: Did construction increase between Jan and Aug?    │
│ T1 Jan 14, 2026 → T2 Aug 22, 2026 · 4.2 km²                │
├──────────────────────────────────┬───────────────────────────┤
│                                  │ AI FINDING                │
│                                  │ 17 probable new           │
│          MAP                     │ structures detected       │
│  imagery + AOI + evidence       │                           │
│  [Search] [Draw AOI] [Compare]  │ Confidence 92%            │
│                                  │ Based on Optical + SAR    │
│                                  │ 6 high-confidence regions │
│                                  │                           │
│                                  │ [View evidence]           │
│                                  │ [Compare images]          │
│                                  │ [Generate report]         │
│                                  │                           │
│                                  │ [Why this answer?]        │
├──────────────────────────────────┴───────────────────────────┤
│ Evidence 1  Evidence 2  Evidence 3  …    Timeline collapsed │
└──────────────────────────────────────────────────────────────┘
```

Default map layers: selected imagery, AOI, evidence overlays, labels. Controls: search, draw AOI, fit, compare, layers. NIR, raw masks, SAR backscatter, thresholds, and execution trace are nested under `Layers` or `Advanced`.

## 11. Result and evidence design

### Result hierarchy

1. Finding headline, maximum two lines.
2. Supporting quantity or direction of change.
3. Confidence with label and explanation.
4. Map evidence count and high-confidence count.
5. Dates, area, and input basis.
6. Three actions: Evidence, Compare, Report.
7. `Why this answer?` disclosure.

Do not show a checklist of internal pipeline steps next to the finding.

### Simple evidence view

Clicking `Why this answer?` opens a right drawer or mobile bottom sheet:

```text
WHY THIS ANSWER?
6 high-confidence regions

[Region 1] New rectangular structure
Before | After
Optical: supports     SAR: supports
Confidence: High
[Open on map]

[Region 2] Possible construction
Before | After
Optical: supports     SAR: unavailable
Confidence: Moderate
```

### Expert evidence view

The `Evidence` tab becomes a full-width investigation view with a region list, map, before/after crop, sensor tabs, geometry, pixel/mask references, model evidence source, quality notes, and export selection. It should preserve the same evidence IDs used by reports.

### Confidence

Show `System confidence: 92%` with High/Moderate/Low and a textual basis. Separate detection score, evidence quality, and sensor agreement in the expert view. Use pattern/labels as well as color for accessibility.

## 12. Demo / Benchmark Center

```text
┌──────────────────────────────────────────────────────────────┐
│ DEMO CENTER                                                  │
│ See every required capability in under two minutes.          │
│                                                              │
│ [Single-image VQA] [Captioning] [Grounding]                 │
│ [Before / after change] [Optical + SAR fusion]              │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ BEFORE / AFTER CHANGE                                    │ │
│ │ [T1 image] [T2 image]                                   │ │
│ │ “What changed between these dates?”                      │ │
│ │ [Run this demo]        [View expected outputs]            │ │
│ └──────────────────────────────────────────────────────────┘ │
│ Public benchmark tasks · model version · evidence · trace    │
└──────────────────────────────────────────────────────────────┘
```

Each demo card has preloaded images, query, expected task, run button, evidence output, model names, and trace. Include benchmark labels only when the data and metrics are genuinely reproducible; never imply hidden-set performance.

## 13. Pitch Mode

Yes, add `/pitch` or a `Pitch mode` toggle inside Demo. It is a curated, read-only narrative with five slides/states:

1. Ask a question.
2. Show automatic routing.
3. Show temporal or optical–SAR analysis.
4. Show grounded evidence.
5. Open trace and export.

A judge can reset the demo, skip processing waits using cached artifacts, and inspect the real workflow. Do not fake live inference: label cached outputs as “Precomputed demonstration” and provide `Run live` where possible.

## 14. Advanced and Audit

Use a full-page `Advanced` tab, not a modal. A modal is too small for metadata, model versions, trace events, and reproducibility.

```text
┌──────────────────────────────────────────────────────────────┐
│ ANALYSIS / ADVANCED                                         │
│ [Plan] [Inputs] [Models] [Parameters] [Layers] [Audit]      │
├───────────────┬──────────────────────────────────────────────┤
│ sections       │ selected technical details                  │
│ Models         │ change-vqa-temporal-v1 · version 1.2.0     │
│ Parameters     │ threshold 0.65 · co-registration enabled    │
│ Metadata       │ CRS EPSG:4326 · 4096×4096 · 4 bands         │
│ Intermediate   │ [artifact preview]                         │
│ Reproducibility│ run ID, input hashes, config, timestamps    │
└───────────────┴──────────────────────────────────────────────┘
```

`Customize` is a compact drawer for dates, sensor preference, thresholds, and AOI. The full Advanced tab is for expert inspection and reproducibility.

## 15. Mobile behavior

Mobile is a sequential investigation, not a compressed desktop:

```text
Ask → Upload → Plan → Map → Result → Evidence → Details
```

- Query composer: full-width, sticky bottom action.
- Upload: vertical cards with expandable metadata.
- Plan: bottom sheet with four interpretation rows.
- Map: full-screen stage with a collapsed result pill.
- Result: bottom sheet; swipe up for evidence.
- Evidence: one region at a time with before/after crops.
- Advanced: full-screen route, never a crowded drawer.
- Compare: swipe handle or segmented T1/T2 toggle.

Tablet: map takes approximately 60% width and result panel 40%; evidence opens as a right drawer.

## 16. Design system

### Tokens

```css
--bg: #07111F;
--surface: #0B1628;
--panel: #101C2E;
--elevated: #142238;
--input: #0D192A;
--border: #24344A;
--text: #E8F0F7;
--muted: #8EA4B8;
--blue: #20A4F3;
--cyan: #22C7D6;
--success: #19C37D;
--warning: #F5A524;
--danger: #F05D6C;
```

Type scale: 12px metadata, 14px controls, 16px body, 20px card title, 28px result number, 48–64px hero headline. Inter is primary; JetBrains Mono is only for coordinates, IDs, timestamps, and technical values.

Radius: 8px controls, 12px cards, 16px hero surfaces. Border: 1px solid `#24344A`; avoid heavy blur and excessive glass. Use one primary cyan/blue CTA per view. Evidence overlays use cyan outline, blue fill at low opacity, amber hatch for uncertainty, red only for abstention/error.

## 17. Animation system

| Surface | Trigger | Duration/easing | Purpose |
|---|---|---|---|
| Hero globe | Page load | slow, linear rotation | Global observation context |
| Hero arcs | 4–8 second interval | 900ms ease-out | Show observation flow, not decoration |
| Query plan | Submit | 220ms ease-out | Make interpretation feel explicit |
| Progress rows | Step change | 180ms ease | Explain system state |
| Map evidence | Result ready | 450ms ease-out | Guide attention to grounded regions |
| Evidence drawer | Why click | 240ms ease | Preserve spatial context |
| T1/T2 compare | Drag/toggle | direct interaction | Inspect change, no theatrical motion |
| Report generation | Start | indeterminate progress + status | Communicate a real background job |

Support `prefers-reduced-motion`; pause WebGL when offscreen or hidden.

## 18. Accessibility

- Maintain WCAG AA contrast for text and controls.
- Never use confidence color alone; include text and shape/pattern.
- Provide keyboard focus for upload, plan, evidence, and map actions.
- Give the canvas a descriptive label and a static alternative.
- Provide a textual evidence list for map regions.
- Announce analysis progress through an ARIA live region.
- Ensure all dialogs have focus management and escape behavior.
- Offer reduced motion and a high-contrast map layer.

## 19. Frontend architecture

```text
src/
  app/
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
  components/
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
    result/SensorBasis.tsx
    evidence/EvidenceDrawer.tsx
    evidence/EvidenceViewer.tsx
    evidence/EvidenceRegionList.tsx
    audit/ExecutionTrace.tsx
    audit/AdvancedPanel.tsx
    reports/ReportActions.tsx
```

Do not create separate component trees for every task. Use a shared `AnalysisShell` with mode-specific slots and schemas.

### Core frontend types

```typescript
type AnalysisMode = 'single' | 'temporal' | 'optical-sar';
type RunStatus = 'draft' | 'validating' | 'planned' | 'running' |
  'completed' | 'limited' | 'clarification' | 'failed' | 'abstained';

type EvidenceItem = {
  id: string; label: string; geometry: GeoJSON.Geometry;
  crops: { before?: string; after?: string; source: string };
  basis: { optical?: Basis; sar?: Basis; temporal?: Basis };
  confidence: 'high' | 'moderate' | 'low'; limitations?: string[];
};
```

## 20. Performance and deployment

- Dynamic-import the globe with `ssr: false`; do not block first contentful paint on WebGL.
- Use a poster image first, then hydrate the globe after the hero text is visible.
- Use KTX2/WebP textures, low-resolution initial Earth texture, capped pixel ratio, and no expensive postprocessing stack.
- Pause the canvas when offscreen; respect reduced motion and WebGL failure.
- Use MapLibre/Mapbox raster tiles and vector evidence rather than loading full GeoTIFFs into React state.
- Generate thumbnails and pyramids server-side; stream only the resolution needed for the current zoom.
- Keep large raster/model work outside Vercel request handlers; the frontend creates a run and listens to SSE/WebSocket progress.
- Use route-level code splitting and avoid importing Cesium or Three.js into dashboard bundles.
- Simplify GeoJSON on the server for display while preserving the original export geometry.

## 21. Current versus proposed

| Current element | Action | Proposed implementation |
|---|---|---|
| Task cards first | Remove from default | Query + inferred mode chips |
| Dense left configuration panel | Simplify | Upload, question, four-row plan |
| Permanent three-panel console | Redesign | Map + result, contextual drawers |
| Manual sensor/model setup | Hide | AI recommendation + Customize |
| AI Decision Engine | Replace | Finding card + evidence basis |
| Checklist | Move | Progress screen and Audit tab |
| Timeline always visible | Contextualize | Show only for temporal mode |
| NIR/raw layers | Hide | Layers/Advanced |
| Evidence cards | Keep and improve | Numbered map-linked evidence objects |
| Execution trace | Keep, elevate | Required observable Audit view |
| Reports | Keep | Analysis-level Export actions |
| Globe | Narrow scope | Landing hero and Pitch Mode only |
| Missing upload validation | Add | Compatibility-first upload cards |
| Missing benchmark proof | Add | Demo Center and evaluation cards |
| Mobile desktop shrink | Replace | Sequential bottom-sheet workflow |

## 22. Final build decision

Build the product around one reusable analysis shell with three explicit input modes. Start with a short question and upload flow, automatically classify the task, present a four-row plan, and let the user run it. Make the map the primary analytical canvas and the result card the primary decision surface. Make every claim clickable to spatial evidence. Make the audit trace visible enough for judges and deep enough for analysts.

The landing page gets the cinematic globe, but the product proof is real imagery: VQA answer, grounded region, before/after change map, and optical–SAR agreement. The Demo Center is the hackathon shortcut; the Advanced/Audit route is the professional credibility layer.

In one sentence:

> **SATQUERY AI should look like a calm image-questioning tool on the first screen, then reveal a rigorous multimodal remote-sensing workflow only when the user asks why.**

## Research references

- [Copernicus Browser](https://dataspace.copernicus.eu/) demonstrates browser-based visualize/compare/analyze/download workflows for Earth observation data. [web:62][web:63]
- [Sentinel Hub EO Browser](https://www.sentinel-hub.com/explore/eobrowser/) demonstrates AOI, time-range, cloud-coverage, comparison, and multi-source imagery browsing. [web:65][web:70]
- [three-globe](https://github.com/vasturiano/three-globe) provides globe layers including arcs, paths, clouds, day/night, labels, and satellites. [web:68]
- [CesiumJS](https://cesium.com/platform/cesiumjs/) is appropriate for high-precision 3D geospatial visualization and WGS84 workflows. [web:18]
