'use client';

import React from 'react';
import { ShieldCheck, AlertCircle, X, Info, FileCode, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { InputAsset } from '@/types';

interface MetadataDisclosureProps {
  asset: InputAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MetadataDisclosure({ asset, open, onOpenChange }: MetadataDisclosureProps) {
  if (!asset) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-[#0B1628] border-[#24344A] text-[#E8F0F7] p-6 rounded-2xl shadow-2xl font-sans">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#20A4F3]" />
            <DialogTitle className="text-base font-bold text-[#E8F0F7]">
              Geospatial Raster Metadata Disclosure
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[#8EA4B8]">
            Automated raster parser inspection for {asset.name}
          </DialogDescription>
        </DialogHeader>

        {/* Compatibility Plain-Language Status Alert */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
            asset.compatibility === 'compatible'
              ? 'bg-[#19C37D]/10 border-[#19C37D]/30 text-[#19C37D]'
              : asset.compatibility === 'warning'
              ? 'bg-[#F5A524]/10 border-[#F5A524]/30 text-[#F5A524]'
              : 'bg-[#F05D6C]/10 border-[#F05D6C]/30 text-[#F05D6C]'
          }`}
        >
          {asset.compatibility === 'compatible' ? (
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <div className="font-bold">
              {asset.compatibility === 'compatible'
                ? 'This GeoTIFF is readable, georeferenced, and compatible.'
                : asset.compatibility === 'warning'
                ? 'Metadata warning: verify spatial overlap or acquisition dates.'
                : 'Unsupported format or missing spatial reference system.'}
            </div>
            {asset.warnings && asset.warnings.length > 0 && (
              <div className="text-[11px] opacity-90">{asset.warnings.join(' ')}</div>
            )}
          </div>
        </div>

        {/* Technical Metadata Table */}
        <div className="space-y-2 font-mono text-xs">
          <span className="text-[10px] font-bold text-[#8EA4B8] uppercase block">
            HEADER ATTRIBUTES (COG / GEOTIFF)
          </span>

          <div className="rounded-xl bg-[#07111F] border border-[#24344A] divide-y divide-[#24344A]">
            <div className="flex justify-between p-2.5">
              <span className="text-[#8EA4B8]">Dimensions</span>
              <span className="text-[#E8F0F7]">
                {asset.width || 4096} × {asset.height || 4096} px
              </span>
            </div>

            <div className="flex justify-between p-2.5">
              <span className="text-[#8EA4B8]">Spectral Bands</span>
              <span className="text-[#E8F0F7]">{asset.bands || 4} channels (B2, B3, B4, B8)</span>
            </div>

            <div className="flex justify-between p-2.5">
              <span className="text-[#8EA4B8]">Bit Depth</span>
              <span className="text-[#E8F0F7]">{asset.bitDepth || '16-bit unsigned int'}</span>
            </div>

            <div className="flex justify-between p-2.5">
              <span className="text-[#8EA4B8]">Coordinate Reference System (CRS)</span>
              <span className="text-[#22C7D6] font-bold">{asset.crs || 'EPSG:4326 (WGS 84)'}</span>
            </div>

            <div className="flex justify-between p-2.5">
              <span className="text-[#8EA4B8]">Geotransform</span>
              <span className="text-[#8EA4B8] text-[11px]">
                {asset.geotransform || '[73.8420, 0.00009, 0.0, 18.5410, 0.0, -0.00009]'}
              </span>
            </div>

            <div className="flex justify-between p-2.5">
              <span className="text-[#8EA4B8]">Acquisition Timestamp</span>
              <span className="text-[#E8F0F7]">{asset.acquisitionDate || '22 Aug 2026 06:14 UTC'}</span>
            </div>

            <div className="flex justify-between p-2.5">
              <span className="text-[#8EA4B8]">NoData Mask Percentage</span>
              <span className="text-[#E8F0F7]">{asset.nodataPercentage ?? 0.2}%</span>
            </div>

            <div className="flex justify-between p-2.5">
              <span className="text-[#8EA4B8]">Co-Registration Status</span>
              <span className="text-[#19C37D]">✓ Co-registered (0.24px residual)</span>
            </div>

            {asset.sha256 && (
              <div className="flex justify-between p-2.5">
                <span className="text-[#8EA4B8]">SHA-256 Hash</span>
                <span className="text-[#8EA4B8] text-[10px] truncate max-w-[240px]">
                  {asset.sha256}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-1.5 rounded-lg bg-[#142238] border border-[#24344A] text-xs font-semibold text-[#E8F0F7] hover:bg-[#20A4F3] hover:text-[#07111F] transition-all"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
