import { TopNav } from '@/components/satquery/TopNav';
import { A4ReportViewer } from '@/components/satquery/A4ReportViewer';
import { getAnalysis } from '@/services/analysisService';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const analysis = await getAnalysis(params.id);

  if (!analysis) notFound();

  return (
    <div className="min-h-screen bg-[#E5E9F0] dark:bg-slate-950">
      <TopNav />
      <A4ReportViewer analysis={analysis} />
    </div>
  );
}
