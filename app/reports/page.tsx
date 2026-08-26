'use client';

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/satquery/TopNav';
import { listAnalyses } from '@/services/analysisService';
import { DecisionBadge } from '@/components/satquery/DecisionBadge';
import Link from 'next/link';
import { FileText, ChevronRight, MapPin, Loader2 } from 'lucide-react';
import type { AnalysisResult } from '@/types';

export default function ReportsListPage() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    listAnalyses().then((data) => {
      if (mounted) {
        setAnalyses(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F3F7FC]">
      <TopNav />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold text-[#22C7D6] uppercase tracking-wider bg-[#102B45] px-2.5 py-0.5 rounded border border-[#20A4F3]/30">
              AUDIT BRIEFINGS
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F3F7FC] mb-2">
            Evidence &amp; Decision Reports
          </h1>
          <p className="text-sm text-[#A8B5C7] leading-relaxed">
            Verifiable 6-page A4 geospatial intelligence audit briefings for satellite query sessions. Select a report to inspect calibrated confidence, multi-sensor agreement, and execution traces.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-xs font-mono text-[#8FA0B5]">
            <Loader2 size={20} className="animate-spin text-[#20A4F3] mr-2" />
            <span>Loading reports catalog...</span>
          </div>
        ) : (
          <div className="space-y-3.5">
            {analyses.map((a) => (
              <Link
                key={a.id}
                href={`/reports/${a.id}`}
                className="block rounded-xl border border-[#24344A] bg-[#101C2E] p-5 hover:border-[#20A4F3]/60 hover:bg-[#142238] transition-all group shadow-sm select-none"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#20A4F3] font-mono bg-[#07111F] px-2 py-0.5 rounded border border-[#24344A]">
                        <FileText size={13} />
                        {a.id}
                      </div>
                      <DecisionBadge verdict={a.verdict} size="sm" />
                      <span className="flex items-center gap-1 text-xs font-medium text-[#A8B5C7]">
                        <MapPin size={12} className="text-[#20A4F3]" />
                        {a.location}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#F3F7FC] line-clamp-2">
                      {a.answer}
                    </p>
                    <p className="text-xs text-[#8FA0B5] italic truncate">
                      &ldquo;{a.query}&rdquo;
                    </p>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-semibold text-[#35B7FF] group-hover:gap-2 transition-all shrink-0">
                    Open 6-Page Briefing
                    <ChevronRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
