import { useDashboard } from '../context/DashboardContext';

const TIME_OPTIONS = [
  { id: 't-1', label: 'T-1' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '15d', label: 'Last 15 Days' },
  { id: '30d', label: 'Last 30 Days' },
];

const CHARTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'post-onboarding', label: 'Post-Onboarding' },
];

export default function UserPulseFilters() {
  const { pulseTimeWindow, setPulseTimeWindow, charterFilter, setCharterFilter } = useDashboard();

  return (
    <div className="flex flex-wrap items-center gap-4 mb-5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-slate-500 mr-1">Period</span>
        {TIME_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setPulseTimeWindow(opt.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              pulseTimeWindow === opt.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="h-5 w-px bg-slate-200" />

      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-slate-500 mr-1">Charter</span>
        {CHARTER_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setCharterFilter(opt.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              charterFilter === opt.id
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
