import { cn } from '@/lib/utils';

interface ConfidenceMeterProps {
  value: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showScale?: boolean;
  className?: string;
}

function colorForValue(v: number): string {
  if (v >= 0.7) return '#19C37D';
  if (v >= 0.4) return '#F5A524';
  return '#F05D6C';
}

export function ConfidenceMeter({
  value,
  label = 'Calibrated Confidence',
  size = 'md',
  showScale = false,
  className,
}: ConfidenceMeterProps) {
  const pct = Math.round(value * 100);
  const color = colorForValue(value);
  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-2.5' : 'h-2';
  const textSize =
    size === 'sm'
      ? 'text-xs font-bold'
      : size === 'lg'
        ? 'text-xl font-bold'
        : 'text-base font-bold';

  return (
    <div className={cn('w-full min-w-0', className)}>
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A8B5C7] truncate">
          {label}
        </span>
        <span
          className={cn('font-mono tabular-nums shrink-0', textSize)}
          style={{ color }}
        >
          {pct}%
        </span>
      </div>
      <div
        className={cn(
          'relative w-full rounded-full bg-[#0D192A] border border-[#24344A] overflow-hidden',
          heightClass,
        )}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {showScale && (
        <div className="flex justify-between mt-1 text-[10px] font-mono text-[#718096]">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
}
