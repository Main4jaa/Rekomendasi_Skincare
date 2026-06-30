export default function ConfidenceGauge({ value = 0, label = 'Confidence' }) {
  const pct = Math.max(0, Math.min(100, Math.round(Number(value || 0) * 100)));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-400 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
