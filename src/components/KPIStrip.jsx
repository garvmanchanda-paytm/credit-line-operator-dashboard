import { useDashboard } from '../context/DashboardContext';
import { funnelMTD } from '../mockData/funnelMTD';
import { funnelClosed } from '../mockData/funnelClosed';
import RAGBadge from './RAGBadge';
import { formatNumber } from '../utils/rag';

function getKPIs(funnelType) {
  const data = funnelType === 'open' ? funnelMTD : funnelClosed;
  const first = data[0];
  const last = data[data.length - 1];

  const appLoads = first.count;
  const appLoadsLmtd = first.lmtdCount;
  const appLoadsDelta = appLoadsLmtd
    ? ((appLoads - appLoadsLmtd) / appLoadsLmtd * 100)
    : null;
  const appLoadsRAG = appLoadsDelta == null ? 'gray'
    : appLoadsDelta > -2 ? 'green'
    : appLoadsDelta > -5 ? 'amber'
    : 'red';

  const overallConv = (last.count / first.count * 100);
  const source = funnelType === 'open' ? funnelMTD : funnelClosed;
  const overallConvLmtd = source[source.length - 1].lmtdCount && source[0].lmtdCount
    ? (source[source.length - 1].lmtdCount / source[0].lmtdCount * 100)
    : null;
  const convDelta = overallConvLmtd ? (overallConv - overallConvLmtd) : null;
  const convRAG = convDelta == null ? 'gray'
    : convDelta >= 0 ? 'green'
    : convDelta > -0.1 ? 'amber'
    : 'red';

  const leadsClosed = last.count;
  const leadsClosedLmtd = last.lmtdCount;
  const leadsDelta = leadsClosedLmtd
    ? ((leadsClosed - leadsClosedLmtd) / leadsClosedLmtd * 100)
    : null;
  const leadsRAG = leadsDelta == null ? 'gray'
    : leadsDelta > -5 ? 'green'
    : leadsDelta > -10 ? 'amber'
    : 'red';

  let worstStage = null;
  let worstConv = Infinity;
  data.forEach(s => {
    if (s.conversionRate != null && s.conversionRate < worstConv && s.conversionRate < 100) {
      worstConv = s.conversionRate;
      worstStage = s;
    }
  });

  return [
    {
      label: funnelType === 'open' ? 'Landing Page Views (MTD)' : 'Started (MTD)',
      value: formatNumber(appLoads),
      delta: appLoadsDelta != null ? `${appLoadsDelta > 0 ? '+' : ''}${appLoadsDelta.toFixed(1)}%` : '—',
      rag: appLoadsRAG,
    },
    {
      label: 'Overall Conversion',
      value: `${overallConv.toFixed(2)}%`,
      delta: convDelta != null ? `${convDelta > 0 ? '+' : ''}${convDelta.toFixed(2)}pp` : '—',
      rag: convRAG,
    },
    {
      label: 'Leads Closed (MTD)',
      value: formatNumber(leadsClosed),
      delta: leadsDelta != null ? `${leadsDelta > 0 ? '+' : ''}${leadsDelta.toFixed(1)}%` : '—',
      rag: leadsRAG,
    },
    {
      label: 'Biggest Drop Stage',
      value: worstStage ? `${worstStage.displayLabel}: ${worstConv.toFixed(1)}%` : '—',
      delta: worstStage && funnelType === 'open'
        ? `vs ${worstStage.lmtdConvRate?.toFixed(1) ?? '—'}%`
        : '—',
      rag: 'amber',
    },
  ];
}

export default function KPIStrip() {
  const { funnelType } = useDashboard();
  const kpis = getKPIs(funnelType);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{kpi.label}</span>
            <RAGBadge status={kpi.rag} />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{kpi.value}</div>
          <div className={`text-sm ${
            kpi.rag === 'green' ? 'text-emerald-600' :
            kpi.rag === 'red' ? 'text-red-600' :
            kpi.rag === 'amber' ? 'text-amber-600' :
            'text-slate-500'
          }`}>
            {kpi.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
