import { useState, useMemo, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, Legend
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { dailyFunnel, lmsdData } from '../mockData/dailyFunnel';
import { funnelMTD } from '../mockData/funnelMTD';
import AnnotationInput, { getAnnotations } from '../components/AnnotationInput';

const STAGE_LABELS = Object.fromEntries(funnelMTD.map(s => [s.stage, s.displayLabel]));
const ALL_STAGES = funnelMTD.map(s => s.stage);

const STAGE_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  '#06b6d4', '#e11d48', '#a3e635',
];

function getTopVarianceStages(data, n = 5) {
  const variances = ALL_STAGES.map(stage => {
    const values = data
      .map(d => d[stage]?.conversion)
      .filter(v => v != null && v > 0);
    if (values.length < 2) return { stage, variance: 0 };
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, v) => a + (v - mean) ** 2, 0) / values.length;
    return { stage, variance };
  });
  variances.sort((a, b) => b.variance - a.variance);
  return variances.slice(0, n).map(v => v.stage);
}

export default function TrendView() {
  const { openDrillDown } = useDashboard();
  const [metricMode, setMetricMode] = useState('conversion');
  const [showLMSD, setShowLMSD] = useState(false);
  const [annotationTarget, setAnnotationTarget] = useState(null);

  const defaultStages = useMemo(() => getTopVarianceStages(dailyFunnel), []);
  const [selectedStages, setSelectedStages] = useState(defaultStages);

  const annotations = getAnnotations();

  const toggleStage = useCallback((stage) => {
    setSelectedStages(prev =>
      prev.includes(stage)
        ? prev.filter(s => s !== stage)
        : [...prev, stage]
    );
  }, []);

  const chartData = useMemo(() => {
    return dailyFunnel.map((day, idx) => {
      const point = { date: day.date.split('-').slice(1).join('/') };
      ALL_STAGES.forEach(stage => {
        if (metricMode === 'conversion') {
          point[stage] = day[stage]?.conversion ?? null;
        } else if (metricMode === 'count') {
          point[stage] = day[stage]?.count ?? null;
        } else {
          const lmsd = lmsdData[idx];
          const current = day[stage]?.conversion ?? 0;
          const prev = lmsd?.[stage]?.conversion ?? 0;
          point[stage] = prev ? current - prev : null;
        }
      });

      if (showLMSD && lmsdData[idx]) {
        ALL_STAGES.forEach(stage => {
          if (metricMode === 'conversion') {
            point[`${stage}_lmsd`] = lmsdData[idx][stage]?.conversion ?? null;
          }
        });
      }

      point._rawDate = day.date;
      return point;
    });
  }, [metricMode, showLMSD]);

  const yLabel = metricMode === 'conversion' ? 'Conversion %' :
                 metricMode === 'count' ? 'Absolute Count' : 'Delta vs LMSD (pp)';

  const handleChartClick = useCallback((data) => {
    if (data?.activePayload?.[0]) {
      const rawDate = data.activePayload[0].payload._rawDate;
      const stageKey = data.activePayload[0].dataKey;
      if (stageKey && ALL_STAGES.includes(stageKey)) {
        setAnnotationTarget({ date: rawDate, stage: stageKey });
      }
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-slate-900">Day-on-Day Trends</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              {[
                { key: 'conversion', label: 'Conv %' },
                { key: 'count', label: 'Count' },
                { key: 'delta', label: 'Delta' },
              ].map(m => (
                <button
                  key={m.key}
                  onClick={() => setMetricMode(m.key)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    metricMode === m.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showLMSD}
                onChange={(e) => setShowLMSD(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              LMSD overlay
            </label>
          </div>
        </div>

        <div className="h-[350px] sm:h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                stroke="#94a3b8"
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10 }}
                stroke="#94a3b8"
                label={{ value: yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#94a3b8' } }}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '8px 12px',
                  maxHeight: 300,
                  overflowY: 'auto',
                }}
                formatter={(value, name) => {
                  const cleanName = name.replace('_lmsd', '');
                  const label = STAGE_LABELS[cleanName] || name;
                  const suffix = name.endsWith('_lmsd') ? ' (LMSD)' : '';
                  const unit = metricMode === 'count' ? '' : '%';
                  return [`${value != null ? (metricMode === 'count' ? value.toLocaleString() : value.toFixed(1) + unit) : '—'}`, `${label}${suffix}`];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 10 }}
                formatter={(value) => STAGE_LABELS[value.replace('_lmsd', '')] || value}
              />

              {selectedStages.map((stage, idx) => (
                <Line
                  key={stage}
                  type="monotone"
                  dataKey={stage}
                  stroke={STAGE_COLORS[ALL_STAGES.indexOf(stage) % STAGE_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5, cursor: 'pointer' }}
                  connectNulls
                />
              ))}

              {showLMSD && metricMode === 'conversion' && selectedStages.map((stage, idx) => (
                <Line
                  key={`${stage}_lmsd`}
                  type="monotone"
                  dataKey={`${stage}_lmsd`}
                  stroke={STAGE_COLORS[ALL_STAGES.indexOf(stage) % STAGE_COLORS.length]}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                  connectNulls
                  legendType="none"
                />
              ))}

              {annotations.map((ann) => {
                const dateLabel = ann.date.split('-').slice(1).join('/');
                return (
                  <ReferenceLine
                    key={`${ann.date}-${ann.stage}`}
                    x={dateLabel}
                    stroke="#f59e0b"
                    strokeDasharray="2 2"
                    label={{ value: '!', position: 'top', fill: '#f59e0b', fontSize: 12, fontWeight: 'bold' }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {annotations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
            {annotations.map((ann, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <span className="text-amber-500 font-bold">!</span>
                <span className="text-slate-500">{ann.date}</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500">{STAGE_LABELS[ann.stage] || ann.stage}</span>
                <span className="text-slate-400">—</span>
                <span className="text-slate-700">{ann.text}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-slate-400 mt-2">Click any data point to add an annotation</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">Stage Selector</h3>
        <div className="flex flex-wrap gap-1.5">
          {ALL_STAGES.map((stage, idx) => {
            const isSelected = selectedStages.includes(stage);
            const color = STAGE_COLORS[idx % STAGE_COLORS.length];

            return (
              <button
                key={stage}
                onClick={() => toggleStage(stage)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                  isSelected
                    ? 'border-transparent text-white shadow-sm'
                    : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                }`}
                style={isSelected ? { backgroundColor: color } : {}}
              >
                {isSelected && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {STAGE_LABELS[stage]}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setSelectedStages(ALL_STAGES)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Select All
          </button>
          <button
            onClick={() => setSelectedStages([])}
            className="text-xs text-slate-500 hover:text-slate-700 font-medium"
          >
            Clear
          </button>
          <button
            onClick={() => setSelectedStages(defaultStages)}
            className="text-xs text-slate-500 hover:text-slate-700 font-medium"
          >
            Top 5 Variance
          </button>
        </div>
      </div>

      {annotationTarget && (
        <AnnotationInput
          date={annotationTarget.date}
          stage={annotationTarget.stage}
          onClose={() => setAnnotationTarget(null)}
        />
      )}
    </div>
  );
}
