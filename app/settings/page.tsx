'use client';

import { useState } from 'react';
import { TopNav } from '@/components/satquery/TopNav';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Settings, Sliders, Cpu, Database, ShieldCheck, Info } from 'lucide-react';

type SettingsTab =
  | 'general'
  | 'appearance'
  | 'analysis'
  | 'models'
  | 'confidence'
  | 'system';

const tabs: { id: SettingsTab; label: string; icon: typeof Settings }[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'appearance', label: 'Appearance', icon: Sliders },
  { id: 'analysis', label: 'Analysis Preferences', icon: Database },
  { id: 'models', label: 'Model Configuration', icon: Cpu },
  { id: 'confidence', label: 'Confidence & Abstention', icon: ShieldCheck },
  { id: 'system', label: 'System Information', icon: Info },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('general');
  const [org, setOrg] = useState('ISRO / Space Applications Centre (SAC)');
  const [units, setUnits] = useState('metric');
  const [density, setDensity] = useState('compact');
  const [abstain, setAbstain] = useState(true);
  const [minAgreement, setMinAgreement] = useState('0.70');
  const [tempScaling, setTempScaling] = useState('1.35');
  const [opticalModel, setOpticalModel] = useState('InternVL2-4B-Geospatial');
  const [sarModel, setSarModel] = useState('ChangeFormer-BiTemporal-SAR');
  const [groundingModel, setGroundingModel] = useState('GroundingDINO-EarthVision');

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F3F7FC]">
      <TopNav />
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold text-[#22C7D6] uppercase tracking-wider bg-[#102B45] px-2 py-0.5 rounded border border-[#20A4F3]/30">
              PREFERENCES &amp; ENGINE CONFIG
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F3F7FC] mb-2">
            System Settings &amp; Configuration
          </h1>
          <p className="text-sm text-[#A8B5C7] leading-relaxed max-w-2xl">
            Configure multi-sensor calibration thresholds, vision-language model inference backends, and decision refusal parameters.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-7">
          {/* Settings Sidebar Nav */}
          <nav className="w-full md:w-64 shrink-0 space-y-1.5 bg-[#0B1628] border border-[#24344A] rounded-xl p-3">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-[#102B45] text-[#35B7FF] border border-[#20A4F3]/30 shadow-xs'
                      : 'text-[#8FA0B5] hover:bg-[#101C2E] hover:text-[#F3F7FC]',
                  )}
                >
                  <Icon size={15} className={isActive ? 'text-[#20A4F3]' : 'text-[#718096]'} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Settings Content Panel */}
          <div className="flex-1 rounded-xl border border-[#24344A] bg-[#101C2E] p-7 space-y-6 shadow-md">
            {tab === 'general' && (
              <div className="space-y-5 max-w-xl">
                <Field label="Organization / Agency Unit">
                  <input
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#24344A] bg-[#0D192A] px-3.5 text-xs text-[#F3F7FC] focus:border-[#20A4F3] focus:outline-none"
                  />
                </Field>
                <Field label="Coordinate System & Distance Units">
                  <select
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#24344A] bg-[#0D192A] px-3.5 text-xs text-[#F3F7FC] focus:border-[#20A4F3] focus:outline-none"
                  >
                    <option value="metric">Metric (WGS84 EPSG:4326 / UTM metres)</option>
                    <option value="mgrs">Military Grid Reference System (MGRS)</option>
                    <option value="imperial">Imperial (Feet / Statute Miles)</option>
                  </select>
                </Field>
              </div>
            )}

            {tab === 'appearance' && (
              <div className="space-y-5 max-w-xl">
                <Field label="Console Display Density">
                  <select
                    value={density}
                    onChange={(e) => setDensity(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#24344A] bg-[#0D192A] px-3.5 text-xs text-[#F3F7FC] focus:border-[#20A4F3] focus:outline-none"
                  >
                    <option value="compact">Compact Tactical (High Information Density)</option>
                    <option value="comfortable">Comfortable (Standard Padding)</option>
                  </select>
                </Field>
                <div className="rounded-lg border border-[#24344A] bg-[#0B1628] p-4 text-xs text-[#A8B5C7] space-y-1">
                  <span className="font-bold text-[#F3F7FC] block">Theme Direction</span>
                  <p>Global Dark Mission-Control Theme is permanently active for mission reliability and high GIS contrast.</p>
                </div>
              </div>
            )}

            {tab === 'analysis' && (
              <div className="space-y-5 max-w-xl">
                <Field label="Minimum Cross-Sensor Agreement Bound">
                  <input
                    value={minAgreement}
                    onChange={(e) => setMinAgreement(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#24344A] bg-[#0D192A] px-3.5 text-xs font-mono text-[#22C7D6] focus:border-[#20A4F3] focus:outline-none"
                  />
                  <p className="text-[11px] text-[#718096] mt-1 font-mono">Default threshold: 0.70 cross-sensor convergence.</p>
                </Field>
                <Field label="Default Spectral Band Combination">
                  <select className="w-full h-10 rounded-lg border border-[#24344A] bg-[#0D192A] px-3.5 text-xs text-[#F3F7FC] focus:border-[#20A4F3] focus:outline-none">
                    <option>True Color RGB (B04, B03, B02)</option>
                    <option>False Color Infrared (B08, B04, B03)</option>
                    <option>SWIR Urban Index (B12, B8A, B04)</option>
                  </select>
                </Field>
              </div>
            )}

            {tab === 'models' && (
              <div className="space-y-5 max-w-xl">
                <Field label="Vision-Language Reasoning Foundation">
                  <input
                    value={opticalModel}
                    onChange={(e) => setOpticalModel(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#24344A] bg-[#0D192A] px-3.5 text-xs font-mono text-[#20A4F3] focus:border-[#20A4F3] focus:outline-none"
                  />
                </Field>
                <Field label="SAR Coherence & Change Detection Backbone">
                  <input
                    value={sarModel}
                    onChange={(e) => setSarModel(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#24344A] bg-[#0D192A] px-3.5 text-xs font-mono text-[#22C7D6] focus:border-[#20A4F3] focus:outline-none"
                  />
                </Field>
                <Field label="Zero-Shot Spatial Grounding Detector">
                  <input
                    value={groundingModel}
                    onChange={(e) => setGroundingModel(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#24344A] bg-[#0D192A] px-3.5 text-xs font-mono text-[#35B7FF] focus:border-[#20A4F3] focus:outline-none"
                  />
                </Field>
              </div>
            )}

            {tab === 'confidence' && (
              <div className="space-y-5 max-w-xl">
                <label className="flex items-start gap-3 rounded-lg border border-[#24344A] bg-[#0B1628] p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={abstain}
                    onChange={(e) => setAbstain(e.target.checked)}
                    className="mt-0.5 accent-[#20A4F3] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#F3F7FC] block">
                      Enforce Explicit ABSTAIN Mode on Unverifiable Signals
                    </span>
                    <p className="text-[11px] text-[#A8B5C7] leading-relaxed mt-0.5">
                      Prevents hallucinated satellite intelligence when optical/SAR cross-sensor evidence conflicts below mission safety bounds.
                    </p>
                  </div>
                </label>
                <Field label="Logit Temperature Calibration Factor (T)">
                  <input
                    value={tempScaling}
                    onChange={(e) => setTempScaling(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#24344A] bg-[#0D192A] px-3.5 text-xs font-mono text-[#F3F7FC] focus:border-[#20A4F3] focus:outline-none"
                  />
                  <p className="text-[11px] text-[#718096] mt-1 font-mono">Temperature Scaling calibrates overconfident logits to true statistical probabilities.</p>
                </Field>
              </div>
            )}

            {tab === 'system' && (
              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border border-[#24344A] bg-[#0B1628] p-3.5">
                    <span className="text-[10px] font-bold text-[#718096] uppercase block">Platform Version</span>
                    <span className="font-mono font-bold text-[#F3F7FC] mt-1 block">SatQuery AI Enterprise v2.4</span>
                  </div>
                  <div className="rounded-lg border border-[#24344A] bg-[#0B1628] p-3.5">
                    <span className="text-[10px] font-bold text-[#718096] uppercase block">Inference Engine</span>
                    <span className="font-mono font-bold text-[#22C7D6] mt-1 block">PyTorch 2.3 + CUDA 12.1</span>
                  </div>
                  <div className="rounded-lg border border-[#24344A] bg-[#0B1628] p-3.5">
                    <span className="text-[10px] font-bold text-[#718096] uppercase block">GIS Pipeline</span>
                    <span className="font-mono font-bold text-[#20A4F3] mt-1 block">GDAL 3.8 / Rasterio COG</span>
                  </div>
                  <div className="rounded-lg border border-[#24344A] bg-[#0B1628] p-3.5">
                    <span className="text-[10px] font-bold text-[#718096] uppercase block">Calibration Status</span>
                    <span className="font-mono font-bold text-[#19C37D] mt-1 block">Platt Scaled (ECE: 3.7%)</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#24344A]">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold text-[#A8B5C7] border-[#24344A] bg-[#0B1628] hover:bg-[#142238] hover:text-[#F3F7FC] h-9"
              >
                Save Configuration (Session Demo Active)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold text-[#A8B5C7] uppercase tracking-wider block">
        {label}
      </span>
      {children}
    </label>
  );
}
