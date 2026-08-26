'use client';

import type { ReportSection, AnalysisResult } from '@/types';
import { A4ReportViewer } from './A4ReportViewer';

interface ReportPreviewProps {
  sections?: ReportSection[];
  analysis?: AnalysisResult;
  className?: string;
}

export function ReportPreview({ analysis, className }: ReportPreviewProps) {
  if (!analysis) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        No active analysis available for report generation.
      </div>
    );
  }

  return <A4ReportViewer analysis={analysis} />;
}
