'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Sparkles,
  Eye,
  GitCompare,
  Layers,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  ChevronRight,
  ExternalLink,
  MapPin,
  Clock,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { EvidenceDrawer } from '@/components/evidence/EvidenceDrawer';
import { findScenario, urbanGrowthResult, floodImpactResult, singleVqaResult } from '@/lib/mock-data';
import type { AnalysisResult, EvidenceItem } from '@/types';

export default function AnalysisWorkspacePage() {
  const params = useParams();
  const runId = (params.id as string) || 'analysis-urban-growth';

  const scenario = findScenario(runId);
  const result: AnalysisResult = scenario
    ? scenario.result
    : runId.includes('flood')
    ? floodImpactResult()
    : runId.includes('single')
    ? singleVqaResult()
    : urbanGrowthResult();

  const [activeTab, setActiveTab] = useState<'answer' | 'evidence' | 'compare' | 'audit'>('answer');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [activeDate, setActiveDate] = useState<'T1' | 'T2'>('T2');
  const [showPolygons, setShowPolygons] = useState(true);

  const handleOpenEvidence = (ev: EvidenceItem) => {
    setSelectedEvidence(ev);
    setDrawerOpen(true);
  };

  return (
    <AppShell>
      <div className="flex-1 flex flex-col font-sans bg-[#07111F]">
        {/* Top Analysis Header */}
        <div className="border-b border-[#1E293B] bg-[#0B132B] px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-[#38BDF8]">
                  RUN {result.id}
                </span>
                <span className="text-[#64748B] text-xs">·</span>
                <h1 className="text-sm font-semibold text-[#F8FAFC] truncate">
                  {scenario?.title || 'Multimodal Remote-Sensing Analysis'}
                </h1>
                <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.2 rounded border border-[#10B981]/20">
                  {result.verdict}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] truncate max-w-2xl">
                “{result.query}”
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/reports/${runId}`}>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs font-medium bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                <Download size={12} className="mr-1" />
                <span>Export Dossier</span>
              </Button>
            </Link>

            <Button
              size="sm"
              onClick={() => setDrawerOpen(true)}
              className="h-7 px-3 text-xs font-medium bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8]"
            >
              <span>Why this answer?</span>
            </Button>
          </div>
        </div>

        {/* Persistent Sub-Navigation Tabs */}
        <div className="bg-[#07111F] border-b border-[#1E293B] px-4 lg:px-8 flex items-center justify-between">
          <nav className="flex items-center gap-1 -mb-px">
            <Link
              href={`/analyses/${runId}`}
              className="px-3.5 py-2 text-xs font-semibold text-[#F8FAFC] border-b-2 border-[#38BDF8]"
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
              className="px-3.5 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
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

          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-[#64748B]">
            <span>EPSG:4326</span>
            <span>·</span>
            <span>{result.location}</span>
          </div>
        </div>

        {/* Main Workspace: Map Centerpiece & Structured Report Result */}
        <div className="flex-1 grid lg:grid-cols-12 gap-0 overflow-hidden">
          {/* Left / Center Map (60% width on large screens) */}
          <div className="lg:col-span-7 relative bg-[#050A14] min-h-[380px] lg:min-h-full flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#1E293B] overflow-hidden select-none">
            {/* Map Imagery */}
            <img
              src={
                activeDate === 'T1'
                  ? result.temporalComparison.t1.imagery
                  : result.temporalComparison.t2.imagery || result.evidence[0]?.imagery.source || ''
              }
              alt="Analytical scene"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Bounding Vector Polygon Overlays */}
            {showPolygons && (
              <div className="absolute inset-0 pointer-events-none">
                {result.evidence.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      top: `${item.region.y}%`,
                      left: `${item.region.x}%`,
                      width: `${item.region.width}%`,
                      height: `${item.region.height}%`,
                    }}
                    onClick={() => handleOpenEvidence(item)}
                    className="absolute border border-[#38BDF8] bg-[#38BDF8]/10 rounded-xs pointer-events-auto cursor-pointer hover:bg-[#38BDF8]/20 transition-all flex items-start p-1"
                  >
                    <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-[#07111F] text-[#38BDF8] border border-[#1E293B]">
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Floating Minimal Controls */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#07111F] border border-[#1E293B] p-1 rounded-md z-20">
              <button
                onClick={() => setActiveDate('T1')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  activeDate === 'T1' ? 'bg-[#1E293B] text-[#F8FAFC]' : 'text-[#64748B] hover:text-[#94A3B8]'
                }`}
              >
                Jan 2026 (T1)
              </button>
              <button
                onClick={() => setActiveDate('T2')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  activeDate === 'T2' ? 'bg-[#1E293B] text-[#F8FAFC]' : 'text-[#64748B] hover:text-[#94A3B8]'
                }`}
              >
                Aug 2026 (T2)
              </button>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#07111F] border border-[#1E293B] p-1 rounded-md z-20">
              <button
                onClick={() => setShowPolygons(!showPolygons)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  showPolygons ? 'bg-[#1E293B] text-[#38BDF8]' : 'text-[#64748B] hover:text-[#94A3B8]'
                }`}
              >
                Vectors {showPolygons ? 'On' : 'Off'}
              </button>
            </div>

            <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded bg-[#07111F] border border-[#1E293B] text-[10px] font-mono text-[#64748B] z-20">
              AOI: {result.location} · 4.2 km²
            </div>
          </div>

          {/* Right Panel: Structured Report Block (40% width) */}
          <div className="lg:col-span-5 bg-[#0B132B] flex flex-col justify-between overflow-y-auto p-5 sm:p-6 space-y-6">
            <div className="space-y-5">
              {/* Target Layout Result Block */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono font-medium text-[#64748B] uppercase tracking-wider block">
                  Finding &amp; Synthesis
                </span>
                <h2 className="text-base sm:text-lg font-semibold text-[#F8FAFC] leading-snug">
                  {result.answer}
                </h2>
                <div className="text-xs text-[#94A3B8]">
                  {result.evidence.length} evidence regions · Optical + SAR corroboration
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link href={`/analyses/${runId}/evidence`}>
                  <Button size="sm" className="h-8 px-3.5 text-xs font-semibold bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8]">
                    <span>View Evidence</span>
                  </Button>
                </Link>
                <Link href={`/analyses/${runId}/compare`}>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium bg-[#0F172A] border-[#1E293B] text-[#E2E8F0] hover:bg-[#1E293B]">
                    <span>Compare</span>
                  </Button>
                </Link>
                <Link href={`/reports/${runId}`}>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium bg-[#0F172A] border-[#1E293B] text-[#E2E8F0] hover:bg-[#1E293B]">
                    <span>Export Report</span>
                  </Button>
                </Link>
              </div>

              {/* Restrained Analytical Confidence Display */}
              <div className="p-4 rounded-lg bg-[#07111F] border border-[#1E293B] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F1F5F9]">System Confidence</span>
                  <span className="font-mono text-[#10B981] font-medium">
                    {Math.round(result.confidence * 100)}% High
                  </span>
                </div>

                <div className="h-1.5 w-full bg-[#0B132B] rounded-full overflow-hidden border border-[#1E293B]">
                  <div
                    style={{ width: `${Math.round(result.confidence * 100)}%` }}
                    className="h-full bg-[#10B981] rounded-full"
                  />
                </div>

                <div className="text-[11px] text-[#64748B] font-mono">
                  Calibrated via Platt temperature scaling (T=1.35, ECE: 3.7%)
                </div>
              </div>

              {/* Sensor Agreement Checklist */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#64748B] uppercase block">
                  Sensor Agreement Checklist
                </span>
                <div className="space-y-1.5 text-xs text-[#94A3B8]">
                  <div className="flex items-center justify-between p-2.5 rounded bg-[#07111F] border border-[#1E293B]">
                    <div className="flex items-center gap-2">
                      <Check size={13} className="text-[#10B981]" />
                      <span>Optical NDVI Spectral Shift</span>
                    </div>
                    <span className="font-mono text-[#E2E8F0]">0.89</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded bg-[#07111F] border border-[#1E293B]">
                    <div className="flex items-center gap-2">
                      <Check size={13} className="text-[#10B981]" />
                      <span>SAR Radar Double-Bounce</span>
                    </div>
                    <span className="font-mono text-[#E2E8F0]">0.91 (+8.4 dB)</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded bg-[#07111F] border border-[#1E293B]">
                    <div className="flex items-center gap-2">
                      <Check size={13} className="text-[#10B981]" />
                      <span>Spatial Geometry Grounding</span>
                    </div>
                    <span className="font-mono text-[#E2E8F0]">6 Polygons</span>
                  </div>
                </div>
              </div>

              {/* Bottom Evidence Strip Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#64748B] uppercase">
                    Evidence Regions
                  </span>
                  <Link
                    href={`/analyses/${runId}/evidence`}
                    className="text-[11px] text-[#38BDF8] hover:underline"
                  >
                    Inspect all 6
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {result.evidence.slice(0, 3).map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => handleOpenEvidence(item)}
                      className="p-2 rounded bg-[#07111F] border border-[#1E293B] hover:border-[#334155] text-left transition-colors space-y-1"
                    >
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-[#38BDF8]">#{idx + 1}</span>
                        <span className="text-[#10B981]">
                          {typeof item.confidence === 'string'
                            ? item.confidence.toUpperCase()
                            : `${Math.round((item.confidenceScore || 0.9) * 100)}%`}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-[#E2E8F0] truncate">
                        {item.type}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer metadata */}
            <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
              <span>SHA-256: e3b0c442...855</span>
              <Link href={`/analyses/${runId}/audit`} className="text-[#38BDF8] hover:underline">
                Audit Trail
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over "Why this answer?" Drawer */}
      <EvidenceDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        result={result}
        onSelectEvidence={(ev) => setSelectedEvidence(ev)}
      />
    </AppShell>
  );
}
