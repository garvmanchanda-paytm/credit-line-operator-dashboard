import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { issueCategories } from '../mockData/issueCategories';
import { cohortBreakdowns } from '../mockData/cohortBreakdowns';
import { actionCards } from '../mockData/actionCards';
import ActionCard from './ActionCard';

const DONUT_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

function getRag(delta) {
  if (delta > 5) return { color: 'bg-red-100 text-red-700', label: 'RED' };
  if (delta > 0) return { color: 'bg-amber-100 text-amber-700', label: 'AMBER' };
  return { color: 'bg-emerald-100 text-emerald-700', label: 'GREEN' };
}

export default function CohortPanel() {
  const { selectedIssue, closeIssuePanel, selectedCohort, openCohortAction, closeCohortAction } = useDashboard();

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

  if (!selectedIssue) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={closeIssuePanel} />

      <div className="fixed top-0 right-0 bottom-0 w-1/2 bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-slate-200 flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900 truncate">
              {issue?.subCategory || selectedIssue}
            </h2>
            <p className="text-[11px] text-slate-400">
              {issue?.mtdCount.toLocaleString()} tickets MTD
              <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${getRag(issue?.pctShare > 10 ? 8 : 0).color}`}>
                {issue?.pctShare}% share
              </span>
            </p>
          </div>
          <button onClick={closeIssuePanel} className="text-slate-400 hover:text-slate-600 p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body — all dimensions stacked */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
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
      </div>
    </>
  );
}

function DimensionSection({ dimKey, label, segments, issueId, selectedCohort, openCohortAction, closeCohortAction }) {
  return (
    <div className="bg-slate-50/60 rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-200 bg-white">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</h3>
      </div>
      <div className="p-4">
        <div className="flex gap-4">
          {/* Mini donut */}
          <div className="w-28 flex-shrink-0">
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={segments} dataKey="count" nameKey="name" innerRadius="50%" outerRadius="85%" paddingAngle={2}>
                    {segments.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val.toLocaleString(), name]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-0.5 mt-1">
              {segments.map((seg, i) => (
                <div key={seg.name} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  <span className="text-[9px] text-slate-500 truncate">{seg.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 min-w-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500">
                  <th className="text-left px-2 py-1.5 font-medium">Segment</th>
                  <th className="text-right px-2 py-1.5 font-medium">Count</th>
                  <th className="text-right px-2 py-1.5 font-medium">%</th>
                  <th className="text-right px-2 py-1.5 font-medium">Delta</th>
                  <th className="text-left px-2 py-1.5 font-medium">Insight</th>
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
                      className={`border-t border-slate-200/60 ${hasAction ? 'cursor-pointer hover:bg-blue-50/50' : ''} ${isExpanded ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="px-2 py-1.5 text-slate-700 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {hasAction && (
                            <svg className={`w-3 h-3 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                          {seg.name}
                        </div>
                      </td>
                      <td className="px-2 py-1.5 text-right text-slate-800 font-semibold tabular-nums">{seg.count.toLocaleString()}</td>
                      <td className="px-2 py-1.5 text-right text-slate-600 tabular-nums">{seg.pct}%</td>
                      <td className={`px-2 py-1.5 text-right font-semibold tabular-nums ${seg.delta > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {seg.delta > 0 ? '+' : ''}{seg.delta}pp
                      </td>
                      <td className="px-2 py-1.5">
                        {seg.insightTrigger ? (
                          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${rag.color}`}>{seg.insightTrigger}</span>
                        ) : (
                          <span className="text-[10px] text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Inline action card if expanded */}
            {segments.some((seg) => {
              const actionKey = `${issueId}__${dimKey}__${seg.name}`;
              return selectedCohort === actionKey && actionCards[actionKey];
            }) && (
              <div className="mt-2">
                <ActionCard card={actionCards[selectedCohort]} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
