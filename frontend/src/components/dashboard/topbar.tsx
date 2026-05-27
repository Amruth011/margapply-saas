"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function Topbar() {
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

      {/* Header Actions & Profile Avatars */}
      <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
        
        {/* Avatar Stack */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-100/50 pl-3 pr-2 py-1.5 rounded-full shadow-sm">
          <div className="flex -space-x-2">
            <img 
              className="w-7 h-7 rounded-full border-2 border-white object-cover" 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
              alt="Candidate 1"
            />
            <img 
              className="w-7 h-7 rounded-full border-2 border-white object-cover" 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" 
              alt="Candidate 2"
            />
            <img 
              className="w-7 h-7 rounded-full border-2 border-white object-cover" 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" 
              alt="Candidate 3"
            />
          </div>
          <span className="text-[10px] font-label font-black text-slate-400 pl-1.5">
            +12
          </span>
        </div>

        {/* Date Filter Dropdown */}
        <div className="border border-slate-100 bg-white hover:bg-slate-50 rounded-xl px-3.5 py-2 flex items-center gap-2 cursor-pointer shadow-sm transition-all select-none">
          <span className="material-symbols-outlined text-slate-400 text-sm">calendar_today</span>
          <span className="font-label text-xs font-bold text-slate-700">Last 30 Days</span>
          <span className="material-symbols-outlined text-slate-400 text-xs">keyboard_arrow_down</span>
        </div>

      </div>

    </div>
  );
}
