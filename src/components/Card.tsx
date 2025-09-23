import React from 'react';
export function Card({ label, value, highlight=false }:{ label:string; value:React.ReactNode; highlight?:boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${highlight ? 'bg-blue-50 dark:bg-blue-950/40' : 'bg-white/70 dark:bg-slate-900/40'} border-slate-200 dark:border-slate-700`}>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
