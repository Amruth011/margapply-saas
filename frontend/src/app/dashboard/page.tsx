import React from "react";
import { PipelineVisualizer } from "@/components/dashboard/pipeline-visualizer";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { LedgerTable } from "@/components/dashboard/ledger-table";
import { StrategyGate } from "@/components/dashboard/strategy-gate";
import { ResumeUploader } from "@/components/upload/resume-uploader";
import { Topbar } from "@/components/dashboard/topbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TrendGraph } from "@/components/dashboard/trend-graph";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <>
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
      
      <div className="bg-slate-50 min-h-screen p-8 flex flex-col pb-20 md:pb-0 md:pl-64 text-slate-900 font-sans">
        <Topbar />
        <Sidebar />

        {/* Main Content Canvas */}
        <main className="flex-grow p-4 md:p-8 max-w-screen-xl mx-auto w-full">
          <ResumeUploader />
          <PipelineVisualizer />
          <StatsGrid />
          <TrendGraph />
          <LedgerTable />
        </main>

        {/* Modal Gates */}
        <StrategyGate />

        {/* Footer */}
        <footer className="w-full py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto border-t border-outline-variant bg-background/50 backdrop-blur-sm mt-8">
          <p className="font-label text-xs text-on-surface-variant">© 2026 RecruitAI Systems. All rights reserved.</p>
          <div className="flex gap-2">
            <Button variant="link" className="font-label text-xs text-on-surface-variant hover:text-primary h-auto p-2">Support</Button>
            <Button variant="link" className="font-label text-xs text-on-surface-variant hover:text-primary h-auto p-2">Privacy Policy</Button>
            <Button variant="link" className="font-label text-xs text-on-surface-variant hover:text-primary h-auto p-2">API Docs</Button>
          </div>
        </footer>

        {/* BottomNavBar (Mobile Only) */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-outline-variant flex justify-around items-center h-16 px-4 z-50">
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-primary h-auto p-2 rounded-xl">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="text-[10px] font-label font-bold">Dashboard</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-on-surface-variant h-auto p-2 rounded-xl">
            <span className="material-symbols-outlined">work</span>
            <span className="text-[10px] font-label">Apps</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-on-surface-variant h-auto p-2 rounded-xl">
            <span className="material-symbols-outlined">bolt</span>
            <span className="text-[10px] font-label">Strategy</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-on-surface-variant h-auto p-2 rounded-xl">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-[10px] font-label">Insights</span>
          </Button>
        </div>
      </div>
    </>
  );
}
