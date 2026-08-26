import { cn } from '@/lib/utils';
import type { Verdict } from '@/types';
import { Check, AlertTriangle, ShieldAlert } from 'lucide-react';

const verdictConfig: Record<
  Verdict,
  {
    label: string;
    classes: string;
    icon: typeof Check;
    iconColor: string;
  }
> = {
  CONFIDENT: {
    label: 'CONFIDENT',
    classes: 'bg-[#19C37D]/12 text-[#19C37D] border-[#19C37D]/40',
    icon: Check,
    iconColor: 'text-[#19C37D]',
  },
  UNCERTAIN: {
    label: 'UNCERTAIN',
    classes: 'bg-[#F5A524]/12 text-[#F5A524] border-[#F5A524]/40',
    icon: AlertTriangle,
    iconColor: 'text-[#F5A524]',
  },
  ABSTAIN: {
    label: 'ABSTAIN',
    classes: 'bg-[#F05D6C]/12 text-[#F05D6C] border-[#F05D6C]/40',
    icon: ShieldAlert,
    iconColor: 'text-[#F05D6C]',
  },
};

interface DecisionBadgeProps {
  verdict: Verdict;
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function DecisionBadge({
  verdict,
  confidence,
  size = 'md',
  showIcon = true,
  className,
}: DecisionBadgeProps) {
  const config = verdictConfig[verdict] || verdictConfig.CONFIDENT;
  const Icon = config.icon;
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-bold font-mono tracking-wider',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold font-mono tracking-wider',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold font-mono tracking-wider',
  };
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 15 : 13;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border tracking-wider uppercase shrink-0 select-none shadow-xs',
        config.classes,
        sizeClasses[size],
        className,
      )}
    >
      {showIcon && <Icon size={iconSize} className={config.iconColor} />}
      <span>{config.label}</span>
      {confidence !== undefined && (
        <span className="opacity-80 pl-1 border-l border-current/30">
          {Math.round(confidence * 100)}%
        </span>
      )}
    </span>
  );
}

export { verdictConfig };
