import { useDashboard } from '../context/DashboardContext';
import UserPulseFilters from '../components/UserPulseFilters';
import IssueOverview from '../components/IssueOverview';

const PULSE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'deepdive', label: 'Pulse Deep Dive' },
];

export default function UserPulseView() {
  const { pulseTab, setPulseTab } = useDashboard();

  return (
    <div className="space-y-5">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex gap-1">
        {PULSE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPulseTab(tab.id)}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              pulseTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {pulseTab === 'overview' && (
        <>
          <UserPulseFilters />
          <IssueOverview />
        </>
      )}

      {pulseTab === 'deepdive' && <PulseDeepDiveContent />}
    </div>
  );
}

// Lazy import to keep the file clean
import PulseDeepDivePage from './PulseDeepDivePage';

function PulseDeepDiveContent() {
  return <PulseDeepDivePage />;
}
