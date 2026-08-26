'use client';

import { cn } from '@/lib/utils';
import type { TaskMode, SensorType } from '@/types';
import { useState, useId } from 'react';
import {
  Clock,
  Sparkles,
  Crosshair,
  Columns,
  ChevronDown,
  Loader2,
  MapPin,
  PenTool,
  Upload,
  Layers,
  Check,
  Building2,
  Route,
  Waves,
  Hammer,
  Trees,
  Sliders,
  ArrowRight,
  HelpCircle,
  Eye,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export interface TaskDefinition {
  key: TaskMode;
  title: string;
  description: string;
  icon: LucideIcon;
  defaultPrompt: string;
  placeholder: string;
  actionLabel: string;
  relevantSensors: SensorType[];
}

export const ANALYSIS_TASKS: TaskDefinition[] = [
  {
    key: 'CHANGE',
    title: 'Detect Change',
    description: 'Compare imagery across dates and identify changes',
    icon: Clock,
    defaultPrompt:
      'What changed in this area between January and August? Highlight newly constructed structures.',
    placeholder:
      'What changed in this area between January and August? Highlight newly constructed structures.',
    actionLabel: 'Run Change Detection',
    relevantSensors: ['OPTICAL', 'SAR', 'TEMPORAL'],
  },
  {
    key: 'VQA',
    title: 'Ask About Image',
    description: 'Ask questions about what you see',
    icon: HelpCircle,
    defaultPrompt:
      'What land-use features and hydrological boundaries are visible in this area?',
    placeholder: 'Ask a question about this satellite image...',
    actionLabel: 'Ask SATQUERY',
    relevantSensors: ['OPTICAL', 'SAR'],
  },
  {
    key: 'GROUND',
    title: 'Find Objects',
    description: 'Locate buildings, roads, water, construction, etc.',
    icon: Crosshair,
    defaultPrompt:
      'Find all newly constructed buildings, warehouse foundations, and paved access roads.',
    placeholder: 'Describe anything specific you want to find...',
    actionLabel: 'Find Objects',
    relevantSensors: ['OPTICAL', 'SAR'],
  },
  {
    key: 'COMPARE',
    title: 'Compare Images',
    description: 'Compare two satellite images side-by-side',
    icon: Columns,
    defaultPrompt:
      'Compare the two dates and explain the major structural and land-use differences.',
    placeholder:
      'Compare the two dates and explain the major differences...',
    actionLabel: 'Compare Images',
    relevantSensors: ['OPTICAL', 'SAR', 'TEMPORAL'],
  },
];

const SENSOR_META: Record<
  SensorType,
  { label: string; description: string }
> = {
  OPTICAL: {
    label: 'Optical',
    description: 'Multispectral imagery',
  },
  SAR: {
    label: 'SAR',
    description: 'Radar imagery',
  },
  TEMPORAL: {
    label: 'Multi-date',
    description: 'Temporal comparison',
  },
};

const OBJECT_CATEGORIES = [
  { id: 'buildings', label: 'Buildings', icon: Building2, promptText: 'Locate all buildings and structural footprints.' },
  { id: 'roads', label: 'Roads', icon: Route, promptText: 'Locate all transit corridors, paved roads, and access tracks.' },
  { id: 'water', label: 'Water Bodies', icon: Waves, promptText: 'Delineate all rivers, reservoirs, and inundation zones.' },
  { id: 'construction', label: 'Construction', icon: Hammer, promptText: 'Identify all active construction sites and earthwork areas.' },
  { id: 'vegetation', label: 'Vegetation', icon: Trees, promptText: 'Detect canopy cover, agricultural tracts, and vegetation shifts.' },
  { id: 'custom', label: 'Custom', icon: Sliders, promptText: 'Locate specific structures within the designated region.' },
];

interface QueryPanelProps {
  onAnalyze: (query: string, mode: TaskMode, sensors: SensorType[]) => void;
  onLoadDemo?: (scenarioId: string) => void;
  onOpacityChange?: (value: number) => void;
  onTriggerAoiDraw?: () => void;
  opacity?: number;
  isLoading?: boolean;
  className?: string;
  defaultQuery?: string;
}

export function QueryPanel({
  onAnalyze,
  onOpacityChange,
  onTriggerAoiDraw,
  opacity = 80,
  isLoading = false,
  className,
  defaultQuery = '',
}: QueryPanelProps) {
  const queryInputId = useId();
  const [mode, setMode] = useState<TaskMode>('CHANGE');
  const [query, setQuery] = useState(
    defaultQuery || ANALYSIS_TASKS[0].defaultPrompt,
  );
  const [sensors, setSensors] = useState<SensorType[]>(['OPTICAL', 'SAR']);
  const [selectedObjectCategories, setSelectedObjectCategories] = useState<string[]>(['buildings']);
  const [compareView, setCompareView] = useState<'split' | 'swipe' | 'diff'>('split');
  const [changeTypes, setChangeTypes] = useState<string[]>([
    'New structures',
    'Land-cover change',
  ]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [aoiSelection, setAoiSelection] = useState<'current' | 'custom'>('current');
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);

  const activeTask =
    ANALYSIS_TASKS.find((t) => t.key === mode) || ANALYSIS_TASKS[0];

  const handleSelectTask = (newMode: TaskMode) => {
    setMode(newMode);
    const target = ANALYSIS_TASKS.find((t) => t.key === newMode);
    if (target) {
      setQuery(target.defaultPrompt);
      // Ensure active sensors match task relevance
      setSensors((prev) => {
        const filtered = prev.filter((s) => target.relevantSensors.includes(s));
        return filtered.length > 0 ? filtered : ['OPTICAL'];
      });
    }
  };

  const toggleSensor = (sensor: SensorType) => {
    setSensors((prev) => {
      if (prev.includes(sensor)) {
        return prev.length > 1 ? prev.filter((s) => s !== sensor) : prev;
      }
      return [...prev, sensor];
    });
  };

  const handleObjectCategoryClick = (category: typeof OBJECT_CATEGORIES[0]) => {
    setSelectedObjectCategories((prev) => {
      const isSelected = prev.includes(category.id);
      const next = isSelected
        ? prev.filter((c) => c !== category.id)
        : [...prev, category.id];
      
      // Update prompt if selected
      if (!isSelected) {
        setQuery(category.promptText);
      }
      return next.length > 0 ? next : [category.id];
    });
  };

  const toggleChangeType = (type: string) => {
    setChangeTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleAoiAction = (type: 'current' | 'custom') => {
    setAoiSelection(type);
    if (type === 'custom' && onTriggerAoiDraw) {
      onTriggerAoiDraw();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;
    onAnalyze(query.trim(), mode, sensors);
  };

  return (
    <div
      className={cn(
        'flex h-full min-h-0 min-w-0 flex-col bg-[#0B1628] text-[#F3F7FC] select-none',
        className,
      )}
    >
      {/* Main Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto sq-scrollbar p-4 space-y-5">
        {/* 1. CHOOSE TASK (WHAT DO YOU WANT TO DO?) */}
        <section aria-labelledby="task-heading" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2
              id="task-heading"
              className="text-[13px] font-semibold text-[#F3F7FC] tracking-tight"
            >
              What do you want to do?
            </h2>
            <span className="text-[11px] font-medium text-[#8FA0B5]">
              Step 1 of 3
            </span>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-2 gap-2">
            {ANALYSIS_TASKS.map((task) => {
              const isSelected = mode === task.key;
              const Icon = task.icon;

              return (
                <button
                  key={task.key}
                  type="button"
                  onClick={() => handleSelectTask(task.key)}
                  className={cn(
                    'group text-left p-3 rounded-lg border transition-all duration-150 relative flex flex-col justify-between min-h-[92px]',
                    isSelected
                      ? 'border-[#20A4F3] bg-[#102B45] text-[#F3F7FC] shadow-xs ring-1 ring-[#20A4F3]/50'
                      : 'border-[#24344A] bg-[#101C2E] text-[#A8B5C7] hover:border-[#20A4F3]/40 hover:bg-[#142238] hover:text-[#F3F7FC]',
                  )}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors',
                          isSelected
                            ? 'bg-[#20A4F3]/20 text-[#35B7FF]'
                            : 'bg-[#07111F] text-[#8FA0B5] group-hover:text-[#F3F7FC]',
                        )}
                      >
                        <Icon size={14} />
                      </div>
                      <span className="text-[13px] font-semibold tracking-tight text-[#F3F7FC] leading-snug truncate">
                        {task.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8FA0B5] leading-relaxed line-clamp-2">
                      {task.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-[#35B7FF]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#20A4F3]" />
                      <span>Active Task</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. NATURAL LANGUAGE QUERY (WHAT DO YOU WANT TO KNOW?) */}
        <section aria-labelledby="query-heading" className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor={queryInputId}
              id="query-heading"
              className="text-[13px] font-semibold text-[#F3F7FC] tracking-tight"
            >
              What do you want to know?
            </label>
            <span className="text-[11px] font-medium text-[#8FA0B5]">
              Step 2 of 3
            </span>
          </div>

          <div className="relative">
            <Textarea
              id={queryInputId}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={activeTask.placeholder}
              rows={3}
              className="w-full resize-none text-[12px] text-[#F3F7FC] bg-[#101C2E] border-[#24344A] placeholder-[#607289] focus-visible:ring-1 focus-visible:ring-[#20A4F3] focus-visible:border-[#20A4F3] leading-relaxed rounded-lg p-3 shadow-xs"
            />
          </div>
        </section>

        {/* 3. TASK-SPECIFIC CONFIGURATION */}
        <section className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#F3F7FC] tracking-tight">
              Configuration
            </span>
            <span className="text-[11px] font-mono text-[#22C7D6]">
              {activeTask.title}
            </span>
          </div>

          {/* Detect Change Configuration */}
          {mode === 'CHANGE' && (
            <div className="space-y-3 rounded-lg border border-[#24344A] bg-[#101C2E] p-3">
              {/* Baseline vs Target Dates */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md border border-[#24344A] bg-[#0B1628] p-2.5 space-y-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#8FA0B5] block">
                    T1 Baseline Date
                  </span>
                  <span className="text-[12px] font-semibold text-[#F3F7FC] block">
                    14 Jan 2026
                  </span>
                  <span className="text-[10px] font-mono text-[#35B7FF] block">
                    Sentinel-2 Optical
                  </span>
                </div>
                <div className="rounded-md border border-[#24344A] bg-[#0B1628] p-2.5 space-y-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#8FA0B5] block">
                    T2 Target Date
                  </span>
                  <span className="text-[12px] font-semibold text-[#F3F7FC] block">
                    22 Aug 2026
                  </span>
                  <span className="text-[10px] font-mono text-[#22C7D6] block">
                    Optical + SAR Fusion
                  </span>
                </div>
              </div>

              {/* Change Category Filters */}
              <div>
                <span className="text-[11px] font-medium text-[#8FA0B5] block mb-1.5">
                  Change Types to Isolate:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    'New structures',
                    'Land-cover change',
                    'Vegetation shift',
                    'Water-body delta',
                  ].map((type) => {
                    const isChecked = changeTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleChangeType(type)}
                        className={cn(
                          'flex items-center gap-2 p-2 rounded-md border text-left text-[11px] transition-colors',
                          isChecked
                            ? 'bg-[#102B45] border-[#20A4F3]/50 text-[#35B7FF] font-medium'
                            : 'bg-[#0B1628] border-[#24344A] text-[#8FA0B5] hover:text-[#F3F7FC]',
                        )}
                      >
                        <div
                          className={cn(
                            'h-3.5 w-3.5 rounded-xs border flex items-center justify-center shrink-0 transition-colors',
                            isChecked
                              ? 'bg-[#20A4F3] border-[#20A4F3] text-[#07111F]'
                              : 'border-[#4A5D75] bg-[#07111F]',
                          )}
                        >
                          {isChecked && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span className="truncate">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Ask About Image Configuration */}
          {mode === 'VQA' && (
            <div className="space-y-2 rounded-lg border border-[#24344A] bg-[#101C2E] p-3">
              <span className="text-[11px] font-medium text-[#8FA0B5] block">
                Quick Question Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'What land-use features are visible in this area?',
                  'Is there water present near the boundary?',
                  'Describe the built-up infrastructure density.',
                  'Are there any flooded roads or tracks?',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuery(preset)}
                    className="text-[11px] bg-[#0B1628] border border-[#24344A] px-2.5 py-1.5 rounded-md text-[#A8B5C7] hover:border-[#20A4F3] hover:text-[#35B7FF] transition-colors text-left"
                  >
                    &ldquo;{preset}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Find Objects Configuration */}
          {mode === 'GROUND' && (
            <div className="space-y-2.5 rounded-lg border border-[#24344A] bg-[#101C2E] p-3">
              <span className="text-[11px] font-medium text-[#8FA0B5] block">
                What should I find?
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {OBJECT_CATEGORIES.map((cat) => {
                  const isSelected = selectedObjectCategories.includes(cat.id);
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleObjectCategoryClick(cat)}
                      className={cn(
                        'flex items-center gap-1.5 p-2 rounded-md border text-left text-[11px] transition-all',
                        isSelected
                          ? 'bg-[#102B45] border-[#20A4F3] text-[#35B7FF] font-medium shadow-xs'
                          : 'bg-[#0B1628] border-[#24344A] text-[#8FA0B5] hover:border-[#20A4F3]/30 hover:text-[#F3F7FC]',
                      )}
                    >
                      <Icon size={12} className={isSelected ? 'text-[#20A4F3]' : 'text-[#8FA0B5]'} />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Compare Images Configuration */}
          {mode === 'COMPARE' && (
            <div className="space-y-3 rounded-lg border border-[#24344A] bg-[#101C2E] p-3">
              {/* Image 1 and Image 2 Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md border border-[#24344A] bg-[#0B1628] p-2.5 space-y-0.5">
                  <span className="text-[10px] font-semibold text-[#8FA0B5] uppercase">
                    Image 1 (Past)
                  </span>
                  <p className="text-[12px] font-medium text-[#F3F7FC]">
                    14 Jan 2026
                  </p>
                  <p className="text-[10px] text-[#35B7FF]">Sentinel-2 (10m)</p>
                </div>
                <div className="rounded-md border border-[#24344A] bg-[#0B1628] p-2.5 space-y-0.5">
                  <span className="text-[10px] font-semibold text-[#8FA0B5] uppercase">
                    Image 2 (Present)
                  </span>
                  <p className="text-[12px] font-medium text-[#F3F7FC]">
                    22 Aug 2026
                  </p>
                  <p className="text-[10px] text-[#22C7D6]">Optical + SAR</p>
                </div>
              </div>

              {/* Viewport Display Mode */}
              <div>
                <span className="text-[11px] font-medium text-[#8FA0B5] block mb-1.5">
                  Comparison Mode:
                </span>
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  {[
                    { id: 'split', label: 'Side-by-Side' },
                    { id: 'swipe', label: 'Swipe Slider' },
                    { id: 'diff', label: 'Diff Mask' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setCompareView(v.id as any)}
                      className={cn(
                        'py-1.5 px-2 rounded-md border text-center transition-colors',
                        compareView === v.id
                          ? 'bg-[#102B45] border-[#20A4F3] text-[#35B7FF] font-semibold'
                          : 'bg-[#0B1628] border-[#24344A] text-[#8FA0B5] hover:text-[#F3F7FC]',
                      )}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. IMAGERY SOURCES */}
        <section className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#F3F7FC] tracking-tight">
              Imagery Sources
            </span>
            <span className="text-[11px] text-[#8FA0B5]">
              {sensors.length} Selected
            </span>
          </div>

          {/* Contextual Sensor Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeTask.relevantSensors.map((sensorKey) => {
              const meta = SENSOR_META[sensorKey];
              const isSelected = sensors.includes(sensorKey);

              return (
                <button
                  key={sensorKey}
                  type="button"
                  onClick={() => toggleSensor(sensorKey)}
                  className={cn(
                    'p-2.5 rounded-lg border text-left transition-all duration-150 flex items-start justify-between gap-2',
                    isSelected
                      ? 'bg-[#102B45] border-[#20A4F3]/60 text-[#F3F7FC]'
                      : 'bg-[#101C2E] border-[#24344A] text-[#8FA0B5] hover:border-[#20A4F3]/30 hover:text-[#F3F7FC]',
                  )}
                >
                  <div>
                    <span className="text-[12px] font-semibold block leading-tight">
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-[#8FA0B5] leading-tight block mt-0.5">
                      {meta.description}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                      isSelected
                        ? 'bg-[#20A4F3] border-[#20A4F3] text-[#07111F]'
                        : 'border-[#4A5D75] bg-[#07111F]',
                    )}
                  >
                    {isSelected && <Check size={10} strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. AREA OF INTEREST */}
        <section className="space-y-2 pt-1">
          <span className="text-[13px] font-semibold text-[#F3F7FC] tracking-tight block">
            Area of Interest
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleAoiAction('custom')}
              className={cn(
                'flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-[12px] font-medium transition-colors',
                aoiSelection === 'custom'
                  ? 'bg-[#102B45] border-[#20A4F3] text-[#35B7FF]'
                  : 'bg-[#101C2E] border-[#24344A] text-[#A8B5C7] hover:bg-[#142238] hover:text-[#F3F7FC]',
              )}
            >
              <PenTool size={13} className="text-[#20A4F3]" />
              <span>Draw AOI</span>
            </button>

            <button
              type="button"
              onClick={() => handleAoiAction('current')}
              className={cn(
                'flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-[12px] font-medium transition-colors',
                aoiSelection === 'current'
                  ? 'bg-[#102B45] border-[#20A4F3] text-[#35B7FF]'
                  : 'bg-[#101C2E] border-[#24344A] text-[#A8B5C7] hover:bg-[#142238] hover:text-[#F3F7FC]',
              )}
            >
              <MapPin size={13} className="text-[#22C7D6]" />
              <span>Current Map View</span>
            </button>
          </div>
        </section>

        {/* 6. ADVANCED CONTROLS (Progressive Disclosure) */}
        <Collapsible
          open={advancedOpen}
          onOpenChange={setAdvancedOpen}
          className="pt-1"
        >
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between py-2 text-xs font-semibold text-[#8FA0B5] transition-colors hover:text-[#F3F7FC] border-t border-[#24344A]"
            >
              <span className="text-[12px] font-medium">Advanced Settings</span>
              <ChevronDown
                size={14}
                className={cn(
                  'text-[#8FA0B5] transition-transform duration-200',
                  advancedOpen && 'rotate-180 text-[#20A4F3]',
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2 pb-1">
            {/* Opacity Control */}
            <div className="rounded-lg border border-[#24344A] bg-[#101C2E] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#8FA0B5]">
                  Overlay Opacity
                </span>
                <span className="font-mono text-[11px] font-bold text-[#20A4F3]">
                  {opacity}%
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Layers size={13} className="shrink-0 text-[#8FA0B5]" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={opacity}
                  onChange={(e) => onOpacityChange?.(Number(e.target.value))}
                  className="min-w-0 flex-1 accent-[#20A4F3] h-1.5 bg-[#0B1628] border border-[#24344A] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Confidence Threshold */}
            <div className="rounded-lg border border-[#24344A] bg-[#101C2E] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#8FA0B5]">
                  Grounding Sensitivity
                </span>
                <span className="font-mono text-[11px] font-bold text-[#22C7D6]">
                  {confidenceThreshold}%
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-[#22C7D6] h-1.5 bg-[#0B1628] border border-[#24344A] rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Boundary Upload */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#24344A] bg-[#101C2E] py-2 px-3 text-xs text-[#A8B5C7] transition-colors hover:bg-[#142238] hover:text-[#F3F7FC]"
            >
              <Upload size={13} className="text-[#20A4F3]" />
              <span>Upload GeoJSON / Shapefile</span>
            </button>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* 7. STICKY PRIMARY CTA */}
      <div className="shrink-0 border-t border-[#24344A] p-4 bg-[#0B1628]">
        <Button
          onClick={() => handleSubmit()}
          disabled={isLoading || !query.trim()}
          className="w-full gap-2 bg-[#20A4F3] text-[#07111F] hover:bg-[#35B7FF] font-bold text-xs shadow-sm min-h-[44px] h-[44px] transition-all rounded-lg"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Processing Analysis...</span>
            </>
          ) : (
            <>
              <span>{activeTask.actionLabel}</span>
              <ArrowRight size={15} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
