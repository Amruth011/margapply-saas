"use client";

import React from "react";
import { useAgentState } from "@/hooks/use-agent-state";
import { Button } from "@/components/ui/button";

interface Agent {
  name: string;
  role: string;
  iconBg: string;
  icon: string;
  stages: string[];
  runningLabel: string;
  runningColor: string;
  dotColor: string;
}

const AGENTS: Agent[] = [
  {
    name: "Ingester-9",
    role: "Resume & JD Forensics",
    iconBg: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    icon: "psychology",
    stages: ["Persona", "Ingestion"],
    runningLabel: "RUNNING",
    runningColor: "text-emerald-600",
    dotColor: "bg-emerald-500",
  },
  {
    name: "Strategist-Prime",
    role: "Fit Mapping & Match Grading",
    iconBg: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    icon: "hub",
    stages: ["Strategy"],
    runningLabel: "OPTIMIZING",
    runningColor: "text-amber-600",
    dotColor: "bg-amber-500",
  },
  {
    name: "Tailor-X",
    role: "Document Customization",
    iconBg: "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20",
    icon: "architecture",
    stages: ["Tailoring"],
    runningLabel: "TAILORING",
    runningColor: "text-indigo-600",
    dotColor: "bg-indigo-500",
  },
  {
    name: "Submitter-Pro",
    role: "Autonomous Application",
    iconBg: "bg-rose-500/10 text-rose-600 border border-rose-500/20",
    icon: "send",
    stages: ["Submission"],
    runningLabel: "SUBMITTING",
    runningColor: "text-rose-600",
    dotColor: "bg-rose-500",
  },
];

export function ActiveAgents() {
  const { state } = useAgentState();
  const activeStage = state.pipelineStage;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-slate-900 text-base">Active Agents</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-lg">more_horiz</span>
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {AGENTS.map((agent) => {
            const isCurrentlyRunning = agent.stages.includes(activeStage);
            const isPast = AGENTS.findIndex(a => a.stages.includes(activeStage)) > AGENTS.findIndex(a => a.name === agent.name);
            
            let statusText = "IDLE";
            let statusDotClass = "bg-slate-350";
            let statusColorClass = "text-slate-400";

            if (isCurrentlyRunning) {
              statusText = agent.runningLabel;
              statusDotClass = agent.dotColor + " animate-pulse";
              statusColorClass = agent.runningColor + " font-bold";
            } else if (isPast) {
              statusText = "COMPLETED";
              statusDotClass = "bg-emerald-400";
              statusColorClass = "text-emerald-600 font-medium";
            }

            return (
              <div 
                key={agent.name} 
                className={`flex justify-between items-center p-3 rounded-xl border border-transparent transition-all duration-200 ${
                  isCurrentlyRunning ? "bg-slate-50 border-slate-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${agent.iconBg}`}>
                    <span className="material-symbols-outlined text-lg">{agent.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{agent.name}</h4>
                    <p className="text-[11px] text-slate-400 font-label">{agent.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`w-2 h-2 rounded-full ${statusDotClass}`}></span>
                  <span className={`text-[10px] font-label font-bold tracking-wider uppercase ${statusColorClass}`}>
                    {statusText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <Button 
          variant="outline" 
          className="w-full h-11 border-dashed border-slate-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/20 text-slate-500 rounded-xl text-xs font-bold transition-all"
        >
          View All Agents
        </Button>
      </div>
    </div>
  );
}
