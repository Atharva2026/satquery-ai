import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-start justify-between gap-4', className)}>
      <div className="min-w-0 max-w-2xl">
        <h1 className="text-display text-sq-on-surface">{title}</h1>
        {description && (
          <p className="mt-2 text-body-md text-sq-on-surface-variant">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
