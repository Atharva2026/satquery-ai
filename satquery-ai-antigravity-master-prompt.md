# MASTER BUILD PROMPT — SATQUERY AI

You are Antigravity, acting as a senior frontend architect, product designer, geospatial UX engineer, and AI-product implementation lead. Build the SATQUERY AI application according to this specification exactly.

This is an implementation task, not a brainstorming exercise. Do not redesign the concept, invent a different information architecture, or add generic AI-dashboard patterns. Make sensible implementation decisions where details are missing, but preserve the product direction and requirements below.

---

## 0. PRODUCT MISSION

SATQUERY AI is an agentic multimodal remote-sensing assistant. It accepts a natural-language question plus one image, two temporal images, or a co-registered optical–SAR pair. It automatically selects the appropriate specialist workflow and returns:

1. A plain-language answer.
2. A map or image-grounded visual result.
3. Evidence regions linked to the answer.
4. System confidence and uncertainty.
5. An observable execution summary.
6. Downloadable report/export artifacts.

The product philosophy is:

> SIMPLE ON THE SURFACE. POWERFUL UNDERNEATH.

The UX model is:

```text
AI-FIRST ENTRY → MAP-FIRST ANSWER → PROGRESSIVE DISCLOSURE
```

A non-expert must not need to understand VQA, SAR processing, optical bands, model routing, CRS, registration, or confidence calibration. An analyst must still be able to inspect those details through Evidence, Advanced, and Audit views.

Do not build a generic chatbot, a generic SaaS dashboard, a crypto/Web3 globe, or a permanent dense GIS workstation.

---

## 1. NON-NEGOTIABLE FUNCTIONAL SCOPE

The frontend must visibly support these workflows:

### A. Single-image VQA

Input: one optical/multispectral or SAR image.  
Example: “Describe the land-cover and major objects visible in this image.”

### B. Single-image captioning or grounding

Input: one image and a prompt.  
Example: “Highlight the water body referred to in the query.”

### C. Bi-temporal change analysis

Input: two spatially corresponding images acquired at different times.  
Example: “What changed between these two dates, and where did the change occur?”

### D. Optical–SAR fusion

Input: co-registered optical/multispectral and SAR images.  
Example: “Use the optical and SAR images together to identify built-up and water-covered regions.”

### E. Agentic orchestration

The system must visibly show:

- query understanding;
- task classification;
- input validation;
- planner/router selection;
- selected specialist model/tool names;
- permitted parameters;
- intermediate outputs/artifacts;
- evidence aggregation;
- confidence;
- final answer;
- audit trail.

Internal chain-of-thought must never be displayed. Show concise operational events and artifact references only.

---

## 2. APPROVED INFORMATION ARCHITECTURE

Use this navigation exactly unless a technical constraint requires a small adjustment:

```text
SATQUERY AI     Analyze   Demo   Analyses   Reports          Profile
```

Routes:

```text
/
  Landing page

/home
  Home / Command Center

/analyze
  New analysis launcher

/demo
  Demo Center

/pitch
  Pitch Mode

/analyses
  Analysis history

/analyses/[id]
  Analysis shell; default Answer view

/analyses/[id]/evidence
  Evidence view

/analyses/[id]/compare
  Temporal or sensor comparison

/analyses/[id]/audit
  Advanced and audit view

/reports
  Reports and exports

/settings
  Settings, datasets/catalog, model registry, API, team settings
```

Evidence and Audit are views of an AnalysisRun, not unrelated top-level products.

---

## 3. VISUAL DIRECTION

The visual direction is premium, dark, restrained, geospatial, technical, and trustworthy.

Do not use:

- purple AI gradients;
- floating brains;
- generic chatbot imagery;
- excessive glassmorphism;
- giant meaningless bento cards;
- crypto-style neon networks;
- gaming HUDs;
- excessive glowing blobs;
- decorative charts without meaning.

Use the existing identity and refine it:

