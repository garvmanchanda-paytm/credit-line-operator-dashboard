# Funnel Analysis

## Purpose

The Funnel section provides detailed onboarding funnel analysis for Paytm Postpaid, enabling PMs to track user progression through each stage, identify bottlenecks, and drill down into L2 sub-stages and L3 error logs. Supports single-lender filtering.

## Views

### Snapshot (Landing)
- Funnel Health Summary (auto-generated commentary with RAG badges)
- KPI Strip (4 headline metrics)
- 2x2 Funnel Comparison Grid: MTD vs LMTD, T-1 vs LMSD
- Each funnel uses a tapered SVG visualization (actual funnel shape)
- Lender filter dropdown at the top
- Open/Closed funnel toggle

### Deepdive (Table)
- Tabular view of all funnel stages with columns: Stage, Feb MTD, Step Conv%, Overall %, Jan MTD, LMTD Conv%, Delta, T-1 Count, Status
- Status column has a filter (Red/Amber/Green/Gray/All)
- Clicking a row navigates to the Stage Detail page
- Lender filter dropdown

### Stage Detail (Full Page)
- Breadcrumb navigation: Dashboard / Funnel / [Stage Name]
- Stage summary (auto-generated insights)
- 7-day trend line chart
- L2 Sub-Stage Table (expandable rows with API health and L3 errors)
- Selfie error breakdown (for SELFIE_CAPTURED stage)
- Annotation box (localStorage-backed)

## Data Sources

| Data | Module |
|------|--------|
| Open funnel MTD | `funnelMTD.js` (lender-keyed) |
| Closed funnel | `funnelClosed.js` (lender-keyed) |
| Daily funnel | `dailyFunnel.js` (lender-keyed) |
| Sub-stages | `allStages.js` |
| API health | `apiHealth.js`, `subStageApi.js` |
| L3 errors | `logErrors.js` |

## Lender Filter

- Dropdown options: ALL, SSFB, HDFC
- When a lender is selected, all funnel data filters to that lender
- Default: ALL (aggregated view)

## RAG Logic

Conversion RAG (step conversion vs LMTD):
- Green: delta >= -0.5pp
- Amber: delta between -0.5pp and -2pp
- Red: delta < -2pp
- Gray: no data

## Funnel Visualization

SVG-based tapered trapezoid funnel:
- Each stage is a trapezoid whose top-width matches the previous stage's bottom-width
- Bottom-width is proportional to the stage's count relative to the first stage
- Color-coded by RAG status

## Components

- `src/pages/SnapshotView.jsx`
- `src/pages/DeepdiveView.jsx`
- `src/pages/StageDetailPage.jsx`
- `src/components/VerticalFunnel.jsx`
- `src/components/KPIStrip.jsx`
- `src/components/SubStageTable.jsx`
- `src/components/StageSummary.jsx`

## Navigation

- Sidebar: "Funnel" section with Snapshot and Deepdive sub-items
- Stage Detail: full-page navigation from stage click (no popup)
