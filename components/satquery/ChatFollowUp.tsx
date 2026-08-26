'use client';

import { useState, useRef, useEffect } from 'react';
import type { AnalysisResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Send,
  Bot,
  User,
  Sparkles,
  ShieldAlert,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
}

interface ChatFollowUpProps {
  analysis: AnalysisResult;
  onHighlightRegion?: (regionId: string) => void;
}

export function ChatFollowUp({ analysis, onHighlightRegion }: ChatFollowUpProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Analyst session initialized for ${analysis.id} (${analysis.location}). I have grounded ${analysis.regions.length} evidence regions with a calibrated verdict of ${analysis.verdict} (${Math.round(analysis.confidence * 100)}% confidence). How can I assist your spatial interrogation?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    analysis.verdict === 'ABSTAIN'
      ? 'Why did the decision engine abstain?'
      : analysis.verdict === 'UNCERTAIN'
        ? 'Why is there sensor disagreement?'
        : 'Break down SAR vs Optical evidence',
    'Calculate total detected footprint',
    'What operational action is recommended?',
  ];

  const handleSend = (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = queryText.toLowerCase();

      if (q.includes('abstain') || q.includes('refuse') || q.includes('why')) {
        if (analysis.verdict === 'ABSTAIN') {
          reply = `The decision engine triggered an automated refusal because cross-sensor verification failed: Optical contrast in the corridor was below 45% threshold, and Sentinel-1 SAR acquisition was completely missing for the requested temporal interval. Rather than producing a hallucinated prediction, SatQuery abstained to prevent operational failure.`;
        } else if (analysis.verdict === 'UNCERTAIN') {
          reply = `The verdict is UNCERTAIN due to cross-sensor divergence. Optical (S2) indicated 89% likelihood of surface inundation, but Sentinel-1 SAR returned only 54% likelihood due to steep radar incidence angle and cloud-shadow interference. Agreement score is 0.48 (below the 0.70 confidence threshold).`;
        } else {
          reply = `The decision engine achieved a high confidence verdict (${Math.round(analysis.confidence * 100)}%) because independent Optical (89%) and SAR double-bounce returns (91%) mutually corroborate 17 new rectilinear structures across T1 -> T2.`;
        }
      } else if (q.includes('footprint') || q.includes('area') || q.includes('size')) {
        const estArea = (analysis.regions.length * 1450).toLocaleString();
        reply = `Based on ${analysis.regions.length} polygon bounding geometries in this AOI, the estimated aggregate change footprint is approximately ~${estArea} m² (${(analysis.regions.length * 0.145).toFixed(2)} hectares) centered at ${analysis.location}.`;
      } else if (q.includes('sar') || q.includes('optical') || q.includes('sensor')) {
        reply = `Sensor breakdown for ${analysis.id}:\n• Optical (Sentinel-2 L2A): Multi-spectral reflectance shift detected in B04 (Red) & B08 (NIR).\n• SAR (Sentinel-1 GRD VV/VH): High backscatter anomalies confirm vertical corner reflections.\n• Cross-sensor spatial agreement: ${(analysis.crossSensorAgreement * 100).toFixed(0)}%.`;
      } else if (q.includes('recommend') || q.includes('action') || q.includes('risk')) {
        reply =
          analysis.verdict === 'CONFIDENT'
            ? `Recommended Actions:\n1. Dispatch municipal zoning audit to R-01 through R-04.\n2. Export GeoJSON layer to integrate into GIS boundary records.\n3. Mark AOI as active construction zone.`
            : analysis.verdict === 'UNCERTAIN'
              ? `Recommended Actions:\n1. Do NOT commit civil resources on optical alone.\n2. Task high-resolution drone pass or await next clear-sky Sentinel-1 pass.\n3. Request analyst human-in-the-loop signoff.`
              : `Recommended Actions:\n1. Re-run query with expanded temporal window (e.g. +/- 14 days) to ingest missing SAR orbit.\n2. Do not proceed with ground operations without secondary sensor verification.`;
      } else {
        reply = `Based on the spatial evidence for "${analysis.query}", the system observed ${analysis.regions.length} grounded features with ${analysis.verdict} verdict. You can inspect individual regions on the map canvas or export the full verified audit briefing.`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: analysis.regions.map((r) => r.id),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 650);
  };

  return (
    <div className="flex flex-col h-[400px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-700 text-white">
            <Bot size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">AI Geospatial Interrogator</h3>
            <p className="text-[10px] text-slate-500 font-mono">Model: SATQUERY-ORCHESTRATOR-V2</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ACTIVE
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 sq-scrollbar bg-slate-50/30 dark:bg-slate-950/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-2.5 max-w-[90%]',
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto',
            )}
          >
            <div
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                msg.sender === 'user'
                  ? 'bg-slate-800 text-white dark:bg-slate-700'
                  : 'bg-sky-700 text-white',
              )}
            >
              {msg.sender === 'user' ? <User size={12} /> : <Sparkles size={12} />}
            </div>
            <div
              className={cn(
                'rounded-lg p-2.5 text-xs leading-relaxed space-y-1.5',
                msg.sender === 'user'
                  ? 'bg-sky-700 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-2xs',
              )}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              {msg.citations && msg.citations.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[10px] font-mono">
                  <span className="text-slate-400">Grounded in:</span>
                  {msg.citations.slice(0, 3).map((cid) => (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => onHighlightRegion?.(cid)}
                      className="px-1 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold hover:underline"
                    >
                      {cid}
                    </button>
                  ))}
                </div>
              )}
              <span className="text-[9px] opacity-60 font-mono block text-right">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono italic">
            <Bot size={14} className="animate-spin text-sky-600" />
            <span>Analyzing cross-sensor tensors...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto sq-scrollbar">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="shrink-0 text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 shadow-2xs hover:border-sky-500 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI analyst about sensor discrepancies or bounding boxes..."
          className="flex-1 text-xs px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-600"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!input.trim() || isTyping}
          className="h-8 w-8 p-0 bg-sky-700 hover:bg-sky-800 text-white rounded-md shrink-0"
        >
          <Send size={13} />
        </Button>
      </form>
    </div>
  );
}
