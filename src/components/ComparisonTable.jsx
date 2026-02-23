import { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { funnelMTD } from '../mockData/funnelMTD';
import { funnelClosed } from '../mockData/funnelClosed';
import { dailyFunnel } from '../mockData/dailyFunnel';
import { formatNumber, getDeltaColor, getDeltaBold } from '../utils/rag';
import RAGBadge from './RAGBadge';
import { getConversionRAG } from '../utils/rag';

export default function ComparisonTable() {
  const { funnelType, openDrillDown } = useDashboard();

  const tableData = useMemo(() => {
    const source = funnelType === 'open' ? funnelMTD : funnelClosed;
    const lastDay = dailyFunnel[dailyFunnel.length - 1];

    return source.map(stage => {
      const lmtdConv = stage.lmtdConvRate;
      const delta = (stage.conversionRate != null && lmtdConv != null)
        ? stage.conversionRate - lmtdConv
        : null;
      const t1 = lastDay?.[stage.stage]?.count ?? null;
      const rag = stage.conversionRate != null
        ? getConversionRAG(stage.conversionRate, lmtdConv)
        : 'gray';

      return {
        ...stage,
        lmtdConv,
        delta,
        t1,
        rag,
      };
    });
  }, [funnelType]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">Comparison Table — MTD vs LMTD vs T-1</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider">Stage</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider">Feb MTD</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider">Conv%</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider">Jan MTD</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider">LMTD Conv%</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider">T-1</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider">Delta</th>
              <th className="text-center px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableData.map((row) => {
              const deltaColor = getDeltaColor(row.delta);
              const isBold = getDeltaBold(row.delta);

              return (
                <tr
                  key={row.stage}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  onClick={() => openDrillDown(row.stage)}
                >
                  <td className="px-4 py-2.5 font-medium text-slate-800 whitespace-nowrap">
                    {row.displayLabel}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-700 tabular-nums">
                    {formatNumber(row.count)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-700 tabular-nums">
                    {row.conversionRate != null && row.conversionRate <= 100
                      ? `${row.conversionRate.toFixed(1)}%`
                      : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-500 tabular-nums">
                    {row.lmtdCount != null ? formatNumber(row.lmtdCount) : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-500 tabular-nums">
                    {row.lmtdConv != null ? `${row.lmtdConv.toFixed(1)}%` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-500 tabular-nums">
                    {row.t1 != null ? formatNumber(row.t1) : '—'}
                  </td>
                  <td className={`px-4 py-2.5 text-right tabular-nums ${
                    deltaColor === 'green' ? 'text-emerald-600' :
                    deltaColor === 'red' ? 'text-red-600' :
                    'text-slate-400'
                  } ${isBold ? 'font-bold' : 'font-medium'}`}>
                    {row.delta != null
                      ? `${row.delta > 0 ? '+' : ''}${row.delta.toFixed(1)}pp`
                      : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <RAGBadge status={row.rag} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
