"use client";

import { useEffect, useState } from "react";

export interface SuggestedRole {
  title: string;
  company: string;
  score: number;
}

export interface LedgerEntry {
  id: string;
  title: string;
  company: string;
  /** "Applied" | "Interviewing" | "Reviewing" | "Failed" | "Discovered" */
  status: string;
  score: number;
  timestamp: string;
  url?: string;
}

export interface SubmissionResult {
  success: boolean;
  role: string;
  company: string;
  timestamp: string;
  url: string;
}

export interface AgentState {
  pipelineStage: "Persona" | "Ingestion" | "Strategy" | "Tailoring" | "Submission";

  status?: string;
  jobsHunted: number;
  matchScore: number;
  applicationSuccess: number;
  suggested_roles?: SuggestedRole[];

  // ── Lumina JD Ingestion Fields ──────────────────────────────────────────
  /** Exact job title extracted by Lumina (e.g. "Senior AI Engineer") */
  jd_title?: string;
  /** Company name extracted by Lumina (e.g. "Anthropic") */
  jd_company?: string;
  /** Top technical skills as plain strings */
  jd_skills?: string[];
  /** Lumina's JD quality grade score (0-100) */
  jd_grade_score?: number;
  /** Resume keywords suggested by Lumina */
  jd_keywords?: string[];
  /** "llm" | "heuristic" | "error" — which path produced the result */
  jd_source?: string;
  /** Full raw Lumina DecodeResult for downstream pipeline nodes */
  jd_raw?: Record<string, unknown>;

  // ── Execution / Submission Fields ──────────────────────────────────────
  /** The role the user approved in the StrategyGate */
  selected_role?: SuggestedRole;
  /** Outcome of the Playwright submission run */
  submission_result?: SubmissionResult;
  /** Live application ledger — newest first */
  application_ledger?: LedgerEntry[];
}

export function useAgentState() {
  const [state, setState] = useState<AgentState>({
    pipelineStage: "Persona",
    jobsHunted: 42,
    matchScore: 85,
    applicationSuccess: 12,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [wsInstance, setWsInstance] = useState<WebSocket | null>(null);

  const startAnalysis = (jdInput: string) => {
    if (wsInstance) {
      try {
        wsInstance.close();
      } catch (e) {
        console.error("Error closing previous ws", e);
      }
    }
    const ws = new WebSocket("ws://localhost:8000/ws/agent-state");
    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({ jd_input: jdInput }));
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setState(data);
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };
    ws.onclose = () => {
      setIsConnected(false);
    };
    setWsInstance(ws);
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/agent-state");

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({}));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setState(data);
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    setWsInstance(ws);

    return () => {
      ws.close();
    };
  }, []);

  return { state, isConnected, startAnalysis };
}
