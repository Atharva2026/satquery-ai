'use client';

import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, Compass, Ruler, Grid3x3, Maximize2 } from 'lucide-react';
import { useState } from 'react';

interface MapToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset?: () => void;
  coordinates: { lat: number; lng: number };
  showGrid?: boolean;
  onToggleGrid?: () => void;
  className?: string;
}

export function MapToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  coordinates,
  showGrid = true,
  onToggleGrid,
  className,
}: MapToolbarProps) {
  const [showScale, setShowScale] = useState(true);

  const toolBtn =
    'flex h-7 w-7 items-center justify-center rounded text-[#A8B5C7] transition-colors duration-150 hover:bg-[#142238] hover:text-[#F3F7FC]';

  return (
    <>
      <div className={cn('absolute right-3 top-3 z-20', className)}>
        <div className="flex items-center gap-0.5 rounded-lg border border-[#24344A] bg-[rgba(11,22,40,0.92)] p-1 shadow-sm select-none backdrop-blur-xs">
          <button type="button" onClick={onZoomIn} className={toolBtn} aria-label="Zoom in" title="Zoom In">
            <ZoomIn size={14} />
          </button>
          <button type="button" onClick={onZoomOut} className={toolBtn} aria-label="Zoom out" title="Zoom Out">
            <ZoomOut size={14} />
          </button>
          <div className="mx-0.5 h-4 w-px bg-[#24344A]" />
          <button
            type="button"
            onClick={onToggleGrid}
            className={cn(toolBtn, showGrid && 'bg-[#102B45] text-[#35B7FF] font-bold')}
            aria-label="Toggle grid"
            title="Toggle Grid"
          >
            <Grid3x3 size={14} />
          </button>
          <button
            type="button"
            onClick={() => setShowScale((v) => !v)}
            className={cn(toolBtn, showScale && 'bg-[#102B45] text-[#35B7FF] font-bold')}
            aria-label="Toggle scale"
            title="Toggle Scale Bar"
          >
            <Ruler size={14} />
          </button>
          <button type="button" onClick={onReset} className={toolBtn} aria-label="Reset view" title="Reset View">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      <div className="absolute left-3 top-3 z-20 flex max-w-[min(100%-1.5rem,320px)] items-center gap-1.5 select-none">
        <div className="flex min-w-0 items-center gap-2 rounded-lg border border-[#24344A] bg-[rgba(11,22,40,0.92)] text-[#F3F7FC] px-3 py-1.5 shadow-sm backdrop-blur-xs">
          <Compass size={14} className="shrink-0 text-[#22C7D6]" />
          <span className="truncate font-mono text-[11px] tabular-nums tracking-tight">
            {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
          </span>
          <span className="shrink-0 font-mono text-[9px] font-bold text-[#35B7FF] bg-[#102B45] px-1 py-0.5 rounded border border-[#20A4F3]/30">
            WGS84
          </span>
        </div>
      </div>

      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 select-none">
        <div className="rounded-lg border border-[#24344A] bg-[rgba(11,22,40,0.92)] px-2.5 py-1 shadow-sm backdrop-blur-xs">
          <span className="font-mono text-[10px] font-bold tabular-nums text-[#35B7FF]">
            ZOOM {zoom}
          </span>
        </div>
        {showScale && (
          <div className="flex items-center gap-2 rounded-lg border border-[#24344A] bg-[rgba(11,22,40,0.92)] px-2.5 py-1 shadow-sm backdrop-blur-xs">
            <div className="flex items-end">
              <div className="h-2 w-5 border-b-2 border-l-2 border-[#35B7FF]" />
              <div className="h-2 w-5 border-b-2 border-r-2 border-[#35B7FF]" />
            </div>
            <span className="font-mono text-[10px] font-semibold text-[#A8B5C7]">200 m</span>
          </div>
        )}
      </div>
    </>
  );
}
