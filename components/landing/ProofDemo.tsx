'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IMG } from '@/lib/mock-data';

export function ProofDemo() {
  const [step, setStep] = useState<'idle' | 'running' | 'revealed'>('idle');
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after');

  const handleRun = () => {
    setStep('running');
    setTimeout(() => {
      setStep('revealed');
    }, 900);
  };

  const handleReset = () => {
    setStep('idle');
    setActiveTab('after');
  };

  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#0B132B] overflow-hidden">
      {/* Top Bar of Proof Console */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0F172A] border-b border-[#1E293B]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#F1F5F9]">
            System Demonstration
          </span>
          <span className="text-xs text-[#64748B]">·</span>
          <span className="text-xs text-[#94A3B8]">
            Sentinel-2 Optical &amp; Sentinel-1 SAR Pair
          </span>
        </div>

        <div className="flex items-center gap-2">
          {step === 'revealed' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-7 px-2.5 text-xs bg-transparent border-[#1E293B] text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#07111F]"
            >
              <RotateCcw size={12} className="mr-1" />
              <span>Reset</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleRun}
              disabled={step === 'running'}
              className="h-7 px-3 text-xs font-medium bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8]"
            >
              <Play size={11} fill="currentColor" className="mr-1" />
              <span>{step === 'running' ? 'Processing...' : 'Run Query'}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Query Bar */}
      <div className="px-5 py-3.5 border-b border-[#1E293B] bg-[#07111F] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#64748B] font-mono">Query:</span>
          <span className="font-medium text-[#E2E8F0]">
            “Did construction increase between Jan and Aug? Highlight new structures.”
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B] shrink-0">
          <span>14 Jan 2026</span>
          <span>→</span>
          <span>22 Aug 2026</span>
        </div>
      </div>

      {/* Main Split Canvas */}
      <div className="grid lg:grid-cols-12 gap-0">
        {/* Left 7 cols: Map & Evidence Overlay */}
        <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[380px] bg-[#050A14] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1E293B]">
          <img
            src={activeTab === 'before' ? IMG.urbanT1 : IMG.urbanT2}
            alt="Satellite scene"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Crisp bounding box highlights */}
          {step === 'revealed' && (
            <div className="absolute inset-0">
              <div className="absolute top-[28%] left-[22%] w-[18%] h-[16%] border border-[#38BDF8] bg-[#38BDF8]/10 rounded-sm">
                <span className="absolute -top-2.5 left-1 px-1 rounded text-[9px] font-mono bg-[#07111F] text-[#38BDF8] border border-[#1E293B]">
                  1 · Structure (94%)
                </span>
              </div>

              <div className="absolute top-[36%] left-[44%] w-[16%] h-[14%] border border-[#38BDF8] bg-[#38BDF8]/10 rounded-sm">
                <span className="absolute -top-2.5 left-1 px-1 rounded text-[9px] font-mono bg-[#07111F] text-[#38BDF8] border border-[#1E293B]">
                  2 · SAR return (91%)
                </span>
              </div>

              <div className="absolute top-[22%] left-[62%] w-[20%] h-[18%] border border-[#38BDF8] bg-[#38BDF8]/10 rounded-sm">
                <span className="absolute -top-2.5 left-1 px-1 rounded text-[9px] font-mono bg-[#07111F] text-[#38BDF8] border border-[#1E293B]">
                  3 · Cluster (89%)
                </span>
              </div>
            </div>
          )}

          {/* Running indicator */}
          {step === 'running' && (
            <div className="absolute inset-0 bg-[#07111F]/80 flex flex-col items-center justify-center p-6 space-y-2 z-20">
              <div className="w-5 h-5 rounded-full border-2 border-[#1E293B] border-t-[#38BDF8] animate-spin" />
              <div className="text-xs font-mono text-[#94A3B8]">
                Analyzing bi-temporal difference &amp; radar returns...
              </div>
            </div>
          )}

          {/* Layer switcher */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#07111F] border border-[#1E293B] p-0.5 rounded-md z-10">
            <button
              onClick={() => setActiveTab('before')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'before' ? 'bg-[#1E293B] text-[#F8FAFC]' : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              Jan 2026 (T1)
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'after' ? 'bg-[#1E293B] text-[#F8FAFC]' : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              Aug 2026 (T2)
            </button>
          </div>
        </div>

        {/* Right 5 cols: Plain Language Answer & Evidence Basis */}
        <div className="lg:col-span-5 p-5 bg-[#0B132B] flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-medium text-[#64748B] uppercase tracking-wider">
                Finding &amp; Synthesis
              </span>
              <span className="text-xs font-mono font-medium text-[#10B981]">
                92% confidence
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-[#F1F5F9] leading-relaxed">
                {step === 'revealed'
                  ? '17 candidate structures detected, with 6 high-confidence developments verified through optical temporal change and SAR radar double-bounce corroboration.'
                  : 'Click "Run Query" to execute the analysis workflow across Sentinel-2 optical and Sentinel-1 SAR imagery.'}
              </div>
              <div className="text-xs text-[#64748B]">
                Area: Pune Extension · 4.2 km²
              </div>
            </div>

            {/* Evidence Summary List */}
            <div className="space-y-1.5 pt-2 border-t border-[#1E293B]">
              <span className="text-[11px] font-mono text-[#64748B] uppercase block">
                Verification Basis
              </span>
              <div className="space-y-1 text-xs text-[#94A3B8]">
                <div className="flex justify-between py-1 border-b border-[#1E293B]/60">
                  <span>Optical NDVI shift</span>
                  <span className="font-mono text-[#E2E8F0]">0.89</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E293B]/60">
                  <span>SAR double-bounce</span>
                  <span className="font-mono text-[#E2E8F0]">0.91</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Spatial grounding</span>
                  <span className="font-mono text-[#E2E8F0]">6 regions</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E293B]">
            <Link href="/analyses/analysis-urban-growth">
              <Button
                variant="outline"
                className="w-full h-8 text-xs font-medium bg-[#0F172A] border-[#1E293B] text-[#E2E8F0] hover:bg-[#1E293B] justify-between"
              >
                <span>Inspect Workspace &amp; Trace</span>
                <ArrowRight size={13} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
