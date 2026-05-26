import React from "react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="bg-background/80 backdrop-blur-md w-full top-0 sticky border-b border-outline-variant z-50">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <span className="material-symbols-outlined text-primary text-xl">terminal</span>
          </div>
          <h1 className="text-xl font-headline font-black tracking-tight text-on-surface">RecruitAI</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4 items-center">
            <Button variant="ghost" className="font-body text-primary font-bold border-b-2 border-primary rounded-none h-16 hover:bg-transparent">
              Dashboard
            </Button>
            <Button variant="ghost" className="font-body text-on-surface-variant rounded-full h-9">
              Applications
            </Button>
            <Button variant="ghost" className="font-body text-on-surface-variant rounded-full h-9">
              Strategy
            </Button>
          </div>
          <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-2 border-primary/20 cursor-pointer hover:border-primary/50 transition-colors">
            <img alt="User profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoN8kcUzXBDcdNFyUGqEQbd8lnMHXl-ZLXq-MQs0MVIahPjKRYJV3At9rBbiywKQWaINAaCb3WbriNOsWJmP07_mtmLnnfsgPZ2EEpzOVpcZ4K3w8FG1DvrVJQJqYlopz1PsUuI52juLy9MKwHpaUfrsvW22wSWXMRpw9h7c0-GdUwcnjfPVIesovW07jXkOhXD4h53WVnkw4yVxCo0HMgOdKjhwucFZWF6dW6pji0cRaRIGCso8ZY2oMhHQR87Ww6hYowU6iIEjJF"/>
          </div>
        </div>
      </div>
    </header>
  );
}
