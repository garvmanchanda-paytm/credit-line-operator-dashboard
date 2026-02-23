export const issueCategories = [
  {
    id: 'how_to_apply',
    category: 'Onboarding & Eligibility',
    subCategory: 'How to Apply / Eligibility queries',
    charter: 'onboarding',
    mtdCount: 68882,
    dailyCounts: [1587, 1620, 1543, 1710, 1650, 1580, 1490],
    prevPeriodCount: 72400,
    pctShare: 25.51,
  },
  {
    id: 'lead_rejected',
    category: 'Onboarding & Eligibility',
    subCategory: 'Application Rejection — LEAD_REJECTED',
    charter: 'onboarding',
    mtdCount: 63828,
    dailyCounts: [612, 590, 643, 620, 598, 610, 580],
    prevPeriodCount: 58200,
    pctShare: 23.64,
  },
  {
    id: 'others',
    category: 'Others',
    subCategory: 'Others (unclassified)',
    charter: 'both',
    mtdCount: 45899,
    dailyCounts: [471, 460, 490, 510, 445, 430, 455],
    prevPeriodCount: 48500,
    pctShare: 17.0,
  },
  {
    id: 'activation_pending',
    category: 'Account Related',
    subCategory: 'Credit on UPI Activation pending',
    charter: 'post-onboarding',
    mtdCount: 33802,
    dailyCounts: [420, 435, 410, 445, 430, 415, 390],
    prevPeriodCount: 30100,
    pctShare: 12.52,
  },
  {
    id: 'deactivation',
    category: 'Account Management',
    subCategory: 'Deactivation Request',
    charter: 'post-onboarding',
    mtdCount: 6698,
    dailyCounts: [1079, 1050, 1120, 1090, 1010, 1005, 980],
    prevPeriodCount: 5800,
    pctShare: 2.48,
  },
  {
    id: 'charges_interest',
    category: 'Charges & Interest',
    subCategory: 'Charges & Interest Info queries',
    charter: 'post-onboarding',
    mtdCount: 18340,
    dailyCounts: [1255, 1200, 1310, 1280, 1190, 1230, 1180],
    prevPeriodCount: 16500,
    pctShare: 6.79,
  },
  {
    id: 'surplus_refund',
    category: 'Account Related',
    subCategory: 'Surplus Refund / Excess Amount Paid',
    charter: 'post-onboarding',
    mtdCount: 8920,
    dailyCounts: [410, 395, 430, 420, 385, 400, 375],
    prevPeriodCount: 7800,
    pctShare: 3.30,
  },
  {
    id: 'txn_failed',
    category: 'Account Related',
    subCategory: 'Txn Failed — Amount Deducted',
    charter: 'post-onboarding',
    mtdCount: 7450,
    dailyCounts: [340, 355, 320, 365, 350, 330, 310],
    prevPeriodCount: 8100,
    pctShare: 2.76,
  },
  {
    id: 'stuck_lan_creation',
    category: 'Onboarding (Stuck)',
    subCategory: 'LENDER_LAN_CREATION_FAILED',
    charter: 'onboarding',
    mtdCount: 4280,
    dailyCounts: [195, 210, 185, 220, 200, 190, 175],
    prevPeriodCount: 3900,
    pctShare: 1.59,
  },
  {
    id: 'stuck_tm_account',
    category: 'Onboarding (Stuck)',
    subCategory: 'TM_ACCOUNT_CREATION_FAILED',
    charter: 'onboarding',
    mtdCount: 3650,
    dailyCounts: [170, 160, 180, 175, 155, 165, 150],
    prevPeriodCount: 3200,
    pctShare: 1.35,
  },
  {
    id: 'stuck_vkyc_selfie',
    category: 'Onboarding (Stuck)',
    subCategory: 'VKYC_INITIATED / Selfie stuck',
    charter: 'onboarding',
    mtdCount: 5120,
    dailyCounts: [240, 255, 230, 260, 245, 235, 220],
    prevPeriodCount: 5500,
    pctShare: 1.90,
  },
  {
    id: 'mandate_change',
    category: 'Account Management',
    subCategory: 'Mandate / Autopay account change',
    charter: 'post-onboarding',
    mtdCount: 3240,
    dailyCounts: [150, 145, 160, 155, 140, 148, 135],
    prevPeriodCount: 2900,
    pctShare: 1.20,
  },
];

const TIME_FACTORS = {
  't-1': 1,
  '7d': 7,
  '15d': 15,
  '30d': 22,
};

export function getFilteredIssues(charterFilter = 'all', timeWindow = '7d') {
  const factor = TIME_FACTORS[timeWindow] || 7;
  const totalMTD = issueCategories.reduce((s, i) => s + i.mtdCount, 0);

  return issueCategories
    .filter(issue => {
      if (charterFilter === 'all') return true;
      if (charterFilter === 'onboarding') return issue.charter === 'onboarding' || issue.charter === 'both';
      return issue.charter === 'post-onboarding' || issue.charter === 'both';
    })
    .map(issue => {
      const windowCount = Math.round(issue.mtdCount * (factor / 22));
      const prevWindowCount = Math.round(issue.prevPeriodCount * (factor / 22));
      const delta = prevWindowCount > 0
        ? ((windowCount - prevWindowCount) / prevWindowCount * 100)
        : 0;

      return {
        ...issue,
        windowCount,
        prevWindowCount,
        delta: parseFloat(delta.toFixed(1)),
        windowPctShare: parseFloat((issue.mtdCount / totalMTD * 100).toFixed(2)),
      };
    })
    .sort((a, b) => b.windowCount - a.windowCount);
}
