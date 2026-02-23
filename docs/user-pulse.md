# User Pulse — CST Dashboard

## Purpose

The User Pulse section provides analysis of customer support tickets (CST), enabling PMs to track issue categories, identify cohort-level breakdowns, and take action on the highest-impact user pain points.

## Views

### Issue Overview (L1)
- Time window and charter filters
- KPI cards (total tickets, top issue share, resolution rate)
- Stacked bar chart showing issue category distribution over time
- Ranked issue table with columns: Issue, MTD Count, % Share, Trend (sparkline), Status
- Status column has a filter (RED/AMBER/GREEN/All)
- Clicking an issue row navigates to the Issue Detail page

### Issue Detail (L2/L3 — Full Page)
- Breadcrumb: Dashboard / User Pulse / [Issue Name]
- Issue header with ticket count and share badge
- All cohort dimension breakdowns displayed vertically (no dropdown selector)
- Each dimension section includes:
  - Mini donut chart
  - Segment table (Segment, Count, %, Delta, Insight)
  - Expandable L3 action cards with hypothesis, data signal, and recommended actions

## Data Sources

| Data | Module |
|------|--------|
| Issue categories | `issueCategories.js` |
| Cohort breakdowns | `cohortBreakdowns.js` |
| Action cards | `actionCards.js` |

## RAG Logic

Issue-level RAG:
- RED: pctShare > 10% or significant spike
- AMBER: pctShare 5–10%
- GREEN: pctShare < 5% or declining trend

## Components

- `src/pages/UserPulseView.jsx`
- `src/pages/IssueDetailPage.jsx`
- `src/components/UserPulseFilters.jsx`
- `src/components/IssueOverview.jsx`
- `src/components/ActionCard.jsx`

## Navigation

- Sidebar: "User Pulse" item under CST section
- Issue Detail: full-page navigation from issue click (no popup)
