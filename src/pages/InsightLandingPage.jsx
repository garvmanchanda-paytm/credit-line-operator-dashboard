import { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { funnelMTD } from '../mockData/funnelMTD';
import { issueCategories } from '../mockData/issueCategories';
import { currentMonthKPIs } from '../mockData/portfolio';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { dailyFunnel } from '../mockData/dailyFunnel';

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
