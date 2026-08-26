import type {
  AnalysisResult,
  DemoScenario,
  ExecutionEvent,
  EvidenceItem,
  EvidenceRegion,
  ReportSection,
} from '@/types';

// ── Imagery (Pexels, used as satellite-imagery placeholders) ────────────────
const IMG = {
  urban: 'https://images.pexels.com/photos/27938904/pexels-photo-27938904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  urbanT1: 'https://images.pexels.com/photos/1131863/pexels-photo-1131863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  urbanT2: 'https://images.pexels.com/photos/30387280/pexels-photo-30387280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  flood: 'https://images.pexels.com/photos/8963356/pexels-photo-8963356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  floodT1: 'https://images.pexels.com/photos/37245159/pexels-photo-37245159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  floodT2: 'https://images.pexels.com/photos/35307470/pexels-photo-35307470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  infra: 'https://images.pexels.com/photos/13275008/pexels-photo-13275008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  infraT1: 'https://images.pexels.com/photos/13105487/pexels-photo-13105487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  infraT2: 'https://images.pexels.com/photos/18778296/pexels-photo-18778296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
};

// ── Helpers ─────────────────────────────────────────────────────────────────
let evCounter = 0;
function evidenceId(): string {
  evCounter += 1;
  return `EV-${String(1000 + evCounter).padStart(4, '0')}`;
}

function bbox(
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  eid?: string,
) {
  return {
    id: `bb-${Math.random().toString(36).slice(2, 8)}`,
    x,
    y,
    width: w,
    height: h,
    label,
    evidenceId: eid,
  };
}

function trace(
  events: Array<[string, ExecutionEvent['type'], ExecutionEvent['status'], string, string?]>,
): ExecutionEvent[] {
  return events.map(([timestamp, type, status, label, details], i) => ({
    id: `evt-${i}`,
    timestamp,
    type,
    status,
    label,
    metadata: details ? { details } : undefined,
  }));
}

