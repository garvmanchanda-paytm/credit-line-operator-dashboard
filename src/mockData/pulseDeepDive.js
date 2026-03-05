// Pulse Deep Dive mock data — modelled from CST Data Analysis Jan-Feb 2026

export const LENDER_OPTIONS = ['ALL', 'SSFB', 'JANA'];
export const ISSUE_TYPE_OPTIONS = ['All', 'Bot', 'Agent'];

export const pulseIssues = [
  // ─── Bot Issues ───────────────────────────────────────────────
  {
    id: 'bot_how_to_apply',
    category: 'Onboarding & Eligibility',
    subCategory: 'How to Apply / Eligibility',
    type: 'Bot',
    charter: 'onboarding',
    janCount: 27498,
    febCount: 36861,
    dailyCounts: [1210,1350,1410,1280,1390,1250,1320,1440,1180,1360,1500,1290,1340,1270,1420,1380,1260,1410,1350,1190,1310,1460],
    subIssues: [
      { id: 'bot_hta_eligibility', label: 'What is Postpaid / Eligibility / General info', pct: 73.49, count: 27093 },
      { id: 'bot_hta_process', label: 'How to apply / Application process', pct: 25.23, count: 9302 },
      { id: 'bot_hta_pincode', label: 'Pincode / Serviceability / Not available in area', pct: 1.28, count: 472 },
    ],
  },
  {
    id: 'bot_app_rejected',
    category: 'Onboarding & Eligibility',
    subCategory: 'Application Rejected',
    type: 'Bot',
    charter: 'onboarding',
    janCount: 13231,
    febCount: 26373,
    dailyCounts: [980,1050,1120,1200,1280,1310,1150,1090,1220,1340,1180,1260,1100,1050,1310,1240,1190,1280,1350,1070,1160,1250],
    subIssues: [
      { id: 'bot_ar_why', label: 'Why rejected / Rejection reason', pct: 58.56, count: 15443 },
      { id: 'bot_ar_reapply', label: 'Re-apply / Improve credit / When to apply again', pct: 40.21, count: 10605 },
      { id: 'bot_ar_dispute', label: 'Dispute / Unfair / Good score but rejected', pct: 1.23, count: 324 },
    ],
  },
  {
    id: 'bot_charges_interest',
    category: 'Charges & Interest',
    subCategory: 'Charges & Interest Info',
    type: 'Bot',
    charter: 'post-onboarding',
    janCount: 10332,
    febCount: 19809,
    dailyCounts: [820,860,910,890,870,940,850,880,920,900,860,950,830,870,960,910,840,890,930,850,880,920],
    subIssues: [
      { id: 'bot_ci_what', label: 'What are charges / Fee explanation / General', pct: 60.01, count: 11888 },
      { id: 'bot_ci_high', label: 'High charges / Fee amount / Why so much fee', pct: 25.45, count: 5041 },
      { id: 'bot_ci_late', label: 'Late fee / Repayment / Why charged after paying', pct: 14.54, count: 2880 },
    ],
  },
  {
    id: 'bot_deactivation',
    category: 'Account Management',
    subCategory: 'Deactivation Request',
    type: 'Bot',
    charter: 'post-onboarding',
    janCount: 7387,
    febCount: 10368,
    dailyCounts: [430,460,490,470,440,500,420,450,480,460,430,510,410,440,520,490,450,470,500,420,460,480],
    subIssues: [
      { id: 'bot_deact_how', label: 'How to close / Deactivation process / Steps', pct: 55.45, count: 5749 },
      { id: 'bot_deact_dues', label: 'Outstanding dues / Pay dues first to close', pct: 32.12, count: 3330 },
      { id: 'bot_deact_charges', label: 'Closing due to high charges / Fee concern', pct: 12.44, count: 1290 },
    ],
  },
  {
    id: 'bot_limit_enhance',
    category: 'Account Management',
    subCategory: 'Limit Enhancement Request',
    type: 'Bot',
    charter: 'post-onboarding',
    janCount: 3111,
    febCount: 4825,
    dailyCounts: [190,210,230,220,200,240,180,210,250,230,200,220,190,210,240,220,200,230,250,190,210,230],
    subIssues: [
      { id: 'bot_le_increase', label: 'Request to increase limit', pct: 84.23, count: 4064 },
      { id: 'bot_le_how', label: 'How to get limit enhancement / Process', pct: 14.81, count: 714 },
      { id: 'bot_le_why', label: 'Why limit not increased / When will it increase', pct: 0.96, count: 46 },
    ],
  },
  {
    id: 'bot_not_able_transact',
    category: 'Transaction Issues',
    subCategory: 'Not Able to Transact',
    type: 'Bot',
    charter: 'post-onboarding',
    janCount: 4109,
    febCount: 3861,
    dailyCounts: [160,175,180,170,165,190,155,170,185,175,160,180,150,165,195,180,170,175,185,155,165,180],
    subIssues: [
      { id: 'bot_nat_fail', label: 'Transaction failing / Not working', pct: 16.40, count: 633 },
      { id: 'bot_nat_other', label: 'Other / Generic', pct: 83.60, count: 3228 },
    ],
  },
  // ─── Agent Issues ─────────────────────────────────────────────
  {
    id: 'agent_deactivation',
    category: 'Account Management',
    subCategory: 'Close / Deactivate Account',
    type: 'Agent',
    charter: 'post-onboarding',
    janCount: 5084,
    febCount: 6270,
    dailyCounts: [260,270,290,280,300,310,270,280,300,290,260,320,250,270,310,290,280,300,320,260,280,300],
    subIssues: [
      { id: 'agent_deact_highcf', label: 'High Convenience Fees', pct: 35.20, count: 2207 },
      { id: 'agent_deact_limit', label: 'Limit Issue', pct: 25.82, count: 1619 },
      { id: 'agent_deact_mistake', label: 'Applied by Mistake', pct: 12.47, count: 782 },
      { id: 'agent_deact_txn', label: 'Unable to Do Transactions', pct: 7.42, count: 465 },
      { id: 'agent_deact_other', label: 'Other reasons', pct: 19.09, count: 1197 },
    ],
  },
  {
    id: 'agent_autopay',
    category: 'Account Management',
    subCategory: 'AutoPay Info',
    type: 'Agent',
    charter: 'both',
    janCount: 926,
    febCount: 782,
    dailyCounts: [32,35,38,36,34,40,30,33,42,37,34,39,31,35,41,38,33,36,40,32,36,38],
    subIssues: [
      { id: 'agent_ap_notcancelled', label: 'Autopay not cancelled after deactivation', pct: 45.0, count: 352 },
      { id: 'agent_ap_wronglimit', label: 'Autopay showing wrong limit', pct: 30.0, count: 235 },
      { id: 'agent_ap_multiple', label: 'Multiple autopay on payments page', pct: 25.0, count: 195 },
    ],
  },
  {
    id: 'agent_surplus',
    category: 'Account Related',
    subCategory: 'Excess Amount Paid Against Dues',
    type: 'Agent',
    charter: 'post-onboarding',
    janCount: 427,
    febCount: 544,
    dailyCounts: [22,24,26,25,23,28,20,23,27,25,22,26,21,24,29,26,23,25,28,22,24,26],
    subIssues: [
      { id: 'agent_surplus_mandate5h', label: 'Mandate within 5 hours of manual payment', pct: 75.2, count: 409 },
      { id: 'agent_surplus_mandatelate', label: 'Mandate after 5 hours of manual payment', pct: 16.7, count: 91 },
      { id: 'agent_surplus_nomandate', label: 'No mandate or no paynow', pct: 8.1, count: 44 },
    ],
  },
  {
    id: 'agent_onboarding_stuck',
    category: 'Onboarding (Stuck)',
    subCategory: 'Facing Issues in Applying',
    type: 'Agent',
    charter: 'onboarding',
    janCount: 1049,
    febCount: 764,
    dailyCounts: [32,35,38,34,30,40,28,33,42,36,31,37,29,34,41,37,32,35,39,30,34,38],
    subIssues: [
      { id: 'agent_onb_selfie', label: 'Selfie Capture / KYC issue', pct: 40.0, count: 306 },
      { id: 'agent_onb_lan', label: 'LAN Creation issue', pct: 35.0, count: 267 },
      { id: 'agent_onb_tm', label: 'TM Creation issue', pct: 25.0, count: 191 },
    ],
  },
  {
    id: 'agent_merchant_block',
    category: 'Transaction Issues',
    subCategory: 'Not Able to Transact — Specific Merchant',
    type: 'Agent',
    charter: 'post-onboarding',
    janCount: 687,
    febCount: 304,
    dailyCounts: [12,14,15,13,14,16,11,13,15,14,12,16,11,13,17,14,12,14,16,11,13,14],
    subIssues: [
      { id: 'agent_mb_blocked', label: 'User blocked / Frozen / VKYC blocked', pct: 40.0, count: 122 },
      { id: 'agent_mb_limit', label: 'Limit exhausted', pct: 35.0, count: 106 },
      { id: 'agent_mb_merchant', label: 'Merchant not accepting', pct: 25.0, count: 76 },
    ],
  },
  {
    id: 'agent_mandate_stuck',
    category: 'Onboarding (Stuck)',
    subCategory: 'Stuck in Mandate Required Stage',
    type: 'Agent',
    charter: 'onboarding',
    janCount: 366,
    febCount: 263,
    dailyCounts: [10,12,13,11,12,14,10,11,14,12,10,13,9,11,14,12,11,12,14,10,12,13],
    subIssues: [
      { id: 'agent_ms_understand', label: 'Need assistance understanding process', pct: 50.0, count: 132 },
      { id: 'agent_ms_changebank', label: 'Want to change bank account number', pct: 30.0, count: 79 },
      { id: 'agent_ms_wrongaccount', label: 'Set up wrong account by mistake', pct: 20.0, count: 53 },
    ],
  },
];

