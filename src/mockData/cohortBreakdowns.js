export const cohortBreakdowns = {
  // POST-ONBOARDING ISSUES
  deactivation: {
    activation_status: {
      label: 'Activation Status',
      segments: [
        { name: 'Not Activated (0 txn)', count: 4086, pct: 61.0, delta: 3.2, insightTrigger: 'Eligibility confusion' },
        { name: 'Activated (≥1 txn)', count: 2612, pct: 39.0, delta: -3.2, insightTrigger: 'Product / Convenience Fee issue' },
      ],
    },
    mpin_setup: {
      label: 'MPIN / UPI Setup',
      segments: [
        { name: 'MPIN Not Set', count: 3684, pct: 55.0, delta: 2.1, insightTrigger: 'Onboarding completion gap' },
        { name: 'MPIN Set', count: 3014, pct: 45.0, delta: -2.1, insightTrigger: null },
      ],
    },
    cf_cohort: {
      label: 'Convenience Fee Cohort',
      segments: [
        { name: 'High Convenience Fee (>₹99/month)', count: 2813, pct: 42.0, delta: 4.5, insightTrigger: 'Pricing signal' },
        { name: 'Low / Zero Convenience Fee', count: 3885, pct: 58.0, delta: -4.5, insightTrigger: 'Engagement drop' },
      ],
    },
    account_age: {
      label: 'Account Age',
      segments: [
        { name: 'New (<30 days)', count: 3953, pct: 59.0, delta: 1.8, insightTrigger: 'Early churn risk' },
        { name: 'Existing (>30 days)', count: 2745, pct: 41.0, delta: -1.8, insightTrigger: null },
      ],
    },
    repayment_status: {
      label: 'Repayment Status',
      segments: [
        { name: 'Paid on time', count: 5492, pct: 82.0, delta: -1.0, insightTrigger: 'Voluntary exit' },
        { name: 'Overdue / Frozen', count: 1206, pct: 18.0, delta: 1.0, insightTrigger: 'Bill shock reaction' },
      ],
    },
    spend_frequency: {
      label: 'Spend Frequency',
      segments: [
        { name: 'High spender (≥5 txns)', count: 1675, pct: 25.0, delta: 2.0, insightTrigger: 'Value user leaving' },
        { name: 'Low spender (1–4 txns)', count: 5023, pct: 75.0, delta: -2.0, insightTrigger: null },
      ],
    },
  },

  activation_pending: {
    activation_status: {
      label: 'Activation Status',
      segments: [
        { name: 'Not Activated (0 txn)', count: 28731, pct: 85.0, delta: 1.5, insightTrigger: 'MPIN / UPI setup gap' },
        { name: 'Activated (≥1 txn)', count: 5071, pct: 15.0, delta: -1.5, insightTrigger: null },
      ],
    },
    mpin_setup: {
      label: 'MPIN / UPI Setup',
      segments: [
        { name: 'MPIN Not Set', count: 24222, pct: 71.7, delta: 3.2, insightTrigger: 'Silent failure — limit unusable' },
        { name: 'MPIN Set', count: 9580, pct: 28.3, delta: -3.2, insightTrigger: null },
      ],
    },
    cf_cohort: {
      label: 'Convenience Fee Cohort',
      segments: [
        { name: 'High Convenience Fee (>₹99/month)', count: 11521, pct: 34.1, delta: -0.5, insightTrigger: null },
        { name: 'Low / Zero Convenience Fee', count: 22281, pct: 65.9, delta: 0.5, insightTrigger: null },
      ],
    },
    account_age: {
      label: 'Account Age',
      segments: [
        { name: 'New (<30 days)', count: 25352, pct: 75.0, delta: 2.0, insightTrigger: 'Recent onboard not converting' },
        { name: 'Existing (>30 days)', count: 8450, pct: 25.0, delta: -2.0, insightTrigger: null },
      ],
    },
    repayment_status: {
      label: 'Repayment Status',
      segments: [
        { name: 'N/A (no txn)', count: 28731, pct: 85.0, delta: 1.5, insightTrigger: null },
        { name: 'Active', count: 5071, pct: 15.0, delta: -1.5, insightTrigger: null },
      ],
    },
    spend_frequency: {
      label: 'Spend Frequency',
      segments: [
        { name: 'Zero spend', count: 28731, pct: 85.0, delta: 1.5, insightTrigger: null },
        { name: 'Any spend', count: 5071, pct: 15.0, delta: -1.5, insightTrigger: null },
      ],
    },
  },

  surplus_refund: {
    activation_status: {
      label: 'Activation Status',
      segments: [
        { name: 'Activated (≥1 txn)', count: 7582, pct: 85.0, delta: -1.0, insightTrigger: null },
        { name: 'Not Activated (0 txn)', count: 1338, pct: 15.0, delta: 1.0, insightTrigger: null },
      ],
    },
    repayment_status: {
      label: 'Repayment Status',
      segments: [
        { name: 'Paid on time', count: 6494, pct: 72.8, delta: -2.5, insightTrigger: 'Double deduction — mandate overlap' },
        { name: 'Overdue / Frozen', count: 2426, pct: 27.2, delta: 2.5, insightTrigger: null },
      ],
    },
    spend_frequency: {
      label: 'Spend Frequency',
      segments: [
        { name: 'High spender (≥5 txns)', count: 5352, pct: 60.0, delta: 3.5, insightTrigger: 'Bill reconciliation issue at scale' },
        { name: 'Low spender (1–4 txns)', count: 3568, pct: 40.0, delta: -3.5, insightTrigger: null },
      ],
    },
    cf_cohort: {
      label: 'Convenience Fee Cohort',
      segments: [
        { name: 'High Convenience Fee (>₹99/month)', count: 4460, pct: 50.0, delta: 2.0, insightTrigger: null },
        { name: 'Low / Zero Convenience Fee', count: 4460, pct: 50.0, delta: -2.0, insightTrigger: null },
      ],
    },
    account_age: {
      label: 'Account Age',
      segments: [
        { name: 'Existing (>30 days)', count: 6247, pct: 70.0, delta: -1.0, insightTrigger: null },
        { name: 'New (<30 days)', count: 2673, pct: 30.0, delta: 1.0, insightTrigger: null },
      ],
    },
    mpin_setup: {
      label: 'MPIN / UPI Setup',
      segments: [
        { name: 'MPIN Set', count: 7582, pct: 85.0, delta: -0.5, insightTrigger: null },
        { name: 'MPIN Not Set', count: 1338, pct: 15.0, delta: 0.5, insightTrigger: null },
      ],
    },
  },

  txn_failed: {
    activation_status: {
      label: 'Activation Status',
      segments: [
        { name: 'Activated (≥1 txn)', count: 6705, pct: 90.0, delta: -0.5, insightTrigger: 'Active users hitting UPI rail failures' },
        { name: 'Not Activated (0 txn)', count: 745, pct: 10.0, delta: 0.5, insightTrigger: null },
      ],
    },
    repayment_status: {
      label: 'Repayment Status',
      segments: [
        { name: 'Paid on time', count: 5215, pct: 70.0, delta: -2.0, insightTrigger: 'Good users impacted — product bug' },
        { name: 'Overdue / Frozen', count: 2235, pct: 30.0, delta: 2.0, insightTrigger: null },
      ],
    },
    spend_frequency: {
      label: 'Spend Frequency',
      segments: [
        { name: 'High spender (≥5 txns)', count: 4470, pct: 60.0, delta: 4.0, insightTrigger: 'Shadow ledger mismatch' },
        { name: 'Low spender (1–4 txns)', count: 2980, pct: 40.0, delta: -4.0, insightTrigger: null },
      ],
    },
    cf_cohort: {
      label: 'Convenience Fee Cohort',
      segments: [
        { name: 'High Convenience Fee (>₹99/month)', count: 3353, pct: 45.0, delta: 1.5, insightTrigger: null },
        { name: 'Low / Zero Convenience Fee', count: 4097, pct: 55.0, delta: -1.5, insightTrigger: null },
      ],
    },
    account_age: {
      label: 'Account Age',
      segments: [
        { name: 'Existing (>30 days)', count: 5215, pct: 70.0, delta: -1.0, insightTrigger: null },
        { name: 'New (<30 days)', count: 2235, pct: 30.0, delta: 1.0, insightTrigger: null },
      ],
    },
    mpin_setup: {
      label: 'MPIN / UPI Setup',
      segments: [
        { name: 'MPIN Set', count: 6705, pct: 90.0, delta: -0.5, insightTrigger: null },
        { name: 'MPIN Not Set', count: 745, pct: 10.0, delta: 0.5, insightTrigger: null },
      ],
    },
  },

  charges_interest: {
    activation_status: {
      label: 'Activation Status',
      segments: [
        { name: 'Activated (≥1 txn)', count: 14672, pct: 80.0, delta: -1.0, insightTrigger: null },
        { name: 'Not Activated (0 txn)', count: 3668, pct: 20.0, delta: 1.0, insightTrigger: null },
      ],
    },
    cf_cohort: {
      label: 'Convenience Fee Cohort',
      segments: [
        { name: 'High Convenience Fee (>₹99/month)', count: 10104, pct: 55.1, delta: 5.0, insightTrigger: 'Convenience Fee confusion — users dont understand charges' },
        { name: 'Low / Zero Convenience Fee', count: 8236, pct: 44.9, delta: -5.0, insightTrigger: null },
      ],
    },
    repayment_status: {
      label: 'Repayment Status',
      segments: [
        { name: 'Paid on time', count: 12838, pct: 70.0, delta: 0.0, insightTrigger: null },
        { name: 'Overdue / Frozen', count: 5502, pct: 30.0, delta: 0.0, insightTrigger: null },
      ],
    },
    account_age: {
      label: 'Account Age',
      segments: [
        { name: 'New (<30 days)', count: 9537, pct: 52.0, delta: 3.0, insightTrigger: 'New users confused about billing' },
        { name: 'Existing (>30 days)', count: 8803, pct: 48.0, delta: -3.0, insightTrigger: null },
      ],
    },
    spend_frequency: {
      label: 'Spend Frequency',
      segments: [
        { name: 'High spender (≥5 txns)', count: 7337, pct: 40.0, delta: 1.0, insightTrigger: null },
        { name: 'Low spender (1–4 txns)', count: 11003, pct: 60.0, delta: -1.0, insightTrigger: null },
      ],
    },
    mpin_setup: {
      label: 'MPIN / UPI Setup',
      segments: [
        { name: 'MPIN Set', count: 14672, pct: 80.0, delta: -0.5, insightTrigger: null },
        { name: 'MPIN Not Set', count: 3668, pct: 20.0, delta: 0.5, insightTrigger: null },
      ],
    },
  },

  mandate_change: {
    activation_status: {
      label: 'Activation Status',
      segments: [
        { name: 'Activated (≥1 txn)', count: 2754, pct: 85.0, delta: 0.0, insightTrigger: null },
        { name: 'Not Activated (0 txn)', count: 486, pct: 15.0, delta: 0.0, insightTrigger: null },
      ],
    },
    repayment_status: {
      label: 'Repayment Status',
      segments: [
        { name: 'Paid on time', count: 2268, pct: 70.0, delta: -2.0, insightTrigger: null },
        { name: 'Overdue / Frozen', count: 972, pct: 30.0, delta: 2.0, insightTrigger: 'Mandate change to avoid auto-debit' },
      ],
    },
    account_age: {
      label: 'Account Age',
      segments: [
        { name: 'Existing (>30 days)', count: 2592, pct: 80.0, delta: 0.0, insightTrigger: null },
        { name: 'New (<30 days)', count: 648, pct: 20.0, delta: 0.0, insightTrigger: null },
      ],
    },
    cf_cohort: {
      label: 'Convenience Fee Cohort',
      segments: [
        { name: 'High Convenience Fee (>₹99/month)', count: 1296, pct: 40.0, delta: 1.0, insightTrigger: null },
        { name: 'Low / Zero Convenience Fee', count: 1944, pct: 60.0, delta: -1.0, insightTrigger: null },
      ],
    },
    mpin_setup: {
      label: 'MPIN / UPI Setup',
      segments: [
        { name: 'MPIN Set', count: 2754, pct: 85.0, delta: 0.0, insightTrigger: null },
        { name: 'MPIN Not Set', count: 486, pct: 15.0, delta: 0.0, insightTrigger: null },
      ],
    },
    spend_frequency: {
      label: 'Spend Frequency',
      segments: [
        { name: 'High spender (≥5 txns)', count: 1620, pct: 50.0, delta: 2.0, insightTrigger: null },
        { name: 'Low spender (1–4 txns)', count: 1620, pct: 50.0, delta: -2.0, insightTrigger: null },
      ],
    },
  },

  // ONBOARDING ISSUES
  how_to_apply: {
    offer_eligibility: {
      label: 'Offer Eligibility',
      segments: [
        { name: 'Pre-approved (CIR Offer)', count: 20665, pct: 30.0, delta: -2.0, insightTrigger: null },
        { name: 'Standard flow', count: 48217, pct: 70.0, delta: 2.0, insightTrigger: 'Organic users confused about eligibility' },
      ],
    },
    stage_stuck: {
      label: 'Stage Where Stuck',
      segments: [
        { name: 'Pre-BRE (Bureau/Selfie)', count: 44326, pct: 64.4, delta: 1.5, insightTrigger: 'Bureau/selfie blocking entry' },
        { name: 'Post-BRE (Penny Drop/Mandate)', count: 24556, pct: 35.6, delta: -1.5, insightTrigger: null },
      ],
    },
    reattempt_status: {
      label: 'Re-attempt Status',
      segments: [
        { name: 'First attempt', count: 46618, pct: 67.7, delta: -1.0, insightTrigger: null },
        { name: 'Re-attempter (2nd+ try)', count: 22264, pct: 32.3, delta: 1.0, insightTrigger: 'Confused about what changed' },
      ],
    },
    cf_cohort: {
      label: 'Convenience Fee Cohort',
      segments: [
        { name: 'High Convenience Fee offer eligible', count: 17221, pct: 25.0, delta: 0.0, insightTrigger: null },
        { name: 'Low Convenience Fee / Standard', count: 51661, pct: 75.0, delta: 0.0, insightTrigger: null },
      ],
    },
    rejection_reason: {
      label: 'Rejection Reason',
      segments: [
        { name: 'Not rejected (in progress)', count: 55106, pct: 80.0, delta: -1.0, insightTrigger: null },
        { name: 'Bureau reject', count: 8266, pct: 12.0, delta: 0.5, insightTrigger: null },
        { name: 'KYC / Dedupe / PAN fail', count: 5510, pct: 8.0, delta: 0.5, insightTrigger: null },
      ],
    },
  },

  lead_rejected: {
    offer_eligibility: {
      label: 'Offer Eligibility',
      segments: [
        { name: 'Pre-approved (CIR Offer)', count: 15957, pct: 25.0, delta: 4.0, insightTrigger: 'Pre-approved but rejected = threshold mismatch' },
        { name: 'Standard flow', count: 47871, pct: 75.0, delta: -4.0, insightTrigger: null },
      ],
    },
    rejection_reason: {
      label: 'Rejection Reason',
      segments: [
        { name: 'Bureau reject', count: 31914, pct: 50.0, delta: 2.0, insightTrigger: 'Bureau partner issue' },
        { name: 'KYC / Dedupe / PAN fail', count: 19148, pct: 30.0, delta: 1.0, insightTrigger: null },
        { name: 'Lender BRE reject', count: 12766, pct: 20.0, delta: -3.0, insightTrigger: null },
      ],
    },
    cf_cohort: {
      label: 'Convenience Fee Cohort',
      segments: [
        { name: 'High Convenience Fee offer eligible', count: 22340, pct: 35.0, delta: 5.0, insightTrigger: 'High Convenience Fee users rejected = BRE too aggressive' },
        { name: 'Low Convenience Fee / Standard', count: 41488, pct: 65.0, delta: -5.0, insightTrigger: null },
      ],
    },
    reattempt_status: {
      label: 'Re-attempt Status',
      segments: [
        { name: 'First attempt', count: 44680, pct: 70.0, delta: -2.0, insightTrigger: null },
        { name: 'Re-attempter (2nd+ try)', count: 19148, pct: 30.0, delta: 2.0, insightTrigger: null },
      ],
    },
    stage_stuck: {
      label: 'Stage Where Rejected',
      segments: [
        { name: 'Pre-BRE (Bureau/Selfie)', count: 38297, pct: 60.0, delta: 1.0, insightTrigger: null },
        { name: 'Post-BRE (Lender BRE)', count: 25531, pct: 40.0, delta: -1.0, insightTrigger: null },
      ],
    },
  },

  stuck_lan_creation: {
    offer_eligibility: {
      label: 'Offer Eligibility',
      segments: [
        { name: 'Pre-approved (CIR Offer)', count: 1712, pct: 40.0, delta: 3.0, insightTrigger: 'Good users stuck at last mile' },
        { name: 'Standard flow', count: 2568, pct: 60.0, delta: -3.0, insightTrigger: null },
      ],
    },
    stage_stuck: {
      label: 'Stage Where Stuck',
      segments: [
        { name: 'Post-eSign (LAN creation)', count: 4280, pct: 100.0, delta: 0.0, insightTrigger: 'Silent failure — no retry screen' },
      ],
    },
    reattempt_status: {
      label: 'Re-attempt Status',
      segments: [
        { name: 'First attempt', count: 2996, pct: 70.0, delta: -1.0, insightTrigger: null },
        { name: 'Re-attempter (2nd+ try)', count: 1284, pct: 30.0, delta: 1.0, insightTrigger: null },
      ],
    },
    cf_cohort: {
      label: 'Convenience Fee Cohort',
      segments: [
        { name: 'High Convenience Fee offer eligible', count: 1926, pct: 45.0, delta: 2.0, insightTrigger: null },
        { name: 'Low Convenience Fee / Standard', count: 2354, pct: 55.0, delta: -2.0, insightTrigger: null },
      ],
    },
    rejection_reason: {
      label: 'Failure Type',
      segments: [
        { name: 'LAN API timeout', count: 2568, pct: 60.0, delta: 5.0, insightTrigger: 'API timeout spike' },
        { name: 'LAN duplicate', count: 1712, pct: 40.0, delta: -5.0, insightTrigger: null },
      ],
    },
  },

  stuck_tm_account: {
    offer_eligibility: {
      label: 'Offer Eligibility',
      segments: [
        { name: 'Pre-approved (CIR Offer)', count: 1460, pct: 40.0, delta: 2.0, insightTrigger: null },
        { name: 'Standard flow', count: 2190, pct: 60.0, delta: -2.0, insightTrigger: null },
      ],
    },
    stage_stuck: {
      label: 'Stage Where Stuck',
      segments: [
        { name: 'TM Account Creation', count: 3650, pct: 100.0, delta: 0.0, insightTrigger: 'LMS account creation failure' },
      ],
    },
    reattempt_status: {
      label: 'Re-attempt Status',
      segments: [
        { name: 'First attempt', count: 2555, pct: 70.0, delta: 0.0, insightTrigger: null },
        { name: 'Re-attempter (2nd+ try)', count: 1095, pct: 30.0, delta: 0.0, insightTrigger: null },
      ],
    },
    cf_cohort: {
      label: 'Convenience Fee Cohort',
      segments: [
        { name: 'High Convenience Fee offer eligible', count: 1278, pct: 35.0, delta: 0.0, insightTrigger: null },
        { name: 'Low Convenience Fee / Standard', count: 2372, pct: 65.0, delta: 0.0, insightTrigger: null },
      ],
    },
    rejection_reason: {
      label: 'Failure Type',
      segments: [
        { name: 'TM API error', count: 2190, pct: 60.0, delta: 3.0, insightTrigger: null },
        { name: 'TM duplicate account', count: 1460, pct: 40.0, delta: -3.0, insightTrigger: null },
      ],
    },
  },

  stuck_vkyc_selfie: {
    offer_eligibility: {
      label: 'Offer Eligibility',
      segments: [
        { name: 'Pre-approved (CIR Offer)', count: 2560, pct: 50.0, delta: 5.0, insightTrigger: 'Pre-approved users stuck at selfie = KYC issue' },
        { name: 'Standard flow', count: 2560, pct: 50.0, delta: -5.0, insightTrigger: null },
      ],
    },
    stage_stuck: {
      label: 'Stage Where Stuck',
      segments: [
        { name: 'VKYC Initiated', count: 3072, pct: 60.0, delta: 2.0, insightTrigger: null },
        { name: 'Selfie re-upload loop', count: 2048, pct: 40.0, delta: -2.0, insightTrigger: 'Session/state issue' },
      ],
    },
    reattempt_status: {
      label: 'Re-attempt Status',
      segments: [
        { name: 'First attempt', count: 2048, pct: 40.0, delta: -5.0, insightTrigger: null },
        { name: 'Re-attempter (2nd+ try)', count: 3072, pct: 60.0, delta: 5.0, insightTrigger: 'Re-entry hitting selfie again = state bug' },
      ],
    },
    cf_cohort: {
      label: 'Convenience Fee Cohort',
      segments: [
        { name: 'High Convenience Fee offer eligible', count: 2304, pct: 45.0, delta: 2.0, insightTrigger: null },
        { name: 'Low Convenience Fee / Standard', count: 2816, pct: 55.0, delta: -2.0, insightTrigger: null },
      ],
    },
    rejection_reason: {
      label: 'Stuck Reason',
      segments: [
        { name: 'Liveliness failure', count: 2560, pct: 50.0, delta: 3.0, insightTrigger: null },
        { name: 'Selfie quality reject', count: 1536, pct: 30.0, delta: 0.0, insightTrigger: null },
        { name: 'Session timeout', count: 1024, pct: 20.0, delta: -3.0, insightTrigger: null },
      ],
    },
  },

  others: {
    activation_status: {
      label: 'Activation Status',
      segments: [
        { name: 'Activated (≥1 txn)', count: 22950, pct: 50.0, delta: 0.0, insightTrigger: null },
        { name: 'Not Activated (0 txn)', count: 22949, pct: 50.0, delta: 0.0, insightTrigger: null },
      ],
    },
    account_age: {
      label: 'Account Age',
      segments: [
        { name: 'New (<30 days)', count: 27539, pct: 60.0, delta: 2.0, insightTrigger: null },
        { name: 'Existing (>30 days)', count: 18360, pct: 40.0, delta: -2.0, insightTrigger: null },
      ],
    },
    cf_cohort: {
      label: 'Convenience Fee Cohort',
      segments: [
        { name: 'High Convenience Fee (>₹99/month)', count: 13770, pct: 30.0, delta: 0.0, insightTrigger: null },
        { name: 'Low / Zero Convenience Fee', count: 32129, pct: 70.0, delta: 0.0, insightTrigger: null },
      ],
    },
    repayment_status: {
      label: 'Repayment Status',
      segments: [
        { name: 'Paid on time', count: 32129, pct: 70.0, delta: 0.0, insightTrigger: null },
        { name: 'Overdue / Frozen', count: 13770, pct: 30.0, delta: 0.0, insightTrigger: null },
      ],
    },
    mpin_setup: {
      label: 'MPIN / UPI Setup',
      segments: [
        { name: 'MPIN Set', count: 27539, pct: 60.0, delta: 0.0, insightTrigger: null },
        { name: 'MPIN Not Set', count: 18360, pct: 40.0, delta: 0.0, insightTrigger: null },
      ],
    },
    spend_frequency: {
      label: 'Spend Frequency',
      segments: [
        { name: 'High spender (≥5 txns)', count: 9180, pct: 20.0, delta: 0.0, insightTrigger: null },
        { name: 'Low spender (1–4 txns)', count: 36719, pct: 80.0, delta: 0.0, insightTrigger: null },
      ],
    },
  },
};
