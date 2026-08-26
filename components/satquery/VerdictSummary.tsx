import { cn } from '@/lib/utils';
import type { Verdict } from '@/types';
import { DecisionBadge } from './DecisionBadge';
import { ConfidenceMeter } from './ConfidenceMeter';

const copy: Record<Verdict, { explanation: string }> = {
  CONFIDENT: { explanation: 'Cross-sensor evidence agrees' },
  UNCERTAIN: { explanation: 'Evidence partially conflicts' },
  ABSTAIN: { explanation: 'Insufficient evidence — no reliable decision returned' },
};

interface VerdictSummaryProps {
  verdict: Verdict;
  confidence: number;
  className?: string;
}

export function VerdictSummary({ verdict, confidence, className }: VerdictSummaryProps) {
  return (
    <div className={cn('min-w-0 space-y-3', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="sq-label block mb-1.5">Status</span>
          <DecisionBadge verdict={verdict} />
        </div>
      </div>
      <p className="text-sm text-sq-on-surface-variant leading-relaxed">
        {copy[verdict].explanation}
      </p>
      {verdict !== 'ABSTAIN' && (
        <ConfidenceMeter value={confidence} showScale />
      )}
      {verdict === 'ABSTAIN' && (
        <p className="font-data-mono text-sm text-sq-on-surface-variant">
          {Math.round(confidence * 100)}% calibrated confidence — below decision threshold
        </p>
      )}
    </div>
  );
}
