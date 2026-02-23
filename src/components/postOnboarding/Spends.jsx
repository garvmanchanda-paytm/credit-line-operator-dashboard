import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, ReferenceArea } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { dailySuccessRate, avgSR, errorCodes, momGmvTxn } from '../../mockData/spends';
import AnomalyBadge from './AnomalyBadge';

const TREND_ICONS = { stable: '→', rising: '▲', spike: '▲▲', improving: '▼' };
const TREND_COLORS = { stable: 'text-slate-500', rising: 'text-red-600', spike: 'text-red-700 font-bold', improving: 'text-emerald-600' };

export default function Spends() {
  const { openIssuePanel } = useDashboard();
  const crossLinkTxnFailed = () => openIssuePanel('txn_failed');
  const yesterday = dailySuccessRate[dailySuccessRate.length - 1];
  const delta = (yesterday.sr - avgSR).toFixed(1);

  const anomalyZones = useMemo(() => {
    const threshold = avgSR - 2;
    const zones = [];
    let start = null;
    dailySuccessRate.forEach((d, i) => {
      if (d.sr < threshold) {
        if (!start) start = d.date;
      } else if (start) {
        zones.push({ x1: start, x2: dailySuccessRate[i - 1].date });
        start = null;
      }
    });
    if (start) zones.push({ x1: start, x2: dailySuccessRate[dailySuccessRate.length - 1].date });
    return zones;
  }, []);

  return (
    <div className="space-y-5">
      {/* SR KPI */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Yesterday SR</p>
          <p className="text-2xl font-bold text-slate-900">{yesterday.sr}%</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">30-Day Avg</p>
          <p className="text-2xl font-bold text-slate-900">{avgSR}%</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Delta</p>
          <p className={`text-2xl font-bold ${Number(delta) < -2 ? 'text-red-600' : Number(delta) < 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {delta}pp
          </p>
          {Number(delta) < -2 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">BELOW THRESHOLD</span>
              <button onClick={crossLinkTxnFailed} className="text-[10px] text-blue-600 hover:text-blue-800 font-medium underline">CST Impact →</button>
            </div>
          )}
        </div>
      </div>

      {/* SR Line Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Daily Transaction Success Rate</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailySuccessRate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis domain={[78, 86]} tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [`${v}%`, 'SR']} />
              <ReferenceLine y={avgSR} stroke="#6366f1" strokeDasharray="5 5" label={{ value: `Avg ${avgSR}%`, position: 'right', fontSize: 10, fill: '#6366f1' }} />
              {anomalyZones.map((z, i) => (
                <ReferenceArea key={i} x1={z.x1} x2={z.x2} fill="#fecaca" fillOpacity={0.3} />
              ))}
              <Line type="monotone" dataKey="sr" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">Red-shaded zones = SR dropped more than 2pp below 30-day average</p>
      </div>

      {/* Error Code Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">UPI Error Code Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-2.5 w-8">#</th>
                <th className="text-left px-4 py-2.5">Code</th>
                <th className="text-left px-4 py-2.5">Description</th>
                <th className="text-right px-4 py-2.5">Avg Daily</th>
                <th className="text-right px-4 py-2.5">% Failures</th>
                <th className="text-center px-4 py-2.5">7D Trend</th>
                <th className="text-center px-4 py-2.5">Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {errorCodes.map((err) => {
                const maxDaily = Math.max(...err.dailyCounts);
                const avg7d = err.dailyCounts.reduce((a, b) => a + b, 0) / err.dailyCounts.length;
                return (
                  <tr key={err.code} className={err.trend === 'spike' ? 'bg-red-50/50 font-semibold' : ''}>
                    <td className="px-4 py-2 text-slate-400">{err.rank}</td>
                    <td className="px-4 py-2 font-mono font-semibold text-slate-800">{err.code}</td>
                    <td className="px-4 py-2 text-slate-600">{err.description}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{err.avgDailyCount.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{err.pctOfFailures}%</td>
                    <td className="px-4 py-2 text-center">
                      <span className={TREND_COLORS[err.trend]}>{TREND_ICONS[err.trend]} {err.trend}</span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <AnomalyBadge value={maxDaily} rollingAvg={avg7d} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* GMV + Txn Count MoM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">GMV Trend (₹ Cr)</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={momGmvTxn}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [`₹${v} Cr`, 'GMV']} />
                <Line type="monotone" dataKey="gmvCr" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Transaction Count Trend</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={momGmvTxn}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => `${(v / 100000).toFixed(1)}L`} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [v.toLocaleString(), 'Txns']} />
                <Line type="monotone" dataKey="txnCount" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