// ── Scenario 1: Urban Growth (CONFIDENT) ────────────────────────────────────
function urbanGrowthResult(): AnalysisResult {
  const regions: EvidenceRegion[] = [
    { id: 'rg-01', type: 'New structure', geometry: bbox(22, 28, 14, 16, 'R-01', 'EV-1001'), confidence: 0.94, sensors: ['OPTICAL', 'SAR'], temporal: { t1: '14 Jan 2026', t2: '22 Aug 2026' }, description: 'New residential block with roof structure visible in T2 optical.' },
    { id: 'rg-02', type: 'New structure', geometry: bbox(44, 36, 12, 14, 'R-02', 'EV-1002'), confidence: 0.91, sensors: ['OPTICAL', 'SAR'], temporal: { t1: '14 Jan 2026', t2: '22 Aug 2026' }, description: 'Commercial building; SAR confirms double-bounce vertical return.' },
    { id: 'rg-03', type: 'Structural change', geometry: bbox(62, 22, 16, 18, 'R-03', 'EV-1003'), confidence: 0.89, sensors: ['OPTICAL', 'SAR'], temporal: { t1: '14 Jan 2026', t2: '22 Aug 2026' }, description: 'Multi-structure cluster expansion along northern transit access road.' },
    { id: 'rg-04', type: 'Structural change', geometry: bbox(30, 58, 14, 12, 'R-04', 'EV-1004'), confidence: 0.93, sensors: ['OPTICAL', 'SAR'], temporal: { t1: '14 Jan 2026', t2: '22 Aug 2026' }, description: 'Paved industrial yard and adjacent facility; strong SAR return.' },
    { id: 'rg-05', type: 'New structure', geometry: bbox(70, 52, 12, 16, 'R-05', 'EV-1005'), confidence: 0.88, sensors: ['OPTICAL', 'SAR'], temporal: { t1: '14 Jan 2026', t2: '22 Aug 2026' }, description: 'Single new structure at parcel boundary.' },
    { id: 'rg-06', type: 'Land-cover change', geometry: bbox(12, 48, 10, 12, 'R-06', 'EV-1006'), confidence: 0.86, sensors: ['OPTICAL'], temporal: { t1: '14 Jan 2026', t2: '22 Aug 2026' }, description: 'Bare-soil to built-up impervious transition zone.' },
  ];

  const evidence: EvidenceItem[] = regions.map((r) => ({
    id: r.geometry.evidenceId || evidenceId(),
    type: r.type,
    sensors: r.sensors,
    confidence: r.confidence,
    temporal: r.temporal!,
    region: r.geometry,
    opticalNotes:
      r.type === 'New structure'
        ? 'Rectilinear roof signature present in T2; absent in T1. Shadow geometry consistent with multi-storey structure.'
        : 'Spectral shift from bare soil/fallow to built-surface reflectance between T1 and T2.',
    sarNotes:
      r.sensors.includes('SAR')
        ? 'Strong double-bounce return at structure footprint in T2; T1 shows diffuse surface return only.'
        : 'No SAR acquisition over this region for requested period.',
    changeMask: true,
    imagery: { before: IMG.urbanT1, after: IMG.urbanT2 },
    location: 'Sector 22, Urban Extension Zone, India',
  }));

  return {
    id: 'analysis-urban-growth',
    query: 'What changed in this area between January and August? Highlight new structures.',
    answer:
      '17 probable new structures detected across candidate proposals, with 6 high-confidence structures independently grounded and verified via multi-sensor Sentinel-2 optical and Sentinel-1 SAR double-bounce corroboration.',
    verdict: 'CONFIDENT',
    confidence: 0.92,
    sensorAgreement: [
      { sensor: 'OPTICAL', likelihood: 0.89, label: 'Optical Change Likelihood' },
      { sensor: 'SAR', likelihood: 0.91, label: 'SAR Double-Bounce Return' },
    ],
    crossSensorAgreement: 0.88,
    evidence,
    regions,
    temporalComparison: {
      t1: { label: 'T1', date: '14 Jan 2026', imagery: IMG.urbanT1, sensor: 'OPTICAL' },
      t2: { label: 'T2', date: '22 Aug 2026', imagery: IMG.urbanT2, sensor: 'OPTICAL' },
      changes: regions.map((r) => ({
        id: r.id,
        label: r.description,
        region: r.geometry,
        magnitude: r.confidence > 0.9 ? 'high' : r.confidence > 0.85 ? 'medium' : 'low',
      })),
    },
    executionTrace: trace([
      ['10:24:31', 'validation', 'complete', 'Query Parser', 'Parsed natural language intent and spatial parameters'],
      ['10:24:32', 'classification', 'complete', 'Input Validator', 'Cloud coverage < 1%, EPSG:4326 geometry validated'],
      ['10:24:34', 'classification', 'complete', 'Task Classifier', 'Classified intent → CHANGE + GROUNDING mode'],
      ['10:24:42', 'optical', 'complete', 'Planner & Router', 'Multi-modal optical + SAR routing pipeline selected'],
      ['10:24:55', 'sar', 'complete', 'Data Preprocessor', 'Sentinel-2 & Sentinel-1 COG tiles orthorectified (10m)'],
      ['10:25:12', 'fusion', 'complete', 'Change Detection', 'ChangeFormer bi-temporal NDCI heatmap generated'],
      ['10:25:28', 'sar', 'complete', 'SAR Fusion', 'Interferometric coherence & backscatter cross-check'],
      ['10:25:49', 'evidence', 'complete', 'Grounding Model', 'GroundingDINO isolated 17 candidate / 6 verified regions'],
      ['10:26:08', 'agreement', 'complete', 'Evidence Builder', 'Multi-sensor consensus matrix compiled (Agreement: 0.88)'],
      ['10:26:22', 'confidence', 'complete', 'Confidence Calibrator', 'Platt temperature scaling applied (T=1.35, ECE: 3.7%)'],
      ['10:26:35', 'verdict', 'complete', 'Answer Synthesizer', 'Natural language response verified against grounded evidence'],
      ['10:26:48', 'verdict', 'complete', 'Report Generator', '6-page intelligence briefing compiled and signed'],
    ]),
    taskMode: 'CHANGE',
    sensors: ['OPTICAL', 'SAR', 'TEMPORAL'],
    location: 'Urban Extension Zone, India',
    createdAt: '19 May 2025, 10:24:31 AM IST',
    sceneDescription:
      'Peri-urban corridor with northern transit access road. Predominantly agricultural parcels in T1 undergoing rapid built infrastructure development in T2.',
  };
}

