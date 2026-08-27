'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TopNav } from '@/components/satquery/TopNav';
import { SatelliteMap } from '@/components/satquery/SatelliteMap';
import { QueryPanel } from '@/components/satquery/QueryPanel';
import { DecisionBadge } from '@/components/satquery/DecisionBadge';
import { ConfidenceMeter } from '@/components/satquery/ConfidenceMeter';
import { SensorAgreement } from '@/components/satquery/SensorAgreement';
import { ExecutionTrace } from '@/components/satquery/ExecutionTrace';
import { Timeline } from '@/components/satquery/Timeline';
import { EvidenceCard } from '@/components/satquery/EvidenceCard';
import { LoadingState } from '@/components/satquery/LoadingState';
import { EmptyState } from '@/components/satquery/EmptyState';
import { ErrorState } from '@/components/satquery/ErrorState';
import { UncertaintyCard } from '@/components/satquery/UncertaintyCard';
import { AbstentionCard } from '@/components/satquery/AbstentionCard';
import { ChatFollowUp } from '@/components/satquery/ChatFollowUp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { demoScenarios, findScenario, loadingSteps } from '@/lib/mock-data';
import { analyzeQuery, getDemoScenario } from '@/services/analysisService';
import type {
  AnalysisResult,
  AnalysisStatus,
  EvidenceRegion,
  TaskMode,
  SensorType,
  LayerKey,
} from '@/types';
import {
  Sparkles,
  Check,
  ScanSearch,
  FileSearch,
  ChevronRight,
  PanelLeftClose,
  PanelRightClose,
  PanelLeft,
  PanelRight,
  FileText,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get('scenario');

  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | undefined>();
  const [hoveredRegionId, setHoveredRegionId] = useState<string | undefined>();
  const [loadingStep, setLoadingStep] = useState(0);
  const [activeTemporal, setActiveTemporal] = useState<'T1' | 'T2'>('T2');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [layerVisible, setLayerVisible] = useState<Record<LayerKey, boolean>>({
    OPTICAL: true,
    SAR: false,
    CHANGE: true,
    GROUNDING: true,
    EVIDENCE: true,
    AGREEMENT: false,
  });
  const [overlayOpacity, setOverlayOpacity] = useState(80);
  const [decisionTab, setDecisionTab] = useState('evidence');

  const selectedRegion = analysis?.regions.find(
    (r) => r.id === selectedRegionId,
  );
  const selectedEvidence = analysis?.evidence.find(
    (e) => e.id === selectedRegion?.geometry.evidenceId,
  );

  // Loading simulation
  useEffect(() => {
    if (status !== 'loading') return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status !== 'loading' || !analysis) return;
    if (loadingStep >= loadingSteps.length - 1) {
      const timer = setTimeout(() => {
        setStatus(
          analysis.verdict === 'CONFIDENT'
            ? 'success'
            : analysis.verdict === 'UNCERTAIN'
              ? 'uncertain'
              : 'abstain',
        );
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loadingStep, status, analysis]);

  const handleAnalyze = useCallback(
    async (query: string, _mode: TaskMode, _sensors: SensorType[]) => {
      setStatus('loading');
      setLoadingStep(0);
      const result = await analyzeQuery(query);
      setAnalysis(result);
      setSelectedRegionId(undefined);
      setActiveTemporal('T2');
    },
    [],
  );

  const handleLoadDemo = useCallback(async (scenarioId: string) => {
    setStatus('loading');
    setLoadingStep(0);
    const scenario = await getDemoScenario(scenarioId);
    if (scenario) {
      setAnalysis(scenario.result);
      setSelectedRegionId(undefined);
      setActiveTemporal('T2');
    }
  }, []);

  // Handle URL scenario param
  useEffect(() => {
    if (scenarioParam && (!analysis || analysis.id !== scenarioParam)) {
      handleLoadDemo(scenarioParam);
    }
  }, [scenarioParam, handleLoadDemo, analysis]);

  const handleSelectRegion = useCallback((region: EvidenceRegion) => {
    setSelectedRegionId(region.id);
  }, []);

  const handleToggleLayer = useCallback((key: LayerKey) => {
    setLayerVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleCustomAoiDrawn = useCallback(
    (box: { x: number; y: number; width: number; height: number }) => {
      handleAnalyze(
        `Detect structural changes within custom AOI (${box.width.toFixed(0)}% x ${box.height.toFixed(0)}%)`,
        'CHANGE',
        ['OPTICAL', 'SAR'],
      );
    },
    [handleAnalyze],
  );

  const currentImagery =
    activeTemporal === 'T1'
      ? analysis?.temporalComparison.t1.imagery ?? demoScenarios[0].mapImagery
      : analysis?.temporalComparison.t2.imagery ?? demoScenarios[0].mapImagery;
  const beforeImagery = analysis?.temporalComparison.t1.imagery;

  const coordinates =
    (analysis ? findScenario(analysis.id)?.coordinates : undefined) ?? {
      lat: 28.4595,
      lng: 77.0266,
    };

  const inspectEvidence = () => {
    setDecisionTab('evidence');
    const first = analysis?.regions[0];
    if (first) setSelectedRegionId(first.id);
  };

  const requestReview = () => {
    toast.message('Human review requested', {
      description: 'Queued for analyst review. This is a demo placeholder — no backend ticket was created.',
    });
  };

  const evidenceChecks = analysis
    ? [
        { label: `${analysis.evidence.length} Grounded spatial regions`, ok: true },
        { label: 'T1 → T2 Structural change detected', ok: analysis.verdict !== 'ABSTAIN' },
        { label: 'Optical spectral confirmation', ok: analysis.sensorAgreement[0]?.likelihood > 0.5 },
        { label: 'SAR double-bounce confirmation', ok: analysis.sensorAgreement[1]?.likelihood > 0.5 },
        { label: 'Cross-sensor convergence > 0.70', ok: analysis.crossSensorAgreement > 0.5 },
      ]
    : [];

  return (
    <div className="flex flex-col h-screen bg-[#07111F] text-[#F3F7FC] overflow-hidden">
      <TopNav />

      {/* Session / Status Header Bar */}
      {analysis && (
        <div className="flex items-center justify-between px-6 py-1.5 border-b border-[#24344A] bg-[#0B1628] text-xs select-none shrink-0">
          <div className="flex items-center gap-3 font-mono">
            <span className="text-[#718096]">Active Session:</span>
            <Link href={`/analysis/${analysis.id}`} className="font-bold text-[#20A4F3] hover:underline">
              {analysis.id}
            </Link>
            <span className="text-[#24344A]">|</span>
            <span className="text-[#A8B5C7]">{analysis.location}</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-[#718096]">Mode: <strong className="text-[#F3F7FC]">{analysis.taskMode}</strong></span>
            <span className="text-[#24344A]">|</span>
            <span className="text-[#718096]">Sensors: <strong className="text-[#22C7D6]">{analysis.sensors.join(' + ')}</strong></span>
          </div>
        </div>
      )}

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT — Query Panel */}
        {leftPanelOpen && (
          <aside className="w-[360px] lg:w-[380px] shrink-0 border-r border-[#24344A] bg-[#0B1628] flex flex-col h-full overflow-hidden">
            <QueryPanel
              onAnalyze={handleAnalyze}
              onLoadDemo={handleLoadDemo}
              opacity={overlayOpacity}
              onOpacityChange={setOverlayOpacity}
              onTriggerAoiDraw={() => toast.info('Click and drag across the satellite map to draw a custom bounding AOI.')}
              isLoading={status === 'loading'}
            />
          </aside>
        )}
        {!leftPanelOpen && (
          <button
            onClick={() => setLeftPanelOpen(true)}
            className="flex items-center justify-center w-8 border-r border-[#24344A] bg-[#0B1628] hover:bg-[#142238] transition-colors"
            title="Expand Query Panel"
          >
            <PanelLeft size={16} className="text-[#A8B5C7]" />
          </button>
        )}

        {/* CENTER — Map Canvas (Dominant) */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#07111F]">
          <div className="flex-1 relative min-h-0 min-w-0">
            {status === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#07111F]">
                <EmptyState onDemoLoad={() => handleLoadDemo('urban-growth')} />
              </div>
            )}
            {status === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#07111F]">
                <ErrorState onRetry={() => setStatus('idle')} />
              </div>
            )}
            {(status === 'loading' || status === 'success' || status === 'uncertain' || status === 'abstain') && analysis && (
              <SatelliteMap
                imagery={currentImagery}
                beforeImagery={beforeImagery}
                coordinates={coordinates}
                regions={analysis.regions}
                selectedRegionId={selectedRegionId}
                hoveredRegionId={hoveredRegionId}
                onSelectRegion={handleSelectRegion}
                onHoverRegion={setHoveredRegionId}
                layerVisible={layerVisible}
                onToggleLayer={handleToggleLayer}
                temporalMode={activeTemporal === 'T1' ? 'T1' : 'T2'}
                overlayOpacity={overlayOpacity}
                onOverlayOpacityChange={setOverlayOpacity}
                onCustomAoiDrawn={handleCustomAoiDrawn}
              />
            )}
          </div>

          {/* BOTTOM — Timeline Strip */}
          {analysis && (status === 'success' || status === 'uncertain' || status === 'abstain') && (
            <div className="shrink-0 border-t border-[#24344A] bg-[#0B1628] px-6 py-2.5 shadow-sm select-none">
              <Timeline
                comparison={analysis.temporalComparison}
                onScrub={(t) => setActiveTemporal(t)}
              />
            </div>
          )}
        </main>

        {/* RIGHT — AI Decision Panel */}
        {rightPanelOpen && (
          <aside className="w-[380px] shrink-0 border-l border-[#24344A] bg-[#0B1628] overflow-y-auto sq-scrollbar">
            {status === 'idle' && (
              <div className="p-8 text-center">
                <p className="text-xs text-[#718096] leading-relaxed">
                  Submit a natural language query or select a demo scenario to activate the AI decision engine.
                </p>
              </div>
            )}
            {status === 'loading' && (
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#102B45] text-[#35B7FF] border border-[#20A4F3]/30">
                    <ScanSearch size={15} className="animate-pulse" />
                  </div>
                  <h2 className="text-sm font-bold text-[#F3F7FC]">AI Decision Engine</h2>
                </div>
                <LoadingState currentStep={loadingStep} />
              </div>
            )}
            {(status === 'success' || status === 'uncertain' || status === 'abstain') && analysis && (
              <div className="p-5 space-y-4 min-w-0">
                {/* Decision Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#24344A]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#142238] text-[#22C7D6] border border-[#24344A] shrink-0">
                      <ShieldCheck size={16} />
                    </div>
                    <h2 className="text-sm font-bold text-[#F3F7FC] truncate">AI Decision Engine</h2>
                  </div>
                  <DecisionBadge verdict={analysis.verdict} size="sm" />
                </div>

                {/* AI Finding Answer Box */}
                <div className="rounded-lg border border-[#24344A] bg-[#101C2E] p-3.5 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B5C7] block">
                    AI Finding Answer
                  </span>
                  <p className="text-xs text-[#F3F7FC] leading-relaxed font-medium break-words">
                    {analysis.answer}
                  </p>
                </div>

                {/* Verdict + Confidence */}
                {analysis.verdict === 'CONFIDENT' && (
                  <div className="space-y-4">
                    <div className="bg-[#101C2E] border border-[#24344A] rounded-lg p-3.5 space-y-3">
                      <ConfidenceMeter value={analysis.confidence} showScale />
                      
                      <div className="pt-2 border-t border-[#24344A] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B5C7] block">
                          Evidence Verification Checklist
                        </span>
                        <ul className="space-y-1.5">
                          {evidenceChecks.map((check) => (
                            <li key={check.label} className="flex items-center gap-2 text-xs">
                              <Check
                                size={13}
                                className={check.ok ? 'text-[#19C37D] shrink-0' : 'text-[#718096] shrink-0'}
                              />
                              <span className={check.ok ? 'text-[#F3F7FC] font-medium' : 'text-[#718096]'}>
                                {check.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <SensorAgreement
                      readings={analysis.sensorAgreement}
                      crossSensorAgreement={analysis.crossSensorAgreement}
                    />
                  </div>
                )}

                {analysis.verdict === 'UNCERTAIN' && (
                  <UncertaintyCard
                    analysis={analysis}
                    onInspect={inspectEvidence}
                    onReview={requestReview}
                  />
                )}

                {analysis.verdict === 'ABSTAIN' && (
                  <AbstentionCard
                    analysis={analysis}
                    onInspect={inspectEvidence}
                    onRetry={() => setStatus('idle')}
                  />
                )}

                {/* 3 Tabs: Evidence / Trace / Interrogator */}
                <Tabs value={decisionTab} onValueChange={setDecisionTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-3 h-9 bg-[#0D192A] p-0.5 rounded-lg border border-[#24344A]">
                    <TabsTrigger
                      value="evidence"
                      className="text-[11px] font-bold py-1.5 data-[state=active]:bg-[#102B45] data-[state=active]:text-[#35B7FF]"
                    >
                      Evidence ({analysis.evidence.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="trace"
                      className="text-[11px] font-bold py-1.5 data-[state=active]:bg-[#102B45] data-[state=active]:text-[#35B7FF]"
                    >
                      Audit Trace
                    </TabsTrigger>
                    <TabsTrigger
                      value="chat"
                      className="text-[11px] font-bold py-1.5 data-[state=active]:bg-[#102B45] data-[state=active]:text-[#35B7FF] gap-1"
                    >
                      <Bot size={12} className="text-[#22C7D6]" />
                      Interrogate
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="evidence" className="space-y-2 mt-3">
                    {analysis.evidence.map((ev) => (
                      <EvidenceCard
                        key={ev.id}
                        evidence={ev}
                        selected={selectedRegion?.geometry.evidenceId === ev.id}
                        hovered={hoveredRegionId === ev.id}
                        onHover={(isHov) => setHoveredRegionId(isHov ? ev.id : undefined)}
                        onSelect={() => {
                          const region = analysis.regions.find(
                            (r) => r.geometry.evidenceId === ev.id,
                          );
                          if (region) handleSelectRegion(region);
                        }}
                        compact
                      />
                    ))}
                    {analysis.evidence.length === 0 && (
                      <p className="text-xs text-[#718096] text-center py-4">
                        No grounded evidence regions found.
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="trace" className="mt-3">
                    <ExecutionTrace events={analysis.executionTrace} compact />
                  </TabsContent>

                  <TabsContent value="chat" className="mt-3">
                    <ChatFollowUp
                      analysis={analysis}
                      onHighlightRegion={(rid) => {
                        const region = analysis.regions.find((r) => r.id === rid);
                        if (region) handleSelectRegion(region);
                      }}
                    />
                  </TabsContent>
                </Tabs>

                {/* Primary Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-[#24344A]">
                  <Link href={`/evidence/${analysis.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1.5 text-xs font-semibold text-[#A8B5C7] border-[#24344A] bg-[#101C2E] hover:bg-[#142238] hover:text-[#F3F7FC] h-9"
                    >
                      <FileSearch size={14} className="text-[#20A4F3]" />
                      Inspect Evidence
                    </Button>
                  </Link>
                  <Link href={`/reports/${analysis.id}`} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full gap-1.5 text-xs font-bold bg-[#20A4F3] text-[#07111F] hover:bg-[#35B7FF] h-9 shadow-sm"
                    >
                      <FileText size={14} />
                      Generate Report
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </aside>
        )}
        {!rightPanelOpen && (
          <button
            onClick={() => setRightPanelOpen(true)}
            className="flex items-center justify-center w-8 border-l border-[#24344A] bg-[#0B1628] hover:bg-[#142238] transition-colors"
            title="Expand Decision Panel"
          >
            <PanelRight size={16} className="text-[#A8B5C7]" />
          </button>
        )}
      </div>

      {/* Panel Toggle Bottom Status Bar */}
      <div className="flex items-center justify-between px-6 py-1.5 border-t border-[#24344A] bg-[#081322] text-xs select-none shrink-0">
        <button
          onClick={() => setLeftPanelOpen((v) => !v)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#A8B5C7] hover:text-[#F3F7FC] transition-colors"
        >
          {leftPanelOpen ? <PanelLeftClose size={13} /> : <PanelLeft size={13} />}
          <span>Query Console</span>
        </button>
        <span className="text-[10px] font-mono text-[#718096]">
          SatQuery AI · Enterprise Geospatial Intelligence Console
        </span>
        <button
          onClick={() => setRightPanelOpen((v) => !v)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#A8B5C7] hover:text-[#F3F7FC] transition-colors"
        >
          <span>Decision Panel</span>
          {rightPanelOpen ? <PanelRightClose size={13} /> : <PanelRight size={13} />}
        </button>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#07111F] text-[#F3F7FC] font-mono text-xs">
          Initializing SatQuery Decision Console...
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}
