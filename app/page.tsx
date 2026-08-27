'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowRight,
  Check,
  Search,
  Crosshair,
  Building2,
  Waves,
  TramFront,
  Leaf,
  FileText,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopNav } from '@/components/satquery/TopNav';
import { ProofDemo } from '@/components/landing/ProofDemo';
import { LandingWorkflows } from '@/components/landing/LandingWorkflows';
import { LandingOrchestration } from '@/components/landing/LandingOrchestration';
import { IMG } from '@/lib/mock-data';

const GlobeHero = dynamic(
  () => import('@/components/landing/GlobeHero').then((m) => m.GlobeHero),
  { ssr: false }
);

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollableHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const progressPercent = Math.min(100, Math.max(0, Math.round(scrollProgress * 100)));

  return (
    <div className="relative min-h-screen bg-[#07111F] text-[#F1F5F9] font-sans selection:bg-[#20A4F3]/20">
      {/* PERSISTENT FULL-PAGE FIXED 3D GLOBE BACKDROP */}
      <GlobeHero scrollProgress={scrollProgress} />

      {/* FOREGROUND CONTENT LAYER */}
      <div className="relative z-10">
        {/* Top Global Navigation */}
        <TopNav />

        {/* SECTION 1: HERO VIEW (With Hero-Scoped HUD & Contrast Scrim) */}
        <section className="relative min-h-[calc(100vh-3.5rem)] flex flex-col justify-between max-w-[1280px] mx-auto px-6 sm:px-10 py-10">
          {/* Subtle Contrast Scrim Gradient (Left Column Only) */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-[680px] bg-gradient-to-r from-[#07111F]/95 via-[#07111F]/70 to-transparent pointer-events-none -z-10" />

          {/* Top Hero-Scoped HUD Metadata (Scrolls away with Hero) */}
          <div className="flex items-start justify-between font-mono text-xs z-10 pt-2 pointer-events-none">
            {/* Left HUD */}
            <div className="space-y-1.5 pointer-events-auto">
              <div className="text-[11px] font-bold tracking-[0.2em] text-[#F8FAFC]">
                GLOBE <span className="text-[9px] text-[#64748B]">3D</span>
              </div>
              <div className="space-y-0.5 text-[10px] text-[#64748B]">
                <div className="flex gap-3">
                  <span className="w-14">SCENE</span>
                  <span className="text-[#94A3B8]">01 / GLOBAL RECON</span>
                </div>
                <div className="flex gap-3">
                  <span className="w-14">DATASET</span>
                  <span className="text-[#94A3B8]">SENTINEL-1/2 CONSTELLATION</span>
                </div>
                <div className="flex gap-3">
                  <span className="w-14">PROGRESS</span>
                  <span className="text-[#38BDF8]">{progressPercent}%</span>
                </div>
              </div>
            </div>

            {/* Right HUD Controls */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                className="w-7 h-7 rounded border border-[#1E293B] bg-[#07111F]/80 text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center transition-colors"
                title="Search region"
              >
                <Search size={13} />
              </button>
              <button
                type="button"
                className="w-7 h-7 rounded border border-[#1E293B] bg-[#07111F]/80 text-[#38BDF8] hover:text-[#F8FAFC] flex items-center justify-center transition-colors"
                title="Target AOI"
              >
                <Crosshair size={13} />
              </button>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#1E293B] bg-[#07111F]/80 text-[10px] text-[#94A3B8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>LIVE</span>
              </div>
            </div>
          </div>

          {/* Center Main Headline & Mission Control Description */}
          <div className="max-w-xl space-y-5 my-auto py-12">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded border border-[#1E293B] bg-[#07111F]/90 text-[11px] font-mono text-[#94A3B8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
              <span>PRECISION REMOTE-SENSING DECISION PLATFORM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-[#F8FAFC] leading-[1.15]">
              Multimodal Satellite Intelligence &amp; Evidence Grounding.
            </h1>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Query optical, SAR, and bi-temporal satellite rasters in natural language. Automated specialist routing isolates candidate regions, calculates calibrated confidence, and extracts pixel-grounded evidence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/analyze">
                <Button className="bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] gap-2 h-9 px-4 text-xs font-semibold transition-colors shadow-sm">
                  <span>Start analysis</span>
                  <ArrowRight size={13} />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  variant="outline"
                  className="h-9 px-4 text-xs font-medium text-[#94A3B8] border-[#1E293B] bg-[#07111F]/80 hover:bg-[#0F172A] hover:text-[#F8FAFC]"
                >
                  Explore demo
                </Button>
              </Link>
            </div>

            {/* Factual Capability Specs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#94A3B8]">
              <span className="flex items-center gap-1.5">
                <Check size={13} className="text-[#10B981]" />
                <span>Single-image VQA</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={13} className="text-[#10B981]" />
                <span>Before + after change</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={13} className="text-[#10B981]" />
                <span>Optical + SAR fusion</span>
              </span>
            </div>
          </div>

          {/* Bottom Hero Scroll Prompt */}
          <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B] pb-2">
            <div>SatQuery RS // INTERACTIVE EARTH OBSERVATION</div>
            <div className="flex items-center gap-1 text-[#38BDF8]">
              <span>SCROLL TO EXPLORE</span>
              <span>↓</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE SATELLITE ANALYSIS PROOF (Solid High-Contrast Surface) */}
        <section className="bg-[#07111F] border-y border-[#1E293B] py-16">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 space-y-6">
            <div className="max-w-xl space-y-1">
              <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider">
                Demonstration
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                Ask a question. SatQuery finds the evidence.
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Natural language queries trigger multi-sensor routing, candidate isolation, and verified evidence grounding.
              </p>
            </div>

            <ProofDemo />
          </div>
        </section>

        {/* SECTION 3: THREE SUPPORTED WORKFLOWS (Solid High-Contrast Surface) */}
        <section className="bg-[#0B132B] border-b border-[#1E293B] py-16">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 space-y-8">
            <div className="max-w-xl space-y-1">
              <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider">
                Modalities
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                Three Core Remote-Sensing Workflows
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Automated task classification assigns inputs to dedicated vision-language and remote-sensing architectures.
              </p>
            </div>

            <LandingWorkflows />
          </div>
        </section>

        {/* SECTION 4: EVIDENCE-FIRST RESULT (Solid High-Contrast Surface) */}
        <section className="bg-[#07111F] border-b border-[#1E293B] py-16">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider">
                Spatial Grounding
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                Every Finding is Bound to Spatial Pixels
              </h2>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                SatQuery extracts coordinate bounding boxes and vector polygons that bind claims directly to satellite imagery, eliminating unsubstantiated text outputs.
              </p>
              <div className="space-y-2 text-xs pt-1">
                <div className="p-3 rounded-lg bg-[#0B132B] border border-[#1E293B]">
                  <div className="font-semibold text-[#F1F5F9]">Numbered Evidence Regions</div>
                  <div className="text-[#94A3B8] text-[11px] mt-0.5">
                    Inspect before/after crops, sensor basis, and localized confidence for each polygon.
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#0B132B] border border-[#1E293B]">
                  <div className="font-semibold text-[#F1F5F9]">Cross-Modal Corroboration</div>
                  <div className="text-[#94A3B8] text-[11px] mt-0.5">
                    Optical and SAR evidence cross-validate each other to eliminate false positives.
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Split Exhibit */}
            <div className="lg:col-span-7 rounded-xl bg-[#0B132B] border border-[#1E293B] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <span className="text-xs font-mono font-medium text-[#94A3B8]">
                  Evidence Inspection Exhibit
                </span>
                <span className="text-xs font-mono text-[#10B981]">
                  6 verified clusters
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-[#64748B]">T1: 14 JAN 2026 (OPTICAL)</div>
                  <div className="h-40 rounded-lg overflow-hidden border border-[#1E293B]">
                    <img src={IMG.urbanT1} alt="T1" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-[#38BDF8]">T2: 22 AUG 2026 (GROUNDED)</div>
                  <div className="relative h-40 rounded-lg overflow-hidden border border-[#38BDF8]/40">
                    <img src={IMG.urbanT2} alt="T2" className="w-full h-full object-cover" />
                    <div className="absolute inset-4 border border-[#38BDF8] bg-[#38BDF8]/10 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: OPTICAL + SAR FUSION COMPARISON (Solid High-Contrast Surface) */}
        <section className="bg-[#0B132B] border-b border-[#1E293B] py-16">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 space-y-6">
            <div className="max-w-xl space-y-1">
              <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider">
                Sensor Fusion
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                Radar &amp; Optical Agreement
              </h2>
              <p className="text-xs text-[#94A3B8]">
                When clouds or darkness obscure optical vision, synthetic aperture radar (SAR) provides independent structural backscatter.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl bg-[#07111F] border border-[#1E293B] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F1F5F9]">Optical Surface View (Sentinel-2)</span>
                  <span className="text-[10px] font-mono text-[#F59E0B]">48% Cloud Cover</span>
                </div>
                <div className="h-48 rounded-lg overflow-hidden border border-[#1E293B]">
                  <img src={IMG.floodT2} alt="Optical Flood" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Optical water indices identify inundation boundaries, but cloud shadows create uncertainty along river reaches.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#07111F] border border-[#1E293B] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F1F5F9]">SAR Radar Coherence (Sentinel-1)</span>
                  <span className="text-[10px] font-mono text-[#10B981]">Cloud Penetrated</span>
                </div>
                <div className="h-48 rounded-lg overflow-hidden border border-[#1E293B]">
                  <img src={IMG.flood} alt="SAR Flood" className="w-full h-full object-cover grayscale contrast-125" />
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Radar passes through clouds; smooth water reflects microwave pulses away, producing distinct dark pixel clusters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: AGENTIC ORCHESTRATION (Solid High-Contrast Surface) */}
        <section className="bg-[#07111F] border-b border-[#1E293B] py-16">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
            <LandingOrchestration />
          </div>
        </section>

        {/* SECTION 7: CONFIDENCE & UNCERTAINTY (Solid High-Contrast Surface) */}
        <section className="bg-[#0B132B] border-b border-[#1E293B] py-16">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider">
                Uncertainty Calibration
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                Calibrated Confidence &amp; Explicit Abstention
              </h2>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Platt temperature scaling (T=1.35) and multi-sensor agreement penalties ensure confidence percentages reflect statistical truth rather than raw uncalibrated logits.
              </p>
              <div className="p-3.5 rounded-lg bg-[#07111F] border border-[#1E293B] space-y-1 text-xs">
                <span className="font-semibold text-[#F59E0B] block">Safety Abstention</span>
                <p className="text-[#94A3B8]">
                  When sensor coverage is insufficient or cloud occlusion prevents verification, SatQuery explicitly refuses to guess.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 p-5 rounded-xl bg-[#07111F] border border-[#1E293B] space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 text-xs">
                <span className="font-semibold text-[#F1F5F9]">Confidence Breakdown</span>
                <span className="font-mono text-[#10B981] font-medium">92% High</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#94A3B8]">
                  <span>Statistical Calibration</span>
                  <span className="font-mono text-[#F1F5F9]">0.92</span>
                </div>
                <div className="h-1.5 w-full bg-[#0B132B] rounded-full overflow-hidden border border-[#1E293B]">
                  <div className="h-full bg-[#10B981] w-[92%] rounded-full" />
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-xs text-[#94A3B8]">
                <div className="flex justify-between py-1 border-b border-[#1E293B]/60">
                  <span>Optical change likelihood</span>
                  <span className="font-mono text-[#F1F5F9]">0.89</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E293B]/60">
                  <span>SAR double-bounce likelihood</span>
                  <span className="font-mono text-[#F1F5F9]">0.91</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Expected Calibration Error (ECE)</span>
                  <span className="font-mono text-[#10B981]">3.7%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: REPORTS & AUDIT PREVIEW (Solid High-Contrast Surface) */}
        <section className="bg-[#07111F] border-b border-[#1E293B] py-16">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-3">
              <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider">
                Dossiers &amp; Export
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                6-Page A4 Intelligence Dossier
              </h2>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Export comprehensive intelligence dossiers ready for operational distribution. Includes visual evidence crops, CRS bounds, calibrated confidence, model weights hashes, and GeoJSON GIS layers.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2 py-0.5 rounded bg-[#0B132B] border border-[#1E293B] text-[11px] font-mono text-[#94A3B8]">
                  A4 PDF
                </span>
                <span className="px-2 py-0.5 rounded bg-[#0B132B] border border-[#1E293B] text-[11px] font-mono text-[#94A3B8]">
                  GeoJSON
                </span>
                <span className="px-2 py-0.5 rounded bg-[#0B132B] border border-[#1E293B] text-[11px] font-mono text-[#94A3B8]">
                  CSV
                </span>
                <span className="px-2 py-0.5 rounded bg-[#0B132B] border border-[#1E293B] text-[11px] font-mono text-[#94A3B8]">
                  Audit JSON
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-xl bg-[#0B132B] border border-[#1E293B] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
                <span className="text-xs font-mono font-medium text-[#F1F5F9]">
                  Intelligence Briefing Summary
                </span>
                <Link href="/reports/analysis-urban-growth">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-[11px] bg-[#07111F] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    <Download size={11} className="mr-1" />
                    <span>View Dossier</span>
                  </Button>
                </Link>
              </div>
              <div className="space-y-1.5 text-xs font-mono text-[#94A3B8]">
                <div className="flex justify-between">
                  <span>Classification:</span>
                  <span className="text-[#10B981]">Official // Satellite Intelligence</span>
                </div>
                <div className="flex justify-between">
                  <span>Target AOI:</span>
                  <span className="text-[#F1F5F9]">Pune Peri-Urban Extension</span>
                </div>
                <div className="flex justify-between">
                  <span>Sensor Channels:</span>
                  <span>Sentinel-2 (10m) + Sentinel-1 SAR</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: USE CASES (Solid High-Contrast Surface) */}
        <section className="bg-[#0B132B] border-b border-[#1E293B] py-16">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 space-y-8">
            <div className="max-w-xl space-y-1">
              <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider">
                Operational Applications
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                Geospatial Decision Support
              </h2>
              <p className="text-xs text-[#94A3B8]">
                From disaster management to infrastructure monitoring, SatQuery provides verifiable decisions.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#07111F] border border-[#1E293B] space-y-2">
                <h3 className="text-xs font-semibold text-[#F8FAFC]">Urban Expansion</h3>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Track illegal constructions, warehouse development, and peri-urban infrastructure changes across quarterly baselines.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#07111F] border border-[#1E293B] space-y-2">
                <h3 className="text-xs font-semibold text-[#F8FAFC]">Disaster Inundation</h3>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Map monsoon flood extent through dense cloud layers using all-weather SAR radar backscatter reflection.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#07111F] border border-[#1E293B] space-y-2">
                <h3 className="text-xs font-semibold text-[#F8FAFC]">Transit Corridors</h3>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Monitor highway alignments, railway grade construction, and environmental encroachment along rights of way.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#07111F] border border-[#1E293B] space-y-2">
                <h3 className="text-xs font-semibold text-[#F8FAFC]">Land-Cover Transitions</h3>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Quantify deforestation, wetland degradation, and agricultural crop conversion with spatial evidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: FINAL CTA & FOOTER (Solid High-Contrast Surface) */}
        <section className="bg-[#07111F] pt-14 pb-10">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 space-y-10">
            <div className="rounded-2xl bg-[#0B132B] border border-[#1E293B] p-8 sm:p-10 text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
                Start an analysis on your imagery
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto">
                Get grounded findings with spatial polygons, cross-sensor radar validation, and verifiable intelligence dossiers.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <Link href="/analyze">
                  <Button className="bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] gap-1.5 h-9 px-5 text-xs font-semibold">
                    <span>Start Analysis</span>
                    <ArrowRight size={13} />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button
                    variant="outline"
                    className="h-9 px-4 text-xs font-medium text-[#94A3B8] border-[#1E293B] bg-[#07111F] hover:bg-[#0F172A] hover:text-[#F8FAFC]"
                  >
                    Explore Demo
                  </Button>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1E293B]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#64748B]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#94A3B8]">SatQuery RS</span>
                <span>· Remote-Sensing Decision Platform</span>
              </div>
              <div>WGS 84 (EPSG:4326) · Sentinel-1/2 &amp; Landsat-9</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