```css
--background: #07111F;
--surface: #0B1628;
--panel: #101C2E;
--elevated: #142238;
--input: #0D192A;
--border: #24344A;
--text-primary: #E8F0F7;
--text-secondary: #8EA4B8;
--primary-blue: #20A4F3;
--cyan: #22C7D6;
--success: #19C37D;
--warning: #F5A524;
--danger: #F05D6C;
```

Typography:

- Inter for all UI, body, labels, buttons, and headings.
- JetBrains Mono only for coordinates, IDs, timestamps, hashes, model versions, CRS, and technical values.

Type scale:

```text
12px  metadata / table labels
14px  controls / secondary text
16px  body / inputs
20px  card titles
28px  result metric
48–64px landing headline
```

Spacing:

- 4px base unit.
- 8px compact gap.
- 12px control gap.
- 16px normal gap.
- 24px card padding.
- 32–48px section spacing.

Radius:

- 8px buttons and inputs.
- 12px cards and panels.
- 16px hero surfaces.

Use 1px borders in `--border`, minimal shadows, and limited backdrop blur. Cards should be solid enough to feel like a professional tool.

---

## 4. GLOBAL APP SHELL

Create a reusable `AppShell`.

Desktop:

```text
┌──────────────────────────────────────────────────────────────┐
│ SATQUERY AI       Analyze   Demo   Analyses   Reports   [•••]│
├──────────────────────────────────────────────────────────────┤
│ page content                                                 │
└──────────────────────────────────────────────────────────────┘
```

Header requirements:

- 64px height.
- Logo at left.
- Primary nav in center/left.
- Active nav uses cyan underline or subtle filled state.
- Profile menu at right.
- Never put more than four primary navigation destinations in the header.
- Use tooltip plus label for unfamiliar icons.

Mobile header:

- Logo left.
- One menu button right.
- Navigation opens full-screen or anchored menu.
- Do not squeeze the desktop nav into tiny text.

Global states:

- Every async operation needs loading, error, retry, cancel, and completed states.
- Preserve user input on errors.
- Show toast only for secondary confirmations; show inline errors for important workflow failures.

---

## 5. SCREEN 1 — LANDING PAGE

### Purpose

Explain what SATQUERY AI does within 10–20 seconds and let visitors start a real or preloaded analysis.

### Primary CTA

`Start analysis`

### Secondary CTA

`Explore demo`

### Navbar

```text
┌────────────────────────────────────────────────────────────┐
│ SATQUERY AI       Product  Demo  How it works  Use cases    │
│                                             Sign in [Start] │
└────────────────────────────────────────────────────────────┘
```

### Hero

```text
┌────────────────────────────────────────────────────────────┐
│                                                            │
│ ASK QUESTIONS ABOUT       [dark realistic Earth]            │
│ REMOTE-SENSING IMAGES.   [atmosphere + 5 satellites]       │
│                                                            │
│ GET THE EVIDENCE.                                         │
│                                                            │
│ Ask about one image, two dates, or optical + SAR imagery. │
│                                                            │
│ [Start analysis]  [Explore demo]                           │
│                                                            │
│ Single-image VQA   Before/after change   Optical + SAR    │
└────────────────────────────────────────────────────────────┘
```

Exact hero copy:

Headline: `ASK QUESTIONS ABOUT REMOTE-SENSING IMAGES. GET THE EVIDENCE.`

Supporting text: `Ask about one image, two dates, or optical + SAR imagery. SATQUERY AI selects the right specialist workflow and returns a grounded answer you can inspect.`

Capability chips:

- `Single-image VQA`
- `Before + after change`
- `Optical + SAR fusion`

### Landing sections

Implement in this order:

1. Hero.
2. Interactive satellite analysis proof.
3. Three supported workflows.
4. Evidence-first result.
5. Optical + SAR synchronized comparison.
6. Agentic orchestration.
7. Confidence and uncertainty.
8. Reports and audit.
9. Use cases.
10. Final CTA and footer.

Every section must have one clear message, one visual artifact, and no generic stock photography.

#### Interactive proof

