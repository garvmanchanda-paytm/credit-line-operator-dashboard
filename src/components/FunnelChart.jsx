import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { funnelMTD } from '../mockData/funnelMTD';
import { funnelClosed } from '../mockData/funnelClosed';
import { getConversionRAG, RAG_COLORS, formatNumber } from '../utils/rag';

const BAR_COLORS = {
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  gray: '#94a3b8',
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm max-w-[220px]">
      <div className="font-semibold text-slate-900 mb-2">{d.displayLabel}</div>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">MTD</span>
          <span className="font-medium">{formatNumber(d.count)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">LMTD</span>
          <span className="font-medium">{formatNumber(d.lmtdCount)}</span>
        </div>
        {d.conversionRate != null && (
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Conv %</span>
            <span className="font-medium">{d.conversionRate.toFixed(1)}%</span>
          </div>
        )}
        {d.delta != null && (
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Delta</span>
            <span className={`font-medium ${d.delta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {d.delta > 0 ? '+' : ''}{d.delta.toFixed(1)}pp
            </span>
          </div>
        )}
      </div>
      <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-blue-600 font-medium">
        Click to drill down
      </div>
    </div>
  );
}

export default function FunnelChart() {
  const { funnelType, openDrillDown } = useDashboard();

  const chartData = useMemo(() => {
    const source = funnelType === 'open' ? funnelMTD : funnelClosed;
    const maxCount = source[0].count;

    return source.map(stage => {
      const lmtdConv = stage.lmtdConvRate;
      const delta = (stage.conversionRate != null && lmtdConv != null)
        ? stage.conversionRate - lmtdConv
        : null;
      const rag = stage.conversionRate != null
        ? getConversionRAG(stage.conversionRate, lmtdConv)
        : 'gray';

      return {
        ...stage,
        barWidth: (stage.count / maxCount) * 100,
        lmtdBarWidth: ((stage.lmtdCount ?? 0) / maxCount) * 100,
        delta,
        rag,
      };
    });
  }, [funnelType]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 mb-6">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">
        {funnelType === 'open' ? 'Open' : 'Closed'} Funnel — MTD
      </h2>

      <div className="space-y-2">
        {chartData.map((stage, idx) => (
          <div
            key={stage.stage}
            className="group flex items-center gap-3 cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1.5 -mx-2 transition-colors"
            onClick={() => openDrillDown(stage.stage)}
          >
            <div className="w-[120px] sm:w-[160px] flex-shrink-0 text-right">
              <span className="text-xs sm:text-sm text-slate-700 font-medium whitespace-nowrap">{stage.displayLabel}</span>
            </div>

            <div className="flex-1 relative h-8 sm:h-9">
              {funnelType === 'open' && stage.lmtdBarWidth > 0 && (
                <div
                  className="absolute top-0 left-0 h-full rounded-md bg-slate-100 border border-dashed border-slate-300"
                  style={{ width: `${Math.min(stage.lmtdBarWidth, 100)}%` }}
                />
              )}
              <div
                className="absolute top-0 left-0 h-full rounded-md transition-all group-hover:opacity-90"
                style={{
                  width: `${Math.min(stage.barWidth, 100)}%`,
                  backgroundColor: BAR_COLORS[stage.rag],
                  opacity: 0.8,
                }}
              />
              <div className="absolute inset-0 flex items-center px-2">
                <span className="text-xs font-semibold text-white drop-shadow-sm" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  {formatNumber(stage.count)}
                </span>
              </div>
            </div>

            <div className="w-[70px] sm:w-[90px] flex-shrink-0 text-right">
              {stage.conversionRate != null ? (
                <div className="flex flex-col items-end">
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    {stage.conversionRate > 100 ? '—' : `${stage.conversionRate.toFixed(1)}%`}
                  </span>
                  {stage.delta != null && Math.abs(stage.conversionRate) <= 100 && (
                    <span className={`text-[10px] font-medium ${
                      stage.delta >= 0.5 ? 'text-emerald-600' :
                      stage.delta <= -0.5 ? 'text-red-600' :
                      'text-slate-400'
                    }`}>
                      {stage.delta > 0 ? '+' : ''}{stage.delta.toFixed(1)}pp
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-slate-400">—</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm" style={{ backgroundColor: BAR_COLORS.green }} /> Better than LMTD</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm" style={{ backgroundColor: BAR_COLORS.amber }} /> -0.5 to -2pp</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm" style={{ backgroundColor: BAR_COLORS.red }} /> &gt;2pp drop</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm border border-dashed border-slate-300 bg-slate-100" /> LMTD overlay</span>
      </div>
    </div>
  );
}
