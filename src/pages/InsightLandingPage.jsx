import { useMemo, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { funnelMTD } from '../mockData/funnelMTD';
import { issueCategories } from '../mockData/issueCategories';
import { currentMonthKPIs } from '../mockData/portfolio';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { dailyFunnel } from '../mockData/dailyFunnel';
import { systemAlerts, alertSummary } from '../mockData/systemAlerts';

function KpiCard({ label, value, delta, deltaLabel, rag, onClick }) {
  const ragStyles = {
    red: 'border-red-200 bg-red-50/40',
    amber: 'border-amber-200 bg-amber-50/40',
    green: 'border-emerald-200 bg-emerald-50/40',
    gray: 'border-slate-200',
  };
  const deltaStyles = {
    red: 'text-red-600',
    amber: 'text-amber-600',
    green: 'text-emerald-600',
    gray: 'text-slate-400',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 ${ragStyles[rag]} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <p className="text-[11px] font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <div className="flex items-center gap-1.5 mt-1">
        <span className={`text-xs font-semibold ${deltaStyles[rag]}`}>{delta}</span>
        {deltaLabel && <span className="text-[10px] text-slate-400">{deltaLabel}</span>}
      </div>
    </div>
  );
}

function Sparkline({ data, color = '#3b82f6' }) {
  return (
    <div className="h-8 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function SectionCard({ title, summary, sparkData, sparkColor, ragCount, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{title}</h3>
        <Sparkline data={sparkData} color={sparkColor} />
      </div>
      <p className="text-xs text-slate-600 leading-relaxed mb-3">{summary}</p>
      <div className="flex items-center gap-2 text-[10px]">
        {ragCount.red > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-semibold">{ragCount.red} RED</span>
        )}
        {ragCount.amber > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold">{ragCount.amber} AMBER</span>
        )}
        <span className="text-blue-600 font-medium ml-auto group-hover:underline">View details &rarr;</span>
      </div>
    </div>
  );
}

