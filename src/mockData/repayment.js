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