// ── Scenario 2: Flood Impact (UNCERTAIN) ────────────────────────────────────
function floodImpactResult(): AnalysisResult {
  const regions: EvidenceRegion[] = [
    { id: 'rg-01', type: 'Flood extent', geometry: bbox(18, 30, 20, 18, 'R-01', 'EV-2001'), confidence: 0.72, sensors: ['OPTICAL'], temporal: { t1: '12 Jun 2026', t2: '18 Aug 2026' }, description: 'Probable inundation extent; cloud-shadow interference detected.' },
    { id: 'rg-02', type: 'Flood extent', geometry: bbox(52, 40, 18, 20, 'R-02', 'EV-2002'), confidence: 0.68, sensors: ['SAR'], temporal: { t1: '12 Jun 2026', t2: '18 Aug 2026' }, description: 'SAR dark-pixel cluster; low-lying terrain.' },
    { id: 'rg-03', type: 'Vegetation loss', geometry: bbox(40, 62, 16, 14, 'R-03', 'EV-2003'), confidence: 0.61, sensors: ['OPTICAL'], temporal: { t1: '12 Jun 2026', t2: '18 Aug 2026' }, description: 'NDVI decline; possible waterlogging or cloud cover.' },
  ];

  const evidence: EvidenceItem[] = regions.map((r) => ({
    id: r.geometry.evidenceId || evidenceId(),
    type: r.type,
    sensors: r.sensors,
    confidence: r.confidence,
    temporal: r.temporal!,
    region: r.geometry,
    opticalNotes:
      'Spectral water signature present but partially obscured by monsoon cloud-shadow in T2.',
    sarNotes:
      r.sensors.includes('SAR')
        ? 'Dark-pixel cluster suggests smooth water surface, but acquisition geometry differs between T1 and T2 passes.'
        : 'No SAR acquisition over this region for requested period.',
    changeMask: true,
    imagery: { before: IMG.floodT1, after: IMG.floodT2 },
    location: 'Brahmaputra Floodplain, Assam, India',
  }));

  return {
    id: 'analysis-flood-impact',
    query: 'Is there flood inundation in this area? Assess affected zones.',
    answer:
      'Evidence suggests probable flood inundation across 4.1 km² of low-lying parcels, but cross-sensor agreement is partial (54% calibrated confidence) due to optical cloud shadow and SAR pass angle differences.',
    verdict: 'UNCERTAIN',
    confidence: 0.54,
    sensorAgreement: [
      { sensor: 'OPTICAL', likelihood: 0.89, label: 'Optical Inundation Signal' },
      { sensor: 'SAR', likelihood: 0.54, label: 'SAR Water Backscatter' },
    ],
    crossSensorAgreement: 0.52,
    evidence,
    regions,
    temporalComparison: {
      t1: { label: 'T1', date: '12 Jun 2026', imagery: IMG.floodT1, sensor: 'OPTICAL' },
      t2: { label: 'T2', date: '18 Aug 2026', imagery: IMG.floodT2, sensor: 'OPTICAL' },
      changes: regions.map((r) => ({
        id: r.id,
        label: r.description,
        region: r.geometry,
        magnitude: 'medium',
      })),
    },
    executionTrace: trace([
      ['14:10:02', 'validation', 'complete', 'Query Parser', 'Parsed flood inundation query'],
      ['14:10:03', 'classification', 'complete', 'Input Validator', 'Cloud contamination detected in T2 optical pass'],
      ['14:10:05', 'classification', 'complete', 'Task Classifier', 'Classified intent → FLOOD_DETECTION mode'],
      ['14:10:14', 'optical', 'complete', 'Planner & Router', 'Triggered SAR cross-sensor validation pipeline'],
      ['14:10:28', 'sar', 'complete', 'Data Preprocessor', 'Sentinel-1 GRD calibrated to Sigma-0 decibels'],
      ['14:10:45', 'fusion', 'complete', 'Change Detection', 'Water surface index change map computed'],
      ['14:11:02', 'sar', 'complete', 'SAR Fusion', 'Backscatter decrease observed, but steep incidence angle'],
      ['14:11:24', 'evidence', 'complete', 'Grounding Model', 'Isolated 3 low-lying flood inundation regions'],
      ['14:11:46', 'agreement', 'complete', 'Evidence Builder', 'Cross-sensor divergence detected (Agreement: 0.52)'],
      ['14:12:05', 'confidence', 'complete', 'Confidence Calibrator', 'Calibrated confidence penalized to 54%'],
      ['14:12:15', 'verdict', 'complete', 'Answer Synthesizer', 'Formulated uncertainty warning with diagnosed causes'],
      ['14:12:19', 'verdict', 'complete', 'Report Generator', 'Briefing generated with UNCERTAIN advisory'],
    ]),
    taskMode: 'CHANGE',
    sensors: ['OPTICAL', 'SAR', 'TEMPORAL'],
    location: 'Brahmaputra Floodplain, Assam, India',
    createdAt: '18 Aug 2026, 02:10:02 PM IST',
    sceneDescription:
      'River basin floodplain with mixed agricultural plots and active flood channel network during peak monsoon.',
  };
}

