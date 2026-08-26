'use client';

import { cn } from '@/lib/utils';
import type { TemporalComparison } from '@/types';
import { useState, useCallback } from 'react';

interface TimelineProps {
  comparison: TemporalComparison;
  className?: string;
  onScrub?: (t: 'T1' | 'T2') => void;
}

export function Timeline({ comparison, className, onScrub }: TimelineProps) {
  const [active, setActive] = useState<'T1' | 'T2'>('T2');
  const [scrubPct, setScrubPct] = useState(100);

  const handleScrub = useCallback(
    (clientX: number, rect: DOMRect) => {
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      setScrubPct(pct);
      const t = pct < 50 ? 'T1' : 'T2';
      if (t !== active) {
        setActive(t);
        onScrub?.(t);
      }
    },
    [active, onScrub],
  );

  return (
    <div className={cn('select-none bg-[#0B1628] text-[#F3F7FC]', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#A8B5C7] uppercase tracking-wider">
            Temporal Sequence
          </span>
          <span className="text-xs text-[#718096] font-mono">
            {comparison.t1.sensor} → {comparison.t2.sensor}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => {
              setActive('T1');
              setScrubPct(0);
              onScrub?.('T1');
            }}
            className={cn(
              'px-2.5 py-0.5 rounded transition-colors font-bold',
              active === 'T1'
                ? 'bg-[#102B45] text-[#35B7FF] border border-[#20A4F3]/40'
                : 'text-[#A8B5C7] hover:bg-[#142238] hover:text-[#F3F7FC]',
            )}
          >
            {comparison.t1.label}
          </button>
          <button
            onClick={() => {
              setActive('T2');
              setScrubPct(100);
              onScrub?.('T2');
            }}
            className={cn(
              'px-2.5 py-0.5 rounded transition-colors font-bold',
              active === 'T2'
                ? 'bg-[#102B45] text-[#35B7FF] border border-[#20A4F3]/40'
                : 'text-[#A8B5C7] hover:bg-[#142238] hover:text-[#F3F7FC]',
            )}
          >
            {comparison.t2.label}
          </button>
        </div>
      </div>

      <div
        className="relative h-7 cursor-pointer touch-none"
        onMouseDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          handleScrub(e.clientX, rect);
          const move = (ev: MouseEvent) => handleScrub(ev.clientX, rect);
          const up = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
          };
          window.addEventListener('mousemove', move);
          window.addEventListener('mouseup', up);
        }}
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[#0D192A] border border-[#24344A]" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[#20A4F3] transition-all"
          style={{ width: `${scrubPct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F3F7FC] border-2 border-[#20A4F3] shadow-md transition-all"
          style={{ left: `${scrubPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-1 text-xs">
        <div>
          <div className="font-semibold text-[#F3F7FC]">{comparison.t1.date}</div>
          <div className="text-[10px] text-[#718096] font-mono">
            {comparison.t1.label} · {comparison.t1.sensor}
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-[#F3F7FC]">{comparison.t2.date}</div>
          <div className="text-[10px] text-[#718096] font-mono">
            {comparison.t2.label} · {comparison.t2.sensor}
          </div>
        </div>
      </div>
    </div>
  );
}
