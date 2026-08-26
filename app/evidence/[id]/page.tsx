import { TopNav } from '@/components/satquery/TopNav';
import { getAnalysis } from '@/services/analysisService';
import { EvidenceCard } from '@/components/satquery/EvidenceCard';
import { DecisionBadge } from '@/components/satquery/DecisionBadge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Crosshair } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EvidenceListPage({
  params,
}: {
  params: { id: string };
}) {
  const analysis = await getAnalysis(params.id);
  if (!analysis) notFound();

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F3F7FC]">
      <TopNav />
      <div className="max-w-5xl mx-auto px-6 py-8 select-none">
        <div className="flex items-center gap-2 mb-6">
          <Link href={`/analysis/${analysis.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-[#A8B5C7] border-[#24344A] bg-[#101C2E] hover:bg-[#142238] hover:text-[#F3F7FC] h-8 text-xs font-semibold"
            >
              <ArrowLeft size={14} />
              Analysis Detail
            </Button>
          </Link>
          <span className="text-[#24344A]">/</span>
          <span className="font-mono text-xs font-bold text-[#20A4F3]">Evidence Registry</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#24344A]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crosshair size={16} className="text-[#20A4F3]" />
              <h1 className="text-2xl font-bold tracking-tight text-[#F3F7FC]">Spatial Evidence Inspection</h1>
            </div>
            <p className="text-xs font-medium text-[#A8B5C7]">
              {analysis.location} · {analysis.evidence.length} grounded evidence items
            </p>
          </div>
          <DecisionBadge verdict={analysis.verdict} size="md" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {analysis.evidence.map((ev) => (
            <Link key={ev.id} href={`/evidence/${analysis.id}/${ev.id}`}>
              <EvidenceCard evidence={ev} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