// ─── Cohort definitions ─────────────────────────────────────────
export const BUILT_IN_COHORTS = [
  {
    key: 'activation_status',
    label: 'Activation Status',
    segments: [
      { name: 'Transacting (≥1 txn)', color: '#3b82f6' },
      { name: 'Non-Transacting (0 txn)', color: '#94a3b8' },
    ],
  },
  {
    key: 'spend_status',
    label: 'Spend Status',
    segments: [
      { name: 'High spender (≥5 txns)', color: '#10b981' },
      { name: 'Low spender (1–4 txns)', color: '#f59e0b' },
      { name: 'Zero spend', color: '#ef4444' },
    ],
  },
  {
    key: 'cf_cohort',
    label: 'Convenience Fee Cohort',
    segments: [
      { name: 'High CF (>₹99/mo)', color: '#ef4444' },
      { name: 'Medium CF (₹50–99/mo)', color: '#f59e0b' },
      { name: 'Low / Zero CF', color: '#10b981' },
    ],
  },
  {
    key: 'mpin_setup',
    label: 'MPIN / UPI Setup Status',
    segments: [
      { name: 'MPIN Set', color: '#3b82f6' },
      { name: 'MPIN Not Set', color: '#ef4444' },
    ],
  },
  {
    key: 'account_age',
    label: 'Account Age',
    segments: [
      { name: 'New (<30 days)', color: '#8b5cf6' },
      { name: 'Existing (30–90 days)', color: '#3b82f6' },
      { name: 'Mature (>90 days)', color: '#10b981' },
    ],
  },
  {
    key: 'credit_limit_bucket',
    label: 'Credit Limit Bucket',
    segments: [
      { name: '0–1k', color: '#ef4444' },
      { name: '1k–2k', color: '#f59e0b' },
      { name: '2k–5k', color: '#3b82f6' },
      { name: '5k–10k', color: '#8b5cf6' },
      { name: '10k–20k', color: '#10b981' },
      { name: '20k+', color: '#059669' },
    ],
  },
];

