'use client';

import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface ComparisonViewerProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function ComparisonViewer({
  beforeImage,
  afterImage,
  beforeLabel = 'T1',
  afterLabel = 'T2',
  className,
}: ComparisonViewerProps) {
  const [splitPct, setSplitPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full overflow-hidden rounded-lg border border-[#24344A] bg-[#07111F]', className)}
    >
      <img
        src={afterImage}
        alt={afterLabel}
        className="w-full h-full object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${splitPct}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 h-full object-cover"
          style={{ width: containerRef.current?.clientWidth ?? '100%' }}
          draggable={false}
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-[#20A4F3] shadow-md cursor-ew-resize"
        style={{ left: `${splitPct}%` }}
        onMouseDown={(e) => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;
          const move = (ev: MouseEvent) => {
            const pct = Math.max(0, Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100));
            setSplitPct(pct);
          };
          const up = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
          };
          window.addEventListener('mousemove', move);
          window.addEventListener('mouseup', up);
        }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#101C2E] border border-[#20A4F3] shadow-lg flex items-center justify-center text-[#20A4F3]">
          <MoveHorizontal size={15} />
        </div>
      </div>
      <div className="absolute top-2 left-2 px-2.5 py-1 rounded text-[10px] font-mono font-bold text-[#F3F7FC] bg-[#07111F]/90 border border-[#24344A]">
        {beforeLabel}
      </div>
      <div className="absolute top-2 right-2 px-2.5 py-1 rounded text-[10px] font-mono font-bold text-[#F3F7FC] bg-[#07111F]/90 border border-[#24344A]">
        {afterLabel}
      </div>
    </div>
  );
}
