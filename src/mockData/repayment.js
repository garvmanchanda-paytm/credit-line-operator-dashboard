export const duesSnapshot = {
  totalBilled:   53.71,
  totalRepaid:   55.06,
  outstanding:   12.45,
  odAbove7Days:  5886,
};

export const momRepayment = [
  { month: 'Oct-25', customersRepaid: 8145,   totalRepayments: 15359,  amountCr: 2.99,  overpayAccounts: 3823 },
  { month: 'Nov-25', customersRepaid: 26355,  totalRepayments: 48704,  amountCr: 12.13, overpayAccounts: 13606 },
  { month: 'Dec-25', customersRepaid: 57881,  totalRepayments: 108839, amountCr: 28.22, overpayAccounts: 33359 },
  { month: 'Jan-26', customersRepaid: 97546,  totalRepayments: 171026, amountCr: 48.29, overpayAccounts: 60122 },
  { month: 'Feb-26', customersRepaid: 126045, totalRepayments: 183118, amountCr: 55.06, overpayAccounts: 125381 },
];

export const paidBreakdown = [
  { segment: 'Paid Full',       count: 98240,  pct: 60.2 },
  { segment: 'Partial Payment', count: 27805,  pct: 17.0, avgPartialAmt: 1850 },
  { segment: 'Did Not Pay',     count: 37200,  pct: 22.8 },
];

// ── DPD Recon (new layout) ──
export const dpdRecon = [
  { dpdCount: 90,  paytmLms: 4700,    lenderFile: 4700,    delta: 0 },
  { dpdCount: 61,  paytmLms: 3050,    lenderFile: 3100,    delta: 50 },
  { dpdCount: 45,  paytmLms: 6820,    lenderFile: 6800,    delta: -20 },
  { dpdCount: 30,  paytmLms: 15620,   lenderFile: 15400,   delta: -220 },
  { dpdCount: 15,  paytmLms: 8200,    lenderFile: 8180,    delta: -20 },
  { dpdCount: 7,   paytmLms: 4200,    lenderFile: 4200,    delta: 0 },
  { dpdCount: 1,   paytmLms: 118200,  lenderFile: 118200,  delta: 0 },
];

export const dpdInsights = [
  { type: 'error', label: 'CRITICAL MISMATCH', text: 'Critical mismatch at DPD 17: Paytm LMS shows 2,290 LANs vs Lender showing 2,252 LANs (Delta: -38).', action: 'Investigate DPD 17 Delta' },
  { type: 'success', label: 'RECONCILED BUCKETS', text: 'DPD buckets 90+ are 100% reconciled for today\'s sync.', action: 'None Required' },
];

// ── Day-on-Day Repayment Trend ──
export const dailyRepaymentTrend = [
  { date: 'Feb 01', amount: 0.42, count: 4120 },
  { date: 'Feb 02', amount: 0.38, count: 3860 },
  { date: 'Feb 03', amount: 0.55, count: 5210 },
  { date: 'Feb 04', amount: 0.61, count: 5870 },
  { date: 'Feb 05', amount: 0.72, count: 6540 },
  { date: 'Feb 06', amount: 0.68, count: 6210 },
  { date: 'Feb 07', amount: 0.85, count: 7400 },
  { date: 'Feb 08', amount: 0.91, count: 7980 },
  { date: 'Feb 09', amount: 0.78, count: 7120 },
  { date: 'Feb 10', amount: 1.02, count: 8850 },
  { date: 'Feb 11', amount: 1.12, count: 9410 },
  { date: 'Feb 12', amount: 0.95, count: 8240 },
  { date: 'Feb 13', amount: 1.18, count: 9900 },
  { date: 'Feb 14', amount: 1.25, count: 10320 },
  { date: 'Feb 15', amount: 1.31, count: 10750 },
  { date: 'Feb 16', amount: 0.88, count: 7650 },
  { date: 'Feb 17', amount: 0.76, count: 6830 },
  { date: 'Feb 18', amount: 1.05, count: 9100 },
  { date: 'Feb 19', amount: 1.15, count: 9620 },
  { date: 'Feb 20', amount: 1.22, count: 10200 },
  { date: 'Feb 21', amount: 1.08, count: 9300 },
  { date: 'Feb 22', amount: 1.35, count: 11050 },
];

// ── Unreconciled LAN-level data ──
export const unreconciledLANs = [
  { lan: 'LAN-00482901', customerName: 'Ravi Sharma', paytmStatus: 'Paid', lenderStatus: 'Unpaid', amount: 2450, paymentDate: '2026-02-19', mismatchReason: 'Settlement delay' },
  { lan: 'LAN-00517234', customerName: 'Priya Gupta', paytmStatus: 'Paid', lenderStatus: 'Unpaid', amount: 1800, paymentDate: '2026-02-20', mismatchReason: 'Mandate bounce reversal' },
  { lan: 'LAN-00539871', customerName: 'Amit Patel', paytmStatus: 'Paid', lenderStatus: 'Unpaid', amount: 3200, paymentDate: '2026-02-18', mismatchReason: 'UTR mismatch' },
  { lan: 'LAN-00561020', customerName: 'Sneha Reddy', paytmStatus: 'Paid', lenderStatus: 'Unpaid', amount: 1950, paymentDate: '2026-02-21', mismatchReason: 'Settlement delay' },
  { lan: 'LAN-00583445', customerName: 'Vikram Singh', paytmStatus: 'Paid', lenderStatus: 'Unpaid', amount: 2750, paymentDate: '2026-02-17', mismatchReason: 'NACH return not synced' },
  { lan: 'LAN-00594812', customerName: 'Meera Joshi', paytmStatus: 'Paid', lenderStatus: 'Unpaid', amount: 2100, paymentDate: '2026-02-20', mismatchReason: 'UTR mismatch' },
  { lan: 'LAN-00602378', customerName: 'Rahul Verma', paytmStatus: 'Paid', lenderStatus: 'Unpaid', amount: 4100, paymentDate: '2026-02-19', mismatchReason: 'Settlement delay' },
  { lan: 'LAN-00614590', customerName: 'Anita Das', paytmStatus: 'Paid', lenderStatus: 'Unpaid', amount: 1600, paymentDate: '2026-02-21', mismatchReason: 'Mandate bounce reversal' },
  { lan: 'LAN-00625103', customerName: 'Karan Mehta', paytmStatus: 'Paid', lenderStatus: 'Unpaid', amount: 2850, paymentDate: '2026-02-18', mismatchReason: 'UTR mismatch' },
  { lan: 'LAN-00637461', customerName: 'Deepika Nair', paytmStatus: 'Paid', lenderStatus: 'Unpaid', amount: 1450, paymentDate: '2026-02-20', mismatchReason: 'Settlement delay' },
];

// ── Repayment Snapshot ──
export const repaymentSnapshot = {
  collectionEfficiency: 82.6,
  totalBilled: 268000000,
  totalRepayment: 221000000,
  outstandingAmount: 4660000,
  lansWithBill: 139100,
  customersPaidFull: 118200,
  partialRepayment: 14350,
  unreconciledDelta: 47,
  repaymentByMode: [
    { mode: 'Pay Now (Manual App Payment)', pct: 28, color: '#3b82f6' },
    { mode: 'Mandate (Auto-Debit)', pct: 58, color: '#22c55e' },
    { mode: 'Collection Link (Agent recovery)', pct: 14, color: '#6366f1' },
  ],
};
