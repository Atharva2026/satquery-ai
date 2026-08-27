'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  GitCompare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { findScenario, urbanGrowthResult, floodImpactResult } from '@/lib/mock-data';
import type { AnalysisResult } from '@/types';

export default function ComparePage() {
  const params = useParams();
  const runId = (params.id as string) || 'analysis-urban-growth';

  const scenario = findScenario(runId);
  const result: AnalysisResult = scenario
    ? scenario.result
    : runId.includes('flood')
    ? floodImpactResult()
    : urbanGrowthResult();

  const [sliderPos, setSliderPos] = useState(50);
  const [activeMode, setActiveMode] = useState<'temporal' | 'sensor'>('temporal');

  const imgT1 = result.temporalComparison.t1.imagery;
  const imgT2 = result.temporalComparison.t2.imagery;

  return (
    <AppShell>
      <div className="flex-1 flex flex-col font-sans bg-[#07111F]">
        {/* Top Header */}
        <div className="border-b border-[#1E293B] bg-[#0B132B] px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/analyses/${runId}`}
              className="p-1 rounded-md bg-[#07111F] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors shrink-0"
              title="Back to Answer"
            >
              <ArrowLeft size={14} />
            </Link>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-[#38BDF8]">
                  RUN {result.id}
                </span>
                <span className="text-[#64748B] text-xs">·</span>
                <h1 className="text-sm font-semibold text-[#F8FAFC] truncate">
                  Synchronized Image Comparison
                </h1>
              </div>
              <p className="text-xs text-[#94A3B8] truncate max-w-xl">
                “{result.query}”
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-md bg-[#07111F] border border-[#1E293B] p-0.5 gap-1">
            <button
              onClick={() => setActiveMode('temporal')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeMode === 'temporal'
                  ? 'bg-[#1E293B] text-[#F8FAFC]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Bi-Temporal (T1 vs T2)
            </button>
            <button
              onClick={() => setActiveMode('sensor')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeMode === 'sensor'
                  ? 'bg-[#1E293B] text-[#F8FAFC]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Optical vs SAR
            </button>
          </div>
        </div>

        {/* Persistent Sub-Navigation Tabs */}
        <div className="bg-[#07111F] border-b border-[#1E293B] px-4 lg:px-8 flex items-center justify-between">
          <nav className="flex items-center gap-1 -mb-px">
            <Link
              href={`/analyses/${runId}`}
              className="px-3.5 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              Answer
            </Link>
            <Link
              href={`/analyses/${runId}/evidence`}
              className="px-3.5 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              Evidence ({result.evidence.length})
            </Link>
            <Link
              href={`/analyses/${runId}/compare`}
              className="px-3.5 py-2 text-xs font-semibold text-[#F8FAFC] border-b-2 border-[#38BDF8]"
            >
              Compare
            </Link>
            <Link
              href={`/analyses/${runId}/audit`}
              className="px-3.5 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              Audit &amp; Trace
            </Link>
          </nav>
        </div>

        {/* Interactive Swipe Canvas */}
        <div className="flex-1 relative bg-[#050A14] flex items-center justify-center overflow-hidden select-none">
          {/* Base Layer: T2 (Follow-up) */}
          <div className="absolute inset-0 w-full h-full">
            <img src={imgT2} alt="T2 layer" className="w-full h-full object-cover" />
            <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded bg-[#07111F] border border-[#1E293B] text-xs font-mono text-[#F1F5F9] z-10">
              T2: 22 Aug 2026
            </span>
          </div>

          {/* Clipped Layer: T1 (Baseline) */}
          <div
            style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            className="absolute inset-0 w-full h-full"
          >
            <img src={imgT1} alt="T1 layer" className="w-full h-full object-cover" />
            <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded bg-[#07111F] border border-[#1E293B] text-xs font-mono text-[#94A3B8] z-10">
              T1: 14 Jan 2026
            </span>
          </div>

          {/* Swipe Divider Bar & Handle */}
          <div
            style={{ left: `${sliderPos}%` }}
            className="absolute inset-y-0 w-[1.5px] bg-[#38BDF8] z-20 cursor-ew-resize"
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#07111F] border border-[#38BDF8] flex items-center justify-center text-[#38BDF8] shadow-md">
              <GitCompare size={12} />
            </div>
          </div>

          {/* Transparent Range Input Overlay for Dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />

          {/* Floating Instructions */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-[#07111F] border border-[#1E293B] text-xs font-mono text-[#94A3B8] z-10 pointer-events-none">
            Drag to compare ({Math.round(sliderPos)}%)
          </div>
        </div>
      </div>
    </AppShell>
  );
}
