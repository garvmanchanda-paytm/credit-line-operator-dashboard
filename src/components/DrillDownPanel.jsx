import { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { funnelMTD } from '../mockData/funnelMTD';
import { funnelClosed } from '../mockData/funnelClosed';
import { dailyFunnel } from '../mockData/dailyFunnel';
import SubStageTable from './SubStageTable';
import SelfieErrorBreakdown from './SelfieErrorBreakdown';
import StageSummary from './StageSummary';
import RAGBadge from './RAGBadge';
import { getConversionRAG, formatNumber } from '../utils/rag';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function MiniTrend({ stage }) {
  const trendData = useMemo(() => {
    const last7 = dailyFunnel.slice(-7);
    return last7.map(day => ({
      date: day.date.split('-')[2],
      conversion: day[stage]?.conversion ?? 0,
      count: day[stage]?.count ?? 0,
    }));
  }, [stage]);

  return (
    <div className="h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ fontSize: 11, border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 10px' }}
            formatter={(value) => [`${value.toFixed(1)}%`, 'Conv']}
          />
          <Line type="monotone" dataKey="conversion" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DrillDownPanel() {
  const { drillDownStage, closeDrillDown, funnelType } = useDashboard();

  const stageInfo = useMemo(() => {
    if (!drillDownStage) return null;
    const source = funnelType === 'open' ? funnelMTD : funnelClosed;
    return source.find(s => s.stage === drillDownStage);
  }, [drillDownStage, funnelType]);

  if (!drillDownStage) return null;

  const lmtdConv = stageInfo?.lmtdConvRate;
  const rag = stageInfo?.conversionRate != null
    ? getConversionRAG(stageInfo.conversionRate, lmtdConv)
    : 'gray';

  const isSelfieStage = drillDownStage === 'SELFIE_CAPTURED';

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={closeDrillDown}
      />

      <div className="fixed top-0 right-0 h-full w-1/2 bg-white shadow-2xl z-50 overflow-y-auto transition-transform">
        <div className="sticky top-0 bg-white border-b border-slate-200 z-10">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="hover:text-blue-600 cursor-pointer" onClick={closeDrillDown}>Dashboard</span>
              <span>/</span>
              <span>Feb 2026</span>
              <span>/</span>
              <span className="text-slate-900 font-medium">{stageInfo?.displayLabel}</span>
            </div>
            <button
              onClick={closeDrillDown}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-4 sm:px-6 pb-3 flex items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{stageInfo?.displayLabel}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                {stageInfo?.conversionRate != null && stageInfo.conversionRate <= 100 && (
                  <span className="text-sm font-semibold text-slate-700">
                    {stageInfo.conversionRate.toFixed(1)}% conversion
                  </span>
                )}
                <RAGBadge status={rag} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 space-y-5">
          {/* 0. Auto-generated summary */}
          <StageSummary stage={drillDownStage} />

          {/* 1. 7-Day L1 Stage Trend */}
          <section>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2">7-Day Trend</h3>
            <MiniTrend stage={drillDownStage} />
          </section>

          {/* 2. L2 Sub-Stage Table (clickable rows expand to sub-stage trend + API health) */}
          <section>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2">L2 Sub-Stages</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <SubStageTable parentStage={drillDownStage} />
            </div>
            {isSelfieStage && <SelfieErrorBreakdown />}
          </section>

          {/* 3. Annotation */}
          <section>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2">Annotation</h3>
            <AnnotationBox stage={drillDownStage} />
          </section>
        </div>
      </div>
    </>
  );
}

function AnnotationBox({ stage }) {
  const storageKey = `annotation_${stage}`;
  const saved = localStorage.getItem(storageKey) || '';

  const handleSave = (e) => {
    const value = e.target.value;
    if (value.trim()) {
      localStorage.setItem(storageKey, value);
    } else {
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <div>
      <textarea
        defaultValue={saved}
        onBlur={handleSave}
        placeholder="Add a note about this stage (e.g., 'Bureau API had downtime 12:00–14:00 on Feb 19')"
        className="w-full text-xs border border-slate-200 rounded-lg p-3 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
      />
      <p className="text-[10px] text-slate-400 mt-1">Saved to localStorage on blur</p>
    </div>
  );
}
