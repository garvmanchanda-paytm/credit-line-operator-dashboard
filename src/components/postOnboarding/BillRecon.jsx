import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  billGenSnapshot,
  billGenInsights,
  momBilling,
  momBillingInsights,
  dailyDuesCycles,
  dailyDuesInsights,
  ingestionAlerts,
} from '../../mockData/billRecon';

const SUB_TABS = [
  { id: 'billGen',    label: 'Bill Gen Recon' },
  { id: 'mom',        label: 'MoM Lender Billing' },
  { id: 'dues',       label: 'Daily Dues Recon' },
  { id: 'ingestion',  label: 'Ingestion Alerts' },
];

function SmartInsights({ insights, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 relative">
      <button onClick={() => { setDismissed(true); onDismiss?.(); }} className="absolute top-2 right-3 text-slate-400 hover:text-slate-600 text-lg">&times;</button>
      <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
        <span className="text-indigo-500">~&gt;</span> Smart Insights
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((ins, i) => (
          <div key={i} className={`rounded-lg border p-3 ${ins.type === 'error' ? 'border-red-200 bg-red-50/50' : ins.type === 'success' ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${ins.type === 'error' ? 'text-red-600' : ins.type === 'success' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {ins.type === 'error' ? '⊘' : ins.type === 'success' ? '⊙' : '◐'} {ins.label}
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">{ins.text}</p>
            {ins.action !== 'None' && ins.action !== 'None Required' && (
              <button className="mt-2 text-[11px] font-semibold text-blue-600 hover:text-blue-800">{ins.action}</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BillGenRecon() {
  const { navigateToLanBreakdown } = useDashboard();
  const [selectedMonth] = useState('Feb-2026');

  const handleMismatchClick = (dimension) => {
    navigateToLanBreakdown({ type: 'billGen', dimension, title: `Discrepancy Investigation: ${dimension}` });
  };

  const fmt = (v, isCurrency) => {
    if (isCurrency) {
      if (v >= 1e9) return `₹${(v / 1e7).toFixed(2)}M`;
      return `₹${v.toLocaleString('en-IN')}`;
    }
    return v.toLocaleString('en-IN');
  };

  return (
    <div className="space-y-4">
      <SmartInsights insights={billGenInsights} />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Bill Gen Recon — Monthly Snapshot</h3>
          <select className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700">
            <option>{selectedMonth}</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-2.5">Month</th>
                <th className="text-left px-5 py-2.5">Dimension</th>
                <th className="text-right px-5 py-2.5">SSFB File (Lender)</th>
                <th className="text-right px-5 py-2.5">Paytm LMS</th>
                <th className="text-right px-5 py-2.5">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {billGenSnapshot.map((row) => {
                const hasMismatch = row.diff !== 0;
                return (
                  <tr
                    key={row.dimension}
                    className={`${hasMismatch ? 'bg-red-50/30 cursor-pointer hover:bg-red-50/60' : 'hover:bg-slate-50/50'}`}
                    onClick={hasMismatch ? () => handleMismatchClick(row.dimension) : undefined}
                  >
                    <td className="px-5 py-2.5 text-slate-500">{row.month}</td>
                    <td className="px-5 py-2.5 font-medium text-slate-700">{row.dimension}</td>
                    <td className="px-5 py-2.5 text-right tabular-nums">{fmt(row.ssfb, row.isCurrency)}</td>
                    <td className="px-5 py-2.5 text-right tabular-nums">{fmt(row.lms, row.isCurrency)}</td>
                    <td className={`px-5 py-2.5 text-right tabular-nums font-semibold ${row.diff > 0 ? 'text-emerald-600' : row.diff < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {row.diff === 0 ? (
                        <span className="text-emerald-600">0</span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${row.diff > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {row.diff > 0 ? '+' : ''}{row.isCurrency ? fmt(row.diff, true) : row.diff.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MoMBilling() {
  const [viewMode, setViewMode] = useState('table');

  const fmtCr = (v) => `₹${(v / 100).toFixed(2)} Cr`;

  return (
    <div className="space-y-4">
      <SmartInsights insights={momBillingInsights} />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">MOM Lender Billing — Historical Trend</h3>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-[11px] font-semibold transition-colors ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1.5 text-[11px] font-semibold transition-colors ${viewMode === 'chart' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              Bar Chart View
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-2.5">Bill Date</th>
                  <th className="text-right px-4 py-2.5">Total Bills</th>
                  <th className="text-right px-4 py-2.5">Bills (Val=0)</th>
                  <th className="text-right px-4 py-2.5">Billed Amount</th>
                  <th className="text-right px-4 py-2.5">Principal Due</th>
                  <th className="text-right px-4 py-2.5">LF Applied</th>
                  <th className="text-right px-4 py-2.5">BF Applied</th>
                  <th className="text-right px-4 py-2.5">CF Applied</th>
                  <th className="text-right px-4 py-2.5">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {momBilling.map((row) => {
                  const isCurrent = row.billDate === 'Feb-2026';
                  return (
                    <tr key={row.billDate} className={isCurrent ? 'bg-blue-50/40 font-semibold' : ''}>
                      <td className="px-4 py-2.5 text-slate-700">{row.billDate}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{row.totalBills.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{row.billsVal0.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-emerald-600">{fmtCr(row.billedAmount)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-blue-600">{fmtCr(row.principalDue)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-blue-600">₹{row.lfApplied.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-blue-600">₹{row.bfApplied.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-blue-600">₹{row.cfApplied.toLocaleString('en-IN')}</td>
                      <td className={`px-4 py-2.5 text-right tabular-nums font-bold ${row.variance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {row.variance > 0 ? (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[11px]">₹{row.variance.toLocaleString('en-IN')}</span>
                        ) : (
                          <span className="text-emerald-600">₹0</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-3">
              {momBilling.map((row) => (
                <div key={row.billDate} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-20 flex-shrink-0">{row.billDate}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
                      style={{ width: `${(row.billedAmount / momBilling[0].billedAmount) * 100}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white mix-blend-difference">
                      {fmtCr(row.billedAmount)}
                    </span>
                  </div>
                  {row.variance > 0 && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">₹{row.variance.toLocaleString('en-IN')}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DuesRecon() {
  const { navigateToLanBreakdown } = useDashboard();
  const [expandedCycles, setExpandedCycles] = useState({ 0: true });

  const toggleCycle = (idx) => {
    setExpandedCycles((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleComponentClick = (cycle, component) => {
    if (component.status !== 'Mismatch') return;
    navigateToLanBreakdown({
      type: 'dailyDues',
      dimension: component.component,
      cycle: cycle.cycle,
      title: `Discrepancy Investigation: Daily Dues - ${cycle.cycle} - ${component.component}`,
    });
  };

  return (
    <div className="space-y-4">
      <SmartInsights insights={dailyDuesInsights} />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Daily Dues Recon (T-1)</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">TOTAL DUE = Principal Billed + CF + GST on CF + BF + LPF. Click a row to drill into sub-components.</p>
        </div>

        <div className="divide-y divide-slate-100">
          {dailyDuesCycles.map((cycle, idx) => (
            <div key={cycle.cycle}>
              <button
                onClick={() => toggleCycle(idx)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-slate-400 transition-transform ${expandedCycles[idx] ? 'rotate-90' : ''}`}>▸</span>
                  <span className="text-sm font-semibold text-slate-800">{cycle.cycle}</span>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="text-right">
                    <span className="text-slate-400">Paytm</span>
                    <p className="font-semibold text-slate-700 tabular-nums">₹{cycle.paytmTotal.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">Lender</span>
                    <p className="font-semibold text-slate-700 tabular-nums">₹{cycle.lenderTotal.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">Variance</span>
                    <p className={`font-bold tabular-nums ${cycle.variance !== 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {cycle.variance !== 0 ? `₹${cycle.variance.toLocaleString('en-IN')}` : '₹0'}
                    </p>
                  </div>
                </div>
              </button>

              {expandedCycles[idx] && (
                <div className="px-5 pb-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <th className="text-left py-2 px-3">Component</th>
                        <th className="text-right py-2 px-3">Paytm</th>
                        <th className="text-right py-2 px-3">Lender</th>
                        <th className="text-right py-2 px-3">Diff</th>
                        <th className="text-center py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {cycle.components.map((comp) => (
                        <tr
                          key={comp.component}
                          className={`${comp.status === 'Mismatch' ? 'bg-red-50/30 cursor-pointer hover:bg-red-50/60' : 'hover:bg-slate-50/50'}`}
                          onClick={() => handleComponentClick(cycle, comp)}
                        >
                          <td className="py-2 px-3 text-slate-700">{comp.component}</td>
                          <td className="py-2 px-3 text-right tabular-nums">₹{comp.paytm.toLocaleString('en-IN')}</td>
                          <td className="py-2 px-3 text-right tabular-nums">₹{comp.lender.toLocaleString('en-IN')}</td>
                          <td className={`py-2 px-3 text-right tabular-nums font-semibold ${comp.diff !== 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {comp.diff !== 0 ? `₹${comp.diff.toLocaleString('en-IN')}` : '₹0'}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${comp.status === 'Match' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {comp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IngestionAlerts() {
  const [selectedReport, setSelectedReport] = useState(null);

  const statusStyle = {
    SUCCESS: 'text-emerald-700 font-bold',
    Failed: 'text-red-600 font-bold',
    Warning: 'text-amber-600 font-bold',
  };

  const alertBadgeStyle = (alertType) => {
    if (alertType === 'Healthy') return 'bg-slate-100 text-slate-500';
    if (['Job Status Inactive', 'Missing Source File', 'Date Mismatch'].includes(alertType)) return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  };

  const healthColor = (pct) => {
    if (pct >= 80) return 'text-emerald-600';
    if (pct >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const report = selectedReport?.healthReport;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Ingestion Alerts</h3>
        <p className="text-xs text-slate-400 mt-0.5">Monitor daily and monthly SFTP file ingestion and Data Warehouse pipelines.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h4 className="text-sm font-semibold text-slate-700">Ingestion Alerts</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-2.5">Lender File</th>
                <th className="text-left px-4 py-2.5">DWH Table</th>
                <th className="text-center px-4 py-2.5">Frequency</th>
                <th className="text-left px-4 py-2.5">Last Ingestion</th>
                <th className="text-left px-4 py-2.5">Active Alert / Diagnostics</th>
                <th className="text-center px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ingestionAlerts.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer hover:bg-blue-50/40 transition-colors"
                  onClick={() => setSelectedReport(row)}
                >
                  <td className="px-4 py-3 font-medium text-slate-700">{row.lenderFile}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500">{row.dwhTable}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{row.frequency}</td>
                  <td className="px-4 py-3 text-slate-600">{row.lastIngestion}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${alertBadgeStyle(row.alertType)}`}>
                      {row.alertType}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-center ${statusStyle[row.status] || ''}`}>
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">Click a row to view the full DWH health report.</p>
        </div>
      </div>

      {/* Health Report Modal */}
      {selectedReport && report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h3 className="text-sm font-bold text-slate-900">{selectedReport.lenderFile} — Health Report</h3>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {/* Alert banner */}
              {report.alertLabel && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 text-lg mt-0.5">⚠</span>
                    <div>
                      <p className="text-sm font-bold text-red-800">{report.alertLabel}</p>
                      <p className="text-xs text-red-600 mt-0.5">{report.alertDesc}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Overall Health + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-lg p-4 text-center">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Overall Health</p>
                  <p className={`text-3xl font-bold mt-1 ${healthColor(report.overallHealth)}`}>{report.overallHealth}%</p>
                </div>
                <div className="border border-slate-200 rounded-lg p-4 text-center">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Status</p>
                  <p className={`text-lg font-bold mt-1 ${report.pipelineStatus === 'Active' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {report.pipelineStatus}
                  </p>
                </div>
              </div>

              {/* Inactivity Reason */}
              {report.inactivityReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs font-bold text-red-800">Critical: Inactivity Reason</p>
                  <p className="text-xs text-red-600 mt-0.5">{report.inactivityReason}</p>
                </div>
              )}

              {/* Sync Performance */}
              <div className="border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Sync Performance</p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400">Sync Delay</p>
                    <p className="font-semibold text-slate-800">{report.syncDelay}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Last Sync Time</p>
                    <p className="font-semibold text-slate-800">{report.lastSyncTime}</p>
                  </div>
                  {report.datasetMaxDate && (
                    <>
                      <div>
                        <p className="text-[10px] text-slate-400">Dataset Max Date</p>
                        <p className="font-semibold text-slate-800">{report.datasetMaxDate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Source Max Date</p>
                        <p className="font-semibold text-slate-800">{report.sourceMaxDate}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Dataset Information */}
              <div className="bg-amber-50/40 border border-amber-100 rounded-lg p-4">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Dataset Information</p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400">Dataset ID</p>
                    <p className="font-semibold text-slate-800 font-mono text-[11px]">{report.datasetId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Type</p>
                    <p className="font-semibold text-slate-800">{report.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Vertical</p>
                    <p className="font-semibold text-slate-800">{report.vertical}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Sub Vertical</p>
                    <p className="font-semibold text-slate-800">{report.subVertical}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Product SPOC Email</p>
                    <p className="font-semibold text-slate-800">{report.productSpoc}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Tech SPOC Email</p>
                    <p className="font-semibold text-slate-800">{report.techSpoc}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">SLO Minutes</p>
                    <p className="font-semibold text-slate-800">{report.sloMinutes}</p>
                  </div>
                </div>
              </div>

              {/* Schema Information */}
              <div className="border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Schema Information</p>
                <div className="grid grid-cols-4 gap-3 text-xs text-center">
                  <div>
                    <p className="text-[10px] text-slate-400">Total Fields</p>
                    <p className="text-lg font-bold text-slate-800">{report.totalFields}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Active Fields</p>
                    <p className="text-lg font-bold text-slate-800">{report.activeFields}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Inactive Fields</p>
                    <p className="text-lg font-bold text-slate-800">{report.inactiveFields}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Schema Health</p>
                    <p className={`text-lg font-bold ${healthColor(report.schemaHealth)}`}>{report.schemaHealth}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BillRecon() {
  const [subTab, setSubTab] = useState('billGen');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 border-b border-slate-200">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
              subTab === tab.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'billGen' && <BillGenRecon />}
      {subTab === 'mom' && <MoMBilling />}
      {subTab === 'dues' && <DuesRecon />}
      {subTab === 'ingestion' && <IngestionAlerts />}
    </div>
  );
}
