import React from "react";
import { PipelineVisualizer } from "@/components/dashboard/pipeline-visualizer";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { LedgerTable } from "@/components/dashboard/ledger-table";
import { StrategyGate } from "@/components/dashboard/strategy-gate";

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
        {/* TopAppBar */}
        <header className="bg-background dark:bg-background w-full top-0 sticky border-b border-outline-variant dark:border-outline-variant z-50">
          <div className="flex justify-between items-center px-6 h-16 w-full max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">terminal</span>
              <h1 className="text-xl font-headline font-black tracking-tight text-on-surface dark:text-on-surface">RecruitAI</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-6 items-center">
                <span className="font-body text-primary dark:text-primary-fixed-dim font-bold border-b-2 border-primary cursor-pointer">Dashboard</span>
                <span className="font-body text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer px-2 py-1 rounded">Applications</span>
                <span className="font-body text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer px-2 py-1 rounded">Strategy</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-outline-variant">
                <img alt="User profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoN8kcUzXBDcdNFyUGqEQbd8lnMHXl-ZLXq-MQs0MVIahPjKRYJV3At9rBbiywKQWaINAaCb3WbriNOsWJmP07_mtmLnnfsgPZ2EEpzOVpcZ4K3w8FG1DvrVJQJqYlopz1PsUuI52juLy9MKwHpaUfrsvW22wSWXMRpw9h7c0-GdUwcnjfPVIesovW07jXkOhXD4h53WVnkw4yVxCo0HMgOdKjhwucFZWF6dW6pji0cRaRIGCso8ZY2oMhHQR87Ww6hYowU6iIEjJF"/>
              </div>
            </div>
          </div>
        </header>

        {/* NavigationDrawer (Sidebar for Desktop) */}
        <nav className="fixed left-0 top-0 hidden lg:flex flex-col z-40 h-screen w-64 rounded-r-xl bg-surface-container-low dark:bg-surface-container-low border-r border-outline-variant dark:border-outline-variant pt-20">
          <div className="px-6 mb-8">
            <h2 className="font-headline font-bold text-lg text-primary">Recruitment Hub</h2>
          </div>
          <div className="flex flex-col gap-1">
            <a className="bg-secondary-container dark:bg-secondary-container text-on-secondary-container dark:text-on-secondary-container rounded-lg mx-2 my-1 px-4 py-3 flex items-center gap-3 active:scale-95 duration-100" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label text-sm">Dashboard</span>
            </a>
            <a className="text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high rounded-lg mx-2 my-1 px-4 py-3 flex items-center gap-3 transition-all active:scale-95 duration-100" href="#">
              <span className="material-symbols-outlined">work</span>
              <span className="font-label text-sm">Applications</span>
            </a>
            <a className="text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high rounded-lg mx-2 my-1 px-4 py-3 flex items-center gap-3 transition-all active:scale-95 duration-100" href="#">
              <span className="material-symbols-outlined">bolt</span>
              <span className="font-label text-sm">Strategy</span>
            </a>
            <a className="text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high rounded-lg mx-2 my-1 px-4 py-3 flex items-center gap-3 transition-all active:scale-95 duration-100" href="#">
              <span className="material-symbols-outlined">analytics</span>
              <span className="font-label text-sm">Insights</span>
            </a>
          </div>
        </nav>

        {/* Main Content Canvas */}
        <main className="flex-grow p-4 md:p-8 max-w-screen-xl mx-auto w-full">
          <PipelineVisualizer />
          <StatsGrid />
          <LedgerTable />
        </main>

        {/* Modal Gates */}
        <StrategyGate />

        {/* Footer */}
        <footer className="w-full py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto border-t border-outline-variant bg-background dark:bg-background">
          <p className="font-label text-xs text-on-surface-variant dark:text-on-surface-variant">© 2024 RecruitAI Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="font-label text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Support</a>
            <a className="font-label text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="font-label text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">API Docs</a>
          </div>
        </footer>

        {/* BottomNavBar (Mobile Only) */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-outline-variant flex justify-around items-center h-16 px-4 z-50">
          <a className="flex flex-col items-center gap-1 text-primary" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="text-[10px] font-label font-bold">Dashboard</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
            <span className="material-symbols-outlined">work</span>
            <span className="text-[10px] font-label">Apps</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
            <span className="material-symbols-outlined">bolt</span>
            <span className="text-[10px] font-label">Strategy</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-[10px] font-label">Insights</span>
          </a>
        </div>
      </div>
    </>
  );
}
