'use client';

import { cn } from '@/lib/utils';
import type {
  BoundingBox,
  Coordinates,
  EvidenceRegion,
  GeoJSONFeature,
  LayerKey,
} from '@/types';
import { MapToolbar } from './MapToolbar';
import {
  defaultLayers,
  LayerControl,
  type LayerConfig,
} from './LayerControl';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Crosshair, PenTool, Check, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface SatelliteMapProps {
  imagery: string;
  beforeImagery?: string;
  coordinates: Coordinates;
  regions: EvidenceRegion[];
  selectedRegionId?: string;
  hoveredRegionId?: string;
  onSelectRegion?: (region: EvidenceRegion) => void;
  onHoverRegion?: (regionId?: string) => void;
  layerVisible?: Record<LayerKey, boolean>;
  onToggleLayer?: (key: LayerKey) => void;
  temporalMode?: 'T1' | 'T2' | 'split';
  overlayOpacity?: number;
  onOverlayOpacityChange?: (value: number) => void;
  geojson?: GeoJSONFeature[];
  boundingBoxes?: BoundingBox[];
  className?: string;
  showLayerControl?: boolean;
  onCustomAoiDrawn?: (box: { x: number; y: number; width: number; height: number }) => void;
}

export function SatelliteMap({
  imagery,
  beforeImagery,
  coordinates,
  regions,
  selectedRegionId,
  hoveredRegionId,
  onSelectRegion,
  onHoverRegion,
  layerVisible,
  onToggleLayer,
  temporalMode = 'T2',
  overlayOpacity = 80,
  onOverlayOpacityChange,
  geojson,
  boundingBoxes,
  className,
  showLayerControl = true,
  onCustomAoiDrawn,
}: SatelliteMapProps) {
  const [zoom, setZoom] = useState(14);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [filterMode, setFilterMode] = useState<'normal' | 'falseColor' | 'radar' | 'edge'>('normal');
  const [isDrawingAoi, setIsDrawingAoi] = useState(false);
  const [drawnBox, setDrawnBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);

  const [internalLayers, setInternalLayers] = useState<Record<LayerKey, boolean>>(
    () =>
      Object.fromEntries(
        defaultLayers.map((l) => [l.key, l.defaultVisible]),
      ) as Record<LayerKey, boolean>,
  );
  const [splitPct, setSplitPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const visible = layerVisible ?? internalLayers;
  const handleToggle = onToggleLayer ?? ((key: LayerKey) => {
    setInternalLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  });

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(18, z + 1)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(8, z - 1)), []);
  const handleReset = useCallback(() => {
    setZoom(14);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isDrawingAoi) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const xPct = ((e.clientX - rect.left) / rect.width) * 100;
        const yPct = ((e.clientY - rect.top) / rect.height) * 100;
        setDrawingStart({ x: xPct, y: yPct });
        setDrawnBox({ x: xPct, y: yPct, width: 0, height: 0 });
        return;
      }

      isDragging.current = true;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    },
    [isDrawingAoi, pan],
  );

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (isDrawingAoi && drawingStart && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const currentX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const currentY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

        const minX = Math.min(drawingStart.x, currentX);
        const minY = Math.min(drawingStart.y, currentY);
        const width = Math.abs(currentX - drawingStart.x);
        const height = Math.abs(currentY - drawingStart.y);

        setDrawnBox({ x: minX, y: minY, width, height });
        return;
      }

      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPan({
        x: dragStart.current.panX + dx,
        y: dragStart.current.panY + dy,
      });
    };

    const handleUp = () => {
      if (isDrawingAoi && drawingStart && drawnBox) {
        if (drawnBox.width > 5 && drawnBox.height > 5) {
          toast.success(`Custom AOI selected: ${drawnBox.width.toFixed(1)}% × ${drawnBox.height.toFixed(1)}% footprint.`);
          onCustomAoiDrawn?.(drawnBox);
        }
        setDrawingStart(null);
        setIsDrawingAoi(false);
      }
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDrawingAoi, drawingStart, drawnBox, onCustomAoiDrawn]);

  const scale = Math.pow(2, zoom - 14);

  const getFilterStyle = () => {
    switch (filterMode) {
      case 'falseColor':
        return 'hue-rotate-90 saturate-200 contrast-125';
      case 'radar':
        return 'grayscale contrast-200 brightness-90';
      case 'edge':
        return 'contrast-200 invert';
      default:
        return '';
    }
  };

  const renderRegion = (region: EvidenceRegion) => {
    if (!visible.EVIDENCE && !visible.GROUNDING) return null;
    const isSelected = region.id === selectedRegionId;
    const isHovered = region.id === hoveredRegionId || isSelected;

    const color =
      region.confidence >= 0.7
        ? '#16a34a'
        : region.confidence >= 0.4
          ? '#d97706'
          : '#64748b';

    return (
      <button
        key={region.id}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelectRegion?.(region);
        }}
        onMouseEnter={() => onHoverRegion?.(region.id)}
        onMouseLeave={() => onHoverRegion?.(undefined)}
        className="absolute group cursor-pointer transition-transform"
        style={{
          left: `${region.geometry.x}%`,
          top: `${region.geometry.y}%`,
          width: `${region.geometry.width}%`,
          height: `${region.geometry.height}%`,
        }}
      >
        {/* Reticle Boundary */}
        <div
          className={cn(
            'absolute inset-0 rounded-xs transition-all duration-200',
            isHovered && 'animate-reticle',
          )}
          style={{
            borderWidth: isHovered ? 2 : 1,
            borderColor: color,
            boxShadow: isHovered
              ? `0 0 12px ${color}80, inset 0 0 8px ${color}30`
              : isSelected
                ? `0 0 0 2px ${color}40`
                : undefined,
            backgroundColor: isHovered ? `${color}35` : `${color}0D`,
          }}
        />

        {/* Tactical Crosshair Corner Brackets */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map(
          (pos) => (
            <div
              key={pos}
              className={cn(
                'absolute transition-all duration-150',
                isHovered ? 'h-2.5 w-2.5' : 'h-1.5 w-1.5',
                pos,
              )}
              style={{ backgroundColor: color }}
            />
          ),
        )}

        {/* Center Target Point on Hover */}
        {isHovered && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full animate-ping"
            style={{ backgroundColor: color }}
          />
        )}

        {visible.GROUNDING && (
          <div
            className={cn(
              'absolute -top-5 left-0 max-w-[160px] truncate rounded px-1.5 py-0.5 text-[9px] font-data-mono font-bold text-white shadow-md transition-opacity duration-150 z-20 flex items-center gap-1',
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 group-hover:opacity-100',
            )}
            style={{ backgroundColor: color }}
          >
            <Crosshair size={10} />
            <span>
              {region.id} · {Math.round(region.confidence * 100)}%
            </span>
          </div>
        )}
      </button>
    );
  };

  const renderChangeHeatmap = () => {
    if (!visible.CHANGE) return null;
    return (
      <div className="absolute inset-0 pointer-events-none">
        {regions.map((r) => (
          <div
            key={`heat-${r.id}`}
            className="absolute rounded-full blur-xl transition-opacity"
            style={{
              left: `${r.geometry.x + r.geometry.width / 2 - 10}%`,
              top: `${r.geometry.y + r.geometry.height / 2 - 10}%`,
              width: '20%',
              height: '20%',
              backgroundColor:
                r.confidence > 0.7
                  ? 'rgba(217, 119, 6, 0.35)'
                  : 'rgba(217, 119, 6, 0.18)',
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-full overflow-hidden bg-slate-950 select-none',
        isDrawingAoi ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing',
        className,
      )}
      onMouseDown={handleMouseDown}
    >
      {/* Imagery layer */}
      <div
        className="absolute inset-0 transition-transform duration-100"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: 'center',
        }}
      >
        {visible.OPTICAL ? (
          temporalMode === 'split' && beforeImagery ? (
            <div className="relative w-full h-full">
              <img
                src={imagery}
                alt="Satellite imagery T2"
                className={cn('absolute inset-0 w-full h-full object-cover', getFilterStyle())}
                draggable={false}
              />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${splitPct}%` }}
              >
                <img
                  src={beforeImagery}
                  alt="Satellite imagery T1"
                  className={cn('absolute inset-0 w-full h-full object-cover', getFilterStyle())}
                  style={{ width: containerRef.current?.clientWidth ?? '100%' }}
                  draggable={false}
                />
              </div>
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-ew-resize z-10"
                style={{ left: `${splitPct}%` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
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
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 bg-sky-700" />
                    <div className="w-0.5 h-3 bg-sky-700" />
                  </div>
                </div>
              </div>
            </div>
          ) : temporalMode === 'T1' && beforeImagery ? (
            <img
              src={beforeImagery}
              alt="Satellite imagery T1"
              className={cn('absolute inset-0 w-full h-full object-cover', getFilterStyle())}
              draggable={false}
            />
          ) : (
            <img
              src={imagery}
              alt="Satellite imagery"
              className={cn('absolute inset-0 w-full h-full object-cover', getFilterStyle())}
              draggable={false}
            />
          )
        ) : (
          <div className="absolute inset-0 bg-slate-950" />
        )}

        {/* SAR overlay */}
        {visible.SAR && (
          <div
            className="absolute inset-0 bg-slate-950 mix-blend-multiply grayscale"
            style={{ opacity: overlayOpacity / 100 }}
          />
        )}

        {/* Tactical Grid overlay */}
        {showGrid && (
          <div className="absolute inset-0 sq-grid-overlay-dark pointer-events-none" />
        )}

        {/* Change heatmap */}
        <div style={{ opacity: overlayOpacity / 100 }}>{renderChangeHeatmap()}</div>

        {/* User Drawn Custom AOI Box */}
        {drawnBox && (
          <div
            className="absolute border-2 border-sky-400 bg-sky-500/20 pointer-events-none z-30 shadow-lg"
            style={{
              left: `${drawnBox.x}%`,
              top: `${drawnBox.y}%`,
              width: `${drawnBox.width}%`,
              height: `${drawnBox.height}%`,
            }}
          >
            <div className="absolute -top-6 left-0 px-1.5 py-0.5 rounded bg-sky-600 text-white font-mono text-[9px] font-bold">
              USER AOI · {drawnBox.width.toFixed(0)}% × {drawnBox.height.toFixed(0)}%
            </div>
          </div>
        )}

        {/* Evidence regions */}
        <div className="absolute inset-0">
          {regions.map(renderRegion)}
        </div>
      </div>

      {/* Toolbar */}
      <MapToolbar
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        coordinates={coordinates}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((v) => !v)}
      />

      {/* Top Left Controls: AOI Draw Tool & Spectral Filter Modes */}
      <div className="absolute left-3 top-12 z-20 flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-1 rounded-lg border border-[#24344A] bg-[rgba(11,22,40,0.92)] p-1 shadow-sm backdrop-blur-xs">
          <button
            type="button"
            onClick={() => {
              setIsDrawingAoi((v) => !v);
              if (!isDrawingAoi) {
                toast.info('Click and drag across the map to draw custom bounding AOI.');
              }
            }}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors',
              isDrawingAoi
                ? 'bg-[#20A4F3] text-[#07111F] shadow-xs font-bold'
                : 'text-[#A8B5C7] hover:bg-[#142238] hover:text-[#F3F7FC]',
            )}
            title="Draw custom bounding polygon AOI on canvas"
          >
            <PenTool size={12} />
            <span>{isDrawingAoi ? 'Drawing AOI...' : 'Draw AOI'}</span>
          </button>

          {drawnBox && (
            <button
              type="button"
              onClick={() => setDrawnBox(null)}
              className="p-1 text-[#8FA0B5] hover:text-[#F05D6C] rounded transition-colors"
              title="Clear Drawn AOI"
            >
              <RotateCcw size={12} />
            </button>
          )}
        </div>

        {/* Basemap Filter Select */}
        <div className="hidden sm:flex items-center rounded-lg border border-[#24344A] bg-[rgba(11,22,40,0.92)] p-0.5 shadow-sm backdrop-blur-xs text-[10px] font-mono">
          {(
            [
              { key: 'normal', label: 'RGB' },
              { key: 'falseColor', label: 'NIR False-Color' },
              { key: 'radar', label: 'SAR Radar' },
            ] as const
          ).map((mode) => (
            <button
              key={mode.key}
              type="button"
              onClick={() => setFilterMode(mode.key)}
              className={cn(
                'px-2.5 py-1 rounded transition-colors font-medium',
                filterMode === mode.key
                  ? 'bg-[#102B45] text-[#35B7FF] font-bold border border-[#20A4F3]/30'
                  : 'text-[#8FA0B5] hover:bg-[#142238] hover:text-[#F3F7FC]',
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Control Panel */}
      {showLayerControl && (
        <div className="absolute bottom-3 right-3 z-20 w-[240px] rounded-xl border border-[#24344A] bg-[rgba(11,22,40,0.95)] p-3 shadow-md backdrop-blur-xs">
          <LayerControl
            layers={defaultLayers as LayerConfig[]}
            visible={visible}
            onToggle={handleToggle}
            opacity={overlayOpacity}
            onOpacityChange={onOverlayOpacityChange}
          />
        </div>
      )}
    </div>
  );
}
