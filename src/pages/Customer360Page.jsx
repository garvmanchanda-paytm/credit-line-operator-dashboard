import { useDashboard } from '../context/DashboardContext';
import { customer360 } from '../mockData/billRecon';

const STATUS_COLORS = {
  Success: 'bg-emerald-100 text-emerald-700',
  Failed: 'bg-red-100 text-red-700',
  done: 'text-emerald-600',
};

function Section({ title, children, cols = 1 }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="text-slate-300 text-lg">⊞</span>
      </div>
      <div className={`p-5 ${cols === 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : ''}`}>
        {children}
      </div>
    </div>
  );
}

function DataRow({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-500 w-48 flex-shrink-0">{label}</span>
      <span className={`text-xs text-slate-800 font-medium text-right ${mono ? 'font-mono' : ''}`}>{value || '—'}</span>
    </div>
  );
}

export default function Customer360Page() {
  const { customer360Lan, navigateBackToLanBreakdown } = useDashboard();

  const lanKey = customer360Lan || Object.keys(customer360)[0];
  const data = customer360[lanKey];

  if (!data) {
    const placeholderName = `Customer (${lanKey || 'Unknown'})`;
    return (
      <div className="space-y-4">
        <button onClick={navigateBackToLanBreakdown} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
          ← Back to LAN Breakdown
        </button>
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Customer 360</h2>
          <p className="text-sm text-slate-500">Detailed view for <span className="font-semibold">{placeholderName}</span></p>
          <p className="text-xs text-slate-400 mt-4">Mock data available for PTM_LN_2025_771001</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={navigateBackToLanBreakdown} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
          ← Back to LAN Breakdown
        </button>
        <div className="flex gap-2">
          <button className="text-xs border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 font-medium text-slate-600">
            Block Account
          </button>
          <button className="text-xs border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 font-medium text-blue-600">
            Export Ledger
          </button>
          <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-semibold">
            Load Notes
          </button>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Searching Paytm LAN & Link Account Number(s)
        <p className="font-mono text-slate-700">{data.lan}</p>
        <p className="text-slate-400">Search with a LAN to show: {data.lan}</p>
      </div>

      {/* Customer Header Card */}
      <div className="bg-blue-600 rounded-xl p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">{data.name}</h2>
          <div className="flex gap-2">
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">{data.status}</span>
            <span className="bg-blue-800 text-white text-[10px] font-bold px-2 py-0.5 rounded">{data.vkycStatus}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-blue-200 text-[10px] uppercase">Mobile</p>
            <p className="font-semibold">{data.mobile}</p>
          </div>
          <div>
            <p className="text-blue-200 text-[10px] uppercase">Paytm ID</p>
            <p className="font-semibold font-mono text-xs">{data.paytmId}</p>
          </div>
          <div>
            <p className="text-blue-200 text-[10px] uppercase">LAN</p>
            <p className="font-semibold font-mono text-xs">{data.lan}</p>
          </div>
          <div>
            <p className="text-blue-200 text-[10px] uppercase">Partner</p>
            <p className="font-semibold text-xs">{data.partner}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-blue-500/40">
          <div>
            <p className="text-blue-200 text-[10px] uppercase">Sanctioned Limit</p>
            <p className="font-bold text-lg">₹{data.limit.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-blue-200 text-[10px] uppercase">Available Limit</p>
            <p className="font-bold text-lg">₹{data.availableLimit.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-blue-200 text-[10px] uppercase">Convenience Fee</p>
            <p className="font-bold text-lg">{data.convenienceFee}%</p>
          </div>
        </div>
      </div>

      {/* Feb 2026 Bill Details */}
      <Section title={`${data.billDetails.month} Bill details`}>
        <div className="mb-3">
          <p className="text-[10px] text-slate-400 uppercase">Total Due</p>
          <p className="text-2xl font-bold text-slate-900">₹{data.billDetails.totalDue.toLocaleString('en-IN')}</p>
        </div>
        <div className="space-y-0">
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-xs text-slate-600">Principal Component</span>
            <span className="text-xs font-semibold text-slate-800">₹{data.billDetails.principal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-xs text-slate-600">Convenience Fee</span>
            <span className="text-xs font-semibold text-slate-800">₹{data.billDetails.cf.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-xs text-slate-600">Late Payment Fee</span>
            <span className="text-xs font-semibold text-slate-800">₹{data.billDetails.lpf.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-xs text-slate-600">Bounce Charges</span>
            <span className="text-xs font-semibold text-slate-800">₹{data.billDetails.bounce.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-xs font-bold text-slate-700">Total Due</span>
            <span className="text-xs font-bold text-slate-900">₹{data.billDetails.totalDue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </Section>

      {/* Repayment Behavior Log */}
      <Section title="Repayment Behavior Log">
        <div className="relative pl-6 space-y-0">
          {data.repaymentLog.map((entry, i) => (
            <div key={i} className="relative pb-5 last:pb-0">
              {i < data.repaymentLog.length - 1 && (
                <div className="absolute left-[-15px] top-3 bottom-0 w-px bg-slate-200" />
              )}
              <div className={`absolute left-[-19px] top-1 w-3 h-3 rounded-full border-2 ${entry.status === 'Success' ? 'bg-emerald-500 border-emerald-300' : 'bg-red-500 border-red-300'}`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">₹{entry.amount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-slate-500">Source: {entry.source}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{entry.date}</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${STATUS_COLORS[entry.status]}`}>{entry.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Two-column: Customer Profile + Onboarding Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="Customer Profile">
          <DataRow label="Name" value={data.name} />
          <DataRow label="Mobile" value={data.mobile} mono />
          <DataRow label="Paytm ID" value={data.paytmId} mono />
          <DataRow label="Status" value={data.status} />
          <DataRow label="VKYC Status" value={data.vkycStatus} />
          <DataRow label="Partner" value={data.partner} />
        </Section>

        <Section title="Onboarding Journey">
          <div className="space-y-0">
            {data.onboardingJourney.map((step, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${step.status === 'done' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {step.status === 'done' ? '✓' : '…'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{step.stage}</p>
                  <p className="text-[10px] text-slate-400">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Account & Loan Details */}
      <Section title="Account & Loan Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <DataRow label="Bank Account" value={data.accountDetails.bankAccount} mono />
            <DataRow label="IFSC" value={data.accountDetails.ifsc} mono />
            <DataRow label="Account Type" value={data.accountDetails.accountType} />
          </div>
          <div>
            <DataRow label="Loan Amount" value={`₹${data.accountDetails.loanAmount.toLocaleString('en-IN')}`} />
            <DataRow label="Loan Product Type" value={data.accountDetails.loanProductType} />
            <DataRow label="Mandate Status" value={data.accountDetails.mandateStatus} />
          </div>
        </div>
      </Section>
    </div>
  );
}
