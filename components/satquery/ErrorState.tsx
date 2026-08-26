import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = 'An unexpected error occurred while processing satellite rasters.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12 px-6 bg-[#07111F] text-[#F3F7FC]', className)}>
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F05D6C]/15 border border-[#F05D6C]/30 text-[#F05D6C] mb-4">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-lg font-bold text-[#F3F7FC] mb-2">
        Analysis Pipeline Fault
      </h3>
      <p className="text-xs text-[#A8B5C7] max-w-sm mb-5 leading-relaxed font-mono">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="gap-2 text-xs font-semibold text-[#A8B5C7] border-[#24344A] bg-[#101C2E] hover:bg-[#142238] hover:text-[#F3F7FC] h-9"
        >
          <RefreshCw size={14} />
          Retry Pipeline
        </Button>
      )}
    </div>
  );
}
