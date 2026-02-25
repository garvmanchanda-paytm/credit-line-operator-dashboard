# Engagement & Intelligence Features (P1–P4)

## Overview

Four phases of features designed to transform the dashboard from a passive reporting tool into an active PM workstation. Each phase builds on the previous, forming a habit loop: open → remember → investigate → correlate.

---

## Phase 1 — Daily Open Hooks

Goal: Give PM a reason to open the dashboard every morning.

### P1.1 — Navigation Red Badges
- Sidebar nav items show a count badge of RED signals for their section
- Funnel: count of stages where conversion delta > 5pp (RED RAG)
- User Pulse: count of issues where delta > 5% (RED RAG)
- Derived from existing RAG logic — no new data
- Badge renders as a small red circle with count next to the nav label

### P1.2 — T-1 Delta on Homepage KPIs
- Each of the 5 homepage KPI cards gets a secondary "since yesterday" line
- Format: `▼ 2.3% since yesterday` or `▲ 1.1% since yesterday`
- Calculated from `dailyFunnel` data (last day vs second-to-last day)
- Colour coded: red for decline, green for improvement
- Changes homepage from "MTD snapshot" to "what moved today"

### P1.3 — Alert → Investigation Routing
- Each System Alert card gets an "Investigate →" CTA button
- For funnel alerts: routes to `StageDetailPage` for the relevant stage
- For API alerts: routes to `StageDetailPage` for the stage associated with the endpoint
- Navigation wired through `DashboardContext.navigateToStageDetail`

---

## Phase 2 — Memory & Personalization

Goal: Make the dashboard remember what the PM is working on.

### P2.1 — Watch List
- Bookmark icon on funnel stages (Deepdive table), User Pulse issue rows
- Watched items render as a pinned strip at the top of the homepage
- Each watched item shows: name, latest delta, RAG badge
- Max 6 items; persisted to `localStorage` key `pm_watchlist`
- Clicking a watched item navigates to its detail page

### P2.2 — Issue Resolution Status
- User Pulse ranked table gets derived status badges from investigation workspace
- Reads from `log_issue_[issueId]` and `hypothesis_issue_[issueId]` localStorage keys
- Badges: "Investigating" (has hypothesis Under Investigation), "Action Taken" (has saved SOP), "No Action" (default)
- No new data — purely reads from existing localStorage entries

### P2.3 — Daily Brief Section
- Collapsible section at the very top of the homepage (above KPI cards)
- Header: "Today vs Yesterday — X worse, Y better"
- Auto-generated list of signals that moved significantly (> threshold) since T-1
- Sources: funnel stage deltas, User Pulse issue deltas, disbursement changes
- Ranked by magnitude; clicking any item navigates to it
- Data exists — aggregation + presentation only

---

## Phase 3 — Pressure Performance

Goal: Make the dashboard the go-to tool during incidents and weekly reviews.

### P3.1 — Week-over-Week (WoW) Toggle
- New comparison option alongside MTD/LMTD on User Pulse time filter
- Calculated as last 7 days vs previous 7 days from existing `dailyFunnel` data
- Useful mid-month when MTD comparisons are noisy

### P3.2 — Hypothesis Metrics Strip
- 3-stat bar inside the Hypothesis Workspace header: `N Open · N Confirmed · N Resolved`
- Aggregated by scanning all `hypothesis_[stage]` and `hypothesis_issue_[id]` keys in localStorage
- Displayed in both StageDetailPage and IssueDetailPage workspaces

### P3.3 — Emergency View
- New view accessible from homepage via a prominent "Emergency" button
- Shows every RED signal across all pillars simultaneously
- Sources: RED funnel stages, L3 ALERT errors, CST spikes, active system alerts
- Ranked by severity; single-page incident command center
- New view registered in `DashboardContext` and `App.jsx`

---

## Phase 4 — Cross-Pillar Intelligence

Goal: Surface insights that no individual pillar can show.

### P4.1 — Correlation Timeline
- Horizontal timeline on the homepage showing events across all pillars
- Each event is a timestamped dot colour-coded by pillar (funnel/CST/alerts/disbursement)
- Hovering shows event details
- Enables visual detection of correlated events (e.g., funnel drop + CST spike)
- Requires new shared event data structure in `mockData/crossPillarEvents.js`

### P4.2 — Cross-Pillar Hypothesis
- Extends hypothesis workspace to allow evidence selection from any pillar
- PM investigating a funnel drop can pull in a CST signal as supporting evidence
- Shared evidence registry aggregates signals across the app
- Evidence options dynamically populated from all pillars based on recency and magnitude

---

## LocalStorage Keys

| Key | Purpose |
|-----|---------|
| `pm_watchlist` | Array of watched items (max 6) |
| `hypothesis_[stage]` | Hypothesis cards per funnel stage |
| `hypothesis_issue_[id]` | Hypothesis cards per User Pulse issue |
| `sop_issue_[id]` | SOP entries per User Pulse issue |
| `log_[stage]` | Investigation log per funnel stage |
| `log_issue_[id]` | Investigation log per User Pulse issue |

## Components

| Component | File | Phase |
|-----------|------|-------|
| NavButton (badge) | `App.jsx` | P1.1 |
| KpiCard (T-1 delta) | `InsightLandingPage.jsx` | P1.2 |
| SystemAlertsPanel (CTA) | `InsightLandingPage.jsx` | P1.3 |
| WatchListStrip | `InsightLandingPage.jsx` | P2.1 |
| IssueOverview (status) | `IssueOverview.jsx` | P2.2 |
| DailyBrief | `InsightLandingPage.jsx` | P2.3 |
| UserPulseFilters (WoW) | `UserPulseFilters.jsx` | P3.1 |
| HypothesisMetrics | `StageDetailPage.jsx`, `IssueDetailPage.jsx` | P3.2 |
| EmergencyView | `EmergencyView.jsx` | P3.3 |
| CorrelationTimeline | `InsightLandingPage.jsx` | P4.1 |
| CrossPillarEvidence | `StageDetailPage.jsx`, `IssueDetailPage.jsx` | P4.2 |
