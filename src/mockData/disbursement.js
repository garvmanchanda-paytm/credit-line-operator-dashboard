export const disbursementKPIs = {
  count: 4380,
  countMoM: 3.2,
  totalAmountCr: 24.5,
  amountMoM: 8.7,
  approvalToDisbPct: 87.4,
  approvalToDisbMoM: -1.2,
  avgTATHours: 18.2,
  tatMoM: -2.5,
};

export const lenderBreakdown = [
  { lender: 'SSFB', count: 2847, amountCr: 15.9, avgTAT: 16.4, failureRate: 4.2 },
  { lender: 'HDFC', count: 1533, amountCr: 8.6,  avgTAT: 21.5, failureRate: 7.8 },
];

export const dailyDisbursement = (() => {
  const data = [];
  for (let d = 1; d <= 22; d++) {
    const base = 190 + Math.round(Math.sin(d * 0.5) * 30 + (Math.random() - 0.5) * 20);
    data.push({
      date: `Feb ${d}`,
      count: base,
      amountCr: parseFloat((base * 0.0056).toFixed(2)),
    });
  }
  return data;
})();

export const failureReasons = [
  { reason: 'KYC document mismatch', count: 142, pct: 28.5, trend: [12, 15, 10, 18, 14, 16, 19] },
  { reason: 'Bank account verification failed', count: 98, pct: 19.7, trend: [8, 10, 12, 9, 11, 13, 10] },
  { reason: 'Lender API timeout', count: 76, pct: 15.3, trend: [5, 4, 8, 12, 15, 10, 6] },
  { reason: 'Mandate registration pending', count: 65, pct: 13.1, trend: [7, 6, 8, 9, 7, 8, 7] },
  { reason: 'Credit limit exhausted', count: 48, pct: 9.6, trend: [4, 5, 3, 6, 5, 4, 5] },
  { reason: 'Duplicate disbursement request', count: 35, pct: 7.0, trend: [3, 4, 3, 2, 5, 4, 3] },
  { reason: 'Other / Unclassified', count: 34, pct: 6.8, trend: [2, 3, 4, 3, 5, 4, 3] },
];
