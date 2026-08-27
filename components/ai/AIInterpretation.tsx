'use client';

import React from 'react';
import { Compass, Database, MapPin, Clock } from 'lucide-react';
import type { Interpretation } from '@/types';

interface AIInterpretationProps {
  interpretation: Interpretation;
  onEditChip?: (key: keyof Interpretation) => void;
}

export function AIInterpretation({
  interpretation,
  onEditChip,
}: AIInterpretationProps) {
  const items = [
    {
      key: 'task' as keyof Interpretation,
      label: 'Task',
      value: interpretation.task,
      icon: Compass,
      color: '#38BDF8',
    },
    {
      key: 'inputs' as keyof Interpretation,
      label: 'Inputs',
      value: interpretation.inputs,
      icon: Database,
      color: '#38BDF8',
    },
    {
      key: 'area' as keyof Interpretation,
      label: 'Observation Area',
      value: interpretation.area,
      icon: MapPin,
      color: '#38BDF8',
    },
    {
      key: 'time' as keyof Interpretation,
      label: 'Time Interval',
      value: interpretation.time,
      icon: Clock,
      color: '#38BDF8',
    },
  ];

  return (
    <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-4 sm:p-5 space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
        <span className="text-[11px] font-mono font-medium text-[#64748B] uppercase tracking-wider">
          Request Summary
        </span>
        <span className="text-[10px] font-mono text-[#94A3B8]">
          Auto-classified
        </span>
      </div>

      {/* 4 Clean Attribute Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {items.map((item) => (
          <div
            key={item.key}
            onClick={() => onEditChip?.(item.key)}
            className="p-3 rounded-lg bg-[#07111F] border border-[#1E293B] hover:border-[#334155] cursor-pointer transition-colors space-y-1"
          >
            <div className="text-[10px] font-mono text-[#64748B] uppercase">
              {item.label}
            </div>
            <div className="text-xs font-semibold text-[#F1F5F9] truncate">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
