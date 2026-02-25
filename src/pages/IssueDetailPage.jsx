import { useMemo, useState, useCallback, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { issueCategories } from '../mockData/issueCategories';
import { cohortBreakdowns } from '../mockData/cohortBreakdowns';
import { actionCards } from '../mockData/actionCards';
import ActionCard from '../components/ActionCard';

const DONUT_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];
const DELTA_THRESHOLD = 2;

const ROOT_CAUSE_OPTIONS = ['UX', 'Pricing', 'Communication', 'Product Bug', 'Eligibility', 'External'];
const CONFIDENCE_OPTIONS = ['High', 'Medium', 'Low'];
const STATUS_OPTIONS = ['Draft', 'Under Investigation', 'Confirmed', 'Ruled Out'];
const SOP_TYPES = [
  { key: 'communication', label: 'Communication fix', desc: 'Trigger comms to affected segment' },
  { key: 'product_ux', label: 'Product/UX change', desc: 'Raise with product team' },
  { key: 'pricing', label: 'Pricing review', desc: 'Escalate to pricing' },
  { key: 'ops', label: 'Ops intervention', desc: 'Manual fix/retry for stuck users' },
  { key: 'monitor', label: 'Monitor', desc: 'No action, watch trend' },
  { key: 'escalate', label: 'Escalate to leadership', desc: 'Raise to leadership for decision' },
];

function readLS(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getRag(delta) {
  if (delta > 5) return { color: 'bg-red-100 text-red-700', label: 'RED' };
  if (delta > 0) return { color: 'bg-amber-100 text-amber-700', label: 'AMBER' };
  return { color: 'bg-emerald-100 text-emerald-700', label: 'GREEN' };
}

// ─── Helpers: extract signals from cohort data ──────────────────────────

function extractAllSignals(cohortData) {
  if (!cohortData) return { elevated: [], triggers: [], crossPatterns: [] };

  const elevated = [];
  const triggerMap = {};

  for (const [dimKey, dim] of Object.entries(cohortData)) {
    for (const seg of dim.segments) {
      if (seg.delta > DELTA_THRESHOLD) {
        elevated.push({ ...seg, dimKey, dimLabel: dim.label });
      }
      if (seg.insightTrigger && seg.delta > 0) {
        const trigger = seg.insightTrigger;
        if (!triggerMap[trigger]) triggerMap[trigger] = [];
        triggerMap[trigger].push({ segName: seg.name, dimLabel: dim.label, delta: seg.delta });
      }
    }
  }

  const triggers = Object.entries(triggerMap)
    .map(([theme, sources]) => ({ theme, sources, count: sources.length }))
    .sort((a, b) => b.count - a.count);

  // Cross-cohort: find segment names that appear elevated across multiple dimensions
  const segCounts = {};
  for (const e of elevated) {
    if (!segCounts[e.name]) segCounts[e.name] = { dims: [], totalDelta: 0 };
    segCounts[e.name].dims.push(e.dimLabel);
    segCounts[e.name].totalDelta += e.delta;
  }
  const crossPatterns = Object.entries(segCounts)
    .filter(([, v]) => v.dims.length >= 2)
    .map(([name, v]) => ({ name, dims: v.dims, dimCount: v.dims.length, totalDelta: v.totalDelta }))
    .sort((a, b) => b.dimCount - a.dimCount || b.totalDelta - a.totalDelta);

  return { elevated, triggers, crossPatterns };
}

function buildEvidenceOptions(cohortData) {
  if (!cohortData) return [];
  const options = [];
  for (const [, dim] of Object.entries(cohortData)) {
    for (const seg of dim.segments) {
      if (Math.abs(seg.delta) > 1) {
        options.push(`${seg.name} in ${dim.label}: ${seg.delta > 0 ? '+' : ''}${seg.delta}pp`);
      }
      if (seg.insightTrigger) {
        options.push(`Insight: ${seg.insightTrigger} (${seg.name})`);
      }
    }
  }
  return options;
}

// ─── R1: Cohort Signal Summary Banner ───────────────────────────────────

function CohortSignalBanner({ signals }) {
  const { elevated, triggers } = signals;

  if (elevated.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex items-start gap-3">
        <span className="text-slate-400 text-lg flex-shrink-0">i</span>
        <p className="text-sm text-slate-600">No dominant cohort pattern detected. Manual hypothesis recommended.</p>
      </div>
    );
  }

  const topTrigger = triggers[0];
  const topSegments = elevated.slice(0, 2);

  return (
    <div className="rounded-xl border-2 border-amber-300 bg-amber-50/60 p-4 flex items-start gap-3">
      <span className="text-amber-500 text-xl flex-shrink-0 font-bold">!</span>
      <div>
        <p className="text-sm font-semibold text-amber-900">
          {elevated.length} cohort signal{elevated.length > 1 ? 's' : ''}
          {topTrigger && <> pointing to <span className="font-bold underline decoration-amber-400">{topTrigger.theme}</span></>}.
          {' '}Key segments:{' '}
          {topSegments.map((s, i) => (
            <span key={i}>
              {i > 0 && ', '}
              <span className="font-bold">{s.name}</span> (+{s.delta}pp in {s.dimLabel})
            </span>
          ))}.
        </p>
        <p className="text-xs text-amber-700 mt-1">Suggested starting hypothesis available below.</p>
      </div>
    </div>
  );
}

