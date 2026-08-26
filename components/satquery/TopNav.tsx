'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Satellite, Settings, User, Sparkles } from 'lucide-react';
import { GuidedDemoModal } from './GuidedDemoModal';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/workspace', label: 'Workspace' },
  { href: '/datasets', label: 'Datasets' },
  { href: '/analysis', label: 'Analysis' },
  { href: '/reports', label: 'Reports' },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [tourOpen, setTourOpen] = useState(false);

  const handleSelectScenario = (scenarioId: string) => {
    router.push(`/workspace?scenario=${scenarioId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-[72px] shrink-0 border-b border-[#24344A] bg-[#081322] select-none">
        <div className="flex h-full items-center justify-between gap-4 px-6 max-w-[1920px] mx-auto">
          {/* Logo & Navigation */}
          <div className="flex min-w-0 items-center gap-8">
            <Link href="/" className="flex shrink-0 items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#20A4F3] text-[#07111F] font-bold shadow-sm transition-transform group-hover:scale-105">
                <Satellite size={19} className="text-[#07111F]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold tracking-tight text-[#F3F7FC]">
                  SATQUERY<span className="text-[#20A4F3]"> AI</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-[#101C2E] text-[#22C7D6] border border-[#24344A]">
                  v2.4
                </span>
              </div>
            </Link>

            <nav className="hidden min-w-0 items-center gap-1.5 sm:flex">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'rounded-md px-3.5 py-2 text-[13px] font-medium tracking-wide transition-all duration-150',
                      isActive
                        ? 'bg-[#102B45] text-[#35B7FF] border border-[#20A4F3]/30 font-semibold shadow-xs'
                        : 'text-[#8FA0B5] hover:bg-[#0E1D30] hover:text-[#DCE8F5]',
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools */}
          <div className="flex shrink-0 items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTourOpen(true)}
              className="gap-2 text-xs font-semibold text-[#35B7FF] border-[#24344A] bg-[#101C2E] hover:bg-[#142238] hover:text-[#F3F7FC] hover:border-[#20A4F3]/40 h-9 px-3.5"
            >
              <Sparkles size={14} className="text-[#20A4F3]" />
              <span className="hidden md:inline">Pitch Tour</span>
            </Button>

            <Link
              href="/settings"
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg border border-[#24344A] transition-colors',
                pathname === '/settings'
                  ? 'bg-[#102B45] text-[#35B7FF] border-[#20A4F3]/40'
                  : 'bg-[#101C2E] text-[#8FA0B5] hover:bg-[#142238] hover:text-[#F3F7FC]',
              )}
              aria-label="Settings"
              title="System Configuration"
            >
              <Settings size={16} />
            </Link>

            <div className="h-5 w-px bg-[#24344A] mx-0.5" />

            <div className="flex items-center gap-2.5 rounded-lg border border-[#24344A] bg-[#101C2E] px-3 py-1.5 text-[#F3F7FC]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#142238] text-[#22C7D6] border border-[#24344A]">
                <User size={13} />
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-[12px] font-semibold text-[#F3F7FC] block leading-tight">
                  Analyst Portal
                </span>
                <span className="text-[9px] font-mono text-[#718096] leading-tight block">
                  GEOSPATIAL-OP-01
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <GuidedDemoModal
        open={tourOpen}
        onOpenChange={setTourOpen}
        onSelectScenario={handleSelectScenario}
      />
    </>
  );
}
