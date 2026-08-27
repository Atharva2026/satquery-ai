'use client';

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/satquery/TopNav';
import { listAnalyses } from '@/services/analysisService';
import { DecisionBadge } from '@/components/satquery/DecisionBadge';
import Link from 'next/link';
import { ChevronRight, MapPin, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#07111F] text-[#F1F5F9] font-sans">
      <TopNav />
      <div className="max-w-[1080px] mx-auto px-4 sm:px-8 py-8 space-y-6">
        <div className="border-b border-[#1E293B] pb-5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
            Evidence &amp; Decision Reports
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5 max-w-2xl">
            Verifiable 6-page A4 geospatial intelligence audit briefings for satellite query sessions.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-xs font-mono text-[#64748B]">
            <Loader2 size={16} className="animate-spin text-[#38BDF8] mr-2" />
            <span>Loading reports catalog...</span>
          </div>
        ) : (
          <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] divide-y divide-[#1E293B]">
            {analyses.map((a) => (
              <Link
                key={a.id}
                href={`/reports/${a.id}`}
                className="block p-4 sm:p-5 hover:bg-[#0F172A] transition-colors group select-none"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-medium text-[#38BDF8]">
                        {a.id}
                      </span>
                      <DecisionBadge verdict={a.verdict} size="sm" />
                      <span className="flex items-center gap-1 text-[11px] font-mono text-[#64748B]">
                        <MapPin size={11} />
                        {a.location}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#F1F5F9] line-clamp-1">
                      {a.answer}
                    </p>
                    <p className="text-xs text-[#94A3B8] italic truncate">
                      “{a.query}”
                    </p>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-medium text-[#38BDF8] group-hover:gap-1.5 transition-all shrink-0">
                    <span>Open 6-Page Dossier</span>
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
