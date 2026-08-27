'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Satellite,
  Compass,
  PlaySquare,
  History,
  FileText,
  Settings,
  Database,
  Cpu,
  Key,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { href: '/analyze', label: 'Analyze', icon: Compass },
    { href: '/demo', label: 'Demo', icon: PlaySquare },
    { href: '/analyses', label: 'Analyses', icon: History },
    { href: '/reports', label: 'Reports', icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === '/analyze' && (pathname === '/analyze' || pathname.startsWith('/workspace'))) return true;
    if (href === '/analyses' && pathname.startsWith('/analyses')) return true;
    if (href === '/reports' && pathname.startsWith('/reports')) return true;
    if (href === '/demo' && (pathname === '/demo' || pathname === '/pitch')) return true;
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F1F5F9] flex flex-col font-sans selection:bg-[#20A4F3]/20">
      {!hideNav && (
        <header className="sticky top-0 z-50 h-14 bg-[#07111F] border-b border-[#1E293B] px-4 lg:px-8 flex items-center justify-between">
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#0F172A] border border-[#1E293B] text-[#38BDF8]">
                <Satellite size={15} />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-wide text-[#F8FAFC]">SatQuery</span>
                <span className="text-[10px] font-mono font-semibold px-1 py-0.2 rounded bg-[#0F172A] text-[#94A3B8] border border-[#1E293B]">
                  RS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      active
                        ? 'text-[#F8FAFC] bg-[#0F172A] border border-[#1E293B]'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-2.5">
            <Link href="/pitch" className="hidden sm:inline-flex">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs font-medium bg-transparent border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A]"
              >
                <span>Pitch Mode</span>
              </Button>
            </Link>

            <Link href="/analyze">
              <Button
                size="sm"
                className="h-7 px-3 text-xs font-medium bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] transition-colors"
              >
                <span>New Analysis</span>
              </Button>
            </Link>

            {/* Profile / Admin Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 p-1 rounded-md border border-[#1E293B] bg-[#0F172A] hover:bg-[#1E293B] transition-colors text-xs text-[#E2E8F0]">
                  <div className="w-5 h-5 rounded bg-[#1E293B] flex items-center justify-center text-[10px] font-semibold text-[#38BDF8]">
                    A
                  </div>
                  <ChevronDown size={12} className="text-[#94A3B8]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-[#0B132B] border-[#1E293B] text-[#F1F5F9] shadow-lg p-1 rounded-lg font-sans"
              >
                <DropdownMenuLabel className="px-2 py-1.5">
                  <div className="text-xs font-semibold text-[#F8FAFC]">Geospatial Workspace</div>
                  <div className="text-[10px] text-[#94A3B8] font-mono">analyst@satquery.ai</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#1E293B]" />

                <DropdownMenuItem asChild>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#E2E8F0] hover:bg-[#0F172A] rounded cursor-pointer"
                  >
                    <Settings size={13} className="text-[#94A3B8]" />
                    <span>Workspace Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/settings?tab=datasets"
                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#E2E8F0] hover:bg-[#0F172A] rounded cursor-pointer"
                  >
                    <Database size={13} className="text-[#94A3B8]" />
                    <span>Datasets & Catalog</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/settings?tab=models"
                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#E2E8F0] hover:bg-[#0F172A] rounded cursor-pointer"
                  >
                    <Cpu size={13} className="text-[#94A3B8]" />
                    <span>Model Registry</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/settings?tab=api"
                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#E2E8F0] hover:bg-[#0F172A] rounded cursor-pointer"
                  >
                    <Key size={13} className="text-[#94A3B8]" />
                    <span>API Keys</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#1E293B]" />

                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A] rounded cursor-pointer"
                  >
                    <ShieldCheck size={13} className="text-[#10B981]" />
                    <span>Landing Page</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 rounded border border-[#1E293B] bg-[#0F172A] text-[#94A3B8]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </header>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 z-40 bg-[#07111F] border-b border-[#1E293B] p-4 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-medium ${
                  active ? 'bg-[#0F172A] text-[#F8FAFC] border border-[#1E293B]' : 'text-[#94A3B8] hover:bg-[#0B132B]'
                }`}
              >
                <item.icon size={15} className={active ? 'text-[#38BDF8]' : 'text-[#94A3B8]'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#1E293B] flex flex-col gap-1">
            <Link
              href="/pitch"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded text-xs font-medium text-[#94A3B8] hover:bg-[#0B132B]"
            >
              Pitch Mode
            </Link>
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded text-xs font-medium text-[#94A3B8] hover:bg-[#0B132B]"
            >
              Workspace Settings
            </Link>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
