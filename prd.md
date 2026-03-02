# PRODUCT REQUIREMENT DOCUMENT
## Onboarding Funnel Dashboard
### Paytm Postpaid (TPAP) — Charter 1: Onboarding
**Frontend Prototype Specification with Mock Data for Cursor/IDE**

| Field | Value |
|-------|-------|
| Version | 2.0 — MVP Revamp |
| Author | Garv, PM — Paytm Postpaid |
| Purpose | Cursor/IDE prototype spec — no backend, mock data only |
| Scope | MVP: Insight Landing + Funnel (multi-lender) + Disbursement + User Pulse + Post-Onboarding |
| Date | February 2026 |

### Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 2026 | Initial draft — top-nav with Overview/Trends tabs, horizontal bar funnel, React Router |
| 1.1 | Feb 22 2026 | Structural redesign based on PM feedback: replaced top-nav with left sidebar (Snapshot / Deepdive), replaced horizontal bars with vertical tapered funnel in 2x2 comparison grid, moved Open/Closed toggle to funnel card, removed page-level toggles, moved comparison table into Deepdive view, removed React Router in favour of sidebar state navigation |
| 1.2 | Feb 22 2026 | Stage name alignment: KYC_PINCODE_SERVICEABILITY → KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS. Closed funnel comparison changed from Oct-25 Benchmark to Jan MTD (LMTD) with actual counts. Sub-stage names updated to match real system event names from production mapping. |
| 1.3 | Feb 22 2026 | Phase 2 — User Pulse (CST Dashboard): Added Section 9 with full taxonomy, L1/L2/L3 view specs, mock data, and component tree. Sidebar updated with "CST" section. DashboardContext extended with User Pulse state. 5 new components + 3 new mock data files. |
| 1.4 | Feb 22 2026 | Phase 3 — Post-Onboarding Deep Dive (Charter 2): Added Section 10 with 4 tab-sections (Portfolio, Bill Recon, Repayment, Spends). Sidebar updated with "Post-Onb" section. DashboardContext extended with postOnbTab, selectedLanDimension, showEmailModal. 8 new components + 4 new mock data files. Cross-dashboard deep links to User Pulse. |
| 2.0 | Feb 23 2026 | **MVP Revamp** — Global guidelines applied: (1) Insight Landing Page as unified home; (2) Tapered SVG funnel; (3) Single-lender filtering (ALL/SSFB/HDFC); (4) Disbursement Analysis section; (5) No-pop design — overlays converted to full pages; (6) MD docs per menu in `docs/`; (7) New pages: InsightLandingPage, DisbursementView, StageDetailPage, IssueDetailPage. New mock: disbursement.js. |
| 2.1 | Feb 25 2026 | **Dashboard Feedback Implementation** — (1) Insight Landing: added lender filter (All Lenders/SSFB/JANA), changed KPIs (removed Funnel leads, added Lead-to-Conversion %, Disbursement Value in Cr), renamed "Alerts & Anomalies" → "Quick Deepdive", reordered: Key Metrics → Cards → Quick Deepdive → System Alerts, all sections filter by lender; (2) Funnel Snapshot: lender filter restricted to SSFB/JANA only (no ALL), replaced "Biggest Drop Stage" with "Key Drop-off Stages" (top 3 MTD vs LMTD deviations), funnel visualization redesigned for readability (horizontal bars, alternating rows, hover tooltips, larger fonts); (3) Disbursement: added lender filter, added Key Analysis section (cross-charter choke points from Funnel/Recon/Repayment/User Pulse), page break separating filtered content from always-visible lender-wise breakdown; (4) Lender rename: HDFC → JANA globally across mock data and UI. |
| 2.2 | Feb 25 2026 | **Stage Detail Investigation Workspace** — Transformed StageDetailPage into a PM investigation workspace. (R1) Auto-generated Problem Statement Banner for Red/Amber stages showing drop magnitude, primary driver L2, and daily user impact; (R2) L2 Contribution Bars with horizontal delta-proportional bars and "Primary Driver" badge on worst L2; (R3) Auto-Surfaced L3 panel for worst L2 (delta < -0.3pp) split into System Issues vs User Behavior Issues with impact chain labels; (R4) Hypothesis Workspace with structured cards (root cause dropdown, confidence radio, evidence multi-select auto-populated from page data, status tracking) persisted to localStorage; (R5) Next Action Planner replacing AnnotationBox with structured form (action type, owner, target date, ticket link, notes) persisted to localStorage; (R6) Investigation Log — collapsible reverse-chronological timeline of all hypothesis and action entries. |
| 2.3 | Feb 25 2026 | **Issue Detail — Cohort PM Workspace** — Transformed IssueDetailPage into a structured PM investigation workspace for behavioural signals. (R1) Cohort Signal Summary Banner auto-scans all dimensions for segments with delta > 2pp, groups repeating insightTrigger themes, and renders a contextual alert with key segments and suggested starting hypothesis; (R2) Cross-Cohort Pattern Panel shows ranked segments elevated across multiple dimensions with combined signal strength badge (Strong/Moderate/Weak); (R3) Hypothesis Workspace with pre-fills — new hypotheses auto-populate root cause category, detail, target segment, and evidence from cohort signals, with "Suggested from N cohort signals" badge; (R4) SOP Selector replaces generic Next Action Planner — 6 predefined response playbooks (Communication fix, Product/UX change, Pricing review, Ops intervention, Monitor, Escalate to leadership) with fillable templates (affected segment, proposed action, owner, target date, success metric); (R5) Investigation Log persisted under `log_issue_[issueId]` with reverse-chronological timeline of hypothesis saves and SOP saves. |
| 2.4 | Feb 25 2026 | **Repayment & User Pulse Feedback** — (1) Repayment Snapshot: replaced empty "Quick Filters" with "Repayment Timeline" showing day-on-day trendline chart (22 data points); Unreconciled Repayments card now clickable → opens full-page LAN-level investigation table with status badges, email escalation; added `dailyRepaymentTrend` and `unreconciledLANs` mock data to `repayment.js`. (2) User Pulse IssueOverview table: added charter filter dropdown (All/Onboarding/Post-Onboarding) on Charter column header; added sortable % Share column (cycles ↕/↓/↑); removed 7-Day sparkline column; Delta column now shows MTD vs LMTD percentage difference. |
| 3.0 | Feb 25 2026 | **Engagement & Intelligence Roadmap (P1–P4)** — (P1) Daily Hooks: sidebar RED badges per section, T-1 delta on homepage KPIs, alert→investigation routing with CTA; (P2) Memory: Watch List (bookmark + pinned strip, max 6, localStorage), Issue Resolution Status badges on User Pulse table, Daily Brief section ("Today vs Yesterday"); (P3) Pressure: WoW toggle on time filters, Hypothesis Metrics Strip (Open/Confirmed/Resolved counts), Emergency View (all RED signals cross-pillar); (P4) Intelligence: Correlation Timeline (cross-pillar event axis), Cross-Pillar Hypothesis (evidence from any pillar). |

