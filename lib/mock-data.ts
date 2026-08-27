import type {
  AnalysisResult,
  DemoScenario,
  ExecutionEvent,
  RunEvent,
  EvidenceItem,
  EvidenceRegion,
  ReportSection,
  ModelRegistryEntry,
  InputAsset,
  AnalysisConfidence,
} from '@/types';

// ── Imagery URLs (High-res remote-sensing imagery references) ────────────────
export const IMG = {
  urban: 'https://images.pexels.com/photos/27938904/pexels-photo-27938904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  urbanT1: 'https://images.pexels.com/photos/1131863/pexels-photo-1131863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  urbanT2: 'https://images.pexels.com/photos/30387280/pexels-photo-30387280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  flood: 'https://images.pexels.com/photos/8963356/pexels-photo-8963356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  floodT1: 'https://images.pexels.com/photos/37245159/pexels-photo-37245159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  floodT2: 'https://images.pexels.com/photos/35307470/pexels-photo-35307470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  infra: 'https://images.pexels.com/photos/13275008/pexels-photo-13275008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  infraT1: 'https://images.pexels.com/photos/13105487/pexels-photo-13105487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  infraT2: 'https://images.pexels.com/photos/18778296/pexels-photo-18778296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  port: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  runway: 'https://images.pexels.com/photos/2033343/pexels-photo-2033343.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
  globePoster: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
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

function runEvents(
  runId: string,
  events: Array<[string, string, string, RunEvent['status'], string, string?, number?]>
): RunEvent[] {
  return events.map(([stepId, phase, agent, status, message, modelVersion, durationMs], idx) => ({
    runId,
    stepId,
    phase,
    agent,
    status,
    message,
    timestamp: `2026-08-27T10:${24 + Math.floor(idx * 0.4)}:${(idx * 13) % 60}Z`,
    modelVersion,
    durationMs: durationMs || 250 + idx * 80,
  }));
}

// ── Model Registry Database ─────────────────────────────────────────────────
export const modelRegistry: ModelRegistryEntry[] = [
  {
    id: 'changeformer-v2',
    name: 'ChangeFormer-RS',
    version: 'v2.1.0',
    task: 'Bi-temporal Semantic Change Detection',
    inputModality: 'Optical (B2, B3, B4, B8) + SAR (VV, VH)',
    resolution: '10m / 5m sub-sampled',
    architecture: 'Hierarchical Transformer Encoder + Cross-Attention Difference Decoder',
    weightsHash: 'sha256:4f8e29a98c763d...b12',
    dateDeployed: '2026-06-15',
    description: 'Specialized for detecting physical structure and land-cover transitions between co-registered multi-date acquisitions.',
    parameters: {
      iouThreshold: 0.65,
      minPixelCluster: 24,
      temporalNormalization: true,
      coRegistrationTolerance: '0.3px',
    },
  },
  {
    id: 'grounding-dino-rs',
    name: 'GroundingDINO-RS',
    version: 'v2.1.4',
    task: 'Open-Vocabulary Remote Sensing Object Grounding',
    inputModality: 'High-Res Optical RGB / Multispectral',
    resolution: '0.5m – 10m Ground Sample Distance',
    architecture: 'Dual-Encoder Vision-Language Transformer with Spatial Coordinate Queries',
    weightsHash: 'sha256:7c91a02e6b1298...f44',
    dateDeployed: '2026-07-02',
    description: 'Grounds natural-language visual questions directly to spatial bounding boxes and pixel polygons.',
    parameters: {
      boxThreshold: 0.38,
      textThreshold: 0.32,
      maxDetections: 32,
    },
  },
  {
    id: 'sar-coherence-unet',
    name: 'SAR-PolarCoherence',
    version: 'v1.4.2',
    task: 'Interferometric Coherence & Double-Bounce Analysis',
    inputModality: 'Sentinel-1 SLC / GRD (VV + VH polarizations)',
    resolution: '10m GSD',
    architecture: 'Complex-Valued ResUNet with Polarimetric Decomposition',
    weightsHash: 'sha256:1a82f3c78099e2...d09',
    dateDeployed: '2026-05-20',
    description: 'Detects vertical man-made structures, metallic signatures, and smooth water inundation through dense cloud cover.',
    parameters: {
      coherenceThreshold: 0.42,
      polarimetricRatio: 'VV/VH',
      speckleFilter: 'Lee Refined 5x5',
    },
  },
  {
    id: 'platt-calibrator',
    name: 'Platt-Temperature-Calibrator',
    version: 'v1.1.0',
    task: 'Multi-Modal Uncertainty & Probability Calibration',
    inputModality: 'Cross-Sensor Likelihood Logits',
    resolution: 'N/A (Statistical Post-Processor)',
    architecture: 'Vector Temperature Scaling with Cross-Sensor Agreement Penalty Matrix',
    weightsHash: 'sha256:99f0c2a51276ab...e31',
    dateDeployed: '2026-08-01',
    description: 'Ensures confidence percentages reflect true statistical probabilities, reducing overconfident hallucinations.',
    parameters: {
      temperature: 1.35,
      expectedCalibrationError: '3.7%',
      abstentionThreshold: 0.45,
    },
  },
];

// ── Scenario 1: Urban Growth (CONFIDENT) ────────────────────────────────────
export function urbanGrowthResult(): AnalysisResult {
  const regions: EvidenceRegion[] = [
    { id: 'rg-01', type: 'New structure', geometry: bbox(22, 28, 14, 16, 'R-01', 'EV-1001'), confidence: 0.94, sensors: ['OPTICAL', 'SAR'], temporal: { t1: '14 Jan 2026', t2: '22 Aug 2026' }, description: 'New multi-storey residential block; sharp rectilinear roof footprint in T2.' },
    { id: 'rg-02', type: 'New structure', geometry: bbox(44, 36, 12, 14, 'R-02', 'EV-1002'), confidence: 0.91, sensors: ['OPTICAL', 'SAR'], temporal: { t1: '14 Jan 2026', t2: '22 Aug 2026' }, description: 'Commercial building; SAR confirms intense double-bounce vertical return.' },
    { id: 'rg-03', type: 'Structural change', geometry: bbox(62, 22, 16, 18, 'R-03', 'EV-1003'), confidence: 0.89, sensors: ['OPTICAL', 'SAR'], temporal: { t1: '14 Jan 2026', t2: '22 Aug 2026' }, description: 'Transit access corridor multi-structure cluster expansion.' },
    { id: 'rg-04', type: 'Structural change', geometry: bbox(30, 58, 14, 12, 'R-04', 'EV-1004'), confidence: 0.93, sensors: ['OPTICAL', 'SAR'], temporal: { t1: '14 Jan 2026', t2: '22 Aug 2026' }, description: 'Paved industrial logistic yard and adjacent high-reflectance facility.' },
    { id: 'rg-05', type: 'New structure', geometry: bbox(70, 52, 12, 16, 'R-05', 'EV-1005'), confidence: 0.88, sensors: ['OPTICAL', 'SAR'], temporal: { t1: '14 Jan 2026', t2: '22 Aug 2026' }, description: 'Single new warehouse structure at eastern parcel boundary.' },
    { id: 'rg-06', type: 'Land-cover change', geometry: bbox(12, 48, 10, 12, 'R-06', 'EV-1006'), confidence: 0.86, sensors: ['OPTICAL'], temporal: { t1: '14 Jan 2026', t2: '22 Aug 2026' }, description: 'Bare-soil agricultural parcel converted to graded construction site.' },
  ];

  const evidence: EvidenceItem[] = regions.map((r) => ({
    id: r.geometry.evidenceId || evidenceId(),
    type: r.type,
    label: r.geometry.label,
    sensors: r.sensors,
    confidence: r.confidence > 0.9 ? 'high' : 'moderate',
    confidenceScore: r.confidence,
    temporal: r.temporal!,
    region: r.geometry,
    opticalNotes:
      r.type === 'New structure'
        ? 'Rectilinear high-reflectance roof signature present in T2; absent in T1 baseline. Cast shadow geometry confirms multi-storey height.'
        : 'Spectral NDVI drop and impervious surface reflectance shift between T1 and T2 passes.',
    sarNotes:
      r.sensors.includes('SAR')
        ? 'Strong double-bounce corner reflection (+8.4 dB over T1) at structure footprint; confirms vertical dielectric wall.'
        : 'No SAR acquisition over this specific sub-pixel boundary.',
    temporalNotes: 'Baseline recorded 14 Jan 2026; follow-up pass 22 Aug 2026 (220 days interval).',
    changeMask: true,
    imagery: { before: IMG.urbanT1, after: IMG.urbanT2, source: IMG.urban },
    location: 'Sector 22, Urban Extension Zone, Pune, India',
    limitations: ['Minor seasonal vegetation dry-off partially overlaps parcel perimeter.'],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [73.8567 + (r.geometry.x * 0.0004), 18.5204 + (r.geometry.y * 0.0004)],
          [73.8567 + ((r.geometry.x + r.geometry.width) * 0.0004), 18.5204 + (r.geometry.y * 0.0004)],
          [73.8567 + ((r.geometry.x + r.geometry.width) * 0.0004), 18.5204 + ((r.geometry.y + r.geometry.height) * 0.0004)],
          [73.8567 + (r.geometry.x * 0.0004), 18.5204 + ((r.geometry.y + r.geometry.height) * 0.0004)],
          [73.8567 + (r.geometry.x * 0.0004), 18.5204 + (r.geometry.y * 0.0004)],
        ],
      ],
    },
  }));

  const inputs: InputAsset[] = [
    {
      id: 'inp-pune-t1',
      name: 'pune_urban_2026_01_14_opt.tif',
      role: 't1',
      modality: 'optical',
      format: 'geotiff',
      thumbnailUrl: IMG.urbanT1,
      width: 4096,
      height: 4096,
      bands: 4,
      bitDepth: '16-bit unsigned int',
      acquisitionDate: '14 Jan 2026 05:42 UTC',
      crs: 'EPSG:4326 (WGS 84)',
      geotransform: '[73.8420, 0.00009, 0.0, 18.5410, 0.0, -0.00009]',
      nodataPercentage: 0.2,
      georeferencingStatus: 'georeferenced',
      registrationStatus: 'co-registered',
      bounds: [73.8420, 18.5050, 73.8788, 18.5410],
      compatibility: 'compatible',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    {
      id: 'inp-pune-t2',
      name: 'pune_urban_2026_08_22_opt.tif',
      role: 't2',
      modality: 'optical',
      format: 'geotiff',
      thumbnailUrl: IMG.urbanT2,
      width: 4096,
      height: 4096,
      bands: 4,
      bitDepth: '16-bit unsigned int',
      acquisitionDate: '22 Aug 2026 06:14 UTC',
      crs: 'EPSG:4326 (WGS 84)',
      geotransform: '[73.8420, 0.00009, 0.0, 18.5410, 0.0, -0.00009]',
      nodataPercentage: 0.4,
      georeferencingStatus: 'georeferenced',
      registrationStatus: 'co-registered',
      bounds: [73.8420, 18.5050, 73.8788, 18.5410],
      compatibility: 'compatible',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    },
    {
      id: 'inp-pune-sar',
      name: 'pune_s1_grd_2026_08_22_sar.tif',
      role: 'sar',
      modality: 'sar',
      format: 'geotiff',
      thumbnailUrl: IMG.urban,
      width: 2048,
      height: 2048,
      bands: 2,
      bitDepth: '32-bit float',
      acquisitionDate: '22 Aug 2026 12:30 UTC',
      crs: 'EPSG:4326 (WGS 84)',
      nodataPercentage: 0.0,
      georeferencingStatus: 'georeferenced',
      registrationStatus: 'co-registered',
      bounds: [73.8420, 18.5050, 73.8788, 18.5410],
      compatibility: 'compatible',
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    },
  ];

  const confidenceDetail: AnalysisConfidence = {
    value: 0.92,
    label: 'High',
    basis: [
      'Multi-temporal spectral change confirmed by ChangeFormer-RS (0.89 likelihood)',
      'Sentinel-1 SAR double-bounce radar verification confirmed across 5 of 6 clusters (0.91 likelihood)',
      'Spatial bounding boxes grounded via GroundingDINO-RS with 0.94 IoU alignment',
      'Platt temperature scaling applied (T=1.35, ECE: 3.7%)',
    ],
    uncertaintySentence: 'Confidence is high (92%) across the central corridor; slight shadow ambiguity on the northern perimeter.',
    ece: 0.037,
    temperatureScaling: 1.35,
  };

  return {
    id: 'analysis-urban-growth',
    query: 'Did construction increase between Jan and Aug? Highlight new structures.',
    answer:
      '17 probable new structures detected across candidate proposals, with 6 high-confidence structural developments verified through multi-sensor optical temporal analysis and SAR radar double-bounce corroboration.',
    verdict: 'CONFIDENT',
    confidence: 0.92,
    confidenceDetail,
    sensorAgreement: [
      { sensor: 'OPTICAL', likelihood: 0.89, label: 'Optical Spectral Change' },
      { sensor: 'SAR', likelihood: 0.91, label: 'SAR Radar Double-Bounce' },
      { sensor: 'TEMPORAL', likelihood: 0.94, label: 'Bi-Temporal Consistency' },
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
        magnitude: r.confidence > 0.9 ? 'high' : 'medium',
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
    events: runEvents('analysis-urban-growth', [
      ['step-1', 'intake', 'QueryParserAgent', 'complete', 'Parsed natural language intent: bi-temporal change query', 'v1.0', 120],
      ['step-2', 'validation', 'InputValidator', 'complete', 'Validated 2 GeoTIFF scenes; CRS EPSG:4326 matched, 0.4% nodata', 'v1.2', 210],
      ['step-3', 'planning', 'RouterAgent', 'complete', 'Selected workflow: Multi-modal Bi-Temporal Change Detection + Grounding', 'v2.0', 150],
      ['step-4', 'specialist_analysis', 'ChangeFormer-RS', 'complete', 'Computed NDCI difference heatmap and structural change mask', 'v2.1.0', 640],
      ['step-5', 'fusion', 'SAR-PolarCoherence', 'complete', 'Corroborated 5/6 candidate clusters via VV/VH double bounce (+8.4 dB)', 'v1.4.2', 480],
      ['step-6', 'grounding', 'GroundingDINO-RS', 'complete', 'Isolated and polygonized 6 high-confidence evidence regions', 'v2.1.4', 390],
      ['step-7', 'calibration', 'Platt-Temperature-Calibrator', 'complete', 'Calibrated confidence to 92% (T=1.35, ECE=3.7%)', 'v1.1.0', 180],
      ['step-8', 'synthesis', 'AnswerSynthesizer', 'complete', 'Generated grounded plain-language answer and evidence package', 'v2.4', 220],
    ]),
    taskMode: 'CHANGE',
    mode: 'temporal',
    status: 'completed',
    sensors: ['OPTICAL', 'SAR', 'TEMPORAL'],
    location: 'Pune Peri-Urban Extension Zone, Maharashtra, India',
    createdAt: '22 Aug 2026, 10:24:31 AM IST',
    sceneDescription:
      'Peri-urban corridor with northern transit access road. Predominantly agricultural parcels in T1 undergoing rapid built infrastructure development in T2.',
    inputs,
    interpretation: {
      task: 'Bi-Temporal Change Detection',
      inputs: 'T1 (Jan 14) + T2 (Aug 22) + SAR (Aug 22)',
      area: 'Pune Urban Extension (4.2 km²)',
      dates: 'Jan 14, 2026 → Aug 22, 2026',
      imagery: 'Sentinel-2 Optical (10m) + Sentinel-1 SAR GRD',
    },
    plan: {
      task: 'Change Detection & Spatial Grounding',
      inputSummary: '2 co-registered Optical rasters + 1 SAR cross-check raster',
      areaSummary: '4.2 km² bounding AOI',
      timeSummary: 'Jan 14, 2026 → Aug 22, 2026 (220 days)',
      specialistPipeline: [
        'Temporal comparison (ChangeFormer-RS)',
        'Spatial grounding (GroundingDINO-RS)',
        'Cross-sensor radar verification (SAR-PolarCoherence)',
        'Confidence calibration (Platt Scaling T=1.35)',
      ],
      description: 'I will compare the images, isolate candidate structural changes, and cross-check optical evidence with SAR double-bounce radar returns.',
    },
    areaKm2: 4.2,
    dateRange: 'Jan 14, 2026 → Aug 22, 2026',
    limitations: ['Seasonal crop harvesting introduces low-confidence soil reflectance shifts along the eastern boundary.'],
  };
}

// ── Scenario 2: Flood Impact (UNCERTAIN) ────────────────────────────────────
export function floodImpactResult(): AnalysisResult {
  const regions: EvidenceRegion[] = [
    { id: 'rg-01', type: 'Flood extent', geometry: bbox(18, 30, 20, 18, 'R-01', 'EV-2001'), confidence: 0.72, sensors: ['OPTICAL'], temporal: { t1: '12 Jun 2026', t2: '18 Aug 2026' }, description: 'Probable riverine inundation extent; partial cloud-shadow interference.' },
    { id: 'rg-02', type: 'Flood extent', geometry: bbox(52, 40, 18, 20, 'R-02', 'EV-2002'), confidence: 0.68, sensors: ['SAR'], temporal: { t1: '12 Jun 2026', t2: '18 Aug 2026' }, description: 'SAR dark-pixel cluster; smooth standing water in low-lying depression.' },
    { id: 'rg-03', type: 'Vegetation loss', geometry: bbox(40, 62, 16, 14, 'R-03', 'EV-2003'), confidence: 0.61, sensors: ['OPTICAL'], temporal: { t1: '12 Jun 2026', t2: '18 Aug 2026' }, description: 'NDVI decline; waterlogging combined with partial cloud cover.' },
  ];

  const evidence: EvidenceItem[] = regions.map((r) => ({
    id: r.geometry.evidenceId || evidenceId(),
    type: r.type,
    label: r.geometry.label,
    sensors: r.sensors,
    confidence: 'moderate',
    confidenceScore: r.confidence,
    temporal: r.temporal!,
    region: r.geometry,
    opticalNotes: 'Spectral water signature present but partially obscured by monsoon cumulus cloud-shadow in T2 pass.',
    sarNotes:
      r.sensors.includes('SAR')
        ? 'Dark-pixel cluster indicates smooth specular water reflection (-18.2 dB), but acquisition geometry differs by 6° from T1 pass.'
        : 'No SAR acquisition over this sub-region.',
    temporalNotes: 'Acquired during peak monsoon flood wave (Jun 12 → Aug 18, 2026).',
    changeMask: true,
    imagery: { before: IMG.floodT1, after: IMG.floodT2, source: IMG.flood },
    location: 'Brahmaputra Floodplain, Assam, India',
    limitations: ['Monsoon cloud cover (48%) and SAR incident angle variation degrade confidence.'],
  }));

  const confidenceDetail: AnalysisConfidence = {
    value: 0.54,
    label: 'Moderate',
    basis: [
      'Optical MNDWI water index indicates inundation across 4.1 km²',
      'SAR backscatter confirms smooth water in 2 of 3 sectors',
      'Penalty applied due to 48% cloud shadow and steep SAR pass angle',
    ],
    uncertaintySentence: 'Cloud cover along eastern reaches and radar incident angle shift limit overall system confidence to 54%.',
    ece: 0.051,
    temperatureScaling: 1.45,
  };

  return {
    id: 'analysis-flood-impact',
    query: 'Is there flood inundation in this area? Assess affected zones.',
    answer:
      'Evidence suggests probable flood inundation across 4.1 km² of low-lying parcels, but cross-sensor agreement is partial (54% calibrated confidence) due to optical cloud shadow and SAR incident pass differences.',
    verdict: 'UNCERTAIN',
    confidence: 0.54,
    confidenceDetail,
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
      ['14:10:03', 'classification', 'complete', 'Input Validator', 'Cloud contamination detected in T2 optical pass (48%)'],
      ['14:10:05', 'classification', 'complete', 'Task Classifier', 'Classified intent → FLOOD_DETECTION mode'],
      ['14:10:14', 'optical', 'complete', 'Planner & Router', 'Triggered SAR cross-sensor validation pipeline'],
      ['14:10:28', 'sar', 'complete', 'Data Preprocessor', 'Sentinel-1 GRD calibrated to Sigma-0 decibels'],
      ['14:10:45', 'fusion', 'complete', 'Change Detection', 'Water surface index change map computed'],
      ['14:11:02', 'sar', 'complete', 'SAR Fusion', 'Backscatter decrease observed, but steep incidence angle (39°)'],
      ['14:11:24', 'evidence', 'complete', 'Grounding Model', 'Isolated 3 low-lying flood inundation regions'],
      ['14:11:46', 'agreement', 'complete', 'Evidence Builder', 'Cross-sensor divergence detected (Agreement: 0.52)'],
      ['14:12:05', 'confidence', 'complete', 'Confidence Calibrator', 'Calibrated confidence penalized to 54%'],
      ['14:12:15', 'verdict', 'complete', 'Answer Synthesizer', 'Formulated uncertainty warning with diagnosed causes'],
      ['14:12:19', 'verdict', 'complete', 'Report Generator', 'Briefing generated with UNCERTAIN advisory'],
    ]),
    taskMode: 'CHANGE',
    mode: 'optical-sar',
    status: 'limited',
    sensors: ['OPTICAL', 'SAR', 'TEMPORAL'],
    location: 'Brahmaputra Floodplain, Assam, India',
    createdAt: '18 Aug 2026, 02:10:02 PM IST',
    sceneDescription:
      'River basin floodplain with mixed agricultural plots and active flood channel network during peak monsoon.',
    areaKm2: 4.1,
    dateRange: 'Jun 12, 2026 → Aug 18, 2026',
    limitations: [
      'Dense cloud shadows on the eastern bank prevent unambiguous optical validation.',
      'SAR incidence angle (39.2°) creates terrain foreshortening along embankment edges.',
    ],
  };
}

