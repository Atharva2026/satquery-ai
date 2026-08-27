'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Sliders,
  MapPin,
  Compass,
  FileCode,
  RotateCcw,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { ImageUploader } from '@/components/upload/ImageUploader';
import { AIInterpretation } from '@/components/ai/AIInterpretation';
import { AnalysisPlan } from '@/components/ai/AnalysisPlan';
import { AnalysisProgress } from '@/components/ai/AnalysisProgress';
import { sampleAssets } from '@/lib/mock-data';
import type {
  AnalysisMode,
  InputAsset,
  Interpretation,
  AnalysisPlan as AnalysisPlanType,
} from '@/types';
import { toast } from 'sonner';

export default function AnalyzeLauncherPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialMode = (searchParams.get('mode') as AnalysisMode) || 'temporal';

  const [mode, setMode] = useState<AnalysisMode>(initialMode);
  const [query, setQuery] = useState(initialQuery);
  const [files, setFiles] = useState<InputAsset[]>(sampleAssets);
  const [locationName, setLocationName] = useState('Pune Peri-Urban Extension');
  const [locationCoords, setLocationCoords] = useState('18.5204° N, 73.8567° E');
  const [aoiArea, setAoiArea] = useState('4.2 km²');
  const [step, setStep] = useState<'input' | 'plan' | 'running'>('input');
  const [progressStage, setProgressStage] = useState(0);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Advanced inference parameters
  const [minAgreement, setMinAgreement] = useState(0.7);
  const [temperatureScaling, setTemperatureScaling] = useState(1.35);
  const [enforceAbstention, setEnforceAbstention] = useState(true);

  // Interpretation state
  const [interpretation, setInterpretation] = useState<Interpretation>({
    task:
      mode === 'temporal'
        ? 'Bi-Temporal Change Detection'
        : mode === 'optical-sar'
        ? 'Optical + SAR Fusion'
        : 'Single Image VQA',
    inputs: `${files.length} Co-registered GeoTIFFs`,
    area: `${locationName} (${aoiArea})`,
    time: mode === 'temporal' ? 'Jan 2026 → Aug 2026' : 'Current Pass (Aug 2026)',
  });

  const plan: AnalysisPlanType = {
    summary:
      mode === 'temporal'
        ? 'Isolate structural developments between Jan & Aug using ChangeFormer + SAR verification.'
        : mode === 'optical-sar'
        ? 'Classify water inundation under cloud shadow by fusing Sentinel-2 with Sentinel-1 SAR.'
        : 'Classify dominant land-cover and locate transport infrastructure using GroundingDINO.',
    specialists: [
      {
        id: 'spec-1',
        name:
          mode === 'temporal'
            ? 'ChangeFormer-RS v2.1'
            : mode === 'optical-sar'
            ? 'Optical-MNDWI v1.2'
            : 'RemoteCLIP-RS v2.0',
        role: 'Primary Detector',
        purpose: 'Extract candidate spatial signals from optical bands.',
      },
      {
        id: 'spec-2',
        name: mode === 'single' ? 'GroundingDINO-RS v2.1' : 'SAR-PolarCoherence v1.4',
        role: 'Consensus Check',
        purpose: 'Cross-check microwave radar backscatter to verify vertical structures.',
      },
      {
        id: 'spec-3',
        name: 'Platt-Temperature-Calibrator',
        role: 'Calibrator',
        purpose: 'Calibrate confidence distribution (T=1.35) and bind spatial evidence.',
      },
    ],
  };

  const handleModeChange = (newMode: AnalysisMode) => {
    setMode(newMode);
    if (newMode === 'single') {
      setFiles([
        {
          id: 'asset-port-1',
          name: 'JNPT_Port_S2_Optical.tif',
          role: 'single',
          modality: 'optical',
          format: 'geotiff',
          thumbnailUrl:
            'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
          width: 4096,
          height: 4096,
          bands: 4,
          bitDepth: '16-bit Unsigned',
          acquisitionDate: '22 Aug 2026',
          crs: 'EPSG:4326 (WGS 84)',
          georeferencingStatus: 'georeferenced',
          registrationStatus: 'co-registered',
          compatibility: 'compatible',
        },
      ]);
      setLocationName('JNPT Maritime Port Terminal');
      setLocationCoords('18.9500° N, 72.9500° E');
      setAoiArea('3.8 km²');
      setQuery('Describe dominant land-cover and locate transport infrastructure.');
    } else if (newMode === 'temporal') {
      setFiles(sampleAssets);
      setLocationName('Pune Peri-Urban Extension');
      setLocationCoords('18.5204° N, 73.8567° E');
      setAoiArea('4.2 km²');
      setQuery('Did construction increase between Jan and Aug? Highlight new structures.');
    } else if (newMode === 'optical-sar') {
      setFiles([
        {
          id: 'asset-flood-opt',
          name: 'Sentinel2_Assam_Optical_Surface.tif',
          role: 'optical',
          modality: 'optical',
          format: 'geotiff',
          thumbnailUrl:
            'https://images.pexels.com/photos/35307470/pexels-photo-35307470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
          width: 4096,
          height: 4096,
          bands: 4,
          bitDepth: '16-bit Unsigned',
          acquisitionDate: '22 Aug 2026',
          crs: 'EPSG:4326 (WGS 84)',
          georeferencingStatus: 'georeferenced',
          registrationStatus: 'co-registered',
          compatibility: 'compatible',
        },
        {
          id: 'asset-flood-sar',
          name: 'Sentinel1_Assam_SAR_Backscatter.tif',
          role: 'sar',
          modality: 'sar',
          format: 'geotiff',
          thumbnailUrl:
            'https://images.pexels.com/photos/8963356/pexels-photo-8963356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900',
          width: 4096,
          height: 4096,
          bands: 2,
          bitDepth: '16-bit Float',
          acquisitionDate: '22 Aug 2026',
          crs: 'EPSG:4326 (WGS 84)',
          georeferencingStatus: 'georeferenced',
          registrationStatus: 'co-registered',
          compatibility: 'compatible',
        },
      ]);
      setLocationName('Brahmaputra Floodplain Basin');
      setLocationCoords('26.1445° N, 91.7362° E');
      setAoiArea('4.1 km²');
      setQuery('Is there flood inundation in this area? Assess affected zones under cloud cover.');
    }
  };

  const handleSelectSample = (sampleType: string) => {
    if (sampleType === 'urban') {
      handleModeChange('temporal');
    } else if (sampleType === 'flood') {
      handleModeChange('optical-sar');
    } else {
      handleModeChange('single');
    }
  };

  const handleReset = () => {
    setQuery('');
    setFiles([]);
    toast.info('Analysis launcher reset.');
  };

  const handleSaveDraft = () => {
    toast.success('Analysis session draft saved to local workspace.');
  };

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setQuery(
        mode === 'temporal'
          ? 'Did construction increase between Jan and Aug? Highlight new structures.'
          : mode === 'optical-sar'
          ? 'Is there flood inundation in this area? Assess affected zones under cloud cover.'
          : 'Describe dominant land-cover and locate transport infrastructure.'
      );
    }
    setInterpretation({
      task:
        mode === 'temporal'
          ? 'Bi-Temporal Change Detection'
          : mode === 'optical-sar'
          ? 'Optical + SAR Fusion'
          : 'Single Image VQA',
      inputs: `${files.length} Co-registered GeoTIFFs`,
      area: `${locationName} (${aoiArea})`,
      time: mode === 'temporal' ? 'Jan 2026 → Aug 2026' : 'Current Pass (Aug 2026)',
    });
    setStep('plan');
  };

  const handleConfirmAndRun = () => {
    setStep('running');
    setProgressStage(0);

    const interval = setInterval(() => {
      setProgressStage((prev) => {
        if (prev < 5) return prev + 1;
        clearInterval(interval);
        setTimeout(() => {
          router.push('/analyses/analysis-urban-growth');
        }, 400);
        return prev;
      });
    }, 450);
  };

  return (
    <AppShell>
      <div className="max-w-[1080px] w-full mx-auto px-4 sm:px-8 py-8 space-y-7 font-sans">
        {/* Top Header */}
        <div className="border-b border-[#1E293B] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Start Satellite Analysis
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Select imagery modality, provide satellite rasters, specify AOI extent, and state your query.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              className="h-8 px-2.5 text-xs font-medium bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <Bookmark size={12} className="mr-1" />
              <span>Save draft</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 px-2 text-xs font-medium text-[#64748B] hover:text-[#EF4444]"
              title="Reset form"
            >
              <RotateCcw size={13} />
            </Button>
          </div>
        </div>

        {/* STEP 1: INPUT & UPLOAD */}
        {step === 'input' && (
          <div className="space-y-6">
            {/* 1. Modality Mode Selector */}
            <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
                  01. Select Analysis Modality
                </span>
                <span className="text-[11px] font-mono text-[#38BDF8]">
                  {mode === 'single' ? '1 Image Required' : '2 Co-registered Images Required'}
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleModeChange('single')}
                  className={`p-3.5 rounded-lg border text-left transition-colors space-y-1 ${
                    mode === 'single'
                      ? 'bg-[#07111F] border-[#38BDF8]'
                      : 'bg-[#07111F]/60 border-[#1E293B] hover:border-[#334155]'
                  }`}
                >
                  <div className="text-xs font-semibold text-[#F1F5F9]">Single image</div>
                  <p className="text-[11px] text-[#94A3B8]">
                    1 optical or SAR scene. VQA, land-cover classification, spatial grounding.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('temporal')}
                  className={`p-3.5 rounded-lg border text-left transition-colors space-y-1 ${
                    mode === 'temporal'
                      ? 'bg-[#07111F] border-[#38BDF8]'
                      : 'bg-[#07111F]/60 border-[#1E293B] hover:border-[#334155]'
                  }`}
                >
                  <div className="text-xs font-semibold text-[#F1F5F9]">Before + after</div>
                  <p className="text-[11px] text-[#94A3B8]">
                    2 temporal passes (T1 &amp; T2). Isolate construction and vegetation shifts.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('optical-sar')}
                  className={`p-3.5 rounded-lg border text-left transition-colors space-y-1 ${
                    mode === 'optical-sar'
                      ? 'bg-[#07111F] border-[#38BDF8]'
                      : 'bg-[#07111F]/60 border-[#1E293B] hover:border-[#334155]'
                  }`}
                >
                  <div className="text-xs font-semibold text-[#F1F5F9]">Optical + SAR</div>
                  <p className="text-[11px] text-[#94A3B8]">
                    2 sensor channels. Penetrate cloud cover using radar backscatter fusion.
                  </p>
                </button>
              </div>
            </div>

            {/* 2. Mode-Adaptive Imagery Dropzone Slots */}
            <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-4 sm:p-5 space-y-4">
              <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block">
                02. Upload Imagery Stacks
              </span>
              <ImageUploader
                mode={mode}
                files={files}
                onFilesChange={setFiles}
                onSelectSample={handleSelectSample}
              />
            </div>

            {/* 3. Location & Spatial AOI Extent Bar */}
            <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
                  03. Target AOI &amp; Coordinates
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">EPSG:4326 (WGS 84)</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 flex items-center gap-2 p-2.5 rounded-lg bg-[#07111F] border border-[#1E293B]">
                  <MapPin size={15} className="text-[#38BDF8] shrink-0" />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Search place, coordinates, or AOI name..."
                    className="w-full bg-transparent text-xs text-[#F1F5F9] placeholder-[#64748B] outline-none font-sans"
                  />
                  <span className="text-[11px] font-mono text-[#64748B] shrink-0">
                    {locationCoords}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLocationName('Pune Peri-Urban');
                      setLocationCoords('18.5204° N, 73.8567° E');
                      setAoiArea('4.2 km²');
                    }}
                    className="flex-1 p-2 rounded-lg bg-[#07111F] border border-[#1E293B] text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#334155] text-center transition-colors"
                  >
                    Pune (4.2 km²)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocationName('Assam Floodplain');
                      setLocationCoords('26.1445° N, 91.7362° E');
                      setAoiArea('4.1 km²');
                    }}
                    className="flex-1 p-2 rounded-lg bg-[#07111F] border border-[#1E293B] text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#334155] text-center transition-colors"
                  >
                    Assam (4.1 km²)
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Natural Language Question Form */}
            <form
              onSubmit={handleGeneratePlan}
              className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-4 sm:p-5 space-y-4"
            >
              <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block">
                04. Natural Language Question
              </span>
              <div className="space-y-3">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Did construction increase between Jan and Aug? Highlight new structures."
                  rows={3}
                  className="w-full rounded-lg bg-[#07111F] border border-[#1E293B] focus:border-[#38BDF8] p-3.5 text-xs sm:text-sm text-[#F1F5F9] placeholder-[#64748B] resize-none outline-none font-sans"
                />

                {/* Suggested prompt chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#94A3B8]">
                  <span className="text-[11px] text-[#64748B]">Suggestions:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuery('Did construction increase between Jan and Aug? Highlight new structures.')
                    }
                    className="px-2 py-0.5 rounded bg-[#07111F] border border-[#1E293B] text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    “Did construction increase between Jan and Aug?”
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setQuery('Is there flood inundation in this area? Assess affected zones under cloud cover.')
                    }
                    className="px-2 py-0.5 rounded bg-[#07111F] border border-[#1E293B] text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    “Assess flood inundation under cloud cover”
                  </button>
                </div>

                {/* Advanced parameters toggle */}
                <div className="pt-2 border-t border-[#1E293B]/60">
                  <button
                    type="button"
                    onClick={() => setAdvancedOpen(!advancedOpen)}
                    className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#94A3B8] transition-colors"
                  >
                    <Sliders size={12} />
                    <span>{advancedOpen ? 'Hide inference parameters' : 'Configure inference parameters (Thresholds & Calibration)'}</span>
                    {advancedOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  {advancedOpen && (
                    <div className="mt-3 p-4 rounded-lg bg-[#07111F] border border-[#1E293B] grid sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[#64748B] block mb-1">Agreement Bound:</span>
                        <input
                          type="number"
                          step="0.05"
                          min="0.5"
                          max="0.95"
                          value={minAgreement}
                          onChange={(e) => setMinAgreement(parseFloat(e.target.value))}
                          className="w-full bg-[#0B132B] border border-[#1E293B] rounded px-2 py-1 text-[#F1F5F9] outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[#64748B] block mb-1">Temperature Factor (T):</span>
                        <input
                          type="number"
                          step="0.05"
                          value={temperatureScaling}
                          onChange={(e) => setTemperatureScaling(parseFloat(e.target.value))}
                          className="w-full bg-[#0B132B] border border-[#1E293B] rounded px-2 py-1 text-[#F1F5F9] outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[#64748B] block mb-1">Safety Abstention:</span>
                        <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={enforceAbstention}
                            onChange={(e) => setEnforceAbstention(e.target.checked)}
                            className="accent-[#2563EB]"
                          />
                          <span className="text-[#F1F5F9] text-xs">Active</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-[#64748B]">
                    Specialist routing will configure automatically
                  </span>
                  <Button
                    type="submit"
                    className="h-8 px-4 text-xs font-semibold bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] gap-1.5 transition-colors"
                  >
                    <span>Generate Analysis Plan</span>
                    <ArrowRight size={13} />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: PLAN CONFIRMATION */}
        {step === 'plan' && (
          <div className="space-y-6">
            <AIInterpretation
              interpretation={interpretation}
              onEditChip={() => setStep('input')}
            />

            <AnalysisPlan
              plan={plan}
              onConfirmPlan={handleConfirmAndRun}
              onCustomizePlan={() => setStep('input')}
            />
          </div>
        )}

        {/* STEP 3: OBSERVABLE PROGRESS */}
        {step === 'running' && (
          <div className="max-w-2xl mx-auto py-4">
            <AnalysisProgress currentStage={progressStage} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
