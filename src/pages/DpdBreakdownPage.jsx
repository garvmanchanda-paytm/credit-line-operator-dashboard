import { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { dpdLanBreakdown } from '../mockData/billRecon';

export default function DpdBreakdownPage() {
  const { selectedDpdBucket, navigateBackFromDpdBreakdown, navigateToCustomer360 } = useDashboard();
  const [search, setSearch] = useState('');

  const bucket = selectedDpdBucket;
  const rawRows = dpdLanBreakdown[bucket] || [];

  const rows = useMemo(() => {
    if (!search) return rawRows;
    const q = search.toLowerCase();
    return rawRows.filter(
      (r) => r.paytmLan.toLowerCase().includes(q) || r.lenderLan.toLowerCase().includes(q)
    );
  }, [rawRows, search]);

  return (
    <div className="space-y-4">
      <button
        onClick={navigateBackFromDpdBreakdown}
        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
      >
        ← Back to DPD Recon
      </button>

      <h2 className="text-lg font-bold text-slate-900">
        DPD Discrepancy Investigation: Day {bucket}
      </h2>

      <div className="relative max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search by Paytm LAN or Lender LAN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-2.5">Paytm LAN</th>
                <th className="text-left px-5 py-2.5">Lender LAN</th>
                <th className="text-left px-5 py-2.5">DPD Available In (Paytm LMS / Lender File)</th>
                <th className="text-right px-5 py-2.5">DPD Counter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((row) => (
                <tr key={row.paytmLan} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-5 py-2.5">
                    <button
                      onClick={() => navigateToCustomer360(row.paytmLan)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      {row.paytmLan}
                    </button>
                  </td>
                  <td className="px-5 py-2.5 text-slate-600">{row.lenderLan}</td>
                  <td className="px-5 py-2.5 text-slate-600">{row.availableIn}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums font-semibold text-slate-700">{row.dpdCounter}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                    No LAN records found for DPD bucket {bucket}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
