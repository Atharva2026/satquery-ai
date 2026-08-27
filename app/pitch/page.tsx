'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IMG, urbanGrowthResult } from '@/lib/mock-data';

export default function PitchModePage() {
  const [slide, setSlide] = useState<number>(1);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
  const totalSlides = 5;

  const result = urbanGrowthResult();

  const handleNext = () => {
    if (slide < totalSlides) setSlide((s) => s + 1);
  };

  const handlePrev = () => {
    if (slide > 1) setSlide((s) => s - 1);
  };

  const handleReset = () => {
    setSlide(1);
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F1F5F9] font-sans flex flex-col justify-between selection:bg-[#20A4F3]/20">
      {/* Pitch Header */}
      <header className="h-14 bg-[#07111F] border-b border-[#1E293B] px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/demo"
            className="p-1 rounded-md bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <ArrowLeft size={14} />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs tracking-wider text-[#F8FAFC]">
              PITCH PRESENTATION
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0F172A] text-[#94A3B8] border border-[#1E293B]">
              Step {slide} of {totalSlides}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0F172A] border border-[#1E293B] text-[11px] font-mono text-[#94A3B8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>{isLiveMode ? 'Live Stream' : 'Precomputed Demo'}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLiveMode(!isLiveMode)}
            className="h-7 px-2.5 text-xs bg-transparent border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A]"
          >
            {isLiveMode ? 'Cached' : 'Run Live'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 px-2 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
            title="Reset"
          >
            <RotateCcw size={13} />
          </Button>
        </div>
      </header>

      {/* Main Pitch Stage */}
      <main className="flex-1 max-w-[1080px] w-full mx-auto px-6 lg:px-10 py-8 flex flex-col justify-center">
        {/* SLIDE 1: QUERY ENTRY */}
        {slide === 1 && (
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-medium text-[#38BDF8] uppercase tracking-wider">
                01. Natural Language Entry
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] leading-tight">
                Ask Plain Language Questions over Remote-Sensing Scenes
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Analysts provide natural queries and multi-date rasters without configuring low-level band ratios or specialist pipelines.
              </p>
              <div className="p-3.5 rounded-lg bg-[#0B132B] border border-[#1E293B] space-y-1">
                <span className="text-[10px] font-mono text-[#64748B] uppercase">Query:</span>
                <p className="text-xs sm:text-sm font-semibold text-[#F1F5F9]">
                  “Did construction increase between Jan and Aug? Highlight new structures.”
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-xl bg-[#0B132B] border border-[#1E293B] p-4">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#64748B]">T1: 14 JAN 2026</span>
                  <img src={IMG.urbanT1} alt="T1" className="h-36 w-full rounded-lg object-cover" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#38BDF8]">T2: 22 AUG 2026</span>
                  <img src={IMG.urbanT2} alt="T2" className="h-36 w-full rounded-lg object-cover" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2: ROUTING & PLAN */}
        {slide === 2 && (
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-medium text-[#38BDF8] uppercase tracking-wider">
                02. Intent Classification &amp; Routing
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] leading-tight">
                Automated Routing to Specialist Architectures
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                The router assigns <code>ChangeFormer-RS</code>, <code>GroundingDINO-RS</code>, and <code>SAR-PolarCoherence</code> to process the multi-temporal footprint.
              </p>
            </div>

            <div className="lg:col-span-6 rounded-xl bg-[#0B132B] border border-[#1E293B] p-5 space-y-3">
              <div className="flex justify-between border-b border-[#1E293B] pb-2 text-xs font-mono">
                <span className="font-semibold text-[#F8FAFC]">CONFIRMED ANALYSIS PLAN</span>
                <span className="text-[#10B981]">✓ Ready</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs text-[#F1F5F9]">
                <div className="flex justify-between p-2 rounded bg-[#07111F]">
                  <span className="text-[#64748B]">Task:</span>
                  <span>Bi-Temporal Change Detection</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#07111F]">
                  <span className="text-[#64748B]">Specialist Chain:</span>
                  <span className="text-[#38BDF8]">Temporal → Grounding → SAR Check</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#07111F]">
                  <span className="text-[#64748B]">AOI Extent:</span>
                  <span>4.2 km² (Pune Extension)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: OPTICAL + SAR FUSION */}
        {slide === 3 && (
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-medium text-[#38BDF8] uppercase tracking-wider">
                03. Optical + SAR Cross-Check
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] leading-tight">
                Validating Optical Change with Radar Backscatter
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Optical change isolated 17 candidate clusters. Sentinel-1 microwave radar confirmed 6 vertical double-bounce returns (+8.4 dB), eliminating false ground-clearing signals.
              </p>
            </div>

            <div className="lg:col-span-6 rounded-xl bg-[#0B132B] border border-[#1E293B] p-4 space-y-2.5">
              <div className="flex justify-between text-xs font-mono text-[#64748B]">
                <span>OPTICAL CHANGE (S2)</span>
                <span>SAR COHERENCE (S1)</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <img src={IMG.urbanT2} alt="Optical" className="h-36 w-full rounded-lg object-cover" />
                <img src={IMG.urban} alt="SAR" className="h-36 w-full rounded-lg object-cover grayscale contrast-125" />
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 4: GROUNDED EVIDENCE & CONFIDENCE */}
        {slide === 4 && (
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-medium text-[#10B981] uppercase tracking-wider">
                04. Spatial Grounding &amp; Calibration
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] leading-tight">
                Findings Bound to Spatial Polygons
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Confidence is calibrated via temperature scaling to 92% (T=1.35), supported by 6 verified bounding boxes.
              </p>
              <div className="p-3 rounded-lg bg-[#0B132B] border border-[#1E293B] space-y-1">
                <span className="text-[10px] font-mono text-[#10B981]">
                  VERDICT: CONFIDENT (92%)
                </span>
                <p className="text-xs text-[#F1F5F9]">
                  {result.answer}
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 relative h-56 rounded-xl overflow-hidden border border-[#1E293B] bg-[#07111F]">
              <img src={IMG.urbanT2} alt="Grounded map" className="w-full h-full object-cover" />
              <div className="absolute top-[28%] left-[22%] w-[24%] h-[20%] border border-[#38BDF8] bg-[#38BDF8]/15 rounded-xs flex items-start p-1">
                <span className="text-[9px] font-mono bg-[#07111F] text-[#38BDF8] px-1 rounded border border-[#1E293B]">
                  EV-1001 (94%)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 5: COMPLETE AUDIT & DOSSIER */}
        {slide === 5 && (
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-medium text-[#38BDF8] uppercase tracking-wider">
                05. Audit Trail &amp; Dossier Export
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] leading-tight">
                Verifiable Intelligence Ready for Operations
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Every step is sealed with cryptographic SHA-256 hashes, generating a 6-page A4 Intelligence Dossier and GeoJSON GIS layers.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link href={`/analyses/${result.id}`}>
                  <Button className="h-8 px-4 text-xs font-semibold bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] gap-1.5">
                    <span>Inspect Workspace</span>
                    <ExternalLink size={12} />
                  </Button>
                </Link>
                <Link href={`/reports/${result.id}`}>
                  <Button variant="outline" className="h-8 px-4 text-xs font-medium bg-[#0F172A] border-[#1E293B] text-[#E2E8F0]">
                    <span>View Dossier</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 p-5 rounded-xl bg-[#0B132B] border border-[#1E293B] space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-[#64748B] border-b border-[#1E293B] pb-2">
                <span>AUDIT RECORD</span>
                <span className="text-[#10B981]">SHA-256 SEALED</span>
              </div>
              <div className="space-y-1 text-[11px] text-[#94A3B8]">
                <div>• Run ID: {result.id}</div>
                <div>• Models: ChangeFormer-RS v2.1, SAR-PolarCoherence v1.4</div>
                <div>• Calibrated Score: 92% (ECE: 3.7%)</div>
                <div>• Exports: PDF, GeoJSON, CSV, Audit Bundle JSON</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Stepper Navigation Footer */}
      <footer className="h-16 bg-[#07111F] border-t border-[#1E293B] px-6 lg:px-10 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={slide === 1}
          className="h-8 px-3 text-xs font-medium bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
        >
          <ArrowLeft size={13} className="mr-1" />
          <span>Previous</span>
        </Button>

        {/* Stepper Dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlide(idx + 1)}
              className={`w-2 h-2 rounded-full transition-colors ${
                slide === idx + 1
                  ? 'bg-[#38BDF8]'
                  : idx + 1 < slide
                  ? 'bg-[#10B981]'
                  : 'bg-[#1E293B]'
              }`}
            />
          ))}
        </div>

        {slide < totalSlides ? (
          <Button
            onClick={handleNext}
            className="h-8 px-4 text-xs font-semibold bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8]"
          >
            <span>Next</span>
            <ArrowRight size={13} className="ml-1" />
          </Button>
        ) : (
          <Link href={`/analyses/${result.id}`}>
            <Button className="h-8 px-4 text-xs font-semibold bg-[#10B981] text-[#FFFFFF] hover:bg-[#059669]">
              <span>Open Active Workspace</span>
              <ArrowRight size={13} className="ml-1" />
            </Button>
          </Link>
        )}
      </footer>
    </div>
  );
}
