import { cn } from '@/lib/utils';
import type { ExecutionEvent } from '@/types';
import {
  Check,
  Loader2,
  Clock,
  Circle,
  AlertCircle,
  ScanSearch,
  Layers,
  Eye,
  Cpu,
  GitCompare,
  Gauge,
  ShieldCheck,
  ListChecks,
} from 'lucide-react';

const typeIcon: Record<ExecutionEvent['type'], typeof Check> = {
  validation: Check,
  classification: ListChecks,
  optical: Eye,
  sar: ScanSearch,
  fusion: Layers,
  evidence: Cpu,
  agreement: GitCompare,
  confidence: Gauge,
  verdict: ShieldCheck,
};

const statusConfig = {
  complete: { icon: Check, color: 'text-[#19C37D]', bg: 'bg-[#19C37D]/12 border-[#19C37D]/30' },
  running: { icon: Loader2, color: 'text-[#22C7D6]', bg: 'bg-[#22C7D6]/12 border-[#22C7D6]/30' },
  pending: { icon: Circle, color: 'text-[#718096]', bg: 'bg-[#0D192A] border-[#24344A]' },
  error: { icon: AlertCircle, color: 'text-[#F05D6C]', bg: 'bg-[#F05D6C]/12 border-[#F05D6C]/30' },
};

interface ExecutionTraceProps {
  events: ExecutionEvent[];
  className?: string;
  compact?: boolean;
}

export function ExecutionTrace({ events, className, compact = false }: ExecutionTraceProps) {
  return (
    <div className={cn('space-y-0 min-w-0 bg-[#0B1628] border border-[#24344A] rounded-lg p-3.5', className)}>
      {events.map((event, idx) => {
        const TypeIcon = typeIcon[event.type] ?? Clock;
        const sConfig = statusConfig[event.status] || statusConfig.pending;
        const StatusIcon = sConfig.icon;
        const isLast = idx === events.length - 1;
        return (
          <div key={event.id} className="flex gap-3 group min-w-0">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-full border transition-colors',
                  sConfig.bg,
                )}
              >
                <TypeIcon
                  size={12}
                  className={cn(
                    sConfig.color,
                    event.status === 'running' && 'animate-spin',
                  )}
                />
              </div>
              {!isLast && (
                <div className="w-px flex-1 min-h-[16px] bg-[#24344A] group-hover:bg-[#3B5270] transition-colors" />
              )}
            </div>
            <div className={cn('flex-1 min-w-0', isLast ? 'pb-0' : 'pb-3')}>
              <div className="flex items-baseline justify-between gap-2 min-w-0">
                <span
                  className={cn(
                    'font-medium text-[#F3F7FC] break-words leading-tight',
                    compact ? 'text-xs' : 'text-sm',
                  )}
                >
                  {event.label}
                </span>
                <span className="font-mono text-[11px] text-[#718096] tabular-nums shrink-0">
                  {event.timestamp}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <StatusIcon
                  size={10}
                  className={cn(sConfig.color, event.status === 'running' && 'animate-spin')}
                />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8B5C7]">
                  {event.status}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
