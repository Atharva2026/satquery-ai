import { cn } from '@/lib/utils';
import { Compass, Sparkles, FolderKanban, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  className?: string;
  onDemoLoad?: () => void;
}

export function EmptyState({ className, onDemoLoad }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6 bg-[#07111F] text-[#F3F7FC] select-none max-w-md mx-auto',
        className,
      )}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#102B45] border border-[#20A4F3]/30 text-[#35B7FF] mb-5 shadow-xs">
        <Compass size={28} />
      </div>

      <h2 className="text-xl font-bold text-[#F3F7FC] mb-2 tracking-tight">
        Start an analysis
      </h2>

      <p className="text-xs text-[#8FA0B5] max-w-sm mb-6 leading-relaxed">
        Choose what you want SATQUERY AI to analyze from the left panel, then provide a question or select an area on the map.
      </p>

      <div className="flex items-center gap-3">
        {onDemoLoad && (
          <Button
            onClick={onDemoLoad}
            className="bg-[#20A4F3] text-[#07111F] hover:bg-[#35B7FF] gap-2 text-xs font-bold h-10 px-4 shadow-sm"
          >
            <Sparkles size={14} />
            <span>Load Sample Analysis</span>
          </Button>
        )}
        <Link href="/datasets">
          <Button
            variant="outline"
            className="text-xs font-medium text-[#A8B5C7] border-[#24344A] bg-[#101C2E] hover:bg-[#142238] hover:text-[#F3F7FC] h-10 px-4 gap-1.5"
          >
            <FolderKanban size={14} />
            <span>Browse Catalog</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
