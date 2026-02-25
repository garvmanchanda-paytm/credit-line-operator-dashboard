import { useMemo, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { getConversionRAG, formatNumber } from '../utils/rag';

const RAG_FILLS = {
  green: { fill: '#22c55e', light: '#dcfce7' },
  amber: { fill: '#f59e0b', light: '#fef3c7' },
  red:   { fill: '#ef4444', light: '#fee2e2' },
  gray:  { fill: '#94a3b8', light: '#f1f5f9' },
};

export default function VerticalFunnel({ data, title, comparisonData, comparisonLabel, funnelType: ftOverride }) {
  const { navigateToStageDetail, funnelType: ctxFunnelType } = useDashboard();
  const funnelType = ftOverride ?? ctxFunnelType;
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const stages = useMemo(() => {
    if (!data || data.length === 0) return [];
    const maxCount = data[0].count;
    return data.map((stage) => {
      const widthRatio = Math.max(stage.count / maxCount, 0.10);
      const compStage = comparisonData?.find(
        (c) => c.stage === stage.stage || c.displayLabel === stage.displayLabel
      );
      const compConv = compStage?.conversionRate ?? compStage?.lmtdConvRate ?? null;
      const currentConv = stage.conversionRate;
      const delta = currentConv != null && compConv != null ? currentConv - compConv : null;
      const rag = currentConv != null ? getConversionRAG(currentConv, compConv) : 'gray';
      return { ...stage, widthRatio, delta, rag, compConv, compCount: compStage?.count ?? compStage?.lmtdCount ?? null };
    });
  }, [data, comparisonData]);

  if (stages.length === 0) return null;

  const SVG_WIDTH = 340;
  const STAGE_HEIGHT = 28;
  const GAP = 3;
  const totalHeight = stages.length * (STAGE_HEIGHT + GAP) - GAP;
  const centerX = SVG_WIDTH / 2;

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 px-1">{title}</h3>

      <div className="flex-1 min-h-0">
        {stages.map((stage, idx) => {
          const isHovered = hoveredIdx === idx;
          const colors = RAG_FILLS[stage.rag] || RAG_FILLS.gray;
          const bgClass = idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white';

          return (
            <div
              key={stage.stage || idx}
              className={`flex items-center gap-2 px-1.5 py-0.5 rounded-md cursor-pointer transition-all ${bgClass} ${isHovered ? 'ring-1 ring-blue-300 bg-blue-50/40' : 'hover:bg-blue-50/20'}`}
              style={{ height: STAGE_HEIGHT + GAP }}
              onClick={() => stage.stage && navigateToStageDetail(stage.stage)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Label */}
              <div className="flex-shrink-0 w-[85px]">
                <span className="text-[11px] leading-tight text-slate-700 font-medium block truncate" title={stage.displayLabel}>
                  {stage.displayLabel}
                </span>
              </div>

              {/* Funnel bar */}
              <div className="flex-1 min-w-0 flex items-center justify-center" style={{ height: STAGE_HEIGHT }}>
                <div
                  className="relative rounded-sm transition-all"
                  style={{
                    width: `${stage.widthRatio * 100}%`,
                    height: '100%',
                    background: `linear-gradient(135deg, ${colors.fill}dd, ${colors.fill}aa)`,
                    minWidth: 40,
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-white text-[11px] font-bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    {formatNumber(stage.count)}
                  </span>
                </div>
              </div>

              {/* Conversion + Delta */}
              <div className="flex-shrink-0 w-[72px] text-right">
                {stage.conversionRate != null && stage.conversionRate <= 100 ? (
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-semibold text-slate-800 leading-tight">
                      {stage.conversionRate.toFixed(1)}%
                    </span>
                    {stage.delta != null && (
                      <span className={`text-[12px] font-extrabold leading-tight ${
                        stage.delta >= 0.5 ? 'text-emerald-600' : stage.delta <= -0.5 ? 'text-red-500' : 'text-slate-400'
                      }`}>
                        {stage.delta > 0 ? '+' : ''}{stage.delta.toFixed(1)}pp
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-300">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover tooltip */}
      {hoveredIdx !== null && stages[hoveredIdx] && (
        <div className="mt-2 px-2 py-1.5 bg-slate-800 text-white rounded-lg text-[10px] leading-relaxed">
          <span className="font-semibold">{stages[hoveredIdx].displayLabel}</span>
          <span className="text-slate-300 mx-1.5">|</span>
          Count: {formatNumber(stages[hoveredIdx].count)}
          {stages[hoveredIdx].compCount != null && (
            <span className="text-slate-300"> (comp: {formatNumber(stages[hoveredIdx].compCount)})</span>
          )}
          {stages[hoveredIdx].conversionRate != null && stages[hoveredIdx].conversionRate <= 100 && (
            <>
              <span className="text-slate-300 mx-1.5">|</span>
              Conv: {stages[hoveredIdx].conversionRate.toFixed(1)}%
              {stages[hoveredIdx].compConv != null && <span className="text-slate-300"> (comp: {stages[hoveredIdx].compConv.toFixed(1)}%)</span>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
