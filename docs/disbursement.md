# Disbursement Analysis

## Purpose

The Disbursement section provides detailed analysis of credit line disbursement performance, including volume, amount, approval-to-disbursement conversion, TAT metrics, lender-wise breakdowns, daily trends, and failure analysis.

## Views

### KPI Cards
- Disbursement Count (MTD)
- Total Disbursement Amount (Cr)
- Approval-to-Disbursement Conversion %
- Average TAT (hours)
- Each card shows MoM delta and RAG badge

### Daily Disbursement Trend
- Recharts LineChart showing daily disbursement count and amount over the current month
- Dual Y-axis: count (left), amount in Cr (right)
- Anomaly detection for sudden drops

### Lender-wise Breakdown Table
- Columns: Lender, Count, Amount (Cr), Avg TAT (hrs), Failure Rate %, Status
- Sortable columns
- RAG badge per lender based on failure rate thresholds

### Failure Analysis
- Ranked table of failure reasons
- Columns: Reason, Count, % of Total, Trend (sparkline)
- RAG badges for top failure reasons

## Data Sources

| Data | Module |
|------|--------|
| All disbursement data | `disbursement.js` |

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
