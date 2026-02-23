import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import {
  duesSnapshot,
  momRepayment,
  dpdRecon,
  dpdInsights,
  paidBreakdown,
  repaymentSnapshot,
} from '../../mockData/repayment';

const DONUT_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

const REP_TABS = [
  { id: 'snapshot',  label: 'Repayment Snapshot' },
  { id: 'mom',       label: 'MoM Performance' },
  { id: 'dpd',       label: 'DPD Recon' },
  { id: 'breakdown', label: 'Paid Breakdown' },
];

function SmartInsights({ insights }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 relative">
      <button onClick={() => setDismissed(true)} className="absolute top-2 right-3 text-slate-400 hover:text-slate-600 text-lg">&times;</button>
      <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
        <span className="text-indigo-500">~&gt;</span> Smart Insights
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((ins, i) => (
          <div key={i} className={`rounded-lg border p-3 ${ins.type === 'error' ? 'border-red-200 bg-red-50/50' : 'border-emerald-200 bg-emerald-50/50'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${ins.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
              {ins.type === 'error' ? '⊘' : '⊙'} {ins.label}
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">{ins.text}</p>
            {ins.action !== 'None Required' && (
              <button className="mt-2 text-[11px] font-semibold text-blue-600 hover:text-blue-800">{ins.action}</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RepaymentSnapshotTab() {
  const snap = repaymentSnapshot;
  const fmtCr = (v) => `₹${(v / 10000000).toFixed(2)} Cr`;
  const fmtL = (v) => `₹${(v / 100000).toFixed(2)} L`;

  const [selectedMonth] = useState('Feb');
  const [selectedYear] = useState('2026');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Repayment Snapshot</h3>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Month</span>
          <select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white">
            <option>{selectedMonth}</option>
          </select>
          <span>Year</span>
          <select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white">
            <option>{selectedYear}</option>
          </select>
          <span className="text-slate-400 ml-2">Data for Feb 2026</span>
        </div>
      </div>

      {/* Collection Efficiency */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-slate-700">Collection Efficiency</h4>
          <span className="text-2xl font-bold text-emerald-600">{snap.collectionEfficiency}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${snap.collectionEfficiency}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
          <span>Total Repayment: {fmtCr(snap.totalRepayment)}</span>
          <span>Total Billed: {fmtCr(snap.totalBilled)}</span>
        </div>
      </div>

      {/* Contribution by Mode + Quick Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h4 className="text-sm font-semibold text-slate-700 mb-4">Repayment Contribution by Mode</h4>
          <div className="flex items-center justify-center">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={snap.repaymentByMode}
                    dataKey="pct"
                    nameKey="mode"
                    innerRadius="55%"
                    outerRadius="85%"
                    paddingAngle={2}
                  >
                    {snap.repaymentByMode.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `${val}%`} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-[11px] text-slate-600">
            {snap.repaymentByMode.map((m) => (
              <div key={m.mode} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                <span>{m.mode}: {m.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Quick filters</h4>
          <p className="text-xs text-slate-400 mb-4">Click any KPI card below to open the detailed data table for that metric.</p>
          <div className="text-center text-xs text-slate-400 py-6">Filter actions available on KPI cards below</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard icon="📄" label="Total Bill Amount" value={fmtCr(snap.totalBilled)} accent="blue" />
        <KpiCard icon="👥" label="LANs with Bill > 0" value={snap.lansWithBill.toLocaleString('en-IN')} accent="indigo" />
        <KpiCard icon="✅" label="Total Repayment" value={fmtCr(snap.totalRepayment)} accent="emerald" />
        <KpiCard icon="⚠" label="Outstanding Amount" value={fmtL(snap.outstandingAmount)} accent="red" />
        <KpiCard icon="✓" label="Customers Paid Full" value={snap.customersPaidFull.toLocaleString('en-IN')} accent="emerald" />
        <KpiCard icon="⏳" label="Partial Repayment" value={snap.partialRepayment.toLocaleString('en-IN')} accent="amber" />
      </div>

      {/* Unreconciled Delta */}
      <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠</span>
          <div>
            <p className="text-sm font-bold text-amber-800">Unreconciled Repayments (Delta)</p>
            <p className="text-3xl font-bold text-amber-700 mt-1">{snap.unreconciledDelta}</p>
            <p className="text-xs text-amber-600 mt-1">Paytm says paid, Lender file mismatch — click to investigate</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, accent }) {
  const colors = {
    blue: 'border-blue-200 hover:bg-blue-50/50',
    indigo: 'border-indigo-200 hover:bg-indigo-50/50',
    emerald: 'border-emerald-200 hover:bg-emerald-50/50',
    red: 'border-red-200 hover:bg-red-50/50',
    amber: 'border-amber-200 hover:bg-amber-50/50',
  };
  const textColor = {
    blue: 'text-blue-700', indigo: 'text-indigo-700', emerald: 'text-emerald-700', red: 'text-red-700', amber: 'text-amber-700',
  };
  return (
    <div className={`bg-white rounded-xl border ${colors[accent] || 'border-slate-200'} p-4 cursor-pointer transition-colors`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <p className={`text-xl font-bold ${textColor[accent] || 'text-slate-900'}`}>{value}</p>
      <p className="text-[10px] text-slate-400 mt-1">View details →</p>
    </div>
  );
}

function DpdReconTab() {
  return (
    <div className="space-y-4">
      <SmartInsights insights={dpdInsights} />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">DPD Recon</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Live DPD mismatches: Lender file vs Paytm LMS. Click a non-zero Delta to investigate.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-2.5">DPD Count</th>
                <th className="text-right px-5 py-2.5">Paytm LMS</th>
                <th className="text-right px-5 py-2.5">Lender File</th>
                <th className="text-right px-5 py-2.5">Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {dpdRecon.map((row) => (
                <tr key={row.dpdCount} className={`${row.delta !== 0 ? 'hover:bg-red-50/30 cursor-pointer' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-5 py-2.5 font-medium text-slate-700">{row.dpdCount}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{row.paytmLms.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{row.lenderFile.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-2.5 text-right">
                    {row.delta === 0 ? (
                      <span className="text-emerald-600 font-semibold tabular-nums">0</span>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${row.delta > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {row.delta > 0 ? '+' : ''}{row.delta}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MomPerformanceTab() {
  const { openIssuePanel, setPostOnbTab } = useDashboard();

  const crossLinkSurplus = () => openIssuePanel('surplus_refund');
  const crossLinkFrozen = () => setPostOnbTab('portfolio');

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <DuesCard label="Total Billed" value={`₹${duesSnapshot.totalBilled} Cr`} />
        <DuesCard label="Total Repaid" value={`₹${duesSnapshot.totalRepaid} Cr`} accent="emerald" />
        <DuesCard label="Outstanding" value={`₹${duesSnapshot.outstanding} Cr`} accent="red" />
        <DuesCard label="Overdue > 7 Days" value={duesSnapshot.odAbove7Days.toLocaleString()} accent="amber" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">MoM Repayment Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-2.5">Month</th>
                <th className="text-right px-4 py-2.5">Customers Repaid</th>
                <th className="text-right px-4 py-2.5">Total Repayments</th>
                <th className="text-right px-4 py-2.5">Amount (₹ Cr)</th>
                <th className="text-right px-4 py-2.5">Overpay Accounts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {momRepayment.map((row) => {
                const isCurrent = row.month === 'Feb-26';
                const overpayPct = ((row.overpayAccounts / row.customersRepaid) * 100).toFixed(0);
                const overpayHigh = Number(overpayPct) > 50;
                return (
                  <tr key={row.month} className={isCurrent ? 'bg-blue-50/40 font-semibold' : ''}>
                    <td className="px-4 py-2 text-slate-700">{row.month}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{row.customersRepaid.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{row.totalRepayments.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right tabular-nums">₹{row.amountCr}</td>
                    <td className="px-4 py-2 text-right">
                      <span className="tabular-nums">{row.overpayAccounts.toLocaleString()}</span>
                      {overpayHigh && isCurrent && (
                        <button onClick={crossLinkSurplus} className="ml-2 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded hover:bg-amber-200 transition-colors">
                          {overpayPct}% — View in User Pulse
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paid Breakdown Donut */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Repayment Breakdown</h3>
        <div className="flex items-start gap-4">
          <div className="w-40 h-40 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paidBreakdown} dataKey="count" nameKey="segment" innerRadius="50%" outerRadius="85%" paddingAngle={2}>
                  {paidBreakdown.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(val) => val.toLocaleString()} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2 pt-2">
            {paidBreakdown.map((seg, i) => (
              <div key={seg.segment} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[i] }} />
                  <span className="text-xs text-slate-700 font-medium">{seg.segment}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-800 tabular-nums">{seg.count.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 ml-1.5">{seg.pct}%</span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <button onClick={crossLinkFrozen} className="text-[10px] text-blue-600 hover:text-blue-800 font-medium">
                "Did Not Pay" ↔ Frozen accounts in Portfolio →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DuesCard({ label, value, accent }) {
  const colors = {
    emerald: 'border-emerald-200 bg-emerald-50/30',
    red: 'border-red-200 bg-red-50/30',
    amber: 'border-amber-200 bg-amber-50/30',
  };
  return (
    <div className={`bg-white rounded-xl border p-4 ${colors[accent] || 'border-slate-200'}`}>
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

export default function RepaymentRecon() {
  const [subTab, setSubTab] = useState('snapshot');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 border-b border-slate-200">
        {REP_TABS.map((tab) => (
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

      {subTab === 'snapshot' && <RepaymentSnapshotTab />}
      {subTab === 'mom' && <MomPerformanceTab />}
      {subTab === 'dpd' && <DpdReconTab />}
      {subTab === 'breakdown' && <MomPerformanceTab />}
    </div>
  );
}
