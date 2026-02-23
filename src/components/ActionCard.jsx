const PRIORITY_STYLES = {
  P1: { border: 'border-l-red-500', badge: 'bg-red-100 text-red-700' },
  P2: { border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-700' },
  P3: { border: 'border-l-blue-500', badge: 'bg-blue-100 text-blue-700' },
};

const TAG_STYLES = {
  'Quick Fix': 'bg-emerald-100 text-emerald-700',
  'Product Change': 'bg-violet-100 text-violet-700',
  Experiment: 'bg-sky-100 text-sky-700',
};

export default function ActionCard({ card }) {
  if (!card) return null;

  const pStyle = PRIORITY_STYLES[card.priority] || PRIORITY_STYLES.P3;

  return (
    <div className={`border-l-4 ${pStyle.border} bg-white rounded-r-lg shadow-sm p-4 mt-3`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="text-sm font-semibold text-slate-800 leading-snug">{card.issueCohort}</h4>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pStyle.badge}`}>{card.priority}</span>
          {card.owner && <span className="text-[10px] text-slate-400">{card.owner}</span>}
        </div>
      </div>

      <p className="text-xs italic text-slate-500 mb-2 leading-relaxed">{card.hypothesis}</p>

      <div className="bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-3">
        <p className="text-xs font-medium text-amber-800">{card.dataSignal}</p>
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Recommended Actions</p>
        <ol className="space-y-1.5">
          {card.actions.map((action, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-xs text-slate-400 font-mono flex-shrink-0 mt-0.5">{i + 1}.</span>
              <span className="text-xs text-slate-700 leading-relaxed flex-1">{action.text}</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${TAG_STYLES[action.tag] || 'bg-slate-100 text-slate-600'}`}>
                {action.tag}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
