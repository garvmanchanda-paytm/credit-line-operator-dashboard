# Disbursement Analysis

## Purpose

The Disbursement section provides detailed analysis of credit line disbursement performance, including volume, amount, approval-to-disbursement conversion, TAT metrics, lender-wise breakdowns, daily trends, failure analysis, and cross-charter key analysis.

## Lender Filter

A top-level filter at the top-right of the page:

| Option | Behavior |
|--------|----------|
| All Lenders | Consolidated metrics across both lenders |
| SSFB | All KPIs, trendline, and failure analysis filter to SSFB |
| JANA | All KPIs, trendline, and failure analysis filter to JANA |

Default: **All Lenders**. The filter applies to all sections **above** the page break. The Lender-wise Breakdown table below the page break always shows all lenders regardless of filter.

## Page Layout (top to bottom)

### 1. KPI Cards (4)

| Card | Value | Delta | RAG Logic |
|------|-------|-------|-----------|
| Disbursement Count MTD | Absolute count | MoM % | Green if positive; Red if negative |
| Total Amount (Cr) | ₹ amount | MoM % | Green if positive; Red if negative |
| Approval → Disbursement % | Conversion % | MoM pp change | Green >90%; Amber 80–90%; Red <80% |
| Avg TAT (hours) | Hours | MoM % | Green <24h; Amber 24–48h; Red >48h |

All filter by selected lender.

### 2. Daily Disbursement Trend

Recharts dual-axis LineChart showing daily disbursement count (left Y) and amount in Cr (right Y) over the current month. Filters by selected lender.

### 3. Key Analysis

Cross-charter insights section surfacing choke points that affect disbursement health. Each insight includes:
- RAG indicator (red/amber)
- Title describing the issue
- Detailed description with numbers
- Source attribution (which dashboard section the data comes from)

Current insights cover:
- **Lender API Timeout** — LAN Creation & Account Creation failures from funnel tail-end
- **Recon Issues** — Lender vs Paytm LMS mismatches from Bill Recon
- **Repayment Delta & Double Repayment** — From Repayment + User Pulse
- **KYC Document Mismatch Rejections** — From Failure Analysis

### 4. Failure Analysis

Ranked table of disbursement failure reasons:
- Columns: #, Reason, Count, % of Total, Trend (sparkline)
- Ordered by count descending

### 5. Page Break

A visual dashed-line separator with label "Lender-wise Breakdown (All Lenders)" indicating that the lender filter does not apply below this line.

### 6. Lender-wise Breakdown Table

Always shows all lenders regardless of the filter above. Columns:
- Lender, Count, Amount (Cr), Avg TAT (hrs), Failure Rate %, Status (RAG dot)

## Data Sources

| Data | Module |
|------|--------|
| KPIs | `disbursement.js` — `disbursementKPIs` |
| Daily trend | `disbursement.js` — `dailyDisbursement` |
| Lender breakdown | `disbursement.js` — `lenderBreakdown` |
| Failure reasons | `disbursement.js` — `failureReasons` |
| Key Analysis | Hardcoded cross-charter insights in component |

## RAG Logic

- Failure rate: Green < 5%, Amber 5–10%, Red > 10%
- TAT: Green < 24h, Amber 24–48h, Red > 48h
- Conversion: Green > 90%, Amber 80–90%, Red < 80%

## Component

- `src/pages/DisbursementView.jsx`
- `src/mockData/disbursement.js`

## Navigation

- Sidebar: "Disbursement" item
- `activeView === 'disbursement'`
