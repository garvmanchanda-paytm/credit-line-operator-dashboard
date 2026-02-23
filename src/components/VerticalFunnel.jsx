import { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { getConversionRAG, RAG_COLORS, formatNumber } from '../utils/rag';

const RAG_BAR_COLORS = {
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  gray: '#94a3b8',
};

export default function VerticalFunnel({ data, title, comparisonData, comparisonLabel, funnelType: ftOverride }) {
  const { openDrillDown, funnelType: ctxFunnelType } = useDashboard();
  const funnelType = ftOverride ?? ctxFunnelType;

  const stages = useMemo(() => {
    if (!data || data.length === 0) return [];
    const maxCount = data[0].count;
    return data.map(stage => {
      const widthPct = Math.max((stage.count / maxCount) * 100, 8);
      const compStage = comparisonData?.find(c =>
        c.stage === stage.stage || c.displayLabel === stage.displayLabel
      );
      const compConv = compStage?.conversionRate ?? compStage?.lmtdConvRate ?? null;
      const currentConv = stage.conversionRate;
      const delta = (currentConv != null && compConv != null) ? currentConv - compConv : null;
      const rag = currentConv != null ? getConversionRAG(currentConv, compConv) : 'gray';
      return { ...stage, widthPct, delta, rag, compConv };
    });
  }, [data, comparisonData]);

  if (stages.length === 0) return null;

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 px-1">{title}</h3>
      <div className="flex-1 flex flex-col justify-between gap-0.5 min-h-0">
        {stages.map((stage, idx) => (
          <div
            key={stage.stage || idx}
            className="group flex items-center gap-1.5 cursor-pointer"
            onClick={() => stage.stage && openDrillDown(stage.stage)}
          >
            <div className="w-[90px] flex-shrink-0 text-right pr-1">
              <span className="text-[10px] leading-none text-slate-600 font-medium whitespace-nowrap">{stage.displayLabel}</span>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="relative w-full flex justify-center">
                <div
                  className="h-[18px] rounded-sm transition-all group-hover:opacity-80 relative flex items-center justify-center"
                  style={{
                    width: `${stage.widthPct}%`,
                    backgroundColor: RAG_BAR_COLORS[stage.rag],
                    opacity: 0.85,
                    minWidth: '32px',
                  }}
                >
                  <span className="text-[9px] font-bold text-white leading-none" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                    {formatNumber(stage.count)}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-[56px] flex-shrink-0 text-left pl-0.5">
              {stage.conversionRate != null && stage.conversionRate <= 100 ? (
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                    {stage.conversionRate.toFixed(1)}%
                  </span>
                  {stage.delta != null && (
                    <span className={`text-[11px] font-bold leading-tight ${
                      stage.delta >= 0.5 ? 'text-emerald-600' :
                      stage.delta <= -0.5 ? 'text-red-500' :
                      'text-slate-400'
                    }`}>
                      {stage.delta > 0 ? '+' : ''}{stage.delta.toFixed(1)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-[9px] text-slate-300">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