// ── Scenario 3: Infrastructure / Abstain (ABSTAIN) ──────────────────────────
export function infrastructureResult(): AnalysisResult {
  const confidenceDetail: AnalysisConfidence = {
    value: 0.28,
    label: 'Low',
    basis: [
      'Optical scene blocked by 78% heavy cloud and haze cover',
      'Sentinel-1 radar search yielded 0 co-registered orbits for timeframe',
      'Safety engine enforced abstention: Confidence 0.28 below safety bound 0.45',
    ],
    uncertaintySentence: 'System refused to guess. Insufficient sensor evidence to verify infrastructure construction.',
    ece: 0.082,
    temperatureScaling: 1.5,
  };

  return {
    id: 'analysis-infrastructure',
    query: 'Has a new industrial warehouse been constructed in this sector?',
    answer:
      'ABSTAIN: System refused to render a decision. Required SAR radar verification is unavailable for this orbit pass, and persistent 78% cloud cover prevents verifiable optical characterization.',
    verdict: 'ABSTAIN',
    confidence: 0.28,
    confidenceDetail,
    sensorAgreement: [
      { sensor: 'OPTICAL', likelihood: 0.35, label: 'Cloud Obscured' },
      { sensor: 'SAR', likelihood: 0.0, label: 'No SAR Coverage in Orbit' },
    ],
    crossSensorAgreement: 0.18,
    evidence: [],
    regions: [],
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
    mode: 'single',
    status: 'abstained',
    sensors: ['OPTICAL', 'SAR'],
    location: 'Industrial Corridor, Gujarat, India',
    createdAt: '12 Sep 2026, 09:15:00 AM IST',
    sceneDescription:
      'Industrial development corridor with planned warehouse plots currently obscured by meteorological interference.',
    limitations: [
      '78% meteorological cloud occlusion in optical spectrum.',
      'No concurrent Sentinel-1 SAR synthetic aperture radar overpass available.',
    ],
  };
}

