import { useMemo, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { funnelMTD } from '../mockData/funnelMTD';
import { funnelClosed } from '../mockData/funnelClosed';
import { dailyFunnel } from '../mockData/dailyFunnel';
import { formatNumber, getDeltaColor, getDeltaBold, getConversionRAG, RAG_COLORS } from '../utils/rag';
import RAGBadge from '../components/RAGBadge';

const STATUS_OPTIONS = ['all', 'red', 'amber', 'green', 'gray'];

export default function DeepdiveView() {
  const { funnelType, setFunnelType, openDrillDown } = useDashboard();
  const [localFunnelType, setLocalFunnelType] = useState(funnelType);
  const [statusFilter, setStatusFilter] = useState('all');

  const handleToggle = (type) => {
    setLocalFunnelType(type);
    setFunnelType(type);
  };

  const tableData = useMemo(() => {
    const source = localFunnelType === 'open' ? funnelMTD : funnelClosed;
    const lastDay = dailyFunnel[dailyFunnel.length - 1];

    const rows = source.map((stage, idx) => {
      const lmtdConv = stage.lmtdConvRate;
      const delta = (stage.conversionRate != null && lmtdConv != null)
        ? stage.conversionRate - lmtdConv
        : null;
      const t1 = lastDay?.[stage.stage]?.count ?? null;
      const t1Conv = lastDay?.[stage.stage]?.conversion ?? null;
      const rag = stage.conversionRate != null
        ? getConversionRAG(stage.conversionRate, lmtdConv)
        : 'gray';

      const overallConvMTD = idx === 0 ? null : (stage.count / (localFunnelType === 'open' ? funnelMTD : funnelClosed)[0].count * 100);

      return {
        ...stage,
        lmtdConv,
        delta,
        t1,
        t1Conv,
        rag,
        overallConvMTD,
        idx: idx + 1,
      };
    });

    if (statusFilter === 'all') return rows;
    return rows.filter(r => r.rag === statusFilter);
  }, [localFunnelType, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              {localFunnelType === 'open' ? 'Open' : 'Closed'} Funnel — MTD Deepdive
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Click any row to see L2 sub-stages and L3 error logs</p>
          </div>

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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-8">#</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Stage</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Feb MTD</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Step Conv%</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Overall %</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Jan MTD</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">LMTD Conv%</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Delta</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">T-1 Count</th>
                <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1">
                    <span>Status</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => { e.stopPropagation(); setStatusFilter(e.target.value); }}
                      className="text-[10px] bg-transparent border border-slate-300 rounded px-1 py-0.5 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer capitalize"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt === 'all' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tableData.map((row) => {
                const deltaColor = getDeltaColor(row.delta);
                const isBold = getDeltaBold(row.delta);
                const ragColors = RAG_COLORS[row.rag];

                return (
                  <tr
                    key={row.stage}
                    className="hover:bg-blue-50/60 cursor-pointer transition-colors group"
                    onClick={() => openDrillDown(row.stage)}
                  >
                    <td className="px-4 py-2 text-[10px] text-slate-400">{row.idx}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-6 rounded-full flex-shrink-0"
                          style={{ backgroundColor: ragColors.dot }}
                        />
                        <div>
                          <span className="text-sm font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                            {row.displayLabel}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1.5 hidden lg:inline">
                            {row.stage}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right text-slate-700 tabular-nums font-medium">
                      {formatNumber(row.count)}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums font-semibold" style={{ color: ragColors.text }}>
                      {row.conversionRate != null && row.conversionRate <= 100
                        ? `${row.conversionRate.toFixed(1)}%`
                        : '—'}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-500 tabular-nums text-xs">
                      {row.overallConvMTD != null ? `${row.overallConvMTD.toFixed(2)}%` : '—'}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-400 tabular-nums">
                      {row.lmtdCount != null ? formatNumber(row.lmtdCount) : '—'}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-400 tabular-nums">
                      {row.lmtdConv != null ? `${row.lmtdConv.toFixed(1)}%` : '—'}
                    </td>
                    <td className={`px-4 py-2 text-right tabular-nums ${
                      deltaColor === 'green' ? 'text-emerald-600' :
                      deltaColor === 'red' ? 'text-red-600' :
                      'text-slate-400'
                    } ${isBold ? 'font-bold text-sm' : 'font-medium'}`}>
                      {row.delta != null
                        ? `${row.delta > 0 ? '+' : ''}${row.delta.toFixed(1)}pp`
                        : '—'}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-500 tabular-nums">
                      {row.t1 != null ? formatNumber(row.t1) : '—'}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <RAGBadge status={row.rag} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[10px] text-slate-400">
          <span>Delta = Step Conv% minus LMTD Conv%. Bold if |delta| &gt; 2pp.</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Green: &lt; -0.5pp</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Amber: -0.5 to -2pp</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Red: &gt; -2pp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
