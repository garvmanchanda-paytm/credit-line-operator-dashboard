# Post-Onboarding — Deep Dive

## Purpose

The Post-Onboarding section provides comprehensive analysis of the post-onboarding lifecycle, covering portfolio health, bill reconciliation, repayment performance, and transaction (spends) health.

## Views

### Portfolio
- MoM portfolio summary table (signups, GMV, txns, AIF, etc.)
- 6 KPI cards with MoM deltas and RAG badges
- Loan status distribution donut chart
- Transacting users stacked bar chart
- Cross-links: Frozen Accounts → Repayment Recon, VKYC_SOFTBLOCKED → User Pulse

### Bill Reconciliation
- L1 Snapshot: SSFB vs Paytm LMS card-style metrics grid
- L2 Delta Focus: table of mismatched dimensions with "View LANs" drill-through
- L3 LAN Table: sortable, filterable, paginated table with multi-select
- Inline email section for sending reconciliation requests (no modal)

### Repayment Reconciliation
- Dues snapshot cards (total billed, repaid, outstanding, OD)
- MoM repayment table
- SSFB vs Paytm DPD tables side-by-side with reconciliation alerts
- Paid/Partial/Not Paid donut chart
- Cross-links: Overpay accounts → User Pulse, Did Not Pay → Portfolio

### Spends & Transaction Health
- Yesterday's SR KPI card
- Daily success rate line chart with anomaly shading
- Ranked UPI error code table with spike detection badges
- MoM GMV and transaction count dual line charts
- Cross-link: SR drop → User Pulse "Txn Failed" issue

## Data Sources

| Data | Module |
|------|--------|
| Portfolio metrics | `portfolio.js` |
| Bill recon snapshot | `billRecon.js` |
| Repayment data | `repayment.js` |
| Spends / SR data | `spends.js` |

## RAG Logic

- Portfolio KPIs: MoM delta thresholds (green > 0, amber -5 to 0, red < -5)
- Bill Recon: red if diff > 0, green if diff = 0
- Repayment: DPD bucket thresholds
- Spends: SR > 95% green, 90–95% amber, < 90% red

## Anomaly Detection

- AnomalyBadge: SPIKE if value > 2x rolling average, WATCH if > 1.5x

## Components

- `src/pages/PostOnboardingView.jsx`
- `src/components/postOnboarding/Portfolio.jsx`
- `src/components/postOnboarding/BillRecon.jsx`
- `src/components/postOnboarding/RepaymentRecon.jsx`
- `src/components/postOnboarding/Spends.jsx`
- `src/components/postOnboarding/LANTable.jsx`
- `src/components/postOnboarding/EmailModal.jsx` (inline section)
- `src/components/postOnboarding/AnomalyBadge.jsx`

## Navigation

- Sidebar: "Post-Onboarding" item
- Internal tab bar: Portfolio | Bill Recon | Repayment | Spends