// ─── R2: Cross-Cohort Pattern Panel ─────────────────────────────────────

function CrossCohortPanel({ patterns }) {
  if (patterns.length === 0) return null;

  const strengthBadge = (count) => {
    if (count >= 4) return { color: 'bg-red-100 text-red-700', label: 'Strong' };
    if (count >= 3) return { color: 'bg-amber-100 text-amber-700', label: 'Moderate' };
    return { color: 'bg-blue-100 text-blue-700', label: 'Weak' };
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Cross-Cohort Patterns</h3>
        <p className="text-[10px] text-slate-400 mt-0.5">Segments elevated (delta &gt; {DELTA_THRESHOLD}pp) across multiple dimensions — shortcut to the likely user persona</p>
      </div>
      <div className="divide-y divide-slate-50">
        {patterns.map((p) => {
          const badge = strengthBadge(p.dimCount);
          return (
            <div key={p.name} className="px-5 py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Elevated in {p.dimCount} of {Object.keys(cohortBreakdowns).length > 0 ? 'multiple' : '0'} dimensions: {p.dims.join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold text-slate-600 tabular-nums">+{p.totalDelta.toFixed(1)}pp combined</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${badge.color}`}>{badge.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── R3: Hypothesis Workspace (with pre-fills) ─────────────────────────

function HypothesisCard({ hyp, onUpdate, onDelete, evidenceOptions }) {
  const [editing, setEditing] = useState(!hyp.rootCauseCategory);

  const update = (field, value) => onUpdate({ ...hyp, [field]: value });

  const confidenceColors = { High: 'bg-red-100 text-red-700', Medium: 'bg-amber-100 text-amber-700', Low: 'bg-blue-100 text-blue-700' };
  const statusColors = { Draft: 'bg-slate-100 text-slate-600', 'Under Investigation': 'bg-blue-100 text-blue-700', Confirmed: 'bg-emerald-100 text-emerald-700', 'Ruled Out': 'bg-slate-100 text-slate-400 line-through' };

  if (!editing) {
    return (
      <div className={`border rounded-xl p-4 ${hyp.status === 'Ruled Out' ? 'border-slate-200 bg-slate-50/50 opacity-60' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${statusColors[hyp.status] || statusColors.Draft}`}>{hyp.status}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${confidenceColors[hyp.confidence] || confidenceColors.Low}`}>{hyp.confidence} confidence</span>
            {hyp.suggested && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">Suggested from {hyp.signalCount} cohort signals</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(true)} className="text-[10px] text-blue-600 hover:underline">Edit</button>
            <button onClick={onDelete} className="text-[10px] text-red-500 hover:underline">Delete</button>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-800">{hyp.rootCauseCategory}: {hyp.rootCauseText || '(no detail)'}</p>
        {hyp.targetSegment && <p className="text-xs text-slate-600 mt-1">Target segment: <span className="font-medium">{hyp.targetSegment}</span></p>}
        {hyp.evidence.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {hyp.evidence.map((e, i) => <span key={i} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">{e}</span>)}
          </div>
        )}
        <p className="text-[10px] text-slate-400 mt-2">{new Date(hyp.createdAt).toLocaleString()}</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-blue-200 bg-blue-50/30 rounded-xl p-4 space-y-3">
      {hyp.suggested && <p className="text-[10px] font-bold text-purple-600">Pre-filled from {hyp.signalCount} cohort signals — edit or accept</p>}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Root Cause Category</label>
          <select value={hyp.rootCauseCategory} onChange={(e) => update('rootCauseCategory', e.target.value)} className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select...</option>
            {ROOT_CAUSE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Detail</label>
          <input type="text" value={hyp.rootCauseText} onChange={(e) => update('rootCauseText', e.target.value)} placeholder="Describe the suspected cause..." className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Target User Segment</label>
        <input type="text" value={hyp.targetSegment} onChange={(e) => update('targetSegment', e.target.value)} placeholder="e.g., New users (<30 days) with MPIN not set" className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
          <select value={hyp.status} onChange={(e) => update('status', e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Evidence (select from cohort signals)</label>
        <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
          {evidenceOptions.map((opt, i) => {
            const checked = hyp.evidence.includes(opt);
            return (
              <label key={i} className={`flex items-center gap-1 px-2 py-1 rounded-md border cursor-pointer text-[10px] transition-colors ${checked ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                <input type="checkbox" checked={checked} onChange={() => { const next = checked ? hyp.evidence.filter(e => e !== opt) : [...hyp.evidence, opt]; update('evidence', next); }} className="w-3 h-3" />
                {opt}
              </label>
            );
          })}
          {evidenceOptions.length === 0 && <span className="text-[10px] text-slate-400">No signals detected</span>}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-[10px] text-slate-400">{new Date(hyp.createdAt).toLocaleString()}</p>
        <button onClick={() => setEditing(false)} className="text-xs font-semibold text-white bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors">Done</button>
      </div>
    </div>
  );
}

function HypothesisWorkspace({ issueId, signals, evidenceOptions, onLogEntry }) {
  const storageKey = `hypothesis_issue_${issueId}`;
  const [hypotheses, setHypotheses] = useState(() => readLS(storageKey));

  const save = useCallback((next) => {
    setHypotheses(next);
    writeLS(storageKey, next);
  }, [storageKey]);

  const addHypothesis = () => {
    const { triggers, crossPatterns, elevated } = signals;
    const topTrigger = triggers[0];
    const topPattern = crossPatterns[0];

    const prefill = {
      rootCauseCategory: topTrigger ? (topTrigger.theme.toLowerCase().includes('pricing') || topTrigger.theme.toLowerCase().includes('fee') ? 'Pricing' : topTrigger.theme.toLowerCase().includes('bug') ? 'Product Bug' : topTrigger.theme.toLowerCase().includes('ux') || topTrigger.theme.toLowerCase().includes('confusion') ? 'UX' : 'Communication') : '',
      rootCauseText: topTrigger ? topTrigger.theme : '',
      targetSegment: topPattern ? topPattern.name : (elevated[0]?.name || ''),
      evidence: elevated.slice(0, 3).map(e => `${e.name} in ${e.dimLabel}: +${e.delta}pp`),
      suggested: elevated.length > 0,
      signalCount: elevated.length,
    };

    const newH = {
      id: Date.now().toString(),
      ...prefill,
      confidence: 'Medium',
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

  const deleteHyp = (id) => save(hypotheses.filter(h => h.id !== id));

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
            <p className="text-[10px] text-slate-400 mt-0.5">New hypotheses are pre-filled from cohort signals — edit or accept</p>
          </div>
          {hypotheses.length > 0 && (
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">{metrics.open} Open</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">{metrics.confirmed} Confirmed</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500">{metrics.ruledOut} Ruled Out</span>
            </div>
          )}
        </div>
        <button onClick={addHypothesis} className="text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">+ Add Hypothesis</button>
      </div>
      {hypotheses.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No hypotheses yet. Click "Add Hypothesis" to get a pre-filled card from cohort signals.</p>}
      <div className="space-y-3">
        {hypotheses.map(h => <HypothesisCard key={h.id} hyp={h} onUpdate={updateHyp} onDelete={() => deleteHyp(h.id)} evidenceOptions={evidenceOptions} />)}
      </div>
    </div>
  );
}

// ─── R4: SOP Selector ───────────────────────────────────────────────────

function SOPSelector({ issueId, signals, onLogEntry }) {
  const storageKey = `sop_issue_${issueId}`;
  const [sops, setSops] = useState(() => readLS(storageKey));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ sopType: '', affectedSegment: '', proposedAction: '', owner: '', targetDate: '', successMetric: '' });

  const topPattern = signals.crossPatterns[0];

  const selectSOP = (key) => {
    setForm(f => ({
      ...f,
      sopType: key,
      affectedSegment: topPattern ? topPattern.name : (signals.elevated[0]?.name || ''),
    }));
    setShowForm(true);
  };

  const saveSOP = () => {
    if (!form.sopType) return;
    const entry = { ...form, id: Date.now().toString(), savedAt: new Date().toISOString() };
    const next = [entry, ...sops];
    setSops(next);
    writeLS(storageKey, next);
    const sopLabel = SOP_TYPES.find(s => s.key === form.sopType)?.label || form.sopType;
    onLogEntry({ type: 'SOP', summary: `${sopLabel} — Segment: ${entry.affectedSegment || 'N/A'} — Owner: ${entry.owner || 'Unassigned'}`, timestamp: entry.savedAt });
    setForm({ sopType: '', affectedSegment: '', proposedAction: '', owner: '', targetDate: '', successMetric: '' });
    setShowForm(false);
  };

  const deleteSOP = (id) => {
    const next = sops.filter(s => s.id !== id);
    setSops(next);
    writeLS(storageKey, next);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Response Playbook (SOP)</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Select a standard response template for this issue pattern</p>
        </div>
      </div>

      {!showForm && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {SOP_TYPES.map(sop => (
            <button
              key={sop.key}
              onClick={() => selectSOP(sop.key)}
              className="text-left border border-slate-200 rounded-lg p-3 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors group"
            >
              <p className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700">{sop.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{sop.desc}</p>
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <div className="border-2 border-emerald-200 bg-emerald-50/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-700">{SOP_TYPES.find(s => s.key === form.sopType)?.label}</span>
            <button onClick={() => setShowForm(false)} className="text-[10px] text-slate-400 hover:text-slate-600">Cancel</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Affected Segment</label>
              <input type="text" value={form.affectedSegment} onChange={(e) => setForm(f => ({ ...f, affectedSegment: e.target.value }))} placeholder="Pre-filled from hypothesis" className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Owner</label>
              <input type="text" value={form.owner} onChange={(e) => setForm(f => ({ ...f, owner: e.target.value }))} placeholder="e.g., Garv" className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Proposed Action</label>
            <textarea value={form.proposedAction} onChange={(e) => setForm(f => ({ ...f, proposedAction: e.target.value }))} placeholder="What specific action should be taken?" rows={2} className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Target Date</label>
              <input type="date" value={form.targetDate} onChange={(e) => setForm(f => ({ ...f, targetDate: e.target.value }))} className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide block mb-1">Success Metric</label>
              <input type="text" value={form.successMetric} onChange={(e) => setForm(f => ({ ...f, successMetric: e.target.value }))} placeholder="This issue is resolved when [metric] reaches [target]" className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={saveSOP} disabled={!form.sopType} className="text-xs font-semibold text-white bg-emerald-600 px-4 py-1.5 rounded-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Save SOP</button>
          </div>
        </div>
      )}

      {sops.length > 0 && (
        <div className="space-y-2 mt-2">
          <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Saved SOPs</h4>
          {sops.map(s => {
            const sopLabel = SOP_TYPES.find(t => t.key === s.sopType)?.label || s.sopType;
            return (
              <div key={s.id} className="bg-slate-50/60 rounded-lg px-3 py-2 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">{sopLabel}</span>
                  <button onClick={() => deleteSOP(s.id)} className="text-[10px] text-red-400 hover:text-red-600">Delete</button>
                </div>
                <div className="text-xs text-slate-700 space-y-0.5">
                  {s.affectedSegment && <p><span className="font-medium">Segment:</span> {s.affectedSegment}</p>}
                  {s.proposedAction && <p><span className="font-medium">Action:</span> {s.proposedAction}</p>}
                  {s.owner && <p><span className="font-medium">Owner:</span> {s.owner} {s.targetDate && <span className="text-slate-400">| Due: {s.targetDate}</span>}</p>}
                  {s.successMetric && <p><span className="font-medium">Success metric:</span> {s.successMetric}</p>}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{new Date(s.savedAt).toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── R5: Investigation Log ──────────────────────────────────────────────

function InvestigationLog({ issueId }) {
  const storageKey = `log_issue_${issueId}`;
  const [entries, setEntries] = useState(() => readLS(storageKey));
  const [collapsed, setCollapsed] = useState(entries.length > 5);

  useEffect(() => {
    setEntries(readLS(storageKey));
  }, [storageKey]);

  const typeBadge = {
    Hypothesis: 'bg-purple-100 text-purple-700',
    SOP: 'bg-emerald-100 text-emerald-700',
  };

  const displayed = collapsed ? entries.slice(0, 5) : entries;
  if (entries.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button onClick={() => setCollapsed(!collapsed)} className="w-full px-5 py-3 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors">
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
              <span className={`w-2 h-2 rounded-full ${entry.type === 'Hypothesis' ? 'bg-purple-400' : 'bg-emerald-400'}`} />
              {idx < displayed.length - 1 && <span className="w-px h-6 bg-slate-200 mt-1" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${typeBadge[entry.type] || 'bg-slate-100 text-slate-600'}`}>{entry.type}</span>
                <span className="text-[10px] text-slate-400">{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-700">{entry.summary}</p>
            </div>
          </div>
        ))}
      </div>
      {entries.length > 5 && (
        <button onClick={() => setCollapsed(!collapsed)} className="w-full px-5 py-2 text-[10px] text-blue-600 font-semibold hover:bg-slate-50/50 transition-colors border-t border-slate-100">
          {collapsed ? `Show all ${entries.length} entries` : 'Collapse'}
        </button>
      )}
    </div>
  );
}

// ─── Retained: DimensionSection ─────────────────────────────────────────

function DimensionSection({ dimKey, label, segments, issueId, selectedCohort, openCohortAction, closeCohortAction }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</h3>
      </div>
      <div className="p-5">
        <div className="flex gap-6">
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
                    <tr key={seg.name} onClick={hasAction ? () => (isExpanded ? closeCohortAction() : openCohortAction(actionKey)) : undefined} className={`border-t border-slate-100 ${hasAction ? 'cursor-pointer hover:bg-blue-50/50' : ''} ${isExpanded ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-3 py-2 text-slate-700 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {hasAction && (
                            <svg className={`w-3 h-3 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                          )}
                          {seg.name}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right text-slate-800 font-semibold tabular-nums">{seg.count.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right text-slate-600 tabular-nums">{seg.pct}%</td>
                      <td className={`px-3 py-2 text-right font-semibold tabular-nums ${seg.delta > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{seg.delta > 0 ? '+' : ''}{seg.delta}pp</td>
                      <td className="px-3 py-2">
                        {seg.insightTrigger ? <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${rag.color}`}>{seg.insightTrigger}</span> : <span className="text-[10px] text-slate-300">—</span>}
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
              <div className="mt-3"><ActionCard card={actionCards[selectedCohort]} /></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────

// ─── Lender Comparison for Issues ───────────────────────────────────────

function IssueLenderComparisonPanel({ issue }) {
  const lenderBreakdown = useMemo(() => {
    if (!issue) return [];
    const total = issue.mtdCount;
    const lmtdTotal = issue.prevWindowCount || Math.round(total * 0.9);
    const lenders = [
      { lender: 'SSFB', share: 0.62, convNoise: 1.4 },
      { lender: 'JANA', share: 0.38, convNoise: -2.1 },
    ];
    return lenders.map(l => {
      const mtd = Math.round(total * l.share);
      const lmtd = Math.round(lmtdTotal * (l.share + (l.convNoise > 0 ? 0.03 : -0.03)));
      const delta = lmtd > 0 ? ((mtd - lmtd) / lmtd * 100) : 0;
      const pctShare = total > 0 ? (mtd / total * 100) : 0;
      return { lender: l.lender, mtd, lmtd, delta: parseFloat(delta.toFixed(1)), pctShare: parseFloat(pctShare.toFixed(1)) };
    });
  }, [issue]);

  if (lenderBreakdown.length === 0) return null;

  const maxMtd = Math.max(...lenderBreakdown.map(d => d.mtd), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Performance Comparison across Lenders</h3>
        <p className="text-[10px] text-slate-400 mt-0.5">How this issue is distributed across lenders — spot lender-specific spikes</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Lender</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">MTD Tickets</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-left" style={{ width: '25%' }}>Volume</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">LMTD Tickets</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">% Share</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Delta (MTD vs LMTD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {lenderBreakdown.map(d => {
              const barW = (d.mtd / maxMtd) * 100;
              const deltaColor = d.delta > 5 ? 'text-red-600 font-bold' : d.delta > 0 ? 'text-amber-600' : d.delta < -2 ? 'text-emerald-600' : 'text-slate-400';
              return (
                <tr key={d.lender} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-sm font-semibold text-slate-800">{d.lender}</span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-700">{d.mtd.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${barW}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400">{d.lmtd.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-700">{d.pctShare.toFixed(1)}%</td>
                  <td className={`px-4 py-3 text-right tabular-nums ${deltaColor}`}>
                    {d.delta > 0 ? '+' : ''}{d.delta.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 text-[10px] text-slate-400">
        Overall: <span className="font-semibold text-slate-600">{issue.mtdCount.toLocaleString()}</span> tickets MTD · <span className="font-semibold text-slate-600">{issue.pctShare}%</span> of total volume
      </div>
    </div>
  );
}

export default function IssueDetailPage() {
  const { selectedIssue, navigateBackFromIssueDetail, selectedCohort, openCohortAction, closeCohortAction } = useDashboard();

  const issue = useMemo(() => issueCategories.find((i) => i.id === selectedIssue), [selectedIssue]);
  const cohortData = useMemo(() => (selectedIssue ? cohortBreakdowns[selectedIssue] : null), [selectedIssue]);
  const dimensionKeys = useMemo(() => (cohortData ? Object.keys(cohortData) : []), [cohortData]);

  const signals = useMemo(() => extractAllSignals(cohortData), [cohortData]);
  const evidenceOptions = useMemo(() => buildEvidenceOptions(cohortData), [cohortData]);

  const appendLogEntry = useCallback((entry) => {
    if (!selectedIssue) return;
    const key = `log_issue_${selectedIssue}`;
    const existing = readLS(key);
    writeLS(key, [entry, ...existing]);
  }, [selectedIssue]);

  if (!selectedIssue || !issue) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-sm">No issue selected.</p>
        <button onClick={navigateBackFromIssueDetail} className="text-blue-600 hover:underline text-sm mt-2">&larr; Back to User Pulse</button>
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
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getRag(issue.pctShare > 10 ? 8 : 0).color}`}>{issue.pctShare}% share</span>
          </div>
        </div>
      </div>

      {/* R1: Cohort Signal Summary Banner */}
      <CohortSignalBanner signals={signals} />

      {/* Performance Comparison across Lenders */}
      <IssueLenderComparisonPanel issue={issue} />

      {/* All dimension breakdowns */}
      {dimensionKeys.map((dimKey) => {
        const dim = cohortData[dimKey];
        return (
          <DimensionSection key={dimKey} dimKey={dimKey} label={dim.label} segments={dim.segments} issueId={selectedIssue} selectedCohort={selectedCohort} openCohortAction={openCohortAction} closeCohortAction={closeCohortAction} />
        );
      })}

      {/* R2: Cross-Cohort Pattern Panel */}
      <CrossCohortPanel patterns={signals.crossPatterns} />

      {/* R3: Hypothesis Workspace */}
      <HypothesisWorkspace issueId={selectedIssue} signals={signals} evidenceOptions={evidenceOptions} onLogEntry={appendLogEntry} />

      {/* R4: SOP Selector */}
      <SOPSelector issueId={selectedIssue} signals={signals} onLogEntry={appendLogEntry} />

      {/* R5: Investigation Log */}
      <InvestigationLog issueId={selectedIssue} />
    </div>
  );
}