Show a real or preloaded image pair, query, progress transition, map highlights, and answer. Use copy: `Ask a question. SATQUERY finds the evidence.`

#### Three workflows

Cards:

- Single image: VQA and captioning/grounding.
- Before + after: temporal change and change-VQA.
- Optical + SAR: complementary cross-modal evidence.

Each card includes a satellite thumbnail, example query, and `Try this workflow` action.

#### Evidence-first result

Show answer on left, satellite image/map in center, and numbered evidence crop on right. Use actual bounding boxes/polygons.

#### Fusion

Use synchronized optical and SAR panels for one location. Label the panels in plain language first; show `Optical` and `SAR` as secondary labels.

#### Orchestration

Show a compact five-to-seven-node path:

```text
Question → Validate → Route → Specialists → Evidence → Confidence → Answer
```

Do not put a giant architecture diagram in the hero.

#### Trust

Show report preview, model/tool list, input metadata, execution event list, and export formats: PDF, GeoJSON, CSV, Audit.

### Landing states

- Loading: text and CTA render without waiting for the globe.
- WebGL unavailable: static Earth poster.
- Reduced motion: static poster and no orbit animation.
- Mobile: text and CTA first; globe cropped behind/right; proof section immediately follows.

---

## 6. 3D GLOBE IMPLEMENTATION

The globe is marketing-only, with an optional use in Pitch Mode. Never use it as the operational analytical map.

### Art direction

- Earth camera angle: approximately 38° oblique.
- Earth scale: 52–60% of hero height desktop.
- View: night-side terminator with visible limb.
- Surface: dark blue-black Earth, restrained city lights, faint clouds.
- Atmosphere: subtle blue/cyan rim using a Fresnel-like effect.
- Satellites: 5–7 small silhouettes, 2–3 visibly illuminated.
- Orbits: 3 thin elliptical paths, opacity 0.12–0.28.
- Data arcs: 3 short observation arcs to meaningful regions; no dense global web.
- Stars: sparse and mostly static.
- Labels: no country labels by default.
- No fake live tracker claims.

### Motion

- Globe rotation: 0.01–0.03 radians/second.
- Satellite motion: slow and secondary to Earth.
- Arc pulse: one pulse every 5–8 seconds.
- Pointer parallax: 2–4px maximum.
- Scroll: globe gently fades/slides aside as real satellite proof enters.
- Click: CTA focus only; satellites are not toys.

### Mobile/performance

- Use static WebP/PNG poster by default on small devices or weak WebGL.
- Honor `prefers-reduced-motion`.
- Cap device pixel ratio at 1.5–2.
- Lazy-load scene after hero HTML is visible.
- Do not block first contentful paint.

### Technology

Use `three`, `@react-three/fiber`, and `@react-three/drei`. Use `three-globe` or `r3f-globe` only if helpful for arcs/paths. Use `satellite.js` only for real orbital positions and label them as real orbital data. Do not add Cesium to the initial build. Use Next.js dynamic import with `ssr: false` for the canvas.

---

## 7. SCREEN 2 — HOME / COMMAND CENTER

### Purpose

