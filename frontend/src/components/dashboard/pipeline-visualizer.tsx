"use client";

import React, { useRef } from "react";
import { useAgentState } from "@/hooks/use-agent-state";
import { Particles } from "@/components/ui/particles";
import { AnimatedBeam } from "@/components/ui/animated-beam";

export function PipelineVisualizer() {
  const { state, isConnected } = useAgentState();
  const activeStage = state.pipelineStage;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);
  const ingestionRef = useRef<HTMLDivElement>(null);
  const strategyRef = useRef<HTMLDivElement>(null);
  const tailoringRef = useRef<HTMLDivElement>(null);
  const submissionRef = useRef<HTMLDivElement>(null);
  
  const getStageClass = (stage: string) => {
    return activeStage === stage 
      ? "bg-emerald-600 border-emerald-500 shadow-md shadow-emerald-100 scale-110" 
      : "bg-slate-50 border-slate-200 hover:border-slate-350";
  };
  
  const getIconClass = (stage: string) => {
    return activeStage === stage ? "text-white" : "text-slate-400";
  };

  const getLabelClass = (stage: string) => {
    return activeStage === stage
      ? "text-emerald-700 font-black scale-105"
      : "text-slate-400 font-semibold";
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] select-none">
      <Particles
        className="absolute inset-0 z-0"
        quantity={60}
        ease={80}
        color="#10b981"
        refresh
      />
      
      <div className="relative z-10 flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600 text-lg">route</span>
          <h3 className="font-headline font-bold text-slate-900 text-sm">LangGraph Pipeline</h3>
        </div>
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full font-label uppercase tracking-widest border ${
          isConnected 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : 'bg-red-50 border-red-200 text-red-750'
        }`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Grid container to guarantee absolute perfect layout alignment & prevent narrow wrapping/smushing! */}
      <div 
        ref={containerRef} 
        className="relative h-36 w-full grid grid-cols-5 items-center justify-items-center px-2 z-10"
      >
        
        {/* Persona Node */}
        <div ref={personaRef} className="flex flex-col items-center gap-2.5 text-center w-full min-w-0">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-300 shrink-0 ${getStageClass('Persona')}`}>
            <span className={`material-symbols-outlined text-base ${getIconClass('Persona')}`}>account_circle</span>
          </div>
          <span className={`text-[9px] font-label uppercase tracking-wider transition-all truncate w-full ${getLabelClass('Persona')}`}>
            Persona
          </span>
        </div>

        {/* Ingestion Node */}
        <div ref={ingestionRef} className="flex flex-col items-center gap-2.5 text-center w-full min-w-0">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-300 shrink-0 ${getStageClass('Ingestion')}`}>
            <span className={`material-symbols-outlined text-base ${getIconClass('Ingestion')}`}>download</span>
          </div>
          <span className={`text-[9px] font-label uppercase tracking-wider transition-all truncate w-full ${getLabelClass('Ingestion')}`}>
            Ingestion
          </span>
        </div>

        {/* Strategy Node */}
        <div ref={strategyRef} className="flex flex-col items-center gap-2.5 text-center w-full min-w-0">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-300 shrink-0 ${getStageClass('Strategy')}`}>
            <span className={`material-symbols-outlined text-base ${getIconClass('Strategy')}`}>psychology</span>
          </div>
          <span className={`text-[9px] font-label uppercase tracking-wider transition-all truncate w-full ${getLabelClass('Strategy')}`}>
            Strategy
          </span>
        </div>

        {/* Tailoring Node */}
        <div ref={tailoringRef} className="flex flex-col items-center gap-2.5 text-center w-full min-w-0">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-300 shrink-0 ${getStageClass('Tailoring')}`}>
            <span className={`material-symbols-outlined text-base ${getIconClass('Tailoring')}`}>architecture</span>
          </div>
          <span className={`text-[9px] font-label uppercase tracking-wider transition-all truncate w-full ${getLabelClass('Tailoring')}`}>
            Tailoring
          </span>
        </div>

        {/* Submission Node */}
        <div ref={submissionRef} className="flex flex-col items-center gap-2.5 text-center w-full min-w-0">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-300 shrink-0 ${getStageClass('Submission')}`}>
            <span className={`material-symbols-outlined text-base ${getIconClass('Submission')}`}>send</span>
          </div>
          <span className={`text-[9px] font-label uppercase tracking-wider transition-all truncate w-full ${getLabelClass('Submission')}`}>
            Submission
          </span>
        </div>

        {/* Animated Beams */}
        <AnimatedBeam containerRef={containerRef} fromRef={personaRef} toRef={ingestionRef} curvature={-15} pathColor="#e2e8f0" gradientStartColor="#10b981" gradientStopColor="#059669" />
        <AnimatedBeam containerRef={containerRef} fromRef={ingestionRef} toRef={strategyRef} curvature={15} pathColor="#e2e8f0" gradientStartColor="#10b981" gradientStopColor="#059669" />
        <AnimatedBeam containerRef={containerRef} fromRef={strategyRef} toRef={tailoringRef} curvature={-15} pathColor="#e2e8f0" gradientStartColor="#10b981" gradientStopColor="#059669" />
        <AnimatedBeam containerRef={containerRef} fromRef={tailoringRef} toRef={submissionRef} curvature={15} pathColor="#e2e8f0" gradientStartColor="#10b981" gradientStopColor="#059669" />
      </div>
    </section>
  );
}
