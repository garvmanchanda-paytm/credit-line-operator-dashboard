import { useState } from 'react';
import { reconSnapshot } from '../../mockData/billRecon';
import { useDashboard } from '../../context/DashboardContext';
import LANTable from './LANTable';
import EmailModal from './EmailModal';

export default function BillRecon() {
  const { selectedLanDimension, setSelectedLanDimension, showEmailModal } = useDashboard();
  const [selectedIds] = useState(new Set());

  const deltaRows = reconSnapshot.filter(r => r.isAccountCount && r.diff > 0);
  const totalMismatchLans = deltaRows.reduce((s, r) => s + r.diff, 0);

  return (
    <div className="space-y-5">
      {/* L1 Snapshot */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Bill Reconciliation — SSFB vs Paytm LMS</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Month: Feb-26 | Last synced: Feb 22, 06:00 AM</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
          {reconSnapshot.map((row) => (
            <div key={row.dimension} className={`rounded-lg border p-3 ${row.diff > 0 ? 'border-red-200 bg-red-50/30' : row.diff === 0 ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'}`}>
              <p className="text-[11px] font-medium text-slate-500 mb-1">{row.dimension}</p>
              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className="text-[10px] text-slate-400">SSFB</p>
                  <p className="text-sm font-bold text-slate-900">{typeof row.ssfb === 'number' ? row.ssfb.toLocaleString() : '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Paytm LMS</p>
                  <p className={`text-sm font-bold ${row.lms === null ? 'text-slate-300 italic' : 'text-slate-900'}`}>{row.lms === null ? 'N/A' : row.lms.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Diff</p>
                  <p className={`text-sm font-bold ${row.diff > 0 ? 'text-red-600' : row.diff === 0 ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {row.diff === null ? 'N/A' : row.diff > 0 ? `▲ ${row.diff.toLocaleString()}` : '0'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* L2 Delta Focus */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">Delta Focus — Mismatched Dimensions</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{deltaRows.length} dimensions in mismatch across {totalMismatchLans.toLocaleString()} unique LANs</p>
          </div>
          {selectedLanDimension && (
            <button onClick={() => setSelectedLanDimension(null)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              ← Back to summary
            </button>
          )}
        </div>

        {!selectedLanDimension ? (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-2.5">Dimension</th>
                <th className="text-right px-5 py-2.5">SSFB</th>
                <th className="text-right px-5 py-2.5">Paytm LMS</th>
                <th className="text-right px-5 py-2.5">Difference</th>
                <th className="text-center px-5 py-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {deltaRows.map((row) => (
                <tr key={row.dimension} className="hover:bg-slate-50/50">
                  <td className="px-5 py-2.5 font-medium text-slate-700">{row.dimension}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{row.ssfb.toLocaleString()}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{row.lms.toLocaleString()}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums font-semibold text-red-600">{row.diff.toLocaleString()}</td>
                  <td className="px-5 py-2.5 text-center">
                    <button
                      onClick={() => setSelectedLanDimension(row.dimension)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg"
                    >
                      View LANs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>
            <div className="px-5 py-2 bg-blue-50/50 border-b border-slate-100 text-xs text-slate-600">
              Showing LANs for: <span className="font-semibold text-slate-800">{selectedLanDimension}</span>
            </div>
            <LANTable dimension={selectedLanDimension} />
          </div>
        )}
      </div>

      {showEmailModal && <EmailModal selectedIds={selectedIds} dimension={selectedLanDimension} />}
    </div>
  );
}
