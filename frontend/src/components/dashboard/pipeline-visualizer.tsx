"use client";

import React from "react";
import { useAgentState } from "@/hooks/use-agent-state";
import { Particles } from "@/components/ui/particles";

export function PipelineVisualizer() {
  const { state, isConnected } = useAgentState();
  const activeStage = state.pipelineStage;
  
  const getStageClass = (stage: string) => {
    return activeStage === stage 
      ? "bg-primary border-primary-container" 
      : "bg-surface-container border-primary-container";
  };
  
  const getIconClass = (stage: string) => {
    return activeStage === stage ? "text-white" : "text-primary";
  };

  return (
    <section className="relative mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color="#0f172a"
        refresh
      />
      <div className="relative z-10 flex justify-between items-center mb-6">
        <h3 className="font-headline font-bold text-slate-900">LangGraph Pipeline</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-label ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
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
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors duration-300 ${getStageClass('Ingestion')}`}>
            <span className={`material-symbols-outlined ${getIconClass('Ingestion')}`}>download</span>
          </div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">Ingestion</span>
        </div>
        <div className="flex flex-col items-center z-10 gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors duration-300 ${getStageClass('Strategy')}`}>
            <span className={`material-symbols-outlined ${getIconClass('Strategy')}`}>psychology</span>
          </div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">Strategy</span>
        </div>
        <div className="flex flex-col items-center z-10 gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors duration-300 ${getStageClass('Tailoring')}`}>
            <span className={`material-symbols-outlined ${getIconClass('Tailoring')}`}>architecture</span>
          </div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">Tailoring</span>
        </div>
        <div className="flex flex-col items-center z-10 gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors duration-300 ${getStageClass('Submission')}`}>
            <span className={`material-symbols-outlined ${getIconClass('Submission')}`}>send</span>
          </div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">Submission</span>
        </div>
      </div>
    </section>
  );
}
