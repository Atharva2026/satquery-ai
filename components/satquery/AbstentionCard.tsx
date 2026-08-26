import { cn } from '@/lib/utils';
import { DecisionBadge } from './DecisionBadge';
import { Ban, RefreshCw, FileSearch, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AnalysisResult } from '@/types';

interface AbstentionCardProps {
  analysis: AnalysisResult;
  onRetry?: () => void;
  onInspect?: () => void;
  className?: string;
}

export function AbstentionCard({
  analysis,
  onRetry,
  onInspect,
  className,
}: AbstentionCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[#F05D6C]/40 bg-[#101C2E] p-4 space-y-4 shadow-sm min-w-0',
        className,
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-[#F05D6C]/15 border border-[#F05D6C]/30 shrink-0">
          <Ban size={18} className="text-[#F05D6C]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <DecisionBadge verdict="ABSTAIN" size="sm" />
          </div>
          <p className="text-xs font-bold text-[#F3F7FC] leading-snug break-words">
            Decision refused: Cross-sensor convergence is below safety threshold.
          </p>
        </div>
      </div>

      <div className="space-y-2 rounded-md bg-[#0B1628] border border-[#24344A] p-3 text-xs">
        <span className="text-[10px] font-bold text-[#F05D6C] uppercase tracking-wider block">
          Safety Refusal Criteria Log
        </span>
        <div className="space-y-1.5 text-[#A8B5C7]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs">
              <XCircle size={13} className="text-[#F05D6C] shrink-0" />
              <span>Cross-sensor agreement:</span>
            </span>
            <span className="font-mono text-xs font-bold text-[#F05D6C]">
              {(analysis.crossSensorAgreement * 100).toFixed(0)}% (Min req: 70%)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs">
              <XCircle size={13} className="text-[#F05D6C] shrink-0" />
              <span>Confidence score:</span>
            </span>
            <span className="font-mono text-xs font-bold text-[#F05D6C]">
              {Math.round(analysis.confidence * 100)}% (Cutoff: 50%)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs">
              <CheckCircle2 size={13} className="text-[#19C37D] shrink-0" />
              <span>Input data integrity:</span>
            </span>
            <span className="font-mono text-xs font-bold text-[#19C37D]">
              Verified
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-[#0B1628] border border-[#24344A] p-3 space-y-2 text-xs">
        <span className="text-[10px] font-bold text-[#20A4F3] uppercase tracking-wider block">
          Corrective Action Recommendations
        </span>
        <div className="space-y-2 text-xs text-[#A8B5C7]">
          <div>
            <span className="font-semibold text-[#F3F7FC] block mb-1">
              Required Sensor Coverage:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded bg-[#101C2E] border border-[#24344A] font-mono text-[10px] text-[#22C7D6]">
                + Sentinel-1 SAR (Descending Orbit Pass)
              </span>
              <span className="px-2 py-0.5 rounded bg-[#101C2E] border border-[#24344A] font-mono text-[10px] text-[#35B7FF]">
                + Cloud-free Optical Pass (&lt;10% Cloud Cover)
              </span>
            </div>
          </div>

          <div>
            <span className="font-semibold text-[#F3F7FC] block mb-0.5">
              Available fallback sensors in archive:
            </span>
            <div className="flex flex-wrap gap-1">
              {analysis.sensors.length > 0 ? (
                analysis.sensors.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#102B45] text-[#35B7FF] border border-[#20A4F3]/30"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#718096]">None</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-[#07111F] border border-[#24344A] text-[#F3F7FC] p-3 shadow-xs">
        <p className="text-xs font-semibold flex items-center gap-2">
          <ShieldAlert size={14} className="text-[#F05D6C] shrink-0" />
          <span>Safety refusal triggered: Model prevented an unreliable decision.</span>
        </p>
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
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs font-semibold text-[#A8B5C7] border-[#24344A] bg-[#0B1628] hover:bg-[#142238] hover:text-[#F3F7FC] h-9 w-full px-2 shadow-xs"
        >
          <RefreshCw size={14} className="shrink-0" />
          <span className="truncate">Retry Query</span>
        </Button>
      </div>
    </div>
  );
}
