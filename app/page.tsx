import Link from 'next/link';
import {
  Satellite,
  ArrowRight,
  ShieldCheck,
  Eye,
  Crosshair,
  Gauge,
  Layers,
  FileText,
  Ban,
  AlertTriangle,
  Check,
  Building2,
  Waves,
  TramFront,
  Leaf,
  ScanLine,
  GitCompare,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DecisionBadge } from '@/components/satquery/DecisionBadge';
import { TopNav } from '@/components/satquery/TopNav';

const heroMapImagery =
  'https://images.pexels.com/photos/27938904/pexels-photo-27938904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900';

const problemPoints = [
  {
    icon: Eye,
    title: 'Satellite imagery is opaque',
    desc: 'Raw multi-spectral raster data requires human domain expertise. Decision-makers cannot act on raw pixels alone without traceable context.',
  },
  {
    icon: AlertTriangle,
    title: 'AI answers without evidence',
    desc: 'Traditional vision-language models hallucinate answers with no spatial grounding, no traceable reasoning, and zero uncertainty reporting.',
  },
  {
    icon: Ban,
    title: 'Silent failure is dangerous',
    desc: 'When models lack evidence, they still answer. Unreliable decisions get treated as fact in high-stakes defence and disaster management operations.',
  },
];

const workflowSteps = [
  { icon: Satellite, label: 'Map Canvas', desc: 'Orthorectified satellite imagery loaded as the primary canvas' },
  { icon: Crosshair, label: 'Evidence Grounding', desc: 'Spatial bounding regions bind claims directly to pixels' },
  { icon: ShieldCheck, label: 'Decision Engine', desc: 'A verdict grounded strictly in corroborated multi-sensor evidence' },
  { icon: Gauge, label: 'Calibrated Confidence', desc: 'Uncertainty-aware cross-sensor convergence scoring' },
  { icon: FileText, label: 'Audit Trail', desc: 'Observable step-by-step execution trace for every query' },
];

const pillars = [
  {
    icon: ScanLine,
    title: 'Evidence-first approach',
    desc: 'Every answer is backed by spatial evidence. Grounding regions on the map connect each claim to the satellite imagery that produced it.',
  },
  {
    icon: GitCompare,
    title: 'Cross-sensor verification',
    desc: 'Optical and SAR evidence are checked against each other. Agreement between independent sensors increases confidence; disagreement surfaces uncertainty.',
  },
  {
    icon: Gauge,
    title: 'Confidence calibration',
    desc: 'Confidence is calibrated against cross-sensor agreement, not a raw model logit. The score reflects statistical calibration under temperature scaling.',
  },
  {
    icon: Ban,
    title: 'Abstention as a feature',
    desc: 'When evidence is insufficient or contradictory, SatQuery refuses to guess. Explicit abstention prevents catastrophic misinterpretation.',
  },
  {
    icon: Cpu,
    title: 'Observable execution trace',
    desc: 'Every analysis produces a timestamped trace of pipeline events: validation, classification, model execution, evidence generation, and verdict.',
  },
  {
    icon: FileText,
    title: '6-Page A4 intelligence briefing',
    desc: 'An official intelligence briefing captures input metadata, AI output, visual evidence, calibrated confidence, and full execution traces.',
  },
];

