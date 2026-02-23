// ── Bill Gen Recon — Monthly Snapshot ──
export const billGenSnapshot = [
  { month: 'Feb-2026', dimension: 'Total Bills',        ssfb: 148200, lms: 148200, diff: 0 },
  { month: 'Feb-2026', dimension: 'Bills Value = 0',    ssfb: 9100,   lms: 9050,   diff: 50 },
  { month: 'Feb-2026', dimension: 'Bills Value > 0',    ssfb: 139100, lms: 139150, diff: -50 },
  { month: 'Feb-2026', dimension: 'Total Bill Amount',  ssfb: 2680000000, lms: 2680000000, diff: 0, isCurrency: true },
  { month: 'Feb-2026', dimension: 'Total CF Amount',    ssfb: 482000, lms: 482000, diff: 0 },
  { month: 'Feb-2026', dimension: 'Accounts with CF',   ssfb: 139100, lms: 139100, diff: 0 },
  { month: 'Feb-2026', dimension: 'Total BF Amount',    ssfb: 162000, lms: 162000, diff: 0 },
  { month: 'Feb-2026', dimension: 'Accounts with BF',   ssfb: 4350,   lms: 4350,   diff: 0 },
  { month: 'Feb-2026', dimension: 'Total LPF Amount',   ssfb: 310000, lms: 315200, diff: -5200, isCurrency: true },
  { month: 'Feb-2026', dimension: 'Accounts with LPF',  ssfb: 7240,   lms: 7240,   diff: 0 },
];

// Smart insights for bill gen
export const billGenInsights = [
  { type: 'error', label: 'LPF MISMATCH', text: '₹5,200 mismatch detected in Total LPF Amount for Feb-2026.', action: 'Investigate LPF Delta' },
  { type: 'success', label: 'RECONCILED', text: 'Principal, CF, and BF amounts are 100% reconciled for the current month.', action: 'None' },
];

// ── MOM Lender Billing — Historical Trend ──
export const momBilling = [
  { billDate: 'Feb-2026', totalBills: 148200, billsVal0: 9100,  billedAmount: 26800, principalDue: 31000, lfApplied: 162000, bfApplied: 482000, cfApplied: 482000, variance: 22707, isCurrency: true },
  { billDate: 'Jan-2026', totalBills: 142500, billsVal0: 8420,  billedAmount: 24500, principalDue: 28000, lfApplied: 150000, bfApplied: 450000, cfApplied: 450000, variance: 0 },
  { billDate: 'Dec-2025', totalBills: 138800, billsVal0: 7950,  billedAmount: 23200, principalDue: 26500, lfApplied: 142000, bfApplied: 435000, cfApplied: 435000, variance: 0 },
  { billDate: 'Nov-2025', totalBills: 134100, billsVal0: 7680,  billedAmount: 21800, principalDue: 24800, lfApplied: 131000, bfApplied: 412000, cfApplied: 412000, variance: 0 },
  { billDate: 'Oct-2025', totalBills: 130500, billsVal0: 7200,  billedAmount: 20500, principalDue: 23400, lfApplied: 126000, bfApplied: 398000, cfApplied: 398000, variance: 0 },
  { billDate: 'Sep-2025', totalBills: 126200, billsVal0: 6800,  billedAmount: 19100, principalDue: 21800, lfApplied: 118000, bfApplied: 380000, cfApplied: 380000, variance: 0 },
];

export const momBillingInsights = [
  { type: 'error', label: 'BILLING VARIANCE', text: '₹22,707 total billing variance flagged for Feb-2026.', action: 'Review Feb Variance' },
  { type: 'info', label: 'PRIOR MONTH', text: 'Prior month (Jan-2026) is fully reconciled with ₹0 variance.', action: 'View Jan Data' },
];

// ── Daily Dues Recon (T-1) ──
export const dailyDuesCycles = [
  {
    cycle: 'Feb-2026 Bill Cycle (T-1)',
    paytmTotal: 2684500,
    lenderTotal: 2691200,
    variance: -6700,
    expanded: true,
    components: [
      { component: 'Principal Billed', paytm: 2450000, lender: 2450000, diff: 0, status: 'Match' },
      { component: 'Convenience Fees (CF)', paytm: 48200, lender: 48200, diff: 0, status: 'Match' },
      { component: 'GST on CF', paytm: 8676, lender: 8676, diff: 0, status: 'Match' },
      { component: 'Bounce Fee (BF)', paytm: 16200, lender: 19400, diff: -3200, status: 'Mismatch' },
      { component: 'Late Payment Fees (LPF)', paytm: 161424, lender: 164924, diff: -3500, status: 'Mismatch' },
    ],
  },
  {
    cycle: 'Jan-2026 Bill Cycle (T-1)',
    paytmTotal: 2498000,
    lenderTotal: 2498000,
    variance: 0,
    expanded: false,
    components: [
      { component: 'Principal Billed', paytm: 2280000, lender: 2280000, diff: 0, status: 'Match' },
      { component: 'Convenience Fees (CF)', paytm: 45000, lender: 45000, diff: 0, status: 'Match' },
      { component: 'GST on CF', paytm: 8100, lender: 8100, diff: 0, status: 'Match' },
      { component: 'Bounce Fee (BF)', paytm: 14900, lender: 14900, diff: 0, status: 'Match' },
      { component: 'Late Payment Fees (LPF)', paytm: 150000, lender: 150000, diff: 0, status: 'Match' },
    ],
  },
];

