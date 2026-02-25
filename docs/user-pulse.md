# User Pulse — CST Dashboard

## Purpose

The User Pulse section provides analysis of customer support tickets (CST), enabling PMs to track issue categories, identify cohort-level breakdowns, and take structured investigative action on the highest-impact user pain points.

## Views

### Issue Overview (L1)
- Time window and charter filters
- KPI cards (total tickets, top issue share, resolution rate)
- Stacked bar chart showing issue category distribution over time
- Ranked issue table with columns: Issue, MTD Count, % Share, Trend (sparkline), Status
- Status column has a filter (RED/AMBER/GREEN/All)
- Clicking an issue row navigates to the Issue Detail page

### Issue Detail — Cohort PM Workspace (L2/L3 — Full Page)

Breadcrumb: Dashboard / User Pulse / [Issue Name]

#### Issue Header
- Issue name, category, ticket count, and pctShare badge

#### R1 — Cohort Signal Summary Banner
Auto-generated banner below the issue header:
- Scans all cohort dimensions for segments where `delta > 2` (threshold)
- Groups triggered `insightTrigger` values and finds repeating themes
- Renders contextual alert: "N cohort signals pointing to [theme]. Key segments: [top 2 segments with delta]. Suggested starting hypothesis below."
- If no strong signals: "No dominant cohort pattern detected. Manual hypothesis recommended."

#### Dimension Breakdowns
All cohort dimensions displayed vertically (no dropdown selector). Each section includes:
- Mini donut chart with colour-coded legend
- Segment table (Segment, Count, %, Delta, Insight trigger badge)
- Expandable L3 action cards with hypothesis, data signal, and recommended actions

#### R2 — Cross-Cohort Pattern Panel
Positioned after all dimension breakdowns:
- Ranked list of segments elevated (`delta > threshold`) across **multiple** dimensions
- Each row: segment name, dimensions it appears in, combined delta, signal strength badge (Strong/Moderate/Weak)
- Shortcut to the most probable user persona driving the issue

#### R3 — Hypothesis Workspace (with pre-fills)
Same structure as StageDetailPage R4, but cohort-specific:
- Clicking "+ Add Hypothesis" **pre-fills** a suggested card from top `insightTrigger` signals and cross-cohort patterns
- Fields: Root cause category (dropdown: UX / Pricing / Communication / Product Bug / Eligibility / External), Detail (text, pre-filled from dominant trigger), Evidence (multi-select, auto-populated from elevated cohort segments), Target user segment (free text), Status (Draft / Under Investigation / Confirmed / Ruled Out)
- Badge: "Suggested from N cohort signals" on pre-filled cards
- Persisted to `localStorage` under `hypothesis_issue_[issueId]`
- Saving appends to the Investigation Log

#### R4 — SOP Selector (Response Playbook)
Replaces the generic Next Action Planner from StageDetailPage:
- 6 predefined SOP types:
  1. Communication fix — trigger comms to affected segment
  2. Product/UX change — raise with product team
  3. Pricing review — escalate to pricing
  4. Ops intervention — manual fix/retry for stuck users
  5. Monitor — no action, watch trend
  6. Escalate to leadership
- Selecting a SOP type opens a template with fillable fields:
  - Affected segment (pre-filled from hypothesis / cross-cohort patterns)
  - Proposed action (editable text)
  - Owner + target date
  - Success metric: "This issue is resolved when [metric] reaches [target]"
- Persisted to `localStorage` under `sop_issue_[issueId]`
- Saving appends to the Investigation Log

#### R5 — Investigation Log
- Collapsible reverse-chronological timeline
- Logs hypothesis saves and SOP saves with type badge + timestamp + summary
- Persisted to `localStorage` under `log_issue_[issueId]`
- Shows up to 5 entries collapsed; expand to see all

## Data Sources

| Data | Module |
|------|--------|
| Issue categories | `issueCategories.js` |
| Cohort breakdowns | `cohortBreakdowns.js` |
| Action cards | `actionCards.js` |

## LocalStorage Keys

| Key Pattern | Purpose |
|-------------|---------|
| `hypothesis_issue_[issueId]` | Hypothesis cards per issue |
| `sop_issue_[issueId]` | Saved SOPs per issue |
| `log_issue_[issueId]` | Investigation log entries per issue |

## RAG Logic

Issue-level RAG:
- RED: pctShare > 10% or significant spike
- AMBER: pctShare 5–10%
- GREEN: pctShare < 5% or declining trend

Cohort signal threshold: `delta > 2pp` triggers signal banner and cross-cohort pattern detection.

## Components

- `src/pages/UserPulseView.jsx`
- `src/pages/IssueDetailPage.jsx` — Cohort PM Workspace (R1-R5 inline components)
- `src/components/UserPulseFilters.jsx`
- `src/components/IssueOverview.jsx`
- `src/components/ActionCard.jsx`

## Navigation

- Sidebar: "User Pulse" item under CST section
- Issue Detail: full-page navigation from issue click (no popup)
