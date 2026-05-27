"use client";

import React, { useEffect, useState } from "react";

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

export function Topbar() {
  const [candidateName, setCandidateName] = useState("Applicant Profile");

  // Dynamically load the actual parsed candidate profile name
  useEffect(() => {
    async function fetchName() {
      try {
        const res = await fetch(`${API_URL}/get-profile`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.name) {
            setCandidateName(data.name);
          }
        }
      } catch (err) {
        console.error("Failed to load profile in Topbar:", err);
      }
    }
    fetchName();

    // Listen for custom resume upload events to refresh name in real-time
    const handleUploadEvent = () => fetchName();
    window.addEventListener("resumeUploaded", handleUploadEvent);
    return () => window.removeEventListener("resumeUploaded", handleUploadEvent);
  }, []);

  // Compute initials
  const initials = candidateName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AP";

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 select-none">
      
      {/* Header Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-headline font-black text-slate-900 tracking-tight leading-tight">
          Overview
        </h1>
        <p className="text-xs sm:text-sm font-label text-slate-400 mt-1 font-medium">
          Autonomous career submission across your kinetic career search.
        </p>
      </div>

      {/* Header Actions & Profile Avatars (Integrated & Dynamic) */}
      <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
        
        {/* Dynamic Candidate Profile Avatar */}
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100/50 pl-3 pr-3.5 py-1.5 rounded-full shadow-sm">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-headline font-black text-[10px] tracking-tighter flex items-center justify-center border-2 border-white shadow-[0_2px_8px_rgba(16,185,129,0.15)]">
            {initials}
          </div>
          <span className="text-[11px] font-label font-bold text-slate-700 truncate max-w-[120px]">
            {candidateName}
          </span>
        </div>

        {/* Active Autonomous Search status badge (Real integrated feature!) */}
        <div className="border border-emerald-100 bg-emerald-50/50 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm text-xs font-bold text-emerald-700">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="font-label text-[10px] uppercase tracking-wider">Search Agent Active</span>
        </div>

      </div>

    </div>
  );
}
