import React from "react";

export function LedgerTable() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <h3 className="font-headline font-bold text-on-surface">Application Ledger</h3>
        <button className="text-sm font-label text-primary font-bold hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-6 py-3 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Company</th>
              <th className="px-6 py-3 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Role</th>
              <th className="px-6 py-3 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
              <th className="px-6 py-3 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {/* Row 1 */}
            <tr className="hover:bg-surface-container-low transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">ST</div>
                  <span className="font-body text-sm font-medium">Stripe</span>
                </div>
              </td>
              <td className="px-6 py-4 font-body text-sm text-on-surface-variant">Product Designer</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">Interviewing</span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="p-1 hover:bg-surface-container-highest rounded transition-all">
                  <span className="material-symbols-outlined text-sm">more_vert</span>
                </button>
              </td>
            </tr>
            {/* Row 2 */}
            <tr className="hover:bg-surface-container-low transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">VD</div>
                  <span className="font-body text-sm font-medium">Vercel</span>
                </div>
              </td>
              <td className="px-6 py-4 font-body text-sm text-on-surface-variant">UX Engineer</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">Applied</span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="p-1 hover:bg-surface-container-highest rounded transition-all">
                  <span className="material-symbols-outlined text-sm">more_vert</span>
                </button>
              </td>
            </tr>
            {/* Row 3 */}
            <tr className="hover:bg-surface-container-low transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">AN</div>
                  <span className="font-body text-sm font-medium">Anthropic</span>
                </div>
              </td>
              <td className="px-6 py-4 font-body text-sm text-on-surface-variant">AI Researcher</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 uppercase">Reviewing</span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="p-1 hover:bg-surface-container-highest rounded transition-all">
                  <span className="material-symbols-outlined text-sm">more_vert</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