// ── Scenario 3: Infrastructure / Abstain ────────────────────────────────────
function infrastructureResult(): AnalysisResult {
  const regions: EvidenceRegion[] = [];
  const evidence: EvidenceItem[] = [];

  return {
    id: 'analysis-infrastructure',
    query: 'Has a new industrial warehouse been constructed in this sector?',
    answer:
      'ABSTAIN: System refused to render a decision. Required SAR radar verification is unavailable for this orbit pass, and persistent 78% cloud cover prevents verifiable optical characterization.',
    verdict: 'ABSTAIN',
    confidence: 0.28,
    sensorAgreement: [
      { sensor: 'OPTICAL', likelihood: 0.35, label: 'Cloud Obscured' },
      { sensor: 'SAR', likelihood: 0.0, label: 'No SAR Coverage in Orbit' },
    ],
    crossSensorAgreement: 0.18,
    evidence,
    regions,
    temporalComparison: {
      t1: { label: 'T1', date: '05 Mar 2026', imagery: IMG.infraT1, sensor: 'OPTICAL' },
      t2: { label: 'T2', date: '12 Sep 2026', imagery: IMG.infraT2, sensor: 'OPTICAL' },
      changes: [],
    },
    executionTrace: trace([
      ['09:15:00', 'validation', 'complete', 'Query Parser', 'Parsed warehouse infrastructure query'],
      ['09:15:01', 'classification', 'complete', 'Input Validator', 'High cloud cover (>70%) flagged in AOI'],
      ['09:15:03', 'classification', 'complete', 'Task Classifier', 'Classified intent → INFRASTRUCTURE_VERIFICATION'],
      ['09:15:10', 'optical', 'complete', 'Planner & Router', 'Attempted fallback to SAR radar pass'],
      ['09:15:18', 'sar', 'complete', 'Data Preprocessor', 'Sentinel-1 query returned 0 valid orbits for period'],
      ['09:15:26', 'fusion', 'error', 'Change Detection', 'Optical change mask confidence below safety bound (0.35)'],
      ['09:15:32', 'agreement', 'error', 'Evidence Builder', 'Cross-sensor convergence failed (0.18 < 0.70 threshold)'],
      ['09:15:40', 'confidence', 'complete', 'Confidence Calibrator', 'Score penalized below abstention cutoff (0.28)'],
      ['09:15:45', 'verdict', 'complete', 'Answer Synthesizer', 'Automated safety refusal triggered: Refused to guess'],
      ['09:15:52', 'verdict', 'complete', 'Report Generator', 'Generated refusal explanation and corrective sensor advice'],
    ]),
    taskMode: 'VQA',
    sensors: ['OPTICAL', 'SAR'],
    location: 'Industrial Corridor, Gujarat, India',
    createdAt: '12 Sep 2026, 09:15:00 AM IST',
    sceneDescription:
      'Industrial development corridor with planned warehouse plots currently obscured by meteorological interference.',
  };
}

