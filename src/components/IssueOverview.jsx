import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { getFilteredIssues } from '../mockData/issueCategories';

const COLORS = [
  '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899',
  '#06b6d4', '#f97316', '#6366f1', '#14b8a6', '#e11d48', '#84cc16',
];

function getRag(delta) {
  if (delta > 5) return { color: 'bg-red-100 text-red-700', label: 'RED' };
  if (delta > 0) return { color: 'bg-amber-100 text-amber-700', label: 'AMBER' };
  return { color: 'bg-emerald-100 text-emerald-700', label: 'GREEN' };
}

const STATUS_OPTIONS = ['all', 'RED', 'AMBER', 'GREEN'];
const CHARTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'post-onboarding', label: 'Post-Onboarding' },
];

function getInvestigationStatus(issueId) {
  try {
    const hyps = JSON.parse(localStorage.getItem(`hypothesis_issue_${issueId}`) || '[]');
    const sops = JSON.parse(localStorage.getItem(`sop_issue_${issueId}`) || '[]');
    const hasInvestigating = hyps.some(h => h.status === 'Under Investigation');
    const hasConfirmed = hyps.some(h => h.status === 'Confirmed');
    if (sops.length > 0) return { badge: 'Action Taken', color: 'bg-emerald-100 text-emerald-700' };
    if (hasConfirmed) return { badge: 'Confirmed', color: 'bg-blue-100 text-blue-700' };
    if (hasInvestigating) return { badge: 'Investigating', color: 'bg-purple-100 text-purple-700' };
    if (hyps.length > 0) return { badge: 'Draft', color: 'bg-slate-100 text-slate-600' };
    return { badge: null, color: '' };
  } catch { return { badge: null, color: '' }; }
}

