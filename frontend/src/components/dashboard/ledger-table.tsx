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

// ── Status badge styles ────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  Interviewing: "bg-emerald-100 text-emerald-700",
  Applied:      "bg-blue-100 text-blue-700",
  Reviewing:    "bg-amber-100 text-amber-700",
  Failed:       "bg-red-100 text-red-600",
  Submitting:   "bg-indigo-100 text-indigo-700",
  Discovered:   "bg-indigo-50 text-indigo-700 border border-indigo-100",
};

function statusStyle(status: string) {
  return STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600";
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
  } catch {
    return "";
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
      // Reset analyzing status after standard delay
      setTimeout(() => setAnalyzing(false), 2000);
    }
  };

  return (
    <tr
      className={`
        hover:bg-surface-container-low transition-colors group
        ${isNew ? "animate-in fade-in slide-in-from-top-2 duration-500" : ""}
      `}
    >
      {/* Company */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0
              transition-colors
              ${isNew ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"}
            `}
          >
            {initials}
          </div>
          <span className="font-body text-sm font-medium text-slate-900">{entry.company}</span>
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-4 font-body text-sm text-on-surface-variant">
        {entry.status === "Discovered" && entry.url ? (
          <a href={entry.url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-indigo-600 transition-colors">
            {entry.title}
          </a>
        ) : (
          <span>{entry.title}</span>
        )}
        {entry.score > 0 && (
          <span className="ml-2 text-[10px] font-bold text-slate-400">{entry.score}%</span>
        )}
      </td>

      {/* Date */}
      <td className="px-6 py-4 text-xs text-slate-400 font-label hidden md:table-cell">
        {formatDate(entry.timestamp)}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusStyle(entry.status)}`}
        >
          {entry.status}
        </span>
      </td>

      {/* Action */}
      <td className="px-6 py-4 text-right whitespace-nowrap">
        {entry.status === "Discovered" ? (
          <Button 
            onClick={handleReviewApply}
            disabled={analyzing}
            className="h-8 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
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
            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
          >
            <span className="material-symbols-outlined text-[14px]">task_alt</span>
            Proof
          </a>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100">
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

  // Detect newly added rows and highlight them briefly
  useEffect(() => {
    if (!liveLedger || liveLedger.length === 0) return;
    const prev = prevLedgerRef.current;
    const prevIds = new Set(prev.map((e) => e.id));
    const incoming = liveLedger.filter((e) => !prevIds.has(e.id));

    if (incoming.length > 0) {
      const ids = new Set(incoming.map((e) => e.id));
      setNewIds(ids);
      // Clear highlight after animation
      setTimeout(() => setNewIds(new Set()), 2000);
    }
    prevLedgerRef.current = liveLedger;
  }, [liveLedger]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="font-headline font-bold text-on-surface">Application Ledger</h3>
          {liveLedger && liveLedger.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-label uppercase tracking-wide">
              Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-label">{rows.length} entries</span>
          <Button variant="link" className="text-sm font-label text-primary font-bold">View All</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-6 py-3 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Company</th>
              <th className="px-6 py-3 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Role</th>
              <th className="px-6 py-3 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant hidden md:table-cell">Date</th>
              <th className="px-6 py-3 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
              <th className="px-6 py-3 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
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
