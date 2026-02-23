import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { issueCategories } from '../mockData/issueCategories';
import { cohortBreakdowns } from '../mockData/cohortBreakdowns';
import { actionCards } from '../mockData/actionCards';
import ActionCard from '../components/ActionCard';

const DONUT_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

function getRag(delta) {
  if (delta > 5) return { color: 'bg-red-100 text-red-700', label: 'RED' };
  if (delta > 0) return { color: 'bg-amber-100 text-amber-700', label: 'AMBER' };
  return { color: 'bg-emerald-100 text-emerald-700', label: 'GREEN' };
}

export default function IssueDetailPage() {
  const { selectedIssue, navigateBackFromIssueDetail, selectedCohort, openCohortAction, closeCohortAction } = useDashboard();

  const issue = useMemo(
    () => issueCategories.find((i) => i.id === selectedIssue),
    [selectedIssue]
  );

  const cohortData = useMemo(
    () => (selectedIssue ? cohortBreakdowns[selectedIssue] : null),
    [selectedIssue]
  );

  const dimensionKeys = useMemo(
    () => (cohortData ? Object.keys(cohortData) : []),
    [cohortData]
  );

  if (!selectedIssue || !issue) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-sm">No issue selected.</p>
        <button onClick={navigateBackFromIssueDetail} className="text-blue-600 hover:underline text-sm mt-2">
          &larr; Back to User Pulse
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={navigateBackFromIssueDetail} className="hover:text-blue-600 transition-colors">Dashboard</button>
        <span>/</span>
        <button onClick={navigateBackFromIssueDetail} className="hover:text-blue-600 transition-colors">User Pulse</button>
        <span>/</span>
        <span className="text-slate-900 font-medium">{issue.subCategory}</span>
      </nav>

      {/* Issue Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{issue.subCategory}</h1>
            <p className="text-xs text-slate-400 mt-1">{issue.category}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{issue.mtdCount.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400">tickets MTD</p>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getRag(issue.pctShare > 10 ? 8 : 0).color}`}>
              {issue.pctShare}% share
            </span>
          </div>
        </div>
      </div>

      {/* All dimension breakdowns stacked */}
      {dimensionKeys.map((dimKey) => {
        const dim = cohortData[dimKey];
        const segments = dim.segments;

        return (
          <DimensionSection
            key={dimKey}
            dimKey={dimKey}
            label={dim.label}
            segments={segments}
            issueId={selectedIssue}
            selectedCohort={selectedCohort}
            openCohortAction={openCohortAction}
            closeCohortAction={closeCohortAction}
          />
        );
      })}
    </div>
  );
}

function DimensionSection({ dimKey, label, segments, issueId, selectedCohort, openCohortAction, closeCohortAction }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</h3>
      </div>
      <div className="p-5">
        <div className="flex gap-6">
          {/* Donut */}
          <div className="w-36 flex-shrink-0">
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={segments} dataKey="count" nameKey="name" innerRadius="50%" outerRadius="85%" paddingAngle={2}>
                    {segments.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val.toLocaleString(), name]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              {segments.map((seg, i) => (
                <div key={seg.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  <span className="text-[10px] text-slate-500 truncate">{seg.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 min-w-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 bg-slate-50/50">
                  <th className="text-left px-3 py-2 font-medium">Segment</th>
                  <th className="text-right px-3 py-2 font-medium">Count</th>
                  <th className="text-right px-3 py-2 font-medium">%</th>
                  <th className="text-right px-3 py-2 font-medium">Delta</th>
                  <th className="text-left px-3 py-2 font-medium">Insight</th>
                </tr>
              </thead>
              <tbody>
                {segments.map((seg) => {
                  const actionKey = `${issueId}__${dimKey}__${seg.name}`;
                  const hasAction = !!actionCards[actionKey];
                  const isExpanded = selectedCohort === actionKey;
                  const rag = getRag(seg.delta);

                  return (
                    <tr
                      key={seg.name}
                      onClick={hasAction ? () => (isExpanded ? closeCohortAction() : openCohortAction(actionKey)) : undefined}
                      className={`border-t border-slate-100 ${hasAction ? 'cursor-pointer hover:bg-blue-50/50' : ''} ${isExpanded ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="px-3 py-2 text-slate-700 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {hasAction && (
                            <svg className={`w-3 h-3 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                          {seg.name}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right text-slate-800 font-semibold tabular-nums">{seg.count.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right text-slate-600 tabular-nums">{seg.pct}%</td>
                      <td className={`px-3 py-2 text-right font-semibold tabular-nums ${seg.delta > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {seg.delta > 0 ? '+' : ''}{seg.delta}pp
                      </td>
                      <td className="px-3 py-2">
                        {seg.insightTrigger ? (
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${rag.color}`}>{seg.insightTrigger}</span>
                        ) : (
                          <span className="text-[10px] text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {segments.some((seg) => {
              const actionKey = `${issueId}__${dimKey}__${seg.name}`;
              return selectedCohort === actionKey && actionCards[actionKey];
            }) && (
              <div className="mt-3">
                <ActionCard card={actionCards[selectedCohort]} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
