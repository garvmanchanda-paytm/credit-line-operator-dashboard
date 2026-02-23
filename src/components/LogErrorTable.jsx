import { logErrors } from '../mockData/logErrors';
import { formatNumber } from '../utils/rag';

const TREND_ICONS = {
  stable: { icon: '→', color: 'text-slate-400', label: 'Stable' },
  up: { icon: '▲', color: 'text-red-500', label: 'Up' },
  down: { icon: '▼', color: 'text-emerald-500', label: 'Down' },
  alert: { icon: '▲', color: 'text-red-600 font-bold', label: 'ALERT' },
};

export default function LogErrorTable({ stage }) {
  const errors = logErrors[stage];
  if (!errors || errors.length === 0) {
    return <div className="text-sm text-slate-500 py-4 text-center">No error data available</div>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-3 py-2 text-xs font-medium text-slate-500 uppercase">#</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-slate-500 uppercase">Error</th>
              <th className="text-right px-3 py-2 text-xs font-medium text-slate-500 uppercase">Count</th>
              <th className="text-right px-3 py-2 text-xs font-medium text-slate-500 uppercase">% Failures</th>
              <th className="text-center px-3 py-2 text-xs font-medium text-slate-500 uppercase">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {errors.map((err, idx) => {
              const trend = TREND_ICONS[err.trendVsYesterday] || TREND_ICONS.stable;
              return (
                <tr key={err.errorCode} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2 text-xs text-slate-400">{idx + 1}</td>
                  <td className="px-3 py-2">
                    <div className="text-xs font-medium text-slate-800">{err.description}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{err.errorCode}</div>
                  </td>
                  <td className="px-3 py-2 text-right text-xs text-slate-700 tabular-nums">
                    {formatNumber(err.count)}
                  </td>
                  <td className="px-3 py-2 text-right text-xs text-slate-700 tabular-nums">
                    {err.pctOfFailures.toFixed(1)}%
                  </td>
                  <td className={`px-3 py-2 text-center text-xs ${trend.color}`}>
                    {trend.icon} {trend.label}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-3 py-2 border-t border-slate-100">
        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
          Open in Kibana →
        </button>
      </div>
    </div>
  );
}
