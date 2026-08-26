'use client';

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/satquery/TopNav';
import { listDemoScenarios } from '@/services/analysisService';
import { DecisionBadge } from '@/components/satquery/DecisionBadge';
import Link from 'next/link';
import { Layers, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DemoScenario } from '@/types';

export default function DatasetsPage() {
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    listDemoScenarios().then((data) => {
      if (mounted) {
        setScenarios(data);
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
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold text-[#22C7D6] uppercase tracking-wider bg-[#102B45] px-2.5 py-0.5 rounded border border-[#20A4F3]/30">
              EO DATA ARCHIVE
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F3F7FC] mb-2">
            Satellite Datasets &amp; Catalog
          </h1>
          <p className="text-sm text-[#A8B5C7] leading-relaxed max-w-3xl">
            Pre-registered optical and SAR multi-temporal satellite stacks available for instant natural-language query execution.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-xs font-mono text-[#8FA0B5]">
            <Loader2 size={20} className="animate-spin text-[#20A4F3] mr-2" />
            <span>Loading satellite catalog...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {scenarios.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-[#24344A] bg-[#101C2E] overflow-hidden shadow-md hover:border-[#20A4F3]/60 transition-all flex flex-col group select-none hover:bg-[#142238]"
              >
                <div className="aspect-video relative overflow-hidden bg-[#07111F]">
                  <img
                    src={s.mapImagery}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <DecisionBadge verdict={s.result.verdict} confidence={s.result.confidence} size="sm" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/90 via-[#07111F]/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 text-[#F3F7FC]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold truncate">
                      <MapPin size={13} className="text-[#20A4F3] shrink-0" />
                      <span className="truncate">{s.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#F3F7FC] group-hover:text-[#35B7FF] transition-colors mb-2">
                      {s.title}
                    </h2>
                    <p className="text-xs text-[#A8B5C7] leading-relaxed line-clamp-2 mb-4 font-normal">
                      {s.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#A8B5C7] bg-[#0D192A] p-2.5 rounded-lg border border-[#24344A]">
                      <Layers size={14} className="text-[#22C7D6] shrink-0" />
                      <span className="truncate">Sensors: {s.sensors.join(' · ')}</span>
                    </div>
                  </div>

                  <Link href={`/workspace?scenario=${s.id}`}>
                    <Button
                      size="sm"
                      className="w-full gap-2 bg-[#20A4F3] text-[#07111F] hover:bg-[#35B7FF] text-xs font-bold min-h-[40px] h-[40px] shadow-sm transition-all"
                    >
                      <span>Open in Workspace</span>
                      <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
