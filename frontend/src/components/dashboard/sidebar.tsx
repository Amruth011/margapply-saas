import React from "react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 hidden lg:flex flex-col z-40 h-screen w-64 bg-surface-container-low dark:bg-surface-container-low border-r border-outline-variant dark:border-outline-variant pt-20">
      <div className="px-6 mb-8">
        <h2 className="font-headline font-bold text-lg text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">hub</span>
          Recruitment Hub
        </h2>
      </div>
      <div className="flex flex-col gap-2 px-3">
        <Button variant="secondary" className="w-full justify-start gap-3 h-12 rounded-xl bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label text-sm font-bold">Dashboard</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all">
          <span className="material-symbols-outlined">work</span>
          <span className="font-label text-sm">Applications</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all">
          <span className="material-symbols-outlined">bolt</span>
          <span className="font-label text-sm">Strategy</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all">
          <span className="material-symbols-outlined">analytics</span>
          <span className="font-label text-sm">Insights</span>
        </Button>
      </div>
    </nav>
  );
}