export default function IssueOverview() {
  const { charterFilter, pulseTimeWindow, openIssuePanel, selectedLender } = useDashboard();
  const [statusFilter, setStatusFilter] = useState('all');
  const [tableCharterFilter, setTableCharterFilter] = useState('all');
  const [shareSort, setShareSort] = useState(null);
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pm_watchlist') || '[]'); } catch { return []; }
  });

  const lenderScale = selectedLender === 'SSFB' ? 0.62 : selectedLender === 'JANA' ? 0.38 : 1;

  const isWatched = (id) => watchlist.some(w => w.id === id);
  const toggleWatch = (issue) => {
    let next;
    if (isWatched(issue.id)) {
      next = watchlist.filter(w => w.id !== issue.id);
    } else {
      if (watchlist.length >= 6) return;
      next = [...watchlist, { id: issue.id, type: 'issue', name: issue.subCategory, delta: issue.delta, rag: getRag(issue.delta).label === 'RED' ? 'red' : getRag(issue.delta).label === 'AMBER' ? 'amber' : 'green' }];
    }
    setWatchlist(next);
    localStorage.setItem('pm_watchlist', JSON.stringify(next));
    window.dispatchEvent(new Event('watchlist-updated'));
  };

  const issues = useMemo(() => {
    const base = getFilteredIssues(charterFilter, pulseTimeWindow);
    if (lenderScale === 1) return base;
    return base.map(i => ({
      ...i,
      windowCount: Math.round(i.windowCount * lenderScale),
      prevWindowCount: Math.round(i.prevWindowCount * lenderScale),
      mtdCount: Math.round(i.mtdCount * lenderScale),
    }));
  }, [charterFilter, pulseTimeWindow, lenderScale]);

  const totalTickets = useMemo(() => issues.reduce((s, i) => s + i.windowCount, 0), [issues]);
  const topIssue = issues[0];
  const totalPrev = useMemo(() => issues.reduce((s, i) => s + i.prevWindowCount, 0), [issues]);
  const overallDelta = totalPrev > 0 ? ((totalTickets - totalPrev) / totalPrev * 100).toFixed(1) : 0;

  const stackData = useMemo(() => {
    const row = { name: 'Share' };
    issues.forEach((issue) => { row[issue.id] = issue.windowPctShare; });
    return [row];
  }, [issues]);

  const filteredAndSorted = useMemo(() => {
    let result = issues.filter(issue => {
      if (statusFilter !== 'all' && getRag(issue.delta).label !== statusFilter) return false;
      if (tableCharterFilter !== 'all') {
        if (tableCharterFilter === 'onboarding') return issue.charter === 'onboarding' || issue.charter === 'both';
        return issue.charter === 'post-onboarding' || issue.charter === 'both';
      }
      return true;
    });
    if (shareSort === 'asc') result = [...result].sort((a, b) => a.windowPctShare - b.windowPctShare);
    else if (shareSort === 'desc') result = [...result].sort((a, b) => b.windowPctShare - a.windowPctShare);
    return result;
  }, [issues, statusFilter, tableCharterFilter, shareSort]);

  const toggleShareSort = () => {
    setShareSort(prev => prev === null ? 'desc' : prev === 'desc' ? 'asc' : null);
  };

  const shareSortIcon = shareSort === 'desc' ? '↓' : shareSort === 'asc' ? '↑' : '↕';

  return (
    <div className="space-y-5">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          title="Total Tickets"
          value={totalTickets.toLocaleString()}
          delta={`${overallDelta > 0 ? '+' : ''}${overallDelta}%`}
          rag={getRag(Number(overallDelta))}
        />
        <KpiCard
          title="Tickets / 100 Active"
          value={(totalTickets / 12400).toFixed(1)}
          delta=""
          rag={{ color: 'bg-slate-100 text-slate-600', label: '—' }}
        />
        <KpiCard
          title="Top Issue"
          value={topIssue?.subCategory?.slice(0, 28) || '—'}
          delta={`${topIssue?.windowPctShare}% share`}
          rag={getRag(topIssue?.delta || 0)}
          small
        />
        <KpiCard
          title="Escalated"
          value={Math.round(totalTickets * 0.04).toLocaleString()}
          delta="~4% of total"
          rag={{ color: 'bg-amber-100 text-amber-700', label: 'AMBER' }}
        />
      </div>

      {/* Stacked bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Issue Category Share</h3>
        <div className="h-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackData} layout="vertical" barCategoryGap={0}>
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip
                formatter={(value, name) => {
                  const issue = issues.find(i => i.id === name);
                  return [`${value}%`, issue?.subCategory || name];
                }}
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
              />
              {issues.map((issue, idx) => (
                <Bar
                  key={issue.id}
                  dataKey={issue.id}
                  stackId="stack"
                  fill={COLORS[idx % COLORS.length]}
                  radius={idx === 0 ? [4, 0, 0, 4] : idx === issues.length - 1 ? [0, 4, 4, 0] : 0}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {issues.slice(0, 8).map((issue, idx) => (
            <div key={issue.id} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
              <span className="text-[10px] text-slate-500 whitespace-nowrap">{issue.subCategory.length > 30 ? issue.subCategory.slice(0, 30) + '...' : issue.subCategory}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Issue table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Ranked Issues</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="text-left px-4 py-2.5 font-medium">#</th>
                <th className="text-left px-4 py-2.5 font-medium">Category</th>
                <th className="text-left px-4 py-2.5 font-medium">Sub-Category</th>
                <th className="text-center px-4 py-2.5 font-medium">
                  <div className="flex items-center justify-center gap-1">
                    <span>Charter</span>
                    <select
                      value={tableCharterFilter}
                      onChange={(e) => { e.stopPropagation(); setTableCharterFilter(e.target.value); }}
                      className="text-[10px] bg-transparent border border-slate-300 rounded px-1 py-0.5 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                    >
                      {CHARTER_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </th>
                <th className="text-right px-4 py-2.5 font-medium">Tickets</th>
                <th className="text-right px-4 py-2.5 font-medium">
                  <button
                    onClick={toggleShareSort}
                    className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    % Share <span className="text-[10px]">{shareSortIcon}</span>
                  </button>
                </th>
                <th className="text-right px-4 py-2.5 font-medium">Delta (MTD vs LMTD)</th>
                <th className="text-center px-4 py-2.5 font-medium">Investigation</th>
                <th className="text-center px-4 py-2.5 font-medium">
                  <div className="flex items-center justify-center gap-1">
                    <span>Status</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => { e.stopPropagation(); setStatusFilter(e.target.value); }}
                      className="text-[10px] bg-transparent border border-slate-300 rounded px-1 py-0.5 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt === 'all' ? 'All' : opt}</option>
                      ))}
                    </select>
                  </div>
                </th>
                <th className="text-center px-4 py-2.5 font-medium w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((issue, idx) => {
                const rag = getRag(issue.delta);
                const mtdLmtdDelta = issue.windowCount - issue.prevWindowCount;
                const mtdLmtdPct = issue.prevWindowCount > 0
                  ? ((mtdLmtdDelta / issue.prevWindowCount) * 100).toFixed(1)
                  : 0;
                const invStatus = getInvestigationStatus(issue.id);
                return (
                  <tr
                    key={issue.id}
                    onClick={() => openIssuePanel(issue.id)}
                    className="border-t border-slate-100 hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-2.5 font-mono text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-2.5 text-slate-700 font-medium whitespace-nowrap">{issue.category}</td>
                    <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">{issue.subCategory}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        issue.charter === 'onboarding' ? 'bg-sky-100 text-sky-700' :
                        issue.charter === 'post-onboarding' ? 'bg-violet-100 text-violet-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {issue.charter === 'post-onboarding' ? 'Post' : issue.charter === 'onboarding' ? 'Onb' : 'Both'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800">{issue.windowCount.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600">{issue.windowPctShare}%</td>
                    <td className={`px-4 py-2.5 text-right font-semibold ${Number(mtdLmtdPct) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {Number(mtdLmtdPct) > 0 ? '+' : ''}{mtdLmtdPct}%
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {invStatus.badge && <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${invStatus.color}`}>{invStatus.badge}</span>}
                      {!invStatus.badge && <span className="text-[10px] text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${rag.color}`}>{rag.label}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWatch(issue); }}
                        className={`text-sm transition-colors ${isWatched(issue.id) ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'}`}
                        title={isWatched(issue.id) ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        {isWatched(issue.id) ? '★' : '☆'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, delta, rag, small }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <p className="text-[11px] text-slate-500 font-medium mb-1">{title}</p>
      <p className={`${small ? 'text-sm' : 'text-lg'} font-bold text-slate-900 leading-tight`}>{value}</p>
      <div className="flex items-center gap-2 mt-1.5">
        {delta && <span className="text-[11px] text-slate-500">{delta}</span>}
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${rag.color}`}>{rag.label}</span>
      </div>
    </div>
  );
}
