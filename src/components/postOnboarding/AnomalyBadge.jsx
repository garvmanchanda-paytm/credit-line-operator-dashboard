export default function AnomalyBadge({ value, rollingAvg, label }) {
  if (rollingAvg == null || rollingAvg === 0) return null;
  const ratio = value / rollingAvg;

  if (ratio > 2) {
    return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">{label || 'SPIKE'}</span>;
  }
  if (ratio > 1.5) {
    return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">{label || 'WATCH'}</span>;
  }
  return null;
}
