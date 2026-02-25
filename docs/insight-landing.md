# Insight Landing Page

## Purpose

The Insight Landing Page is the unified home screen for the Paytm Postpaid Product Manager Dashboard. It provides a single-glance executive summary across all charters — Onboarding Funnel, Disbursement, User Pulse (CST), and Post-Onboarding — so that a PM can instantly identify areas requiring attention without navigating into individual sections.

## Lender Filter

A top-level lender filter is displayed at the top-right of the page:

| Option | Behavior |
|--------|----------|
| All Lenders | Shows consolidated metrics across both lenders |
| SSFB | Filters all KPIs, cards, Quick Deepdive, and System Alerts to SSFB |
| JANA | Filters all KPIs, cards, Quick Deepdive, and System Alerts to JANA |

Default selection: **All Lenders**. The filter applies to every section on the page.

## Page Layout (top to bottom)

### 1. Key Metrics Row (5 KPI cards)

| Card | Value | Delta | RAG Logic |
|------|-------|-------|-----------|
| Lead to Conversion (%) | End-to-end conversion from Landing Page View → Onboarding Complete | vs Jan LMTD | Red if >5% drop; Amber if 0–5% drop; Green if improving |
| Disbursement (#accounts) | Count of disbursements MTD | MoM % change | Green if positive; Red if negative |
| Disbursement Value (Cr) | Total disbursement amount in Cr | MoM % change | Green if positive; Red if negative |
| Tickets | Total CST tickets MTD | Top issue % share | Red if top issue >10% share; else Amber |
| Portfolio | Total active accounts | Transacting users MoM % | Green if >5%; else Amber |

All values change dynamically based on the selected lender filter.

### 2. Section Quick-Link Cards

A 2x2 grid of clickable cards, one per dashboard section:

- **Onboarding Funnel**: Conversion summary + sparkline + RAG counts
- **Disbursement Analysis**: Disbursement count + amount summary + sparkline
- **User Pulse — CST**: Ticket count + top issue summary + sparkline
- **Post-Onboarding**: Active accounts + GMV summary + sparkline

Each card has a "View details →" link that navigates to the respective section.

### 3. Quick Deepdive

Previously named "Alerts & Anomalies" — renamed per feedback. Surfaces auto-detected RED/AMBER status items:

- Funnel: Landing page view drops vs LMTD
- User Pulse: High-share ticket categories
- Post-Onboarding: SPAC declines
- Disbursement: Approval-to-disbursement drops

Each item is clickable and navigates to the relevant section. Content filters by selected lender.

### 4. System Alerts

Live API and funnel health alerts from the last 1 hour. Auto-resolves when the issue clears — no manual dismiss option.

- **API alerts**: Expandable to show endpoint, error rate vs baseline, impacted users, and a log table (timestamp, endpoint, status code, latency, customer ID)
- **Funnel alerts**: Expandable to show stage, current vs previous conversion, duration, 60-minute trend chart, and cascading downstream impact

Badges show Critical (red) and Warning (amber) counts.

## Data Sources

| Metric | Source Module |
|--------|--------------|
| Funnel conversion | `funnelMTD.js` (lender-keyed via `funnelByLender`) |
| Disbursement count/amount | `disbursement.js` |
| Top CST issue | `issueCategories.js` |
| Portfolio active accounts | `portfolio.js` |
| System alerts | `systemAlerts.js` |

## Component

`src/pages/InsightLandingPage.jsx`

## Navigation

- Default view when the dashboard loads (`activeView === 'insightLanding'`)
- Accessible via "Home" icon in the sidebar
