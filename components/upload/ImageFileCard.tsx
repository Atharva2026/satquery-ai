'use client';

import React, { useState } from 'react';
import {
  FileImage,
  Trash2,
  Eye,
} from 'lucide-react';
import type { InputAsset } from '@/types';
import { MetadataDisclosure } from './MetadataDisclosure';

interface ImageFileCardProps {
  asset: InputAsset;
  onRemove?: () => void;
}

export function ImageFileCard({ asset, onRemove }: ImageFileCardProps) {
  const [metadataOpen, setMetadataOpen] = useState(false);

  return (
    <>
      <div className="p-3 rounded-lg bg-[#07111F] border border-[#1E293B] flex items-center justify-between gap-3 font-sans">
        {/* Left: Thumbnail & Inferred Modality */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-[#0F172A] border border-[#1E293B] shrink-0">
            {asset.thumbnailUrl ? (
              <img
                src={asset.thumbnailUrl}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#64748B]">
                <FileImage size={18} />
              </div>
            )}
            <span className="absolute bottom-0 inset-x-0 bg-[#07111F]/90 text-[8px] font-mono text-center text-[#94A3B8] uppercase py-0.2">
              {asset.role.toUpperCase()}
            </span>
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#F1F5F9] truncate max-w-[200px] sm:max-w-[280px]">
                {asset.name}
              </span>
              {asset.compatibility === 'compatible' && (
                <span className="text-[10px] font-mono text-[#10B981]">
                  ✓ Validated
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-[#64748B]">
              <span>{asset.modality.toUpperCase()}</span>
              <span>·</span>
              <span>{asset.acquisitionDate || '22 Aug 2026'}</span>
              <span>·</span>
              <span>
                {asset.width || 4096} × {asset.height || 4096}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setMetadataOpen(true)}
            className="px-2 py-1 rounded bg-[#0F172A] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors flex items-center gap-1"
          >
            <Eye size={12} />
            <span className="hidden sm:inline">Metadata</span>
          </button>

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1 rounded text-[#64748B] hover:text-[#EF4444] hover:bg-[#0F172A] transition-colors"
              title="Remove asset"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      <MetadataDisclosure
        asset={asset}
        open={metadataOpen}
        onOpenChange={setMetadataOpen}
      />
    </>
  );
}
