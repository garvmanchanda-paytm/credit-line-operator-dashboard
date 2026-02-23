import { logErrors } from '../mockData/logErrors';
import { formatNumber } from '../utils/rag';

const TREND_DISPLAY = {
  stable: { icon: '→', color: 'text-slate-400', text: 'stable' },
  up: { icon: '▲', color: 'text-red-500', text: '' },
  down: { icon: '▼', color: 'text-emerald-500', text: '' },
  alert: { icon: '▲', color: 'text-red-600', text: 'ALERT' },
};

export default function SelfieErrorBreakdown() {
  const selfieErrors = logErrors.SELFIE_CAPTURED;
  if (!selfieErrors) return null;

  const maxCount = selfieErrors[0]?.count || 1;

  return (
    <div className="mt-4 border border-amber-200 rounded-lg bg-amber-50/50 overflow-hidden">
      <div className="px-3 py-2 bg-amber-100/50 border-b border-amber-200">
        <h4 className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Liveliness Error Breakdown
        </h4>
      </div>

      <div className="p-3 space-y-2">
        {selfieErrors.map((err, idx) => {
          const trend = TREND_DISPLAY[err.trendVsYesterday] || TREND_DISPLAY.stable;
          const barWidth = (err.count / maxCount) * 100;

          return (
            <div key={err.errorCode} className="flex items-center gap-2">
              <div className="w-4 text-[10px] text-slate-400 text-right">{idx + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-700 truncate mb-0.5">{err.description}</div>
                <div className="relative h-4 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-amber-400 rounded-full transition-all"
                    style={{ width: `${barWidth}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="text-[10px] font-medium text-amber-900">
                      {formatNumber(err.count)} ({err.pctOfFailures}%)
                    </span>
                  </div>
                </div>
              </div>
              <div className={`w-14 text-right text-[10px] font-medium ${trend.color}`}>
                {trend.icon} {trend.text || `${err.pctOfFailures > 5 ? '+' : ''}${err.pctOfFailures}%`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