export const dailyDuesInsights = [
  { type: 'error', label: 'T-1 VARIANCE', text: '₹6,700 variance in Feb-2026 T-1 cycle. Driven entirely by Bounce Fee (₹-3,200) and LPF (₹-3,500) mismatches.', action: 'Escalate T-1 Delta' },
];

// ── LAN-level breakdown (Bill Gen) ──
export const lanBreakdownBillGen = [
  { id: 1,  paytmLan: 'PTM_LN_2025_771001', lenderLan: 'AB_LN_771001', principal: 125000, cf: 450, gstCf: 81, bounce: 0,   lpf: 0,   lPrincipal: 124000, lCf: 450, lGstCf: 81, lBounce: 0,   lLpf: 250,  principalDelta: -1000, cfDelta: 0, gstDelta: 0, bounceDelta: 0, lpfDelta: 250, totalDelta: -750 },
  { id: 2,  paytmLan: 'PTM_LN_2025_771002', lenderLan: 'AB_LN_771002', principal: 98000,  cf: 380, gstCf: 68, bounce: 100, lpf: 0,   lPrincipal: 97500,  lCf: 380, lGstCf: 68, lBounce: 100, lLpf: 0,    principalDelta: -500, cfDelta: 0, gstDelta: 0, bounceDelta: 0, lpfDelta: 0, totalDelta: -500 },
  { id: 3,  paytmLan: 'PTM_LN_2025_771003', lenderLan: 'AB_LN_771003', principal: 210000, cf: 520, gstCf: 94, bounce: 0,   lpf: 500, lPrincipal: 210000, lCf: 500, lGstCf: 90, lBounce: 0,   lLpf: 500,  principalDelta: 0, cfDelta: -20, gstDelta: -4, bounceDelta: 0, lpfDelta: 0, totalDelta: -20 },
  { id: 4,  paytmLan: 'PTM_LN_2025_771004', lenderLan: 'AB_LN_771004', principal: 75000,  cf: 320, gstCf: 58, bounce: 50,  lpf: 200, lPrincipal: 75000,  lCf: 320, lGstCf: 58, lBounce: 50,  lLpf: 180,  principalDelta: 0, cfDelta: 0, gstDelta: 0, bounceDelta: 0, lpfDelta: -20, totalDelta: -20 },
  { id: 5,  paytmLan: 'PTM_LN_2025_771005', lenderLan: 'AB_LN_771005', principal: 165000, cf: 480, gstCf: 86, bounce: 0,   lpf: 0,   lPrincipal: 164200, lCf: 480, lGstCf: 86, lBounce: 0,   lLpf: 0,    principalDelta: -800, cfDelta: 0, gstDelta: 0, bounceDelta: 0, lpfDelta: 0, totalDelta: -800 },
  { id: 6,  paytmLan: 'PTM_LN_2025_771006', lenderLan: 'AB_LN_771006', principal: 110000, cf: 400, gstCf: 72, bounce: 200, lpf: 150, lPrincipal: 110000, lCf: 410, lGstCf: 74, lBounce: 200, lLpf: 150,  principalDelta: 0, cfDelta: 10, gstDelta: 2, bounceDelta: 0, lpfDelta: 0, totalDelta: 10 },
];

