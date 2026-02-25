import { useDashboard } from '../context/DashboardContext';
import { funnelByLender } from '../mockData/funnelMTD';
import { closedByLender } from '../mockData/funnelClosed';
import RAGBadge from './RAGBadge';
import { formatNumber } from '../utils/rag';

function getKPIs(funnelType, selectedLender) {
  const src = funnelType === 'open' ? funnelByLender : closedByLender;
  const data = src[selectedLender] || src.ALL;
  const first = data[0];
  const last = data[data.length - 1];

  const appLoads = first.count;
  const appLoadsLmtd = first.lmtdCount;
  const appLoadsDelta = appLoadsLmtd ? ((appLoads - appLoadsLmtd) / appLoadsLmtd * 100) : null;
  const appLoadsRAG = appLoadsDelta == null ? 'gray' : appLoadsDelta > -2 ? 'green' : appLoadsDelta > -5 ? 'amber' : 'red';

  const overallConv = (last.count / first.count * 100);
  const overallConvLmtd = (data[data.length - 1].lmtdCount && data[0].lmtdCount)
    ? (data[data.length - 1].lmtdCount / data[0].lmtdCount * 100) : null;
  const convDelta = overallConvLmtd ? (overallConv - overallConvLmtd) : null;
  const convRAG = convDelta == null ? 'gray' : convDelta >= 0 ? 'green' : convDelta > -0.1 ? 'amber' : 'red';

  const leadsClosed = last.count;
  const leadsClosedLmtd = last.lmtdCount;
  const leadsDelta = leadsClosedLmtd ? ((leadsClosed - leadsClosedLmtd) / leadsClosedLmtd * 100) : null;
  const leadsRAG = leadsDelta == null ? 'gray' : leadsDelta > -5 ? 'green' : leadsDelta > -10 ? 'amber' : 'red';

  const deviations = data
    .filter(s => s.conversionRate != null && s.lmtdConvRate != null && s.conversionRate < 100)
    .map(s => ({ label: s.displayLabel, mtd: s.conversionRate, lmtd: s.lmtdConvRate, dev: s.conversionRate - s.lmtdConvRate }))
    .sort((a, b) => a.dev - b.dev)
    .slice(0, 3);

  return {
    cards: [
      { label: funnelType === 'open' ? 'Landing Page Views (MTD)' : 'Started (MTD)', value: formatNumber(appLoads), delta: appLoadsDelta != null ? `${appLoadsDelta > 0 ? '+' : ''}${appLoadsDelta.toFixed(1)}%` : '—', rag: appLoadsRAG },
      { label: 'Overall Conversion', value: `${overallConv.toFixed(2)}%`, delta: convDelta != null ? `${convDelta > 0 ? '+' : ''}${convDelta.toFixed(2)}pp` : '—', rag: convRAG },
      { label: 'Leads Closed (MTD)', value: formatNumber(leadsClosed), delta: leadsDelta != null ? `${leadsDelta > 0 ? '+' : ''}${leadsDelta.toFixed(1)}%` : '—', rag: leadsRAG },
    ],
    keyDropoffs: deviations,
  };
}

export default function KPIStrip() {
  const { funnelType, selectedLender } = useDashboard();
  const { cards, keyDropoffs } = getKPIs(funnelType, selectedLender);

  return (
    <div className="space-y-3 mb-6">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {cards.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{kpi.label}</span>
              <RAGBadge status={kpi.rag} />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{kpi.value}</div>
            <div className={`text-sm ${kpi.rag === 'green' ? 'text-emerald-600' : kpi.rag === 'red' ? 'text-red-600' : kpi.rag === 'amber' ? 'text-amber-600' : 'text-slate-500'}`}>{kpi.delta}</div>
          </div>
        ))}
      </div>

      {keyDropoffs.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Key Drop-off Stages</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Top 3 stages with highest deviation MTD vs LMTD</p>
            </div>
            <RAGBadge status="red" />
          </div>
          <div className="space-y-2.5">
            {keyDropoffs.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 w-4">{i + 1}.</span>
                  <span className="text-sm font-medium text-slate-700">{d.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{d.mtd.toFixed(1)}% <span className="text-slate-300">vs</span> {d.lmtd.toFixed(1)}%</span>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${d.dev < -2 ? 'bg-red-50 text-red-600' : d.dev < 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {d.dev > 0 ? '+' : ''}{d.dev.toFixed(1)}pp
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