function SystemAlertsPanel() {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const fmtTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const minsAgo = (iso) => {
    const diff = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    return diff < 1 ? 'just now' : `${diff}m ago`;
  };

  const severityStyle = {
    critical: { badge: 'bg-red-500 text-white', border: 'border-red-200 bg-red-50/30', pulse: 'bg-red-500' },
    warning:  { badge: 'bg-amber-500 text-white', border: 'border-amber-200 bg-amber-50/30', pulse: 'bg-amber-500' },
  };

  const codeColor = (code) => {
    if (code >= 500) return 'text-red-600 bg-red-50 font-bold';
    if (code >= 400) return 'text-amber-600 bg-amber-50 font-bold';
    if (code >= 200 && code < 300) return 'text-emerald-600 bg-emerald-50';
    return 'text-slate-600 bg-slate-50';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-lg">🔴</span>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-75" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">System Alerts</h2>
            <p className="text-[10px] text-slate-400">Live API & funnel issues in last 1 hour — auto-resolves when healthy</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-100 text-red-700 font-bold">
            {alertSummary.critical} Critical
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">
            {alertSummary.warning} Warning
          </span>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {systemAlerts.map((alert) => {
          const sev = severityStyle[alert.severity];
          const isExpanded = expandedId === alert.id;

          return (
            <div key={alert.id}>
              <button
                onClick={() => toggle(alert.id)}
                className={`w-full text-left px-5 py-3.5 transition-colors hover:bg-slate-50/80 ${isExpanded ? 'bg-slate-50/60' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${sev.pulse} ${alert.severity === 'critical' ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${sev.badge}`}>
                        {alert.severity}
                      </span>
                      <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${alert.type === 'api' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {alert.type === 'api' ? 'API' : 'FUNNEL'}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-auto flex-shrink-0">
                        Detected {minsAgo(alert.detectedAt)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 truncate">{alert.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{alert.summary}</p>
                  </div>
                  <span className={`flex-shrink-0 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className={`px-5 pb-4 border-l-4 ${alert.severity === 'critical' ? 'border-red-400' : 'border-amber-400'}`}>
                  {alert.type === 'api' ? (
                    <ApiAlertDetail alert={alert} fmtTime={fmtTime} codeColor={codeColor} />
                  ) : (
                    <FunnelAlertDetail alert={alert} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {systemAlerts.length === 0 && (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-emerald-600 font-semibold">All systems healthy</p>
          <p className="text-xs text-slate-400 mt-1">No active alerts in the last hour</p>
        </div>
      )}
    </div>
  );
}

function ApiAlertDetail({ alert, fmtTime, codeColor }) {
  return (
    <div className="space-y-3 ml-5">
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Endpoint</p>
          <p className="font-mono text-slate-800 font-medium mt-0.5 text-[11px] break-all">{alert.endpoint}</p>
        </div>
        <div className="bg-red-50/60 rounded-lg p-3">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Error Rate</p>
          <p className="text-red-700 font-bold text-lg mt-0.5">{alert.currentErrorRate}%</p>
          <p className="text-[10px] text-slate-400">baseline: {alert.baselineErrorRate}%</p>
        </div>
        <div className="bg-amber-50/60 rounded-lg p-3">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Impacted Users</p>
          <p className="text-amber-700 font-bold text-lg mt-0.5">{alert.impactedCustomers.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400">in last 30 min</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Recent Error Logs</span>
          <span className="text-[10px] text-slate-500">{alert.logs.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-3 py-2">Timestamp</th>
                <th className="text-left px-3 py-2">Endpoint</th>
                <th className="text-center px-3 py-2">Status</th>
                <th className="text-right px-3 py-2">Latency</th>
                <th className="text-left px-3 py-2">Customer ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {alert.logs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-3 py-1.5 text-slate-300 font-mono whitespace-nowrap">{fmtTime(log.timestamp)}</td>
                  <td className="px-3 py-1.5 text-sky-400 font-mono truncate max-w-[200px]">{log.endpoint}</td>
                  <td className="px-3 py-1.5 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${codeColor(log.responseCode)}`}>
                      {log.responseCode}
                    </span>
                  </td>
                  <td className={`px-3 py-1.5 text-right font-mono ${log.latencyMs > 10000 ? 'text-red-400' : log.latencyMs > 3000 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {log.latencyMs >= 1000 ? `${(log.latencyMs / 1000).toFixed(1)}s` : `${log.latencyMs}ms`}
                  </td>
                  <td className="px-3 py-1.5 text-slate-400 font-mono">{log.customerId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FunnelAlertDetail({ alert }) {
  return (
    <div className="space-y-3 ml-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Stage</p>
          <p className="font-semibold text-slate-800 mt-0.5">{alert.stage}</p>
        </div>
        <div className="bg-red-50/60 rounded-lg p-3">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Current Rate</p>
          <p className="text-red-700 font-bold text-lg mt-0.5">{alert.currentConversion}%</p>
        </div>
        <div className="bg-emerald-50/60 rounded-lg p-3">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Before (1h ago)</p>
          <p className="text-emerald-700 font-bold text-lg mt-0.5">{alert.previousConversion}%</p>
        </div>
        <div className="bg-amber-50/60 rounded-lg p-3">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Since</p>
          <p className="text-amber-700 font-bold text-lg mt-0.5">{alert.sinceDuration}</p>
        </div>
      </div>

      {/* Mini trend chart */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Conversion Trend (last 60 min)</p>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={alert.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [`${v}%`, 'Conversion']} />
              <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-2 mt-2 text-[10px]">
          <span className="text-slate-400">Baseline: {alert.baselineConversion}%</span>
          <span className="text-red-600 font-semibold">Drop: {(alert.previousConversion - alert.currentConversion).toFixed(1)}pp in {alert.sinceDuration}</span>
        </div>
      </div>

      {/* Downstream cascade */}
      {alert.downstreamImpact?.length > 0 && (
        <div className="bg-red-50/40 rounded-lg border border-red-100 p-3">
          <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-2">Cascading Downstream Impact</p>
          <div className="space-y-1.5">
            {alert.downstreamImpact.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">{d.stage}</span>
                <span className="text-red-600 font-bold">{d.drop}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InsightLandingPage() {
  const { setActiveView } = useDashboard();

  const funnelStats = useMemo(() => {
    const first = funnelMTD[0];
    const last = funnelMTD[funnelMTD.length - 1];
    const overallConv = ((last.count / first.count) * 100).toFixed(2);
    const delta = ((first.count - first.lmtdCount) / first.lmtdCount * 100).toFixed(1);
    return { overallConv, delta, appLoads: first.count, leadsCompleted: last.count };
  }, []);

  const topIssue = useMemo(() => {
    const sorted = [...issueCategories].sort((a, b) => b.mtdCount - a.mtdCount);
    return sorted[0];
  }, []);

  const totalTickets = useMemo(
    () => issueCategories.reduce((s, i) => s + i.mtdCount, 0),
    []
  );

  const funnelSparkData = useMemo(() => {
    return dailyFunnel.slice(-7).map(d => ({
      v: d.LEAD_SUCCESSFULLY_CLOSED?.count || 0,
    }));
  }, []);

  const cstSparkData = useMemo(() => {
    if (!topIssue?.dailyCounts) return [];
    return topIssue.dailyCounts.map(c => ({ v: c }));
  }, [topIssue]);

  const portfolioSparkData = useMemo(() => [
    { v: 9483 }, { v: 37183 }, { v: 87037 }, { v: 84534 }, { v: 72404 }, { v: 62202 },
  ], []);

  const disbursementSparkData = useMemo(() => [
    { v: 4200 }, { v: 4350 }, { v: 4100 }, { v: 4500 }, { v: 4280 }, { v: 4420 }, { v: 4380 },
  ], []);

  const alerts = useMemo(() => {
    const items = [];
    const funnelDelta = parseFloat(funnelStats.delta);
    if (funnelDelta < -5) {
      items.push({ text: `Landing page views down ${Math.abs(funnelDelta)}% vs LMTD`, section: 'snapshot', rag: 'red' });
    }
    const redIssues = issueCategories.filter(i => i.pctShare > 10);
    redIssues.forEach(i => {
      items.push({ text: `${i.subCategory}: ${i.pctShare}% of tickets`, section: 'userPulse', rag: 'red' });
    });
    if (currentMonthKPIs.spacMoM < -10) {
      items.push({ text: `SPAC declined ${Math.abs(currentMonthKPIs.spacMoM)}% MoM`, section: 'postOnboarding', rag: 'amber' });
    }
    return items;
  }, [funnelStats]);

  return (
    <div className="space-y-5">
      {/* Cross-charter KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Funnel — Leads Completed MTD"
          value={funnelStats.leadsCompleted.toLocaleString()}
          delta={`${funnelStats.delta}% vs Jan`}
          deltaLabel="overall"
          rag={parseFloat(funnelStats.delta) < -5 ? 'red' : parseFloat(funnelStats.delta) < 0 ? 'amber' : 'green'}
          onClick={() => setActiveView('snapshot')}
        />
        <KpiCard
          label="Disbursement — Count MTD"
          value="4,380"
          delta="+3.2% MoM"
          deltaLabel=""
          rag="green"
          onClick={() => setActiveView('disbursement')}
        />
        <KpiCard
          label="User Pulse — Total Tickets MTD"
          value={totalTickets.toLocaleString()}
          delta={`Top: ${topIssue?.pctShare}% share`}
          deltaLabel={topIssue?.subCategory?.slice(0, 25)}
          rag={topIssue?.pctShare > 10 ? 'red' : 'amber'}
          onClick={() => setActiveView('userPulse')}
        />
        <KpiCard
          label="Portfolio — Active Accounts"
          value={currentMonthKPIs.totalActiveAccounts.toLocaleString()}
          delta={`${currentMonthKPIs.txningUsersMoM > 0 ? '+' : ''}${currentMonthKPIs.txningUsersMoM}% txn users`}
          deltaLabel="MoM"
          rag={currentMonthKPIs.txningUsersMoM > 5 ? 'green' : 'amber'}
          onClick={() => setActiveView('postOnboarding')}
        />
      </div>

      {/* System Alerts — live API & funnel health */}
      <SystemAlertsPanel />

      {/* Alerts strip */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Alerts & Anomalies</h2>
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1.5 -mx-2 transition-colors"
                onClick={() => setActiveView(alert.section)}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  alert.rag === 'red' ? 'bg-red-500' : 'bg-amber-500'
                }`} />
                <span className="text-sm text-slate-700">{alert.text}</span>
                <span className="text-[10px] text-blue-600 ml-auto font-medium">View &rarr;</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section quick-link cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="Onboarding Funnel"
          summary={`${funnelStats.overallConv}% end-to-end conversion. ${funnelStats.leadsCompleted.toLocaleString()} leads completed MTD across ${funnelMTD.length} stages.`}
          sparkData={funnelSparkData}
          sparkColor="#3b82f6"
          ragCount={{ red: 2, amber: 3 }}
          onClick={() => setActiveView('snapshot')}
        />
        <SectionCard
          title="Disbursement Analysis"
          summary="4,380 disbursements MTD worth 24.5 Cr. Avg TAT 18.2 hours. 2 lenders active."
          sparkData={disbursementSparkData}
          sparkColor="#10b981"
          ragCount={{ red: 0, amber: 1 }}
          onClick={() => setActiveView('disbursement')}
        />
        <SectionCard
          title="User Pulse — CST"
          summary={`${totalTickets.toLocaleString()} tickets MTD. Top issue: ${topIssue?.subCategory} at ${topIssue?.pctShare}% share.`}
          sparkData={cstSparkData}
          sparkColor="#f59e0b"
          ragCount={{ red: 2, amber: 1 }}
          onClick={() => setActiveView('userPulse')}
        />
        <SectionCard
          title="Post-Onboarding"
          summary={`${currentMonthKPIs.totalActiveAccounts.toLocaleString()} active accounts. GMV ${currentMonthKPIs.gmvCr} Cr (+${currentMonthKPIs.gmvMoM}% MoM).`}
          sparkData={portfolioSparkData}
          sparkColor="#8b5cf6"
          ragCount={{ red: 1, amber: 2 }}
          onClick={() => setActiveView('postOnboarding')}
        />
      </div>
    </div>
  );
}
