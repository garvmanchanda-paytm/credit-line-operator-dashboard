import { useMemo } from 'react';
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

  const stages = useMemo(() => {
    if (!data || data.length === 0) return [];
    const maxCount = data[0].count;
    return data.map((stage) => {
      const widthRatio = Math.max(stage.count / maxCount, 0.08);
      const compStage = comparisonData?.find(
        (c) => c.stage === stage.stage || c.displayLabel === stage.displayLabel
      );
      const compConv = compStage?.conversionRate ?? compStage?.lmtdConvRate ?? null;
      const currentConv = stage.conversionRate;
      const delta = currentConv != null && compConv != null ? currentConv - compConv : null;
      const rag = currentConv != null ? getConversionRAG(currentConv, compConv) : 'gray';
      return { ...stage, widthRatio, delta, rag, compConv };
    });
  }, [data, comparisonData]);

  if (stages.length === 0) return null;

  const SVG_WIDTH = 300;
  const STAGE_HEIGHT = 22;
  const GAP = 2;
  const LABEL_AREA = 0;
  const totalHeight = stages.length * (STAGE_HEIGHT + GAP) - GAP;
  const centerX = SVG_WIDTH / 2;

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 px-1">{title}</h3>
      <div className="flex-1 min-h-0 flex">
        {/* Labels left */}
        <div className="flex flex-col justify-between flex-shrink-0 w-[90px] pr-1" style={{ height: totalHeight }}>
          {stages.map((stage, idx) => (
            <div
              key={stage.stage || idx}
              className="flex items-center justify-end cursor-pointer hover:text-blue-600"
              style={{ height: STAGE_HEIGHT }}
              onClick={() => stage.stage && navigateToStageDetail(stage.stage)}
            >
              <span className="text-[10px] leading-none text-slate-600 font-medium whitespace-nowrap truncate">
                {stage.displayLabel}
              </span>
            </div>
          ))}
        </div>

        {/* SVG Funnel */}
        <div className="flex-1 min-w-0">
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${totalHeight}`}
            width="100%"
            height={totalHeight}
            preserveAspectRatio="xMidYMin meet"
          >
            {stages.map((stage, idx) => {
              const y = idx * (STAGE_HEIGHT + GAP);
              const topWidth = idx === 0 ? stage.widthRatio : stages[idx - 1].widthRatio;
              const bottomWidth = stage.widthRatio;

              const topHalf = (topWidth * SVG_WIDTH) / 2;
              const bottomHalf = (bottomWidth * SVG_WIDTH) / 2;

              const points = [
                `${centerX - topHalf},${y}`,
                `${centerX + topHalf},${y}`,
                `${centerX + bottomHalf},${y + STAGE_HEIGHT}`,
                `${centerX - bottomHalf},${y + STAGE_HEIGHT}`,
              ].join(' ');

              const colors = RAG_FILLS[stage.rag] || RAG_FILLS.gray;

              return (
                <g
                  key={stage.stage || idx}
                  className="cursor-pointer"
                  onClick={() => stage.stage && navigateToStageDetail(stage.stage)}
                >
                  <polygon
                    points={points}
                    fill={colors.fill}
                    opacity={0.85}
                    className="transition-opacity hover:opacity-100"
                  />
                  <text
                    x={centerX}
                    y={y + STAGE_HEIGHT / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="9"
                    fontWeight="700"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
                  >
                    {formatNumber(stage.count)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Stats right */}
        <div className="flex flex-col justify-between flex-shrink-0 w-[56px] pl-1" style={{ height: totalHeight }}>
          {stages.map((stage, idx) => (
            <div
              key={stage.stage || idx}
              className="flex items-center"
              style={{ height: STAGE_HEIGHT }}
            >
              {stage.conversionRate != null && stage.conversionRate <= 100 ? (
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                    {stage.conversionRate.toFixed(1)}%
                  </span>
                  {stage.delta != null && (
                    <span
                      className={`text-[11px] font-bold leading-tight ${
                        stage.delta >= 0.5
                          ? 'text-emerald-600'
                          : stage.delta <= -0.5
                          ? 'text-red-500'
                          : 'text-slate-400'
                      }`}
                    >
                      {stage.delta > 0 ? '+' : ''}
                      {stage.delta.toFixed(1)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-[9px] text-slate-300">—</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