// ── Scenario 4: Single-Image Optical VQA ────────────────────────────────────
export function singleVqaResult(): AnalysisResult {
  const regions: EvidenceRegion[] = [
    { id: 'rg-01', type: 'Grounded object', geometry: bbox(35, 42, 28, 22, 'R-01', 'EV-4001'), confidence: 0.95, sensors: ['OPTICAL'], description: 'Primary container stacking yard and gantry cranes.' },
    { id: 'rg-02', type: 'Grounded object', geometry: bbox(68, 25, 20, 30, 'R-02', 'EV-4002'), confidence: 0.92, sensors: ['OPTICAL'], description: 'Berth basin with docked commercial cargo vessel.' },
  ];

  const evidence: EvidenceItem[] = regions.map((r) => ({
    id: r.geometry.evidenceId || evidenceId(),
    type: r.type,
    label: r.geometry.label,
    sensors: r.sensors,
    confidence: 'high',
    confidenceScore: r.confidence,
    region: r.geometry,
    opticalNotes: 'High-resolution RGB texture clearly differentiates container stacks from asphalt tarmac.',
    temporalNotes: 'Single optical observation pass.',
    imagery: { source: IMG.port },
    location: 'Jawaharlal Nehru Port Trust (JNPT), Navi Mumbai, India',
    geometry: {
      type: 'Polygon',
      coordinates: [[[72.95, 18.95], [72.97, 18.95], [72.97, 18.97], [72.95, 18.97], [72.95, 18.95]]],
    },
  }));

  return {
    id: 'analysis-single-vqa',
    query: 'Describe the dominant land-use and identify major transport assets.',
    answer:
      'The scene is characterized as deep-water maritime port infrastructure featuring dense intermodal container storage yards and active vessel berthing facilities.',
    verdict: 'CONFIDENT',
    confidence: 0.95,
    confidenceDetail: {
      value: 0.95,
      label: 'High',
      basis: [
        'Single-image optical VQA encoder verified land-cover taxonomy',
        'Spatial grounding grounded container yard and berth vessel with 0.95 IoU',
      ],
    },
    sensorAgreement: [{ sensor: 'OPTICAL', likelihood: 0.95, label: 'Optical VQA Confidence' }],
    crossSensorAgreement: 0.95,
    evidence,
    regions,
    temporalComparison: {
      t1: { label: 'T1', date: '20 Aug 2026', imagery: IMG.port, sensor: 'OPTICAL' },
      t2: { label: 'T2', date: '20 Aug 2026', imagery: IMG.port, sensor: 'OPTICAL' },
      changes: [],
    },
    executionTrace: trace([
      ['11:00:00', 'validation', 'complete', 'Query Parser', 'Parsed maritime port VQA query'],
      ['11:00:02', 'classification', 'complete', 'Task Classifier', 'Classified intent → SINGLE_IMAGE_VQA'],
      ['11:00:10', 'optical', 'complete', 'VQA Specialist', 'Extracted multi-scale visual tokens and taxonomy'],
      ['11:00:18', 'evidence', 'complete', 'Grounding Model', 'Bound spatial terms to container yards and berthed vessels'],
      ['11:00:25', 'verdict', 'complete', 'Answer Synthesizer', 'Synthesized grounded answer'],
    ]),
    taskMode: 'VQA',
    mode: 'single',
    status: 'completed',
    sensors: ['OPTICAL'],
    location: 'JNPT Maritime Port Terminal, Navi Mumbai, India',
    createdAt: '20 Aug 2026, 11:00:00 AM IST',
    sceneDescription: 'High-density deepwater container terminal with active berths, gantry cranes, and logistics yards.',
    areaKm2: 3.8,
  };
}