// Generate cohort breakdown for any issue × cohort combination (deterministic mock)
function seededRandom(seed) {
  let h = 0xdeadbeef ^ seed;
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getCohortBreakdown(issueId, cohortKey, subIssueId = null) {
  const cohort = BUILT_IN_COHORTS.find(c => c.key === cohortKey);
  if (!cohort) return null;

  const issue = pulseIssues.find(i => i.id === issueId);
  if (!issue) return null;

  const baseCount = subIssueId
    ? (issue.subIssues.find(s => s.id === subIssueId)?.count || issue.febCount)
    : issue.febCount;

  const seed = hashStr(`${issueId}_${cohortKey}_${subIssueId || ''}`);
  const rng = seededRandom(seed);

  const rawWeights = cohort.segments.map(() => 0.2 + rng() * 0.8);
  const totalWeight = rawWeights.reduce((s, w) => s + w, 0);

  return cohort.segments.map((seg, i) => {
    const pct = parseFloat(((rawWeights[i] / totalWeight) * 100).toFixed(1));
    const count = Math.round(baseCount * (pct / 100));
    const delta = parseFloat(((rng() - 0.4) * 10).toFixed(1));
    return {
      name: seg.name,
      color: seg.color,
      count,
      pct,
      delta,
      insightTrigger: Math.abs(delta) > 3 ? (delta > 0 ? 'Spike — investigate' : 'Improving') : null,
    };
  });
}

// Generate daily trend data for an issue in a date range
export function getDailyTrend(issueId, dateFrom, dateTo) {
  const issue = pulseIssues.find(i => i.id === issueId);
  if (!issue) return [];

  const start = new Date(dateFrom);
  const end = new Date(dateTo);
  const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);

  const seed = hashStr(issueId);
  const rng = seededRandom(seed);
  const avgDaily = issue.febCount / 22;

  const result = [];
  for (let d = 0; d < days; d++) {
    const dt = new Date(start);
    dt.setDate(dt.getDate() + d);
    const noise = 0.7 + rng() * 0.6;
    result.push({
      date: dt.toISOString().slice(5, 10),
      fullDate: dt.toISOString().slice(0, 10),
      count: Math.round(avgDaily * noise),
    });
  }
  return result;
}

// Filter issues
export function getFilteredPulseIssues({ lender = 'ALL', issueType = 'All', subIssueFilter = null }) {
  let result = [...pulseIssues];

  if (issueType !== 'All') {
    result = result.filter(i => i.type === issueType);
  }

  const lenderScale = lender === 'SSFB' ? 0.62 : lender === 'JANA' ? 0.38 : 1;

  return result.map(issue => {
    const febScaled = Math.round(issue.febCount * lenderScale);
    const janScaled = Math.round(issue.janCount * lenderScale);
    const delta = janScaled > 0 ? parseFloat(((febScaled - janScaled) / janScaled * 100).toFixed(1)) : 0;
    return {
      ...issue,
      febCount: febScaled,
      janCount: janScaled,
      delta,
      subIssues: issue.subIssues.map(si => ({
        ...si,
        count: Math.round(si.count * lenderScale),
      })),
    };
  });
}
