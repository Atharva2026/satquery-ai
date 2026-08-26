'use client';

import { cn } from '@/lib/utils';
import type { LayerKey } from '@/types';

export interface LayerConfig {
  key: LayerKey;
  label: string;
  color: string;
  defaultVisible: boolean;
}

export const defaultLayers: LayerConfig[] = [
  { key: 'OPTICAL', label: 'Optical Imagery', color: '#20A4F3', defaultVisible: true },
  { key: 'SAR', label: 'SAR Backscatter', color: '#22C7D6', defaultVisible: false },
  { key: 'CHANGE', label: 'Change Heatmap', color: '#F5A524', defaultVisible: true },
  { key: 'GROUNDING', label: 'Grounding Regions', color: '#35B7FF', defaultVisible: true },
  { key: 'EVIDENCE', label: 'Evidence Boxes', color: '#19C37D', defaultVisible: true },
];

interface LayerControlProps {
  layers: LayerConfig[];
  visible: Record<LayerKey, boolean>;
  onToggle: (key: LayerKey) => void;
  opacity?: number;
  onOpacityChange?: (value: number) => void;
  className?: string;
}

export function LayerControl({
  layers,
  visible,
  onToggle,
  opacity,
  onOpacityChange,
  className,
}: LayerControlProps) {
  return (
    <div className={cn('space-y-1.5 select-none bg-[rgba(11,22,40,0.92)] text-[#F3F7FC]', className)}>
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#24344A]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#A8B5C7]">
          Layers &amp; Overlays
        </span>
      </div>
      {layers.map((layer) => {
        const isVisible = visible[layer.key];
        return (
          <button
            key={layer.key}
            type="button"
            onClick={() => onToggle(layer.key)}
            className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left transition-colors duration-150 hover:bg-[#142238]"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: layer.color, opacity: isVisible ? 1 : 0.25 }}
              />
              <span
                className={cn(
                  'truncate text-xs font-medium',
                  isVisible ? 'text-[#F3F7FC] font-semibold' : 'text-[#718096]',
                )}
              >
                {layer.label}
              </span>
            </span>
            <span
              className={cn(
                'h-3.5 w-3.5 shrink-0 rounded-full border flex items-center justify-center transition-colors',
                isVisible
                  ? 'border-[#20A4F3] bg-[#20A4F3]'
                  : 'border-[#24344A] bg-[#0D192A]',
              )}
            >
              {isVisible && <span className="h-1.5 w-1.5 rounded-full bg-[#07111F]" />}
            </span>
          </button>
        );
      })}
      {typeof opacity === 'number' && onOpacityChange && (
        <div className="mt-2 border-t border-[#24344A] pt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A8B5C7]">
              Overlay Opacity
            </span>
            <span className="font-mono text-[10px] font-bold text-[#35B7FF]">
              {opacity}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={opacity}
              onChange={(e) => onOpacityChange(Number(e.target.value))}
              className="min-w-0 flex-1 accent-[#20A4F3] h-1.5 bg-[#0D192A] border border-[#24344A] rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
