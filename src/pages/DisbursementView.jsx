import { disbursementKPIs, lenderBreakdown, dailyDisbursement, failureReasons } from '../mockData/disbursement';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function KpiCard({ label, value, delta, rag }) {
  const ragBorder = {
    red: 'border-red-200 bg-red-50/40',
    amber: 'border-amber-200 bg-amber-50/40',
    green: 'border-emerald-200 bg-emerald-50/40',
  };
  const deltaColor = {
    red: 'text-red-600',
    amber: 'text-amber-600',
    green: 'text-emerald-600',
  };

  return (
    <div className={`rounded-xl border p-4 ${ragBorder[rag]}`}>
      <p className="text-[11px] font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <span className={`text-xs font-semibold ${deltaColor[rag]}`}>{delta}</span>
    </div>
  );
}

function MiniSparkline({ data }) {
  return (
    <div className="h-6 w-16 inline-block">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.map(v => ({ v }))}>
          <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function getRag(failureRate) {
  if (failureRate > 10) return 'red';
  if (failureRate > 5) return 'amber';
  return 'green';
}

function getTatRag(tat) {
  if (tat > 48) return 'red';
  if (tat > 24) return 'amber';
  return 'green';
}

const RAG_DOT = {
  red: 'bg-red-500',
  amber: 'bg-amber-500',
  green: 'bg-emerald-500',
};

export default function DisbursementView() {
  const kpi = disbursementKPIs;

  return (
    <div className="space-y-5">
      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Disbursement Count MTD"
          value={kpi.count.toLocaleString()}
          delta={`${kpi.countMoM > 0 ? '+' : ''}${kpi.countMoM}% MoM`}
          rag={kpi.countMoM > 0 ? 'green' : 'red'}
        />
        <KpiCard
          label="Total Amount (Cr)"
          value={`₹${kpi.totalAmountCr}`}
          delta={`${kpi.amountMoM > 0 ? '+' : ''}${kpi.amountMoM}% MoM`}
          rag={kpi.amountMoM > 0 ? 'green' : 'red'}
        />
        <KpiCard
          label="Approval → Disbursement %"
          value={`${kpi.approvalToDisbPct}%`}
          delta={`${kpi.approvalToDisbMoM > 0 ? '+' : ''}${kpi.approvalToDisbMoM}pp MoM`}
          rag={kpi.approvalToDisbPct > 90 ? 'green' : kpi.approvalToDisbPct > 80 ? 'amber' : 'red'}
        />
        <KpiCard
          label="Avg TAT (hours)"
          value={kpi.avgTATHours.toString()}
          delta={`${kpi.tatMoM > 0 ? '+' : ''}${kpi.tatMoM}% MoM`}
          rag={getTatRag(kpi.avgTATHours)}
        />
      </div>

      {/* Daily Disbursement Trend */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Daily Disbursement — Feb 2026</h2>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyDisbursement}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis yAxisId="count" tick={{ fontSize: 10 }} stroke="#94a3b8" label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#94a3b8' } }} />
              <YAxis yAxisId="amount" orientation="right" tick={{ fontSize: 10 }} stroke="#94a3b8" label={{ value: 'Amount (Cr)', angle: 90, position: 'insideRight', style: { fontSize: 10, fill: '#94a3b8' } }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Line yAxisId="count" type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} name="Count" />
              <Line yAxisId="amount" type="monotone" dataKey="amountCr" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} name="Amount (Cr)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 rounded" /> Count</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 rounded" /> Amount (Cr)</span>
        </div>
      </div>

      {/* Lender-wise Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Lender-wise Breakdown</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="text-left px-5 py-2.5">Lender</th>
              <th className="text-right px-5 py-2.5">Count</th>
              <th className="text-right px-5 py-2.5">Amount (Cr)</th>
              <th className="text-right px-5 py-2.5">Avg TAT (hrs)</th>
              <th className="text-right px-5 py-2.5">Failure Rate %</th>
              <th className="text-center px-5 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {lenderBreakdown.map((row) => {
              const rag = getRag(row.failureRate);
              return (
                <tr key={row.lender} className="hover:bg-slate-50/50">
                  <td className="px-5 py-2.5 font-medium text-slate-700">{row.lender}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{row.count.toLocaleString()}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">₹{row.amountCr}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{row.avgTAT}</td>
                  <td className={`px-5 py-2.5 text-right tabular-nums font-semibold ${
                    rag === 'red' ? 'text-red-600' : rag === 'amber' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>{row.failureRate}%</td>
                  <td className="px-5 py-2.5 text-center">
                    <span className={`w-2.5 h-2.5 rounded-full inline-block ${RAG_DOT[rag]}`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Failure Analysis */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Failure Analysis</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Top failure reasons for disbursement rejections MTD</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="text-left px-5 py-2.5 w-8">#</th>
              <th className="text-left px-5 py-2.5">Reason</th>
              <th className="text-right px-5 py-2.5">Count</th>
              <th className="text-right px-5 py-2.5">% of Total</th>
              <th className="text-center px-5 py-2.5">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {failureReasons.map((row, idx) => (
              <tr key={row.reason} className="hover:bg-slate-50/50">
                <td className="px-5 py-2.5 text-[10px] text-slate-400">{idx + 1}</td>
                <td className="px-5 py-2.5 font-medium text-slate-700">{row.reason}</td>
                <td className="px-5 py-2.5 text-right tabular-nums">{row.count}</td>
                <td className="px-5 py-2.5 text-right tabular-nums font-semibold text-slate-600">{row.pct}%</td>
                <td className="px-5 py-2.5 text-center">
                  <MiniSparkline data={row.trend} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
