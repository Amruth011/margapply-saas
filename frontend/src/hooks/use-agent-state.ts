"use client";

import { useEffect, useState } from "react";

export interface SuggestedRole {
  title: string;
  company: string;
  score: number;
}

export interface AgentState {
  pipelineStage: "Ingestion" | "Strategy" | "Tailoring" | "Submission";
  status?: string;
  jobsHunted: number;
  matchScore: number;
  applicationSuccess: number;
  suggested_roles?: SuggestedRole[];
}

export function useAgentState() {
  const [state, setState] = useState<AgentState>({
    pipelineStage: "Ingestion",
    jobsHunted: 42,
    matchScore: 85,
    applicationSuccess: 12,
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/agent-state");

    ws.onopen = () => {
      setIsConnected(true);
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

    return () => {
      ws.close();
    };
  }, []);

  return { state, isConnected };
}
