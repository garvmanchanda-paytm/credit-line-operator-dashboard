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

export const dpdDistribution = [
  { bucket: '7 days',   ssfbLans: 3638, paytmLans: 3635, diff: 3,  riskLabel: 'Early overdue' },
  { bucket: '38 days',  ssfbLans: 1605, paytmLans: 1604, diff: 1,  riskLabel: 'Sub-standard' },
  { bucket: '76 days',  ssfbLans: 529,  paytmLans: 529,  diff: 0,  riskLabel: 'Doubtful' },
  { bucket: '106 days', ssfbLans: 107,  paytmLans: 107,  diff: 0,  riskLabel: 'Loss asset' },
  { bucket: '137 days', ssfbLans: 5,    paytmLans: 5,    diff: 0,  riskLabel: 'Write-off risk' },
];

export const paidBreakdown = [
  { segment: 'Paid Full',       count: 98240,  pct: 60.2 },
  { segment: 'Partial Payment', count: 27805,  pct: 17.0, avgPartialAmt: 1850 },
  { segment: 'Did Not Pay',     count: 37200,  pct: 22.8 },
];
