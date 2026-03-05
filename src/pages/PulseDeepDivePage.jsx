import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell, PieChart, Pie,
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import {
  pulseIssues, LENDER_OPTIONS, ISSUE_TYPE_OPTIONS, BUILT_IN_COHORTS,
  getFilteredPulseIssues, getDailyTrend, getCohortBreakdown,
} from '../mockData/pulseDeepDive';

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];

function getRag(delta) {
  if (delta > 10) return { color: 'bg-red-100 text-red-700', label: 'RED' };
  if (delta > 0) return { color: 'bg-amber-100 text-amber-700', label: 'AMBER' };
  return { color: 'bg-emerald-100 text-emerald-700', label: 'GREEN' };
}

// ─── Custom Cohort helpers ──────────────────────────────────────
function readCustomCohorts() {
  try { return JSON.parse(localStorage.getItem('pulse_custom_cohorts') || '[]'); } catch { return []; }
}
function writeCustomCohorts(cohorts) {
  localStorage.setItem('pulse_custom_cohorts', JSON.stringify(cohorts));
}

// ─── Custom Cohort Builder Modal ────────────────────────────────
function CohortBuilderModal({ onClose, onSave, editCohort }) {
  const [name, setName] = useState(editCohort?.label || '');
  const [segments, setSegments] = useState(
    editCohort?.segments || [{ name: '', color: '#3b82f6', query: '' }]
  );

  const addSegment = () => setSegments(s => [...s, { name: '', color: PIE_COLORS[s.length % PIE_COLORS.length], query: '' }]);
  const removeSegment = (i) => setSegments(s => s.filter((_, idx) => idx !== i));
  const updateSegment = (i, field, val) => setSegments(s => s.map((seg, idx) => idx === i ? { ...seg, [field]: val } : seg));

  const canSave = name.trim() && segments.length >= 2 && segments.every(s => s.name.trim());

  const handleSave = () => {
    if (!canSave) return;
    const key = editCohort?.key || `custom_${Date.now()}`;
    onSave({
      key,
      label: name.trim(),
      isCustom: true,
      segments: segments.map(s => ({ name: s.name.trim(), color: s.color, query: s.query.trim() })),
      createdAt: editCohort?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{editCohort ? 'Edit Custom Cohort' : 'Create Custom Cohort'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Define cohort segments and their data queries</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Cohort Name */}
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Cohort Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Non-Paytm Spend %age, BRE Risk Tier, etc."
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Segments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Segments (min 2)</label>
              <button onClick={addSegment} className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">+ Add Segment</button>
            </div>

            <div className="space-y-3">
              {segments.map((seg, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 w-5">#{i + 1}</span>
                    <input
                      type="color"
                      value={seg.color}
                      onChange={e => updateSegment(i, 'color', e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={seg.name}
                      onChange={e => updateSegment(i, 'name', e.target.value)}
                      placeholder="Segment name (e.g., >50% Non-Paytm Spend)"
                      className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {segments.length > 2 && (
                      <button onClick={() => removeSegment(i)} className="text-red-400 hover:text-red-600 text-sm font-bold">Remove</button>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Data Query / SQL
                    </label>
                    <textarea
                      value={seg.query}
                      onChange={e => updateSegment(i, 'query', e.target.value)}
                      placeholder={`SELECT count(*) FROM tickets t\nJOIN user_profile u ON t.user_id = u.user_id\nWHERE u.non_paytm_spend_pct ${i === 0 ? '> 50' : '<= 50'}\n  AND t.issue_category = :issue_id\n  AND t.created_at BETWEEN :date_from AND :date_to`}
                      rows={4}
                      className="w-full text-xs font-mono border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Use :issue_id, :lender, :date_from, :date_to as bind variables. Results will be fetched when query runs.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          {canSave && (
            <div className="border border-dashed border-blue-200 bg-blue-50/30 rounded-xl p-4">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">Preview</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-slate-800">{name}</span>
                <span className="text-slate-300">|</span>
                {segments.map((seg, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span className="text-xs text-slate-600">{seg.name || `Segment ${i + 1}`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="text-sm font-semibold text-white bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {editCohort ? 'Update Cohort' : 'Create Cohort'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cohort Deep Dive Panel ─────────────────────────────────────
function CohortDeepDivePanel({ issueId, cohortKey, subIssueFilter, allCohorts }) {
  const cohort = allCohorts.find(c => c.key === cohortKey);
  const breakdown = useMemo(
    () => getCohortBreakdown(issueId, cohortKey, subIssueFilter),
    [issueId, cohortKey, subIssueFilter]
  );

  if (!cohort || !breakdown) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-400">Select a cohort to see the breakdown</p>
      </div>
    );
  }

  const total = breakdown.reduce((s, b) => s + b.count, 0);
  const topSegment = breakdown.reduce((a, b) => (b.count > a.count ? b : a), breakdown[0]);
  const spikeSegments = breakdown.filter(b => b.delta > 3);

  return (
    <div className="space-y-4">
      {/* Cohort Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{cohort.label}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {breakdown.length} segments · {total.toLocaleString()} total tickets
              {cohort.isCustom && <span className="ml-2 px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[9px] font-bold">CUSTOM</span>}
            </p>
          </div>
        </div>

        {/* Signal Banner */}
        {spikeSegments.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 mb-3 flex items-start gap-2">
            <span className="text-amber-500 font-bold text-sm flex-shrink-0">!</span>
            <p className="text-xs text-amber-800">
              <span className="font-semibold">{spikeSegments.length} segment{spikeSegments.length > 1 ? 's' : ''} spiking:</span>{' '}
              {spikeSegments.map((s, i) => (
                <span key={i}>{i > 0 && ', '}<span className="font-bold">{s.name}</span> (+{s.delta}pp)</span>
              ))}
            </p>
          </div>
        )}

        <div className="flex gap-6">
          {/* Donut chart */}
          <div className="w-40 flex-shrink-0">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdown} dataKey="count" nameKey="name" innerRadius="50%" outerRadius="85%" paddingAngle={2}>
                    {breakdown.map((seg, i) => (
                      <Cell key={i} fill={seg.color || PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val.toLocaleString(), name]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              {breakdown.map((seg, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color || PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-[10px] text-slate-500 truncate">{seg.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Segment Table */}
          <div className="flex-1 min-w-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 bg-slate-50/50">
                  <th className="text-left px-3 py-2 font-medium">Segment</th>
                  <th className="text-right px-3 py-2 font-medium">Count</th>
                  <th className="text-right px-3 py-2 font-medium">%</th>
                  <th className="text-right px-3 py-2 font-medium">Delta</th>
                  <th className="text-left px-3 py-2 font-medium">Signal</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((seg, i) => {
                  const rag = getRag(seg.delta);
                  return (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-3 py-2.5 text-slate-700 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color || PIE_COLORS[i % PIE_COLORS.length] }} />
                          {seg.name}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right text-slate-800 font-semibold tabular-nums">{seg.count.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-right text-slate-600 tabular-nums">{seg.pct}%</td>
                      <td className={`px-3 py-2.5 text-right font-semibold tabular-nums ${seg.delta > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {seg.delta > 0 ? '+' : ''}{seg.delta}pp
                      </td>
                      <td className="px-3 py-2.5">
                        {seg.insightTrigger
                          ? <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${rag.color}`}>{seg.insightTrigger}</span>
                          : <span className="text-[10px] text-slate-300">—</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insight Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Quick Insight</h4>
        <p className="text-xs text-slate-700 leading-relaxed">
          Dominant segment: <span className="font-bold text-slate-900">{topSegment.name}</span> ({topSegment.pct}% of tickets, {topSegment.count.toLocaleString()} count).
          {spikeSegments.length > 0
            ? ` ${spikeSegments.length} segment${spikeSegments.length > 1 ? 's show' : ' shows'} a positive delta spike — worth investigating further.`
            : ' No significant spikes detected in this cohort view.'
          }
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────
export default function PulseDeepDivePage() {
  const { selectedLender, setSelectedLender } = useDashboard();

  const [issueType, setIssueType] = useState('All');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [subIssueFilter, setSubIssueFilter] = useState(null);
  const [dateFrom, setDateFrom] = useState('2026-02-01');
  const [dateTo, setDateTo] = useState('2026-02-22');
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [expandedIssue, setExpandedIssue] = useState(null);

  // Custom cohorts
  const [customCohorts, setCustomCohorts] = useState(readCustomCohorts);
  const [showCohortBuilder, setShowCohortBuilder] = useState(false);
  const [editingCohort, setEditingCohort] = useState(null);

  const allCohorts = useMemo(() => [...BUILT_IN_COHORTS, ...customCohorts], [customCohorts]);

  const handleSaveCohort = useCallback((cohort) => {
    setCustomCohorts(prev => {
      const idx = prev.findIndex(c => c.key === cohort.key);
      const next = idx >= 0 ? prev.map((c, i) => i === idx ? cohort : c) : [...prev, cohort];
      writeCustomCohorts(next);
      return next;
    });
    setShowCohortBuilder(false);
    setEditingCohort(null);
  }, []);

  const handleDeleteCohort = useCallback((key) => {
    setCustomCohorts(prev => {
      const next = prev.filter(c => c.key !== key);
      writeCustomCohorts(next);
      return next;
    });
    if (selectedCohort === key) setSelectedCohort(null);
  }, [selectedCohort]);

  const filteredIssues = useMemo(
    () => getFilteredPulseIssues({ lender: selectedLender, issueType }),
    [selectedLender, issueType]
  );

  const activeIssue = selectedIssue
    ? filteredIssues.find(i => i.id === selectedIssue) || null
    : null;

  const activeSubIssues = activeIssue?.subIssues || [];

  const trendData = useMemo(
    () => selectedIssue ? getDailyTrend(selectedIssue, dateFrom, dateTo) : [],
    [selectedIssue, dateFrom, dateTo]
  );

  const totalFiltered = filteredIssues.reduce((s, i) => s + i.febCount, 0);

  // When issue changes, reset sub-issue and cohort
  useEffect(() => {
    setSubIssueFilter(null);
    setSelectedCohort(null);
  }, [selectedIssue]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h1 className="text-xl font-bold text-slate-900">Pulse Deep Dive</h1>
        <p className="text-xs text-slate-400 mt-0.5">Search issues by lender, type, and sub-issue, then drill into cohort-level analysis</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* Lender */}
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Lender</label>
            <div className="flex gap-1">
              {LENDER_OPTIONS.map(l => (
                <button
                  key={l}
                  onClick={() => setSelectedLender(l)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    selectedLender === l ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {l === 'ALL' ? 'All' : l}
                </button>
              ))}
            </div>
          </div>

          {/* Bot vs Agent */}
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Issue Type</label>
            <div className="flex gap-1">
              {ISSUE_TYPE_OPTIONS.map(t => (
                <button
                  key={t}
                  onClick={() => { setIssueType(t); setSelectedIssue(null); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    issueType === t ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Issue (Category2) */}
          {activeIssue && (
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Sub-Issue (L2)</label>
              <select
                value={subIssueFilter || ''}
                onChange={e => setSubIssueFilter(e.target.value || null)}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[260px]"
              >
                <option value="">All Sub-Issues</option>
                {activeSubIssues.map(si => (
                  <option key={si.id} value={si.id}>{si.label} ({si.pct}%)</option>
                ))}
              </select>
            </div>
          )}

          {/* Date Range */}
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Clear */}
          {selectedIssue && (
            <button
              onClick={() => { setSelectedIssue(null); setSubIssueFilter(null); setSelectedCohort(null); }}
              className="text-xs font-semibold text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-800">{filteredIssues.length}</span> issues
          {issueType !== 'All' && <> · <span className="font-medium text-violet-700">{issueType}</span> only</>}
          {' '}· <span className="font-bold text-slate-800">{totalFiltered.toLocaleString()}</span> total Feb tickets
        </p>
        <p className="text-[10px] text-slate-400">{dateFrom} → {dateTo} · {selectedLender === 'ALL' ? 'All Lenders' : selectedLender}</p>
      </div>

      {/* Issue Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-[60px]">Type</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Issue</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Feb Count</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Jan Count</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">MoM Delta</th>
                <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Sub-Issues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredIssues.map(issue => {
                const isActive = selectedIssue === issue.id;
                const isExpanded = expandedIssue === issue.id;
                const rag = getRag(issue.delta);
                return (
                  <IssueRow
                    key={issue.id}
                    issue={issue}
                    isActive={isActive}
                    isExpanded={isExpanded}
                    rag={rag}
                    onSelect={() => {
                      setSelectedIssue(issue.id);
                      setExpandedIssue(prev => prev === issue.id ? null : issue.id);
                    }}
                    onDive={() => setSelectedIssue(issue.id)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredIssues.length === 0 && (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-slate-400">No issues match the current filters</p>
          </div>
        )}
      </div>

      {/* ──── Issue selected → show deep dive sections ──── */}
      {activeIssue && (
        <>
          {/* Day-on-Day Trend */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ticket Trend — Day on Day</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{activeIssue.subCategory} · {dateFrom} → {dateTo}</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                  Avg: {trendData.length > 0 ? Math.round(trendData.reduce((s, d) => s + d.count, 0) / trendData.length).toLocaleString() : '—'}/day
                </span>
                <span className={`px-2.5 py-1 rounded-lg font-bold ${getRag(activeIssue.delta).color}`}>
                  MoM: {activeIssue.delta > 0 ? '+' : ''}{activeIssue.delta}%
                </span>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8 }}
                    formatter={(v) => [v.toLocaleString(), 'Tickets']}
                    labelFormatter={(l) => `Date: ${l}`}
                  />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.5, fill: '#3b82f6' }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sub-Issue Breakdown Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Sub-Issue Breakdown (L2)</h3>
            <div className="h-10 mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[activeSubIssues.reduce((row, si) => { row[si.id] = si.pct; return row; }, { name: 'Share' })]}
                  layout="vertical"
                  barCategoryGap={0}
                >
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip
                    formatter={(value, name) => {
                      const si = activeSubIssues.find(s => s.id === name);
                      return [`${value}%`, si?.label || name];
                    }}
                    contentStyle={{ fontSize: 11, borderRadius: 8 }}
                  />
                  {activeSubIssues.map((si, idx) => (
                    <Bar
                      key={si.id}
                      dataKey={si.id}
                      stackId="stack"
                      fill={PIE_COLORS[idx % PIE_COLORS.length]}
                      radius={idx === 0 ? [4, 0, 0, 4] : idx === activeSubIssues.length - 1 ? [0, 4, 4, 0] : 0}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5">
              {activeSubIssues.map((si, idx) => (
                <div
                  key={si.id}
                  onClick={() => setSubIssueFilter(prev => prev === si.id ? null : si.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    subIssueFilter === si.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                    <span className="text-xs text-slate-700 font-medium">{si.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 tabular-nums">{si.count.toLocaleString()} tickets</span>
                    <span className="text-xs font-semibold text-slate-800 tabular-nums w-[50px] text-right">{si.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ──── Cohort Section ──── */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cohort Analysis</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Select a cohort to view distribution breakdown for this issue</p>
              </div>
              <button
                onClick={() => { setEditingCohort(null); setShowCohortBuilder(true); }}
                className="text-xs font-semibold text-purple-600 border border-purple-200 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1.5"
              >
                <span className="text-sm leading-none">+</span> Create Custom Cohort
              </button>
            </div>

            {/* Cohort selector — one at a time */}
            <div className="flex flex-wrap gap-2 mb-4">
              {allCohorts.map(cohort => (
                <button
                  key={cohort.key}
                  onClick={() => setSelectedCohort(prev => prev === cohort.key ? null : cohort.key)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    selectedCohort === cohort.key
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {cohort.label}
                  {cohort.isCustom && <span className="ml-1.5 text-[9px] opacity-70">(Custom)</span>}
                </button>
              ))}
            </div>

            {/* Custom cohort management strip */}
            {customCohorts.length > 0 && (
              <div className="border-t border-slate-100 pt-3 mb-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Custom Cohorts</p>
                <div className="flex flex-wrap gap-2">
                  {customCohorts.map(cc => (
                    <div key={cc.key} className="flex items-center gap-1 bg-purple-50 border border-purple-100 rounded-lg px-2.5 py-1.5">
                      <span className="text-[11px] font-medium text-purple-800">{cc.label}</span>
                      <span className="text-slate-300 mx-0.5">|</span>
                      <button
                        onClick={() => { setEditingCohort(cc); setShowCohortBuilder(true); }}
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCohort(cc.key)}
                        className="text-[10px] text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cohort Deep Dive (only when one is selected) */}
          {selectedCohort && (
            <CohortDeepDivePanel
              issueId={selectedIssue}
              cohortKey={selectedCohort}
              subIssueFilter={subIssueFilter}
              allCohorts={allCohorts}
            />
          )}
        </>
      )}

      {/* Empty state when no issue selected */}
      {!activeIssue && (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-600">Click an issue above to dive deeper</p>
          <p className="text-xs text-slate-400 mt-1">You'll see day-on-day trends, sub-issue breakdown, and cohort-level analysis</p>
        </div>
      )}

      {/* Cohort Builder Modal */}
      {showCohortBuilder && (
        <CohortBuilderModal
          onClose={() => { setShowCohortBuilder(false); setEditingCohort(null); }}
          onSave={handleSaveCohort}
          editCohort={editingCohort}
        />
      )}
    </div>
  );
}

// ─── Issue Row Component ────────────────────────────────────────
function IssueRow({ issue, isActive, isExpanded, rag, onSelect, onDive }) {
  return (
    <tr
      onClick={onSelect}
      className={`cursor-pointer transition-colors ${isActive ? 'bg-blue-50/60' : 'hover:bg-slate-50/60'}`}
    >
      <td className="px-4 py-3">
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
          issue.type === 'Bot' ? 'bg-cyan-100 text-cyan-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {issue.type}
        </span>
      </td>
      <td className="px-4 py-3 text-[10px] text-slate-400 uppercase font-medium">{issue.category}</td>
      <td className="px-4 py-3">
        <p className="text-xs font-medium text-slate-800">{issue.subCategory}</p>
        <p className="text-[10px] text-slate-400">{issue.charter}</p>
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-xs font-semibold text-slate-800">{issue.febCount.toLocaleString()}</td>
      <td className="px-4 py-3 text-right tabular-nums text-xs text-slate-500">{issue.janCount.toLocaleString()}</td>
      <td className={`px-4 py-3 text-right tabular-nums text-xs font-bold ${issue.delta > 0 ? 'text-red-600' : issue.delta < -5 ? 'text-emerald-600' : 'text-slate-400'}`}>
        {issue.delta > 0 ? '+' : ''}{issue.delta}%
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${rag.color}`}>{rag.label}</span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-[10px] text-slate-500 font-medium">{issue.subIssues.length} L2</span>
      </td>
    </tr>
  );
}
