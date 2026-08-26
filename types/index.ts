// ── SatQuery AI Domain Types ──────────────────────────────────────────────

export type Verdict = 'CONFIDENT' | 'UNCERTAIN' | 'ABSTAIN';

export type AnalysisStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'uncertain'
  | 'abstain'
  | 'error';

export type TaskMode = 'VQA' | 'CHANGE' | 'GROUND' | 'COMPARE';

export type SensorType = 'OPTICAL' | 'SAR' | 'TEMPORAL';

export type LayerKey = 'OPTICAL' | 'SAR' | 'CHANGE' | 'GROUNDING' | 'EVIDENCE';

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

export interface EvidenceRegion {
  id: string;
  type: EvidenceType;
  geometry: BoundingBox;
  confidence: number;
  sensors: SensorType[];
  temporal?: TemporalLabel;
  description: string;
}

export type EvidenceType =
  | 'Structural change'
  | 'New structure'
  | 'Land-cover change'
  | 'Flood extent'
  | 'Vegetation loss'
  | 'Grounded object';

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
  sensors: SensorType[];
  confidence: number;
  temporal: TemporalLabel;
  region: BoundingBox;
  opticalNotes: string;
  sarNotes: string;
  changeMask: boolean;
  imagery: {
    before: string;
    after: string;
  };
  location: string;
}

export interface AnalysisResult {
  id: string;
  query: string;
  answer: string;
  verdict: Verdict;
  confidence: number;
  sensorAgreement: SensorReading[];
  crossSensorAgreement: number;
  evidence: EvidenceItem[];
  regions: EvidenceRegion[];
  temporalComparison: TemporalComparison;
  executionTrace: ExecutionEvent[];
  taskMode: TaskMode;
  sensors: SensorType[];
  location: string;
  createdAt: string;
  sceneDescription: string;
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

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  query: string;
  taskMode: TaskMode;
  sensors: SensorType[];
  location: string;
  coordinates: Coordinates;
  result: AnalysisResult;
  mapImagery: string;
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
  };
}
