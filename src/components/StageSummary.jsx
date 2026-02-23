import { useMemo } from 'react';
import { dailyFunnel } from '../mockData/dailyFunnel';
import { allStages } from '../mockData/allStages';
import { apiHealth } from '../mockData/apiHealth';
import { subStageErrors } from '../mockData/logErrors';
import { formatNumber } from '../utils/rag';

function getTrendInsight(stage) {
  const last7 = dailyFunnel.slice(-7);
  const convs = last7.map(d => d[stage]?.conversion ?? null).filter(v => v != null);
  if (convs.length < 3) return null;

  const first3 = convs.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const last3 = convs.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const diff = last3 - first3;
  const latest = convs[convs.length - 1];
  const min = Math.min(...convs);
  const max = Math.max(...convs);

  if (diff > 1.5) return { rag: 'green', text: `Conversion recovering — up ${diff.toFixed(1)}pp over last 7 days (latest: ${latest.toFixed(1)}%).` };
  if (diff < -1.5) return { rag: 'red', text: `Conversion declining — down ${Math.abs(diff).toFixed(1)}pp over last 7 days (latest: ${latest.toFixed(1)}%).` };
  if (max - min > 3) return { rag: 'amber', text: `Conversion volatile — swinging ${(max - min).toFixed(1)}pp across the week (${min.toFixed(1)}% to ${max.toFixed(1)}%).` };
  return { rag: 'green', text: `Conversion stable around ${latest.toFixed(1)}% over the last 7 days.` };
}

function getL2Insight(parentStage) {
  const subs = allStages.filter(s => s.parentStage === parentStage);
  if (subs.length === 0) return null;

  const negatives = subs.filter(s => s.lmtdDelta < -0.3).sort((a, b) => a.lmtdDelta - b.lmtdDelta);
  const positives = subs.filter(s => s.lmtdDelta > 0.5).sort((a, b) => b.lmtdDelta - a.lmtdDelta);

  if (negatives.length > 0) {
    const worst = negatives[0];
    const names = negatives.slice(0, 2).map(s => s.displayLabel).join(', ');
    return {
      rag: 'red',
      text: `Top drop: ${names} (${worst.displayLabel} at ${worst.lmtdDelta.toFixed(1)}pp vs LMTD). ${negatives.length > 2 ? `${negatives.length - 2} more sub-stages declining.` : ''}`,
    };
  }
  if (positives.length > 0) {
    const best = positives[0];
    return { rag: 'green', text: `${best.displayLabel} leading improvement at +${best.lmtdDelta.toFixed(1)}pp vs LMTD.` };
  }
  return { rag: 'green', text: 'All L2 sub-stages tracking within normal range vs LMTD.' };
}

function getApiInsight(stage) {
  const health = apiHealth[stage];
  if (!health) return null;

  const issues = [];
  if (health.error5xxRate >= 0.5) issues.push(`5xx rate at ${health.error5xxRate}%`);
  if (health.p95Latency >= 5000) issues.push(`p95 latency at ${health.p95Latency}ms`);
  if (health.successRate < 98) issues.push(`success rate at ${health.successRate}%`);

  if (issues.length > 0) {
    return { rag: 'red', text: `${health.apiName} — ${issues.join(', ')}. Investigate API degradation.` };
  }
  if (health.p95Latency >= 3000 || health.error5xxRate >= 0.1) {
    return { rag: 'amber', text: `${health.apiName} — p95 ${health.p95Latency}ms, 5xx ${health.error5xxRate}%. Watch for degradation.` };
  }
  return { rag: 'green', text: `${health.apiName} healthy — ${health.successRate}% success, p95 ${health.p95Latency}ms.` };
}

function getL3Insight(parentStage) {
  const subs = allStages.filter(s => s.parentStage === parentStage);
  const allErrors = [];
  for (const sub of subs) {
    const errs = subStageErrors[sub.subStage];
    if (errs && errs.length > 0) {
      for (const e of errs) {
        allErrors.push({ ...e, subStageLabel: sub.displayLabel });
      }
    }
  }

  if (allErrors.length === 0) return null;

  allErrors.sort((a, b) => b.count - a.count);
  const top = allErrors[0];
  const alertCount = allErrors.filter(e => e.trendVsYesterday === 'up' || e.trendVsYesterday === 'alert').length;

  let rag = 'green';
  let text = `Top error: "${top.description}" (${formatNumber(top.count)}) in ${top.subStageLabel}.`;
  if (alertCount > 0) {
    rag = alertCount >= 3 ? 'red' : 'amber';
    text += ` ${alertCount} error${alertCount > 1 ? 's' : ''} trending up.`;
  }

  return { rag, text };
}

const RAG_DOT = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};

export default function StageSummary({ stage }) {
  const insights = useMemo(() => {
    const items = [];
    const trend = getTrendInsight(stage);
    if (trend) items.push(trend);
    const l2 = getL2Insight(stage);
    if (l2) items.push(l2);
    const api = getApiInsight(stage);
    if (api) items.push(api);
    const l3 = getL3Insight(stage);
    if (l3) items.push(l3);
    return items;
  }, [stage]);

  if (insights.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5">
      <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Summary</h3>
      {insights.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2">
          <span className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${RAG_DOT[item.rag]}`} />
          <p className="text-xs text-slate-700 leading-snug">{item.text}</p>
        </div>
      ))}
    </div>
  );
}