Give returning users a calm starting point and one dominant action.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ SATQUERY AI       Analyze   Demo   Analyses   Reports    [•••]│
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
│ [thumb] Built-up change near Pune · 2 hours ago      [Open]  │
│                                                              │
│ Recent analyses          Saved areas          Reports         │
└──────────────────────────────────────────────────────────────┘
```

Components:

- `HomeHeader`.
- `AnalysisComposer`.
- `AnalysisModePicker`.
- `ContinueAnalysisCard`.
- `RecentAnalysesList`.
- `SavedAreasCard`.
- `ReportsCard`.

Do not show a global map, model registry, raw datasets, or a dense analytics-card grid on Home.

Empty state: three example questions and `Run sample analysis`. Loading: skeleton composer and list rows. Error: preserve draft and show retry. Mobile: composer, mode chips, continue card, then recent list.

---

## 8. SCREEN 3 — ANALYZE / QUESTION + UPLOAD

### Wireframe

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

Supported file formats:

- GeoTIFF and TIFF for geospatial imagery.
- PNG/JPEG only for approved benchmark/demo inputs.

Mode behavior:

- Single image: one file slot; optional prompt for VQA, captioning, or grounding.
- Before + after: T1 and T2 slots; dates and overlap are validated.
- Optical + SAR: optical and SAR slots; co-registration and overlap are validated.

---

## 9. UPLOAD COMPONENT

Create `ImageUploader` and `ImageFileCard`.

### Normal card

```text
┌──────────────────────────────────────┐
│ ✓ scene_aug.tif              [•••]   │
│ [thumbnail] Optical · Image 2        │
│ 22 Aug 2026 · 4096 × 4096            │
│ ✓ Compatible                          │
│ [View metadata]                       │
└──────────────────────────────────────┘
```

Show only:

- filename;
- thumbnail;
- inferred/assigned modality;
- T1/T2 role if relevant;
- dimensions;
- date if available;
- compatibility badge;
- `View metadata`.

Advanced metadata disclosure:

- dimensions;
- band count;
- bit depth;
- CRS;
- geotransform;
- spatial extent;
- acquisition time;
- nodata percentage;
- georeferencing status;
- registration status;
- parser warnings.

Use plain-language warnings:

- `This GeoTIFF is readable and georeferenced.`
- `Dates were not found. Assign T1 and T2 manually.`
- `The image footprints overlap only partially.`
- `This JPEG is accepted for benchmark demonstration, but has no geographic coordinates.`
- `SAR modality could not be inferred. Confirm the modality.`

Never make a normal user interpret `EPSG:4326` to know whether an upload works.

---

## 10. AI INTERPRETATION AND PLAN

After Continue, call the backend and show editable interpretation chips:

```text
Task: Change detection
Inputs: T1 + T2
Area: Selected AOI
Time: Jan 14 → Aug 22
Imagery: Optical + SAR
```

### Plan card

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

The plan is confirmation, not configuration. Show the specialist sequence only under `How this works`:

```text
Temporal comparison → Grounding → Cross-sensor verification → Evidence
```

If a required input is missing, stop and ask one question. Do not silently invent location, date, or modality.

---

## 11. SCREEN 4 — ANALYSIS WORKSPACE

### Wireframe

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

The map occupies approximately 60–70% desktop width. Result panel is 320–380px. The bottom evidence strip is optional and collapses on smaller screens.

Map defaults:

- dark low-detail basemap;
- selected raster imagery;
- AOI outline;
- evidence polygons/boxes/masks;
- minimal labels.

Controls:

- Search.
- Draw AOI.
- Fit AOI.
- Compare.
- Layers.
- Zoom.

Hidden by default:

- raw SAR backscatter;
- NIR and spectral-band controls;
- raw model masks;
- thresholds;
- execution trace;
- CRS controls.

---

## 12. SCREEN 5 — RESULTS

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ ANALYSIS COMPLETE                         [Export] [Follow-up]│
├──────────────────────────────────┬───────────────────────────┤
│                                  │ AI FINDING                │
│        MAP WITH HIGHLIGHTS       │ 17 probable new           │
│ ① ② ③ ④ ⑤ ⑥ evidence regions   │ structures detected.       │
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

Result hierarchy:

1. Headline finding.
2. Count/direction/extent.
3. System confidence with High/Moderate/Low.
4. Map evidence count.
5. Inputs, dates, and area.
6. Primary actions.
7. Why disclosure.

Use language such as `17 probable new structures detected.` Do not claim certainty or accuracy from a model score. Always show limitations where applicable.

---

## 13. SCREEN 6 — EVIDENCE / WHY

### Simple evidence drawer

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

Every EvidenceItem must include:

- evidence ID;
- label;
- geometry;
- location;
- before/after crops if applicable;
- detected change/observation;
- optical basis;
- SAR basis;
- temporal basis;
- confidence;
- limitations;
- source image reference;
- open-on-map action.

### Expert evidence view

Full route `/analyses/[id]/evidence`:

```text
┌──────────────────────────────────────────────────────────────┐
│ Evidence 6 items                         [Export evidence]   │
├────────────────┬─────────────────────────────┬───────────────┤
│ Region list    │ MAP / IMAGE                │ INSPECTOR      │
│ ① High         │ selected geometry          │ before / after │
│ ② Moderate     │ numbered overlay           │ optical basis  │
│ ③ High         │                             │ SAR basis      │
│                │                             │ confidence     │
└────────────────┴─────────────────────────────┴───────────────┘
```

---

## 14. PROGRESSIVE DISCLOSURE

### Level 1 — Answer

Show:

- finding;
- confidence;
- map;
- evidence count;
- date/area basis;
- primary actions.

### Level 2 — Why

Show:

- imagery used;
- sensor agreement;
- temporal comparison;
- evidence regions;
- uncertainty and exclusions;
- before/after crops.

### Level 3 — Audit

Show:

- task classification;
- selected models and versions;
- parameters;
- CRS and metadata;
- intermediate artifact references;
- execution trace;
- input hashes;
- reproducibility information;
- exports.

Use persistent tabs: `Answer | Evidence | Compare | Audit`. Default opens Answer.

---

## 15. ADVANCED / AUDIT SCREEN

Use a full page, not a modal.

```text
┌──────────────────────────────────────────────────────────────┐
│ ANALYSIS / AUDIT                                            │
│ [Plan] [Inputs] [Models] [Parameters] [Layers] [Audit]      │
├───────────────┬──────────────────────────────────────────────┤
│ sections       │ selected technical details                  │
│ Models         │ change-vqa-temporal-v1 · version 1.2.0     │
│ Parameters     │ threshold 0.65 · co-registration enabled    │
│ Metadata       │ CRS EPSG:4326 · 4096×4096 · 4 bands         │
│ Intermediate   │ artifact preview                           │
│ Reproducibility│ run ID, input hashes, timestamps            │
└───────────────┴──────────────────────────────────────────────┘
```

`Customize` drawer contains only common overrides: dates, AOI, sensor preference, confidence threshold, and output type. The full page exposes technical controls and trace.

---

## 16. DEMO CENTER AND PITCH MODE

Demo Center must show the mandatory capability set with preloaded samples and no upload setup:

1. Single-image VQA.
2. Captioning or grounding.
3. Before/after change detection.
4. Optical + SAR fusion.

Each demo card includes:

- sample thumbnails;
- sample query;
- `Run this example`;
- expected task badge;
- result;
- evidence;
- selected tools/models;
- execution trace.

Pitch Mode route `/pitch` is a curated sequence:

```text
Ask → Route → Analyze → Ground → Explain → Audit
```

Provide reset, next, previous, `Run live`, and `Use cached demonstration`. Clearly label cached outputs. The judge should understand the entire system in two minutes.

---

## 17. AGENT ORCHESTRATION UI CONTRACT

The frontend should not implement the AI orchestration itself, but it must render its state and events.

Expected run phases:

```text
intake
validation
planning
imagery_selection
preprocessing
specialist_analysis
evidence_building
fusion
calibration
qa
synthesis
export
```

Expected event fields:

```typescript
type RunEvent = {
  runId: string;
  stepId: string;
  phase: string;
  agent?: string;
  status: 'queued' | 'active' | 'complete' | 'warning' | 'failed';
  message: string;
  timestamp: string;
  artifactIds?: string[];
  modelVersion?: string;
};
```

Show only six user-facing progress steps:

1. Understanding your question.
2. Validating imagery.
3. Selecting the workflow.
4. Comparing and interpreting imagery.
5. Grounding findings on the map.
6. Building and checking evidence.

Technical details can expand to show actual agent/model names. Do not render chain-of-thought.

---

## 18. DATA TYPES

Use shared types:

```typescript
type AnalysisMode = 'single' | 'temporal' | 'optical-sar';
type Modality = 'optical' | 'multispectral' | 'sar' | 'unknown';
type RunStatus =
  | 'draft' | 'validating' | 'planned' | 'running'
  | 'completed' | 'limited' | 'clarification'
  | 'failed' | 'abstained';

