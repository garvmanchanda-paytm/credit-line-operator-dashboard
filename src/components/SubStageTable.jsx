import { useMemo, useState } from 'react';
import { allStages } from '../mockData/allStages';
import { subStageApiHealth, getSubStageTrend } from '../mockData/subStageApi';
import { subStageErrors } from '../mockData/logErrors';
import { formatNumber, getDeltaColor, getDeltaBold } from '../utils/rag';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TREND_ICONS = {
  stable: { icon: '→', color: 'text-slate-400', label: 'Stable' },
  up: { icon: '▲', color: 'text-red-500', label: 'Up' },
  down: { icon: '▼', color: 'text-emerald-500', label: 'Down' },
  alert: { icon: '▲', color: 'text-red-600 font-bold', label: 'ALERT' },
};

const TIME_WINDOWS = [
  { key: 't-1', label: 'T-1', dayFactor: 1 / 22 },
  { key: '7d', label: 'Last 7 Days', dayFactor: 7 / 22 },
  { key: '15d', label: 'Last 15 Days', dayFactor: 15 / 22 },
];

function SubStageTrend({ subStage, convRate }) {
  const trendData = useMemo(
    () => getSubStageTrend(subStage, convRate),
    [subStage, convRate],
  );

  return (
    <div className="h-[100px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ fontSize: 10, border: '1px solid #e2e8f0', borderRadius: 8, padding: '4px 8px' }}
            formatter={(v) => [`${v.toFixed(1)}%`, 'Conv']}
          />
          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 2.5, fill: '#6366f1' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function SubStageErrorTable({ subStage, timeWindow }) {
  const errors = subStageErrors[subStage];
  if (!errors || errors.length === 0) return null;

  const tw = TIME_WINDOWS.find(t => t.key === timeWindow) || TIME_WINDOWS[1];

  const windowedErrors = useMemo(() => {
    const totalBase = errors.reduce((s, e) => s + e.count, 0);
    const windowTotal = Math.round(totalBase * tw.dayFactor);

    return errors.map(err => {
      const windowCount = Math.max(1, Math.round(err.count * tw.dayFactor));
      const pct = windowTotal > 0 ? (windowCount / windowTotal) * 100 : 0;
      return { ...err, windowCount, windowPct: pct };
    });
  }, [errors, tw.dayFactor]);

  return (
    <div>
      <h5 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5">L3 Errors</h5>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="text-left px-2 py-1.5 font-semibold text-slate-500 uppercase tracking-wider">#</th>
              <th className="text-left px-2 py-1.5 font-semibold text-slate-500 uppercase tracking-wider">Error</th>
              <th className="text-right px-2 py-1.5 font-semibold text-slate-500 uppercase tracking-wider">Count</th>
              <th className="text-right px-2 py-1.5 font-semibold text-slate-500 uppercase tracking-wider">% Failures</th>
              <th className="text-center px-2 py-1.5 font-semibold text-slate-500 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {windowedErrors.map((err, idx) => {
              const trend = TREND_ICONS[err.trendVsYesterday] || TREND_ICONS.stable;
              return (
                <tr key={err.errorCode} className="hover:bg-slate-50/60">
                  <td className="px-2 py-1.5 text-slate-400">{idx + 1}</td>
                  <td className="px-2 py-1.5">
                    <div className="text-slate-800 font-medium">{err.description}</div>
                    <div className="text-[9px] text-slate-400 font-mono">{err.errorCode}</div>
                  </td>
                  <td className="px-2 py-1.5 text-right text-slate-700 tabular-nums">{formatNumber(err.windowCount)}</td>
                  <td className="px-2 py-1.5 text-right text-slate-700 tabular-nums">{err.windowPct.toFixed(1)}%</td>
                  <td className={`px-2 py-1.5 text-center ${trend.color}`}>{trend.icon} {trend.label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubStageApiTable({ subStage, timeWindow }) {
  const apis = subStageApiHealth[subStage];

  if (!apis || apis.length === 0) {
    return <p className="text-[11px] text-slate-400 py-2">No API data available</p>;
  }

  return (
    <div>
      <h5 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5">API Health</h5>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="text-left px-2 py-1.5 font-semibold text-slate-500 uppercase tracking-wider">API Name</th>
              <th className="text-center px-2 py-1.5 font-semibold text-slate-500 uppercase tracking-wider w-10">Seq</th>
              <th className="text-right px-2 py-1.5 font-semibold text-slate-500 uppercase tracking-wider">Success %</th>
              <th className="text-right px-2 py-1.5 font-semibold text-slate-500 uppercase tracking-wider">Latency</th>
              <th className="text-right px-2 py-1.5 font-semibold text-slate-500 uppercase tracking-wider">Error %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {apis.map((row) => {
              const d = row[timeWindow];
              const successColor = d.successRate >= 99.5 ? 'text-emerald-600' : d.successRate >= 98 ? 'text-amber-600' : 'text-red-600';
              const errorColor = d.errorRate < 0.1 ? 'text-emerald-600' : d.errorRate < 0.5 ? 'text-amber-600' : 'text-red-600';
              const latencyColor = d.latency < 1000 ? 'text-emerald-600' : d.latency < 3000 ? 'text-amber-600' : 'text-red-600';

              return (
                <tr key={`${row.apiName}-${row.sequence}`} className="hover:bg-slate-50/60">
                  <td className="px-2 py-1.5 text-slate-800 font-medium">{row.apiName}</td>
                  <td className="px-2 py-1.5 text-center text-slate-500">{row.sequence}</td>
                  <td className={`px-2 py-1.5 text-right tabular-nums font-semibold ${successColor}`}>{d.successRate}%</td>
                  <td className={`px-2 py-1.5 text-right tabular-nums ${latencyColor}`}>{d.latency}ms</td>
                  <td className={`px-2 py-1.5 text-right tabular-nums font-semibold ${errorColor}`}>{d.errorRate}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExpandedDetail({ ss }) {
  const [timeWindow, setTimeWindow] = useState('7d');

  return (
    <div className="bg-slate-50/80 border-t border-slate-100 px-4 py-3 space-y-3">
      <div>
        <h5 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-1">
          7-Day Trend — {ss.displayLabel}
        </h5>
        <SubStageTrend subStage={ss.subStage} convRate={ss.convRate} />
      </div>

      {/* Shared time window toggle */}
      <div className="flex items-center justify-end">
        <div className="flex items-center bg-slate-200/70 rounded-md p-0.5">
          {TIME_WINDOWS.map((tw) => (
            <button
              key={tw.key}
              onClick={() => setTimeWindow(tw.key)}
              className={`px-2.5 py-0.5 text-[10px] font-medium rounded transition-colors ${
                timeWindow === tw.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tw.label}
            </button>
          ))}
        </div>
      </div>

      <SubStageApiTable subStage={ss.subStage} timeWindow={timeWindow} />
      <SubStageErrorTable subStage={ss.subStage} timeWindow={timeWindow} />
    </div>
  );
}

export default function SubStageTable({ parentStage }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const subStages = useMemo(() =>
    allStages.filter(s => s.parentStage === parentStage),
    [parentStage],
  );

  if (subStages.length === 0) {
    return <div className="text-sm text-slate-500 py-4 text-center">No sub-stage data available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-50">
            <th className="text-left px-3 py-2 font-semibold text-slate-500 uppercase tracking-wider">Sub-Stage</th>
            <th className="text-right px-3 py-2 font-semibold text-slate-500 uppercase tracking-wider">MTD Count</th>
            <th className="text-right px-3 py-2 font-semibold text-slate-500 uppercase tracking-wider">MTD %</th>
            <th className="text-right px-3 py-2 font-semibold text-slate-500 uppercase tracking-wider">LMTD %</th>
            <th className="text-right px-3 py-2 font-semibold text-slate-500 uppercase tracking-wider">Delta</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {subStages.map((ss) => {
            const lmtdPct = ss.convRate - ss.lmtdDelta;
            const deltaColor = getDeltaColor(ss.lmtdDelta);
            const isBold = getDeltaBold(ss.lmtdDelta);
            const isExpanded = expandedRow === ss.subStage;

            return (
              <tr key={ss.subStage} className="group">
                <td colSpan={5} className="p-0">
                  <div
                    className={`flex items-center cursor-pointer transition-colors ${
                      isExpanded ? 'bg-indigo-50/60' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setExpandedRow(isExpanded ? null : ss.subStage)}
                  >
                    <div className="flex-1 min-w-0 px-3 py-2 flex items-center gap-1.5">
                      <svg
                        className={`w-3 h-3 text-slate-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      <span className={`font-medium whitespace-nowrap ${isExpanded ? 'text-indigo-700' : 'text-slate-800'}`}>
                        {ss.displayLabel}
                      </span>
                    </div>
                    <div className="w-[72px] px-3 py-2 text-right text-slate-700 tabular-nums">
                      {formatNumber(ss.mtdCount)}
                    </div>
                    <div className="w-[60px] px-3 py-2 text-right text-slate-700 tabular-nums font-semibold">
                      {ss.convRate.toFixed(1)}%
                    </div>
                    <div className="w-[60px] px-3 py-2 text-right text-slate-400 tabular-nums">
                      {lmtdPct.toFixed(1)}%
                    </div>
                    <div className={`w-[64px] px-3 py-2 text-right tabular-nums ${
                      deltaColor === 'green' ? 'text-emerald-600' :
                      deltaColor === 'red' ? 'text-red-600' :
                      'text-slate-400'
                    } ${isBold ? 'font-bold' : 'font-medium'}`}>
                      {ss.lmtdDelta > 0 ? '+' : ''}{ss.lmtdDelta.toFixed(1)}pp
                    </div>
                  </div>

                  {isExpanded && <ExpandedDetail ss={ss} />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
