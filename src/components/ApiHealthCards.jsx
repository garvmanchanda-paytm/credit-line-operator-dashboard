import { apiHealth } from '../mockData/apiHealth';
import { getApiHealthRAG, RAG_COLORS } from '../utils/rag';

export default function ApiHealthCards({ stage }) {
  const health = apiHealth[stage];
  if (!health) {
    return <div className="text-sm text-slate-500 py-4 text-center">No API health data</div>;
  }

  const rag5xx = getApiHealthRAG(health.error5xxRate);
  const colors5xx = RAG_COLORS[rag5xx];

  const cards = [
    {
      label: 'Success Rate',
      value: `${health.successRate}%`,
      sub: health.apiName,
      color: health.successRate >= 99.5 ? 'text-emerald-600' : health.successRate >= 98 ? 'text-amber-600' : 'text-red-600',
    },
    {
      label: 'Latency (p50 / p95)',
      value: `${health.p50Latency}ms`,
      sub: `p95: ${health.p95Latency}ms`,
      color: health.p95Latency < 3000 ? 'text-emerald-600' : health.p95Latency < 8000 ? 'text-amber-600' : 'text-red-600',
    },
    {
      label: 'Error Rates',
      value: `5xx: ${health.error5xxRate}%`,
      sub: `4xx: ${health.error4xxRate}%`,
      color: colors5xx.text,
      bgColor: colors5xx.bg,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-slate-200 p-3"
          style={card.bgColor ? { backgroundColor: card.bgColor } : {}}
        >
          <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">
            {card.label}
          </div>
          <div className={`text-sm font-bold ${card.color}`}>{card.value}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
