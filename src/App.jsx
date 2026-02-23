import { DashboardProvider, useDashboard } from './context/DashboardContext';
import SnapshotView from './pages/SnapshotView';
import DeepdiveView from './pages/DeepdiveView';
import UserPulseView from './pages/UserPulseView';
import PostOnboardingView from './pages/PostOnboardingView';
import DrillDownPanel from './components/DrillDownPanel';

const FUNNEL_NAV = [
  {
    id: 'snapshot',
    label: 'Snapshot',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'deepdive',
    label: 'Deepdive',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const PULSE_NAV = {
  id: 'userPulse',
  label: 'User Pulse',
  icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const POST_ONB_NAV = {
  id: 'postOnboarding',
  label: 'Post-Onboarding',
  icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
};

function NavButton({ item, activeView, setActiveView }) {
  const active = activeView === item.id;
  return (
    <button
      onClick={() => setActiveView(item.id)}
      className={`w-full flex items-center gap-2.5 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className={active ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
      <span className="hidden lg:block">{item.label}</span>
    </button>
  );
}

function Sidebar() {
  const { activeView, setActiveView } = useDashboard();

  return (
    <aside className="w-14 lg:w-48 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="flex items-center gap-2.5 px-3 lg:px-4 h-14 border-b border-slate-200">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-slate-900 hidden lg:block leading-tight">Paytm<br/>Postpaid</span>
      </div>

      <nav className="flex-1 px-2 lg:px-3 py-3 space-y-1">
        <div className="hidden lg:block text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">Funnel</div>
        {FUNNEL_NAV.map((item) => (
          <NavButton key={item.id} item={item} activeView={activeView} setActiveView={setActiveView} />
        ))}

        <div className="my-3 border-t border-slate-200" />

        <div className="hidden lg:block text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">CST</div>
        <NavButton item={PULSE_NAV} activeView={activeView} setActiveView={setActiveView} />

        <div className="my-3 border-t border-slate-200" />

        <div className="hidden lg:block text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">Post-Onb</div>
        <NavButton item={POST_ONB_NAV} activeView={activeView} setActiveView={setActiveView} />
      </nav>

      <div className="px-2 lg:px-3 py-3 border-t border-slate-100">
        <div className="text-[10px] text-slate-400 hidden lg:block leading-relaxed">
          Paytm Postpaid<br/>
          Charter 1 + 2 + 3<br/>
          Phase 3 Prototype
        </div>
      </div>
    </aside>
  );
}

const HEADER_MAP = {
  snapshot:       { title: 'Onboarding Funnel Dashboard', sub: 'Paytm Postpaid (TPAP) — Feb 2026' },
  deepdive:       { title: 'Onboarding Funnel Dashboard', sub: 'Paytm Postpaid (TPAP) — Feb 2026' },
  userPulse:      { title: 'User Pulse — CST Dashboard', sub: 'Paytm Postpaid — Customer Support Tickets' },
  postOnboarding: { title: 'Post-Onboarding — Deep Dive', sub: 'Paytm Postpaid — Portfolio · Recon · Repayments · Spends' },
};

function TopHeader() {
  const { activeView, selectedMonth, setSelectedMonth } = useDashboard();
  const hdr = HEADER_MAP[activeView] || HEADER_MAP.snapshot;
  const showMonthPicker = activeView === 'snapshot' || activeView === 'deepdive';

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5">
      <div>
        <h1 className="text-base font-semibold text-slate-900">{hdr.title}</h1>
        <p className="text-[11px] text-slate-400 -mt-0.5">{hdr.sub}</p>
      </div>

      {showMonthPicker && (
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[130px]"
          />
        </div>
      )}
    </header>
  );
}

function MainContent() {
  const { activeView } = useDashboard();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6">
      <div className="max-w-[1280px] mx-auto">
        {activeView === 'snapshot' && <SnapshotView />}
        {activeView === 'deepdive' && <DeepdiveView />}
        {activeView === 'userPulse' && <UserPulseView />}
        {activeView === 'postOnboarding' && <PostOnboardingView />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <div className="h-screen flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopHeader />
          <MainContent />
        </div>
      </div>
      <DrillDownPanel />
    </DashboardProvider>
  );
}
