"use client";

import React from "react";
import { useAgentState } from "@/hooks/use-agent-state";
import { BentoGrid } from "@/components/ui/bento-grid";

export function StatsGrid() {
  const { state } = useAgentState();

  return (
    <BentoGrid className="mb-8">
      {/* Jobs Hunted */}
      <div className="bento-card md:col-span-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary">search</span>
          </div>
          <p className="font-label text-sm text-on-surface-variant">Jobs Hunted</p>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-headline font-black text-on-surface">{state.jobsHunted}</span>
          <span className="text-xs text-green-600 font-bold flex items-center">+8%</span>
        </div>
      </div>
      {/* Match Score */}
      <div className="bento-card rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between md:col-span-1">
        <div>
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>target</span>
          </div>
          <p className="font-label text-sm text-on-surface-variant">Match Score</p>
        </div>
        <div className="mt-4">
          <span className="text-4xl font-headline font-black text-on-surface">{state.matchScore}%</span>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-2">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${state.matchScore}%` }}></div>
          </div>
        </div>
      </div>
      {/* Application Success */}
      <div className="bento-card md:col-span-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary">rocket_launch</span>
          </div>
          <p className="font-label text-sm text-on-surface-variant">Application Success</p>
        </div>
        <div className="mt-4 flex flex-col">
          <span className="text-4xl font-headline font-black text-on-surface">{state.applicationSuccess}%</span>
          <p className="text-[10px] text-on-surface-variant font-label mt-1">Benchmark: 8% average</p>
        </div>
      </div>
    </BentoGrid>
  );
}
