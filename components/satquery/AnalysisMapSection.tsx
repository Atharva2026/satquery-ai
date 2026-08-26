'use client';

import { useMemo, useState } from 'react';
import { SatelliteMap } from '@/components/satquery/SatelliteMap';
import { Timeline } from '@/components/satquery/Timeline';
import type { AnalysisResult, Coordinates, LayerKey } from '@/types';

interface AnalysisMapSectionProps {
  analysis: AnalysisResult;
  coordinates: Coordinates;
  mapImagery: string;
}

export function AnalysisMapSection({
  analysis,
  coordinates,
  mapImagery,
}: AnalysisMapSectionProps) {
  const [activeTemporal, setActiveTemporal] = useState<'T1' | 'T2'>('T2');
  const [selectedRegionId, setSelectedRegionId] = useState<string>();
  const [overlayOpacity, setOverlayOpacity] = useState(80);
  const [layerVisible, setLayerVisible] = useState<Record<LayerKey, boolean>>({
    OPTICAL: true,
    SAR: false,
    CHANGE: true,
    GROUNDING: true,
    EVIDENCE: true,
  });

  const imagery = useMemo(
    () =>
      activeTemporal === 'T1'
        ? analysis.temporalComparison.t1.imagery
        : analysis.temporalComparison.t2.imagery || mapImagery,
    [activeTemporal, analysis.temporalComparison, mapImagery],
  );

  return (
    <div className="rounded-xl border border-[#24344A] bg-[#101C2E] overflow-hidden shadow-md">
      <div className="h-[500px] relative bg-[#07111F]">
        <SatelliteMap
          imagery={imagery}
          beforeImagery={analysis.temporalComparison.t1.imagery}
          coordinates={coordinates}
          regions={analysis.regions}
          selectedRegionId={selectedRegionId}
          onSelectRegion={(r) => setSelectedRegionId(r.id)}
          layerVisible={layerVisible}
          onToggleLayer={(key) =>
            setLayerVisible((prev) => ({ ...prev, [key]: !prev[key] }))
          }
          temporalMode={activeTemporal}
          overlayOpacity={overlayOpacity}
          onOverlayOpacityChange={setOverlayOpacity}
          showLayerControl
        />
      </div>
      <div className="px-5 py-3 border-t border-[#24344A] bg-[#0B1628]">
        <Timeline
          comparison={analysis.temporalComparison}
          onScrub={setActiveTemporal}
        />
      </div>
    </div>
  );
}
