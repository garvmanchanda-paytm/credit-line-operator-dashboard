import { useDashboard } from '../context/DashboardContext';
import Portfolio from '../components/postOnboarding/Portfolio';
import BillRecon from '../components/postOnboarding/BillRecon';
import RepaymentRecon from '../components/postOnboarding/RepaymentRecon';
import Spends from '../components/postOnboarding/Spends';

const TABS = [
  { id: 'portfolio',  label: 'Portfolio' },
  { id: 'billRecon',  label: 'Bill Recon' },
  { id: 'repayment',  label: 'Repayment' },
  { id: 'spends',     label: 'Spends' },
];

export default function PostOnboardingView() {
  const { postOnbTab, setPostOnbTab } = useDashboard();

  return (
    <div>
      <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPostOnbTab(tab.id)}
            className={`flex-1 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              postOnbTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {postOnbTab === 'portfolio' && <Portfolio />}
      {postOnbTab === 'billRecon' && <BillRecon />}
      {postOnbTab === 'repayment' && <RepaymentRecon />}
      {postOnbTab === 'spends' && <Spends />}
    </div>
  );
}
