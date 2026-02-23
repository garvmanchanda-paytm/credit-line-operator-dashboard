export const momMetrics = [
  { month: 'Sep-25', signups: 9483,  gmv: 1.16,  txns: 24463,   aif: 8274,   txningUsers: 3986,   spac: 2902, limitCr: 9.33,  avgCfOnb: 2.33, avgCfTxn: 2.25 },
  { month: 'Oct-25', signups: 37183, gmv: 10.08, txns: 210000,  aif: 33115,  txningUsers: 20958,  spac: 4811, limitCr: 36.29, avgCfOnb: 2.38, avgCfTxn: 2.16 },
  { month: 'Nov-25', signups: 87037, gmv: 23.67, txns: 507000,  aif: 79008,  txningUsers: 47214,  spac: 5014, limitCr: 60.65, avgCfOnb: 2.56, avgCfTxn: 2.21 },
  { month: 'Dec-25', signups: 84534, gmv: 45.70, txns: 977000,  aif: 78054,  txningUsers: 90688,  spac: 5039, limitCr: 58.28, avgCfOnb: 2.58, avgCfTxn: 2.27 },
  { month: 'Jan-26', signups: 72404, gmv: 60.04, txns: 1315000, aif: 69035,  txningUsers: 122580, spac: 4898, limitCr: 53.84, avgCfOnb: 2.57, avgCfTxn: 2.27 },
  { month: 'Feb-26', signups: 62202, gmv: 66.48, txns: 1439000, aif: 61293,  txningUsers: 152800, spac: 4351, limitCr: 39.89, avgCfOnb: 2.65, avgCfTxn: 2.31 },
];

export const currentMonthKPIs = {
  totalActiveAccounts: 326843,
  monthlySignups: 62202,
  signupsMoM: -14.0,
  gmvCr: 66.48,
  gmvMoM: 10.7,
  txningUsers: 152800,
  txningUsersMoM: 24.6,
  spac: 4351,
  spacMoM: -11.2,
  frozenAccounts: 5909,
  vkycBlocked: 1951,
};

export const loanStatusDistribution = [
  { status: 'ACTIVE',            count: 326843, pct: 92.7, action: 'None — healthy base' },
  { status: 'CLOSED',            count: 18159,  pct: 5.2,  action: 'Track deactivation rate MoM' },
  { status: 'FROZEN',            count: 5909,   pct: 1.7,  action: 'Bill overdue — nudge repayment' },
  { status: 'VKYC_SOFTBLOCKED',  count: 1951,   pct: 0.6,  action: 'VKYC pending — push completion' },
  { status: 'N/A',               count: 60,     pct: 0.0,  action: 'Investigate — unclassified state' },
];

export const transactingUsers = [
  { month: 'Oct-25', repeat: 4091,   newUsers: 17956, inactiveLastMonth: 416,   total: 22463 },
  { month: 'Nov-25', repeat: 18624,  newUsers: 30876, inactiveLastMonth: 3112,  total: 52612 },
  { month: 'Dec-25', repeat: 43688,  newUsers: 51344, inactiveLastMonth: 6706,  total: 101738 },
  { month: 'Jan-26', repeat: 81148,  newUsers: 47484, inactiveLastMonth: 16052, total: 144684 },
  { month: 'Feb-26', repeat: 113460, newUsers: 46882, inactiveLastMonth: 20722, total: 181064 },
];
