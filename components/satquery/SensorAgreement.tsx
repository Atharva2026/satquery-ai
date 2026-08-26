import { cn } from '@/lib/utils';
import type { SensorReading } from '@/types';

interface SensorAgreementProps {
  readings: SensorReading[];
  crossSensorAgreement: number;
  className?: string;
}

function colorForValue(v: number): string {
  if (v >= 0.7) return '#19C37D';
  if (v >= 0.4) return '#F5A524';
  if (v > 0) return '#7D8CA3';
  return '#F05D6C';
}

export function SensorAgreement({
  readings,
  crossSensorAgreement,
  className,
}: SensorAgreementProps) {
  return (
    <div className={cn('space-y-3 min-w-0 bg-[#101C2E] border border-[#24344A] rounded-lg p-3.5', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A8B5C7]">
          Sensor Agreement Breakdown
        </span>
      </div>
      {readings.map((r) => {
        const pct = Math.round(r.likelihood * 100);
        const color = colorForValue(r.likelihood);
        return (
          <div key={r.sensor} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span className="font-bold text-[#F3F7FC] tracking-tight">
                {r.sensor}
              </span>
              <span className="text-[#A8B5C7] text-[11px] truncate">
                {r.label}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex-1 h-2 rounded-full bg-[#0D192A] border border-[#24344A] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
              <span
                className="font-mono text-xs font-bold tabular-nums w-10 text-right shrink-0"
                style={{ color }}
              >
                {pct}%
              </span>
            </div>
          </div>
        );
      })}
      <div className="pt-2.5 border-t border-[#24344A]">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-[#A8B5C7] font-medium">
            Cross-sensor convergence
          </span>
          <span
            className="font-mono font-bold tabular-nums text-sm"
            style={{ color: colorForValue(crossSensorAgreement) }}
          >
            {(crossSensorAgreement * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
