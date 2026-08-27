'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { demoScenarios } from '@/lib/mock-data';

export default function DemoCenterPage() {
  return (
    <AppShell>
      <div className="max-w-[1080px] w-full mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans">
        {/* Header with Pitch Mode CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Benchmark Demo Center
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Execute complete multimodal remote-sensing workflows with pre-registered benchmark imagery.
            </p>
          </div>

          <Link href="/pitch">
            <Button className="h-8 px-3.5 text-xs font-semibold bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] gap-1.5">
              <Zap size={13} />
              <span>Enter Pitch Mode</span>
              <ArrowRight size={13} />
            </Button>
          </Link>
        </div>

        {/* 4 Core Benchmark Workflow Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {demoScenarios.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-[#0B132B] border border-[#1E293B] hover:border-[#334155] transition-colors p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-[#64748B]">
                    {item.taskMode} · {item.sensors.join(' + ')}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      item.result.verdict === 'CONFIDENT'
                        ? 'text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20'
                        : item.result.verdict === 'UNCERTAIN'
                        ? 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20'
                        : 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20'
                    }`}
                  >
                    {item.result.verdict} ({Math.round(item.result.confidence * 100)}%)
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">{item.title}</h3>
                  <div className="text-xs text-[#38BDF8] font-medium">{item.subtitle}</div>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{item.description}</p>
                </div>

                {/* Imagery Preview */}
                <div className="relative h-36 rounded-lg overflow-hidden bg-[#07111F] border border-[#1E293B]">
                  <img
                    src={item.mapImagery}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#07111F]/90 text-[10px] font-mono text-[#64748B] border border-[#1E293B]">
                    AOI: {item.location}
                  </div>
                </div>

                {/* Query Preview */}
                <div className="p-2.5 rounded bg-[#07111F] border border-[#1E293B] text-xs">
                  <span className="text-[10px] font-mono text-[#64748B] uppercase block">
                    Benchmarked Query:
                  </span>
                  <p className="text-[#CBD5E1] mt-0.5">“{item.query}”</p>
                </div>

                {/* Expected Outputs */}
                {item.expectedOutputs && (
                  <div className="space-y-1 text-[11px] font-mono text-[#64748B]">
                    <div className="flex justify-between">
                      <span>Expected Finding:</span>
                      <span className="text-[#F1F5F9] truncate max-w-[200px]">
                        {item.expectedOutputs.finding}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Models:</span>
                      <span className="text-[#38BDF8]">
                        {item.expectedOutputs.models.join(', ')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between gap-3">
                <Link href={`/analyses/${item.result.id}/audit`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    View Trace
                  </Button>
                </Link>

                <Link href={`/analyses/${item.result.id}`}>
                  <Button
                    size="sm"
                    className="h-7 px-3 text-xs font-medium bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] gap-1"
                  >
                    <span>Run example</span>
                    <ArrowRight size={12} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
