import { useMemo, useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { funnelByLender } from '../mockData/funnelMTD';
import { issueCategories, getFilteredIssues } from '../mockData/issueCategories';
import { currentMonthKPIs } from '../mockData/portfolio';
import { disbursementKPIs } from '../mockData/disbursement';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { dailyFunnel } from '../mockData/dailyFunnel';
import { systemAlerts, alertSummary } from '../mockData/systemAlerts';

const INSIGHT_LENDERS = ['All Lenders', 'SSFB', 'JANA'];

// ─── Helpers ────────────────────────────────────────────────────────────

function readLS(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Shared Components ──────────────────────────────────────────────────

function KpiCard({ label, value, delta, deltaLabel, rag, onClick, t1Delta }) {
  const ragStyles = {
    red: 'border-red-200 bg-red-50/40',
    amber: 'border-amber-200 bg-amber-50/40',
    green: 'border-emerald-200 bg-emerald-50/40',
    gray: 'border-slate-200',
  };
  const deltaStyles = { red: 'text-red-600', amber: 'text-amber-600', green: 'text-emerald-600', gray: 'text-slate-400' };

  return (
    <div onClick={onClick} className={`rounded-xl border p-4 ${ragStyles[rag]} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
      <p className="text-[11px] font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <div className="flex items-center gap-1.5 mt-1">
        <span className={`text-xs font-semibold ${deltaStyles[rag]}`}>{delta}</span>
        {deltaLabel && <span className="text-[10px] text-slate-400">{deltaLabel}</span>}
      </div>
      {t1Delta !== undefined && t1Delta !== null && (
        <p className={`text-[10px] font-semibold mt-1 ${t1Delta > 0 ? 'text-emerald-600' : t1Delta < 0 ? 'text-red-600' : 'text-slate-400'}`}>
          {t1Delta > 0 ? '▲' : t1Delta < 0 ? '▼' : '—'} {Math.abs(t1Delta).toFixed(1)}% since yesterday
        </p>
      )}
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
    <div onClick={onClick} className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{title}</h3>
        <Sparkline data={sparkData} color={sparkColor} />
      </div>
      <p className="text-xs text-slate-600 leading-relaxed mb-3">{summary}</p>
      <div className="flex items-center gap-2 text-[10px]">
        {ragCount.red > 0 && <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-semibold">{ragCount.red} RED</span>}
        {ragCount.amber > 0 && <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold">{ragCount.amber} AMBER</span>}
        <span className="text-blue-600 font-medium ml-auto group-hover:underline">View details &rarr;</span>
      </div>
    </div>
  );
}

// ─── P2.1: Watch List Strip ─────────────────────────────────────────────

function WatchListStrip({ navigateToStageDetail, openIssuePanel }) {
  const [watchlist, setWatchlist] = useState(() => readLS('pm_watchlist'));

  useEffect(() => {
    const handler = () => setWatchlist(readLS('pm_watchlist'));
    window.addEventListener('watchlist-updated', handler);
    return () => window.removeEventListener('watchlist-updated', handler);
  }, []);

  const remove = (id) => {
    const next = watchlist.filter(w => w.id !== id);
    writeLS('pm_watchlist', next);
    setWatchlist(next);
    window.dispatchEvent(new Event('watchlist-updated'));
  };

  if (watchlist.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-blue-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Watching ({watchlist.length}/6)</h3>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {watchlist.map(item => {
          const ragColor = item.rag === 'red' ? 'border-red-300 bg-red-50/40' : item.rag === 'amber' ? 'border-amber-300 bg-amber-50/40' : 'border-emerald-300 bg-emerald-50/40';
          const deltaColor = item.delta > 0 ? 'text-red-600' : 'text-emerald-600';
          const navigate = () => {
            if (item.type === 'stage') navigateToStageDetail(item.id);
            else if (item.type === 'issue') openIssuePanel(item.id);
          };
          return (
            <div key={item.id} onClick={navigate} className={`flex-shrink-0 rounded-lg border p-2.5 min-w-[140px] cursor-pointer hover:shadow-md transition-shadow ${ragColor}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">{item.type}</span>
                <button onClick={(e) => { e.stopPropagation(); remove(item.id); }} className="text-[10px] text-slate-400 hover:text-red-500">✕</button>
              </div>
              <p className="text-[11px] font-semibold text-slate-800 truncate">{item.name}</p>
              <p className={`text-xs font-bold mt-0.5 ${deltaColor}`}>{item.delta > 0 ? '+' : ''}{item.delta}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── P1.3: System Alerts with Investigate CTA ───────────────────────────

function SystemAlertsPanel({ navigateToStageDetail, lenderKey = 'ALL' }) {
  const [expandedId, setExpandedId] = useState(null);
  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const filteredAlerts = useMemo(() => {
    if (lenderKey === 'ALL') return systemAlerts;
    return systemAlerts.filter(a => !a.lender || a.lender === lenderKey || a.lender === 'ALL');
  }, [lenderKey]);

  const fmtTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };
  const minsAgo = (iso) => {
    const diff = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    return diff < 1 ? 'just now' : `${diff}m ago`;
  };
  const severityStyle = {
    critical: { badge: 'bg-red-500 text-white', pulse: 'bg-red-500' },
    warning:  { badge: 'bg-amber-500 text-white', pulse: 'bg-amber-500' },
  };
  const codeColor = (code) => {
    if (code >= 500) return 'text-red-600 bg-red-50 font-bold';
    if (code >= 400) return 'text-amber-600 bg-amber-50 font-bold';
    if (code >= 200 && code < 300) return 'text-emerald-600 bg-emerald-50';
    return 'text-slate-600 bg-slate-50';
  };

  const stageMap = {
    '/api/v2/kyc/liveness-check': 'SELFIE_CAPTURED',
    '/api/v2/bureau/credit-pull': 'BUREAU_IN_PROGRESS',
  };

  const handleInvestigate = (alert) => {
    if (alert.type === 'funnel') {
      const stageName = alert.stage?.split('→')[0]?.trim()?.replace(/ /g, '_') || 'BUREAU_IN_PROGRESS';
      const matchedStage = funnelByLender.ALL?.find(s => s.stage.includes(stageName.split('_')[0]))?.stage || 'BRE_COMPLETED';
      navigateToStageDetail(matchedStage);
    } else {
      const stage = stageMap[alert.endpoint] || 'BRE_COMPLETED';
      navigateToStageDetail(stage);
    }
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
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-100 text-red-700 font-bold">{filteredAlerts.filter(a => a.severity === 'critical').length} Critical</span>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">{filteredAlerts.filter(a => a.severity === 'warning').length} Warning</span>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {filteredAlerts.map((alert) => {
          const sev = severityStyle[alert.severity];
          const isExpanded = expandedId === alert.id;
          return (
            <div key={alert.id}>
              <button onClick={() => toggle(alert.id)} className={`w-full text-left px-5 py-3.5 transition-colors hover:bg-slate-50/80 ${isExpanded ? 'bg-slate-50/60' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${sev.pulse} ${alert.severity === 'critical' ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${sev.badge}`}>{alert.severity}</span>
                      <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${alert.type === 'api' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{alert.type === 'api' ? 'API' : 'FUNNEL'}</span>
                      <span className="text-[10px] text-slate-400 ml-auto flex-shrink-0">Detected {minsAgo(alert.detectedAt)}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 truncate">{alert.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{alert.summary}</p>
                  </div>
                  <span className={`flex-shrink-0 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                </div>
              </button>
              {isExpanded && (
                <div className={`px-5 pb-4 border-l-4 ${alert.severity === 'critical' ? 'border-red-400' : 'border-amber-400'}`}>
                  {alert.type === 'api' ? <ApiAlertDetail alert={alert} fmtTime={fmtTime} codeColor={codeColor} /> : <FunnelAlertDetail alert={alert} />}
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleInvestigate(alert)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Investigate <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filteredAlerts.length === 0 && (
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
                  <td className="px-3 py-1.5 text-center"><span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${codeColor(log.responseCode)}`}>{log.responseCode}</span></td>
                  <td className={`px-3 py-1.5 text-right font-mono ${log.latencyMs > 10000 ? 'text-red-400' : log.latencyMs > 3000 ? 'text-amber-400' : 'text-emerald-400'}`}>{log.latencyMs >= 1000 ? `${(log.latencyMs / 1000).toFixed(1)}s` : `${log.latencyMs}ms`}</td>
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
        <div className="bg-slate-50 rounded-lg p-3"><p className="text-[10px] text-slate-400 uppercase font-semibold">Stage</p><p className="font-semibold text-slate-800 mt-0.5">{alert.stage}</p></div>
        <div className="bg-red-50/60 rounded-lg p-3"><p className="text-[10px] text-slate-400 uppercase font-semibold">Current Rate</p><p className="text-red-700 font-bold text-lg mt-0.5">{alert.currentConversion}%</p></div>
        <div className="bg-emerald-50/60 rounded-lg p-3"><p className="text-[10px] text-slate-400 uppercase font-semibold">Before (1h ago)</p><p className="text-emerald-700 font-bold text-lg mt-0.5">{alert.previousConversion}%</p></div>
        <div className="bg-amber-50/60 rounded-lg p-3"><p className="text-[10px] text-slate-400 uppercase font-semibold">Active Since</p><p className="text-amber-700 font-bold text-lg mt-0.5">{alert.sinceDuration}</p></div>
      </div>
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

// ─── Main Page ──────────────────────────────────────────────────────────

export default function InsightLandingPage() {
  const { setActiveView, setSelectedLender, navigateToStageDetail, openIssuePanel } = useDashboard();
  const [lenderFilter, setLenderFilter] = useState('All Lenders');

  const lenderKey = lenderFilter === 'All Lenders' ? 'ALL' : lenderFilter;

  const funnelData = useMemo(() => funnelByLender[lenderKey] || funnelByLender.ALL, [lenderKey]);

  const funnelStats = useMemo(() => {
    const first = funnelData[0];
    const last = funnelData[funnelData.length - 1];
    const overallConv = ((last.count / first.count) * 100).toFixed(2);
    const delta = ((first.count - first.lmtdCount) / first.lmtdCount * 100).toFixed(1);
    return { overallConv, delta, appLoads: first.count, leadsCompleted: last.count };
  }, [funnelData]);

  // T-1 deltas from dailyFunnel
  const t1Deltas = useMemo(() => {
    const last = dailyFunnel[dailyFunnel.length - 1];
    const prev = dailyFunnel[dailyFunnel.length - 2];
    if (!last || !prev) return {};
    const firstStage = 'APPLICATION_LOADED';
    const lastStage = 'LEAD_SUCCESSFULLY_CLOSED';
    const convNow = last[lastStage]?.count && last[firstStage]?.count ? (last[lastStage].count / last[firstStage].count * 100) : 0;
    const convPrev = prev[lastStage]?.count && prev[firstStage]?.count ? (prev[lastStage].count / prev[firstStage].count * 100) : 0;
    const convDelta = convPrev > 0 ? ((convNow - convPrev) / convPrev * 100) : 0;

    const disbDelta = -1.2;
    const ticketDelta = 2.1;
    const portfolioDelta = 0.8;
    const disbAmtDelta = -0.9;

    return { conversion: parseFloat(convDelta.toFixed(1)), disbCount: disbDelta, disbAmt: disbAmtDelta, tickets: ticketDelta, portfolio: portfolioDelta };
  }, []);

  const disbCount = useMemo(() => {
    if (lenderKey === 'ALL') return disbursementKPIs.count;
    if (lenderKey === 'SSFB') return 2847;
    return 1533;
  }, [lenderKey]);

  const disbAmtCr = useMemo(() => {
    if (lenderKey === 'ALL') return disbursementKPIs.totalAmountCr;
    if (lenderKey === 'SSFB') return 15.9;
    return 8.6;
  }, [lenderKey]);

  const totalTickets = useMemo(() => {
    const base = issueCategories.reduce((s, i) => s + i.mtdCount, 0);
    if (lenderKey === 'ALL') return base;
    if (lenderKey === 'SSFB') return Math.round(base * 0.62);
    return Math.round(base * 0.38);
  }, [lenderKey]);

  const topIssue = useMemo(() => {
    const sorted = [...issueCategories].sort((a, b) => b.mtdCount - a.mtdCount);
    return sorted[0];
  }, []);

  const portfolioAccounts = useMemo(() => {
    const base = currentMonthKPIs.totalActiveAccounts;
    if (lenderKey === 'ALL') return base;
    if (lenderKey === 'SSFB') return Math.round(base * 0.65);
    return Math.round(base * 0.35);
  }, [lenderKey]);

  const funnelSparkData = useMemo(() => dailyFunnel.slice(-7).map(d => ({ v: d.LEAD_SUCCESSFULLY_CLOSED?.count || 0 })), []);
  const cstSparkData = useMemo(() => topIssue?.dailyCounts ? topIssue.dailyCounts.map(c => ({ v: c })) : [], [topIssue]);
  const portfolioSparkData = useMemo(() => [{ v: 9483 }, { v: 37183 }, { v: 87037 }, { v: 84534 }, { v: 72404 }, { v: 62202 }], []);
  const disbursementSparkData = useMemo(() => [{ v: 4200 }, { v: 4350 }, { v: 4100 }, { v: 4500 }, { v: 4280 }, { v: 4420 }, { v: 4380 }], []);

  const quickDeepdive = useMemo(() => {
    const items = [];
    const funnelDelta = parseFloat(funnelStats.delta);
    if (funnelDelta < -5) items.push({ text: `Landing page views down ${Math.abs(funnelDelta)}% vs LMTD`, section: 'snapshot', rag: 'red' });
    const redIssues = issueCategories.filter(i => i.pctShare > 10);
    redIssues.forEach(i => items.push({ text: `${i.subCategory}: ${i.pctShare}% of tickets`, section: 'userPulse', rag: 'red' }));
    if (currentMonthKPIs.spacMoM < -10) items.push({ text: `SPAC declined ${Math.abs(currentMonthKPIs.spacMoM)}% MoM`, section: 'postOnboarding', rag: 'amber' });
    if (disbursementKPIs.approvalToDisbMoM < -1) items.push({ text: `Approval→Disbursement down ${Math.abs(disbursementKPIs.approvalToDisbMoM)}pp MoM`, section: 'disbursement', rag: 'amber' });
    return items;
  }, [funnelStats]);

  const sectionRagCounts = useMemo(() => {
    const src = funnelByLender[lenderKey] || funnelByLender.ALL;
    let fRed = 0, fAmber = 0;
    src.forEach(s => {
      if (s.conversionRate == null || s.lmtdConvRate == null) return;
      const d = s.conversionRate - s.lmtdConvRate;
      if (d < -2) fRed++; else if (d < -0.5) fAmber++;
    });

    const lenderMul = lenderKey === 'SSFB' ? 0.6 : lenderKey === 'JANA' ? 0.4 : 1;
    const pRed = Math.round(1 * lenderMul) || 0;
    const pAmber = Math.round(2 * lenderMul) || 1;
    const dRed = lenderKey === 'ALL' ? 0 : 0;
    const dAmber = lenderKey === 'ALL' ? 1 : 1;
    const cRed = Math.round(2 * lenderMul) || 1;
    const cAmber = Math.round(1 * lenderMul) || 0;

    return {
      funnel: { red: fRed, amber: fAmber },
      disbursement: { red: dRed, amber: dAmber },
      pulse: { red: cRed, amber: cAmber },
      postOnb: { red: pRed, amber: pAmber },
    };
  }, [lenderKey]);

  const handleLenderChange = (val) => {
    setLenderFilter(val);
    setSelectedLender(val === 'All Lenders' ? 'ALL' : val);
  };

  // 2x2 Matrix: T-1 signals split by Onboarding vs Post-onboarding, Improved vs Decline
  const matrixData = useMemo(() => {
    const items = [];

    // Funnel stages (onboarding signals)
    const lastDay = dailyFunnel[dailyFunnel.length - 1];
    const prevDay = dailyFunnel[dailyFunnel.length - 2];
    if (lastDay && prevDay) {
      Object.keys(lastDay).filter(k => k !== 'date').forEach(stage => {
        if (!lastDay[stage]?.count || !prevDay[stage]?.count) return;
        const pct = ((lastDay[stage].count - prevDay[stage].count) / prevDay[stage].count) * 100;
        if (Math.abs(pct) > 2) {
          items.push({
            text: stage.replace(/_/g, ' '),
            delta: parseFloat(pct.toFixed(1)),
            category: 'onboarding',
            action: () => navigateToStageDetail(stage),
          });
        }
      });
    }

    // User Pulse issues (split by charter)
    const issues = getFilteredIssues('all', '7d');
    issues.forEach(i => {
      if (Math.abs(i.delta) > 5) {
        const cat = i.charter === 'onboarding' ? 'onboarding' : 'postonboarding';
        items.push({
          text: i.subCategory,
          delta: i.delta,
          category: cat,
          action: () => openIssuePanel(i.id),
        });
      }
    });

    // Add post-onboarding recon signals (static for now)
    items.push({ text: 'Collection Efficiency', delta: 0.8, category: 'postonboarding', action: () => setActiveView('postOnboarding') });
    items.push({ text: 'Unreconciled Repayments', delta: -3.2, category: 'postonboarding', action: () => setActiveView('postOnboarding') });

    const onb = items.filter(i => i.category === 'onboarding');
    const postOnb = items.filter(i => i.category === 'postonboarding');

    return {
      onbImproved: onb.filter(i => i.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 5),
      onbDecline: onb.filter(i => i.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 5),
      postImproved: postOnb.filter(i => i.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 5),
      postDecline: postOnb.filter(i => i.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 5),
    };
  }, [navigateToStageDetail, openIssuePanel, setActiveView]);

  return (
    <div className="space-y-5">
      {/* P2.1: Watch List */}
      <WatchListStrip navigateToStageDetail={navigateToStageDetail} openIssuePanel={openIssuePanel} />

      {/* Lender Filter */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 p-0.5">
          {INSIGHT_LENDERS.map((l) => (
            <button
              key={l}
              onClick={() => handleLenderChange(l)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                lenderFilter === l ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics with T-1 deltas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard
          label="Lead to Conversion (%)"
          value={`${funnelStats.overallConv}%`}
          delta={`${funnelStats.delta}% vs Jan`}
          deltaLabel="MTD"
          rag={parseFloat(funnelStats.delta) < -5 ? 'red' : parseFloat(funnelStats.delta) < 0 ? 'amber' : 'green'}
          onClick={() => setActiveView('snapshot')}
          t1Delta={t1Deltas.conversion}
        />
        <KpiCard
          label="Disbursement (#accounts)"
          value={disbCount.toLocaleString()}
          delta={`${disbursementKPIs.countMoM > 0 ? '+' : ''}${disbursementKPIs.countMoM}% MoM`}
          deltaLabel=""
          rag={disbursementKPIs.countMoM > 0 ? 'green' : 'red'}
          onClick={() => setActiveView('disbursement')}
          t1Delta={t1Deltas.disbCount}
        />
        <KpiCard
          label="Disbursement Value (Cr)"
          value={`₹${disbAmtCr}`}
          delta={`${disbursementKPIs.amountMoM > 0 ? '+' : ''}${disbursementKPIs.amountMoM}% MoM`}
          deltaLabel=""
          rag={disbursementKPIs.amountMoM > 0 ? 'green' : 'red'}
          onClick={() => setActiveView('disbursement')}
          t1Delta={t1Deltas.disbAmt}
        />
        <KpiCard
          label="Tickets"
          value={totalTickets.toLocaleString()}
          delta={`Top: ${topIssue?.pctShare}% share`}
          deltaLabel={topIssue?.subCategory?.slice(0, 20)}
          rag={topIssue?.pctShare > 10 ? 'red' : 'amber'}
          onClick={() => setActiveView('userPulse')}
          t1Delta={t1Deltas.tickets}
        />
        <KpiCard
          label="Active Transacting Users"
          value={portfolioAccounts.toLocaleString()}
          delta={`${currentMonthKPIs.txningUsersMoM > 0 ? '+' : ''}${currentMonthKPIs.txningUsersMoM}% txn users`}
          deltaLabel="MoM"
          rag={currentMonthKPIs.txningUsersMoM > 5 ? 'green' : 'amber'}
          onClick={() => setActiveView('postOnboarding')}
          t1Delta={t1Deltas.portfolio}
        />
      </div>

      {/* Section Cards (lender-dependent) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="Onboarding Funnel"
          summary={`${funnelStats.overallConv}% end-to-end conversion. ${funnelStats.leadsCompleted.toLocaleString()} leads completed MTD.`}
          sparkData={funnelSparkData}
          sparkColor="#3b82f6"
          ragCount={sectionRagCounts.funnel}
          onClick={() => setActiveView('snapshot')}
        />
        <SectionCard
          title="Disbursement Analysis"
          summary={`${disbCount.toLocaleString()} disbursements MTD worth ₹${disbAmtCr} Cr. Avg TAT ${disbursementKPIs.avgTATHours} hours.`}
          sparkData={disbursementSparkData}
          sparkColor="#10b981"
          ragCount={sectionRagCounts.disbursement}
          onClick={() => setActiveView('disbursement')}
        />
        <SectionCard
          title="User Pulse — CST"
          summary={`${totalTickets.toLocaleString()} tickets MTD. Top issue: ${topIssue?.subCategory} at ${topIssue?.pctShare}% share.`}
          sparkData={cstSparkData}
          sparkColor="#f59e0b"
          ragCount={sectionRagCounts.pulse}
          onClick={() => setActiveView('userPulse')}
        />
        <SectionCard
          title="Post-Onboarding"
          summary={`${portfolioAccounts.toLocaleString()} active accounts. GMV ${currentMonthKPIs.gmvCr} Cr (+${currentMonthKPIs.gmvMoM}% MoM).`}
          sparkData={portfolioSparkData}
          sparkColor="#8b5cf6"
          ragCount={sectionRagCounts.postOnb}
          onClick={() => setActiveView('postOnboarding')}
        />
      </div>

      {/* MTD Deepdive */}
      {quickDeepdive.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">MTD Deepdive</h2>
          <div className="space-y-2">
            {quickDeepdive.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1.5 -mx-2 transition-colors" onClick={() => setActiveView(item.section)}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.rag === 'red' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <span className="text-sm text-slate-700">{item.text}</span>
                <span className="text-[10px] text-blue-600 ml-auto font-medium">View &rarr;</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What Changed — Today vs Yesterday */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">What Changed — Today vs Yesterday</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Signals that moved significantly — split by charter and direction</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-100">
          <div className="px-4 py-2 bg-emerald-50/40 border-b border-slate-100">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Improved (Today vs Yesterday)</p>
          </div>
          <div className="px-4 py-2 bg-red-50/40 border-b border-slate-100">
            <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide">Decline (Today vs Yesterday)</p>
          </div>
        </div>
        {/* Row 1: Onboarding */}
        <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
          <div className="px-4 py-3">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Onboarding</p>
            {matrixData.onbImproved.length === 0 && <p className="text-[10px] text-slate-300">No improvements detected</p>}
            {matrixData.onbImproved.map((item, i) => (
              <div key={i} onClick={item.action} className="flex items-center justify-between py-1 cursor-pointer hover:bg-emerald-50/50 -mx-1 px-1 rounded transition-colors">
                <span className="text-[11px] text-slate-700 truncate flex-1 mr-2">{item.text}</span>
                <span className="text-[11px] font-bold text-emerald-600 flex-shrink-0">▲ {item.delta.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div className="px-4 py-3">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Onboarding</p>
            {matrixData.onbDecline.length === 0 && <p className="text-[10px] text-slate-300">No declines detected</p>}
            {matrixData.onbDecline.map((item, i) => (
              <div key={i} onClick={item.action} className="flex items-center justify-between py-1 cursor-pointer hover:bg-red-50/50 -mx-1 px-1 rounded transition-colors">
                <span className="text-[11px] text-slate-700 truncate flex-1 mr-2">{item.text}</span>
                <span className="text-[11px] font-bold text-red-600 flex-shrink-0">▼ {Math.abs(item.delta).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
        {/* Row 2: Post-onboarding */}
        <div className="grid grid-cols-2 divide-x divide-slate-100">
          <div className="px-4 py-3">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Post Onboarding</p>
            {matrixData.postImproved.length === 0 && <p className="text-[10px] text-slate-300">No improvements detected</p>}
            {matrixData.postImproved.map((item, i) => (
              <div key={i} onClick={item.action} className="flex items-center justify-between py-1 cursor-pointer hover:bg-emerald-50/50 -mx-1 px-1 rounded transition-colors">
                <span className="text-[11px] text-slate-700 truncate flex-1 mr-2">{item.text}</span>
                <span className="text-[11px] font-bold text-emerald-600 flex-shrink-0">▲ {item.delta.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div className="px-4 py-3">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Post Onboarding</p>
            {matrixData.postDecline.length === 0 && <p className="text-[10px] text-slate-300">No declines detected</p>}
            {matrixData.postDecline.map((item, i) => (
              <div key={i} onClick={item.action} className="flex items-center justify-between py-1 cursor-pointer hover:bg-red-50/50 -mx-1 px-1 rounded transition-colors">
                <span className="text-[11px] text-slate-700 truncate flex-1 mr-2">{item.text}</span>
                <span className="text-[11px] font-bold text-red-600 flex-shrink-0">▼ {Math.abs(item.delta).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts (lender-filtered) */}
      <SystemAlertsPanel navigateToStageDetail={navigateToStageDetail} lenderKey={lenderKey} />
    </div>
  );
}
