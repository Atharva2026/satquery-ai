'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Eye,
  GitCompare,
  Layers,
  Download,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  MapPin,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { findScenario, urbanGrowthResult, floodImpactResult, singleVqaResult } from '@/lib/mock-data';
import type { AnalysisResult, EvidenceItem } from '@/types';

export default function ExpertEvidencePage() {
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

  const [selectedItem, setSelectedItem] = useState<EvidenceItem>(
    result.evidence[0] || {
      id: 'EV-1001',
      type: 'New structure',
      label: 'R-01',
      confidence: 'high',
      sensors: ['OPTICAL', 'SAR'],
      region: { id: 'bb-1', x: 22, y: 28, width: 14, height: 16, label: 'R-01' },
      imagery: { before: '', after: '' },
      location: 'Pune Extension',
    }
  );

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
                  Spatial Evidence Inspector
                </h1>
                <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.2 rounded border border-[#10B981]/20">
                  {result.evidence.length} Verified Regions
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] truncate max-w-xl">
                “{result.query}”
              </p>
            </div>
          </div>

          <Link href={`/reports/${runId}`}>
            <Button
              size="sm"
              className="h-7 px-3 text-xs font-medium bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8]"
            >
              <Download size={12} className="mr-1" />
              <span>Export Evidence Package</span>
            </Button>
          </Link>
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
              className="px-3.5 py-2 text-xs font-semibold text-[#F8FAFC] border-b-2 border-[#38BDF8]"
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
        </div>

        {/* 3-Column Expert Evidence Layout */}
        <div className="flex-1 grid lg:grid-cols-12 gap-0 overflow-hidden">
          {/* Col 1: Region List (3 cols) */}
          <div className="lg:col-span-3 bg-[#0B132B] border-b lg:border-b-0 lg:border-r border-[#1E293B] p-4 space-y-3 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-medium text-[#64748B] uppercase">
                Grounded Regions
              </span>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                {result.evidence.length} Total
              </span>
            </div>

            <div className="space-y-1.5">
              {result.evidence.map((item, idx) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors space-y-1 ${
                      isSelected
                        ? 'bg-[#07111F] border-[#38BDF8]'
                        : 'bg-[#07111F]/60 border-[#1E293B] hover:border-[#334155]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-[#0F172A] text-[10px] font-mono font-medium text-[#38BDF8] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-[#F1F5F9] truncate max-w-[120px]">
                          {item.type}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#10B981]">
                        {typeof item.confidence === 'string'
                          ? item.confidence.toUpperCase()
                          : `${Math.round((item.confidenceScore || 0.9) * 100)}%`}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64748B] truncate font-mono">
                      Sensors: {item.sensors.join(', ')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Col 2: Map with Selected Geometry (5 cols) */}
          <div className="lg:col-span-5 relative bg-[#050A14] min-h-[340px] lg:min-h-full flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#1E293B] overflow-hidden select-none">
            <img
              src={selectedItem?.imagery.after || result.temporalComparison.t2.imagery || result.evidence[0]?.imagery.source || ''}
              alt="Map scene"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Selected Polygon Highlight */}
            {selectedItem && (
              <div
                style={{
                  top: `${selectedItem.region.y}%`,
                  left: `${selectedItem.region.x}%`,
                  width: `${selectedItem.region.width}%`,
                  height: `${selectedItem.region.height}%`,
                }}
                className="absolute border border-[#38BDF8] bg-[#38BDF8]/15 rounded-xs z-20 flex items-start p-1"
              >
                <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-[#07111F] text-[#38BDF8] border border-[#1E293B]">
                  {selectedItem.id} ({selectedItem.type})
                </span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-[#07111F] border border-[#1E293B] text-[10px] font-mono text-[#64748B] z-30">
              CRS: EPSG:4326
            </div>
          </div>

          {/* Col 3: Inspector Panel (4 cols) */}
          <div className="lg:col-span-4 bg-[#0B132B] p-5 space-y-5 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div>
                <span className="text-[11px] font-mono font-medium text-[#64748B] uppercase">
                  Inspector
                </span>
                <h3 className="text-sm font-semibold text-[#F8FAFC]">{selectedItem?.type}</h3>
              </div>
              <span className="text-xs font-mono text-[#10B981]">
                {selectedItem?.id}
              </span>
            </div>

            {/* Multi-Date Crops */}
            {selectedItem?.imagery.before && selectedItem?.imagery.after && (
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#64748B] uppercase">
                  Multi-Date Crops
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#64748B]">T1 BASELINE</span>
                    <div className="h-24 rounded overflow-hidden border border-[#1E293B]">
                      <img
                        src={selectedItem.imagery.before}
                        alt="T1 crop"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#38BDF8]">T2 DETECTED</span>
                    <div className="h-24 rounded overflow-hidden border border-[#38BDF8]/40">
                      <img
                        src={selectedItem.imagery.after}
                        alt="T2 crop"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Observation Basis Notes */}
            <div className="space-y-2.5 text-xs font-sans">
              <span className="text-[11px] font-mono text-[#64748B] uppercase block">
                Observation Basis
              </span>

              {selectedItem?.opticalNotes && (
                <div className="p-3 rounded-lg bg-[#07111F] border border-[#1E293B] space-y-1">
                  <span className="font-semibold text-[#F1F5F9] block">
                    Optical Basis
                  </span>
                  <p className="text-[#94A3B8] leading-relaxed text-[11px]">
                    {selectedItem.opticalNotes}
                  </p>
                </div>
              )}

              {selectedItem?.sarNotes && (
                <div className="p-3 rounded-lg bg-[#07111F] border border-[#1E293B] space-y-1">
                  <span className="font-semibold text-[#F1F5F9] block">
                    SAR Radar Basis
                  </span>
                  <p className="text-[#94A3B8] leading-relaxed text-[11px]">
                    {selectedItem.sarNotes}
                  </p>
                </div>
              )}

              {selectedItem?.limitations && selectedItem.limitations.length > 0 && (
                <div className="p-3 rounded-lg bg-[#07111F] border border-[#F59E0B]/30 space-y-1">
                  <span className="font-semibold text-[#F59E0B] block">
                    Quality Limitations
                  </span>
                  <p className="text-[#94A3B8] leading-relaxed text-[11px]">
                    {selectedItem.limitations.join(' ')}
                  </p>
                </div>
              )}
            </div>

            {/* Export Selection CTA */}
            <div className="pt-3 border-t border-[#1E293B]">
              <Link href={`/reports/${runId}`}>
                <Button
                  variant="outline"
                  className="w-full h-8 text-xs font-medium bg-[#0F172A] border-[#1E293B] text-[#E2E8F0] hover:bg-[#1E293B] justify-center gap-1.5"
                >
                  <Download size={12} />
                  <span>Download GeoJSON Layer</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
