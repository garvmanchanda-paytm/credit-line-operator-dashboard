import { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { funnelMTD } from '../mockData/funnelMTD';
import { funnelClosed } from '../mockData/funnelClosed';
import { dailyFunnel } from '../mockData/dailyFunnel';
import SubStageTable from '../components/SubStageTable';
import SelfieErrorBreakdown from '../components/SelfieErrorBreakdown';
import StageSummary from '../components/StageSummary';
import RAGBadge from '../components/RAGBadge';
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
    <div className="h-[140px]">
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

export default function StageDetailPage() {
  const { drillDownStage, navigateBackFromStageDetail, funnelType } = useDashboard();

  const stageInfo = useMemo(() => {
    if (!drillDownStage) return null;
    const source = funnelType === 'open' ? funnelMTD : funnelClosed;
    return source.find(s => s.stage === drillDownStage);
  }, [drillDownStage, funnelType]);

  if (!drillDownStage || !stageInfo) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-sm">No stage selected.</p>
        <button onClick={navigateBackFromStageDetail} className="text-blue-600 hover:underline text-sm mt-2">
          &larr; Back to Funnel
        </button>
      </div>
    );
  }

  const lmtdConv = stageInfo.lmtdConvRate;
  const rag = stageInfo.conversionRate != null
    ? getConversionRAG(stageInfo.conversionRate, lmtdConv)
    : 'gray';

  const isSelfieStage = drillDownStage === 'SELFIE_CAPTURED';

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={navigateBackFromStageDetail} className="hover:text-blue-600 transition-colors">
          Dashboard
        </button>
        <span>/</span>
        <button onClick={navigateBackFromStageDetail} className="hover:text-blue-600 transition-colors">
          Funnel
        </button>
        <span>/</span>
        <span className="text-slate-900 font-medium">{stageInfo.displayLabel}</span>
      </nav>

      {/* Stage Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{stageInfo.displayLabel}</h1>
            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">{stageInfo.stage}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{formatNumber(stageInfo.count)}</p>
              <p className="text-[11px] text-slate-400">Feb MTD</p>
            </div>
            {stageInfo.conversionRate != null && stageInfo.conversionRate <= 100 && (
              <div className="text-right">
                <p className="text-lg font-bold text-slate-700">{stageInfo.conversionRate.toFixed(1)}%</p>
                <p className="text-[11px] text-slate-400">Step Conv</p>
              </div>
            )}
            <RAGBadge status={rag} />
          </div>
        </div>
      </div>

      {/* Auto-generated summary */}
      <StageSummary stage={drillDownStage} />

      {/* 7-Day Trend */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">7-Day Trend</h3>
        <MiniTrend stage={drillDownStage} />
      </div>

      {/* L2 Sub-Stages */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">L2 Sub-Stages</h3>
        </div>
        <SubStageTable parentStage={drillDownStage} />
        {isSelfieStage && <SelfieErrorBreakdown />}
      </div>

      {/* Annotation */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2">Annotation</h3>
        <AnnotationBox stage={drillDownStage} />
      </div>
    </div>
  );
}
