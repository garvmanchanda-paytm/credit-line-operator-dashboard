import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { lanRows } from '../../mockData/billRecon';

export default function EmailModal({ selectedIds, dimension, onSent }) {
  const { setShowEmailModal } = useDashboard();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const selectedLans = lanRows.filter(r => selectedIds.has(r.id));
  const month = 'Feb-26';

  const subject = `Paytm Postpaid — LAN Reconciliation Request — ${dimension || 'All'} — ${month} — ${selectedLans.length} LANs`;

  const bodyRows = selectedLans.map(r =>
    `${r.lmsLan} | ${r.ssfbLan} | SSFB: ${r.ssfbVal} | LMS: ${r.lmsVal} | Diff: ${r.diff} | Repayment: ₹${r.repayment.toLocaleString()}`
  ).join('\n');

  const body = `Hi SSFB Ops,\n\nPlease find below ${selectedLans.length} LAN(s) with reconciliation mismatches for ${month} — ${dimension || 'All dimensions'}.\n\n${bodyRows}\n\nRequest you to review and reconcile at the earliest.\n\nRegards,\nPaytm Postpaid Product Team`;

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem('lanSentStatus') || '{}');
      const ts = new Date().toISOString();
      selectedLans.forEach(r => { existing[r.id] = ts; });
      localStorage.setItem('lanSentStatus', JSON.stringify(existing));
      setSending(false);
      setSent(true);
      if (onSent) onSent();
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Send Reconciliation Request</h3>
          <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">To</label>
            <p className="text-sm text-slate-700 mt-0.5">ssfb-ops@partner-bank.co.in</p>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Subject</label>
            <p className="text-sm text-slate-700 mt-0.5">{subject}</p>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Body</label>
            <pre className="text-xs text-slate-600 mt-1 bg-slate-50 rounded-lg p-3 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">{body}</pre>
          </div>
          <div className="text-[11px] text-slate-400">
            Attachment: CSV export of {selectedLans.length} LAN row(s) will be attached.
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
          <button onClick={handleCopy} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Copy to Clipboard
          </button>
          <div className="flex gap-2">
            <button onClick={() => setShowEmailModal(false)} className="px-4 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
            {sent ? (
              <span className="px-4 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-lg">Sent</span>
            ) : (
              <button onClick={handleSend} disabled={sending} className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60">
                {sending ? 'Sending...' : 'Send Email'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