type InputAsset = {
  id: string;
  name: string;
  role: 'single' | 't1' | 't2' | 'optical' | 'sar';
  modality: Modality;
  format: 'geotiff' | 'tiff' | 'png' | 'jpeg';
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  bands?: number;
  acquisitionDate?: string;
  crs?: string;
  bounds?: [number, number, number, number];
  compatibility: 'compatible' | 'warning' | 'unsupported' | 'checking';
  warnings?: string[];
};

type Interpretation = {
  task: string;
  inputs: string;
  area?: string;
  dates?: string;
  imagery?: string;
  missing?: string[];
};

type EvidenceItem = {
  id: string;
  label: string;
  geometry: GeoJSON.Geometry;
  confidence: 'high' | 'moderate' | 'low';
  crops: { source?: string; before?: string; after?: string };
  basis: { optical?: string; sar?: string; temporal?: string };
  limitations?: string[];
};

type AnalysisRun = {
  id: string;
  question: string;
  mode: AnalysisMode;
  status: RunStatus;
  inputs: InputAsset[];
  interpretation?: Interpretation;
  plan?: AnalysisPlan;
  events: RunEvent[];
  answer?: { headline: string; explanation?: string };
  confidence?: { value: number; label: string; basis: string[] };
  evidence: EvidenceItem[];
  mapLayers?: MapLayer[];
};
```

---

## 19. COMPONENT ARCHITECTURE

Use this practical structure:

```text
src/
  app/
    page.tsx
    home/page.tsx
    analyze/page.tsx
    demo/page.tsx
    pitch/page.tsx
    analyses/page.tsx
    analyses/[id]/page.tsx
    analyses/[id]/evidence/page.tsx
    analyses/[id]/compare/page.tsx
    analyses/[id]/audit/page.tsx
    reports/page.tsx
    settings/page.tsx
  components/
    layout/AppShell.tsx
    layout/TopNav.tsx
    landing/GlobeHero.tsx
    landing/ProofDemo.tsx
    landing/WorkflowCards.tsx
    home/HomeHeader.tsx
    home/AnalysisComposer.tsx
    home/RecentAnalyses.tsx
    analyze/AnalysisModePicker.tsx
    analyze/AnalysisComposer.tsx
    analyze/InterpretationChips.tsx
    upload/ImageUploader.tsx
    upload/ImageFileCard.tsx
    upload/MetadataDisclosure.tsx
    ai/AIInterpretation.tsx
    ai/AnalysisPlan.tsx
    ai/AnalysisProgress.tsx
    workspace/AnalysisShell.tsx
    workspace/ResultCard.tsx
    workspace/AnalysisMap.tsx
    map/AoiDrawControl.tsx
    map/LayerMenu.tsx
    map/TemporalCompare.tsx
    map/SensorToggle.tsx
    result/ConfidenceMeter.tsx
    result/SensorAgreement.tsx
    evidence/EvidenceDrawer.tsx
    evidence/EvidenceViewer.tsx
    evidence/EvidenceRegionList.tsx
    audit/ExecutionTrace.tsx
    audit/AdvancedPanel.tsx
    reports/ReportPreview.tsx
    reports/ReportActions.tsx
