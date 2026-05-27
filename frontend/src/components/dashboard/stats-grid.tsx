"use client";

import React from "react";
import { useAgentState } from "@/hooks/use-agent-state";
import { BentoGrid } from "@/components/ui/bento-grid";

export function StatsGrid() {
  const { state } = useAgentState();

  return (
    <BentoGrid className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 !auto-rows-auto">
      
      {/* Jobs Hunted Card */}
      <div className="bento-card border border-slate-100 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between select-none">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
          <span className="font-label text-xs font-bold text-slate-400 uppercase tracking-widest">Jobs Hunted</span>
        </div>
        <div className="flex flex-col mt-2">
          <span className="text-3xl font-headline font-black text-slate-900 leading-none">
            {state.jobsHunted}
          </span>
          <span className="text-[11px] text-emerald-600 font-label font-bold flex items-center gap-0.5 mt-3">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'wght' 700" }}>trending_up</span>
            +12.4% vs last week
          </span>
        </div>
      </div>

      {/* Match Score Card */}
      <div className="bento-card border border-slate-100 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between select-none">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-slate-400 text-lg">track_changes</span>
          <span className="font-label text-xs font-bold text-slate-400 uppercase tracking-widest">Match Score</span>
        </div>
        <div className="flex flex-col mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-headline font-black text-slate-900 leading-none">
              {state.matchScore}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${state.matchScore}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-slate-400 font-label font-bold mt-2.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            +2.1% improvement
          </span>
        </div>
      </div>

      {/* Application Success Card */}
      <div className="bento-card border border-slate-100 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between select-none">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-slate-400 text-lg">rocket_launch</span>
          <span className="font-label text-xs font-bold text-slate-400 uppercase tracking-widest">Application Success</span>
        </div>
        <div className="flex flex-col mt-2">
          <span className="text-3xl font-headline font-black text-slate-900 leading-none">
            {state.applicationSuccess}%
          </span>
          <span className="text-[11px] text-slate-400 font-label font-bold flex items-center gap-1 mt-3.5">
            <span className="material-symbols-outlined text-xs">trending_flat</span>
            ~Steady trajectory
          </span>
        </div>
      </div>

    </BentoGrid>
  );
}
