export const actionCards = {
  // POST-ONBOARDING
  'deactivation__activation_status__Not Activated (0 txn)': {
    issueCohort: 'Deactivation Request — Not Activated Users',
    hypothesis: 'User received limit but never understood how to use Credit on UPI. Deactivation = giving up on a confusing product.',
    dataSignal: '61% of deactivation requests from users who never transacted',
    actions: [
      { text: 'Push in-app "How to Use" nudge at Day 3 post-limit activation', tag: 'Experiment' },
      { text: 'A/B test first-use guide screen on homepage for 0-txn users', tag: 'Experiment' },
    ],
    owner: 'PM — Activation',
    priority: 'P1',
  },
  'deactivation__cf_cohort__High Convenience Fee (>₹99/month)': {
    issueCohort: 'Deactivation Request — High CF, Activated Users',
    hypothesis: 'User transacted but is bothered by Convenience Fee. Deactivation is a pricing objection, not a product objection.',
    dataSignal: '42% of deactivation requests from High Convenience Fee cohort',
    actions: [
      { text: 'Surface Convenience Fee value prop in-app (rewards, purchase protection) before deactivation flow', tag: 'Product Change' },
      { text: 'Explore Convenience Fee waiver for high-spend cohort (≥5 txns/month)', tag: 'Experiment' },
    ],
    owner: 'PM — Monetization',
    priority: 'P1',
  },
  'surplus_refund__repayment_status__Paid on time': {
    issueCohort: 'Surplus Refund — Paid on time, High Spend',
    hypothesis: 'User paid bill manually but amount also auto-debited from mandate. Double deduction = ops reconciliation failure.',
    dataSignal: '73% of surplus refund requests from users who paid on time',
    actions: [
      { text: 'Audit payment reconciliation for mandate + manual pay overlap window', tag: 'Quick Fix' },
      { text: 'Auto-detect double deductions and trigger refund within 24h', tag: 'Quick Fix' },
    ],
    owner: 'PM — Payments',
    priority: 'P1',
  },
  'txn_failed__activation_status__Activated (≥1 txn)': {
    issueCohort: 'Txn Failed (Amount Deducted) — Active Users',
    hypothesis: 'UPI rails processed debit but Postpaid ledger did not register the transaction. User pays from another source to avoid freeze.',
    dataSignal: '90% of txn-failed tickets from activated users; 60% are high spenders',
    actions: [
      { text: 'Shadow ledger check on all txns where UPI success ≠ Postpaid credit', tag: 'Quick Fix' },
      { text: 'Auto-reverse + notify user within 4h of mismatch detection', tag: 'Quick Fix' },
    ],
    owner: 'PM — Payments',
    priority: 'P1',
  },
  'activation_pending__mpin_setup__MPIN Not Set': {
    issueCohort: 'Activation Pending — MPIN Not Set',
    hypothesis: 'User completed onboarding but never set UPI PIN — limit exists but is unusable. Journey ends at a silent failure.',
    dataSignal: '72% of activation-pending tickets from users who never set MPIN',
    actions: [
      { text: 'MPIN set reminder push at T+1, T+3, T+7 post limit activation', tag: 'Quick Fix' },
      { text: 'Show MPIN setup as mandatory step on homepage for 0-txn users', tag: 'Product Change' },
    ],
    owner: 'PM — Activation',
    priority: 'P1',
  },

  // ONBOARDING
  'lead_rejected__offer_eligibility__Pre-approved (CIR Offer)': {
    issueCohort: 'Lead Rejected — Pre-approved (High Convenience Fee Eligible)',
    hypothesis: 'Pre-approved user (good bureau score) rejected at Lender BRE. Bureau and lender criteria are misaligned.',
    dataSignal: '25% of rejection tickets from pre-approved users; share up 4pp vs last month',
    actions: [
      { text: 'Map rejection reasons from lender API for pre-approved cohort', tag: 'Product Change' },
      { text: 'Escalate threshold mismatch to Lender BRE team with data', tag: 'Product Change' },
    ],
    owner: 'PM — Onboarding',
    priority: 'P1',
  },
  'stuck_lan_creation__offer_eligibility__Pre-approved (CIR Offer)': {
    issueCohort: 'Stuck — LAN Creation Failed',
    hypothesis: 'User reached eSign successfully but LAN creation failed silently. User is in limbo — no failure screen, no retry option.',
    dataSignal: '40% of LAN-stuck tickets from pre-approved users (good profiles)',
    actions: [
      { text: 'Add explicit failure screen with retry CTA after LAN creation fails', tag: 'Quick Fix' },
      { text: 'Auto-retry LAN creation once per day for 3 days before marking failed', tag: 'Quick Fix' },
    ],
    owner: 'PM — Onboarding',
    priority: 'P1',
  },
  'stuck_vkyc_selfie__reattempt_status__Re-attempter (2nd+ try)': {
    issueCohort: 'Stuck — VKYC / Selfie (Re-attempters)',
    hypothesis: 'User already passed selfie but re-enters journey and hits selfie step again. Likely session or state persistence issue.',
    dataSignal: '60% of selfie-stuck tickets are re-attempters (2nd+ try)',
    actions: [
      { text: 'Persist selfie verification state across sessions (don\'t re-trigger if already passed)', tag: 'Product Change' },
      { text: 'Skip selfie step if VKYC already passed within last 30 days', tag: 'Product Change' },
    ],
    owner: 'PM — Onboarding',
    priority: 'P2',
  },
  'how_to_apply__reattempt_status__Re-attempter (2nd+ try)': {
    issueCohort: 'Eligibility Query — Standard Flow, 2nd Attempt',
    hypothesis: 'User tried once, was rejected or dropped off, tried again. Is confused about what changed or what they need to do differently.',
    dataSignal: '32% of eligibility queries from re-attempters',
    actions: [
      { text: 'Show personalised "where you left off" screen on re-entry', tag: 'Experiment' },
      { text: 'Add FAQ section explaining bureau rejection reasons in simple language', tag: 'Experiment' },
    ],
    owner: 'PM — Onboarding',
    priority: 'P2',
  },
  'mandate_change__repayment_status__Overdue / Frozen': {
    issueCohort: 'Mandate Change Request',
    hypothesis: 'User wants to switch autopay bank account. Currently requires CST intervention — no self-serve option exists.',
    dataSignal: '30% of mandate change tickets from overdue/frozen users trying to avoid auto-debit',
    actions: [
      { text: 'Build self-serve mandate update flow in the app', tag: 'Product Change' },
      { text: 'Add "Change Mandate" option in Account Settings → Autopay section', tag: 'Product Change' },
    ],
    owner: 'PM — Post-Onboarding',
    priority: 'P2',
  },
};
