'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function LandingOrchestration() {
  const [expanded, setExpanded] = useState(false);

  const nodes = [
    { id: '1', label: '1. Question', desc: 'Intent parsing & AOI extraction' },
    { id: '2', label: '2. Validate', desc: 'CRS, bounds & cloud check' },
    { id: '3', label: '3. Route', desc: 'Specialist architecture assignment' },
    { id: '4', label: '4. Specialists', desc: 'ChangeFormer, Coherence & Grounding' },
    { id: '5', label: '5. Evidence', desc: 'Spatial grounding & consensus' },
    { id: '6', label: '6. Confidence', desc: 'Temperature scaling calibration' },
    { id: '7', label: '7. Answer', desc: 'Verified synthesis & audit trail' },
  ];

  const traceEvents = [
    { time: '10:24:31', phase: 'Intake', label: 'Parsed intent: bi-temporal change query' },
    { time: '10:24:32', phase: 'Validation', label: 'Validated 2 GeoTIFFs (EPSG:4326), cloud cover 0.4%' },
    { time: '10:24:34', phase: 'Planner', label: 'Routed to ChangeFormer-RS + SAR-PolarCoherence pipeline' },
    { time: '10:25:12', phase: 'Specialist', label: 'Generated NDCI difference heatmap; isolated 17 candidates' },
    { time: '10:25:28', phase: 'SAR Fusion', label: 'Corroborated 5 vertical double-bounce returns (+8.4 dB)' },
    { time: '10:25:49', phase: 'Evidence', label: 'Bound 6 verified regions to spatial coordinates' },
    { time: '10:26:22', phase: 'Calibration', label: 'Platt scaling applied (T=1.35, Calibrated confidence: 92%)' },
    { time: '10:26:35', phase: 'Synthesis', label: 'Signed auditable intelligence briefing' },
  ];

  return (
    <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-medium text-[#64748B] uppercase tracking-wider">
            Execution Pipeline
          </span>
          <h3 className="text-lg font-semibold text-[#F8FAFC] mt-0.5">
            Observable Orchestration from Query to Evidence
          </h3>
          <p className="text-xs text-[#94A3B8] mt-1">
            Every output is traceable through verified operational stages.
          </p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0F172A] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors self-start md:self-auto"
        >
          <span>{expanded ? 'Hide Trace' : 'Inspect Trace'}</span>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* 7-Node Horizontal Chain */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="p-3 rounded-lg bg-[#07111F] border border-[#1E293B] flex flex-col justify-between space-y-1.5"
          >
            <div className="text-xs font-semibold text-[#F1F5F9]">{node.label}</div>
            <div className="text-[11px] text-[#64748B] leading-snug">{node.desc}</div>
          </div>
        ))}
      </div>

      {/* Expandable Trace View */}
      {expanded && (
        <div className="p-4 rounded-lg bg-[#07111F] border border-[#1E293B] space-y-2">
          <div className="text-[10px] font-mono text-[#64748B] uppercase">
            Run Event Log (Audit Trail)
          </div>
          <div className="space-y-1 font-mono text-xs">
            {traceEvents.map((evt, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 px-2.5 rounded bg-[#0B132B] border border-[#1E293B]/60 text-[11px]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#64748B]">{evt.time}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#0F172A] text-[#38BDF8] border border-[#1E293B]">
                    {evt.phase}
                  </span>
                  <span className="text-[#CBD5E1]">{evt.label}</span>
                </div>
                <span className="text-[#10B981] text-[10px]">Complete</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
