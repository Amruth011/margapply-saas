import React from "react";

export function StatsGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Jobs Hunted */}
      <div className="bento-card rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary">search</span>
          </div>
          <p className="font-label text-sm text-on-surface-variant">Jobs Hunted</p>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-headline font-black text-on-surface">42</span>
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
          <span className="text-4xl font-headline font-black text-on-surface">85%</span>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-2">
            <div className="bg-primary h-full rounded-full w-[85%]"></div>
          </div>
        </div>
      </div>
      {/* Application Success */}
      <div className="bento-card rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary">rocket_launch</span>
          </div>
          <p className="font-label text-sm text-on-surface-variant">Application Success</p>
        </div>
        <div className="mt-4 flex flex-col">
          <span className="text-4xl font-headline font-black text-on-surface">12%</span>
          <p className="text-[10px] text-on-surface-variant font-label mt-1">Benchmark: 8% average</p>
        </div>
      </div>
    </section>
  );
}
