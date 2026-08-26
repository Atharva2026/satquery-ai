import { cn } from '@/lib/utils';
import { SensorAgreement } from './SensorAgreement';
import { DecisionBadge } from './DecisionBadge';
import { AlertTriangle, FileSearch, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AnalysisResult } from '@/types';

interface UncertaintyCardProps {
  analysis: AnalysisResult;
  onInspect?: () => void;
  onReview?: () => void;
  className?: string;
}

const possibleCauses = [
  'Acquisition geometry mismatch between optical and SAR',
  'Temporal baseline discrepancy across passes',
  'Interferometric coherence degradation / cloud shadow',
  'Sub-resolution structural change signature',
];

export function UncertaintyCard({
  analysis,
  onInspect,
  onReview,
  className,
}: UncertaintyCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[#F5A524]/40 bg-[#101C2E] p-4 space-y-4 shadow-sm min-w-0',
        className,
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-[#F5A524]/15 border border-[#F5A524]/30 shrink-0">
          <AlertTriangle size={18} className="text-[#F5A524]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <DecisionBadge verdict="UNCERTAIN" size="sm" />
          </div>
          <p className="text-xs font-bold text-[#F3F7FC] leading-snug break-words">
            Cross-sensor evidence partially conflicts ({Math.round(analysis.confidence * 100)}% calibrated confidence).
          </p>
        </div>
      </div>

      <SensorAgreement
        readings={analysis.sensorAgreement}
        crossSensorAgreement={analysis.crossSensorAgreement}
      />

      <div className="rounded-md bg-[#0B1628] border border-[#24344A] p-3 space-y-2">
        <span className="text-[10px] font-bold text-[#F5A524] uppercase tracking-wider block">
          Diagnosed Uncertainty Factors
        </span>
        <ul className="space-y-1.5">
          {possibleCauses.map((cause) => (
            <li key={cause} className="flex items-start gap-2 text-xs text-[#A8B5C7]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A524] mt-1 shrink-0" />
              <span className="break-words">{cause}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button
          onClick={onInspect}
          size="sm"
          className="bg-[#20A4F3] text-[#07111F] hover:bg-[#35B7FF] gap-1.5 w-full text-xs font-bold h-9 px-2 shadow-xs"
        >
          <FileSearch size={14} className="shrink-0" />
          <span className="truncate">Inspect Evidence</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs font-semibold text-[#A8B5C7] border-[#24344A] bg-[#0B1628] hover:bg-[#142238] hover:text-[#F3F7FC] h-9 w-full px-2 shadow-xs"
          onClick={onReview}
        >
          <UserCheck size={14} className="shrink-0" />
          <span className="truncate">Request Review</span>
        </Button>
      </div>
    </div>
  );
}
