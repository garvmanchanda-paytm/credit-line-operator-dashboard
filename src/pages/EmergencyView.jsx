import { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { funnelByLender } from '../mockData/funnelMTD';
import { getFilteredIssues } from '../mockData/issueCategories';
import { systemAlerts } from '../mockData/systemAlerts';

export default function EmergencyView() {
  const { setActiveView, navigateToStageDetail, openIssuePanel } = useDashboard();

  const redSignals = useMemo(() => {
    const signals = [];

    systemAlerts.filter(a => a.severity === 'critical').forEach(a => {
      signals.push({
        id: `alert-${a.id}`,
        pillar: 'System Alert',
        pillarColor: 'bg-red-100 text-red-700',
        title: a.title,
        detail: a.summary,
        severity: 10,
        action: () => setActiveView('insightLanding'),
      });
    });

    const funnelData = funnelByLender.ALL || [];
    funnelData.forEach(s => {
      const delta = s.lmtdCount > 0 ? ((s.count - s.lmtdCount) / s.lmtdCount * 100) : 0;
      if (delta < -5) {
        signals.push({
          id: `funnel-${s.stage}`,
          pillar: 'Funnel',
          pillarColor: 'bg-blue-100 text-blue-700',
          title: `${s.stage.replace(/_/g, ' ')}`,
          detail: `Count: ${s.count.toLocaleString()} (${delta.toFixed(1)}% vs LMTD)`,
          severity: Math.abs(delta),
          action: () => navigateToStageDetail(s.stage),
        });
      }
    });

    const issues = getFilteredIssues('all', '7d');
    issues.filter(i => i.delta > 5).forEach(i => {
      signals.push({
        id: `cst-${i.id}`,
        pillar: 'User Pulse',
        pillarColor: 'bg-amber-100 text-amber-700',
        title: i.subCategory,
        detail: `${i.windowCount.toLocaleString()} tickets (+${i.delta}% vs LMTD) · ${i.windowPctShare}% share`,
        severity: i.delta,
        action: () => openIssuePanel(i.id),
      });
    });

    systemAlerts.filter(a => a.severity === 'warning').forEach(a => {
      signals.push({
        id: `warn-${a.id}`,
        pillar: 'System Alert',
        pillarColor: 'bg-amber-100 text-amber-700',
        title: a.title,
        detail: a.summary,
        severity: 5,
        action: () => setActiveView('insightLanding'),
      });
    });

    signals.sort((a, b) => b.severity - a.severity);
    return signals;
  }, [setActiveView, navigateToStageDetail, openIssuePanel]);

  const criticalCount = redSignals.filter(s => s.severity >= 10).length;
  const warningCount = redSignals.filter(s => s.severity >= 5 && s.severity < 10).length;
  const redCount = redSignals.filter(s => s.severity < 5).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={() => setActiveView('insightLanding')} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">← Back to Home</button>
      </div>

      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
          <h1 className="text-lg font-bold">Emergency — Incident Command</h1>
        </div>
        <p className="text-sm text-red-100">All RED and critical signals across every pillar, ranked by severity. Click any row to investigate.</p>
        <div className="flex items-center gap-4 mt-3 text-xs">
          <span className="px-2 py-1 rounded bg-white/20 font-bold">{criticalCount} Critical</span>
          <span className="px-2 py-1 rounded bg-white/15 font-bold">{warningCount} Warning</span>
          <span className="px-2 py-1 rounded bg-white/10 font-bold">{redCount} Elevated</span>
          <span className="text-red-200 ml-auto">{redSignals.length} total signals</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-2.5 w-8">#</th>
                <th className="text-left px-4 py-2.5">Pillar</th>
                <th className="text-left px-4 py-2.5">Signal</th>
                <th className="text-left px-4 py-2.5">Detail</th>
                <th className="text-right px-4 py-2.5">Severity</th>
                <th className="text-center px-4 py-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {redSignals.map((sig, idx) => (
                <tr key={sig.id} className="hover:bg-red-50/30 cursor-pointer transition-colors" onClick={sig.action}>
                  <td className="px-4 py-3 font-mono text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sig.pillarColor}`}>{sig.pillar}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800 max-w-[250px] truncate">{sig.title}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-[350px] truncate">{sig.detail}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${sig.severity >= 10 ? 'bg-red-500' : sig.severity >= 5 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(sig.severity * 5, 100)}%` }} />
                      </div>
                      <span className="text-[10px] font-bold tabular-nums text-slate-600 w-8 text-right">{sig.severity.toFixed(0)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-blue-600 font-semibold text-[10px] hover:underline">Investigate →</span>
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
