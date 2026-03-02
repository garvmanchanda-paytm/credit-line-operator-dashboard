import { useMemo, useState, useCallback, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { funnelMTD, funnelByLender, LENDER_OPTIONS } from '../mockData/funnelMTD';
import { funnelClosed } from '../mockData/funnelClosed';
import { dailyFunnel } from '../mockData/dailyFunnel';
import { allStages } from '../mockData/allStages';
import { subStageErrors } from '../mockData/logErrors';
import { apiHealth } from '../mockData/apiHealth';
import SubStageTable from '../components/SubStageTable';
import SelfieErrorBreakdown from '../components/SelfieErrorBreakdown';
import StageSummary from '../components/StageSummary';
import RAGBadge from '../components/RAGBadge';
import { getConversionRAG, formatNumber } from '../utils/rag';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const SYSTEM_KEYWORDS = ['5XX', 'TIMEOUT', 'API', 'RATE_LIMIT', 'SYNC', 'PARSE'];
const ROOT_CAUSE_OPTIONS = ['API Degradation', 'User Behavior', 'Config Change', 'External Factor', 'Data Issue'];
const CONFIDENCE_OPTIONS = ['High', 'Medium', 'Low'];
const STATUS_OPTIONS = ['Draft', 'Under Investigation', 'Confirmed', 'Ruled Out'];
const ACTION_TYPES = ['Raise Eng ticket', 'Product/UX change', 'Ops investigation', 'Monitor', 'Escalate'];

function isSystemError(errorCode) {
  const upper = errorCode.toUpperCase();
  return SYSTEM_KEYWORDS.some(kw => upper.includes(kw));
}

function readLS(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── R1: Problem Statement Banner ───────────────────────────────────────

function ProblemStatementBanner({ stageInfo, rag, subStages }) {
  if (rag !== 'red' && rag !== 'amber') return null;

  const delta = stageInfo.conversionRate != null && stageInfo.lmtdConvRate != null
    ? stageInfo.conversionRate - stageInfo.lmtdConvRate : null;
  if (delta == null) return null;

  const worst = subStages.length > 0
    ? subStages.reduce((a, b) => a.lmtdDelta < b.lmtdDelta ? a : b) : null;
  const impactPerDay = Math.round(stageInfo.count * Math.abs(delta) / 100 / 22);

  const borderColor = rag === 'red' ? 'border-red-300 bg-red-50/60' : 'border-amber-300 bg-amber-50/60';
  const textColor = rag === 'red' ? 'text-red-800' : 'text-amber-800';
  const iconColor = rag === 'red' ? 'text-red-500' : 'text-amber-500';

  return (
    <div className={`rounded-xl border-2 ${borderColor} p-4 flex items-start gap-3`}>
      <span className={`text-xl flex-shrink-0 ${iconColor}`}>{rag === 'red' ? '!!' : '!'}</span>
      <div>
        <p className={`text-sm font-semibold ${textColor}`}>
          {stageInfo.displayLabel} dropped {Math.abs(delta).toFixed(1)}pp vs LMTD.
          {worst && worst.lmtdDelta < -0.1 && (
            <> Primary driver: <span className="font-bold">{worst.displayLabel}</span> ({worst.lmtdDelta.toFixed(1)}pp).</>
          )}
          {' '}~{formatNumber(impactPerDay)} users/day affected.
        </p>
      </div>
    </div>
  );
}

// ─── R2: L2 Contribution Bars ───────────────────────────────────────────

function L2ContributionPanel({ subStages }) {
  if (subStages.length === 0) return null;

  const sorted = [...subStages].sort((a, b) => a.lmtdDelta - b.lmtdDelta);
  const maxAbsDelta = Math.max(...sorted.map(s => Math.abs(s.lmtdDelta)), 0.1);
  const worstIdx = sorted[0].lmtdDelta < 0 ? 0 : -1;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">L2 Delta Contribution</h3>
        <p className="text-[10px] text-slate-400 mt-0.5">Bar width proportional to delta magnitude vs LMTD</p>
      </div>
      <div className="divide-y divide-slate-50">
        {sorted.map((ss, idx) => {
          const isPrimary = idx === worstIdx;
          const barWidth = Math.max((Math.abs(ss.lmtdDelta) / maxAbsDelta) * 100, 3);
          const isNeg = ss.lmtdDelta < 0;
          const lmtdPct = ss.convRate - ss.lmtdDelta;

          return (
            <div
              key={ss.subStage}
              className={`px-5 py-2.5 flex items-center gap-4 ${isPrimary ? 'bg-red-50/50 border-l-4 border-red-400' : ''}`}
            >
              <div className="w-[140px] flex-shrink-0 flex items-center gap-2">
                <span className="text-xs font-medium text-slate-800 truncate">{ss.displayLabel}</span>
                {isPrimary && (
                  <span className="text-[9px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                    Primary Driver
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isNeg ? 'bg-red-400' : 'bg-emerald-400'}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
              <div className="w-[56px] text-right text-xs tabular-nums text-slate-600">{formatNumber(ss.mtdCount)}</div>
              <div className="w-[48px] text-right text-xs tabular-nums font-semibold text-slate-700">{ss.convRate.toFixed(1)}%</div>
              <div className="w-[48px] text-right text-xs tabular-nums text-slate-400">{lmtdPct.toFixed(1)}%</div>
              <div className={`w-[56px] text-right text-xs tabular-nums font-bold ${isNeg ? 'text-red-600' : ss.lmtdDelta > 0.1 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {ss.lmtdDelta > 0 ? '+' : ''}{ss.lmtdDelta.toFixed(1)}pp
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-5 py-2 border-t border-slate-100 flex gap-6 text-[10px] text-slate-400">
        <span>Sub-Stage</span>
        <span className="ml-auto flex gap-6">
          <span className="w-[56px] text-right">MTD Count</span>
          <span className="w-[48px] text-right">MTD%</span>
          <span className="w-[48px] text-right">LMTD%</span>
          <span className="w-[56px] text-right">Delta</span>
        </span>
      </div>
    </div>
  );
}

// ─── R3: Auto-Surfaced L3 Panel ─────────────────────────────────────────

const TREND_ICONS = {
  stable: { icon: '→', color: 'text-slate-400', label: 'Stable' },
  up:     { icon: '▲', color: 'text-red-500', label: 'Up' },
  down:   { icon: '▼', color: 'text-emerald-500', label: 'Down' },
  alert:  { icon: '▲', color: 'text-red-600 font-bold', label: 'ALERT' },
};

function AutoSurfacedL3({ subStages }) {
  const worstL2 = useMemo(() => {
    const negatives = subStages.filter(s => s.lmtdDelta < -0.3);
    if (negatives.length === 0) return null;
    return negatives.reduce((a, b) => a.lmtdDelta < b.lmtdDelta ? a : b);
  }, [subStages]);

  const errors = useMemo(() => {
    if (!worstL2) return null;
    const errs = subStageErrors[worstL2.subStage];
    if (!errs || errs.length === 0) return null;
    const system = errs.filter(e => isSystemError(e.errorCode));
    const userBehavior = errs.filter(e => !isSystemError(e.errorCode));
    return { system, userBehavior, total: errs };
  }, [worstL2]);

  if (!worstL2 || !errors) return null;

  const renderGroup = (title, items, icon) => {
    if (items.length === 0) return null;
    return (
      <div>
        <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>{icon}</span> {title}
        </h4>
        <div className="space-y-1.5">
          {items.map((err) => {
            const trend = TREND_ICONS[err.trendVsYesterday] || TREND_ICONS.stable;
            return (
              <div key={err.errorCode} className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg border border-slate-100">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800">{err.description}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{err.errorCode}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    This error contributes <span className="font-semibold">{err.pctOfFailures}%</span> to {worstL2.displayLabel} failures
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-slate-700 tabular-nums">{formatNumber(err.count)}</p>
                  <p className="text-[10px] text-slate-400">{err.pctOfFailures}%</p>
                </div>
                <div className={`flex-shrink-0 text-xs ${trend.color}`}>
                  {trend.icon} {trend.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
            L3 Errors — {worstL2.displayLabel}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Auto-surfaced: primary driver has {Math.abs(worstL2.lmtdDelta).toFixed(1)}pp drop vs LMTD
          </p>
        </div>
        <span className="text-[9px] font-bold text-red-700 bg-red-100 px-2 py-1 rounded">AUTO-EXPANDED</span>
      </div>
      {renderGroup('System Issues', errors.system, '⚙')}
      {renderGroup('User Behavior Issues', errors.userBehavior, '👤')}
    </div>
  );
}

// ─── R4: Hypothesis Workspace ───────────────────────────────────────────

function buildEvidenceOptions(stage, subStages) {
  const options = [];

  subStages.filter(s => Math.abs(s.lmtdDelta) > 0.3).forEach(s => {
    options.push(`${s.displayLabel} delta ${s.lmtdDelta > 0 ? '+' : ''}${s.lmtdDelta.toFixed(1)}pp`);
  });

  subStages.forEach(s => {
    const errs = subStageErrors[s.subStage];
    if (!errs) return;
    errs.filter(e => e.trendVsYesterday === 'up' || e.trendVsYesterday === 'alert').forEach(e => {
      options.push(`${e.errorCode} trending ${e.trendVsYesterday === 'alert' ? 'ALERT' : 'UP'}`);
    });
  });

  const api = apiHealth[stage];
  if (api) {
    if (api.p95Latency > 3000) options.push(`${api.apiName} p95 ${api.p95Latency}ms`);
    if (api.error5xxRate > 0.1) options.push(`${api.apiName} 5xx ${api.error5xxRate}%`);
    if (api.successRate < 98) options.push(`${api.apiName} success rate ${api.successRate}%`);
  }

  return options;
}

function HypothesisCard({ hyp, onUpdate, onDelete, evidenceOptions }) {
  const [editing, setEditing] = useState(!hyp.rootCauseCategory);

  const update = (field, value) => onUpdate({ ...hyp, [field]: value });

  const confidenceColors = { High: 'bg-red-100 text-red-700', Medium: 'bg-amber-100 text-amber-700', Low: 'bg-blue-100 text-blue-700' };
  const statusColors = { Draft: 'bg-slate-100 text-slate-600', 'Under Investigation': 'bg-blue-100 text-blue-700', Confirmed: 'bg-emerald-100 text-emerald-700', 'Ruled Out': 'bg-slate-100 text-slate-400 line-through' };

  if (!editing) {
    return (
      <div className={`border rounded-xl p-4 ${hyp.status === 'Ruled Out' ? 'border-slate-200 bg-slate-50/50 opacity-60' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${statusColors[hyp.status] || statusColors.Draft}`}>{hyp.status}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${confidenceColors[hyp.confidence] || confidenceColors.Low}`}>{hyp.confidence} confidence</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(true)} className="text-[10px] text-blue-600 hover:underline">Edit</button>
            <button onClick={onDelete} className="text-[10px] text-red-500 hover:underline">Delete</button>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-800">{hyp.rootCauseCategory}: {hyp.rootCauseText || '(no detail)'}</p>
        {hyp.evidence.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {hyp.evidence.map((e, i) => (
              <span key={i} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">{e}</span>
            ))}
          </div>
        )}
        <p className="text-[10px] text-slate-400 mt-2">{new Date(hyp.createdAt).toLocaleString()}</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-blue-200 bg-blue-50/30 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Root Cause Category</label>
          <select
            value={hyp.rootCauseCategory}
            onChange={(e) => update('rootCauseCategory', e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            {ROOT_CAUSE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Detail</label>
          <input
            type="text"
            value={hyp.rootCauseText}
            onChange={(e) => update('rootCauseText', e.target.value)}
            placeholder="Describe the suspected cause..."
            className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Confidence</label>
          <div className="flex gap-2">
            {CONFIDENCE_OPTIONS.map(c => (
              <label key={c} className="flex items-center gap-1 cursor-pointer">
                <input type="radio" name={`conf-${hyp.id}`} checked={hyp.confidence === c} onChange={() => update('confidence', c)} className="w-3 h-3" />
                <span className="text-xs text-slate-700">{c}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Status</label>
          <select
            value={hyp.status}
            onChange={(e) => update('status', e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Evidence (select from data signals)</label>
        <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
          {evidenceOptions.map((opt, i) => {
            const checked = hyp.evidence.includes(opt);
            return (
              <label key={i} className={`flex items-center gap-1 px-2 py-1 rounded-md border cursor-pointer text-[10px] transition-colors ${checked ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked ? hyp.evidence.filter(e => e !== opt) : [...hyp.evidence, opt];
                    update('evidence', next);
                  }}
                  className="w-3 h-3"
                />
                {opt}
              </label>
            );
          })}
          {evidenceOptions.length === 0 && <span className="text-[10px] text-slate-400">No data signals detected</span>}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-[10px] text-slate-400">{new Date(hyp.createdAt).toLocaleString()}</p>
        <button
          onClick={() => setEditing(false)}
          className="text-xs font-semibold text-white bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function HypothesisWorkspace({ stage, subStages, onLogEntry }) {
  const storageKey = `hypothesis_${stage}`;
  const [hypotheses, setHypotheses] = useState(() => readLS(storageKey));
  const evidenceOptions = useMemo(() => buildEvidenceOptions(stage, subStages), [stage, subStages]);

  const save = useCallback((next) => {
    setHypotheses(next);
    writeLS(storageKey, next);
  }, [storageKey]);

  const addHypothesis = () => {
    const newH = {
      id: Date.now().toString(),
      rootCauseCategory: '',
      rootCauseText: '',
      confidence: 'Medium',
      evidence: [],
      status: 'Draft',
      createdAt: new Date().toISOString(),
    };
    save([newH, ...hypotheses]);
  };

  const updateHyp = (updated) => {
    const next = hypotheses.map(h => h.id === updated.id ? updated : h);
    save(next);
    onLogEntry({ type: 'Hypothesis', summary: `${updated.rootCauseCategory}: ${updated.rootCauseText || '(no detail)'} [${updated.status}]`, timestamp: new Date().toISOString() });
  };

  const deleteHyp = (id) => {
    save(hypotheses.filter(h => h.id !== id));
  };

  const metrics = useMemo(() => {
    const open = hypotheses.filter(h => h.status === 'Draft' || h.status === 'Under Investigation').length;
    const confirmed = hypotheses.filter(h => h.status === 'Confirmed').length;
    const ruledOut = hypotheses.filter(h => h.status === 'Ruled Out').length;
    return { open, confirmed, ruledOut };
  }, [hypotheses]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Hypothesis Workspace</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Form and track root cause theories with evidence from this page</p>
          </div>
          {hypotheses.length > 0 && (
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">{metrics.open} Open</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">{metrics.confirmed} Confirmed</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500">{metrics.ruledOut} Ruled Out</span>
            </div>
          )}
        </div>
        <button
          onClick={addHypothesis}
          className="text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
        >
          + Add Hypothesis
        </button>
      </div>
      {hypotheses.length === 0 && (
        <p className="text-xs text-slate-400 text-center py-4">No hypotheses yet. Click "Add Hypothesis" to start investigating.</p>
      )}
      <div className="space-y-3">
        {hypotheses.map(h => (
          <HypothesisCard
            key={h.id}
            hyp={h}
            onUpdate={updateHyp}
            onDelete={() => deleteHyp(h.id)}
            evidenceOptions={evidenceOptions}
          />
        ))}
      </div>
    </div>
  );
}

// ─── R5: Next Action Planner ────────────────────────────────────────────

function NextActionPlanner({ stage, onLogEntry }) {
  const storageKey = `action_${stage}`;
  const [actions, setActions] = useState(() => readLS(storageKey));
  const [form, setForm] = useState({ actionType: '', owner: '', targetDate: '', ticketLink: '', notes: '' });
  const [showForm, setShowForm] = useState(false);

  const saveAction = () => {
    if (!form.actionType) return;
    const entry = { ...form, id: Date.now().toString(), savedAt: new Date().toISOString() };
    const next = [entry, ...actions];
    setActions(next);
    writeLS(storageKey, next);
    onLogEntry({ type: 'Action', summary: `${entry.actionType} — Owner: ${entry.owner || 'Unassigned'}${entry.targetDate ? ` — Due: ${entry.targetDate}` : ''}`, timestamp: entry.savedAt });
    setForm({ actionType: '', owner: '', targetDate: '', ticketLink: '', notes: '' });
    setShowForm(false);
  };

  const deleteAction = (id) => {
    const next = actions.filter(a => a.id !== id);
    setActions(next);
    writeLS(storageKey, next);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Next Actions</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Track follow-up actions with owner and due date</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Action'}
        </button>
      </div>

      {showForm && (
        <div className="border-2 border-emerald-200 bg-emerald-50/30 rounded-xl p-4 space-y-3">
          <div>
            <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1.5">Action Type</label>
            <div className="flex flex-wrap gap-2">
              {ACTION_TYPES.map(t => (
                <label key={t} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border cursor-pointer text-xs transition-colors ${form.actionType === t ? 'border-emerald-400 bg-emerald-100 text-emerald-800 font-semibold' : 'border-slate-200 bg-white text-slate-600'}`}>
                  <input type="radio" name="actionType" checked={form.actionType === t} onChange={() => setForm(f => ({ ...f, actionType: t }))} className="w-3 h-3" />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Owner</label>
              <input type="text" value={form.owner} onChange={(e) => setForm(f => ({ ...f, owner: e.target.value }))} placeholder="e.g., Garv" className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Target Date</label>
              <input type="date" value={form.targetDate} onChange={(e) => setForm(f => ({ ...f, targetDate: e.target.value }))} className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Ticket Link</label>
              <input type="url" value={form.ticketLink} onChange={(e) => setForm(f => ({ ...f, ticketLink: e.target.value }))} placeholder="https://jira.example.com/..." className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Notes (optional)</label>
            <textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional context..." rows={2} className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex justify-end">
            <button
              onClick={saveAction}
              disabled={!form.actionType}
              className="text-xs font-semibold text-white bg-emerald-600 px-4 py-1.5 rounded-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Save Action
            </button>
          </div>
        </div>
      )}

      {actions.length > 0 && (
        <div className="space-y-2">
          {actions.map(a => (
            <div key={a.id} className="flex items-start gap-3 bg-slate-50/60 rounded-lg px-3 py-2 border border-slate-100">
              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">{a.actionType}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  {a.owner && <span className="font-medium text-slate-700">Owner: {a.owner}</span>}
                  {a.targetDate && <span className="text-slate-500">Due: {a.targetDate}</span>}
                  {a.ticketLink && <a href={a.ticketLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{a.ticketLink}</a>}
                </div>
                {a.notes && <p className="text-[11px] text-slate-500 mt-0.5">{a.notes}</p>}
                <p className="text-[10px] text-slate-400 mt-0.5">{new Date(a.savedAt).toLocaleString()}</p>
              </div>
              <button onClick={() => deleteAction(a.id)} className="text-[10px] text-red-400 hover:text-red-600 flex-shrink-0">Delete</button>
            </div>
          ))}
        </div>
      )}

      {actions.length === 0 && !showForm && (
        <p className="text-xs text-slate-400 text-center py-3">No actions recorded yet.</p>
      )}
    </div>
  );
}

// ─── R6: Investigation Log ──────────────────────────────────────────────

function InvestigationLog({ stage }) {
  const storageKey = `log_${stage}`;
  const [entries, setEntries] = useState(() => readLS(storageKey));
  const [collapsed, setCollapsed] = useState(entries.length > 5);

  useEffect(() => {
    setEntries(readLS(storageKey));
  }, [storageKey]);

  const typeBadge = {
    Hypothesis: 'bg-purple-100 text-purple-700',
    Action: 'bg-emerald-100 text-emerald-700',
    Alert: 'bg-red-100 text-red-700',
  };

  const displayed = collapsed ? entries.slice(0, 5) : entries;

  if (entries.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full px-5 py-3 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
      >
        <div>
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Investigation Log</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">{entries.length} entries — reverse chronological</p>
        </div>
        <span className={`text-slate-400 transition-transform ${collapsed ? '' : 'rotate-180'}`}>▾</span>
      </button>
      <div className="divide-y divide-slate-50">
        {displayed.map((entry, idx) => (
          <div key={idx} className="px-5 py-2.5 flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 flex flex-col items-center">
              <span className={`w-2 h-2 rounded-full ${entry.type === 'Hypothesis' ? 'bg-purple-400' : entry.type === 'Action' ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {idx < displayed.length - 1 && <span className="w-px h-6 bg-slate-200 mt-1" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${typeBadge[entry.type] || typeBadge.Alert}`}>{entry.type}</span>
                <span className="text-[10px] text-slate-400">{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-700">{entry.summary}</p>
            </div>
          </div>
        ))}
      </div>
      {entries.length > 5 && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full px-5 py-2 text-[10px] text-blue-600 font-semibold hover:bg-slate-50/50 transition-colors border-t border-slate-100"
        >
          {collapsed ? `Show all ${entries.length} entries` : 'Collapse'}
        </button>
      )}
    </div>
  );
}

// ─── Retained: MiniTrend ────────────────────────────────────────────────

function MiniTrend({ stage }) {
  const trendData = useMemo(() => {
    const last7 = dailyFunnel.slice(-7);
    return last7.map(day => ({
      date: day.date.split('-')[2],
      conversion: day[stage]?.conversion ?? 0,
      count: day[stage]?.count ?? 0,
    }));
  }, [stage]);

  return (
    <div className="h-[140px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ fontSize: 11, border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 10px' }}
            formatter={(value) => [`${value.toFixed(1)}%`, 'Conv']}
          />
          <Line type="monotone" dataKey="conversion" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Lender Comparison ──────────────────────────────────────────────────

function LenderComparisonPanel({ stageName }) {
  const lenderData = useMemo(() => {
    return LENDER_OPTIONS.filter(l => l !== 'ALL').map(lender => {
      const src = funnelByLender[lender] || [];
      const stage = src.find(s => s.stage === stageName);
      if (!stage) return null;
      const delta = stage.conversionRate != null && stage.lmtdConvRate != null
        ? stage.conversionRate - stage.lmtdConvRate : null;
      return { lender, ...stage, delta };
    }).filter(Boolean);
  }, [stageName]);

  const allSrc = funnelByLender.ALL || [];
  const allStage = allSrc.find(s => s.stage === stageName);
  const allDelta = allStage?.conversionRate != null && allStage?.lmtdConvRate != null
    ? allStage.conversionRate - allStage.lmtdConvRate : null;

  if (lenderData.length === 0) return null;

  const maxCount = Math.max(...lenderData.map(d => d.count), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Performance Comparison across Lenders</h3>
        <p className="text-[10px] text-slate-400 mt-0.5">How this stage performs in each lender funnel vs the overall benchmark</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Lender</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">MTD Count</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-left" style={{ width: '25%' }}>Volume</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Step Conv%</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">LMTD Conv%</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Delta</th>
              <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">vs Overall</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {lenderData.map(d => {
              const barW = (d.count / maxCount) * 100;
              const deltaColor = d.delta != null ? (d.delta > 0 ? 'text-emerald-600' : d.delta < -0.5 ? 'text-red-600' : 'text-slate-400') : 'text-slate-300';
              const vsBenchmark = d.conversionRate != null && allStage?.conversionRate != null
                ? d.conversionRate - allStage.conversionRate : null;
              const vsColor = vsBenchmark != null ? (vsBenchmark > 0.5 ? 'text-emerald-600 bg-emerald-50' : vsBenchmark < -0.5 ? 'text-red-600 bg-red-50' : 'text-slate-500 bg-slate-50') : '';
              return (
                <tr key={d.lender} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-sm font-semibold text-slate-800">{d.lender}</span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-700">{formatNumber(d.count)}</td>
                  <td className="px-4 py-3">
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${barW}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-800">
                    {d.conversionRate != null && d.conversionRate <= 100 ? `${d.conversionRate.toFixed(1)}%` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400">
                    {d.lmtdConvRate != null ? `${d.lmtdConvRate.toFixed(1)}%` : '—'}
                  </td>
                  <td className={`px-4 py-3 text-right tabular-nums font-bold ${deltaColor}`}>
                    {d.delta != null ? `${d.delta > 0 ? '+' : ''}${d.delta.toFixed(1)}pp` : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {vsBenchmark != null ? (
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${vsColor}`}>
                        {vsBenchmark > 0 ? '+' : ''}{vsBenchmark.toFixed(1)}pp
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {allStage && (
        <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center gap-4 text-[10px] text-slate-400">
          <span>Overall benchmark: <span className="font-semibold text-slate-600">{allStage.conversionRate?.toFixed(1)}%</span> Step Conv</span>
          {allDelta != null && <span>Overall delta: <span className={`font-semibold ${allDelta > 0 ? 'text-emerald-600' : allDelta < -0.5 ? 'text-red-600' : 'text-slate-500'}`}>{allDelta > 0 ? '+' : ''}{allDelta.toFixed(1)}pp</span></span>}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────

export default function StageDetailPage() {
  const { drillDownStage, navigateBackFromStageDetail, funnelType, navigateToLeadDeepDive, navigateToSubStageDeepDive } = useDashboard();

  const stageInfo = useMemo(() => {
    if (!drillDownStage) return null;
    const source = funnelType === 'open' ? funnelMTD : funnelClosed;
    return source.find(s => s.stage === drillDownStage);
  }, [drillDownStage, funnelType]);

  const subStages = useMemo(() => {
    if (!drillDownStage) return [];
    return allStages.filter(s => s.parentStage === drillDownStage);
  }, [drillDownStage]);

  const appendLogEntry = useCallback((entry) => {
    if (!drillDownStage) return;
    const key = `log_${drillDownStage}`;
    const existing = readLS(key);
    writeLS(key, [entry, ...existing]);
  }, [drillDownStage]);

  if (!drillDownStage || !stageInfo) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-sm">No stage selected.</p>
        <button onClick={navigateBackFromStageDetail} className="text-blue-600 hover:underline text-sm mt-2">
          &larr; Back to Funnel
        </button>
      </div>
    );
  }

  const lmtdConv = stageInfo.lmtdConvRate;
  const rag = stageInfo.conversionRate != null
    ? getConversionRAG(stageInfo.conversionRate, lmtdConv)
    : 'gray';

  const isSelfieStage = drillDownStage === 'SELFIE_CAPTURED';

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={navigateBackFromStageDetail} className="hover:text-blue-600 transition-colors">Dashboard</button>
        <span>/</span>
        <button onClick={navigateBackFromStageDetail} className="hover:text-blue-600 transition-colors">Funnel</button>
        <span>/</span>
        <span className="text-slate-900 font-medium">{stageInfo.displayLabel}</span>
      </nav>

      {/* Stage Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{stageInfo.displayLabel}</h1>
            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">{stageInfo.stage}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{formatNumber(stageInfo.count)}</p>
              <p className="text-[11px] text-slate-400">Feb MTD</p>
            </div>
            {stageInfo.conversionRate != null && stageInfo.conversionRate <= 100 && (
              <div className="text-right">
                <p className="text-lg font-bold text-slate-700">{stageInfo.conversionRate.toFixed(1)}%</p>
                <p className="text-[11px] text-slate-400">Step Conv</p>
              </div>
            )}
            <RAGBadge status={rag} />
          </div>
        </div>
      </div>

      {/* R1: Problem Statement Banner */}
      <ProblemStatementBanner stageInfo={stageInfo} rag={rag} subStages={subStages} />

      {/* Auto-generated summary */}
      <StageSummary stage={drillDownStage} />

      {/* 7-Day Trend */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">7-Day Trend</h3>
        <MiniTrend stage={drillDownStage} />
      </div>

      {/* R2: L2 Contribution Bars */}
      <L2ContributionPanel subStages={subStages} />

      {/* Performance Comparison across Lenders */}
      <LenderComparisonPanel stageName={drillDownStage} />

      {/* L2 Sub-Stages (existing table with expand) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">L2 Sub-Stages</h3>
          <button
            onClick={() => navigateToSubStageDeepDive(drillDownStage)}
            className="text-[10px] font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Open in Deep Dive →
          </button>
        </div>
        <SubStageTable parentStage={drillDownStage} onOpenLeadDeepDive={navigateToLeadDeepDive} />
        {isSelfieStage && <SelfieErrorBreakdown />}
      </div>

      {/* R3: Auto-Surfaced L3 */}
      <AutoSurfacedL3 subStages={subStages} />

      {/* R4: Hypothesis Workspace */}
      <HypothesisWorkspace stage={drillDownStage} subStages={subStages} onLogEntry={appendLogEntry} />

      {/* R5: Next Action Planner */}
      <NextActionPlanner stage={drillDownStage} onLogEntry={appendLogEntry} />

      {/* R6: Investigation Log */}
      <InvestigationLog stage={drillDownStage} />
    </div>
  );
}