// ── Demo Scenarios List ─────────────────────────────────────────────────────
export const demoScenarios: DemoScenario[] = [
  {
    id: 'urban-growth',
    title: 'Bi-Temporal Change Detection',
    subtitle: 'Urban & Infrastructure Monitoring',
    description: 'Bi-temporal structural change detection across seasonal optical and radar baselines near Pune.',
    location: 'Pune Urban Extension, Maharashtra, India',
    taskMode: 'CHANGE',
    mode: 'temporal',
    sensors: ['OPTICAL', 'SAR'],
    coordinates: { lat: 18.5204, lng: 73.8567 },
    query: 'Did construction increase between Jan and Aug? Highlight new structures.',
    mapImagery: IMG.urban,
    result: urbanGrowthResult(),
    expectedOutputs: {
      finding: '17 candidate / 6 high-confidence verified new structures detected',
      confidence: '92% (High)',
      evidenceCount: 6,
      models: ['ChangeFormer-RS v2.1', 'GroundingDINO-RS v2.1', 'SAR-PolarCoherence v1.4'],
    },
  },
  {
    id: 'flood-impact',
    title: 'Optical–SAR Fusion Analysis',
    subtitle: 'Monsoon Flood Inundation Assessment',
    description: 'Cross-checking flood inundation extent through monsoon cloud cover using radar backscatter.',
    location: 'Brahmaputra Floodplain, Assam, India',
    taskMode: 'FUSION',
    mode: 'optical-sar',
    sensors: ['OPTICAL', 'SAR'],
    coordinates: { lat: 26.2006, lng: 92.9376 },
    query: 'Is there flood inundation in this area? Assess affected zones.',
    mapImagery: IMG.flood,
    result: floodImpactResult(),
    expectedOutputs: {
      finding: 'Probable inundation across 4.1 km² with diagnosed cloud limitation',
      confidence: '54% (Moderate)',
      evidenceCount: 3,
      models: ['SAR-PolarCoherence v1.4', 'Optical-MNDWI-RS', 'Platt-Calibrator'],
    },
  },
  {
    id: 'single-vqa',
    title: 'Single-Image Optical VQA',
    subtitle: 'Port & Maritime Asset Grounding',
    description: 'Natural-language questioning and object grounding over high-resolution optical imagery.',
    location: 'JNPT Maritime Port Terminal, Navi Mumbai, India',
    taskMode: 'VQA',
    mode: 'single',
    sensors: ['OPTICAL'],
    coordinates: { lat: 18.9500, lng: 72.9500 },
    query: 'Describe the dominant land-use and identify major transport assets.',
    mapImagery: IMG.port,
    result: singleVqaResult(),
    expectedOutputs: {
      finding: 'Intermodal maritime port terminal with container yards & berthed vessels',
      confidence: '95% (High)',
      evidenceCount: 2,
      models: ['GroundingDINO-RS v2.1', 'RemoteCLIP-VQA-v1.8'],
    },
  },
  {
    id: 'infrastructure',
    title: 'Safety Abstention on Missing Evidence',
    subtitle: 'Uncertainty Refusal Engine',
    description: 'System refuses to guess when optical clouds prevent visibility and SAR coverage is unavailable.',
    location: 'Industrial Corridor, Gujarat, India',
    taskMode: 'VQA',
    mode: 'single',
    sensors: ['OPTICAL', 'SAR'],
    coordinates: { lat: 22.5937, lng: 72.8629 },
    query: 'Has a new industrial warehouse been constructed in this sector?',
    mapImagery: IMG.infra,
    result: infrastructureResult(),
    expectedOutputs: {
      finding: 'ABSTAIN: Automated safety refusal triggered due to lack of verifiable evidence',
      confidence: '28% (Low)',
      evidenceCount: 0,
      models: ['InputValidator', 'Platt-Temperature-Calibrator'],
    },
  },
];

