# Funnel Analysis

## Purpose

The Funnel section provides detailed onboarding funnel analysis for Paytm Postpaid, enabling PMs to track user progression through each stage, identify bottlenecks, and drill down into L2 sub-stages and L3 error logs. Supports single-lender filtering.

## Views

### Snapshot (Landing)
- Funnel Health Summary (auto-generated commentary with RAG badges)
- KPI Strip: 3 headline metric cards + a "Key Drop-off Stages" section showing the top 3 stages with highest MTD vs LMTD deviation
- 2x2 Funnel Comparison Grid: MTD vs LMTD, T-1 vs LMSD
- Each funnel uses a horizontal gradient bar visualization with alternating row backgrounds and hover tooltips for improved readability
- Lender filter: **SSFB / JANA only** (no "All Lenders" — consolidated funnel is not meaningful on this page)
- Open/Closed funnel toggle

### Deepdive (Table)
- Tabular view of all funnel stages with columns: Stage, Feb MTD, Step Conv%, Overall %, Jan MTD, LMTD Conv%, Delta, T-1 Count, Status
- Status column has a filter (Red/Amber/Green/Gray/All)
- Clicking a row navigates to the Stage Detail page
- Lender filter dropdown (ALL, SSFB, JANA)

### Stage Detail — Investigation Workspace (Full Page)

The Stage Detail page is a PM investigation workspace. When a stage turns Red or Amber, the PM arrives, understands the problem, drills to root cause, logs a hypothesis, and exits with an assigned action.

Page sections in order:

1. **Breadcrumb**: Dashboard / Funnel / [Stage Name]
2. **Stage Header**: Name, MTD count, step conversion %, RAG badge
3. **R1 — Problem Statement Banner**: Auto-generated one-line summary when RAG is Red/Amber. Shows "[Stage] dropped X.Xpp vs LMTD. Primary driver: [worst L2]. ~N users/day affected." Hidden for Green stages.
4. **StageSummary**: Auto-generated trend, L2, API, and L3 insights
5. **7-Day Trend**: Line chart of daily conversion for last 7 days
6. **R2 — L2 Contribution Bars**: Horizontal bars proportional to each L2 sub-stage's delta magnitude. Red bars for negative delta, green for positive. Worst L2 marked with "Primary Driver" badge. Columns: Sub-Stage, MTD Count, MTD%, LMTD%, Delta.
7. **L2 Sub-Stage Table**: Existing expandable rows with API health and L3 errors inside each expand
8. **Selfie Error Breakdown**: (SELFIE_CAPTURED stage only)
9. **R3 — Auto-Surfaced L3 Panel**: When any L2 has delta worse than -0.3pp, the worst L2's L3 errors are auto-expanded (no click needed). Errors split into "System Issues" (API timeout, 5xx, rate limit) and "User Behavior Issues" (selfie unclear, eyes closed, etc.). Each error shows impact chain: "This error contributes X% to [L2] failures."
10. **R4 — Hypothesis Workspace**: PM can create multiple hypothesis cards with: root cause category (dropdown), detail (text), confidence (High/Medium/Low radio), evidence (multi-select from auto-populated L2 deltas, L3 error trends, API health flags), status (Draft/Under Investigation/Confirmed/Ruled Out). All persisted to `localStorage` under `hypothesis_[stage]`.
11. **R5 — Next Action Planner**: Replaces the old annotation box. Structured form with action type (radio), owner, target date, ticket link, notes. Persisted to `localStorage` under `action_[stage]`. Each save also appends to the Investigation Log.
12. **R6 — Investigation Log**: Collapsible reverse-chronological timeline at page bottom. Shows all hypothesis saves and action saves with type badge, summary, and timestamp. Persisted in `localStorage` under `log_[stage]`.

## KPI Strip Details

### Metric Cards (3)

| Card | Value | Comparison |
|------|-------|------------|
| Landing Page Views (MTD) / Started (MTD) | Absolute count | vs LMTD % change |
| Overall Conversion | End-to-end % | vs LMTD pp change |
| Leads Closed (MTD) | Absolute count | vs LMTD % change |

### Key Drop-off Stages

Replaces the previous "Biggest Drop Stage" single card. Shows the **top 3 stages** sorted by largest negative deviation (MTD step conversion minus LMTD step conversion). Each entry displays:
- Stage name
- MTD conversion vs LMTD conversion
- Deviation in pp (color-coded: red if > -2pp, amber if < 0, green if positive)

## Funnel Visualization

Redesigned for improved readability:
- **Horizontal gradient bars** (proportional width based on count relative to first stage)
- **Alternating row backgrounds** (subtle gray/white) for visual separation
- **Hover tooltip** at the bottom showing full stage details: count, comparison count, conversion, comparison conversion
- **Larger fonts**: 11px for labels and counts, 12px bold for delta values
- **Minimum bar width** of 10% ensures even small stages remain visible
- RAG color-coded bars with gradient fill
- Click any stage row to navigate to Stage Detail page

## Lender Filter

- **Snapshot page**: Only SSFB and JANA are available (no ALL option)
- **Deepdive page**: ALL, SSFB, JANA available
- When a lender is selected, all funnel data, KPIs, and commentary filter to that lender
- Default on Snapshot: SSFB

## Data Sources

| Data | Module |
|------|--------|
| Open funnel MTD | `funnelMTD.js` (lender-keyed via `funnelByLender`) |
| Closed funnel | `funnelClosed.js` (lender-keyed via `closedByLender`) |
| Daily funnel | `dailyFunnel.js` |
| Sub-stages | `allStages.js` |
| API health | `apiHealth.js`, `subStageApi.js` |
| L3 errors | `logErrors.js` |

## RAG Logic

Conversion RAG (step conversion vs LMTD):
- Green: delta >= -0.5pp
- Amber: delta between -0.5pp and -2pp
- Red: delta < -2pp
- Gray: no data

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
