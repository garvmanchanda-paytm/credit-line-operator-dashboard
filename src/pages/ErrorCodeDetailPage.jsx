import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar } from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { errorCodeDetails } from '../mockData/spends';

const SEVERITY_STYLE = {
  stable:    { badge: 'bg-slate-100 text-slate-700', label: 'Stable', icon: '→' },
  rising:    { badge: 'bg-red-100 text-red-700',     label: 'Rising', icon: '▲' },
  spike:     { badge: 'bg-red-200 text-red-800',     label: 'Spike',  icon: '▲▲' },
  improving: { badge: 'bg-emerald-100 text-emerald-700', label: 'Improving', icon: '▼' },
};

const CODE_COLOR = (code) => {
  if (code >= 500) return 'text-red-600 bg-red-50';
  if (code >= 400) return 'text-amber-600 bg-amber-50';
  if (code >= 200 && code < 300) return 'text-emerald-600 bg-emerald-50';
  return 'text-slate-600 bg-slate-50';
};

export default function ErrorCodeDetailPage() {
  const { selectedErrorCode, navigateBackFromErrorCodeDetail } = useDashboard();
  const [logFilter, setLogFilter] = useState('all');

  const detail = errorCodeDetails[selectedErrorCode];

  if (!detail) {
    return (
      <div className="space-y-4">
        <button onClick={navigateBackFromErrorCodeDetail} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Spends
        </button>
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-500">Error code detail not available for <span className="font-mono font-bold">{selectedErrorCode}</span></p>
        </div>
      </div>
    );
  }

  const sev = SEVERITY_STYLE[detail.severity] || SEVERITY_STYLE.stable;
  const maxCount = Math.max(...detail.dailyTrend.map(d => d.count));
  const minCount = Math.min(...detail.dailyTrend.map(d => d.count));
  const avgCount = Math.round(detail.dailyTrend.reduce((s, d) => s + d.count, 0) / detail.dailyTrend.length);
  const latestCount = detail.dailyTrend[detail.dailyTrend.length - 1].count;
  const prevCount = detail.dailyTrend[0].count;
  const changePct = (((latestCount - prevCount) / prevCount) * 100).toFixed(1);

  const reasons = useMemo(() => {
    const map = {};
    detail.logs.forEach(l => {
      map[l.reason] = (map[l.reason] || 0) + 1;
    });
    return Object.entries(map)
      .map(([reason, count]) => ({ reason, count, pct: ((count / detail.logs.length) * 100).toFixed(0) }))
      .sort((a, b) => b.count - a.count);
  }, [detail]);

  const filteredLogs = useMemo(() => {
    if (logFilter === 'all') return detail.logs;
    return detail.logs.filter(l => l.reason === logFilter);
  }, [detail, logFilter]);

  const fmtTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
  };

  const hoursAgo = (iso) => {
    const diff = (Date.now() - new Date(iso).getTime()) / 3600000;
    if (diff < 1) return `${Math.round(diff * 60)}m ago`;
    return `${diff.toFixed(1)}h ago`;
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <button onClick={navigateBackFromErrorCodeDetail} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
        ← Back to Spends &gt; UPI Error Codes
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-xl font-bold font-mono text-slate-900">{detail.code}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${sev.badge}`}>
                {sev.icon} {sev.label}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-700">{detail.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900 tabular-nums">{detail.avgDailyCount.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400">Avg daily failures</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800 text-sm mb-1">Issue Description</p>
          {detail.longDescription}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Avg Daily</p>
          <p className="text-lg font-bold text-slate-900 tabular-nums">{avgCount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Latest (Today)</p>
          <p className="text-lg font-bold text-slate-900 tabular-nums">{latestCount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">7D Max</p>
          <p className="text-lg font-bold text-red-600 tabular-nums">{maxCount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">7D Min</p>
          <p className="text-lg font-bold text-emerald-600 tabular-nums">{minCount.toLocaleString()}</p>
        </div>
        <div className={`bg-white rounded-xl border p-3 ${Number(changePct) > 5 ? 'border-red-200' : Number(changePct) < -5 ? 'border-emerald-200' : 'border-slate-200'}`}>
          <p className="text-[10px] text-slate-400 uppercase font-semibold">7D Change</p>
          <p className={`text-lg font-bold tabular-nums ${Number(changePct) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {Number(changePct) > 0 ? '+' : ''}{changePct}%
          </p>
        </div>
      </div>

      {/* 7-Day Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">7-Day Error Count Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={detail.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [v.toLocaleString(), 'Failures']} />
                <ReferenceLine y={avgCount} stroke="#6366f1" strokeDasharray="5 5" label={{ value: `Avg ${avgCount.toLocaleString()}`, position: 'right', fontSize: 9, fill: '#6366f1' }} />
                <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Success Rate Overlay</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={detail.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis domain={[78, 86]} tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [`${v}%`, 'SR']} />
                <Line type="monotone" dataKey="sr" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Failure Reason Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Failure Reason Breakdown</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">From {detail.logs.length} log entries in last 24 hours. Click a reason to filter logs.</p>
        </div>
        <div className="p-4 flex flex-wrap gap-2">
          <button
            onClick={() => setLogFilter('all')}
            className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${logFilter === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            All ({detail.logs.length})
          </button>
          {reasons.map((r) => (
            <button
              key={r.reason}
              onClick={() => setLogFilter(r.reason)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${logFilter === r.reason ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              {r.reason} ({r.count} · {r.pct}%)
            </button>
          ))}
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">Transaction Logs — Last 24 Hours</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Showing {filteredLogs.length} of {detail.logs.length} entries
              {logFilter !== 'all' && <span className="ml-1 text-blue-600 font-medium">· Filtered by: {logFilter}</span>}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-slate-50/80 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-2.5">Timestamp</th>
                <th className="text-left px-4 py-2.5">API Endpoint</th>
                <th className="text-center px-4 py-2.5">Response Code</th>
                <th className="text-left px-4 py-2.5">Customer ID</th>
                <th className="text-right px-4 py-2.5">Amount (₹)</th>
                <th className="text-left px-4 py-2.5">Bank</th>
                <th className="text-left px-4 py-2.5">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2 text-slate-600 whitespace-nowrap">
                    <span className="font-mono">{fmtTime(log.timestamp)}</span>
                    <span className="text-[9px] text-slate-400 ml-1.5">({hoursAgo(log.timestamp)})</span>
                  </td>
                  <td className="px-4 py-2 font-mono text-sky-700 text-[10px]">{log.endpoint}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${CODE_COLOR(log.responseCode)}`}>
                      {log.responseCode}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-mono text-slate-600">{log.customerId}</td>
                  <td className="px-4 py-2 text-right tabular-nums text-slate-700">
                    {log.amount > 0 ? `₹${log.amount.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-4 py-2 text-slate-600">{log.bank}</td>
                  <td className="px-4 py-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                      {log.reason}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
