'use client';

import React from 'react';
import { Check, Circle } from 'lucide-react';

interface AnalysisProgressProps {
  currentStage: number; // 0 to 5
}

export function AnalysisProgress({ currentStage }: AnalysisProgressProps) {
  const stages = [
    {
      id: 0,
      title: 'Validating Query & CRS Bounds',
      detail: 'Verified co-registered GeoTIFFs (EPSG:4326), cloud cover 0.4%',
    },
    {
      id: 1,
      title: 'Classifying Task & Routing Pipeline',
      detail: 'Assigned ChangeFormer-RS + SAR-PolarCoherence',
    },
    {
      id: 2,
      title: 'Executing Spectral Difference Models',
      detail: 'Generated bi-temporal difference mask (17 candidates)',
    },
    {
      id: 3,
      title: 'Cross-Checking Radar Coherence',
      detail: 'Corroborated 6 vertical double-bounce returns (+8.4 dB)',
    },
    {
      id: 4,
      title: 'Grounding Evidence & Calibrating Confidence',
      detail: 'Platt scaling applied (T=1.35, 92% confidence)',
    },
    {
      id: 5,
      title: 'Synthesizing Auditable Briefing',
      detail: 'Formulating structured finding and sealing audit log',
    },
  ];

  return (
    <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-6 space-y-5 font-sans">
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
        <div className="space-y-0.5">
          <span className="text-[11px] font-mono font-medium text-[#64748B] uppercase tracking-wider">
            Execution Progress
          </span>
          <h3 className="text-sm sm:text-base font-semibold text-[#F8FAFC]">
            Processing Multi-Sensor Satellite Data
          </h3>
        </div>
        <span className="text-xs font-mono text-[#38BDF8]">
          Stage {Math.min(currentStage + 1, stages.length)} of {stages.length}
        </span>
      </div>

      {/* Sequential Clean Step List */}
      <div className="space-y-3">
        {stages.map((st) => {
          const isDone = currentStage > st.id;
          const isCurrent = currentStage === st.id;

          return (
            <div
              key={st.id}
              className={`p-3 rounded-lg border transition-colors flex items-start gap-3 ${
                isCurrent
                  ? 'bg-[#07111F] border-[#38BDF8]/50'
                  : isDone
                  ? 'bg-[#07111F]/60 border-[#1E293B]'
                  : 'bg-transparent border-transparent opacity-40'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <div className="w-4 h-4 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                    <Check size={11} />
                  </div>
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-[#1E293B] border-t-[#38BDF8] animate-spin" />
                ) : (
                  <Circle size={14} className="text-[#64748B]" />
                )}
              </div>

              <div className="space-y-0.5 min-w-0 flex-1">
                <div
                  className={`text-xs font-medium ${
                    isCurrent
                      ? 'text-[#38BDF8] font-semibold'
                      : isDone
                      ? 'text-[#F1F5F9]'
                      : 'text-[#64748B]'
                  }`}
                >
                  {st.title}
                </div>
                {(isDone || isCurrent) && (
                  <p className="text-[11px] text-[#94A3B8] font-mono leading-snug">
                    {st.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
