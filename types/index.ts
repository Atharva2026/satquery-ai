// ── SatQuery AI Domain Types & Contracts ──────────────────────────────────────────────

export type Verdict = 'CONFIDENT' | 'UNCERTAIN' | 'ABSTAIN';

export type AnalysisMode = 'single' | 'temporal' | 'optical-sar';

export type AnalysisStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'uncertain'
  | 'abstain'
  | 'error';

export type Modality = 'optical' | 'multispectral' | 'sar' | 'unknown';

export type RunStatus =
  | 'draft'
  | 'validating'
  | 'planned'
  | 'running'
  | 'completed'
  | 'limited'
  | 'clarification'
  | 'failed'
  | 'abstained';

export type TaskMode = 'VQA' | 'CHANGE' | 'GROUND' | 'COMPARE' | 'FUSION';

export type SensorType = 'OPTICAL' | 'SAR' | 'TEMPORAL' | 'MULTISPECTRAL';

export type LayerKey = 'OPTICAL' | 'SAR' | 'CHANGE' | 'GROUNDING' | 'EVIDENCE' | 'AGREEMENT';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  id: string;
  /** Normalised 0–100 percentages relative to map container */
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  evidenceId?: string;
}

export type EvidenceType =
  | 'Structural change'
  | 'New structure'
  | 'Land-cover change'
  | 'Flood extent'
  | 'Vegetation loss'
  | 'Grounded object'
  | 'Infrastructure development';

export interface TemporalLabel {
  t1: string;
  t2: string;
}

export interface SensorReading {
  sensor: SensorType;
  /** 0–1 likelihood */
  likelihood: number;
  label: string;
}

export interface InputAsset {
  id: string;
  name: string;
  role: 'single' | 't1' | 't2' | 'optical' | 'sar';
  modality: Modality;
  format: 'geotiff' | 'tiff' | 'png' | 'jpeg';
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  bands?: number;
  bitDepth?: string;
  acquisitionDate?: string;
  crs?: string;
  geotransform?: string;
  nodataPercentage?: number;
  georeferencingStatus?: 'georeferenced' | 'pixel_grid' | 'approximate';
  registrationStatus?: 'co-registered' | 'unregistered' | 'not_applicable';
  bounds?: [number, number, number, number];
  compatibility: 'compatible' | 'warning' | 'unsupported' | 'checking';
  warnings?: string[];
  sha256?: string;
}

export interface Interpretation {
  task: string;
  inputs: string;
  area?: string;
  dates?: string;
  time?: string;
  imagery?: string;
  missing?: string[];
}

export interface AnalysisPlanSpecialist {
  id: string;
  name: string;
  role: string;
  purpose: string;
}

export interface AnalysisPlan {
  task?: string;
  summary?: string;
  inputSummary?: string;
  areaSummary?: string;
  timeSummary?: string;
  specialistPipeline?: string[];
  specialists?: AnalysisPlanSpecialist[];
  description?: string;
  estimatedDuration?: string;
}

export interface RunEvent {
  runId: string;
  stepId: string;
  phase: string;
  agent?: string;
  status: 'queued' | 'active' | 'complete' | 'warning' | 'failed';
  message: string;
  timestamp: string;
  artifactIds?: string[];
  modelVersion?: string;
  durationMs?: number;
}

// Backwards compatibility for existing components
export interface ExecutionEvent {
  id: string;
  timestamp: string;
  type:
    | 'validation'
    | 'classification'
    | 'optical'
    | 'sar'
    | 'fusion'
    | 'evidence'
    | 'agreement'
    | 'confidence'
    | 'verdict';
  status: 'complete' | 'running' | 'pending' | 'error';
  label: string;
  metadata?: Record<string, string>;
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  label?: string;
  sensors: SensorType[];
  confidence: number | 'high' | 'moderate' | 'low';
  confidenceScore?: number;
  temporal?: TemporalLabel;
  region: BoundingBox;
  opticalNotes?: string;
  sarNotes?: string;
  temporalNotes?: string;
  changeMask?: boolean;
  imagery: {
    source?: string;
    before?: string;
    after?: string;
  };
  location: string;
  limitations?: string[];
  geometry?: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface EvidenceRegion {
  id: string;
  type: EvidenceType;
  geometry: BoundingBox;
  confidence: number;
  sensors: SensorType[];
  temporal?: TemporalLabel;
  description: string;
}

export interface TemporalComparison {
  t1: {
    label: string;
    date: string;
    imagery: string;
    sensor: SensorType;
  };
  t2: {
    label: string;
    date: string;
    imagery: string;
    sensor: SensorType;
  };
  changes: TemporalChange[];
}

export interface TemporalChange {
  id: string;
  label: string;
  region: BoundingBox;
  magnitude: 'high' | 'medium' | 'low';
}

export interface AnalysisConfidence {
  value: number;
  label: 'High' | 'Moderate' | 'Low';
  basis: string[];
  uncertaintySentence?: string;
  ece?: number;
  temperatureScaling?: number;
}

export interface AnalysisResult {
  id: string;
  query: string;
  answer: string;
  verdict: Verdict;
  confidence: number;
  confidenceDetail?: AnalysisConfidence;
  sensorAgreement: SensorReading[];
  crossSensorAgreement: number;
  evidence: EvidenceItem[];
  regions: EvidenceRegion[];
  temporalComparison: TemporalComparison;
  executionTrace: ExecutionEvent[];
  events?: RunEvent[];
  taskMode: TaskMode;
  mode?: AnalysisMode;
  status?: RunStatus;
  sensors: SensorType[];
  location: string;
  createdAt: string;
  sceneDescription: string;
  inputs?: InputAsset[];
  interpretation?: Interpretation;
  plan?: AnalysisPlan;
  areaKm2?: number;
  dateRange?: string;
  limitations?: string[];
}

export interface DemoScenario {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  query: string;
  taskMode: TaskMode;
  mode?: AnalysisMode;
  sensors: SensorType[];
  location: string;
  coordinates: Coordinates;
  result: AnalysisResult;
  mapImagery: string;
  inputs?: InputAsset[];
  expectedOutputs?: {
    finding: string;
    confidence: string;
    evidenceCount: number;
    models: string[];
  };
}

export interface ModelRegistryEntry {
  id: string;
  name: string;
  version: string;
  task: string;
  inputModality: string;
  resolution: string;
  architecture: string;
  weightsHash: string;
  dateDeployed: string;
  description: string;
  parameters: Record<string, string | number | boolean>;
}

export interface ReportSection {
  number: string;
  title: string;
  items: ReportField[];
}

export interface ReportField {
  label: string;
  value: string;
  type?: 'text' | 'mono' | 'image' | 'list';
  image?: string;
  list?: string[];
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: {
    id: string;
    type: string;
    confidence: number;
    description?: string;
    sensors?: string[];
  };
}
