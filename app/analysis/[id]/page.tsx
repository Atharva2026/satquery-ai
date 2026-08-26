import { TopNav } from '@/components/satquery/TopNav';
import { AnalysisMapSection } from '@/components/satquery/AnalysisMapSection';
import { DecisionBadge } from '@/components/satquery/DecisionBadge';
import { ConfidenceMeter } from '@/components/satquery/ConfidenceMeter';
import { SensorAgreement } from '@/components/satquery/SensorAgreement';
import { ExecutionTrace } from '@/components/satquery/ExecutionTrace';
import { EvidenceCard } from '@/components/satquery/EvidenceCard';
import { UncertaintyCard } from '@/components/satquery/UncertaintyCard';
import { AbstentionCard } from '@/components/satquery/AbstentionCard';
import { getAnalysis, getDemoScenario } from '@/services/analysisService';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, FileText, FileSearch, Check, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AnalysisDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const analysis = await getAnalysis(params.id);
  if (!analysis) notFound();

  const scenario = await getDemoScenario(params.id);
  const coordinates = scenario?.coordinates ?? { lat: 28.4595, lng: 77.0266 };
  const mapImagery = scenario?.mapImagery ?? analysis.temporalComparison.t2.imagery;

  const evidenceChecks = [
    { label: `${analysis.evidence.length} grounded spatial regions`, ok: true },
    { label: 'T1 → T2 structural change detected', ok: analysis.verdict !== 'ABSTAIN' },
    { label: 'Optical spectral confirmation', ok: analysis.sensorAgreement[0]?.likelihood > 0.5 },
    { label: 'SAR double-bounce confirmation', ok: (analysis.sensorAgreement[1]?.likelihood ?? 0) > 0.5 },
    { label: 'Spatial agreement > 0.70', ok: analysis.crossSensorAgreement > 0.5 },
  ];

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F3F7FC]">
      <TopNav />
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-8 select-none">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/analysis">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-[#A8B5C7] border-[#24344A] bg-[#101C2E] hover:bg-[#142238] hover:text-[#F3F7FC] h-8 text-xs font-semibold"
            >
              <ArrowLeft size={14} />
              Analysis History
            </Button>
          </Link>
          <span className="text-[#24344A]">/</span>
          <span className="font-mono text-xs font-bold text-[#20A4F3]">
            {analysis.id}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Map + Evidence list */}
          <div className="lg:col-span-2 space-y-5">
            <AnalysisMapSection
              analysis={analysis}
              coordinates={coordinates}
              mapImagery={mapImagery}
            />

            {/* Evidence List Panel */}
            <div className="rounded-xl border border-[#24344A] bg-[#101C2E] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#24344A] pb-3">
                <h3 className="text-sm font-bold text-[#F3F7FC] uppercase tracking-wider">
                  Grounded Evidence Regions ({analysis.evidence.length})
                </h3>
                <span className="text-[11px] font-mono text-[#22C7D6] font-bold">
                  MULTI-MODAL BOUNDING BOXES
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3.5">
                {analysis.evidence.map((ev) => (
                  <Link key={ev.id} href={`/evidence/${analysis.id}/${ev.id}`}>
                    <EvidenceCard evidence={ev} compact />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Decision + Verification + Trace */}
          <div className="space-y-5 min-w-0">
            <div className="rounded-xl border border-[#24344A] bg-[#101C2E] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#24344A] pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#142238] text-[#22C7D6] border border-[#24344A] shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <h2 className="text-sm font-bold text-[#F3F7FC]">AI Decision Summary</h2>
                </div>
                <DecisionBadge verdict={analysis.verdict} size="sm" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096] block">
                  Analyst Query
                </span>
                <p className="text-xs text-[#A8B5C7] italic font-medium">
                  &ldquo;{analysis.query}&rdquo;
                </p>
              </div>

              <div className="rounded-lg border border-[#24344A] bg-[#0B1628] p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B5C7] block">
                  AI Finding Output
                </span>
                <p className="text-xs text-[#F3F7FC] leading-relaxed font-normal break-words">
                  {analysis.answer}
                </p>
              </div>

              {analysis.verdict === 'CONFIDENT' && (
                <div className="space-y-4">
                  <div className="bg-[#0B1628] border border-[#24344A] rounded-lg p-3.5 space-y-3">
                    <ConfidenceMeter value={analysis.confidence} showScale />
                    
                    <div className="pt-2 border-t border-[#24344A] space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B5C7] block">
                        Verification Criteria
                      </span>
                      <ul className="space-y-1.5">
                        {evidenceChecks.map((c) => (
                          <li key={c.label} className="flex items-center gap-2 text-xs">
                            <Check size={13} className={c.ok ? 'text-[#19C37D] shrink-0' : 'text-[#718096] shrink-0'} />
                            <span className={c.ok ? 'text-[#F3F7FC] font-medium' : 'text-[#718096]'}>
                              {c.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <SensorAgreement
                    readings={analysis.sensorAgreement}
                    crossSensorAgreement={analysis.crossSensorAgreement}
                  />
                </div>
              )}

              {analysis.verdict === 'UNCERTAIN' && (
                <UncertaintyCard analysis={analysis} />
              )}

              {analysis.verdict === 'ABSTAIN' && (
                <AbstentionCard analysis={analysis} />
              )}
            </div>

            {/* Execution Trace Panel */}
            <div className="rounded-xl border border-[#24344A] bg-[#101C2E] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#F3F7FC] border-b border-[#24344A] pb-3 uppercase tracking-wider">
                Execution Event Trace
              </h3>
              <ExecutionTrace events={analysis.executionTrace} compact />
            </div>

            <div className="flex gap-2.5">
              <Link href={`/evidence/${analysis.id}`} className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5 text-xs font-semibold text-[#A8B5C7] border-[#24344A] bg-[#101C2E] hover:bg-[#142238] hover:text-[#F3F7FC] h-10"
                >
                  <FileSearch size={14} className="text-[#20A4F3]" />
                  Inspect Evidence
                </Button>
              </Link>
              <Link href={`/reports/${analysis.id}`} className="flex-1">
                <Button
                  size="sm"
                  className="w-full gap-1.5 text-xs font-bold bg-[#20A4F3] text-[#07111F] hover:bg-[#35B7FF] h-10 shadow-sm"
                >
                  <FileText size={14} />
                  Generate Report
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
