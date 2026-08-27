'use client';

import { cn } from '@/lib/utils';
import type { EvidenceItem } from '@/types';
import { MapPin, Layers, Crosshair } from 'lucide-react';

interface EvidenceCardProps {
  evidence: EvidenceItem;
  selected?: boolean;
  hovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovered: boolean) => void;
  className?: string;
  compact?: boolean;
}

export function EvidenceCard({
  evidence,
  selected = false,
  hovered = false,
  onSelect,
  onHover,
  className,
  compact = false,
}: EvidenceCardProps) {
  const numConfidence =
    typeof evidence.confidence === 'number'
      ? evidence.confidence
      : evidence.confidence === 'high'
      ? 0.92
      : evidence.confidence === 'moderate'
      ? 0.65
      : 0.3;

  const pct = Math.round(numConfidence * 100);
  const color =
    numConfidence >= 0.7 ? '#19C37D' : numConfidence >= 0.4 ? '#F5A524' : '#7D8CA3';

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      className={cn(
        'w-full min-w-0 text-left rounded-lg border transition-all duration-150 overflow-hidden select-none',
        selected
          ? 'border-[#20A4F3] bg-[#102B45] ring-1 ring-[#20A4F3]/40 shadow-sm'
          : hovered
            ? 'border-[#20A4F3]/60 bg-[#142238] shadow-xs'
            : 'border-[#24344A] bg-[#101C2E] hover:border-[#24344A] hover:bg-[#142238]',
        compact ? 'p-3' : 'p-4',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs font-bold text-[#20A4F3] bg-[#07111F] px-1.5 py-0.5 rounded border border-[#24344A] shrink-0">
            {evidence.id}
          </span>
          <span className="text-xs font-semibold text-[#F3F7FC] truncate">
            {evidence.type}
          </span>
        </div>
        <span
          className="font-mono text-xs font-bold tabular-nums shrink-0"
          style={{ color }}
        >
          {pct}%
        </span>
      </div>
      {!compact && (
        <p className="text-xs text-[#A8B5C7] leading-relaxed break-words line-clamp-2 mb-3">
          {evidence.opticalNotes}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#A8B5C7] font-medium pt-1.5 border-t border-[#24344A]">
        <span className="flex items-center gap-1 shrink-0">
          <Layers size={12} className="text-[#718096]" />
          {evidence.sensors.join(' + ')}
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <Crosshair size={12} className="text-[#718096]" />
          {evidence.temporal ? `${evidence.temporal.t1} → ${evidence.temporal.t2}` : 'Observation Pass'}
        </span>
        {!compact && (
          <span className="flex items-center gap-1 truncate max-w-full">
            <MapPin size={12} className="text-[#718096] shrink-0" />
            <span className="truncate">{evidence.location}</span>
          </span>
        )}
      </div>
    </button>
  );
}
