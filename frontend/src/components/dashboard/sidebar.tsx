"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 hidden md:flex flex-col z-40 h-screen w-64 bg-white border-r border-slate-100 p-6 justify-between select-none">
      
      {/* Top Brand & Workspace */}
      <div className="flex flex-col gap-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.2)]">
            <span className="material-symbols-outlined text-white text-lg font-black" style={{ fontVariationSettings: "'wght' 700" }}>
              spa
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

        {/* Navigation Menu */}
        <div className="flex flex-col gap-1 mt-4">
          <Button 
            variant="secondary" 
            className="w-full justify-start gap-3 h-11 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100/30 hover:bg-emerald-100/40 shadow-sm"
          >
            <span className="material-symbols-outlined text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard
            </span>
            <span className="font-label text-[13px] font-bold">Overview</span>
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-11 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <span className="material-symbols-outlined text-slate-400">robot</span>
            <span className="font-label text-[13px] font-medium">Agents</span>
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-11 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <span className="material-symbols-outlined text-slate-400">analytics</span>
            <span className="font-label text-[13px] font-medium">Analytics</span>
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-11 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <span className="material-symbols-outlined text-slate-400">integration_instructions</span>
            <span className="font-label text-[13px] font-medium">Integrations</span>
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-11 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <span className="material-symbols-outlined text-slate-400">settings</span>
            <span className="font-label text-[13px] font-medium">Settings</span>
          </Button>
        </div>
      </div>

      {/* Bottom Actions & Links */}
      <div className="flex flex-col gap-4">
        
        {/* Deploy New Agent Premium Button */}
        <Button 
          id="deploy-agent-btn"
          className="w-full h-12 bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300 text-emerald-950 font-bold hover:shadow-lg shadow-sm rounded-xl transition-all duration-300 hover:scale-[1.02] border-none flex items-center justify-center gap-2 cursor-pointer shadow-emerald-200/50"
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            sparkles
          </span>
          <span className="font-headline font-bold text-xs tracking-wide">Deploy New Agent</span>
        </Button>

        {/* Footer Support/LogOut Links */}
        <div className="flex flex-col gap-1 border-t border-slate-100 pt-4 px-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-9 px-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-base">help</span>
            <span className="font-label text-xs">Help Center</span>
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-9 px-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span className="font-label text-xs">Log Out</span>
          </Button>
        </div>

      </div>

    </nav>
  );
}
