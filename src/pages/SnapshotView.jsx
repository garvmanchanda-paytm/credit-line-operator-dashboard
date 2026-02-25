import { useMemo, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { funnelByLender } from '../mockData/funnelMTD';
import { closedByLender } from '../mockData/funnelClosed';
import { dailyFunnel, lmsdData } from '../mockData/dailyFunnel';
import VerticalFunnel from '../components/VerticalFunnel';
import KPIStrip from '../components/KPIStrip';
import RAGBadge from '../components/RAGBadge';
import { formatNumber } from '../utils/rag';

const FUNNEL_LENDERS = ['SSFB', 'JANA'];

function generateCommentary(funnelType, data) {
  const first = data[0];
  const last = data[data.length - 1];
  const overallConv = (last.count / first.count * 100).toFixed(2);

  let worstStage = null;
  let worstConv = Infinity;
  data.forEach(s => {
    if (s.conversionRate != null && s.conversionRate < worstConv && s.conversionRate < 100) {
      worstConv = s.conversionRate;
      worstStage = s;
    }
  });

  const appLoadDelta = funnelType === 'open'
    ? ((first.count - first.lmtdCount) / first.lmtdCount * 100).toFixed(1)
    : null;

  return [
    {
      rag: 'red',
      text: funnelType === 'open'
        ? `App loads at ${formatNumber(first.count)} MTD, down ${Math.abs(appLoadDelta)}% vs Jan. Top-of-funnel volume pressure continues.`
        : `Closed funnel started with ${formatNumber(first.count)} users MTD. Overall end-to-end conversion at ${overallConv}%.`,
    },
    {
      rag: 'amber',
      text: `Biggest bottleneck: ${worstStage?.displayLabel} at ${worstConv.toFixed(1)}% step conversion — needs investigation.`,
    },
    {
      rag: 'green',
      text: `Leads closed at ${formatNumber(last.count)} (${overallConv}% overall). eSign and mandate stages are tracking healthy.`,
    },
  ];
}

function buildLMTDData(data) {
  return data.map(s => ({
    stage: s.stage,
    displayLabel: s.displayLabel,
    count: s.lmtdCount,
    conversionRate: s.lmtdConvRate,
  }));
}

function buildT1Data(data) {
  const lastDay = dailyFunnel[dailyFunnel.length - 1];
  if (!lastDay) return [];
  return data.map(s => {
    const dayData = lastDay[s.stage];
    return {
      stage: s.stage,
      displayLabel: s.displayLabel,
      count: dayData?.count ?? 0,
      conversionRate: dayData?.conversion ?? null,
    };
  }).filter(s => s.count > 0);
}

function buildLMSDData(data) {
  const lastDayIdx = dailyFunnel.length - 1;
  const lmsd = lmsdData[lastDayIdx];
  if (!lmsd) return [];
  return data.map(s => {
    const dayData = lmsd[s.stage];
    return {
      stage: s.stage,
      displayLabel: s.displayLabel,
      count: dayData?.count ?? 0,
      conversionRate: dayData?.conversion ?? null,
    };
  }).filter(s => s.count > 0);
}

export default function SnapshotView() {
  const { funnelType, setFunnelType, selectedLender, setSelectedLender } = useDashboard();
  const [localFunnelType, setLocalFunnelType] = useState(funnelType);

  const effectiveLender = FUNNEL_LENDERS.includes(selectedLender) ? selectedLender : 'SSFB';

  const handleToggle = (type) => {
    setLocalFunnelType(type);
    setFunnelType(type);
  };

  const mtdData = useMemo(() => {
    const src = localFunnelType === 'open' ? funnelByLender : closedByLender;
    return src[effectiveLender] || src.SSFB;
  }, [localFunnelType, effectiveLender]);

  const commentary = useMemo(() => generateCommentary(localFunnelType, mtdData), [localFunnelType, mtdData]);
  const lmtdData = useMemo(() => buildLMTDData(mtdData), [mtdData]);
  const t1Data = useMemo(() => buildT1Data(mtdData), [mtdData]);
  const lmsdDisplayData = useMemo(() => buildLMSDData(mtdData), [mtdData]);

  return (
    <div className="space-y-5">
      {/* Commentary */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Funnel Health Summary</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
              {FUNNEL_LENDERS.map(l => (
                <button
                  key={l}
                  onClick={() => setSelectedLender(l)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    effectiveLender === l ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400">Feb 2026 MTD</span>
          </div>
        </div>
        <div className="space-y-2">
          {commentary.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <RAGBadge status={line.rag} />
              <p className="text-sm text-slate-700 leading-snug">{line.text}</p>
            </div>
          ))}
        </div>
      </div>

      <KPIStrip />

      {/* 2x2 Funnel Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">Funnel Comparison</h2>
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => handleToggle('open')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                localFunnelType === 'open' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Open Funnel
            </button>
            <button
              onClick={() => handleToggle('closed')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                localFunnelType === 'closed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Closed Funnel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50 min-h-[420px]">
            <VerticalFunnel data={mtdData} title="Feb MTD" comparisonData={lmtdData} comparisonLabel="vs LMTD" funnelType={localFunnelType} />
          </div>
          <div className="border border-slate-100 rounded-lg p-3 bg-blue-50/30 min-h-[420px]">
            <VerticalFunnel data={lmtdData} title="Jan MTD (LMTD)" comparisonData={mtdData} comparisonLabel="vs MTD" funnelType={localFunnelType} />
          </div>
          <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50 min-h-[420px]">
            <VerticalFunnel data={t1Data} title="T-1 (Yesterday)" comparisonData={lmsdDisplayData} comparisonLabel="vs LMSD" funnelType={localFunnelType} />
          </div>
          <div className="border border-slate-100 rounded-lg p-3 bg-blue-50/30 min-h-[420px]">
            <VerticalFunnel data={lmsdDisplayData} title="LMSD (Last Month Same Day)" comparisonData={t1Data} comparisonLabel="vs T-1" funnelType={localFunnelType} />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded-sm bg-emerald-500" /> Better than comparison</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded-sm bg-amber-500" /> -0.5 to -2pp</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded-sm bg-red-500" /> &gt;2pp drop</span>
          <span className="text-slate-300">|</span>
          <span>Click any stage to drill down</span>
        </div>
      </div>
    </div>
  );
}
