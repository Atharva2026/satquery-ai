'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AnalysisPlan as AnalysisPlanType } from '@/types';

interface AnalysisPlanProps {
  plan: AnalysisPlanType;
  onConfirmPlan: () => void;
  onCustomizePlan?: () => void;
}

export function AnalysisPlan({
  plan,
  onConfirmPlan,
  onCustomizePlan,
}: AnalysisPlanProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-5 sm:p-6 space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
        <div>
          <span className="text-[11px] font-mono font-medium text-[#64748B] uppercase tracking-wider">
            Analysis Plan
          </span>
          <h3 className="text-sm sm:text-base font-semibold text-[#F8FAFC] mt-0.5">
            {plan.summary}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {onCustomizePlan && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCustomizePlan}
              className="h-8 px-2.5 text-xs font-medium bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <Sliders size={12} className="mr-1" />
              <span>Customize</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={onConfirmPlan}
            className="h-8 px-4 text-xs font-semibold bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] transition-colors"
          >
            <span>Confirm &amp; Run</span>
          </Button>
        </div>
      </div>

      {/* Specialist Model Sequence Steps */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono text-[#64748B] uppercase">
          Orchestration Sequence
        </div>

        <div className="grid sm:grid-cols-3 gap-2.5">
          {(plan.specialists || []).map((spec, idx) => (
            <div
              key={spec.id}
              className="p-3 rounded-lg bg-[#07111F] border border-[#1E293B] space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-medium text-[#38BDF8]">
                  Stage {idx + 1}
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">
                  {spec.role.toUpperCase()}
                </span>
              </div>
              <div className="text-xs font-semibold text-[#F1F5F9]">{spec.name}</div>
              <p className="text-[11px] text-[#94A3B8] leading-snug">{spec.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Optional details toggle */}
      <div className="pt-2 border-t border-[#1E293B]/60 flex items-center justify-between text-xs text-[#64748B]">
        <button
          onClick={() => setExpanded(!expanded)}
          className="hover:text-[#94A3B8] flex items-center gap-1 transition-colors"
        >
          <span>{expanded ? 'Hide configuration parameters' : 'View configuration parameters'}</span>
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        <span className="font-mono text-[11px]">EPSG:4326 · Platt Scaled (T=1.35)</span>
      </div>

      {expanded && (
        <div className="p-3 rounded-lg bg-[#07111F] border border-[#1E293B] space-y-1.5 font-mono text-[11px] text-[#94A3B8]">
          <div className="flex justify-between">
            <span>Confidence Threshold:</span>
            <span className="text-[#F1F5F9]">0.70</span>
          </div>
          <div className="flex justify-between">
            <span>Cross-Sensor Agreement:</span>
            <span className="text-[#F1F5F9]">Enforced (Optical + SAR)</span>
          </div>
          <div className="flex justify-between">
            <span>Abstention Rule:</span>
            <span className="text-[#10B981]">Active (Refuse on severe occlusion)</span>
          </div>
        </div>
      )}
    </div>
  );
}