export const demoScenarios: DemoScenario[] = [
  {
    id: 'urban-growth',
    title: 'Urban Growth Detection',
    description: 'Bi-temporal structural change detection in a peri-urban development corridor.',
    location: 'Urban Extension Zone, India',
    taskMode: 'CHANGE',
    sensors: ['OPTICAL', 'SAR'],
    coordinates: { lat: 28.4595, lng: 77.0266 },
    query: 'What changed in this area between January and August? Highlight new structures.',
    mapImagery: IMG.urban,
    result: urbanGrowthResult(),
  },
  {
    id: 'flood-impact',
    title: 'Monsoon Flood Inundation',
    description: 'Assessing riverine inundation extent under cloud cover with SAR cross-checks.',
    location: 'Brahmaputra Floodplain, Assam, India',
    taskMode: 'CHANGE',
    sensors: ['OPTICAL', 'SAR'],
    coordinates: { lat: 26.2006, lng: 92.9376 },
    query: 'Is there flood inundation in this area? Assess affected zones.',
    mapImagery: IMG.flood,
    result: floodImpactResult(),
  },
  {
    id: 'infrastructure',
    title: 'Industrial Infrastructure',
    description: 'Verifying warehouse construction where sensor occlusion triggers safety abstention.',
    location: 'Industrial Corridor, Gujarat, India',
    taskMode: 'VQA',
    sensors: ['OPTICAL', 'SAR'],
    coordinates: { lat: 22.5937, lng: 72.8629 },
    query: 'Has a new industrial warehouse been constructed in this sector?',
    mapImagery: IMG.infra,
    result: infrastructureResult(),
  },
];

export function findScenario(id: string): DemoScenario | undefined {
  if (id === 'analysis-urban-growth' || id === 'urban-growth') return demoScenarios[0];
  if (id === 'analysis-flood-impact' || id === 'flood-impact') return demoScenarios[1];
  if (id === 'analysis-infrastructure' || id === 'infrastructure') return demoScenarios[2];
  return demoScenarios.find((s) => s.id === id || s.result.id === id);
}

export function resolveScenarioFromQuery(query: string, scenarioId?: string): DemoScenario {
  if (scenarioId) {
    const matched = findScenario(scenarioId);
    if (matched) return matched;
  }
  const q = query.toLowerCase();
  if (q.includes('flood') || q.includes('water') || q.includes('inundat')) {
    return demoScenarios[1];
  }
  if (q.includes('warehouse') || q.includes('abstain') || q.includes('factory')) {
    return demoScenarios[2];
  }
  return demoScenarios[0];
}

export function buildReport(analysis: AnalysisResult): ReportSection[] {
  return [
    {
      number: '01',
      title: 'Input & Session Summary',
      items: [
        { label: 'Session ID', value: analysis.id, type: 'mono' },
        { label: 'Location / AOI', value: analysis.location, type: 'text' },
        { label: 'Task Mode', value: analysis.taskMode, type: 'mono' },
        { label: 'Sensors', value: analysis.sensors.join(', '), type: 'mono' },
        { label: 'Query', value: analysis.query, type: 'text' },
      ],
    },
    {
      number: '02',
      title: 'Primary AI Output',
      items: [
        { label: 'Verdict', value: `${analysis.verdict} (${Math.round(analysis.confidence * 100)}%)`, type: 'mono' },
        { label: 'Answer Synthesis', value: analysis.answer, type: 'text' },
      ],
    },
    {
      number: '03',
      title: 'Visual Evidence & Grounding',
      items: [
        { label: 'Evidence Items', value: `${analysis.evidence.length} items`, type: 'mono' },
        { label: 'Grounded Regions', value: `${analysis.regions.length} bounding boxes`, type: 'mono' },
      ],
    },
    {
      number: '04',
      title: 'Calibrated Confidence Score',
      items: [
        { label: 'Calibrated Confidence', value: `${Math.round(analysis.confidence * 100)}%`, type: 'mono' },
        { label: 'Cross-Sensor Agreement', value: `${(analysis.crossSensorAgreement * 100).toFixed(0)}%`, type: 'mono' },
      ],
    },
    {
      number: '05',
      title: 'Observable Execution Trace',
      items: [
        { label: 'Logged Steps', value: `${analysis.executionTrace.length} pipeline events`, type: 'mono' },
      ],
    },
    {
      number: '06',
      title: 'Appendix & Metadata',
      items: [
        { label: 'Scene Description', value: analysis.sceneDescription, type: 'text' },
        { label: 'Integrity Seal', value: 'SHA-256 Verified', type: 'mono' },
      ],
    },
  ];
}

export const loadingSteps = [
  { key: 'validation', label: 'Validating Query & CRS Bounds' },
  { key: 'classification', label: 'Classifying Analysis Intent & Task Mode' },
  { key: 'optical', label: 'Executing Optical Spectral Change Model' },
  { key: 'sar', label: 'Processing SAR Coherence & Double-Bounce Returns' },
  { key: 'fusion', label: 'Cross-Sensor Evidence Fusion & Spatial Grounding' },
  { key: 'confidence', label: 'Calibrating Multi-Modal Confidence' },
];
