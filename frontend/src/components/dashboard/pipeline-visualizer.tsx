import React from "react";

export function PipelineVisualizer() {
  return (
    <section className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline font-bold text-on-surface-variant">LangGraph Pipeline</h3>
        <span className="text-xs bg-primary-container text-on-primary-container px-2 py-1 rounded-full font-label">Active Now</span>
      </div>
      <div className="relative h-48 w-full flex items-center justify-between px-4">
        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <path className="animated-beam-path" d="M 12% 50% Q 25% 20%, 38% 50%" fill="none" stroke="#cbd5e1" strokeWidth="2"></path>
          <path className="animated-beam-path" d="M 38% 50% Q 50% 80%, 62% 50%" fill="none" stroke="#cbd5e1" strokeWidth="2"></path>
          <path className="animated-beam-path" d="M 62% 50% Q 75% 20%, 88% 50%" fill="none" stroke="#cbd5e1" strokeWidth="2"></path>
        </svg>
        {/* Nodes */}
        <div className="flex flex-col items-center z-10 gap-2">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary-container shadow-sm">
            <span className="material-symbols-outlined text-primary">download</span>
          </div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">Ingestion</span>
        </div>
        <div className="flex flex-col items-center z-10 gap-2">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary shadow-sm">
            <span className="material-symbols-outlined text-primary">psychology</span>
          </div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">Strategy</span>
        </div>
        <div className="flex flex-col items-center z-10 gap-2">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary-container shadow-sm">
            <span className="material-symbols-outlined text-primary">architecture</span>
          </div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">Tailoring</span>
        </div>
        <div className="flex flex-col items-center z-10 gap-2">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary-container shadow-sm">
            <span className="material-symbols-outlined text-primary">send</span>
          </div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">Submission</span>
        </div>
      </div>
    </section>
  );
}
