# Handover Document — Product Manager Dashboard
## Paytm Postpaid (TPAP) — Cross-Charter Operator Console

| Field | Value |
|-------|-------|
| Product | Paytm Postpaid (Credit Line on UPI) |
| Author | Garv Manchanda, PM — Paytm Postpaid |
| Version | 3.0 — MVP Prototype |
| Repository | [garvmanchanda-paytm/credit-line-operator-dashboard](https://github.com/garvmanchanda-paytm/credit-line-operator-dashboard) |
| Date | March 2026 |

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture & Key Decisions](#3-architecture--key-decisions)
4. [Navigation & Routing](#4-navigation--routing)
5. [Feature Inventory](#5-feature-inventory)
6. [Page-by-Page Reference](#6-page-by-page-reference)
7. [Component Library](#7-component-library)
8. [Mock Data Modules](#8-mock-data-modules)
9. [State Management](#9-state-management)
10. [LocalStorage Persistence](#10-localstorage-persistence)
11. [Commit History & Evolution](#11-commit-history--evolution)
12. [Documentation Files](#12-documentation-files)
13. [How to Run](#13-how-to-run)
14. [Known Limitations & Next Steps](#14-known-limitations--next-steps)

---

## 1. Project Overview

This dashboard replaces the Excel-based workflow used by PMs and leadership to track the Paytm Postpaid onboarding funnel, disbursement, customer support tickets, and post-onboarding health. It is a **frontend-only prototype** with mock data — no backend — designed for iterating on UX, information architecture, and PM workflows before engineering investment.

### Problem it solves

- **Context-switching cost**: Eliminates tab-hopping across 10+ Excel workbooks by consolidating all charter data into a single dashboard.
- **Anomaly detection latency**: Surfaces RED/AMBER/GREEN signals immediately instead of waiting for weekly reviews.
- **No layered drill-down**: Provides L1 → L2 → L3 drill-down (funnel → stage → sub-stage → error → lead) in clicks, not Kibana queries.

### Scope

The prototype covers **3 charters** of Paytm Postpaid:

| Charter | Coverage |
|---------|----------|
| Charter 1: Onboarding | Full funnel (22 stages), sub-stage deep dive, lead-level journey |
| Charter 2: Post-Onboarding | Portfolio, Bill Recon, Repayment, Spends (UPI error codes) |
| Charter 3: CST (User Pulse) | Issue overview, cohort analysis, pulse deep dive, custom cohort builder |

Plus cross-charter features: Insight Landing (homepage), Disbursement Analysis, Emergency View, and Engagement features (watchlist, daily brief, system alerts).

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | ^18.3.1 |
| Build Tool | Vite | ^6.0.0 |
| Styling | Tailwind CSS | ^3.4.15 |
| Charts | Recharts | ^2.15.0 |
| Routing | react-router-dom (installed but unused — state-based nav) | ^6.28.0 |
| CSS Processing | PostCSS + Autoprefixer | ^8.4.49 / ^10.4.20 |
| Language | JavaScript (JSX) | ES2022 |
| Package Manager | npm | — |

### Why these choices

- **Vite** over CRA: Faster HMR, instant dev server start, smaller bundle.
- **Tailwind** over CSS Modules: Rapid prototyping with utility classes; consistent spacing/typography without a design system dependency.
- **Recharts** over D3: Declarative React components for charts; sufficient for line/bar/pie/area; lower learning curve for non-FE engineers.
- **State-based navigation** over React Router: Simpler mental model for a single-page dashboard with deep drill-downs. All view switching happens through `DashboardContext.setActiveView()`. No URL routing needed for a prototype.

---

## 3. Architecture & Key Decisions

### 3.1 No Backend — Mock Data Only

All data lives in `src/mockData/*.js` as exported constants and functions. This was intentional — the prototype is for **PM workflow validation**, not data integration. Every mock file mirrors real production data structures (Feb 2026 actuals) so the transition to API calls is straightforward.

### 3.2 No-Popup Design

Early feedback revealed overlays/modals disrupted PM investigation flow. **Decision**: All drill-downs are full-page views with breadcrumb navigation, not slide-in panels. The one exception is the Custom Cohort Builder modal (intentionally modal because it's a creation flow, not an investigation flow).

### 3.3 PM Investigation Workspace Pattern

Two key pages — `StageDetailPage` and `IssueDetailPage` — follow a structured investigation pattern:

1. **Auto-generated Problem Statement / Signal Banner** (no manual setup needed)
2. **Data breakdowns** (L2 bars, cohort tables, trend charts)
3. **Hypothesis Workspace** (structured cards with pre-fills from data signals)
4. **Action Planner / SOP Selector** (templated response playbooks)
5. **Investigation Log** (reverse-chronological audit trail)

All investigation state persists to `localStorage` so it survives page refreshes.

### 3.4 RAG (Red/Amber/Green) System

Every metric surface uses consistent RAG thresholds defined in `src/utils/rag.js`. This ensures PMs can scan for RED signals at any level (homepage, funnel, issues, post-onboarding).

### 3.5 Multi-Lender Filtering

The dashboard supports lender-level filtering (ALL / SSFB / JANA) at every level. Lender selection is global (stored in `DashboardContext.selectedLender`) and propagated to all views.

### 3.6 Custom Cohort Builder

The Pulse Deep Dive includes a **user-defined cohort builder** where PMs can:
- Name a custom cohort
- Define 2+ segments with color coding
- Write SQL queries (with bind variables) for each segment
- Custom cohorts persist in localStorage and appear alongside built-in cohorts

This was designed so PMs can create ad-hoc analysis dimensions (e.g., "Non-Paytm Spend %age", "BRE Risk Tier") without engineering involvement.

---

## 4. Navigation & Routing

### Sidebar Structure

```
Home (Insight Landing)
────────────────────────
FUNNEL
  ├── Snapshot
  ├── Deepdive
  ├── Sub-Stage Dive
  └── Lead Deep Dive
────────────────────────
DISBURSEMENT
  └── Disbursement
────────────────────────
CST
  └── User Pulse
        ├── Overview (tab)
        └── Pulse Deep Dive (tab)
────────────────────────
POST-ONB
  └── Post-Onboarding
        ├── Portfolio (tab)
        ├── Bill Recon (tab)
        ├── Repayment (tab)
        └── Spends (tab)
```

### Programmatic Deep-Dive Routes

These are not sidebar items but are navigated to from within other pages:

| View ID | Triggered From | Purpose |
|---------|---------------|---------|
| `stageDetail` | Snapshot / Deepdive row click | Stage-level investigation workspace |
| `issueDetail` | User Pulse Overview issue click | Issue-level cohort investigation |
| `lanBreakdown` | Bill Recon / Repayment "View LANs" | LAN-level discrepancy investigation |
| `customer360` | LAN Breakdown row click | Individual loan account deep dive |
| `errorCodeDetail` | Spends error-code row click | UPI error code L2 analysis |
| `dpdBreakdown` | Repayment DPD bucket click | DPD mismatch LAN investigation |
| `leadDeepDive` | Sub-Stage Dive "Open Lead Deep Dive" | Individual lead event timeline |
| `emergency` | Insight Landing alert CTA | All RED signals cross-pillar |

### Navigation Flow

```
setActiveView('stageDetail')  →  renders <StageDetailPage />
navigateBackFromStageDetail() →  returns to previous view
```

All navigation is handled by helper functions in `DashboardContext` (e.g., `navigateToStageDetail`, `navigateToIssueDetail`, `navigateToLanBreakdown`).

---

## 5. Feature Inventory

### Cross-Charter Features

| Feature | Description |
|---------|-------------|
| **Insight Landing (Home)** | Unified homepage with lender filter, 5 KPIs with T-1 deltas, Business Performance Highlights, section cards (Funnel/Disbursement/Pulse/Post-Onb), Watch List, MTD Deepdive, "What Changed" matrix, System Alerts |
| **Watch List** | Pin up to 6 items (stages or issues) for at-a-glance tracking; persisted to localStorage |
| **RED Badges** | Sidebar shows count of RED items per section |
| **Emergency View** | Aggregates all RED signals from funnel, CST, and system alerts into a single incident-command view |
| **System Alerts** | API health and funnel anomaly alerts with logs and trend mini-charts |

### Charter 1: Onboarding Funnel

| Feature | Description |
|---------|-------------|
| **Snapshot View** | 2×2 funnel grid (MTD vs LMTD, T-1 vs LMSD), KPI strip with Key Drop-off Stages, Open/Closed toggle |
| **Deepdive View** | Tabular MTD breakdown with conv%, delta, status filter (all/red/amber/green) |
| **Stage Detail** | Full investigation workspace: problem statement, L2 bars, L3 errors, 7-day trend, hypothesis cards, action planner, investigation log |
| **Sub-Stage Deep Dive** | Filter by stage/sub-stage, INTRADAY/MTD/LTD tabs, date range, inline trend + lead IDs + API health per sub-stage |
| **Lead Deep Dive** | Search/load any lead ID, view full event timeline with timestamps, Kibana and Lead Assist links |

### Charter 2: Post-Onboarding

| Feature | Description |
|---------|-------------|
| **Portfolio** | MoM metrics table, 6 KPIs, loan status donut, transacting users bar chart |
| **Bill Recon** | Snapshot delta cards, discrepancy table, LAN-level drill-down with multi-select and email escalation |
| **Repayment** | Dues overview, MoM table, DPD bucket chart (clickable → DPD breakdown), paid/partial/unpaid donut, daily repayment trendline, unreconciled LANs investigation |
| **Spends** | Daily success rate trend, UPI error-code table (click → Error Code Detail), GMV/txn MoM charts |
| **Error Code Detail** | Per-code KPIs, 7-day count & SR charts, failure reason breakdown, log table with filters |
| **Customer 360** | Individual LAN profile with header, bill details, repayment log, profile, journey, account details |

### Charter 3: CST / User Pulse

| Feature | Description |
|---------|-------------|
| **User Pulse Overview** | KPI cards, issue category stacked bar, ranked issue table with charter filter, share sort, watchlist, investigation status badges |
| **Issue Detail** | Cohort signal banner, all dimension breakdowns (donut + table), cross-cohort patterns, hypothesis workspace with pre-fills, SOP selector (6 playbooks), investigation log |
| **Pulse Deep Dive** | Filter by Lender/Bot vs Agent/Sub-Issue/Date range, issue table, day-on-day ticket trend, sub-issue L2 breakdown, cohort analysis with 6 built-in cohorts |
| **Custom Cohort Builder** | Create/edit/delete custom cohorts with named segments, color codes, and SQL queries; persisted to localStorage |

---

## 6. Page-by-Page Reference

| File | View ID | Description |
|------|---------|-------------|
| `src/pages/InsightLandingPage.jsx` | `insightLanding` | Homepage — cross-charter summary with KPIs, cards, watchlist, alerts |
| `src/pages/SnapshotView.jsx` | `snapshot` | Funnel snapshot — 2×2 grid, KPI strip, commentary |
| `src/pages/DeepdiveView.jsx` | `deepdive` | Funnel tabular deep dive |
| `src/pages/StageDetailPage.jsx` | `stageDetail` | Stage investigation workspace (R1–R6) |
| `src/pages/SubStageDeepDivePage.jsx` | `subStageDeepDive` | Sub-stage filter & table with inline panels |
| `src/pages/LeadDeepDivePage.jsx` | `leadDeepDive` | Lead-level event timeline |
| `src/pages/DisbursementView.jsx` | `disbursement` | Disbursement KPIs, trends, failures, lender breakdown |
| `src/pages/UserPulseView.jsx` | `userPulse` | Tab container: Overview + Pulse Deep Dive |
| `src/pages/PulseDeepDivePage.jsx` | (inline tab) | Pulse deep dive with filters, trends, cohort analysis |
| `src/pages/IssueDetailPage.jsx` | `issueDetail` | Issue cohort investigation workspace |
| `src/pages/PostOnboardingView.jsx` | `postOnboarding` | Tab container: Portfolio / Bill Recon / Repayment / Spends |
| `src/pages/LANBreakdownPage.jsx` | `lanBreakdown` | LAN-level discrepancy investigation |
| `src/pages/Customer360Page.jsx` | `customer360` | Individual loan account profile |
| `src/pages/ErrorCodeDetailPage.jsx` | `errorCodeDetail` | UPI error code L2 detail |
| `src/pages/DpdBreakdownPage.jsx` | `dpdBreakdown` | DPD mismatch LAN table |
| `src/pages/EmergencyView.jsx` | `emergency` | Cross-pillar RED signal aggregator |
| `src/pages/FunnelOverview.jsx` | (legacy) | Original funnel view — not in sidebar |
| `src/pages/TrendView.jsx` | (legacy) | Original trend view — not in sidebar |

---

## 7. Component Library

| Component | Purpose |
|-----------|---------|
| `VerticalFunnel.jsx` | Horizontal bar funnel visualization with RAG colors and tooltips |
| `KPIStrip.jsx` | 3 KPI cards + Key Drop-off Stages section |
| `DrillDownPanel.jsx` | Slide-in panel for L2/L3/API/trend (legacy, used in some views) |
| `SubStageTable.jsx` | Expandable L2 sub-stage table with API health, errors, DEBUG |
| `StageSummary.jsx` | Auto-generated textual summary from stage data |
| `LogErrorTable.jsx` | L3 error list with counts and trends |
| `ApiHealthCards.jsx` | API success rate / latency / error cards |
| `SelfieErrorBreakdown.jsx` | Selfie liveliness error breakdown |
| `AnnotationInput.jsx` | Annotation modal (trend comments) |
| `RAGBadge.jsx` | Red / Amber / Green status badge |
| `ComparisonTable.jsx` | MTD vs LMTD vs T-1 comparison table |
| `FunnelChart.jsx` | Legacy horizontal bar funnel |
| `IssueOverview.jsx` | User Pulse L1: KPIs, stacked bar, ranked issue table |
| `CohortPanel.jsx` | Cohort dimension dropdown + donut + table |
| `ActionCard.jsx` | Expandable hypothesis/data signal/action card |
| `UserPulseFilters.jsx` | Time window and charter filter pills |
| `postOnboarding/Portfolio.jsx` | Portfolio MoM, KPIs, charts |
| `postOnboarding/BillRecon.jsx` | Bill recon snapshot + delta table |
| `postOnboarding/RepaymentRecon.jsx` | Repayment overview + DPD + trends |
| `postOnboarding/Spends.jsx` | UPI SR, error codes, GMV/txn charts |
| `postOnboarding/LANTable.jsx` | Paginated, sortable, multi-select LAN table |
| `postOnboarding/EmailModal.jsx` | Email preview with LAN attachment |
| `postOnboarding/AnomalyBadge.jsx` | SPIKE / WATCH anomaly badge |

---

## 8. Mock Data Modules

| File | Data Provided |
|------|---------------|
| `funnelMTD.js` | Open funnel MTD data by lender (ALL/SSFB/JANA), 22 stages |
| `funnelClosed.js` | Closed funnel MTD by lender |
| `dailyFunnel.js` | Day-by-day funnel counts (Feb 1–22) + LMSD data |
| `allStages.js` | All L2 sub-stages with parent, category, MTD count, conv%, delta |
| `logErrors.js` | Error codes per sub-stage |
| `apiHealth.js` | Per-stage API health (success rate, latency, error%) |
| `subStageApi.js` | Per sub-stage API health + trend generator |
| `issueCategories.js` | 12 CST issue categories with counts, charter, daily splits |
| `cohortBreakdowns.js` | Per-issue cohort dimension breakdowns (6 dimensions × 12 issues) |
| `actionCards.js` | Pre-built L3 action cards keyed by issue×dimension×segment |
| `portfolio.js` | MoM portfolio metrics, KPIs, loan status, transacting users |
| `billRecon.js` | Recon snapshot, LAN rows, bill gen/daily dues breakdown, DPD LANs, customer360 |
| `repayment.js` | Dues, MoM repayment, DPD buckets, daily trend, unreconciled LANs |
| `spends.js` | Daily SR, error codes, GMV/txn MoM, error code detail data |
| `disbursement.js` | Disbursement KPIs, daily trend, lender breakdown, failure reasons |
| `systemAlerts.js` | API and funnel alerts with logs, trends, and severity |
| `leadEvents.js` | Lead event maps, sample IDs, per sub-stage lead lookup |
| `pulseDeepDive.js` | Bot/agent issues with L2 sub-issues, trend generator, cohort generator, built-in cohort definitions |
| `crossPillarEvents.js` | Cross-pillar correlation event data |

---

## 9. State Management

All state is centralized in `src/context/DashboardContext.jsx` using React Context + `useState` hooks.

### Key State Groups

| Group | State Variables | Purpose |
|-------|----------------|---------|
| Navigation | `activeView`, `previousView` | Current and previous view for back-navigation |
| Funnel | `funnelType`, `selectedMonth`, `selectedLender` | Funnel toggle (open/closed), month picker, lender filter |
| Stage Detail | `drillDownStage` | Which stage is being investigated |
| User Pulse | `pulseTimeWindow`, `charterFilter`, `pulseTab`, `selectedIssue`, `selectedCohort` | Time window, charter, tab (overview/deepdive), active issue/cohort |
| Post-Onboarding | `postOnbTab`, `selectedLanDimension`, `showEmailSection` | Active tab, LAN drill dimension, email modal |
| LAN Drill-Down | `lanBreakdownConfig`, `customer360Lan` | LAN breakdown source config, active LAN for 360 |
| Error Codes | `selectedErrorCode` | Active UPI error code for detail view |
| DPD | `selectedDpdBucket` | Active DPD bucket for breakdown |
| Sub-Stage Dive | `deepDiveStage`, `deepDiveSubStage` | Pre-selected stage/sub-stage |
| Lead Dive | `selectedLeadId` | Active lead ID |

### Navigation Helpers

The context exposes `navigateTo*` and `navigateBackFrom*` functions for each drill-down flow, handling view switching and state cleanup.

---

## 10. LocalStorage Persistence

| Key Pattern | Purpose | Used By |
|-------------|---------|---------|
| `pm_watchlist` | Pinned watch list items (max 6) | InsightLandingPage, IssueOverview |
| `hypothesis_[stage]` | Stage-level hypothesis cards | StageDetailPage |
| `hypothesis_issue_[issueId]` | Issue-level hypothesis cards | IssueDetailPage |
| `action_[stage]` | Next actions for a funnel stage | StageDetailPage |
| `sop_issue_[issueId]` | SOPs for a CST issue | IssueDetailPage |
| `log_[stage]` | Investigation log for a stage | StageDetailPage |
| `log_issue_[issueId]` | Investigation log for an issue | IssueDetailPage |
| `annotations` | Trend chart annotations | DrillDownPanel |
| `lanSentStatus` | Email "Sent" status per LAN | LANTable, EmailModal |
| `lanEscalationSent` | Escalation email status | LANBreakdownPage |
| `pulse_custom_cohorts` | User-defined custom cohort definitions | PulseDeepDivePage |

---

## 11. Commit History & Evolution

| Commit | Description |
|--------|-------------|
| `b04a70d` | **Phase 1 + 2 + 3**: Initial dashboard with Funnel, User Pulse, Post-Onboarding |
| `b61c950` | **MVP Revamp**: Insight Landing, Disbursement, Bill Recon/Repayment overhaul, no-popup design |
| `d649b7d` | System Alerts panel on homepage |
| `a1df102` | UPI Error Code L2 detail page + System Alerts panel |
| `2ffcc39` | Ingestion Alerts sub-tab + DPD LAN drill-down |
| `5300047` | Dashboard feedback: lender filters, engagement features, homepage revamp |
| `7d958b3` | Sub-Stage Deep Dive, Lead Deep Dive, Business Highlights, expanded funnel stages |
| `8fc64cc` | **User Pulse Revamp**: Tab navigation, Pulse Deep Dive, Custom Cohort Builder |

### Design Evolution

1. **v1.0**: Top-nav tabs, horizontal bar funnel, React Router → rejected after PM feedback
2. **v1.1**: Left sidebar, vertical funnel in 2×2 grid, state-based navigation
3. **v2.0**: Insight Landing as homepage, no-popup design, full investigation workspaces
4. **v3.0**: Engagement features (watchlist, RED badges, emergency view), User Pulse revamp with deep dive and custom cohorts

---

## 12. Documentation Files

| File | Contents |
|------|----------|
| `prd.md` | Full Product Requirement Document (659 lines) — context, funnel architecture, all specs, changelog |
| `docs/insight-landing.md` | Insight Landing page spec: layout, lender filter, data sources |
| `docs/funnel.md` | Funnel views spec: Snapshot, Deepdive, Stage Detail, KPI strip |
| `docs/disbursement.md` | Disbursement section spec |
| `docs/user-pulse.md` | User Pulse L1/L2/L3 spec, localStorage keys, component tree |
| `docs/post-onboarding.md` | Post-onboarding sections: Portfolio, Bill Recon, Repayment, Spends |
| `docs/engagement-features.md` | P1–P4 engagement roadmap (watchlist, daily brief, emergency, intelligence) |

---

## 13. How to Run

```bash
# Clone
git clone https://github.com/garvmanchanda-paytm/credit-line-operator-dashboard.git
cd credit-line-operator-dashboard

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173/

# Production build
npm run build

# Preview production build
npm run preview
```

### Requirements

- Node.js >= 18
- npm >= 9

---

## 14. Known Limitations & Next Steps

### Current Limitations

| Area | Limitation |
|------|-----------|
| Data | All mock data — no API integration. Numbers are modeled from Feb 2026 actuals. |
| Auth | No authentication or role-based access |
| URL Routing | Views are state-driven, not URL-driven. Browser back/forward doesn't work. Deep-linking not supported. |
| Custom Cohorts | SQL queries are stored but not executed — mock data is generated deterministically. Real execution requires a query engine backend. |
| Persistence | localStorage only — data is per-browser, not shared across users |
| Mobile | Not optimized for mobile viewports (designed for desktop PM use) |
| Tests | No unit or integration tests |

### Recommended Next Steps

| Priority | Item | Effort |
|----------|------|--------|
| P0 | API integration for funnel data (replace mock imports with fetch calls) | 2–3 weeks |
| P0 | Auth + user identity for shared investigation state | 1 week |
| P1 | URL-based routing (React Router) for deep-linking and browser navigation | 1 week |
| P1 | Backend for custom cohort query execution (SQL → results) | 2 weeks |
| P1 | Real-time data refresh (polling or WebSocket for intraday) | 1 week |
| P2 | Shared investigation workspace (hypotheses, SOPs visible to team) | 2 weeks |
| P2 | Export to PDF/Slack for weekly review sharing | 1 week |
| P3 | Mobile-responsive layout | 1 week |
| P3 | Unit tests for RAG logic and data transforms | 1 week |

---

*Generated: March 2026*
