import { TopNav } from '@/components/satquery/TopNav';
import { DecisionBadge } from '@/components/satquery/DecisionBadge';
import { ConfidenceMeter } from '@/components/satquery/ConfidenceMeter';
import { ComparisonViewer } from '@/components/satquery/ComparisonViewer';
import { getAnalysis, getEvidence, getDemoScenario } from '@/services/analysisService';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, MapPin, Layers, Crosshair, Eye, ScanSearch, FileText } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EvidenceDetailPage({
  params,
}: {
  params: { id: string; evidenceId: string };
}) {
  const analysis = await getAnalysis(params.id);
  if (!analysis) notFound();

  const evidence = await getEvidence(params.id, params.evidenceId);
  if (!evidence) notFound();

  const scenario = await getDemoScenario(params.id);
  const coordinates = scenario?.coordinates ?? { lat: 28.4595, lng: 77.0266 };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F3F7FC]">
      <TopNav />
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-8 select-none">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href={`/evidence/${analysis.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-[#A8B5C7] border-[#24344A] bg-[#101C2E] hover:bg-[#142238] hover:text-[#F3F7FC] h-8 text-xs font-semibold"
            >
              <ArrowLeft size={14} />
              Evidence Registry
            </Button>
          </Link>
          <span className="text-[#24344A]">/</span>
          <span className="font-mono text-xs font-bold text-[#20A4F3]">
            {evidence.id}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Imagery + Comparison */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-xl border border-[#24344A] bg-[#101C2E] p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#24344A] pb-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-[#20A4F3] bg-[#07111F] px-2 py-0.5 rounded border border-[#24344A]">
                      {evidence.id}
                    </span>
                    <span className="text-xs font-bold text-[#F3F7FC] uppercase tracking-wider">
                      {evidence.type}
                    </span>
                  </div>
                </div>
                <DecisionBadge
                  verdict={evidence.confidence >= 0.7 ? 'CONFIDENT' : evidence.confidence >= 0.4 ? 'UNCERTAIN' : 'ABSTAIN'}
                  size="md"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#A8B5C7] uppercase tracking-wider block mb-2">
                  Bi-Temporal Visual Comparison
                </span>
                <ComparisonViewer
                  beforeImage={evidence.imagery.before}
                  afterImage={evidence.imagery.after}
                  beforeLabel={`Before · ${evidence.temporal.t1}`}
                  afterLabel={`After · ${evidence.temporal.t2}`}
                  className="h-80 rounded-lg overflow-hidden border border-[#24344A]"
                />
              </div>
            </div>

            <div className="rounded-xl border border-[#24344A] bg-[#101C2E] p-6 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-[#A8B5C7] uppercase tracking-wider block">
                Acquisition Imagery &amp; Grounding Bounds
              </span>
              <div className="relative h-60 rounded-lg overflow-hidden bg-[#07111F] border border-[#24344A]">
                <img
                  src={evidence.imagery.after}
                  alt="Original scene with bounding box"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute border-2 border-[#20A4F3] rounded-xs"
                  style={{
                    left: `${evidence.region.x}%`,
                    top: `${evidence.region.y}%`,
                    width: `${evidence.region.width}%`,
                    height: `${evidence.region.height}%`,
                    backgroundColor: 'rgba(32, 164, 243, 0.2)',
                  }}
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-[#07111F]/90 text-[10px] font-mono font-bold text-[#F3F7FC] border border-[#24344A]">
                  Grounding Region · {evidence.region.label}
                </div>
              </div>
            </div>

            {/* Sensor Evidence Analysis Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#24344A] bg-[#101C2E] p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Eye size={15} className="text-[#20A4F3]" />
                  <h3 className="text-xs font-bold text-[#F3F7FC]">Optical Spectral Analysis</h3>
                </div>
                <p className="text-xs text-[#A8B5C7] leading-relaxed break-words">
                  {evidence.opticalNotes}
                </p>
              </div>
              <div className="rounded-xl border border-[#24344A] bg-[#101C2E] p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <ScanSearch size={15} className="text-[#22C7D6]" />
                  <h3 className="text-xs font-bold text-[#F3F7FC]">SAR Backscatter Return</h3>
                </div>
                <p className="text-xs text-[#A8B5C7] leading-relaxed break-words">
                  {evidence.sarNotes}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Metadata Panel */}
          <div className="space-y-5">
            <div className="rounded-xl border border-[#24344A] bg-[#101C2E] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#F3F7FC] border-b border-[#24344A] pb-3 uppercase tracking-wider">
                Evidence Attributes
              </h3>
              <dl className="space-y-3.5 text-xs">
                <div>
                  <dt className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">
                    Evidence Identifier
                  </dt>
                  <dd className="font-mono font-bold text-[#20A4F3] mt-0.5">
                    {evidence.id}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">
                    Classification Type
                  </dt>
                  <dd className="font-medium text-[#F3F7FC] mt-0.5">{evidence.type}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">
                    Sensors Involved
                  </dt>
                  <dd className="font-medium text-[#F3F7FC] mt-0.5 flex items-center gap-1.5">
                    <Layers size={13} className="text-[#22C7D6]" />
                    {evidence.sensors.join(' + ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-[#718096] uppercase tracking-wider mb-1">
                    Calibrated Confidence
                  </dt>
                  <dd>
                    <ConfidenceMeter value={evidence.confidence} size="sm" showScale />
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">
                    Temporal Baseline
                  </dt>
                  <dd className="font-medium text-[#F3F7FC] mt-0.5 flex items-center gap-1.5 font-mono">
                    <Crosshair size={13} className="text-[#20A4F3]" />
                    {evidence.temporal.t1} → {evidence.temporal.t2}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">
                    Target Location
                  </dt>
                  <dd className="font-medium text-[#F3F7FC] mt-0.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#20A4F3]" />
                    {evidence.location}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">
                    Centroid Coordinates
                  </dt>
                  <dd className="font-mono font-medium text-[#A8B5C7] mt-0.5">
                    {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
                  </dd>
                </div>
              </dl>
            </div>

            <Link href={`/reports/${analysis.id}`}>
              <Button
                size="sm"
                className="w-full gap-2 bg-[#20A4F3] text-[#07111F] hover:bg-[#35B7FF] text-xs font-bold h-10 shadow-sm"
              >
                <FileText size={14} />
                <span>View Full Audit Report</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
