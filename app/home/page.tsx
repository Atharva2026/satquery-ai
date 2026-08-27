'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  History,
  FileText,
  Bookmark,
  Clock,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { IMG, demoScenarios } from '@/lib/mock-data';
import type { AnalysisMode } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>('temporal');

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/analyze?q=${encodeURIComponent(query)}&mode=${selectedMode}`);
    } else {
      router.push(`/analyze?mode=${selectedMode}`);
    }
  };

  const sampleQuestions = [
    { text: 'Did construction increase between Jan and Aug? Highlight new structures.', mode: 'temporal' as AnalysisMode },
    { text: 'Is there flood inundation in this area? Assess affected zones under cloud cover.', mode: 'optical-sar' as AnalysisMode },
    { text: 'Describe dominant land-cover and identify major transport infrastructure.', mode: 'single' as AnalysisMode },
  ];

  return (
    <AppShell>
      <div className="max-w-[1080px] w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Header with Greeting & Quick New Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Good afternoon, Analyst
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Select an imagery mode or enter a natural language query to begin.
            </p>
          </div>
          <Link href="/analyze">
            <Button className="h-8 px-3.5 text-xs font-medium bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] gap-1.5 transition-colors">
              <Plus size={14} />
              <span>New Analysis</span>
            </Button>
          </Link>
        </div>

        {/* Command Composer */}
        <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-5 sm:p-6 space-y-4">
          <form onSubmit={handleStartAnalysis} className="space-y-3">
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about an image, a change, or optical + SAR imagery…"
                rows={3}
                className="w-full rounded-lg bg-[#07111F] border border-[#1E293B] focus:border-[#38BDF8] p-3.5 text-xs sm:text-sm text-[#F1F5F9] placeholder-[#64748B] resize-none outline-none font-sans"
              />
              <div className="absolute right-3 bottom-3">
                <Button
                  type="submit"
                  size="sm"
                  className="h-7 px-3 text-xs font-medium bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] gap-1"
                >
                  <span>Continue</span>
                  <ArrowRight size={12} />
                </Button>
              </div>
            </div>

            {/* Mode Selection Segmented Control */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#64748B] text-[11px]">Modality:</span>
              <div className="inline-flex rounded-md bg-[#07111F] border border-[#1E293B] p-0.5">
                <button
                  type="button"
                  onClick={() => setSelectedMode('single')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedMode === 'single'
                      ? 'bg-[#1E293B] text-[#F8FAFC]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  Single image
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode('temporal')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedMode === 'temporal'
                      ? 'bg-[#1E293B] text-[#F8FAFC]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  Before + after
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode('optical-sar')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedMode === 'optical-sar'
                      ? 'bg-[#1E293B] text-[#F8FAFC]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  Optical + SAR
                </button>
              </div>
            </div>
          </form>

          {/* Sample Prompts */}
          <div className="pt-2 border-t border-[#1E293B]/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#64748B] text-[11px]">Sample prompts:</span>
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(sq.text);
                  setSelectedMode(sq.mode);
                }}
                className="px-2 py-0.5 rounded bg-[#07111F] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#334155] text-left truncate max-w-xs transition-colors"
              >
                {sq.text}
              </button>
            ))}
          </div>
        </div>

        {/* Active Investigation Card */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block">
            Active Investigation
          </span>
          <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#07111F] border border-[#1E293B] shrink-0">
                <img src={IMG.urbanT2} alt="Active run" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#F8FAFC] truncate">
                    Built-up change near Pune Extension
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20">
                    92% Confidence
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] truncate">
                  17 candidate / 6 verified structures detected via optical &amp; SAR corroboration.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#64748B] font-mono">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> 2 hours ago
                  </span>
                  <span>· 4.2 km² AOI</span>
                </div>
              </div>
            </div>

            <Link href="/analyses/analysis-urban-growth" className="shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto h-7 px-3 text-xs font-medium bg-[#0F172A] border-[#1E293B] text-[#E2E8F0] hover:bg-[#1E293B]"
              >
                <span>Open Workspace</span>
                <ArrowRight size={12} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 3-Column Overview: Divided lists rather than card-inside-cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {/* Col 1: Recent Analyses */}
          <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
              <span className="text-xs font-semibold text-[#F8FAFC]">Recent Analyses</span>
              <Link href="/analyses" className="text-[11px] text-[#38BDF8] hover:underline">
                View all
              </Link>
            </div>

            <div className="divide-y divide-[#1E293B]/60 text-xs">
              {demoScenarios.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/analyses/${item.result.id}`}
                  className="block py-2.5 hover:text-[#38BDF8] transition-colors group"
                >
                  <div className="flex items-center justify-between font-medium text-[#E2E8F0] group-hover:text-[#38BDF8]">
                    <span className="truncate max-w-[160px]">{item.title}</span>
                    <span className="text-[10px] font-mono text-[#94A3B8]">
                      {item.result.verdict}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">{item.query}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Col 2: Saved AOI Areas */}
          <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
              <span className="text-xs font-semibold text-[#F8FAFC]">Saved AOI Extents</span>
              <span className="text-[10px] font-mono text-[#64748B]">3 Active</span>
            </div>

            <div className="divide-y divide-[#1E293B]/60 text-xs text-[#94A3B8]">
              <div className="py-2.5">
                <div className="flex justify-between font-medium text-[#E2E8F0]">
                  <span>Pune Peri-Urban</span>
                  <span className="font-mono text-[11px] text-[#64748B]">4.2 km²</span>
                </div>
                <div className="text-[11px] text-[#64748B]">Sentinel-1/2 Co-registered</div>
              </div>

              <div className="py-2.5">
                <div className="flex justify-between font-medium text-[#E2E8F0]">
                  <span>Brahmaputra Basin</span>
                  <span className="font-mono text-[11px] text-[#64748B]">4.1 km²</span>
                </div>
                <div className="text-[11px] text-[#64748B]">Monsoon Inundation</div>
              </div>

              <div className="py-2.5">
                <div className="flex justify-between font-medium text-[#E2E8F0]">
                  <span>JNPT Maritime Terminal</span>
                  <span className="font-mono text-[11px] text-[#64748B]">3.8 km²</span>
                </div>
                <div className="text-[11px] text-[#64748B]">Container Berth</div>
              </div>
            </div>
          </div>

          {/* Col 3: Export Dossiers */}
          <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
              <span className="text-xs font-semibold text-[#F8FAFC]">Recent Dossiers</span>
              <Link href="/reports" className="text-[11px] text-[#38BDF8] hover:underline">
                Archive
              </Link>
            </div>

            <div className="divide-y divide-[#1E293B]/60 text-xs">
              <Link
                href="/reports/analysis-urban-growth"
                className="block py-2.5 hover:text-[#38BDF8] transition-colors group"
              >
                <div className="flex items-center justify-between font-medium text-[#E2E8F0] group-hover:text-[#38BDF8]">
                  <span>Pune Expansion Dossier</span>
                  <span className="text-[10px] font-mono text-[#64748B]">6 Pages</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  PDF &amp; GeoJSON ready
                </div>
              </Link>

              <Link
                href="/reports/analysis-flood-impact"
                className="block py-2.5 hover:text-[#38BDF8] transition-colors group"
              >
                <div className="flex items-center justify-between font-medium text-[#E2E8F0] group-hover:text-[#38BDF8]">
                  <span>Assam Inundation Advisory</span>
                  <span className="text-[10px] font-mono text-[#64748B]">6 Pages</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  Radar Cross-Check Dossier
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
