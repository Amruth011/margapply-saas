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
      <div ref={containerRef} className="relative h-48 w-full flex items-center justify-between px-4">
        {/* Nodes */}
        <div ref={personaRef} className="flex flex-col items-center z-10 gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors duration-300 ${getStageClass('Persona')}`}>
            <span className={`material-symbols-outlined ${getIconClass('Persona')}`}>account_circle</span>
          </div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">Persona</span>
        </div>
        <div ref={ingestionRef} className="flex flex-col items-center z-10 gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors duration-300 ${getStageClass('Ingestion')}`}>
            <span className={`material-symbols-outlined ${getIconClass('Ingestion')}`}>download</span>
          </div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">Ingestion</span>
        </div>
        <div ref={strategyRef} className="flex flex-col items-center z-10 gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors duration-300 ${getStageClass('Strategy')}`}>
            <span className={`material-symbols-outlined ${getIconClass('Strategy')}`}>psychology</span>
          </div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">Strategy</span>
        </div>
        <div ref={tailoringRef} className="flex flex-col items-center z-10 gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors duration-300 ${getStageClass('Tailoring')}`}>
            <span className={`material-symbols-outlined ${getIconClass('Tailoring')}`}>architecture</span>
          </div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">Tailoring</span>
        </div>
        <div ref={submissionRef} className="flex flex-col items-center z-10 gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors duration-300 ${getStageClass('Submission')}`}>
            <span className={`material-symbols-outlined ${getIconClass('Submission')}`}>send</span>
          </div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">Submission</span>
        </div>

        {/* Animated Beams */}
        <AnimatedBeam containerRef={containerRef} fromRef={personaRef} toRef={ingestionRef} curvature={-20} />
        <AnimatedBeam containerRef={containerRef} fromRef={ingestionRef} toRef={strategyRef} curvature={20} />
        <AnimatedBeam containerRef={containerRef} fromRef={strategyRef} toRef={tailoringRef} curvature={-20} />
        <AnimatedBeam containerRef={containerRef} fromRef={tailoringRef} toRef={submissionRef} curvature={20} />
      </div>
    </section>
  );
}
