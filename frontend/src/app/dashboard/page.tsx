"use client";

import React, { useState, useEffect } from "react";
import { PipelineVisualizer } from "@/components/dashboard/pipeline-visualizer";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { LedgerTable } from "@/components/dashboard/ledger-table";
import { StrategyGate } from "@/components/dashboard/strategy-gate";
import { ResumeUploader } from "@/components/upload/resume-uploader";
import { Topbar } from "@/components/dashboard/topbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TrendGraph } from "@/components/dashboard/trend-graph";
import { ActiveAgents } from "@/components/dashboard/active-agents";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [activeMobileTab, setActiveMobileTab] = useState("overview");

  // Synchronize mobile bottom nav active item on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "overview-section", name: "overview" },
        { id: "resume-section", name: "resume" },
        { id: "analytics-section", name: "analytics" },
        { id: "applications-section", name: "applications" },
      ];

      const scrollPos = window.scrollY + 150; // offset

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveMobileTab(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileTabClick = (tabName: string, sectionId: string) => {
    setActiveMobileTab(tabName);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .animated-beam-path {
            strokeDasharray: 10;
            animation: dash 20s linear infinite;
        }
        @keyframes dash {
            to {
                strokeDashoffset: -1000;
            }
        }
        .bento-card {
            transition: transform 0.2s ease-in-out;
        }
        .bento-card:active {
            transform: scale(0.98);
        }
      `}} />
      
      {/* Premium Outer Organic Background Frame */}
      <div id="overview-section" className="bg-[#f0f4f1] min-h-screen w-full relative flex items-center justify-center p-0 md:p-6 lg:p-8 overflow-hidden font-sans select-none">
        
        {/* Animated Natural Gradients Background Blobs */}
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none animate-pulse duration-5000"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-lime-200/30 blur-3xl pointer-events-none animate-pulse duration-7000"></div>
        <div className="absolute top-[40%] left-[25%] w-80 h-80 rounded-full bg-amber-100/35 blur-3xl pointer-events-none"></div>

        {/* Floating App Canvas */}
        <div className="w-full max-w-[1400px] min-h-[90vh] bg-white/95 rounded-[32px] border border-white/60 shadow-[0_25px_60px_rgba(0,0,0,0.06)] flex flex-col md:flex-row relative overflow-hidden backdrop-blur-md z-10">
          
          {/* Main Sidebar Wrapper */}
          <Sidebar />

          {/* Main Content Canvas Scroll Area */}
          <div className="flex-grow flex flex-col md:pl-64 min-h-full">
            
            {/* Topbar Navigation Header inside Canvas */}
            <div className="px-6 md:px-10 pt-8 pb-4">
              <Topbar />
            </div>

            {/* Content Body */}
            <main className="flex-grow px-6 md:px-10 pb-10 w-full max-w-full">
              
              {/* LangGraph Node progress tracker visualizer - Prominently at the top spanning full dashboard width! */}
              <div className="mb-8">
                <PipelineVisualizer />
              </div>

              {/* Two Column Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Columns (2/3 size): Resume upload, banner, stats, graphs, table */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                  
                  {/* Resume Uploader / Candidate Persona Card */}
                  <div id="resume-section">
                    <ResumeUploader />
                  </div>

                  {/* Stunning Green Gradient Performance Banner */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#bbf7d0] via-[#86efac] to-[#d9f99d] p-8 shadow-[0_4px_20px_rgba(34,197,94,0.05)] border border-emerald-200/20 flex flex-col justify-between min-h-[220px]">
                    <div className="absolute -right-16 -bottom-16 w-64 h-64 opacity-[0.08] pointer-events-none flex items-center justify-center">
                      <span className="material-symbols-outlined text-[280px] text-emerald-950 font-light animate-spin" style={{ animationDuration: '40s' }}>
                        spa
                      </span>
                    </div>

                    <div className="relative z-10 flex flex-col items-start">
                      <span className="text-[10px] font-label font-black tracking-widest text-emerald-900 bg-emerald-950/10 px-2.5 py-1 rounded-full uppercase">
                        Automation Logic
                      </span>
                      <h2 className="text-xl md:text-2xl font-headline font-black text-emerald-950 mt-4 max-w-md leading-tight">
                        Cognitive Submission Performance
                      </h2>
                      <p className="text-xs md:text-sm text-emerald-900/75 font-medium max-w-xl mt-2 leading-relaxed">
                        Our agents are currently scanning, matching, and tailoring target applications in your career pipeline.
                      </p>
                    </div>
                    
                    <div className="relative z-10 mt-6 pt-4 border-t border-emerald-950/10 flex items-center">
                      <span className="text-xs font-bold text-emerald-950 bg-white/60 px-3 py-1 rounded-full shadow-sm">
                        Expected Match Rate: <strong className="text-emerald-900 font-black">88%+</strong>
                      </span>
                    </div>
                  </div>

                  {/* Wrapper for Insights & Velocity (Stats + Chart) */}
                  <div id="analytics-section" className="flex flex-col gap-8 scroll-mt-6">
                    {/* Core Stats Bento Cards */}
                    <StatsGrid />
                    {/* Trend Velocity Chart */}
                    <TrendGraph />
                  </div>

                  {/* Application History Table */}
                  <div id="applications-section">
                    <LedgerTable />
                  </div>

                </div>

                {/* Right Columns (1/3 size): Subagents running card list */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                  
                  {/* Active Subagents Card List */}
                  <ActiveAgents />

                </div>

              </div>

            </main>

            {/* Modern Inside Canvas Footer */}
            <footer className="w-full py-6 px-10 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto border-t border-slate-100 bg-slate-50/40 backdrop-blur-sm">
              <p className="font-label text-xs text-slate-400">© 2026 MargApply Systems. All rights reserved.</p>
              <div className="flex gap-2">
                <Button variant="link" className="font-label text-xs text-slate-400 hover:text-emerald-600 h-auto p-2 no-underline">Support</Button>
                <Button variant="link" className="font-label text-xs text-slate-400 hover:text-emerald-600 h-auto p-2 no-underline">Privacy Policy</Button>
                <Button variant="link" className="font-label text-xs text-slate-400 hover:text-emerald-600 h-auto p-2 no-underline">API Docs</Button>
              </div>
            </footer>

          </div>

        </div>

        {/* Modal Gates */}
        <StrategyGate />

        {/* Mobile Bottom Navigation Bar (Fully Functional & Linked!) */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-150 flex justify-around items-center h-16 px-4 z-50">
          
          <Button 
            variant="ghost" 
            onClick={() => handleMobileTabClick("overview", "overview-section")}
            className={`flex flex-col items-center gap-1 h-auto p-2 rounded-xl ${
              activeMobileTab === "overview" ? "text-emerald-600 font-bold" : "text-slate-450"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeMobileTab === "overview" ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
            <span className="text-[10px] font-label">Overview</span>
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => handleMobileTabClick("resume", "resume-section")}
            className={`flex flex-col items-center gap-1 h-auto p-2 rounded-xl ${
              activeMobileTab === "resume" ? "text-emerald-600 font-bold" : "text-slate-450"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeMobileTab === "resume" ? "'FILL' 1" : "'FILL' 0" }}>account_circle</span>
            <span className="text-[10px] font-label">Resume</span>
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => handleMobileTabClick("analytics", "analytics-section")}
            className={`flex flex-col items-center gap-1 h-auto p-2 rounded-xl ${
              activeMobileTab === "analytics" ? "text-emerald-600 font-bold" : "text-slate-450"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeMobileTab === "analytics" ? "'FILL' 1" : "'FILL' 0" }}>analytics</span>
            <span className="text-[10px] font-label">Insights</span>
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => handleMobileTabClick("applications", "applications-section")}
            className={`flex flex-col items-center gap-1 h-auto p-2 rounded-xl ${
              activeMobileTab === "applications" ? "text-emerald-600 font-bold" : "text-slate-450"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeMobileTab === "applications" ? "'FILL' 1" : "'FILL' 0" }}>assignment_turned_in</span>
            <span className="text-[10px] font-label">Ledger</span>
          </Button>

        </div>

      </div>
    </>
  );
}