---

## 1. Context & Problem Statement

Today, the onboarding funnel for Paytm Postpaid is tracked entirely in Excel. PMs and leadership pull data into multi-tab workbooks — one for the open funnel (MTD vs. LMTD), one for the closed funnel, one for all sub-stages, and additional tabs for deep-dive analysis. This process has three compounding problems:

- **Context-switching cost**: Switching between tabs, interpreting percentage columns, and mentally converting numbers into trends creates high cognitive load, especially in weekly reviews or when an incident is live.
- **Latency in anomaly detection**: A stage drop that happens on Day 12 of the month may only surface in the weekly review, losing 2–3 days of investigation time.
- **No layered drill-down**: Going from 'overall funnel is down' → 'which stage' → 'which sub-stage' → 'what error' currently requires manual tab-hopping, Kibana queries, and Slack threads.

The goal of this dashboard is to replace that Excel workflow with a purpose-built, PM-grade interface that gives L1 (North Star) visibility at a glance, allows L2 (stage-level) drill-down in one click, and surfaces L3 (error/log) signals without requiring a Kibana query.

---

## 2. Funnel Architecture — What We're Measuring

The onboarding funnel has two variants: **Open Funnel** (users can enter on any day during the month — MTD view) and **Closed Funnel** (cohort of users who entered on the same day — tracks end-to-end conversion for a single day's cohort). The dashboard must support both.

### 2.1 Open Funnel — L1 Stage Map

| # | Stage Name | Display Label | Feb MTD (mock) | Conversion | Jan MTD (LMTD) |
|---|-----------|---------------|----------------|------------|-----------------|
| 1 | APPLICATION_LOADED | App Loaded | 5,871,842 | — | 7,630,557 |
| 2 | BASIC_DETAILS_CAPTURED | Basic Details | 2,270,601 | 38.7% | 3,151,670 |
| 3 | BUREAU_IN_PROGRESS | Bureau Check | 2,020,328 | 88.9% | 2,801,195 |
| 4 | BRE_COMPLETED | BRE Complete | 692,424 | 34.3% | 977,169 |
| 5 | SELFIE_CAPTURED | Selfie Done | 496,238 | 71.7% | 692,489 |
| 6 | KYC_VALIDATION_SUCCESS | KYC Pass | 337,864 | 68.1% | 471,891 |
| 7 | KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS | Pincode OK | 167,985 | 49.7% | 247,399 |
| 8 | LENDER_BRE_APPROVE_SUCCESS | Lender BRE OK | 123,429 | 73.5% | 150,069 |
| 9 | LENDER_PENNY_DROP_SUCCESS | Penny Drop OK | 48,125 | 39.0% | 62,700 |
| 10 | MANDATE_SUCCESS | Mandate Done | 84,445 | 88.4%* | 101,457 |
| 11 | REVIEW_OFFER_ACCEPTED | Offer Accepted | 72,918 | 86.3% | 87,073 |
| 12 | ESIGN_SUCCESS | eSign Done | 61,254 | 84.0% | 72,713 |
| 13 | LEAD_SUCCESSFULLY_CLOSED | Onboarding Complete | 61,029 | ~99% | 72,162 |

> *Mandate conversion >100% is an artefact of carry-forward mandates from prior days in MTD view — expected in open funnel.*

### 2.2 Closed Funnel — Stage Map

| # | Stage | Display Label | Feb MTD | Conversion | Jan MTD (LMTD) |
|---|-------|---------------|---------|------------|----------------|
| 1 | BASIC_DETAILS_CAPTURED | Started | 884,533 | — | 1,021,000 |
| 2 | BRE_REQUESTED | Bureau Pass | 787,324 | 89.0% | 875,800 |
| 3 | BRE_COMPLETED | BRE Done | 268,654 | 34.1% | 464,800 |
| 4 | SELFIE_REQUIRED | Selfie Step | 268,622 | ~100% | 268,600 |
| 5 | SELFIE_CAPTURED | Selfie Done | 181,815 | 67.7% | 203,300 |
| 6 | KYC_VALIDATION_SUCCESS | KYC Pass | 120,635 | 66.4% | 132,600 |
| 7 | KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS | Pincode OK | 59,437 | 49.3% | 47,000 |
| 8 | LENDER_BRE_APPROVE_SUCCESS | Lender BRE OK | 43,671 | 73.5% | 46,300 |
| 9 | LENDER_PENNY_DROP_SUCCESS | Penny Drop OK | 32,369 | 74.1% | 35,400 |
| 10 | MANDATE_SUCCESS | Mandate Done | 24,555 | 75.9% | 23,900 |
| 11 | REVIEW_OFFER_ACCEPTED | Offer Accepted | 22,052 | 89.8% | 22,300 |
| 12 | ESIGN_SUCCESS | eSign Done | 18,635 | 84.5% | 19,200 |
| 13 | LEAD_SUCCESSFULLY_CLOSED | Onboarding Complete | 18,485 | 99.2% | 18,400 |
| 14 | CREDIT_LINE_LINKED | Limit Activated | 8,501 | 46.0% | 22,900 |

### 2.3 L2 Sub-Stage Categories (for L2 Drill-Down View)

| Category | Parent L1 Stage | Key Sub-Stages (real event names) |
|----------|----------------|-----------------------------------|
| BASIC DETAILS | BASIC_DETAILS_CAPTURED | PAN_PREFILL, EMAIL_PREFILL, BUREAU_SKIPPED_CIR_OFFER |
| BUREAU | BUREAU_IN_PROGRESS | BUREAU_SUCCESS, BUREAU_FAILED, BUREAU_ALTERNATE_MOBILE_NUMBER_REQUIRED, BUREAU_ADDITIONAL_DATA_REQUIRED, BUREAU_OTP_REQUIRED, BUREAU_REQUEST_FAILED |
| BRE | BRE_COMPLETED | BRE_REQUESTED, BRE_COMPLETED, BRE_REQUEST_FAILED, BRE_COMPLETED_ALREADY_OFFER_EXIST, LENDER_PAN_VALIDATION_FAILED |
| SELFIE | SELFIE_CAPTURED | SELFIE_REQUIRED, SELFIE_CAPTURED, RE_UPLOAD_SELFIE, SELFIE_UPLOAD_SUCCESS, LIVELINESS_FAILURE |
| DEDUPE & KYC | KYC_VALIDATION_SUCCESS | LENDER_RETAIL_DEDUPE_SUCCESS, LENDER_RETAIL_DEDUPE_FAILED, INITIATE_KYC_VALIDATION_FAILED, KYC_VALIDATION_SUCCESS, POST_KYC_ACTION_INITIATED, POST_KYC_ACTION_FAILED, LENDER_AADHAAR_PAN_LINK_FAILED, LENDER_NAME_SIMILARITY_CHECK_SUCCESS, LENDER_NAME_SIMILARITY_CHECK_FAILED, LENDER_FACE_SIMILARITY_CHECK_SUCCESS, LENDER_FACE_SIMILARITY_CHECK_FAILED, KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS, KYC_PINCODE_SERVICEABILITY_CHECK_FAILED |
| LENDER BRE | LENDER_BRE_APPROVE_SUCCESS | LENDER_BRE_INITIATED, LENDER_BRE_SUCCESS, LENDER_BRE_APPROVE_SUCCESS, LENDER_BRE_APPROVE_FAILED, LENDER_BRE_FAILURE, CREDIT_LINE_OFFER_ACCEPTED, LENDER_BRE_LEAD_CREATION_POLLING_FAILURE |
| PENNY DROP | LENDER_PENNY_DROP_SUCCESS | LENDER_PENNY_DROP_SUCCESS, BANK_VERIFICATION_FAILED, LENDER_KYC_NAME_MATCH_CHECK_FAILED, EMANDATE_REQUIRED, LENDER_NSDL_NAME_MATCH_CHECK_FAILED, MAQUETTE_FRAUD_CHECK_FAILED |
| MANDATE | MANDATE_SUCCESS | MANDATE_SUCCESS, KFS_VIEWED, DEVICE_BINDING_CHECK_PASSED, DEVICE_BINDING_FAILED |
| ESIGN | ESIGN_SUCCESS | ESIGN_REQUIRED, ESIGN_SUCCESS, ESIGN_FAILED, POST_ESIGN_ACTION_IN_PROGRESS, POST_ESIGN_ACTION_FAILED |
| LENDER LAN CREATION | LEAD_SUCCESSFULLY_CLOSED | LENDER_CUSTOMER_CREATION_SUCCESS, LENDER_CUSTOMER_CREATION_FAILED, LENDER_CUSTOMER_MODIFICATION_SUCCESS, LENDER_CUSTOMER_MODIFICATION_FAILED, LENDER_LAN_CREATION_SUCCESS, LENDER_LAN_CREATION_FAILED |
| LMS | LEAD_SUCCESSFULLY_CLOSED | LMS_LAM_ACCOUNT_CREATION_SUCCESS, LMS_LAM_ACCOUNT_CREATION_FAILED, LMS_ONBOARDING_COMPLETED, CREDIT_LINE_LINKED, MPIN_SET, LINK_FAILURE |

---

## 3. Dashboard Views — Full Specification

The dashboard uses a **left sidebar** for navigation between two primary views: **Snapshot** and **Deepdive**. A slim top header shows the dashboard title and a month picker. There are no page-level toggles — the Open/Closed funnel toggle lives on the funnel card itself within each view.

### 3.1 Snapshot (Landing View)

This is the landing screen. It must answer: *'Is the funnel healthy this month, and which stages need attention?'* in under 10 seconds.

#### 3.1.1 Funnel Health Summary

Three RAG-badged commentary lines at the top of the page providing an instant executive summary:
- **Red line**: Volume pressure indicator (e.g., "App loads at 5.87M MTD, down 23% vs Jan")
- **Amber line**: Biggest bottleneck callout (e.g., "BRE Complete at 34.3% step conversion — needs investigation")
- **Green line**: Positive signal (e.g., "Leads closed at 61K, eSign and mandate stages tracking healthy")

#### 3.1.2 KPI Strip — Key Metrics

3 metric cards + 1 Key Drop-off section:

| KPI Card | Primary Value | Comparison | RAG Logic |
|----------|--------------|------------|-----------|
| Landing Page Views (MTD) / Started (MTD) | 5,871,842 | vs Jan: −23.1% | Red if >5% drop MoM; Amber if 2–5% |
| Overall Conversion (App Load → Closed) | 1.04% | vs Jan: 0.95% | Green if improving; Red if drops >10 bps |
| Leads Closed (MTD) | 61,029 | vs Jan: −15.5% | Red if >10% drop MoM |

**Key Drop-off Stages** (separate card below metrics):
Shows the top 3 stages with highest negative deviation (MTD step conversion − LMTD step conversion). Each entry shows stage name, MTD conv vs LMTD conv, and delta in pp (color-coded). Replaces the previous single "Biggest Drop Stage" card.

#### 3.1.3 2x2 Funnel Comparison Grid

A four-panel grid showing funnel visualisations. Each funnel uses horizontal gradient bars with proportional widths (widest at top, narrowing toward bottom), alternating row backgrounds, and hover tooltips for improved readability. Bars are RAG-color-coded and show count + step conversion % + delta vs comparison. An **Open Funnel / Closed Funnel** toggle sits on the funnel card header. On the Snapshot page, only SSFB and JANA lenders are selectable (no ALL).

| Position | Funnel | Description |
|----------|--------|-------------|
| Top-left | **Feb MTD** | Current month-to-date funnel, compared against LMTD |
| Top-right | **Jan MTD (LMTD)** | Last month same-period reference funnel |
| Bottom-left | **T-1 (Yesterday)** | Yesterday's daily funnel, compared against LMSD |
| Bottom-right | **LMSD** | Last month same-day reference funnel |

Clicking any stage bar in any of the four funnels opens the Drill-Down Panel (Section 3.3).

### 3.2 Deepdive

The investigation screen for PMs who need the full tabular breakdown with click-to-drill-down.

#### 3.2.1 Tabular MTD Funnel with LMTD Comparison

A full-width table with an **Open Funnel / Closed Funnel** toggle on the card header. Columns:

| Column | Description |
|--------|-------------|
| # | Stage sequence number |
| Stage | Display label + technical stage name (shown on wider screens) |
| Feb MTD | Absolute count for current month |
| Step Conv% | Step-over-step conversion, RAG-colored |
| Overall % | Cumulative conversion from funnel entry |
| Jan MTD (LMTD) | LMTD count for both open and closed funnels |
| LMTD Conv% | Comparison period step conversion |
| Delta | Difference in pp, color-coded. Bold if absolute delta > 2pp |
| T-1 Count | Yesterday's count for that stage |
| RAG | Red/Amber/Green badge |

Clicking any row opens the Drill-Down Panel (Section 3.3) for that stage.

### 3.3 Stage Detail — Investigation Workspace (Full Page)

Reached by clicking any stage in the Snapshot funnels or the Deepdive table. Opens as a full page (no popup). Design principle: PM arrives, understands the problem, drills to root cause, logs a hypothesis, and exits with an assigned action.

#### 3.3.1 Breadcrumb + Stage Header

Shows: Dashboard / Funnel / [Stage Name]. Stage header displays MTD count, current conversion rate, and a RAG badge.

#### 3.3.2 Problem Statement Banner (R1)

Auto-generated one-line problem statement when stage RAG is Red or Amber. Format: "[Stage] dropped X.Xpp vs LMTD. Primary driver: [worst L2 by delta]. ~N users/day affected." Impact estimate = MTD count x |delta| / 100 / 22. Hidden for Green stages.

#### 3.3.3 Auto-Generated Summary

Four insight lines covering: 7-day trend direction, top L2 contributor, API health status, and L3 error trends.

#### 3.3.4 7-Day Mini Trend

A line chart showing the stage's daily conversion rate for the last 7 days.

#### 3.3.5 L2 Contribution Bars (R2)

Horizontal delta-proportional bars for each L2 sub-stage. Red bars for negative delta, green for positive. The worst negative-delta L2 is highlighted with a "Primary Driver" badge and border. Columns: Sub-Stage, MTD Count, MTD%, LMTD%, Delta.

#### 3.3.6 L2 Sub-Stage Table

Expandable rows with API health and L3 errors inside each expand. For SELFIE_CAPTURED stage, includes Liveliness Error Breakdown.

#### 3.3.7 Auto-Surfaced L3 Panel (R3)

When any L2 has delta worse than -0.3pp, the worst L2's L3 errors are auto-expanded. Errors split into "System Issues" (API timeout, 5xx, rate limit) and "User Behavior Issues" (selfie unclear, etc.). Each error shows an impact chain label: "This error contributes X% to [L2] failures."

#### 3.3.8 Hypothesis Workspace (R4)

PM can create multiple competing hypothesis cards. Each card has: root cause category (dropdown: API Degradation / User Behavior / Config Change / External Factor / Data Issue), detail text, confidence (High/Medium/Low), evidence (multi-select checklist auto-populated from L2 deltas, L3 error trends, and API health flags), and status (Draft / Under Investigation / Confirmed / Ruled Out). Persisted to localStorage under `hypothesis_[stage]`.

#### 3.3.9 Next Action Planner (R5)

Replaces the old Annotation Box. Structured form with: Action type (Raise Eng ticket / Product/UX change / Ops investigation / Monitor / Escalate), Owner, Target date, Ticket link, Notes. Persisted to localStorage under `action_[stage]`. Each save appends to the Investigation Log.

#### 3.3.10 Investigation Log (R6)

Collapsible reverse-chronological timeline at the bottom. Shows all hypothesis saves (with status) and action saves with type badge, summary, and timestamp. Persisted in localStorage under `log_[stage]`.

---

## 4. Mock Data Specification

| Object Name | Type | Description |
|-------------|------|-------------|
| funnelMTD | Array\<StageData\> | Open funnel MTD for Feb-26. Fields: stage, displayLabel, count, conversionRate, lmtdCount, lmtdConvRate |
| funnelClosed | Array\<StageData\> | Closed funnel MTD. Starts from BASIC_DETAILS_CAPTURED. Fields: stage, displayLabel, count, conversionRate, lmtdCount, lmtdConvRate (Jan MTD) |
| dailyFunnel | Array\<DailyData\> | Daily counts for each stage Feb 1–22. Nested: date → stage → count + conversion |
| allStages | Array\<SubStage\> | All L2 sub-stages with parent L1 stage, category, MTD count, conversion, and LMTD delta |
| logErrors | Array\<LogEntry\> | Mock error logs per stage: errorCode, description, count, pctOfFailures, trendVsYesterday |
| apiHealth | Object | Per-stage API health: successRate, p50Latency, p95Latency, error4xxRate, error5xxRate |

### 4.2 Key Mock Data Values

| Stage | Feb 20 | Feb 19 | Feb 18 | Feb 17 | Feb 16 | Feb 15 |
|-------|--------|--------|--------|--------|--------|--------|
| App Loaded | 211,087 | 375,834 | 380,134 | 401,496 | 385,446 | 347,504 |
| Basic Details | 89,872 | 97,401 | 101,993 | 110,991 | 108,565 | 92,530 |
| Bureau Check | 78,955 | 86,175 | 90,551 | 98,874 | 97,539 | 82,578 |
| BRE Complete | 28,328 | 29,977 | 31,031 | 33,190 | 32,212 | 28,615 |
| Selfie Done | 20,385 | 21,981 | 22,157 | 24,270 | 23,564 | 21,151 |
| KYC Pass | 13,800 | 14,799 | 14,998 | 16,094 | 15,830 | 14,614 |
| Lender BRE OK | 5,135 | 5,445 | 5,523 | 5,762 | 5,380 | 5,165 |
| Penny Drop OK | 2,025 | 2,147 | 2,179 | 2,217 | 2,050 | 2,130 |
| Mandate Done | 3,436 | 3,810 | 3,836 | 4,019 | 3,714 | 3,482 |

---

## 5. UX Design Principles

### 5.1 Zero Mental Effort on Landing
Red = action needed. Amber = watch. Green = healthy. PM should know funnel status in 10 seconds.

### 5.2 One Click to Root Cause
Clicking a Red stage shows: (a) which sub-stages contribute, (b) 7-day trend, (c) error codes — all in a right-side panel, not a new page.

### 5.3 Comparisons, Not Just Absolutes
Every metric shows its comparison: MTD vs LMTD, or T−1 vs LMSD.

### 5.4 Selfie & Liveliness Errors — Specific Sub-View

| # | Error Message | Feb MTD Count | % of Failures | vs LMSD |
|---|--------------|---------------|---------------|---------|
| 1 | "Your selfie is not clear." | 25,484 | 57.3% | → stable |
| 2 | "Please keep your eyes open and capture the selfie" | 11,873 | 26.7% | ▲ +5pp |
| 3 | "Please ensure there's no one else in the background" | 2,422 | 5.4% | → stable |
| 4 | "Please move closer to the camera" | 821 | 1.8% | ▼ −1pp |
| 5 | "Please remove your mask" | 218 | 0.5% | → stable |
| 6 | Rate limit exceeded (API) | 8 | 0.02% | ▲ ALERT |

### 5.5 Don't Overload L3
Show pre-aggregated, ranked error summaries — not raw logs.

### 5.6 Annotation Layer
PMs can annotate anomalies inline. Stored in localStorage (Phase 1).

---

## 6. Technical Specification

### 6.1 Technology Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | React 18 (Vite) | Fast dev server, component-based |
| Charts | Recharts | Used for mini-trend in drill-down panel. Funnel charts are custom CSS. |
| Styling | Tailwind CSS | Utility-first, responsive breakpoints |
| State | React useState / useContext | DashboardContext manages activeView, funnelType, selectedMonth, drillDownStage, pulseTimeWindow, charterFilter, selectedIssue, selectedCohort, postOnbTab, selectedLanDimension, showEmailModal |
| Data | Hardcoded .js data files | 16 mock data modules in `src/mockData/` (6 funnel + 3 User Pulse + 4 Post-Onboarding + disbursement + systemAlerts + errorCodeDetails in spends) |
| Navigation | Sidebar state (no routing) | `activeView` in context switches between Snapshot, Deepdive, User Pulse, and Post-Onboarding. `react-router-dom` still a dependency but unused. |

### 6.2 Component Structure (Current)

```
src/
  main.jsx                          # React root (no BrowserRouter)
  App.jsx                           # Sidebar (Funnel + CST + Post-Onb) + TopHeader + MainContent shell
  index.css                         # Tailwind directives + scrollbar styles
  context/
    DashboardContext.jsx             # activeView, funnelType, selectedMonth, drillDown + User Pulse + Post-Onb state
  pages/
    SnapshotView.jsx                # Landing: commentary + KPI strip + 2x2 funnel grid
    DeepdiveView.jsx                # Tabular MTD funnel with LMTD comparison
    UserPulseView.jsx               # [Phase 2] User Pulse parent: filters + IssueOverview + CohortPanel
    PostOnboardingView.jsx          # [Phase 3] Post-Onboarding parent: sub-tab bar + 4 sections
    InsightLandingPage.jsx          # Unified home: lender filter + 5 KPIs + section cards + Quick Deepdive + System Alerts
    DisbursementView.jsx            # Disbursement analysis: lender filter + KPIs + trend + Key Analysis + failure + lender breakdown
    StageDetailPage.jsx             # Full-page L2 drill-down for funnel stages
    IssueDetailPage.jsx             # Cohort PM Workspace — signal banner, cross-cohort patterns, hypothesis workspace with pre-fills, SOP selector, investigation log
    LANBreakdownPage.jsx            # Full-page LAN-level breakdown for Bill Recon mismatches
    Customer360Page.jsx             # Full-page customer 360 detail view
    ErrorCodeDetailPage.jsx         # Full-page L2 drill-down for UPI error codes
    DpdBreakdownPage.jsx            # Full-page DPD LAN-level discrepancy breakdown
    FunnelOverview.jsx              # (legacy) Original horizontal bar overview
    TrendView.jsx                   # (legacy) Multi-line trend chart with annotations
  components/
    VerticalFunnel.jsx              # Horizontal bar funnel with hover tooltips for 2x2 grid
    KPIStrip.jsx                    # 3 KPI cards + Key Drop-off Stages section with RAG badges
    DrillDownPanel.jsx              # Slide-in right panel (L2 + L3 + API health + trend)
    SubStageTable.jsx               # L2 sub-stage table with status badges
    StageSummary.jsx                # Auto-generated insights for L1 stage health
    LogErrorTable.jsx               # L3 ranked error summary table
    ApiHealthCards.jsx              # 3-card API health mini-view
    SelfieErrorBreakdown.jsx        # Selfie liveliness error breakdown
    AnnotationInput.jsx             # localStorage-backed annotation modal
    RAGBadge.jsx                    # Reusable Red/Amber/Green badge
    ComparisonTable.jsx             # (legacy) MTD vs LMTD vs T-1 table
    FunnelChart.jsx                 # (legacy) Horizontal bar funnel chart
    IssueOverview.jsx               # [Phase 2] L1: KPI strip + stacked bar + ranked issue table
    CohortPanel.jsx                 # [Phase 2] L2: slide-in panel, cohort dimension dropdown, donut, table
    ActionCard.jsx                  # [Phase 2] L3: expandable card with hypothesis + actions
    UserPulseFilters.jsx            # [Phase 2] Time range + charter filter pills
    postOnboarding/
      Portfolio.jsx                 # [Phase 3] MoM table + 6 KPIs + loan status donut + txn users bar
      BillRecon.jsx                 # [Phase 3] L1 snapshot + L2 delta focus + L3 LAN table integration
      RepaymentRecon.jsx            # [Phase 3] Dues panels + MoM repayment + DPD + paid/partial/unpaid donut
      Spends.jsx                    # [Phase 3] SR line chart + error code table + GMV/Txn MoM charts
      LANTable.jsx                  # [Phase 3] Sortable, paginated, multi-select LAN table + floating action bar
      EmailModal.jsx                # [Phase 3] Pre-filled email preview with LAN data + localStorage sent status
      AnomalyBadge.jsx              # [Phase 3] Reusable spike/watch badge (value vs rolling avg)
  mockData/
    funnelMTD.js                    # Open funnel Feb-26 MTD (13 stages)
    funnelClosed.js                 # Closed funnel Feb-26 MTD (14 stages)
    dailyFunnel.js                  # Day-by-day counts Feb 1-22 + LMSD data
    allStages.js                    # All L2 sub-stages with categories
    logErrors.js                    # Mock error codes per stage (keyed by sub-stage)
    apiHealth.js                    # Per-stage API health mock
    subStageApi.js                  # Per sub-stage API health + daily trends
    issueCategories.js              # [Phase 2] 12 CST issue rows with daily counts + charter tags
    cohortBreakdowns.js             # [Phase 2] Per-issue cohort dimension data (segments + deltas)
    actionCards.js                  # [Phase 2] 10 pre-built L3 action cards with hypothesis + actions
    portfolio.js                    # [Phase 3] MoM metrics, KPIs, loan status, transacting user breakdown
    billRecon.js                    # [Phase 3] Recon snapshot dimensions + LAN-level delta rows
    repayment.js                    # [Phase 3] Dues, MoM repayment, DPD buckets, paid/partial/unpaid
    spends.js                       # [Phase 3] Daily SR, error codes, MoM GMV/txn count, errorCodeDetails for L2 pages
    disbursement.js                 # Disbursement KPIs, daily trend, lender breakdown, failure reasons
    systemAlerts.js                 # Live API & funnel alerts with logs, trends, and impact data
  utils/
    rag.js                          # RAG threshold functions, formatNumber, formatDelta
```

### 6.3 RAG Thresholds

| Metric | Green | Amber | Red |
|--------|-------|-------|-----|
| Stage conversion vs LMTD | < -0.5pp change | -0.5pp to -2pp | > -2pp drop |
| Daily count vs LMSD | < -5% change | -5% to -15% | > -15% drop |
| Sub-stage failure rate vs historical | < 1.2x average | 1.2x-1.5x | > 1.5x |
| API 5xx rate | < 0.1% | 0.1%-0.5% | > 0.5% |

---

## 7. Phased Delivery & Progress

### Phase 1 — Cursor Prototype (Weeks 1-3)

Working React prototype with mock data seeded from Feb-26 and Jan-26 Excel sheets.

#### Completed

- [x] Project scaffold: Vite + React 18 + Tailwind CSS + Recharts
- [x] All 6 mock data files with exact PRD values (funnelMTD, funnelClosed, dailyFunnel, allStages, logErrors, apiHealth)
- [x] Left sidebar navigation (Snapshot / Deepdive)
- [x] Slim top header with month picker
- [x] DashboardContext with activeView, funnelType, selectedMonth, drillDownStage
- [x] **Snapshot view**: 3-line RAG commentary + 4 KPI cards + 2x2 vertical funnel grid
- [x] **Deepdive view**: Full tabular MTD funnel with LMTD comparison, Open/Closed toggle, click-to-drill-down
- [x] **Vertical funnel component**: Horizontal gradient bars with alternating rows, hover tooltips, RAG-colored, proportional widths, conversion labels + deltas
- [x] **Drill-Down Panel**: Slide-in from right with breadcrumb, 7-day mini trend, API health cards, L2 sub-stage table, L3 error summary, annotation box
- [x] **Selfie error breakdown**: Special liveliness error sub-view with ranked bars and DoD trends
- [x] RAG badge component + threshold utility functions
- [x] Annotation input (localStorage-backed)
- [x] Mobile-responsive layout (Tailwind breakpoints)
- [x] Open/Closed funnel toggle on funnel cards (not top-level)

#### Legacy (built but not in main navigation)

These components were built in the initial iteration and remain in the codebase for potential reuse:

- `pages/TrendView.jsx` — Multi-line trend chart with stage selector, metric toggle, LMSD overlay, clickable data points, annotation markers
- `pages/FunnelOverview.jsx` — Original landing page with horizontal bar funnel + comparison table
- `components/FunnelChart.jsx` — Horizontal bar funnel chart with LMTD overlay
- `components/ComparisonTable.jsx` — MTD vs LMTD vs T-1 side-by-side table

#### Remaining (Phase 1)

- [ ] Day Heat Map (optional enhancement): grid where rows = stages, columns = days, cell color = conversion relative to monthly average
- [ ] Re-integrate Trends view into sidebar as a third nav item (if requested)

### Phase 2 — User Pulse (CST Dashboard) Prototype

User Pulse dashboard added as a new top-level section in the sidebar, providing L1/L2/L3 drill-down for customer support tickets.

#### Completed

- [x] 3 mock data files: issueCategories.js, cohortBreakdowns.js, actionCards.js
- [x] DashboardContext extended: pulseTimeWindow, charterFilter, selectedIssue, selectedCohort + open/close functions
- [x] Sidebar updated: "Funnel" section (Snapshot, Deepdive) + separator + "CST" section (User Pulse)
- [x] Dynamic header title: switches between "Onboarding Funnel Dashboard" and "User Pulse — CST Dashboard"
- [x] UserPulseFilters.jsx: Time period toggle (T-1 / 7d / 15d / 30d) + Charter filter (All / Onboarding / Post-Onboarding)
- [x] IssueOverview.jsx (L1): 4 KPI cards + stacked bar chart + ranked issue table with sparklines + RAG badges
- [x] CohortPanel.jsx (L2): Slide-in panel with cohort dimension dropdown, donut chart, breakdown table with insight triggers
- [x] ActionCard.jsx (L3): Expandable card with hypothesis, data signal, recommended actions (tagged), owner, priority badge
- [x] UserPulseView.jsx: Parent container wiring filters + IssueOverview + CohortPanel

#### Remaining (Phase 2)

- [ ] Backend integration: Wire to actual Hive/Starburst queries — replace mock data objects with API calls
- [ ] Automated daily data refresh at 6 AM
- [ ] Anomaly detection: +/-1.5 sigma threshold alerts via Slack for any stage turning Red
- [ ] Annotation persistence to a lightweight database (Postgres / Firestore)
- [ ] Heat map view (day x stage) for leadership weekly review

### Phase 3 — Post-Onboarding Deep Dive (Charter 2) Prototype

Post-Onboarding dashboard added as a third top-level section in the sidebar with 4 sub-tabs and cross-dashboard deep links.

#### Completed

- [x] 4 mock data files: portfolio.js, billRecon.js, repayment.js, spends.js
- [x] DashboardContext extended: postOnbTab, selectedLanDimension, showEmailModal
- [x] Sidebar updated: "Post-Onb" section with Post-Onboarding nav item
- [x] Dynamic header: "Post-Onboarding — Deep Dive" with subtitle
- [x] PostOnboardingView.jsx: Parent with horizontal sub-tab bar (Portfolio / Bill Recon / Repayment / Spends)
- [x] Portfolio.jsx: MoM table (current month highlighted), 6 KPI cards with RAG badges, loan status donut, transacting users stacked bar (Repeat/New/Reactivated)
- [x] BillRecon.jsx: L1 snapshot card grid (SSFB vs LMS), L2 delta focus table, L3 LAN table integration
- [x] LANTable.jsx: Sortable, paginated, multi-select table with floating action bar
- [x] EmailModal.jsx: Pre-filled email preview with LAN data, localStorage-backed "Sent" status
- [x] RepaymentRecon.jsx: Dues snapshot cards, MoM repayment table with overpay cross-link, DPD distribution with reconciliation alerts, paid/partial/unpaid donut
- [x] Spends.jsx: SR line chart with anomaly shading (red zones), error code table with spike badges, GMV + Txn count MoM dual charts
- [x] AnomalyBadge.jsx: Reusable SPIKE/WATCH badge
- [x] Cross-dashboard deep links: Frozen -> DPD, VKYC -> User Pulse, Overpay -> User Pulse Surplus Refund, SR drop -> User Pulse Txn Failed

#### Remaining (Backend Integration)

- [ ] Wire to Starburst / Hive for live Bill Recon data
- [ ] LAN table wired to real Paytm LMS and SSFB LAN join query
- [ ] Email action wired to actual SSFB ops email via SendGrid
- [ ] Daily auto-refresh at 7 AM for all sections
- [ ] Real-time SR chart via polling

### Phase 4 — AI Layer (Weeks 9-16)

- L3 auto-RCA: LLM-generated summary of likely root cause when stage goes Red
- Correlation engine: links CST ticket spikes to funnel stage drops
- Natural language query: PM types "why did selfie drop on Feb 19?" and gets a structured answer
- AI-generated DPD narrative
- Predictive repayment flagging

---

---

## 9. User Pulse — CST Dashboard (Phase 2)

### 9.1 Context

The User Pulse dashboard surfaces customer support ticket (CST) patterns, enabling PMs to move from "ticket volume is high" to "here's exactly which cohort is impacted and what to do about it." It covers both Onboarding (Charter 1) and Post-Onboarding (Charter 3) support issues.

### 9.2 Issue Taxonomy

| # | Category | Sub-Category | Charter | MTD Count (mock) | % Share |
|---|----------|-------------|---------|-----------------|---------|
| 1 | Onboarding & Eligibility | How to Apply / Eligibility queries | Onboarding | 68,882 | 25.5% |
| 2 | Onboarding & Eligibility | Application Rejection — LEAD_REJECTED | Onboarding | 63,828 | 23.6% |
| 3 | Others | Others (unclassified) | Both | 45,899 | 17.0% |
| 4 | Account Related | Credit on UPI Activation pending | Post-Onboarding | 33,802 | 12.5% |
| 5 | Account Management | Deactivation Request | Post-Onboarding | 6,698 | 2.5% |
| 6 | Charges & Interest | Charges & Interest Info queries | Post-Onboarding | 18,340 | 6.8% |
| 7 | Account Related | Surplus Refund / Excess Amount Paid | Post-Onboarding | 8,920 | 3.3% |
| 8 | Account Related | Txn Failed — Amount Deducted | Post-Onboarding | 7,450 | 2.8% |
| 9 | Onboarding (Stuck) | LENDER_LAN_CREATION_FAILED | Onboarding | 4,280 | 1.6% |
| 10 | Onboarding (Stuck) | TM_ACCOUNT_CREATION_FAILED | Onboarding | 3,650 | 1.4% |
| 11 | Onboarding (Stuck) | VKYC_INITIATED / Selfie stuck | Onboarding | 5,120 | 1.9% |
| 12 | Account Management | Mandate / Autopay account change | Post-Onboarding | 3,240 | 1.2% |

### 9.3 Dashboard Views

#### 9.3.1 L1 — Issue Overview (`IssueOverview.jsx`)

- **Global Filters**: Time period (T-1 / 7d / 15d / 30d) + Charter (All / Onboarding / Post-Onboarding)
- **KPI Strip**: Total Tickets, Tickets per 100 Active Users, Top Issue Category, Escalated count
- **Stacked Bar Chart**: Horizontal stacked bar showing % share of each issue category
- **Ranked Issue Table**: Sortable rows with Rank, Category, Sub-Category, Charter tag, Ticket Count, % Share, 7-day sparkline, Delta vs previous period, RAG status. Click any row to open L2 panel.

#### 9.3.2 L2 — Cohort Drill-Down (`CohortPanel.jsx`)

Slide-in panel from right (same UX as funnel DrillDownPanel). Contains:
- Header with issue name + total tickets + RAG badge
- Cohort dimension dropdown (e.g., Activation Status, MPIN Setup, CF Cohort, Account Age, Repayment Status, Spend Frequency)
- Breakdown table: Segment name, Count, % of issue, Delta vs previous, Insight Trigger badge
- Donut chart (Recharts PieChart) showing segment split
- Click any cohort row to expand L3 action card

**Post-Onboarding Cohort Dimensions** (6): Activation Status, MPIN/UPI Setup, CF Cohort, Account Age, Repayment Status, Spend Frequency

**Onboarding Cohort Dimensions** (5): Offer Eligibility, Stage Where Stuck, CF Cohort, Re-attempt Status, Rejection/Failure Reason

#### 9.3.3 L3 — Action Cards (`ActionCard.jsx`)

Pre-built hypothesis-driven action cards with:
- Issue + Cohort title
- Hypothesis (italic — explains the "why")
- Data Signal (highlighted — the key evidence)
- Recommended Actions (numbered list, each tagged: Quick Fix / Product Change / Experiment)
- Owner + Priority badge (P1=red, P2=amber, P3=blue border accent)

10 pre-built action cards cover the most actionable issue-cohort combinations from both charters.

### 9.4 Mock Data

| Object | File | Description |
|--------|------|-------------|
| issueCategories | `src/mockData/issueCategories.js` | 12 issue rows with id, category, subCategory, charter, mtdCount, dailyCounts (7-day), prevPeriodCount, pctShare. Exports `getFilteredIssues(charterFilter, timeWindow)` helper. |
| cohortBreakdowns | `src/mockData/cohortBreakdowns.js` | Per-issue cohort data: `{ [issueId]: { [dimension]: { label, segments: [...] } } }`. Segments have name, count, pct, delta, insightTrigger. |
| actionCards | `src/mockData/actionCards.js` | Static action cards: `{ [issueId__dimension__segment]: { issueCohort, hypothesis, dataSignal, actions, owner, priority } }`. 10 cards covering P1/P2 issue-cohort combos. |

### 9.5 User Pulse Context State

| State | Type | Default | Description |
|-------|------|---------|-------------|
| pulseTimeWindow | string | '7d' | Active time window for User Pulse filters |
| charterFilter | string | 'all' | Charter filter (all / onboarding / post-onboarding) |
| selectedIssue | string | null | Currently selected issue ID for L2 panel |
| selectedCohort | string | null | Action card key for L3 expansion |

---

---

## 10. Post-Onboarding — Deep Dive (Phase 3)

### 10.1 Context

Post-onboarding is where the product lives after the user gets their credit limit. This section provides a unified dashboard for Portfolio health, Bill Reconciliation (SSFB vs Paytm LMS), Repayment & DPD monitoring, and Transaction Spends — replacing 4 separate Metabase dashboards.

### 10.2 Section Hierarchy

| # | Section | What It Answers | Primary User |
|---|---------|----------------|--------------|
| 1 | Portfolio | How is the overall book performing MoM? | Head of Product / PM |
| 2 | Bill Recon | Is our LMS in sync with SSFB? Where are the mismatches? | PM + Ops / Finance |
| 3 | Repayment | How many users paid/partially paid/didn't pay? DPD growth? | PM + Risk |
| 4 | Spends | UPI transaction success rate? Failure patterns? | PM + Tech |

### 10.3 Portfolio (Section 1)

- **MoM Summary Table**: 6 months (Sep-25 to Feb-26), 9 metrics per month, current month highlighted
- **6 KPI Cards**: Total Active Accounts, Monthly Signups, GMV, Txning Users, SPAC, Frozen/VKYC Blocked — all with MoM delta + RAG
- **Loan Status Donut**: Active / Closed / Frozen / VKYC_SOFTBLOCKED / N/A breakdown
- **Transacting Users Stacked Bar**: Repeat vs New vs Reactivated MoM trend

### 10.4 Bill Recon (Section 2)

Three progressive layers:
- **L1 Snapshot**: Card-style grid — SSFB vs Paytm LMS vs Difference for each dimension. Color-coded (green=0, red>0).
- **L2 Delta Focus**: Filtered table of only mismatched dimensions with "View LANs" button.
- **L3 LAN Table**: Individual loan accounts with multi-select, sorting, pagination (50/page), and floating "Send Reconciliation Request" action bar. Email modal with pre-filled To/Subject/Body.

### 10.5 Repayment Recon (Section 3)

- **Dues Snapshot**: Total Billed / Repaid / Outstanding / OD > 7 Days cards
- **MoM Repayment Table**: With overpayment count column (cross-links to User Pulse "Surplus Refund")
- **DPD Distribution**: Side-by-side SSFB vs Paytm with risk labels and reconciliation alerts
- **Paid/Partial/Not Paid Donut**: With cross-link to Frozen accounts in Portfolio

### 10.6 Spends (Section 4)

- **SR KPI Strip**: Yesterday SR, 30-day avg, delta with threshold alert
- **Daily SR Line Chart**: 30-day avg reference line + red-shaded anomaly zones (>2pp below avg)
- **Error Code Table**: Ranked UPI error codes with daily count, % of failures, 7D trend, spike badges
- **GMV + Txn Count MoM**: Dual line charts showing growth trajectory

### 10.7 Cross-Dashboard Deep Links

| Source | Destination | Mechanism |
|--------|-------------|-----------|
| Frozen Accounts (Portfolio) | DPD 7-day bucket (Repayment) | `setPostOnbTab('repayment')` |
| VKYC_SOFTBLOCKED (Portfolio) | "VKYC stuck" issue (User Pulse) | `setActiveView('userPulse')` + `openIssuePanel('stuck_vkyc_selfie')` |
| Overpay accounts (Repayment) | "Surplus Refund" issue (User Pulse) | `setActiveView('userPulse')` + `openIssuePanel('surplus_refund')` |
| SR drop below threshold (Spends) | "Txn Failed" issue (User Pulse) | `setActiveView('userPulse')` + `openIssuePanel('txn_failed')` |

### 10.8 Anomaly Detection Rules

| Metric | Anomaly Rule | Display |
|--------|-------------|---------|
| Daily Txn SR | < (30-day avg - 2pp) | Red zone shading + badge |
| Error code daily count | > 2x 7-day rolling avg | SPIKE badge in table |
| Bill Recon Difference | Account-count row with Diff > 0 | Red cell + "View LANs" CTA |
| DPD SSFB vs Paytm | Difference > 5 in any bucket | Amber RECON ALERT badge |
| Overpay accounts | > 50% of repaying base | Amber badge + User Pulse cross-link |

### 10.9 Mock Data

| Object | File | Description |
|--------|------|-------------|
| momMetrics, currentMonthKPIs, loanStatusDistribution, transactingUsers | `portfolio.js` | MoM table (9 metrics x 6 months), KPIs, loan status counts, repeat/new/inactive breakdown |
| reconSnapshot, lanRows | `billRecon.js` | 7 recon dimensions + 20 sample LAN rows with SSFB/LMS values |
| duesSnapshot, momRepayment, dpdDistribution, paidBreakdown | `repayment.js` | Dues totals, MoM repayment (5 months), DPD buckets, paid/partial/unpaid split |
| dailySuccessRate, avgSR, errorCodes, momGmvTxn | `spends.js` | 15-day SR, 7 error codes, GMV + txn count (6 months) |

---

## v4.0 Changelog — Colleague Design Merge (Sub-Stage Deep Dive, Lead Deep Dive, Business Highlights)

### What Changed
- **Expanded Funnel Stages (13 → 22)**: Added 9 intermediate stages to `funnelMTD.js`: LENDER_PAN_VALIDATION, LENDER_RETAIL_DEDUPE, LENDER_AADHAAR_PAN_LINK, LENDER_NAME_SIMILARITY_CHECK, LENDER_FACE_SIMILARITY_CHECK, LENDER_BRE_INITIATED, CREDIT_LINE_OFFER_ACCEPTED, MAQUETTE_FRAUD_CHECK, DEVICE_BINDING_CHECK.
- **Sub-Stage Deep Dive Page** (`SubStageDeepDivePage.jsx`): New full-page view with Stage + Sub-stage dropdowns, INTRADAY/MTD/LTD time tabs, date range picker, lender filter, DEBUG buttons per row, inline 7-day trend, API health, and Issue Lead IDs panel with "Open Lead Deep Dive" and "Kibana" links.
- **Lead Deep Dive Page** (`LeadDeepDivePage.jsx`): New page for investigating individual lead journeys. Features Lead ID input with LOAD, quick-select sample leads, Kibana and Lead Assist deep-link cards, and a chronological event timeline table (Domain, Stage, Substage, Status, Created).
- **Lead Events Mock Data** (`leadEvents.js`): 20 sample leads with procedurally generated event sequences; `getLeadsBySubStage()` utility to match leads by stage/substage.
- **Business Performance Highlights** (InsightLandingPage): New 3-column card strip (Landing to Lead Conversion, Bureau Success Rate, BRE Approval Rate) with contextual labels ("Strong Performance", "Stable Ops", "Revenue Opportunity") using RAG-colored badges.
- **DEBUG Buttons on SubStageTable**: Every sub-stage row now has a DEBUG button that opens Kibana with pre-filled stage and substage parameters.
- **Issue Lead IDs in SubStageTable Expanded**: When a sub-stage row is expanded, an "Issue Lead IDs" panel shows sample leads hitting that substage with links to Lead Deep Dive and Kibana.
- **"Open in Deep Dive" CTA on StageDetailPage**: Quick-nav button in L2 Sub-Stages section header links to the Sub-Stage Deep Dive page pre-filtered to the current stage.
- **Sidebar Navigation**: Added "Sub-Stage Dive" and "Lead Deep Dive" items under the Funnel group.
- **DashboardContext**: Added `deepDiveStage`, `deepDiveSubStage`, `selectedLeadId` state and navigation helpers.

### New Files
| File | Purpose |
|------|---------|
| `src/pages/SubStageDeepDivePage.jsx` | Sub-Stage Deep Dive with filters, table, DEBUG, leads |
| `src/pages/LeadDeepDivePage.jsx` | Lead journey investigation with event timeline |
| `src/mockData/leadEvents.js` | Mock lead IDs and event sequences |

### Modified Files
| File | Change |
|------|--------|
| `src/mockData/funnelMTD.js` | Expanded from 13 to 22 stages |
| `src/context/DashboardContext.jsx` | Added sub-stage/lead deep dive state |
| `src/components/SubStageTable.jsx` | DEBUG buttons, Issue Lead IDs panel |
| `src/pages/StageDetailPage.jsx` | "Open in Deep Dive" CTA, pass `onOpenLeadDeepDive` |
| `src/pages/InsightLandingPage.jsx` | Business Performance Highlights strip |
| `src/App.jsx` | New nav items and route entries |

---

## 8. Open Questions

| # | Question | Status | Resolution |
|---|----------|--------|------------|
| 1 | Is the 'current day' view T-1 (yesterday) or truly real-time? | **Resolved** | T-1 (yesterday). Excel shows today as zero — data has a 1-day lag. |
| 2 | Which chart library? Recharts (simpler) or ECharts (richer)? | **Resolved** | Recharts selected. Custom CSS used for vertical funnel shapes. |
| 3 | Should Closed Funnel show 'same-day closed' or 'ever closed' for Feb cohort? | Open | — |
| 4 | Are there stage name aliases in Kibana vs. Excel? | Open (Phase 2) | Needed for Kibana deep-link query accuracy. |
| 5 | Who has access to this dashboard? PM-only or leadership + SSFB? | Open (Phase 2) | Drives auth requirements. |
