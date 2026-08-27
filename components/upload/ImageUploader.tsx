'use client';

import React, { useRef } from 'react';
import { Upload, Plus, Satellite, Image as ImageIcon, Waves, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageFileCard } from '@/components/upload/ImageFileCard';
import type { AnalysisMode, InputAsset } from '@/types';

interface ImageUploaderProps {
  mode: AnalysisMode;
  files: InputAsset[];
  onFilesChange: (files: InputAsset[]) => void;
  onSelectSample?: (sampleType: string) => void;
}

export function ImageUploader({
  mode,
  files,
  onFilesChange,
  onSelectSample,
}: ImageUploaderProps) {
  const fileInputRef1 = useRef<HTMLInputElement | null>(null);
  const fileInputRef2 = useRef<HTMLInputElement | null>(null);

  // Separate files into slot 1 and slot 2 based on role
  const file1 = files.find((f) => f.role === 't1' || f.role === 'single' || f.role === 'optical') || files[0];
  const file2 = files.find((f) => f.role === 't2' || f.role === 'sar') || files[1];

  const handleRemoveSlot1 = () => {
    if (file1) onFilesChange(files.filter((f) => f.id !== file1.id));
  };

  const handleRemoveSlot2 = () => {
    if (file2) onFilesChange(files.filter((f) => f.id !== file2.id));
  };

  return (
    <div className="space-y-4">
      {/* Mode-Adaptive Slots Grid */}
      {mode === 'single' ? (
        /* SINGLE IMAGE MODE: 1 Dedicated Upload Slot */
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono font-medium text-[#64748B] uppercase tracking-wider">
              Primary Scene Input (1 Image)
            </span>
            <span className="text-[11px] font-mono text-[#94A3B8]">Optical or SAR GeoTIFF</span>
          </div>

          {file1 ? (
            <ImageFileCard asset={file1} onRemove={handleRemoveSlot1} />
          ) : (
            <div
              onClick={() => fileInputRef1.current?.click()}
              className="rounded-xl border border-dashed border-[#1E293B] bg-[#07111F] hover:border-[#38BDF8]/60 transition-colors p-8 text-center cursor-pointer space-y-2.5"
            >
              <input ref={fileInputRef1} type="file" accept=".tif,.tiff,.geotiff,.png,.jpg,.jpeg" className="hidden" />
              <div className="w-9 h-9 rounded-lg bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#94A3B8] mx-auto">
                <Upload size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#F1F5F9]">
                  Drop primary satellite raster, or <span className="text-[#38BDF8] hover:underline">browse files</span>
                </p>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Cloud-Optimized GeoTIFF (COG), TIFF, PNG, or JPEG
                </p>
              </div>
            </div>
          )}
        </div>
      ) : mode === 'temporal' ? (
        /* BEFORE + AFTER MODE: 2 Distinct Temporal Slots */
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono font-medium text-[#64748B] uppercase tracking-wider">
              Bi-Temporal Pair (2 Images: Baseline T1 + Follow-Up T2)
            </span>
            <span className="text-[11px] font-mono text-[#94A3B8]">Same AOI Extent Required</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Slot 1: T1 Baseline */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#38BDF8] font-semibold">T1 · Baseline Image (Earlier Date)</span>
                <span className="text-[#64748B]">{file1 ? '✓ Attached' : 'Slot 1'}</span>
              </div>

              {file1 ? (
                <ImageFileCard asset={file1} onRemove={handleRemoveSlot1} />
              ) : (
                <div
                  onClick={() => fileInputRef1.current?.click()}
                  className="rounded-xl border border-dashed border-[#1E293B] bg-[#07111F] hover:border-[#38BDF8]/60 transition-colors p-6 text-center cursor-pointer space-y-2"
                >
                  <input ref={fileInputRef1} type="file" accept=".tif,.tiff,.geotiff,.png,.jpg,.jpeg" className="hidden" />
                  <div className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#94A3B8] mx-auto">
                    <Upload size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#F1F5F9]">Upload T1 Baseline Pass</p>
                    <p className="text-[11px] text-[#64748B]">e.g. 14 Jan 2026</p>
                  </div>
                </div>
              )}
            </div>

            {/* Slot 2: T2 Follow-up */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#38BDF8] font-semibold">T2 · Follow-Up Image (Later Date)</span>
                <span className="text-[#64748B]">{file2 ? '✓ Attached' : 'Slot 2'}</span>
              </div>

              {file2 ? (
                <ImageFileCard asset={file2} onRemove={handleRemoveSlot2} />
              ) : (
                <div
                  onClick={() => fileInputRef2.current?.click()}
                  className="rounded-xl border border-dashed border-[#1E293B] bg-[#07111F] hover:border-[#38BDF8]/60 transition-colors p-6 text-center cursor-pointer space-y-2"
                >
                  <input ref={fileInputRef2} type="file" accept=".tif,.tiff,.geotiff,.png,.jpg,.jpeg" className="hidden" />
                  <div className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#94A3B8] mx-auto">
                    <Upload size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#F1F5F9]">Upload T2 Follow-Up Pass</p>
                    <p className="text-[11px] text-[#64748B]">e.g. 22 Aug 2026</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* OPTICAL + SAR FUSION MODE: 2 Distinct Sensor Slots */
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono font-medium text-[#64748B] uppercase tracking-wider">
              Cross-Modal Fusion Pair (Optical Surface + SAR Microwave Radar)
            </span>
            <span className="text-[11px] font-mono text-[#94A3B8]">Co-registered Stack</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Slot 1: Optical Surface */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#38BDF8] font-semibold">Optical Surface Imagery</span>
                <span className="text-[#64748B]">{file1 ? '✓ Attached' : 'Sentinel-2 / Landsat'}</span>
              </div>

              {file1 ? (
                <ImageFileCard asset={file1} onRemove={handleRemoveSlot1} />
              ) : (
                <div
                  onClick={() => fileInputRef1.current?.click()}
                  className="rounded-xl border border-dashed border-[#1E293B] bg-[#07111F] hover:border-[#38BDF8]/60 transition-colors p-6 text-center cursor-pointer space-y-2"
                >
                  <input ref={fileInputRef1} type="file" accept=".tif,.tiff,.geotiff,.png,.jpg,.jpeg" className="hidden" />
                  <div className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#94A3B8] mx-auto">
                    <ImageIcon size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#F1F5F9]">Upload Optical Surface Raster</p>
                    <p className="text-[11px] text-[#64748B]">Visible RGB + NIR/SWIR Bands</p>
                  </div>
                </div>
              )}
            </div>

            {/* Slot 2: SAR Radar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#38BDF8] font-semibold">SAR Radar Imagery</span>
                <span className="text-[#64748B]">{file2 ? '✓ Attached' : 'Sentinel-1 / ALOS'}</span>
              </div>

              {file2 ? (
                <ImageFileCard asset={file2} onRemove={handleRemoveSlot2} />
              ) : (
                <div
                  onClick={() => fileInputRef2.current?.click()}
                  className="rounded-xl border border-dashed border-[#1E293B] bg-[#07111F] hover:border-[#38BDF8]/60 transition-colors p-6 text-center cursor-pointer space-y-2"
                >
                  <input ref={fileInputRef2} type="file" accept=".tif,.tiff,.geotiff,.png,.jpg,.jpeg" className="hidden" />
                  <div className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#94A3B8] mx-auto">
                    <Waves size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#F1F5F9]">Upload SAR Radar Coherence</p>
                    <p className="text-[11px] text-[#64748B]">VV + VH Backscatter / Coherence</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pre-Registered Benchmark Quick-Load Bar */}
      {onSelectSample && (
        <div className="p-3 rounded-lg bg-[#07111F] border border-[#1E293B] flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-[11px] text-[#64748B]">Load benchmark sample pair:</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectSample('urban')}
              className="px-2.5 py-1 rounded bg-[#0B132B] border border-[#1E293B] text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#334155] transition-colors"
            >
              Pune Peri-Urban (2 Images: Jan + Aug)
            </button>
            <button
              type="button"
              onClick={() => onSelectSample('flood')}
              className="px-2.5 py-1 rounded bg-[#0B132B] border border-[#1E293B] text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#334155] transition-colors"
            >
              Assam Floodplain (2 Images: Optical + SAR)
            </button>
            <button
              type="button"
              onClick={() => onSelectSample('port')}
              className="px-2.5 py-1 rounded bg-[#0B132B] border border-[#1E293B] text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#334155] transition-colors"
            >
              JNPT Port (1 Image: Single Optical)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