```

Use one shared `AnalysisShell`, not separate duplicated shells for each mode. Use mode-specific slots for temporal compare and optical/SAR controls.

---

## 20. MAP IMPLEMENTATION

Use MapLibre GL JS by default. Use Mapbox only if the project already has a Mapbox account and provider services are required. Do not use Three.js for the analytical map.

Map sources:

- raster imagery source;
- vector AOI source;
- vector evidence source;
- optional change-mask raster source;
- optional sensor layer source.

Map styling:

- dark, low-contrast basemap;
- evidence is the brightest layer;
- AOI cyan outline and 8–12% fill;
- selected evidence region gets 2px cyan outline;
- uncertainty uses amber hatching/opacity;
- abstention uses red sparingly;
- map labels are minimal.

Interactions:

- click evidence region → open/focus evidence;
- click evidence list → fit map to geometry;
- compare toggle → show T1/T2 swipe;
- sensor toggle → optical/SAR/fusion;
- Layers → advanced layer menu;
- Draw AOI → create/update draft geometry.

---

## 21. RESPONSIVE DESIGN

Do not shrink desktop into mobile.

### Desktop

Map + result panel. Evidence drawer from right. Advanced is a full page.

### Tablet

Map approximately 60%; result panel 40%. Evidence opens from right. Query and upload remain stacked.

### Mobile

```text
Ask → Upload → Plan → Map → Result → Evidence → Details
```

- Full-width query composer.
- Vertical upload cards.
- Plan as bottom sheet.
- Full-screen map with collapsed result pill.
- Result as bottom sheet.
- Evidence one region at a time.
- Compare as swipe handle or T1/T2 segmented control.
- Advanced as full-screen route.
- Globe as static poster or reduced canvas.

---

## 22. ACCESSIBILITY

Implement:

- WCAG AA contrast.
- Visible keyboard focus.
- Keyboard-accessible upload, plan, evidence, and actions.
- ARIA live region for progress events.
- Descriptive canvas label and static globe alternative.
- Textual evidence list for map regions.
- Color plus label/pattern for confidence.
- Focus trapping and Escape handling in drawers/dialogs.
- Reduced motion mode.
- High-contrast map option.

---

## 23. PERFORMANCE AND NEXT.JS

- Use App Router and server components where suitable.
- Dynamic-import the globe with `ssr: false`.
- Load the poster immediately and hydrate WebGL after visible content.
- Use KTX2/WebP textures, low-resolution first load, capped pixel ratio, and no heavy postprocessing.
- Pause globe when offscreen.
- Do not import Three.js into dashboard bundles.
- Do not import Cesium in the initial application.
- Use raster pyramids and server-generated thumbnails for large imagery.
- Do not put model inference or large raster work inside a Vercel request handler.
- Frontend creates a run ID, subscribes to SSE/WebSocket events, and renders persisted artifacts.
- Use route-level code splitting.
- Simplify large GeoJSON for display but preserve original export geometry.

Next.js dynamic loading is appropriate for browser-only visual components and helps keep the initial page responsive. [web:77][web:78]

---

## 24. API EXPECTATIONS

Implement frontend adapters for these conceptual endpoints:

```text
POST /api/analyses
  body: { question, mode?, inputs?, aoi?, preferences? }
  returns: { runId, interpretation, validation, planPreview }

