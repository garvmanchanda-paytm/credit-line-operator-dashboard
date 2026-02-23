import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { duesSnapshot, momRepayment, dpdDistribution, paidBreakdown } from '../../mockData/repayment';

const DONUT_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export default function RepaymentRecon() {
  const { setActiveView, openIssuePanel, setPostOnbTab } = useDashboard();

  const crossLinkSurplus = () => {
    setActiveView('userPulse');
    setTimeout(() => openIssuePanel('surplus_refund'), 50);
  };

  const crossLinkFrozen = () => {
    setPostOnbTab('portfolio');
  };

  const dpdTotal = dpdDistribution.reduce((s, r) => s + r.diff, 0);
  const dpdAlert = dpdTotal > 5;

  return (
    <div className="space-y-5">
      {/* Dues Snapshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <DuesCard label="Total Billed" value={`₹${duesSnapshot.totalBilled} Cr`} />
        <DuesCard label="Total Repaid" value={`₹${duesSnapshot.totalRepaid} Cr`} accent="emerald" />
        <DuesCard label="Outstanding" value={`₹${duesSnapshot.outstanding} Cr`} accent="red" />
        <DuesCard label="Overdue > 7 Days" value={duesSnapshot.odAbove7Days.toLocaleString()} accent="amber" />
      </div>

      {/* MoM Repayment Table */}
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

      {/* DPD + Paid Breakdown side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* DPD Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">DPD Distribution — SSFB vs Paytm</h3>
            {dpdAlert && <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">RECON ALERT: Diff &gt; 5</span>}
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-2.5">Bucket</th>
                <th className="text-right px-4 py-2.5">SSFB</th>
                <th className="text-right px-4 py-2.5">Paytm</th>
                <th className="text-right px-4 py-2.5">Diff</th>
                <th className="text-left px-4 py-2.5">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {dpdDistribution.map((row) => (
                <tr key={row.bucket}>
                  <td className="px-4 py-2 font-medium text-slate-700">{row.bucket}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{row.ssfbLans.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{row.paytmLans.toLocaleString()}</td>
                  <td className={`px-4 py-2 text-right tabular-nums font-semibold ${row.diff > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {row.diff} {row.diff <= 5 ? '✓' : '⚠'}
                  </td>
                  <td className="px-4 py-2 text-slate-500">{row.riskLabel}</td>
                </tr>
              ))}
              <tr className="bg-slate-50/50 font-semibold">
                <td className="px-4 py-2 text-slate-700">Total</td>
                <td className="px-4 py-2 text-right tabular-nums">{dpdDistribution.reduce((s, r) => s + r.ssfbLans, 0).toLocaleString()}</td>
                <td className="px-4 py-2 text-right tabular-nums">{dpdDistribution.reduce((s, r) => s + r.paytmLans, 0).toLocaleString()}</td>
                <td className="px-4 py-2 text-right tabular-nums">{dpdTotal}</td>
                <td className="px-4 py-2 text-slate-500">{dpdTotal <= 5 ? 'Within tolerance' : 'Needs review'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Paid / Partial / Not Paid Donut */}
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
