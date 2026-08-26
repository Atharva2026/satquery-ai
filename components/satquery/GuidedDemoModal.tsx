'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Satellite,
  ShieldCheck,
  Ban,
  GitCompare,
  FileText,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuidedDemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectScenario: (scenarioId: string) => void;
}

const steps = [
  {
    badge: 'STAGE 1: THE CORE PROBLEM',
    title: 'Satellite Data is Massive. Naive AI Hallucinates.',
    description:
      'Earth observation data grows by terabytes daily. Operational decision-makers need trustworthy answers, but standard AI models return confident claims with zero spatial grounding, no cross-sensor checks, and hidden hallucinations.',
    icon: Satellite,
    iconColor: 'text-[#F5A524] bg-[#F5A524]/15 border-[#F5A524]/30',
    highlight:
      'SatQuery AI grounds every single claim directly into pixel-level bounding coordinates.',
    actionLabel: 'Explore Cross-Sensor Fusion',
    scenarioToLoad: null,
  },
  {
    badge: 'STAGE 2: MULTI-SENSOR REASONING',
    title: 'Optical (Sentinel-2) + SAR Radar (Sentinel-1)',
    description:
      'Cloud cover and low contrast easily deceive single-sensor models. SatQuery cross-verifies optical spectral reflections with Synthetic Aperture Radar (SAR) double-bounce structural returns.',
    icon: GitCompare,
    iconColor: 'text-[#20A4F3] bg-[#20A4F3]/15 border-[#20A4F3]/30',
    highlight:
      'Try the "Urban Growth" demo where both Optical & SAR confirm 17 new structures (92% calibrated confidence).',
    actionLabel: 'Load Urban Growth (Confident)',
    scenarioToLoad: 'urban-growth',
  },
  {
    badge: 'STAGE 3: THE WINNING DIFFERENTIATOR',
    title: 'Abstention as a Safety Feature',
    description:
      'In high-stakes defence, disaster response, and urban governance, an incorrect decision is dangerous. When sensors conflict or radar coverage is unavailable, SatQuery explicitly ABSTAINS rather than guessing.',
    icon: Ban,
    iconColor: 'text-[#F05D6C] bg-[#F05D6C]/15 border-[#F05D6C]/30',
    highlight:
      'Try the "Infrastructure Change" scenario to see the automated refusal engine in action.',
    actionLabel: 'Load Infrastructure (Abstain)',
    scenarioToLoad: 'infrastructure',
  },
  {
    badge: 'STAGE 4: AUDITABILITY & ACTION',
    title: 'Verifiable 6-Page Intelligence Briefings',
    description:
      'Every analysis generates a cryptographic audit trail (SHA-256 hash, sensor agreement metrics, and pixel bounding boxes) exportable directly as Intelligence PDF briefings and GIS-ready GeoJSON layers.',
    icon: FileText,
    iconColor: 'text-[#19C37D] bg-[#19C37D]/15 border-[#19C37D]/30',
    highlight:
      'Click "Download PDF" or "Export GeoJSON" in the Reports panel to hand off actionable intelligence to field teams.',
    actionLabel: 'Launch Full Workspace',
    scenarioToLoad: 'flood-impact',
  },
];

export function GuidedDemoModal({
  open,
  onOpenChange,
  onSelectScenario,
}: GuidedDemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];

  const handleNext = () => {
    if (step.scenarioToLoad) {
      onSelectScenario(step.scenarioToLoad);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep((c) => c + 1);
    } else {
      onOpenChange(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((c) => c - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0B1628] text-[#F3F7FC] border-[#24344A] p-0 overflow-hidden shadow-2xl">
        <div className="bg-[#081322] text-[#F3F7FC] p-6 border-b border-[#24344A] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#20A4F3] text-[#07111F] font-bold">
                <Sparkles size={15} />
              </div>
              <span className="font-bold text-sm tracking-tight text-[#F3F7FC]">
                SATQUERY AI · Executive Pitch Tour
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    idx === currentStep
                      ? 'w-6 bg-[#20A4F3]'
                      : idx < currentStep
                        ? 'w-2 bg-[#35B7FF]'
                        : 'w-2 bg-[#24344A]',
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border',
                step.iconColor,
              )}
            >
              <step.icon size={24} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#22C7D6] block">
                {step.badge}
              </span>
              <h3 className="text-lg font-bold text-[#F3F7FC]">
                {step.title}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#A8B5C7] leading-relaxed font-normal">
            {step.description}
          </p>

          <div className="rounded-lg border border-[#24344A] bg-[#101C2E] p-3.5 flex items-start gap-3">
            <CheckCircle2 size={16} className="text-[#20A4F3] shrink-0 mt-0.5" />
            <p className="text-xs text-[#F3F7FC] font-medium leading-relaxed">
              {step.highlight}
            </p>
          </div>

          {/* Quick Scenario Jumps */}
          <div className="pt-2 border-t border-[#24344A]">
            <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block mb-2 font-mono">
              Live Scenario Showcase:
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onSelectScenario('urban-growth');
                  onOpenChange(false);
                }}
                className="rounded-lg border border-[#19C37D]/30 bg-[#101C2E] p-2.5 text-left hover:border-[#19C37D] transition-colors group"
              >
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#19C37D] font-mono">
                  <ShieldCheck size={12} />
                  CONFIDENT
                </div>
                <div className="text-[11px] font-semibold text-[#F3F7FC] mt-0.5 truncate">
                  Urban Growth
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectScenario('flood-impact');
                  onOpenChange(false);
                }}
                className="rounded-lg border border-[#F5A524]/30 bg-[#101C2E] p-2.5 text-left hover:border-[#F5A524] transition-colors group"
              >
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#F5A524] font-mono">
                  <AlertTriangle size={12} />
                  UNCERTAIN
                </div>
                <div className="text-[11px] font-semibold text-[#F3F7FC] mt-0.5 truncate">
                  Flood Inundation
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectScenario('infrastructure');
                  onOpenChange(false);
                }}
                className="rounded-lg border border-[#F05D6C]/30 bg-[#101C2E] p-2.5 text-left hover:border-[#F05D6C] transition-colors group"
              >
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#F05D6C] font-mono">
                  <Ban size={12} />
                  ABSTAIN
                </div>
                <div className="text-[11px] font-semibold text-[#F3F7FC] mt-0.5 truncate">
                  Infrastructure
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#24344A] bg-[#081322]">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-1.5 text-xs font-semibold text-[#A8B5C7] hover:text-[#F3F7FC]"
          >
            <ArrowLeft size={13} />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs font-semibold text-[#A8B5C7] border-[#24344A] bg-[#101C2E] hover:bg-[#142238] hover:text-[#F3F7FC] h-8"
            >
              Skip
            </Button>
            <Button
              size="sm"
              onClick={handleNext}
              className="gap-1.5 bg-[#20A4F3] hover:bg-[#35B7FF] text-[#07111F] text-xs font-bold shadow-sm h-8"
            >
              <span>{step.actionLabel}</span>
              <ArrowRight size={13} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