POST /api/analyses/:id/confirm
  body: { planVersion, overrides? }
  returns: { status: 'queued' }

GET /api/analyses/:id
  returns: AnalysisRun

GET /api/analyses/:id/events
  returns: SSE/streamed RunEvent objects

GET /api/analyses/:id/evidence
  returns: EvidenceItem[]

POST /api/analyses/:id/exports
  body: { format: 'pdf' | 'geojson' | 'csv' | 'audit' }
  returns: { exportJobId }
```

If backend APIs do not exist yet, create typed mock adapters and realistic fixture data. Keep the API boundary clean so mocks can be replaced without rewriting components.

---

## 25. REQUIRED FIXTURES FOR THE DEMO

Create fixtures for:

1. Single-image VQA completed result.
2. Single-image grounding result with boxes/polygons.
3. Bi-temporal construction change result with six evidence regions.
4. Optical–SAR fusion result with agreement/disagreement.
5. Limited result caused by poor coverage/clouds.
6. Invalid upload with missing date/CRS.
7. Failed provider/inference run.
8. Abstained result due to insufficient evidence.

Every fixture must contain answer, evidence, confidence, inputs, trace events, and map geometry so all screens can be demonstrated without a live backend.

---

## 26. CURRENT UI MIGRATION

```text
CURRENT                         ACTION              NEW LOCATION
Task selection cards            Simplify             Mode picker + inferred chips
Manual configuration            Hide by default      Customize drawer / Advanced
Query field                     Keep                 Home and Analyze composer
Run Change Detection            Generalize           Run analysis after AI plan
Dense map controls              Simplify             Search, Draw, Compare, Layers
Permanent timeline              Contextualize        Temporal mode only
AI Decision Engine              Redesign             Result card
Evidence checklist              Move                 Why drawer / Evidence tab
Execution trace                 Keep and improve     Audit tab
Raw layers and parameters       Hide                 Layers / Advanced
Reports                         Keep                 Export action + Reports page
3D globe                        Narrow               Landing and Pitch Mode
Upload validation               Add                  Analyze upload cards
Benchmark demonstrations       Add                  Demo Center
```

---

## 27. BUILD PRIORITY

### Must build first

1. App shell and routing.
2. Home composer.
3. Analyze mode picker.
4. Upload cards and validation states.
5. AI interpretation chips and plan.
6. Progress state machine.
7. Analysis shell with real map placeholder/MapLibre.
8. Result card.
9. Evidence drawer.
10. Observable trace.
11. Two complete demo fixtures: temporal and optical–SAR.

### Should build

- Single-image VQA fixture.
- Grounding fixture.
- T1/T2 swipe.
- PDF/GeoJSON/CSV/audit export UI.
- Advanced metadata page.
- Mobile bottom sheets.
- Pitch Mode.

### Nice to have

- Live imagery catalog search.
- Follow-up questions.
- Saved areas.
- Alerts.
- Live TLE orbit visualization.

### Do not build yet

- Full Cesium terrain.
- Complex project-management system.
- Permanent 3D dashboard globe.
- Arbitrary model-builder UI.
- Satellite tasking marketplace.
- Unrelated charts and generic KPI dashboards.

---

## 28. ACCEPTANCE CRITERIA

The implementation is complete only when:

- A first-time user understands the product from the landing page.
- A user can start with a natural-language question.
- User can choose single, temporal, or optical–SAR mode.
- User can upload and see compatibility state.
- User can inspect normal and advanced metadata.
- System displays editable interpretation chips.
- System displays an AI analysis plan before execution.
- Progress is shown as meaningful stages, not a spinner.
- Results show what, where, confidence, and why.
- Clicking an evidence item focuses the map.
- Evidence includes before/after and sensor basis where applicable.
- Audit lists task, models, versions, parameters, inputs, and outputs.
- Demo Center proves all mandatory workflows.
- Pitch Mode works with preloaded examples.
- Mobile uses a sequential experience.
- WebGL failure does not break the product.
- No generic AI-purple visual language exists.
- No technical panel overwhelms the default user.
- No claim is displayed without evidence references.

---

## 29. FINAL COMMAND

Now implement SATQUERY AI according to this specification.

Work in this order:

1. Inspect the existing repository and preserve working functionality.
2. Identify reusable components and do not unnecessarily rewrite backend or model code.
3. Create the new app shell, routes, tokens, and shared types.
4. Implement the Home and Analyze flows.
5. Implement upload, validation, interpretation, plan, and progress states.
6. Implement AnalysisShell, MapLibre map, ResultCard, and EvidenceDrawer.
7. Implement Evidence and Audit routes.
8. Implement Demo Center and Pitch Mode using fixtures.
9. Add responsive layouts and accessibility.
10. Add the landing page and lazy-loaded globe last.
11. Run the app, test all states, and fix visual/runtime errors.

When a backend endpoint is unavailable, use a typed adapter and realistic fixture—do not block the UI implementation. Keep every component production-oriented, composable, and visually consistent.

The final product must communicate this in under 30 seconds:

> SATQUERY AI lets me ask questions about remote-sensing images, automatically uses the right multimodal analysis workflow, and shows me the evidence behind the answer.

Build for simplicity at the surface and technical credibility underneath.
