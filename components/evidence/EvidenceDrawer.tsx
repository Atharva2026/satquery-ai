'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  ExternalLink,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AnalysisResult, EvidenceItem } from '@/types';

interface EvidenceDrawerProps {
  open: boolean;
  onClose: () => void;
  result: AnalysisResult;
  onSelectEvidence?: (evidence: EvidenceItem) => void;
}

export function EvidenceDrawer({
  open,
  onClose,
  result,
  onSelectEvidence,
}: EvidenceDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0B132B] border-l border-[#1E293B] shadow-2xl flex flex-col font-sans">
      {/* Header */}
      <div className="p-4 bg-[#0F172A] border-b border-[#1E293B] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono font-medium text-[#64748B] uppercase tracking-wider">
            Verification Basis
          </span>
          <h3 className="text-sm font-semibold text-[#F8FAFC]">
            Evidence &amp; Sensor Consensus
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Finding Summary */}
        <div className="p-3.5 rounded-lg bg-[#07111F] border border-[#1E293B] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#F1F5F9]">System Finding</span>
            <span className="font-mono text-[#10B981] font-medium">
              {Math.round(result.confidence * 100)}% Confidence
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">{result.answer}</p>
        </div>

        {/* Sensor Basis Comparison */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-[#64748B] uppercase block">
            Sensor Consensus
          </span>
          <div className="space-y-1.5 text-xs">
            <div className="p-3 rounded-lg bg-[#07111F] border border-[#1E293B] space-y-1">
              <div className="flex justify-between font-medium text-[#E2E8F0]">
                <span>Optical Imagery (Sentinel-2)</span>
                <span className="font-mono text-[#10B981]">Concurred (0.89)</span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Vegetation loss &amp; spectral reflectance shift indicate new structural footprint.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#07111F] border border-[#1E293B] space-y-1">
              <div className="flex justify-between font-medium text-[#E2E8F0]">
                <span>SAR Radar Backscatter (Sentinel-1)</span>
                <span className="font-mono text-[#10B981]">Verified (0.91)</span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Vertical double-bounce microwave return confirms building structure (+8.4 dB).
              </p>
            </div>
          </div>
        </div>

        {/* Evidence Regions List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#64748B] uppercase">
              Spatial Regions ({result.evidence.length})
            </span>
            <Link
              href={`/analyses/${result.id}/evidence`}
              className="text-[11px] text-[#38BDF8] hover:underline"
            >
              Open inspector
            </Link>
          </div>

          <div className="space-y-2">
            {result.evidence.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onSelectEvidence?.(item)}
                className="p-3 rounded-lg bg-[#07111F] border border-[#1E293B] hover:border-[#334155] cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F1F5F9]">
                    {idx + 1}. {item.type}
                  </span>
                  <span className="font-mono text-[11px] text-[#10B981]">
                    {typeof item.confidence === 'string'
                      ? item.confidence.toUpperCase()
                      : `${Math.round((item.confidenceScore || 0.9) * 100)}%`}
                  </span>
                </div>

                {item.imagery.before && item.imagery.after && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-16 rounded overflow-hidden border border-[#1E293B]">
                      <img
                        src={item.imagery.before}
                        alt="T1 crop"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="h-16 rounded overflow-hidden border border-[#38BDF8]/40">
                      <img
                        src={item.imagery.after}
                        alt="T2 crop"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-[#94A3B8] leading-snug line-clamp-2">
                  {item.opticalNotes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-[#0F172A] border-t border-[#1E293B]">
        <Link href={`/analyses/${result.id}/evidence`}>
          <Button className="w-full h-8 text-xs font-semibold bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8]">
            <span>Open Full 3-Column Evidence View</span>
            <ExternalLink size={12} className="ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
