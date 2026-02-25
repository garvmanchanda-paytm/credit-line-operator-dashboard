import { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { lanBreakdownBillGen, lanBreakdownDailyDues } from '../mockData/billRecon';
import { unreconciledLANs } from '../mockData/repayment';

export default function LANBreakdownPage() {
  const { lanBreakdownConfig, navigateBackFromLanBreakdown, navigateToCustomer360 } = useDashboard();
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const config = lanBreakdownConfig || {};
  const isRepaymentUnrecon = config.type === 'repaymentUnrecon';
  const isDailyDues = config.type === 'dailyDues';
  const rawData = isRepaymentUnrecon ? unreconciledLANs : (isDailyDues ? lanBreakdownDailyDues : lanBreakdownBillGen);

  if (isRepaymentUnrecon) {
    return <RepaymentUnreconView config={config} rawData={rawData} navigateBackFromLanBreakdown={navigateBackFromLanBreakdown} navigateToCustomer360={navigateToCustomer360} />;
  }

  const rows = useMemo(() => {
    if (!search) return rawData;
    const q = search.toLowerCase();
    return rawData.filter(
      (r) => r.paytmLan.toLowerCase().includes(q) || r.lenderLan.toLowerCase().includes(q)
    );
  }, [rawData, search]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const allSelected = rows.every((r) => selected.has(r.id));
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));
  };

  const fmt = (v) => {
    if (v === 0) return <span className="text-slate-400">₹0</span>;
    return `₹${v.toLocaleString('en-IN')}`;
  };

  const deltaCell = (v) => {
    if (v === 0) return <span className="text-slate-400">0</span>;
    const isNeg = v < 0;
    return (
      <span className={`font-semibold ${isNeg ? 'text-red-600' : 'text-emerald-600'}`}>
        {isNeg ? '' : '+'}{v < 0 ? `₹${Math.abs(v).toLocaleString('en-IN')}` : `₹${v.toLocaleString('en-IN')}`}
      </span>
    );
  };

  const totalDeltaCell = (v) => {
    if (v === 0) return <span className="text-slate-400">0</span>;
    const isNeg = v < 0;
    return (
      <span className={`font-bold ${isNeg ? 'text-red-600' : 'text-emerald-600'}`}>
        ₹{v.toLocaleString('en-IN')}
      </span>
    );
  };

  const handleSendEmail = () => {
    const existing = JSON.parse(localStorage.getItem('lanEscalationSent') || '{}');
    const ts = new Date().toISOString();
    selected.forEach((id) => { existing[id] = ts; });
    localStorage.setItem('lanEscalationSent', JSON.stringify(existing));
    setShowEmailModal(false);
    setSelected(new Set());
  };

  const pKey = isDailyDues ? 'principalDue' : 'principal';
  const cKey = isDailyDues ? 'cfDue' : 'cf';
  const gKey = isDailyDues ? 'gstDue' : 'gstCf';
  const bKey = isDailyDues ? 'bounceDue' : 'bounce';
  const lKey = isDailyDues ? 'lpfDue' : 'lpf';
  const lpKey = isDailyDues ? 'lPrincipalDue' : 'lPrincipal';
  const lcKey = isDailyDues ? 'lCfDue' : 'lCf';
  const lgKey = isDailyDues ? 'lGstDue' : 'lGstCf';
  const lbKey = isDailyDues ? 'lBounceDue' : 'lBounce';
  const llKey = isDailyDues ? 'lLpfDue' : 'lLpf';

  const pLabel = isDailyDues ? 'Principal Due' : 'Principal';
  const cLabel = 'CF';
  const gLabel = isDailyDues ? 'GST Due' : 'GST on CF';
  const bLabel = isDailyDues ? 'Bounce Due' : 'Bounce Charge';
  const lLabel = isDailyDues ? 'LPF Due' : 'LPF';

  return (
    <div className="space-y-4">
      <button
        onClick={navigateBackFromLanBreakdown}
        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
      >
        ← Back to Finance Recon
      </button>

      <h2 className="text-lg font-bold text-slate-900">
        {config.title || 'Discrepancy Investigation'}
        <span className="text-xs font-normal text-slate-400 ml-2">
          (TOTAL DELTA = Principal Delta + CF + GST + Bounce + LPF)
        </span>
      </h2>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by Paytm LAN or Lender LAN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{selected.size} rows selected</p>
        {selected.size > 0 && (
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors"
          >
            <span>✉</span> Escalate Selected to Lender
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-2 py-2 w-8">
                  <input type="checkbox" onChange={toggleAll} checked={rows.length > 0 && rows.every((r) => selected.has(r.id))} className="w-3.5 h-3.5 rounded" />
                </th>
                <th className="text-left px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase">Paytm LAN</th>
                <th className="text-left px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase">Lender LAN</th>
                <th colSpan={5} className="text-center px-2 py-1.5 text-[10px] font-bold text-blue-700 bg-blue-50/50 border-l border-r border-blue-100 uppercase">Paytm LMS</th>
                <th colSpan={5} className="text-center px-2 py-1.5 text-[10px] font-bold text-indigo-700 bg-indigo-50/50 border-r border-indigo-100 uppercase">Lender File</th>
                <th colSpan={6} className="text-center px-2 py-1.5 text-[10px] font-bold text-red-700 bg-red-50/50 uppercase">Delta / Difference</th>
              </tr>
              <tr className="bg-slate-50/60 text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                <th></th>
                <th></th>
                <th></th>
                <th className="text-right px-2 py-1.5 bg-blue-50/30 border-l border-blue-100">{pLabel}</th>
                <th className="text-right px-2 py-1.5 bg-blue-50/30">{cLabel}</th>
                <th className="text-right px-2 py-1.5 bg-blue-50/30">{gLabel}</th>
                <th className="text-right px-2 py-1.5 bg-blue-50/30">{bLabel}</th>
                <th className="text-right px-2 py-1.5 bg-blue-50/30 border-r border-blue-100">{lLabel}</th>
                <th className="text-right px-2 py-1.5 bg-indigo-50/30">{pLabel}</th>
                <th className="text-right px-2 py-1.5 bg-indigo-50/30">{cLabel}</th>
                <th className="text-right px-2 py-1.5 bg-indigo-50/30">{gLabel}</th>
                <th className="text-right px-2 py-1.5 bg-indigo-50/30">{bLabel}</th>
                <th className="text-right px-2 py-1.5 bg-indigo-50/30 border-r border-indigo-100">{lLabel}</th>
                <th className="text-right px-2 py-1.5 bg-red-50/30">Principal Delta</th>
                <th className="text-right px-2 py-1.5 bg-red-50/30">CF Δ</th>
                <th className="text-right px-2 py-1.5 bg-red-50/30">GST Δ</th>
                <th className="text-right px-2 py-1.5 bg-red-50/30">Bounce Δ</th>
                <th className="text-right px-2 py-1.5 bg-red-50/30">LPF Δ</th>
                <th className="text-right px-2 py-1.5 bg-red-50/30 font-bold">Total Δ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((row) => (
                <tr key={row.id} className={`${selected.has(row.id) ? 'bg-blue-50/40' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-2 py-2">
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleSelect(row.id)} className="w-3.5 h-3.5 rounded" />
                  </td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => navigateToCustomer360(row.paytmLan)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      {row.paytmLan}
                    </button>
                  </td>
                  <td className="px-2 py-2 text-slate-600">{row.lenderLan}</td>
                  <td className="px-2 py-2 text-right tabular-nums bg-blue-50/10 border-l border-blue-50">{fmt(row[pKey])}</td>
                  <td className="px-2 py-2 text-right tabular-nums bg-blue-50/10">{fmt(row[cKey])}</td>
                  <td className="px-2 py-2 text-right tabular-nums bg-blue-50/10">{fmt(row[gKey])}</td>
                  <td className="px-2 py-2 text-right tabular-nums bg-blue-50/10">{fmt(row[bKey])}</td>
                  <td className="px-2 py-2 text-right tabular-nums bg-blue-50/10 border-r border-blue-50">{fmt(row[lKey])}</td>
                  <td className="px-2 py-2 text-right tabular-nums bg-indigo-50/10">{fmt(row[lpKey])}</td>
                  <td className="px-2 py-2 text-right tabular-nums bg-indigo-50/10">{fmt(row[lcKey])}</td>
                  <td className="px-2 py-2 text-right tabular-nums bg-indigo-50/10">{fmt(row[lgKey])}</td>
                  <td className="px-2 py-2 text-right tabular-nums bg-indigo-50/10">{fmt(row[lbKey])}</td>
                  <td className="px-2 py-2 text-right tabular-nums bg-indigo-50/10 border-r border-indigo-50">{fmt(row[llKey])}</td>
                  <td className={`px-2 py-2 text-right tabular-nums ${row.principalDelta !== 0 ? 'bg-red-50/40' : 'bg-red-50/10'}`}>{deltaCell(row.principalDelta)}</td>
                  <td className={`px-2 py-2 text-right tabular-nums ${row.cfDelta !== 0 ? 'bg-red-50/40' : 'bg-red-50/10'}`}>{deltaCell(row.cfDelta)}</td>
                  <td className={`px-2 py-2 text-right tabular-nums ${row.gstDelta !== 0 ? 'bg-red-50/40' : 'bg-red-50/10'}`}>{deltaCell(row.gstDelta)}</td>
                  <td className={`px-2 py-2 text-right tabular-nums ${row.bounceDelta !== 0 ? 'bg-red-50/40' : 'bg-red-50/10'}`}>{deltaCell(row.bounceDelta)}</td>
                  <td className={`px-2 py-2 text-right tabular-nums ${row.lpfDelta !== 0 ? 'bg-red-50/40' : 'bg-red-50/10'}`}>{deltaCell(row.lpfDelta)}</td>
                  <td className={`px-2 py-2 text-right tabular-nums ${row.totalDelta !== 0 ? 'bg-red-100/40' : 'bg-red-50/10'}`}>{totalDeltaCell(row.totalDelta)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Escalation Modal */}
      {showEmailModal && <EscalateModal selected={selected} rows={rows} config={config} onClose={() => setShowEmailModal(false)} onSend={handleSendEmail} />}
    </div>
  );
}

function EscalateModal({ selected, rows, config, onClose, onSend }) {
  const [sending, setSending] = useState(false);
  const selectedRows = rows.filter((r) => selected.has(r.id));
  const dimension = config.dimension || 'All';

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      onSend();
      setSending(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Escalate Discrepancies to SSFB</h3>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">To</label>
            <p className="text-sm text-slate-700 mt-1 bg-slate-50 rounded-lg px-3 py-2">recon-support@ssfb-lender.com</p>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Subject</label>
            <p className="text-sm text-slate-700 mt-1 bg-slate-50 rounded-lg px-3 py-2">
              URGENT: Billing Discrepancy Alert - Feb 2026 - {dimension}
            </p>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Message</label>
            <div className="mt-1 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700 leading-relaxed">
              <p>Hi Team,</p>
              <br />
              <p>We have identified discrepancies in the latest billing file sync for the attached Loan Account Numbers. Please review the delta between our LMS and your generated file and advise at the earliest.</p>
              <br />
              <p>Thanks,<br />Finance Ops</p>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Attachment</label>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              <span className="text-slate-400">📎</span>
              Discrepancy_Report_{selectedRows.length}_LANs.csv
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60"
          >
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
}

function RepaymentUnreconView({ config, rawData, navigateBackFromLanBreakdown, navigateToCustomer360 }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [showEmailModal, setShowEmailModal] = useState(false);

  const rows = useMemo(() => {
    if (!search) return rawData;
    const q = search.toLowerCase();
    return rawData.filter(r => r.lan.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q));
  }, [rawData, search]);

  const toggleSelect = (lan) => {
    setSelected(prev => { const next = new Set(prev); next.has(lan) ? next.delete(lan) : next.add(lan); return next; });
  };
  const toggleAll = () => {
    setSelected(rows.every(r => selected.has(r.lan)) ? new Set() : new Set(rows.map(r => r.lan)));
  };

  const handleSendEmail = () => {
    const existing = JSON.parse(localStorage.getItem('lanEscalationSent') || '{}');
    const ts = new Date().toISOString();
    selected.forEach(lan => { existing[lan] = ts; });
    localStorage.setItem('lanEscalationSent', JSON.stringify(existing));
    setShowEmailModal(false);
    setSelected(new Set());
  };

  const statusBadge = (paytm, lender) => {
    const mismatch = paytm !== lender;
    return (
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">{paytm}</span>
        {mismatch && <span className="text-[10px] text-slate-400">vs</span>}
        {mismatch && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">{lender}</span>}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <button onClick={navigateBackFromLanBreakdown} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">← Back to Repayment</button>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{config.title || 'Unreconciled Repayments'}</h2>
          <p className="text-xs text-slate-500 mt-0.5">LANs where Paytm shows paid but lender file shows unpaid — investigate settlement gaps</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-right">
          <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">Unreconciled</p>
          <p className="text-xl font-bold text-amber-700">{rawData.length}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input type="text" placeholder="Search by LAN or customer name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <p className="text-xs text-slate-500">{selected.size} selected</p>
        {selected.size > 0 && (
          <button onClick={() => setShowEmailModal(true)} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors">
            <span>✉</span> Escalate to Lender
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-3 py-2.5 w-8"><input type="checkbox" onChange={toggleAll} checked={rows.length > 0 && rows.every(r => selected.has(r.lan))} className="w-3.5 h-3.5 rounded" /></th>
                <th className="text-left px-3 py-2.5">LAN</th>
                <th className="text-left px-3 py-2.5">Customer</th>
                <th className="text-left px-3 py-2.5">Status</th>
                <th className="text-right px-3 py-2.5">Amount (₹)</th>
                <th className="text-left px-3 py-2.5">Payment Date</th>
                <th className="text-left px-3 py-2.5">Mismatch Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map(row => (
                <tr key={row.lan} className={`${selected.has(row.lan) ? 'bg-blue-50/40' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-3 py-2.5"><input type="checkbox" checked={selected.has(row.lan)} onChange={() => toggleSelect(row.lan)} className="w-3.5 h-3.5 rounded" /></td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => navigateToCustomer360(row.lan)} className="text-blue-600 hover:text-blue-800 font-medium hover:underline">{row.lan}</button>
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 font-medium">{row.customerName}</td>
                  <td className="px-3 py-2.5">{statusBadge(row.paytmStatus, row.lenderStatus)}</td>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-slate-800">₹{row.amount.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2.5 text-slate-600 tabular-nums">{row.paymentDate}</td>
                  <td className="px-3 py-2.5">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">{row.mismatchReason}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Escalate Unreconciled Repayments to Lender</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">To</label>
                <p className="text-sm text-slate-700 mt-1 bg-slate-50 rounded-lg px-3 py-2">recon-support@ssfb-lender.com</p>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Subject</label>
                <p className="text-sm text-slate-700 mt-1 bg-slate-50 rounded-lg px-3 py-2">
                  URGENT: Unreconciled Repayments — {selected.size} LANs — Feb 2026
                </p>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Message</label>
                <div className="mt-1 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700 leading-relaxed">
                  <p>Hi Team,</p><br />
                  <p>We have identified {selected.size} Loan Account Numbers where Paytm records show the repayment as Paid, but the lender file reflects Unpaid status. Please investigate the settlement pipeline for these LANs and confirm resolution at the earliest.</p><br />
                  <p>Thanks,<br />Finance Ops</p>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Attachment</label>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                  <span className="text-slate-400">📎</span> Unreconciled_Repayments_{selected.size}_LANs.csv
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button onClick={() => setShowEmailModal(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={handleSendEmail} className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Send Email</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
