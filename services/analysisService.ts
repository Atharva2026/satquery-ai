import {
  buildReport,
  demoScenarios,
  findScenario,
  resolveScenarioFromQuery,
} from '@/lib/mock-data';
import type { AnalysisResult, DemoScenario, EvidenceItem, ReportSection } from '@/types';

export { buildReport };

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDemoScenario(id: string): Promise<DemoScenario | undefined> {
  await delay(150);
  return findScenario(id);
}

export async function listDemoScenarios(): Promise<DemoScenario[]> {
  await delay(100);
  return demoScenarios;
}

export async function getAnalysis(id: string): Promise<AnalysisResult | undefined> {
  await delay(200);
  return findScenario(id)?.result;
}

export async function listAnalyses(): Promise<AnalysisResult[]> {
  await delay(150);
  return demoScenarios.map((s) => s.result);
}

export async function getEvidence(
  analysisId: string,
  evidenceId: string,
): Promise<EvidenceItem | undefined> {
  await delay(200);
  const analysis = await getAnalysis(analysisId);
  return analysis?.evidence.find((e) => e.id === evidenceId);
}

export async function getReport(analysisId: string): Promise<ReportSection[] | undefined> {
  await delay(250);
  const analysis = await getAnalysis(analysisId);
  if (!analysis) return undefined;
  return buildReport(analysis);
}

export async function analyzeQuery(
  query: string,
  scenarioId?: string,
): Promise<AnalysisResult> {
  await delay(100);
  const scenario = resolveScenarioFromQuery(query, scenarioId);
  return {
    ...scenario.result,
    query: query || scenario.query,
    createdAt: new Date().toISOString(),
  };
}
