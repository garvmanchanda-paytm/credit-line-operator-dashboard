export const dailySuccessRate = [
  { date: 'Feb 07', sr: 83.7 },
  { date: 'Feb 08', sr: 84.7 },
  { date: 'Feb 09', sr: 84.9 },
  { date: 'Feb 10', sr: 80.5 },
  { date: 'Feb 11', sr: 83.4 },
  { date: 'Feb 12', sr: 83.7 },
  { date: 'Feb 13', sr: 79.5 },
  { date: 'Feb 14', sr: 81.1 },
  { date: 'Feb 15', sr: 81.9 },
  { date: 'Feb 16', sr: 81.9 },
  { date: 'Feb 17', sr: 81.9 },
  { date: 'Feb 18', sr: 82.0 },
  { date: 'Feb 19', sr: 82.1 },
  { date: 'Feb 20', sr: 82.4 },
  { date: 'Feb 21', sr: 80.1 },
];

export const avgSR = (() => {
  const vals = dailySuccessRate.map(d => d.sr);
  return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
})();

export const errorCodes = [
  { rank: 1, code: 'U29-SA',   description: 'Acquirer / Bank decline',   avgDailyCount: 2800, pctOfFailures: 18.0, trend: 'stable',    dailyCounts: [2750, 2810, 2830, 2790, 2800, 2780, 2820] },
  { rank: 2, code: 'U30-ZM',   description: 'UPI timeout / network',     avgDailyCount: 2400, pctOfFailures: 15.0, trend: 'rising',     dailyCounts: [2100, 2200, 2300, 2350, 2450, 2500, 2600] },
  { rank: 3, code: 'U30-Z9',   description: 'Beneficiary bank down',     avgDailyCount: 2200, pctOfFailures: 14.0, trend: 'spike',      dailyCounts: [2100, 2150, 6500, 2300, 2250, 2200, 2180] },
  { rank: 4, code: 'U30-VM',   description: 'Transaction limit exceeded', avgDailyCount: 1800, pctOfFailures: 11.0, trend: 'stable',    dailyCounts: [1780, 1810, 1790, 1820, 1800, 1780, 1810] },
  { rank: 5, code: 'INT-1453', description: 'Internal processing error',  avgDailyCount: 1600, pctOfFailures: 10.0, trend: 'improving', dailyCounts: [1900, 1850, 1750, 1700, 1600, 1550, 1500] },
  { rank: 6, code: 'U16-01091', description: 'Invalid VPA / payee',      avgDailyCount: 1400, pctOfFailures: 9.0,  trend: 'stable',    dailyCounts: [1380, 1410, 1400, 1390, 1420, 1400, 1410] },
  { rank: 7, code: 'OTHERS',   description: 'All remaining codes',        avgDailyCount: 4000, pctOfFailures: 25.0, trend: 'stable',    dailyCounts: [3950, 4020, 4010, 3980, 4050, 4000, 3990] },
];

export const momGmvTxn = [
  { month: 'Sep-25', gmvCr: 1.21,   txnCount: 26600 },
  { month: 'Oct-25', gmvCr: 10.7,   txnCount: 236000 },
  { month: 'Nov-25', gmvCr: 25.3,   txnCount: 574000 },
  { month: 'Dec-25', gmvCr: 49.1,   txnCount: 1110000 },
  { month: 'Jan-26', gmvCr: 64.4,   txnCount: 1500000 },
  { month: 'Feb-26', gmvCr: 71.1,   txnCount: 1630000 },
];
