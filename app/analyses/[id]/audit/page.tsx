'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Cpu,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { findScenario, urbanGrowthResult, floodImpactResult, modelRegistry } from '@/lib/mock-data';
import type { AnalysisResult } from '@/types';

export default function AdvancedAuditPage() {
  const params = useParams();
  const runId = (params.id as string) || 'analysis-urban-growth';

  const scenario = findScenario(runId);
  const result: AnalysisResult = scenario
    ? scenario.result
    : runId.includes('flood')
    ? floodImpactResult()
    : urbanGrowthResult();

  const [activeTab, setActiveTab] = useState<'trace' | 'models' | 'inputs' | 'reproduce'>('trace');
  const [copied, setCopied] = useState(false);

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell>
      <div className="flex-1 flex flex-col font-sans bg-[#07111F]">
        {/* Top Header */}
        <div className="border-b border-[#1E293B] bg-[#0B132B] px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/analyses/${runId}`}
              className="p-1 rounded-md bg-[#07111F] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors shrink-0"
              title="Back to Answer"
            >
              <ArrowLeft size={14} />
            </Link>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-[#38BDF8]">
                  RUN {result.id}
                </span>
                <span className="text-[#64748B] text-xs">·</span>
                <h1 className="text-sm font-semibold text-[#F8FAFC] truncate">
                  Audit &amp; Technical Inspection
                </h1>
                <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.2 rounded border border-[#10B981]/20">
                  Audit Sealed
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] truncate max-w-xl">
                “{result.query}”
              </p>
            </div>
          </div>

          <Link href={`/reports/${runId}`}>
            <Button
              size="sm"
              className="h-7 px-3 text-xs font-medium bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8]"
            >
              <Download size={12} className="mr-1" />
              <span>Export Audit Bundle</span>
            </Button>
          </Link>
        </div>

        {/* Persistent Sub-Navigation Tabs */}
        <div className="bg-[#07111F] border-b border-[#1E293B] px-4 lg:px-8 flex items-center justify-between">
          <nav className="flex items-center gap-1 -mb-px">
            <Link
              href={`/analyses/${runId}`}
              className="px-3.5 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              Answer
            </Link>
            <Link
              href={`/analyses/${runId}/evidence`}
              className="px-3.5 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              Evidence ({result.evidence.length})
            </Link>
            <Link
              href={`/analyses/${runId}/compare`}
              className="px-3.5 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              Compare
            </Link>
            <Link
              href={`/analyses/${runId}/audit`}
              className="px-3.5 py-2 text-xs font-semibold text-[#F8FAFC] border-b-2 border-[#38BDF8]"
            >
              Audit &amp; Trace
            </Link>
          </nav>
        </div>

        {/* Audit Sub-Tabs Navigation */}
        <div className="max-w-[1080px] w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#1E293B] pb-2.5">
            <button
              onClick={() => setActiveTab('trace')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'trace'
                  ? 'bg-[#1E293B] text-[#F8FAFC]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Execution Trace
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'models'
                  ? 'bg-[#1E293B] text-[#F8FAFC]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Specialist Models
            </button>
            <button
              onClick={() => setActiveTab('inputs')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'inputs'
                  ? 'bg-[#1E293B] text-[#F8FAFC]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Raster Inputs &amp; CRS
            </button>
            <button
              onClick={() => setActiveTab('reproduce')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'reproduce'
                  ? 'bg-[#1E293B] text-[#F8FAFC]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Reproducibility JSON
            </button>
          </div>

          {/* TAB 1: OBSERVABLE EXECUTION TRACE */}
          {activeTab === 'trace' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#64748B] uppercase">
                  Event Log ({result.executionTrace.length} events)
                </span>
                <span className="text-xs font-mono text-[#10B981]">
                  ✓ Verified End-to-End
                </span>
              </div>

              <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] divide-y divide-[#1E293B] font-mono text-xs overflow-hidden">
                {result.executionTrace.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#0F172A] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#64748B] text-[11px] shrink-0">{evt.timestamp}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#07111F] text-[#38BDF8] border border-[#1E293B] shrink-0">
                        {evt.type.toUpperCase()}
                      </span>
                      <span className="font-semibold text-[#F1F5F9] font-sans">{evt.label}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {evt.metadata?.details && (
                        <span className="text-[#94A3B8] text-[11px]">
                          {evt.metadata.details}
                        </span>
                      )}
                      <span className="text-[#10B981] text-[10px] font-mono">
                        {evt.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SPECIALIST MODELS */}
          {activeTab === 'models' && (
            <div className="grid md:grid-cols-2 gap-4">
              {modelRegistry.map((mod) => (
                <div
                  key={mod.id}
                  className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-5 space-y-3 font-sans"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu size={15} className="text-[#38BDF8]" />
                      <h4 className="text-sm font-semibold text-[#F8FAFC]">{mod.name}</h4>
                    </div>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#07111F] text-[#94A3B8] border border-[#1E293B]">
                      {mod.version}
                    </span>
                  </div>

                  <p className="text-xs text-[#94A3B8] leading-relaxed">{mod.description}</p>

                  <div className="rounded-lg bg-[#07111F] border border-[#1E293B] p-3 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Task:</span>
                      <span className="text-[#F1F5F9]">{mod.task}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Architecture:</span>
                      <span className="text-[#F1F5F9] truncate max-w-[200px]">{mod.architecture}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Weights Hash:</span>
                      <span className="text-[#64748B] text-[10px]">{mod.weightsHash}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: RASTER INPUTS */}
          {activeTab === 'inputs' && (
            <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-5 space-y-4">
              <span className="text-xs font-mono text-[#64748B] uppercase block">
                Immutable Input Manifest
              </span>

              <div className="grid sm:grid-cols-2 gap-4">
                {result.inputs?.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-4 rounded-lg bg-[#07111F] border border-[#1E293B] space-y-2 font-mono text-xs"
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-[#F1F5F9]">
                      <span className="truncate max-w-[220px]">{asset.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#0B132B] text-[#38BDF8] border border-[#1E293B]">
                        {asset.role.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#94A3B8] space-y-1 pt-1">
                      <div>CRS: {asset.crs}</div>
                      <div>Dimensions: {asset.width} × {asset.height} px ({asset.bands} bands)</div>
                      <div>Acquired: {asset.acquisitionDate}</div>
                      <div className="truncate">Hash: {asset.sha256}</div>
                    </div>
                  </div>
                )) || (
                  <div className="col-span-2 p-4 rounded-lg bg-[#07111F] border border-[#1E293B] text-xs text-[#94A3B8]">
                    Inputs co-registered under WGS 84 (EPSG:4326).
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: REPRODUCIBILITY PAYLOAD */}
          {activeTab === 'reproduce' && (
            <div className="rounded-xl bg-[#0B132B] border border-[#1E293B] p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] uppercase">
                  Reproducibility Payload
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleCopyHash(
                      JSON.stringify(
                        {
                          runId: result.id,
                          query: result.query,
                          location: result.location,
                          crs: 'EPSG:4326',
                          calibratedConfidence: result.confidence,
                          temperatureScaling: 1.35,
                          evidenceCount: result.evidence.length,
                        },
                        null,
                        2
                      )
                    )
                  }
                  className="h-7 px-2.5 text-xs bg-[#07111F] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  {copied ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </Button>
              </div>

              <pre className="p-4 rounded-lg bg-[#07111F] border border-[#1E293B] text-[#38BDF8] overflow-x-auto text-[11px] leading-relaxed">
                {JSON.stringify(
                  {
                    runId: result.id,
                    query: result.query,
                    location: result.location,
                    crs: 'EPSG:4326',
                    calibratedConfidence: result.confidence,
                    temperatureScaling: 1.35,
                    evidenceCount: result.evidence.length,
                    evidenceIds: result.evidence.map((e) => e.id),
                    sha256_seal: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
