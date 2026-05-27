"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAgentState, type LedgerEntry } from "@/hooks/use-agent-state";
import { Button } from "@/components/ui/button";

// ── Static seed rows shown when no live ledger data has arrived yet ────────────
const SEED_ROWS: LedgerEntry[] = [
  { id: "seed-1", title: "Product Designer", company: "Stripe",    status: "Interviewing", score: 88, timestamp: "2026-05-20T09:00:00Z" },
  { id: "seed-2", title: "UX Engineer",       company: "Vercel",    status: "Applied",      score: 81, timestamp: "2026-05-22T14:30:00Z" },
  { id: "seed-3", title: "AI Researcher",     company: "Anthropic", status: "Reviewing",    score: 94, timestamp: "2026-05-24T11:15:00Z" },
];

// ── Status badge styles mapped exactly to the Aigentic design screenshot ────────
// Applied -> DELIVERED (Green)
// Interviewing -> BOOKED (Blue)
// Reviewing -> QUALIFIED (Gray)
// Discovered -> AWAITING APPROVAL (Yellow)
const BADGE_STYLES: Record<string, { bg: string; label: string }> = {
  Applied:      { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", label: "DELIVERED" },
  Interviewing: { bg: "bg-blue-50 text-blue-700 border-blue-100",          label: "BOOKED" },
  Reviewing:    { bg: "bg-slate-50 text-slate-500 border-slate-100",       label: "QUALIFIED" },
  Discovered:   { bg: "bg-amber-50 text-amber-700 border-amber-100",       label: "AWAITING APPROVAL" },
  Submitting:   { bg: "bg-amber-50 text-amber-700 border-amber-100",       label: "AWAITING APPROVAL" },
  Failed:       { bg: "bg-red-50 text-red-650 border-red-100",             label: "FAILED" },
};

function getBadgeProps(status: string) {
  return BADGE_STYLES[status] ?? { bg: "bg-slate-50 text-slate-500 border-slate-100", label: status.toUpperCase() };
}

function formatDate(iso: string) {
  try {
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
    }
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
  } catch {
    return "Recently";
  }
}

// ── Row ────────────────────────────────────────────────────────────────────────
interface RowProps {
  entry: LedgerEntry;
  isNew: boolean;
}

