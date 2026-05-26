"use client";

import React from "react";
import { useAgentState } from "@/hooks/use-agent-state";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  { name: "Mon", applications: 2, success: 1 },
  { name: "Tue", applications: 5, success: 2 },
  { name: "Wed", applications: 8, success: 4 },
  { name: "Thu", applications: 12, success: 5 },
  { name: "Fri", applications: 15, success: 8 },
  { name: "Sat", applications: 20, success: 10 },
  { name: "Sun", applications: 25, success: 12 },
];

export function TrendGraph() {
  const { state } = useAgentState();

  // In a real scenario, this data would come from the state/backend
  const data = state.applicationSuccess > 0 ? mockData.map(d => ({
    ...d,
    success: Math.floor(d.applications * (state.applicationSuccess / 100))
  })) : mockData;

  return (
    <section className="col-span-full md:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
      <div className="mb-6">
        <h3 className="font-headline font-bold text-slate-900">Application Velocity</h3>
        <p className="font-label text-xs text-on-surface-variant">Applications over the last 7 days</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="applications" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="success" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
