import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { momMetrics, currentMonthKPIs, loanStatusDistribution, transactingUsers } from '../../mockData/portfolio';

const DONUT_COLORS = ['#22c55e', '#94a3b8', '#ef4444', '#f59e0b', '#cbd5e1'];
const BAR_COLORS = { repeat: '#0d9488', newUsers: '#3b82f6', inactiveLastMonth: '#f59e0b' };

function getRag(delta, thresholds) {
  if (delta == null) return { color: 'bg-slate-100 text-slate-600', label: '—' };
  if (thresholds.greenIf?.(delta)) return { color: 'bg-emerald-100 text-emerald-700', label: 'Green' };
  if (thresholds.redIf?.(delta)) return { color: 'bg-red-100 text-red-700', label: 'Red' };
  return { color: 'bg-amber-100 text-amber-700', label: 'Amber' };
}

const KPIS = [
  { label: 'Total Active Accounts', value: currentMonthKPIs.totalActiveAccounts.toLocaleString(), delta: null, rag: { color: 'bg-slate-100 text-slate-600', label: 'Baseline' } },
  { label: 'Monthly Signups', value: currentMonthKPIs.monthlySignups.toLocaleString(), delta: `${currentMonthKPIs.signupsMoM}%`, rag: getRag(currentMonthKPIs.signupsMoM, { redIf: d => d < -15, greenIf: d => d > -5 }) },
  { label: 'GMV (Cr)', value: `₹${currentMonthKPIs.gmvCr}`, delta: `+${currentMonthKPIs.gmvMoM}%`, rag: getRag(currentMonthKPIs.gmvMoM, { greenIf: d => d > 0, redIf: d => d < -5 }) },
  { label: 'Txning Users', value: currentMonthKPIs.txningUsers.toLocaleString(), delta: `+${currentMonthKPIs.txningUsersMoM}%`, rag: getRag(currentMonthKPIs.txningUsersMoM, { greenIf: d => d > 10, redIf: d => d < 0 }) },
  { label: 'SPAC', value: `₹${currentMonthKPIs.spac.toLocaleString()}`, delta: `${currentMonthKPIs.spacMoM}%`, rag: getRag(currentMonthKPIs.spacMoM, { greenIf: d => d > 0, redIf: d => d < -15 }) },
  { label: 'Frozen / VKYC Blocked', value: `${currentMonthKPIs.frozenAccounts.toLocaleString()} + ${currentMonthKPIs.vkycBlocked.toLocaleString()}`, delta: `${((currentMonthKPIs.frozenAccounts + currentMonthKPIs.vkycBlocked) / currentMonthKPIs.totalActiveAccounts * 100).toFixed(1)}% of active`, rag: getRag((currentMonthKPIs.frozenAccounts + currentMonthKPIs.vkycBlocked) / currentMonthKPIs.totalActiveAccounts * 100, { greenIf: d => d < 1, redIf: d => d > 2 }) },
];

export default function Portfolio() {
  const { setPostOnbTab, openIssuePanel } = useDashboard();

  const crossLinkFrozenToDPD = () => setPostOnbTab('repayment');
  const crossLinkVKYC = () => openIssuePanel('stuck_vkyc_selfie');

  return (
    <div className="space-y-5">
      {/* MoM Portfolio Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Month-on-Month Portfolio Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-2.5">Month</th>
                <th className="text-right px-3 py-2.5">Signups</th>
                <th className="text-right px-3 py-2.5">GMV (Cr)</th>
                <th className="text-right px-3 py-2.5">Txns</th>
                <th className="text-right px-3 py-2.5">AIF</th>
                <th className="text-right px-3 py-2.5">Txning Users</th>
                <th className="text-right px-3 py-2.5">SPAC</th>
                <th className="text-right px-3 py-2.5">Limit (Cr)</th>
                <th className="text-right px-3 py-2.5">Avg CF (Onb)</th>
                <th className="text-right px-3 py-2.5">Avg CF (Txn)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {momMetrics.map((row) => {
                const isCurrent = row.month === 'Feb-26';
                return (
                  <tr key={row.month} className={isCurrent ? 'bg-blue-50/40 font-semibold' : ''}>
                    <td className="px-4 py-2 text-slate-700">{row.month}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.signups.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right tabular-nums">₹{row.gmv}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{(row.txns / 100000).toFixed(2)}L</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.aif.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.txningUsers.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right tabular-nums">₹{row.spac.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.limitCr}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.avgCfOnb}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.avgCfTxn}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between mb-1.5">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{kpi.label}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${kpi.rag.color}`}>{kpi.rag.label}</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{kpi.value}</p>
            {kpi.delta && <p className={`text-xs mt-0.5 ${kpi.rag.label === 'Green' ? 'text-emerald-600' : kpi.rag.label === 'Red' ? 'text-red-600' : 'text-amber-600'}`}>{kpi.delta} vs Jan</p>}
          </div>
        ))}
      </div>

      {/* Loan Status + Transacting Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Loan Status Donut */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Loan Account Status</h3>
          <div className="flex items-start gap-4">
            <div className="w-40 h-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={loanStatusDistribution} dataKey="count" nameKey="status" innerRadius="50%" outerRadius="85%" paddingAngle={1}>
                    {loanStatusDistribution.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(val) => val.toLocaleString()} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <table className="text-xs flex-1">
              <tbody>
                {loanStatusDistribution.map((s, i) => {
                  const isFrozen = s.status === 'FROZEN';
                  const isVKYC = s.status === 'VKYC_SOFTBLOCKED';
                  const clickable = isFrozen || isVKYC;
                  return (
                    <tr
                      key={s.status}
                      className={`border-b border-slate-50 last:border-0 ${clickable ? 'cursor-pointer hover:bg-blue-50/50' : ''}`}
                      onClick={isFrozen ? crossLinkFrozenToDPD : isVKYC ? crossLinkVKYC : undefined}
                    >
                      <td className="py-1.5 pr-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[i] }} />
                          <span className={`font-medium ${clickable ? 'text-blue-600 underline' : 'text-slate-700'}`}>{s.status}</span>
                        </div>
                      </td>
                      <td className="py-1.5 text-right tabular-nums font-semibold text-slate-800">{s.count.toLocaleString()}</td>
                      <td className="py-1.5 text-right text-slate-400 pl-2">{s.pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transacting Users Stacked Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Transacting Users — Repeat vs New vs Reactivated</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactingUsers}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(val) => val.toLocaleString()} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="repeat" name="Repeat" stackId="a" fill={BAR_COLORS.repeat} radius={[0, 0, 0, 0]} />
                <Bar dataKey="newUsers" name="New" stackId="a" fill={BAR_COLORS.newUsers} />
                <Bar dataKey="inactiveLastMonth" name="Reactivated" stackId="a" fill={BAR_COLORS.inactiveLastMonth} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
