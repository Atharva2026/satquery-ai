import { cn } from '@/lib/utils';
import { Check, Loader2, Circle } from 'lucide-react';
import { loadingSteps } from '@/lib/mock-data';

interface LoadingStateProps {
  currentStep: number;
  className?: string;
}

export function LoadingState({ currentStep, className }: LoadingStateProps) {
  return (
    <div className={cn('space-y-3 bg-[#0B1628] border border-[#24344A] rounded-lg p-4', className)}>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#24344A]">
        <Loader2 size={15} className="text-[#20A4F3] animate-spin" />
        <span className="text-[11px] font-bold text-[#20A4F3] uppercase tracking-wider">
          AI Decision Engine Executing...
        </span>
      </div>
      <div className="space-y-2.5">
        {loadingSteps.map((step: { key: string; label: string }, idx: number) => {
          const isComplete = idx < currentStep;
          const isRunning = idx === currentStep;
          return (
            <div key={step.key} className="flex items-center gap-3 text-xs">
              <div className="flex items-center justify-center w-5 h-5 shrink-0">
                {isComplete ? (
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#19C37D]/15 text-[#19C37D] border border-[#19C37D]/30">
                    <Check size={12} />
                  </div>
                ) : isRunning ? (
                  <Loader2 size={15} className="text-[#22C7D6] animate-spin" />
                ) : (
                  <Circle size={14} className="text-[#718096]" />
                )}
              </div>
              <span
                className={cn(
                  'transition-colors font-medium',
                  isComplete
                    ? 'text-[#F3F7FC]'
                    : isRunning
                      ? 'text-[#22C7D6] font-bold'
                      : 'text-[#718096]',
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="pt-2 border-t border-[#24344A] text-[10px] text-[#718096] font-mono">
        Multi-modal optical + SAR inference in progress
      </div>
    </div>
  );
}
