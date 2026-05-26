"use client";

import React, { useState } from "react";
import { useAgentState } from "@/hooks/use-agent-state";

export function StrategyGate() {
  const { state } = useAgentState();
  const [isApproving, setIsApproving] = useState(false);

  if (state.pipelineStage !== "Strategy" || state.status !== "Awaiting_Approval") {
    return null;
  }

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await fetch("http://localhost:8000/approve-strategy", { method: "POST" });
    } catch (e) {
      console.error("Failed to approve strategy:", e);
    }
    setIsApproving(false);
  };

  const handleReject = () => {
    // For MVP, rejecting just proceeds or you can implement logic to resample
    handleApprove();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-headline font-bold text-slate-900">Strategy Gate: Review Suggested Roles</h2>
          <p className="text-sm text-slate-500 font-label mt-1">
            The agent has analyzed your profile and found these matches. Please approve to continue to Tailoring.
          </p>
        </div>
        
        <div className="p-6 flex flex-col gap-3">
          {state.suggested_roles?.map((role, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 font-body">{role.title}</span>
                <span className="text-sm text-slate-500 font-label">{role.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-primary">{role.score}% Match</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={handleReject}
            disabled={isApproving}
            className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Reject All
          </button>
          <button 
            onClick={handleApprove}
            disabled={isApproving}
            className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-sm transition-colors"
          >
            {isApproving ? "Approving..." : "Approve Strategy"}
          </button>
        </div>
      </div>
    </div>
  );
}
