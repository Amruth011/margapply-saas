"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState("overview");

  // Synchronize active navigation item on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "overview-section", name: "overview" },
        { id: "resume-section", name: "resume" },
        { id: "analytics-section", name: "analytics" },
        { id: "applications-section", name: "applications" },
      ];

      const scrollPos = window.scrollY + 120; // offset

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (tabName: string, sectionId: string) => {
    setActiveTab(tabName);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Connected Action: Deploy New Agent triggers the resume uploader input file browser!
  const handleDeployClick = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const getButtonClass = (tabName: string) => {
    return activeTab === tabName
      ? "w-full justify-start gap-3 h-11 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100/30 hover:bg-emerald-100/40 shadow-sm font-bold"
      : "w-full justify-start gap-3 h-11 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all font-medium";
  };

  const getIconStyle = (tabName: string) => {
    return activeTab === tabName ? "'FILL' 1" : "'FILL' 0";
  };

  return (
    <nav className="fixed left-0 top-0 hidden md:flex flex-col z-40 h-screen w-64 bg-white border-r border-slate-100 p-6 justify-between select-none">
      
      {/* Top Brand & Workspace */}
      <div className="flex flex-col gap-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.2)] select-none">
            <span className="font-headline font-black text-white text-sm tracking-tighter">
              MA
            </span>
          </div>
          <div>
            <h2 className="font-headline font-black text-slate-900 text-lg tracking-tight flex items-center gap-1.5 leading-none">
              MARGAPPLY
            </h2>
            <span className="text-[9px] font-label font-bold text-emerald-600 tracking-widest uppercase block mt-0.5">
              AUTONOMOUS
            </span>
          </div>
        </div>

        {/* Workspace Dropdown */}
        <div className="flex flex-col gap-1.5 mt-2 px-1">
          <span className="text-[10px] font-label font-bold uppercase tracking-widest text-slate-400">
            Workspace
          </span>
          <div className="w-full border border-slate-100 bg-slate-50/50 hover:bg-slate-50 rounded-xl px-3 py-2.5 flex items-center justify-between cursor-pointer transition-all">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-lg">work</span>
              <span className="font-label text-xs font-bold text-slate-700">Tech Career</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-sm">unfold_more</span>
          </div>
        </div>

        {/* Navigation Menu (Decluttered & Fully Functional) */}
        <div className="flex flex-col gap-1 mt-4">
          
          <Button 
            variant="ghost"
            onClick={() => handleTabClick("overview", "overview-section")}
            className={getButtonClass("overview")}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: getIconStyle("overview") }}>
              dashboard
            </span>
            <span className="font-label text-[13px]">Overview</span>
          </Button>

          <Button 
            variant="ghost"
            onClick={() => handleTabClick("resume", "resume-section")}
            className={getButtonClass("resume")}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: getIconStyle("resume") }}>
              account_circle
            </span>
            <span className="font-label text-[13px]">Resume & Persona</span>
          </Button>

          <Button 
            variant="ghost"
            onClick={() => handleTabClick("analytics", "analytics-section")}
            className={getButtonClass("analytics")}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: getIconStyle("analytics") }}>
              analytics
            </span>
            <span className="font-label text-[13px]">Insights & Velocity</span>
          </Button>

          <Button 
            variant="ghost"
            onClick={() => handleTabClick("applications", "applications-section")}
            className={getButtonClass("applications")}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: getIconStyle("applications") }}>
              assignment_turned_in
            </span>
            <span className="font-label text-[13px]">Applications Ledger</span>
          </Button>

        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-4">
        
        {/* Deploy New Agent Premium Button (Triggers file upload browser!) */}
        <Button 
          id="deploy-agent-btn"
          onClick={handleDeployClick}
          className="w-full h-12 bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300 text-emerald-950 font-bold hover:shadow-lg shadow-sm rounded-xl transition-all duration-300 hover:scale-[1.02] border-none flex items-center justify-center gap-2 cursor-pointer shadow-emerald-200/50"
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span className="font-headline font-bold text-xs tracking-wide">Deploy New Agent</span>
        </Button>

      </div>

    </nav>
  );
}
