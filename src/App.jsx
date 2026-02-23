import { DashboardProvider, useDashboard } from './context/DashboardContext';
import SnapshotView from './pages/SnapshotView';
import DeepdiveView from './pages/DeepdiveView';
import UserPulseView from './pages/UserPulseView';
import PostOnboardingView from './pages/PostOnboardingView';
import InsightLandingPage from './pages/InsightLandingPage';
import DisbursementView from './pages/DisbursementView';
import StageDetailPage from './pages/StageDetailPage';
import IssueDetailPage from './pages/IssueDetailPage';
import LANBreakdownPage from './pages/LANBreakdownPage';
import Customer360Page from './pages/Customer360Page';
import ErrorCodeDetailPage from './pages/ErrorCodeDetailPage';

const HOME_NAV = {
  id: 'insightLanding',
  label: 'Home',
  icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
};

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

const DISBURSEMENT_NAV = {
  id: 'disbursement',
  label: 'Disbursement',
  icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

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
  const isActive = activeView === item.id;
  return (
    <button
      onClick={() => setActiveView(item.id)}
      className={`w-full flex items-center gap-2.5 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
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

      <nav className="flex-1 px-2 lg:px-3 py-3 space-y-1 overflow-y-auto">
        <NavButton item={HOME_NAV} activeView={activeView} setActiveView={setActiveView} />

        <div className="my-3 border-t border-slate-200" />
        <div className="hidden lg:block text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">Funnel</div>
        {FUNNEL_NAV.map((item) => (
          <NavButton key={item.id} item={item} activeView={activeView} setActiveView={setActiveView} />
        ))}

        <div className="my-3 border-t border-slate-200" />
        <div className="hidden lg:block text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">Disbursement</div>
        <NavButton item={DISBURSEMENT_NAV} activeView={activeView} setActiveView={setActiveView} />

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
          MVP Prototype<br/>
          Charter 1 + 2 + 3
        </div>
      </div>
    </aside>
  );
}

const HEADER_MAP = {
  insightLanding: { title: 'Insight Landing', sub: 'Paytm Postpaid — Cross-Charter Summary' },
  snapshot:       { title: 'Onboarding Funnel Dashboard', sub: 'Paytm Postpaid (TPAP) — Feb 2026' },
  deepdive:       { title: 'Onboarding Funnel Dashboard', sub: 'Paytm Postpaid (TPAP) — Feb 2026' },
  stageDetail:    { title: 'Stage Detail', sub: 'Funnel Drill-Down — L2 / L3 Analysis' },
  disbursement:   { title: 'Disbursement Analysis', sub: 'Paytm Postpaid — Approval to Disbursement' },
  userPulse:      { title: 'User Pulse — CST Dashboard', sub: 'Paytm Postpaid — Customer Support Tickets' },
  issueDetail:    { title: 'Issue Detail', sub: 'User Pulse — Cohort Breakdown & Actions' },
  postOnboarding: { title: 'Post-Onboarding — Deep Dive', sub: 'Paytm Postpaid — Portfolio · Recon · Repayments · Spends' },
  lanBreakdown:   { title: 'Discrepancy Investigation', sub: 'LAN-Level Breakdown — Paytm LMS vs Lender File' },
  customer360:    { title: 'Customer 360', sub: 'Individual LAN — Full Account Detail' },
  errorCodeDetail: { title: 'UPI Error Code — Deep Dive', sub: 'Transaction Logs & 7-Day Trend Analysis' },
};

function TopHeader() {
  const { activeView, selectedMonth, setSelectedMonth } = useDashboard();
  const hdr = HEADER_MAP[activeView] || HEADER_MAP.insightLanding;
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
        {activeView === 'insightLanding' && <InsightLandingPage />}
        {activeView === 'snapshot' && <SnapshotView />}
        {activeView === 'deepdive' && <DeepdiveView />}
        {activeView === 'stageDetail' && <StageDetailPage />}
        {activeView === 'disbursement' && <DisbursementView />}
        {activeView === 'userPulse' && <UserPulseView />}
        {activeView === 'issueDetail' && <IssueDetailPage />}
        {activeView === 'postOnboarding' && <PostOnboardingView />}
        {activeView === 'lanBreakdown' && <LANBreakdownPage />}
        {activeView === 'customer360' && <Customer360Page />}
        {activeView === 'errorCodeDetail' && <ErrorCodeDetailPage />}
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
    </DashboardProvider>
  );
}
