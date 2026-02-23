# Insight Landing Page

## Purpose

The Insight Landing Page is the unified home screen for the Paytm Postpaid Product Manager Dashboard. It provides a single-glance executive summary across all charters — Onboarding Funnel, Disbursement, User Pulse (CST), and Post-Onboarding — so that a PM can instantly identify areas requiring attention without navigating into individual sections.

## Views

### Cross-Charter KPI Row
- 4–6 metric cards, each pulling a headline number from a different charter
- Examples: MTD conversion (Funnel), disbursement amount, top CST ticket count, portfolio active rate
- Each card shows the metric value, MoM delta, and a RAG badge

### Alerts / Anomalies Strip
- Auto-surfaced RED-status items from every section
- Anomaly badges (SPIKE / WATCH) from Post-Onboarding Spends and Repayment
- Clicking an alert navigates to the relevant section

### Section Quick-Link Cards
- One card per dashboard section (Funnel, Disbursement, User Pulse, Post-Onboarding)
- Each card contains a mini sparkline, 1-line summary, and a "View" link that navigates to that section

## Data Sources

| Metric | Source Module |
|--------|--------------|
| Funnel conversion | `funnelMTD.js` |
| Disbursement amount | `disbursement.js` |
| Top CST issue | `issueCategories.js` |
| Portfolio active rate | `portfolio.js` |
| Anomaly badges | `spends.js`, `repayment.js` |

## RAG Logic

KPI cards inherit RAG from their respective sections:
- Funnel: conversion delta vs LMTD (green < -0.5pp, amber -0.5 to -2pp, red > -2pp)
- Disbursement: failure rate thresholds
- User Pulse: ticket share thresholds
- Post-Onboarding: MoM delta thresholds

## Component

`src/pages/InsightLandingPage.jsx`

## Navigation

- Default view when the dashboard loads (`activeView === 'insightLanding'`)
- Accessible via "Home" icon in the sidebar