function LedgerRow({ entry, isNew }: RowProps) {
  const { startAnalysis } = useAgentState();
  const [analyzing, setAnalyzing] = useState(false);

  const initials = entry.company
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleReviewApply = () => {
    if (entry.url) {
      setAnalyzing(true);
      startAnalysis(entry.url);
      setTimeout(() => setAnalyzing(false), 2000);
    }
  };

  const badge = getBadgeProps(entry.status);

  // Generate a premium subtle color gradient for company avatars
  const getAvatarGradient = (char: string) => {
    const code = char.charCodeAt(0) || 0;
    if (code % 3 === 0) return "bg-gradient-to-br from-emerald-400/10 to-green-500/10 text-emerald-700 border-emerald-100";
    if (code % 3 === 1) return "bg-gradient-to-br from-blue-400/10 to-indigo-500/10 text-blue-700 border-blue-100";
    return "bg-gradient-to-br from-purple-400/10 to-pink-500/10 text-purple-700 border-purple-100";
  };

  return (
    <tr
      className={`
        hover:bg-slate-50/50 transition-colors group border-b border-slate-100/60
        ${isNew ? "animate-in fade-in slide-in-from-top-2 duration-500" : ""}
      `}
    >
      
      {/* Action/Role Title */}
      <td className="px-6 py-4.5 font-label text-xs font-semibold text-slate-400">
        {entry.status === "Applied" ? "Sequence Triggered" : entry.status === "Interviewing" ? "Meeting Confirmed" : "Lead Qualification"}
      </td>

      {/* Agent */}
      <td className="px-6 py-4.5 font-body text-sm font-bold text-slate-800">
        {entry.status === "Applied" || entry.status === "Reviewing" ? "Zenith-Prime" : "Apollo-9"}
      </td>

      {/* Target Lead (Company + Role) */}
      <td className="px-6 py-4.5">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border shadow-sm ${getAvatarGradient(initials)}`}>
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="font-body text-sm font-bold text-slate-850">
              {entry.company}
            </span>
            <span className="text-[11px] text-slate-400 font-label">
              {entry.title} {entry.score > 0 && `(${entry.score}% match)`}
            </span>
          </div>
        </div>
      </td>

      {/* Result Badge */}
      <td className="px-6 py-4.5">
        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border font-label ${badge.bg}`}>
          {badge.label}
        </span>
      </td>

      {/* Timestamp */}
      <td className="px-6 py-4.5 text-xs text-slate-400 font-label">
        {formatDate(entry.timestamp)}
      </td>

      {/* Detail Button */}
      <td className="px-6 py-4.5 text-right whitespace-nowrap">
        {entry.status === "Discovered" ? (
          <Button 
            onClick={handleReviewApply}
            disabled={analyzing}
            className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm px-3.5"
          >
            {analyzing ? (
              <>
                <svg className="animate-spin w-3 h-3 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xs" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <span>Review & Apply</span>
              </>
            )}
          </Button>
        ) : entry.status === "Applied" && entry.url ? (
          <a 
            href={entry.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
          >
            <span className="material-symbols-outlined text-[14px]">task_alt</span>
            Proof
          </a>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 rounded-full">
            <span className="material-symbols-outlined text-sm">more_vert</span>
          </Button>
        )}
      </td>
    </tr>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function LedgerTable() {
  const { state } = useAgentState();
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const prevLedgerRef = useRef<LedgerEntry[]>([]);

  const liveLedger = state.application_ledger;
  const rows = liveLedger && liveLedger.length > 0 ? liveLedger : SEED_ROWS;

  useEffect(() => {
    if (!liveLedger || liveLedger.length === 0) return;
    const prev = prevLedgerRef.current;
    const prevIds = new Set(prev.map((e) => e.id));
    const incoming = liveLedger.filter((e) => !prevIds.has(e.id));

    if (incoming.length > 0) {
      const ids = new Set(incoming.map((e) => e.id));
      setNewIds(ids);
      setTimeout(() => setNewIds(new Set()), 2000);
    }
    prevLedgerRef.current = liveLedger;
  }, [liveLedger]);

  return (
    <section className="rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden select-none">
      
      {/* Table Header Control Area */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="font-headline font-black text-slate-900 text-base">Recent Intelligence Activity</h3>
          {liveLedger && liveLedger.length > 0 && (
            <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200/50 text-emerald-700 font-label uppercase tracking-widest animate-pulse">
              Live
            </span>
          )}
        </div>

        {/* Filter and Download control buttons matching the screenshot */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8.5 w-8.5 rounded-xl border border-slate-150 text-slate-400 hover:text-slate-650 bg-white">
            <span className="material-symbols-outlined text-sm font-bold">filter_list</span>
          </Button>
          <Button variant="outline" size="icon" className="h-8.5 w-8.5 rounded-xl border border-slate-150 text-slate-400 hover:text-slate-650 bg-white">
            <span className="material-symbols-outlined text-sm font-bold">download</span>
          </Button>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100/80">
              <th className="px-6 py-3.5 font-label text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
              <th className="px-6 py-3.5 font-label text-[10px] font-black uppercase tracking-widest text-slate-400">Agent</th>
              <th className="px-6 py-3.5 font-label text-[10px] font-black uppercase tracking-widest text-slate-400">Target Lead</th>
              <th className="px-6 py-3.5 font-label text-[10px] font-black uppercase tracking-widest text-slate-400">Result</th>
              <th className="px-6 py-3.5 font-label text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
              <th className="px-6 py-3.5 font-label text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/30">
            {rows.map((entry) => (
              <LedgerRow
                key={entry.id}
                entry={entry}
                isNew={newIds.has(entry.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