const indiaScenarios = [
  { icon: Building2, title: 'Urban Growth', desc: 'Track peri-urban structural expansion across seasonal baselines.' },
  { icon: Waves, title: 'Flood Impact', desc: 'Assess inundation extent with optical and SAR cloud-penetrating checks.' },
  { icon: TramFront, title: 'Infrastructure Monitoring', desc: 'Monitor highway and industrial corridors for new construction activity.' },
  { icon: Leaf, title: 'Land-Cover Change', desc: 'Detect vegetation loss, deforestation, and agricultural transitions.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07111F] text-[#F3F7FC]">
      {/* Top Header */}
      <TopNav />

      {/* Hero Section */}
      <section className="relative max-w-[1440px] mx-auto px-6 sm:px-10 pt-16 pb-20 select-none">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#20A4F3]/30 bg-[#102B45] shadow-xs">
              <ShieldCheck size={14} className="text-[#20A4F3]" />
              <span className="text-xs font-bold text-[#35B7FF] uppercase tracking-wider">
                Evidence-First Geospatial Decision Intelligence
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F3F7FC] leading-[1.15] text-balance">
              Query Satellite Imagery.
              <br />
              <span className="text-[#20A4F3]">Get decisions you can verify.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#A8B5C7] max-w-lg leading-relaxed font-normal">
              Transform optical, SAR, and bi-temporal satellite imagery into evidence-backed, uncertainty-calibrated intelligence reports for analysts and operational leaders.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link href="/workspace">
                <Button className="bg-[#20A4F3] text-[#07111F] hover:bg-[#35B7FF] gap-2 h-11 px-6 text-xs font-bold shadow-sm">
                  <span>Launch Decision Console</span>
                  <ArrowRight size={15} />
                </Button>
              </Link>
              <Link href="/datasets">
                <Button
                  variant="outline"
                  className="h-11 px-6 text-xs font-semibold text-[#A8B5C7] border-[#24344A] bg-[#101C2E] hover:bg-[#142238] hover:text-[#F3F7FC]"
                >
                  Explore Catalog
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-[#A8B5C7]">
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-[#19C37D]" />
                <span>Spatial evidence grounding</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-[#19C37D]" />
                <span>Cross-sensor verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-[#19C37D]" />
                <span>Calibrated confidence</span>
              </div>
            </div>
          </div>

          {/* Hero Visual — Simulated Product Console */}
          <div className="relative animate-fade-in-up">
            <div className="relative rounded-xl border border-[#24344A] bg-[#101C2E] shadow-2xl overflow-hidden">
              {/* Header Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#24344A] bg-[#081322]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F05D6C]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F5A524]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#19C37D]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#A8B5C7] ml-2">
                    SATQUERY / workspace / urban-growth
                  </span>
                </div>
                <div className="font-mono text-[10px] text-[#22C7D6]">
                  28.4595°N, 77.0266°E
                </div>
              </div>

              {/* Map Area */}
              <div className="relative h-80 bg-[#07111F]">
                <img
                  src={heroMapImagery}
                  alt="Satellite analysis scene"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 sq-grid-overlay-dark" />
                {/* Evidence Boxes */}
                {[
                  { x: 18, y: 25, w: 16, h: 18, c: '#19C37D', l: 'R-01 · 94%' },
                  { x: 42, y: 32, w: 14, h: 16, c: '#19C37D', l: 'R-02 · 91%' },
                  { x: 62, y: 20, w: 18, h: 20, c: '#19C37D', l: 'R-03 · 89%' },
                  { x: 28, y: 55, w: 16, h: 14, c: '#F5A524', l: 'R-04 · 68%' },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="absolute group"
                    style={{
                      left: `${r.x}%`,
                      top: `${r.y}%`,
                      width: `${r.w}%`,
                      height: `${r.h}%`,
                    }}
                  >
                    <div
                      className="absolute inset-0 border-2 rounded-xs"
                      style={{ borderColor: r.c, backgroundColor: `${r.c}20` }}
                    />
                    <div
                      className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-[#07111F] whitespace-nowrap"
                      style={{ backgroundColor: r.c }}
                    >
                      {r.l}
                    </div>
                  </div>
                ))}
              </div>

              {/* Decision Panel Preview Strip */}
              <div className="grid grid-cols-3 gap-0 border-t border-[#24344A] bg-[#0B1628]">
                <div className="p-3.5 border-r border-[#24344A]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096] block">
                    Answer
                  </span>
                  <p className="text-xs text-[#F3F7FC] font-medium mt-1 line-clamp-1">
                    17 probable new structures detected
                  </p>
                </div>
                <div className="p-3.5 border-r border-[#24344A]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096] block">
                    Confidence
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-[#0D192A] border border-[#24344A] overflow-hidden">
                      <div className="h-full w-[92%] rounded-full bg-[#19C37D]" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#19C37D]">92%</span>
                  </div>
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096] block">
                      Verdict
                    </span>
                    <div className="mt-1">
                      <DecisionBadge verdict="CONFIDENT" size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Evidence Badge */}
            <div className="absolute -bottom-4 -left-4 rounded-lg border border-[#24344A] bg-[#101C2E] shadow-xl px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Crosshair size={16} className="text-[#20A4F3]" />
                <div>
                  <div className="font-mono text-xs font-bold text-[#F3F7FC]">EV-1001</div>
                  <div className="text-[10px] text-[#A8B5C7]">Structural change · 94% confidence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-[#0B1628] border-y border-[#24344A] py-20">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-mono font-bold text-[#20A4F3] uppercase tracking-wider bg-[#102B45] px-2 py-0.5 rounded border border-[#20A4F3]/30">
              OPERATIONAL CHALLENGE
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#F3F7FC] mt-3 mb-3">
              Imagery is abundant. Decisions are not.
            </h2>
            <p className="text-sm text-[#A8B5C7] leading-relaxed">
              Earth-observation data multiplies daily, but converting multi-spectral rasters into verifiable decisions remains the critical bottleneck.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {problemPoints.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-[#24344A] bg-[#101C2E] p-6 space-y-3"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-[#142238] border border-[#24344A]">
                  <p.icon size={20} className="text-[#20A4F3]" />
                </div>
                <h3 className="text-base font-bold text-[#F3F7FC]">{p.title}</h3>
                <p className="text-xs text-[#A8B5C7] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-mono font-bold text-[#22C7D6] uppercase tracking-wider bg-[#102B45] px-2 py-0.5 rounded border border-[#20A4F3]/30">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#F3F7FC] mt-3 mb-3">
              Query → Evidence → Decision → Confidence → Audit
            </h2>
            <p className="text-sm text-[#A8B5C7] leading-relaxed">
              The core experience is not a generic chatbot. It is a structured geospatial intelligence pipeline where the satellite canvas and mathematical evidence dominate.
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {workflowSteps.map((step, i) => (
              <div key={step.label} className="relative">
                <div className="rounded-xl border border-[#24344A] bg-[#101C2E] p-5 h-full space-y-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#142238] border border-[#24344A]">
                    <step.icon size={18} className="text-[#20A4F3]" />
                  </div>
                  <h3 className="text-xs font-bold text-[#F3F7FC]">
                    {step.label}
                  </h3>
                  <p className="text-[11px] text-[#A8B5C7] leading-relaxed">{step.desc}</p>
                </div>
                {i < workflowSteps.length - 1 && (
                  <ArrowRight
                    size={16}
                    className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-[#24344A] z-10"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-[#0B1628] border-y border-[#24344A] py-20">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-mono font-bold text-[#20A4F3] uppercase tracking-wider bg-[#102B45] px-2 py-0.5 rounded border border-[#20A4F3]/30">
              CORE CAPABILITIES
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#F3F7FC] mt-3 mb-3">
              Engineered for Mission-Critical Trust
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-[#24344A] bg-[#101C2E] p-6 space-y-3 hover:border-[#20A4F3]/50 transition-all hover:bg-[#142238]"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-[#142238] border border-[#24344A]">
                  <pillar.icon size={20} className="text-[#22C7D6]" />
                </div>
                <h3 className="text-base font-bold text-[#F3F7FC]">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#A8B5C7] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verdict States Section */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-mono font-bold text-[#20A4F3] uppercase tracking-wider bg-[#102B45] px-2 py-0.5 rounded border border-[#20A4F3]/30">
              UNCERTAINTY-AWARE UX
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#F3F7FC] mt-3 mb-3">
              Three Explicit Verdicts. Zero Hidden Failure.
            </h2>
            <p className="text-sm text-[#A8B5C7] leading-relaxed">
              SatQuery never hides uncertainty. Every query concludes with one of three verifiable verdicts.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Confident */}
            <div className="rounded-xl border border-[#19C37D]/40 bg-[#101C2E] p-6 space-y-3">
              <DecisionBadge verdict="CONFIDENT" size="md" />
              <h3 className="text-base font-bold text-[#F3F7FC] mt-2">
                Confident
              </h3>
              <p className="text-xs text-[#A8B5C7] leading-relaxed">
                Cross-sensor agreement is high. Optical and SAR evidence converge with strong multi-pass IoU overlap.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-[#24344A]">
                <Check size={16} className="text-[#19C37D]" />
                <span className="font-mono text-xs font-bold text-[#19C37D]">92% calibrated confidence</span>
              </div>
            </div>

            {/* Uncertain */}
            <div className="rounded-xl border border-[#F5A524]/40 bg-[#101C2E] p-6 space-y-3">
              <DecisionBadge verdict="UNCERTAIN" size="md" />
              <h3 className="text-base font-bold text-[#F3F7FC] mt-2">
                Uncertain
              </h3>
              <p className="text-xs text-[#A8B5C7] leading-relaxed">
                Sensors partially disagree or cloud shadow creates ambiguity. The system surfaces what conflicted.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-[#24344A]">
                <AlertTriangle size={16} className="text-[#F5A524]" />
                <span className="font-mono text-xs font-bold text-[#F5A524]">54% calibrated confidence</span>
              </div>
            </div>

            {/* Abstain */}
            <div className="rounded-xl border border-[#F05D6C]/40 bg-[#101C2E] p-6 space-y-3">
              <DecisionBadge verdict="ABSTAIN" size="md" />
              <h3 className="text-base font-bold text-[#F3F7FC] mt-2">
                Abstain
              </h3>
              <p className="text-xs text-[#A8B5C7] leading-relaxed">
                Evidence is insufficient. The system refuses to render an answer rather than produce an unreliable decision.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-[#24344A]">
                <Ban size={16} className="text-[#F05D6C]" />
                <span className="font-mono text-xs font-bold text-[#F05D6C]">Safety refusal enforced</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* India-First Scenarios */}
      <section className="bg-[#0B1628] border-y border-[#24344A] py-20">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-mono font-bold text-[#20A4F3] uppercase tracking-wider bg-[#102B45] px-2 py-0.5 rounded border border-[#20A4F3]/30">
              NATIONAL EO USE CASES
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#F3F7FC] mt-3 mb-3">
              Geospatial Decisions Across Indian Landscapes
            </h2>
            <p className="text-sm text-[#A8B5C7] leading-relaxed">
              Tailored for high-impact decision contexts — from peri-urban expansion to Brahmaputra monsoon inundation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {indiaScenarios.map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-[#24344A] bg-[#101C2E] p-5 space-y-2 hover:border-[#20A4F3]/50 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#142238] border border-[#24344A]">
                  <s.icon size={18} className="text-[#20A4F3]" />
                </div>
                <h3 className="text-xs font-bold text-[#F3F7FC]">
                  {s.title}
                </h3>
                <p className="text-[11px] text-[#A8B5C7] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F3F7FC] text-balance">
            Stop Guessing. Start Verifying.
          </h2>
          <p className="text-sm text-[#A8B5C7] max-w-xl mx-auto leading-relaxed">
            Launch the geospatial intelligence console and explore demo scenarios with full evidence grounding, calibrated confidence, and observable audit logs.
          </p>
          <Link href="/workspace">
            <Button className="bg-[#20A4F3] text-[#07111F] hover:bg-[#35B7FF] gap-2 h-12 px-8 text-xs font-bold shadow-md">
              Launch SatQuery Console
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#24344A] py-8 bg-[#081322]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#20A4F3] text-[#07111F]">
              <Satellite size={15} />
            </div>
            <span className="font-bold text-sm text-[#F3F7FC] tracking-tight">
              SATQUERY<span className="text-[#20A4F3]"> AI</span>
            </span>
          </div>
          <p className="text-xs text-[#718096] font-mono">
            Evidence-first satellite decision intelligence console · ISRO / SAC Hackathon Architecture
          </p>
        </div>
      </footer>
    </div>
  );
}
