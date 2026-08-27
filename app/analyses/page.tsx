'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { demoScenarios } from '@/lib/mock-data';

export default function AnalysesHistoryPage() {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [filterVerdict, setFilterVerdict] = useState<string>('all');

  const filteredRuns = demoScenarios.filter((scenario) => {
    const matchesSearch =
      scenario.title.toLowerCase().includes(search.toLowerCase()) ||
      scenario.query.toLowerCase().includes(search.toLowerCase()) ||
      scenario.location.toLowerCase().includes(search.toLowerCase());

    const matchesMode =
      filterMode === 'all' ||
      (filterMode === 'single' && scenario.mode === 'single') ||
      (filterMode === 'temporal' && scenario.mode === 'temporal') ||
      (filterMode === 'optical-sar' && scenario.mode === 'optical-sar');

    const matchesVerdict =
      filterVerdict === 'all' || scenario.result.verdict.toLowerCase() === filterVerdict.toLowerCase();

    return matchesSearch && matchesMode && matchesVerdict;
  });

  return (
    <AppShell>
      <div className="max-w-[1080px] w-full mx-auto px-4 sm:px-8 py-8 space-y-6 font-sans">
        {/* Header with Title and New Analysis CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Analysis History &amp; Dossiers
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Browse multimodal satellite analyses, grounded spatial evidence, and audit logs.
            </p>
          </div>
          <Link href="/analyze">
            <Button className="h-8 px-3.5 text-xs font-medium bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] gap-1.5">
              <Plus size={14} />
              <span>New Analysis</span>
            </Button>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0B132B] p-3 rounded-lg border border-[#1E293B]">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by query, location, or run ID..."
              className="w-full bg-[#07111F] border border-[#1E293B] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#F1F5F9] placeholder-[#64748B] focus:border-[#38BDF8] outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="bg-[#07111F] border border-[#1E293B] rounded-md px-2.5 py-1.5 text-xs text-[#E2E8F0] outline-none"
            >
              <option value="all">All Modalities</option>
              <option value="single">Single Image VQA</option>
              <option value="temporal">Before + After</option>
              <option value="optical-sar">Optical + SAR Fusion</option>
            </select>

            <select
              value={filterVerdict}
              onChange={(e) => setFilterVerdict(e.target.value)}
              className="bg-[#07111F] border border-[#1E293B] rounded-md px-2.5 py-1.5 text-xs text-[#E2E8F0] outline-none"
            >
              <option value="all">All Verdicts</option>
              <option value="confident">Confident</option>
              <option value="uncertain">Uncertain</option>
              <option value="abstain">Abstain</option>
            </select>
          </div>
        </div>

        {/* Runs List: Clean divided items */}
        <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] divide-y divide-[#1E293B]">
          {filteredRuns.map((scenario) => {
            const res = scenario.result;
            return (
              <div
                key={scenario.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 hover:bg-[#0F172A] transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[#07111F] border border-[#1E293B] shrink-0">
                    <img
                      src={scenario.mapImagery}
                      alt={scenario.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#F8FAFC] truncate">
                        {scenario.title}
                      </h3>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                          res.verdict === 'CONFIDENT'
                            ? 'text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20'
                            : res.verdict === 'UNCERTAIN'
                            ? 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20'
                            : 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20'
                        }`}
                      >
                        {res.verdict} ({Math.round(res.confidence * 100)}%)
                      </span>
                    </div>

                    <p className="text-xs text-[#CBD5E1] line-clamp-1 italic">
                      “{scenario.query}”
                    </p>

                    <p className="text-xs text-[#94A3B8] line-clamp-1">{res.answer}</p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#64748B] pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {scenario.location}
                      </span>
                      <span>·</span>
                      <span>{res.evidence.length} Evidence regions</span>
                      <span>·</span>
                      <span>{res.sensors.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <Link href={`/reports/${res.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2.5 text-xs font-medium bg-[#07111F] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
                    >
                      Report
                    </Button>
                  </Link>

                  <Link href={`/analyses/${res.id}`}>
                    <Button
                      size="sm"
                      className="h-7 px-3 text-xs font-medium bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] gap-1"
                    >
                      <span>Workspace</span>
                      <ArrowRight size={12} />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
