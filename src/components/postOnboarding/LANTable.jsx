import { useState, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { lanRows } from '../../mockData/billRecon';

const PAGE_SIZE = 50;

export default function LANTable({ dimension }) {
  const { setShowEmailModal } = useDashboard();
  const [selected, setSelected] = useState(new Set());
  const [sortBy, setSortBy] = useState('diff');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let rows = dimension ? lanRows.filter(r => r.dimension === dimension) : lanRows;
    rows = [...rows].sort((a, b) => {
      const aVal = a[sortBy] ?? 0;
      const bVal = b[sortBy] ?? 0;
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return rows;
  }, [dimension, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const pageIds = pageRows.map(r => r.id);
    const allSelected = pageIds.every(id => selected.has(id));
    setSelected(prev => {
      const next = new Set(prev);
      pageIds.forEach(id => allSelected ? next.delete(id) : next.add(id));
      return next;
    });
  };

  const handleSort = (col) => {
    if (sortBy === col) { setSortDir(d => d === 'desc' ? 'asc' : 'desc'); }
    else { setSortBy(col); setSortDir('desc'); }
  };

  const sentMap = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('lanSentStatus') || '{}'); } catch { return {}; }
  }, []);

  const SortIcon = ({ col }) => (
    <span className="text-[8px] ml-0.5 text-slate-400">{sortBy === col ? (sortDir === 'desc' ? '▼' : '▲') : '⇅'}</span>
  );

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-3 py-2.5 w-8">
                <input type="checkbox" onChange={toggleAll} checked={pageRows.length > 0 && pageRows.every(r => selected.has(r.id))} className="w-3.5 h-3.5 rounded" />
              </th>
              <th className="text-left px-3 py-2.5">LMS LAN</th>
              <th className="text-left px-3 py-2.5">SSFB LAN</th>
              <th className="text-right px-3 py-2.5 cursor-pointer select-none" onClick={() => handleSort('ssfbVal')}>SSFB Val<SortIcon col="ssfbVal" /></th>
              <th className="text-right px-3 py-2.5 cursor-pointer select-none" onClick={() => handleSort('lmsVal')}>LMS Val<SortIcon col="lmsVal" /></th>
              <th className="text-right px-3 py-2.5 cursor-pointer select-none" onClick={() => handleSort('diff')}>Diff<SortIcon col="diff" /></th>
              <th className="text-right px-3 py-2.5 cursor-pointer select-none" onClick={() => handleSort('repayment')}>Repayment (₹)<SortIcon col="repayment" /></th>
              <th className="text-center px-3 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pageRows.map((row) => (
              <tr key={row.id} className={selected.has(row.id) ? 'bg-blue-50/40' : 'hover:bg-slate-50/50'}>
                <td className="px-3 py-2">
                  <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleSelect(row.id)} className="w-3.5 h-3.5 rounded" />
                </td>
                <td className="px-3 py-2 font-mono text-[10px] text-slate-600">{row.lmsLan}</td>
                <td className="px-3 py-2 font-mono text-[10px] text-slate-600">{row.ssfbLan}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.ssfbVal}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.lmsVal}</td>
                <td className={`px-3 py-2 text-right tabular-nums font-semibold ${row.diff > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{row.diff}</td>
                <td className="px-3 py-2 text-right tabular-nums">₹{row.repayment.toLocaleString()}</td>
                <td className="px-3 py-2 text-center">
                  {sentMap[row.id]
                    ? <span className="text-[10px] text-emerald-600 font-medium">Sent</span>
                    : <span className="text-[10px] text-slate-400">—</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Page {page + 1} of {totalPages} ({filtered.length} LANs)</span>
          <div className="flex gap-1">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40">Prev</button>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      {/* Floating action bar */}
      {selected.size > 0 && (
        <div className="sticky bottom-0 left-0 right-0 bg-blue-600 text-white px-5 py-3 rounded-b-xl flex items-center justify-between">
          <span className="text-sm font-medium">{selected.size} LAN{selected.size > 1 ? 's' : ''} selected</span>
          <button
            onClick={() => setShowEmailModal(true)}
            className="bg-white text-blue-700 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors"
          >
            Send Reconciliation Request to SSFB
          </button>
        </div>
      )}
    </div>
  );
}
