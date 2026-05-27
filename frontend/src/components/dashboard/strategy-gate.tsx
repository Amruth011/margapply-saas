"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAgentState, type SuggestedRole } from "@/hooks/use-agent-state";
import { Button } from "@/components/ui/button";

const getApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL;

  // Self-healing: if running on Vercel but env variable is dead/missing, fallback to active Railway domain
  if (typeof window !== "undefined") {
    const isVercel = window.location.hostname.includes("vercel.app");
    if (isVercel) {
      if (!url || url.includes("localhost") || url.includes("margapply.com")) {
        url = "https://margapply-saas-production.up.railway.app";
      }
    }
  }

  if (!url) {
    url = "http://localhost:8000";
  }

  return url.endsWith("/") ? url.slice(0, -1) : url;
};
const API_URL = getApiUrl();

// ── Inline Toast ──────────────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}

function SubmissionToast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-[200] flex items-start gap-3 px-5 py-4
        rounded-xl shadow-2xl border max-w-sm w-full
        animate-in slide-in-from-bottom-4 fade-in duration-300
        ${type === "success"
          ? "bg-white border-emerald-200"
          : "bg-white border-red-200"}
      `}
    >
      <div
        className={`
          mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0
          ${type === "success" ? "bg-emerald-100" : "bg-red-100"}
        `}
      >
        <span
          className={`material-symbols-outlined text-base ${
            type === "success" ? "text-emerald-650" : "text-red-500"
          }`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {type === "success" ? "check_circle" : "error"}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm">
          {type === "success" ? "Application Submitted!" : "Submission Failed"}
        </p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{message}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDismiss}
        className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors mt-0.5 h-6 w-6"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </Button>
    </div>
  );
}

// ── Role Card ─────────────────────────────────────────────────────────────────
interface RoleCardProps {
  role: SuggestedRole;
  index: number;
  isSelected: boolean;
  isSubmitting: boolean;
  onSelect: (role: SuggestedRole) => void;
}

function RoleCard({ role, index, isSelected, isSubmitting, onSelect }: RoleCardProps) {
  const scoreColor =
    role.score >= 90 ? "text-emerald-650 bg-emerald-50 border-emerald-200" :
    role.score >= 80 ? "text-emerald-700 bg-emerald-50/50 border-emerald-150" :
                       "text-amber-600 bg-amber-50 border-amber-200";

  const initials = role.company
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      onClick={() => !isSubmitting && onSelect(role)}
      disabled={isSubmitting}
      className={`
        w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left
        transition-all duration-200 group
        ${isSelected
          ? "border-emerald-500 bg-emerald-50/40 shadow-sm shadow-emerald-100"
          : "border-slate-100 bg-slate-50/40 hover:border-slate-350 hover:bg-slate-50"}
        ${isSubmitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {/* Company avatar */}
      <div
        className={`
          w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0
          transition-colors duration-200
          ${isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"}
        `}
      >
        {initials}
      </div>

      {/* Title + company */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm truncate">{role.title}</p>
        <p className="text-xs text-slate-500 truncate">{role.company}</p>
      </div>

      {/* Score + selection indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${scoreColor}`}>
          {role.score}%
        </span>
        <span
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center
            transition-all duration-200
            ${isSelected
              ? "border-emerald-500 bg-emerald-500"
              : "border-slate-300 bg-white"}
          `}
        >
          {isSelected && (
            <span className="material-symbols-outlined text-white" style={{ fontSize: "12px", fontVariationSettings: "'FILL' 1" }}>
              check
            </span>
          )}
        </span>
      </div>
    </button>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ── Strategy Gate Modal ───────────────────────────────────────────────────────
export function StrategyGate() {
  const { state } = useAgentState();
  const [selectedRole, setSelectedRole] = useState<SuggestedRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [visible, setVisible] = useState(false);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (state.pipelineStage === "Strategy" && state.status === "Awaiting_Approval") {
      setTimeout(() => {
        setVisible(true);
        hasSubmittedRef.current = false;
        if (state.suggested_roles && state.suggested_roles.length > 0 && !selectedRole) {
          setSelectedRole(state.suggested_roles[0]);
        }
      }, 0);
    }
  }, [state.pipelineStage, state.status, state.suggested_roles, selectedRole]);

  useEffect(() => {
    if (
      (state.status === "Submitted" || state.status === "SubmissionFailed") &&
      state.submission_result &&
      !hasSubmittedRef.current
    ) {
      hasSubmittedRef.current = true;
      setIsSubmitting(false);
      const res = state.submission_result;
      if (res.success) {
        setTimeout(() => {
          setToast({
            type: "success",
            message: `${res.role} @ ${res.company} — application sent successfully.`,
          });
        }, 0);
      } else {
        setTimeout(() => {
          setToast({
            type: "error",
            message: `Could not submit ${res.role} @ ${res.company}. The pipeline will retry on next cycle.`,
          });
        }, 0);
      }
      setTimeout(() => setVisible(false), 800);
    }
  }, [state.status, state.submission_result]);

  const handleApprove = async () => {
    if (!selectedRole || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/submit-application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected_role: selectedRole }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      console.error("Submit failed:", e);
      setIsSubmitting(false);
      setToast({ type: "error", message: "Could not reach the backend. Is the server running?" });
    }
  };

  const handleReject = async () => {
    if (isSubmitting) return;
    try {
      await fetch(`${API_URL}/approve-strategy`, { method: "POST" });
    } catch (e) {
      console.error("Reject failed:", e);
    }
    setVisible(false);
  };

  if (!visible || state.pipelineStage !== "Strategy") {
    return toast ? (
      <SubmissionToast
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast(null)}
      />
    ) : null;
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 select-none">

          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-105">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  psychology
                </span>
              </div>
              <h2 className="text-lg font-headline font-bold text-slate-900">Strategy Gate</h2>
            </div>
            <p className="text-sm text-slate-400 font-label ml-11 mt-0.5">
              Select a role to target — the agent will submit your application automatically.
            </p>
          </div>

          {/* Lumina JD Context Panel */}
          {state.jd_title && (
            <div className="px-6 pt-4 pb-3 bg-emerald-50/40 border-b border-emerald-100/50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-label font-bold uppercase tracking-widest text-emerald-600 mb-0.5">
                    Analysed JD
                  </p>
                  <p className="font-bold text-slate-900 text-base leading-tight">{state.jd_title}</p>
                  {state.jd_company && (
                    <p className="text-sm text-slate-400 font-label mt-0.5">{state.jd_company}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {state.jd_grade_score !== undefined && (
                    <span className="text-sm font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-full shadow-sm shadow-emerald-100">
                      {state.jd_grade_score}/100
                    </span>
                  )}
                  {state.jd_source && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded font-label uppercase tracking-widest ${
                      state.jd_source === "llm"
                        ? "bg-emerald-50 border border-emerald-250 text-emerald-700"
                        : state.jd_source === "heuristic"
                        ? "bg-amber-50 border border-amber-250 text-amber-700"
                        : "bg-red-50 border border-red-250 text-red-700"
                    }`}>
                      {state.jd_source === "llm" ? "✦ LLM Parse" : state.jd_source === "heuristic" ? "⚡ Heuristic" : "✕ Error"}
                    </span>
                  )}
                </div>
              </div>
              {state.jd_skills && state.jd_skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {state.jd_skills.slice(0, 8).map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-label font-bold bg-white text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-full shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Role cards */}
          <div className="p-5 flex flex-col gap-2.5">
            <p className="text-[10px] font-label font-bold uppercase tracking-widest text-slate-400 mb-1">
              Select role to apply
            </p>
            {state.suggested_roles?.map((role, idx) => (
              <RoleCard
                key={idx}
                role={role}
                index={idx}
                isSelected={selectedRole?.title === role.title && selectedRole?.company === role.company}
                isSubmitting={isSubmitting}
                onSelect={setSelectedRole}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={handleReject}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold text-slate-400"
            >
              Skip
            </Button>

            <Button
              id="approve-strategy-btn"
              onClick={handleApprove}
              disabled={!selectedRole || isSubmitting}
              className={`
                flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-sm
                ${!selectedRole || isSubmitting
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-emerald-100"}
              `}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <span>Submitting…</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    send
                  </span>
                  <span>Submit Application</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {toast && (
        <SubmissionToast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
}
