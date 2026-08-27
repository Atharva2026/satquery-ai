'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IMG } from '@/lib/mock-data';

export function LandingWorkflows() {
  const workflows = [
    {
      id: 'single-image',
      title: 'Single-Image VQA & Grounding',
      tag: 'Optical / Multispectral',
      desc: 'Ask open-domain questions or locate specific geographic features over single optical or SAR rasters.',
      exampleQuery: '“Describe dominant land-cover and locate intermodal container yards.”',
      img: IMG.port,
      href: '/analyze?mode=single',
      models: 'GroundingDINO-RS · RemoteCLIP',
    },
    {
      id: 'temporal-change',
      title: 'Bi-Temporal Change Analysis',
      tag: 'Temporal Correspondence',
      desc: 'Compare co-registered baseline and follow-up passes to isolate structural development and land-cover transitions.',
      exampleQuery: '“What changed between January and August? Highlight new structures.”',
      img: IMG.urbanT2,
      href: '/analyze?mode=temporal',
      models: 'ChangeFormer-RS · BiTemporal-NDCI',
    },
    {
      id: 'optical-sar-fusion',
      title: 'Optical–SAR Fusion Analysis',
      tag: 'Cross-Modal Radar',
      desc: 'Overcome optical cloud occlusion and shadow ambiguity by synthesizing optical reflectance with SAR radar backscatter.',
      exampleQuery: '“Assess flood inundation extent under dense monsoon cloud cover.”',
      img: IMG.flood,
      href: '/analyze?mode=optical-sar',
      models: 'SAR-PolarCoherence · Optical-MNDWI',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {workflows.map((wf) => (
        <div
          key={wf.id}
          className="rounded-xl bg-[#0B132B] border border-[#1E293B] hover:border-[#334155] transition-colors p-5 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="relative h-40 rounded-lg overflow-hidden bg-[#07111F] border border-[#1E293B]">
              <img
                src={wf.img}
                alt={wf.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#07111F]/90 text-[#94A3B8] border border-[#1E293B]">
                {wf.tag}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                {wf.title}
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{wf.desc}</p>
            </div>

            <div className="p-3 rounded-lg bg-[#07111F] border border-[#1E293B] text-xs">
              <span className="text-[10px] font-mono text-[#64748B] uppercase block mb-0.5">Example:</span>
              <p className="text-[#CBD5E1]">{wf.exampleQuery}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#64748B]">{wf.models}</span>
            <Link href={wf.href}>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs font-medium bg-[#0F172A] border-[#1E293B] text-[#E2E8F0] hover:bg-[#1E293B]"
              >
                <span>Try workflow</span>
                <ArrowRight size={12} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