export function findScenario(id: string): DemoScenario | undefined {
  if (id === 'analysis-urban-growth' || id === 'urban-growth') return demoScenarios[0];
  if (id === 'analysis-flood-impact' || id === 'flood-impact') return demoScenarios[1];
  if (id === 'analysis-single-vqa' || id === 'single-vqa') return demoScenarios[2];
  if (id === 'analysis-infrastructure' || id === 'infrastructure') return demoScenarios[3];
  return demoScenarios.find((s) => s.id === id || s.result.id === id);
}

export function resolveScenarioFromQuery(query: string, scenarioId?: string): DemoScenario {
  if (scenarioId) {
    const matched = findScenario(scenarioId);
    if (matched) return matched;
  }
  const q = query.toLowerCase();
  if (q.includes('flood') || q.includes('water') || q.includes('inundat') || q.includes('assam')) {
    return demoScenarios[1];
  }
  if (q.includes('port') || q.includes('vessel') || q.includes('ship') || q.includes('dock')) {
    return demoScenarios[2];
  }
  if (q.includes('warehouse') || q.includes('abstain') || q.includes('factory') || q.includes('cloud')) {
    return demoScenarios[3];
  }
  return demoScenarios[0];
}

export function buildReport(analysis: AnalysisResult): ReportSection[] {
  return [
    {
      number: '01',
      title: 'Executive Session & Metadata',
      items: [
        { label: 'Session ID', value: analysis.id, type: 'mono' },
        { label: 'Target AOI / Location', value: analysis.location, type: 'text' },
        { label: 'Task Mode', value: analysis.taskMode, type: 'mono' },
        { label: 'Active Sensors', value: analysis.sensors.join(', '), type: 'mono' },
        { label: 'Natural Language Query', value: analysis.query, type: 'text' },
        { label: 'Observation Extent', value: `${analysis.areaKm2 || 4.2} km²`, type: 'mono' },
      ],
    },
    {
      number: '02',
      title: 'Primary AI Finding & Synthesis',
      items: [
        { label: 'Decision Verdict', value: `${analysis.verdict} (${Math.round(analysis.confidence * 100)}%)`, type: 'mono' },
        { label: 'Synthesis Statement', value: analysis.answer, type: 'text' },
        { label: 'Observation Range', value: analysis.dateRange || 'Current baseline', type: 'text' },
      ],
    },
    {
      number: '03',
      title: 'Spatial Evidence Grounding',
      items: [
        { label: 'Verified Evidence Items', value: `${analysis.evidence.length} items grounded`, type: 'mono' },
        { label: 'Candidate Proposers', value: `${analysis.regions.length} bounding coordinates`, type: 'mono' },
      ],
    },
    {
      number: '04',
      title: 'Calibrated Confidence & Sensor Agreement',
      items: [
        { label: 'Calibrated Confidence', value: `${Math.round(analysis.confidence * 100)}%`, type: 'mono' },
        { label: 'Cross-Sensor Consensus', value: `${(analysis.crossSensorAgreement * 100).toFixed(0)}%`, type: 'mono' },
        { label: 'Temperature Scale (T)', value: '1.35', type: 'mono' },
      ],
    },
    {
      number: '05',
      title: 'Observable Execution Audit',
      items: [
        { label: 'Logged Pipeline Steps', value: `${analysis.executionTrace.length} events`, type: 'mono' },
        { label: 'Primary Specialist Models', value: 'ChangeFormer-RS v2.1, GroundingDINO-RS v2.1, SAR-PolarCoherence v1.4', type: 'mono' },
      ],
    },
    {
      number: '06',
      title: 'Reproducibility & Integrity Seal',
      items: [
        { label: 'Scene Description', value: analysis.sceneDescription, type: 'text' },
        { label: 'Cryptographic Hash', value: 'SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', type: 'mono' },
        { label: 'Compliance', value: 'Audited & Reproducible Decision Package', type: 'text' },
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

export const sampleAssets: InputAsset[] = [
  {
    id: 'asset-s2-t1',
    name: 'S2A_MSIL2A_20260114_T43QEA.tif',
    role: 't1',
    modality: 'optical',
    format: 'geotiff',
    thumbnailUrl: IMG.urbanT1,
    width: 4096,
    height: 4096,
    bands: 4,
    bitDepth: '16-bit Unsigned',
    acquisitionDate: '14 Jan 2026',
    crs: 'EPSG:4326 (WGS 84)',
    geotransform: '18.5204, 0.0001, 0, 73.8567, 0, -0.0001',
    nodataPercentage: 0.2,
    georeferencingStatus: 'georeferenced',
    registrationStatus: 'co-registered',
    compatibility: 'compatible',
    sha256: 'a1b2c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef01',
  },
  {
    id: 'asset-s2-t2',
    name: 'S2B_MSIL2A_20260822_T43QEA.tif',
    role: 't2',
    modality: 'optical',
    format: 'geotiff',
    thumbnailUrl: IMG.urbanT2,
    width: 4096,
    height: 4096,
    bands: 4,
    bitDepth: '16-bit Unsigned',
    acquisitionDate: '22 Aug 2026',
    crs: 'EPSG:4326 (WGS 84)',
    geotransform: '18.5204, 0.0001, 0, 73.8567, 0, -0.0001',
    nodataPercentage: 0.1,
    georeferencingStatus: 'georeferenced',
    registrationStatus: 'co-registered',
    compatibility: 'compatible',
    sha256: 'b2c3d4e5f6a1789012345678abcdef0123456789abcdef0123456789abcdef02',
  },
];
