'use client';

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/satquery/TopNav';
import { listAnalyses } from '@/services/analysisService';
import { DecisionBadge } from '@/components/satquery/DecisionBadge';
import { ConfidenceMeter } from '@/components/satquery/ConfidenceMeter';
import Link from 'next/link';
import { FileSearch, ChevronRight, MapPin, Loader2 } from 'lucide-react';
import type { AnalysisResult } from '@/types';

export default function AnalysisListPage() {
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
              AUDIT LOGS
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F3F7FC] mb-2">
            Analysis History &amp; Executions
          </h1>
          <p className="text-sm text-[#A8B5C7] leading-relaxed">
            All satellite intelligence sessions processed in this workspace. Select an analysis session to inspect spatial evidence regions and cross-sensor agreement.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-xs font-mono text-[#8FA0B5]">
            <Loader2 size={20} className="animate-spin text-[#20A4F3] mr-2" />
            <span>Loading audit logs...</span>
          </div>
        ) : (
          <div className="space-y-3.5">
            {analyses.map((a) => (
              <Link
                key={a.id}
                href={`/analysis/${a.id}`}
                className="block rounded-xl border border-[#24344A] bg-[#101C2E] p-5 hover:border-[#20A4F3]/60 hover:bg-[#142238] transition-all group shadow-sm select-none"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#20A4F3] bg-[#07111F] px-2 py-0.5 rounded border border-[#24344A]">
                        {a.id}
                      </span>
                      <DecisionBadge verdict={a.verdict} size="sm" />
                      <span className="flex items-center gap-1.5 text-xs font-medium text-[#A8B5C7]">
                        <MapPin size={13} className="text-[#20A4F3] shrink-0" />
                        {a.location}
                      </span>
                    </div>

                    <p className="text-xs text-[#F3F7FC] font-semibold leading-relaxed line-clamp-2">
                      {a.answer}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-[#718096] pt-1">
                      <span className="font-bold text-[#A8B5C7]">Query:</span>
                      <span className="text-[#A8B5C7] italic truncate">&ldquo;{a.query}&rdquo;</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="w-40">
                      <ConfidenceMeter value={a.confidence} />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#20A4F3] group-hover:text-[#35B7FF] group-hover:gap-2 transition-all">
                      <FileSearch size={14} />
                      Inspect Session
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