// ── LAN-level breakdown (Daily Dues) ──
export const lanBreakdownDailyDues = [
  { id: 101, paytmLan: 'PTM_LN_DD_801', lenderLan: 'AB_LN_DD_801', principalDue: 45000, cfDue: 180, gstDue: 32, bounceDue: 0,   lpfDue: 500, lPrincipalDue: 44800, lCfDue: 180, lGstDue: 32, lBounceDue: 0,   lLpfDue: 520,  principalDelta: -200, cfDelta: 0, gstDelta: 0, bounceDelta: 0, lpfDelta: 20, totalDelta: -180 },
  { id: 102, paytmLan: 'PTM_LN_DD_802', lenderLan: 'AB_LN_DD_802', principalDue: 82000, cfDue: 320, gstDue: 58, bounceDue: 150, lpfDue: 0,   lPrincipalDue: 82000, lCfDue: 315, lGstDue: 57, lBounceDue: 150, lLpfDue: 0,    principalDelta: 0, cfDelta: -5, gstDelta: -1, bounceDelta: 0, lpfDelta: 0, totalDelta: -6 },
  { id: 103, paytmLan: 'PTM_LN_DD_803', lenderLan: 'AB_LN_DD_803', principalDue: 28500, cfDue: 120, gstDue: 22, bounceDue: 50,  lpfDue: 200, lPrincipalDue: 28500, lCfDue: 120, lGstDue: 22, lBounceDue: 55,  lLpfDue: 200,  principalDelta: 0, cfDelta: 0, gstDelta: 0, bounceDelta: 5, lpfDelta: 0, totalDelta: 5 },
  { id: 104, paytmLan: 'PTM_LN_DD_804', lenderLan: 'AB_LN_DD_804', principalDue: 156000, cfDue: 520, gstDue: 94, bounceDue: 0, lpfDue: 800, lPrincipalDue: 155200, lCfDue: 520, lGstDue: 94, lBounceDue: 0,  lLpfDue: 800,  principalDelta: -800, cfDelta: 0, gstDelta: 0, bounceDelta: 0, lpfDelta: 0, totalDelta: -800 },
  { id: 105, paytmLan: 'PTM_LN_DD_805', lenderLan: 'AB_LN_DD_805', principalDue: 61000, cfDue: 240, gstDue: 43, bounceDue: 100, lpfDue: 350, lPrincipalDue: 61000, lCfDue: 245, lGstDue: 44, lBounceDue: 100, lLpfDue: 340,  principalDelta: 0, cfDelta: 5, gstDelta: 1, bounceDelta: 0, lpfDelta: -10, totalDelta: -4 },
];

// ── Customer 360 mock (for LAN detail click) ──
export const customer360 = {
  PTM_LN_2025_771001: {
    name: 'Rahul Sharma', mobile: '+91 98763 43210', paytmId: 'PTM_3172846201', lan: 'PTM_LN_2025_771001', lenderLan: 'AB_LN_771001',
    partner: 'Aditya Birla Finance', status: 'ACTIVE', vkycStatus: 'VKYC DONE',
    limit: 160000, availableLimit: 98500, convenienceFee: 2, dueDate: 'N/A',
    billDetails: { month: 'Feb-2026', totalDue: 18450, principal: 15000, cf: 950, lpf: 1200, bounce: 550, gst: 750 },
    repaymentLog: [
      { date: '2026-01-18', amount: 5000, source: 'Manual App', status: 'Success' },
      { date: '2025-12-25', amount: 10000, source: 'Auto Debit', status: 'Success' },
      { date: '2025-12-07', amount: 8000, source: 'UPI AutoPay', status: 'Failed' },
      { date: '2025-11-15', amount: 5200, source: 'Auto Debit', status: 'Success' },
      { date: '2025-10-30', amount: 5000, source: 'Bank Transfer', status: 'Success' },
    ],
    onboardingJourney: [
      { stage: 'BASIC_DETAILS_CAPTURED', date: 'Jul 20, 2025, 10:42 AM', status: 'done' },
      { stage: 'BUREAU_IN_PROGRESS', date: 'Jul 20, 2025, 10:43 AM', status: 'done' },
      { stage: 'KYC_VALIDATION_SUCCESS', date: 'Jul 20, 2025, 10:50 AM', status: 'done' },
      { stage: 'LENDER_BRE_APPROVE_SUCCESS', date: 'Jul 20, 2025, 11:05 AM', status: 'done' },
      { stage: 'MANDATE_SUCCESS', date: 'Jul 21, 2025, 09:15 AM', status: 'done' },
      { stage: 'ESIGN_SUCCESS', date: 'Jul 21, 2025, 09:22 AM', status: 'done' },
      { stage: 'CREDIT_LINE_ACTIVATION', date: 'Jul 21, 2025, 09:30 AM', status: 'done' },
      { stage: 'LEAD_SUCCESSFULLY_CLOSED', date: 'Jul 21, 2025, 09:30 AM', status: 'done' },
    ],
    accountDetails: {
      bankAccount: '4987XXXXXXXX0001', ifsc: 'PYTM0025100', accountType: 'Savings',
      loanAmount: 160000, loanProductType: 'BNPL', mandateStatus: 'ACTIVE',
    },
  },
};

// Backward compat exports
export const reconSnapshot = billGenSnapshot;
export const lanRows = lanBreakdownBillGen;
