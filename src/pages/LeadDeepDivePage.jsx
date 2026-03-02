import { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { leadEventsMap, SAMPLE_LEAD_IDS } from '../mockData/leadEvents';

const KIBANA_BASE_DEFAULT = 'https://kibana.internal.paytm.com/app/discover';
const LEAD_ASSIST_DEFAULT = 'https://lead-assist.internal.paytm.com';

const STATUS_STYLES = {
  SUCCESS: 'bg-emerald-100 text-emerald-700',
  FAILURE: 'bg-red-100 text-red-700',
  PENDING: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
};

export default function LeadDeepDivePage() {
  const { selectedLeadId, setSelectedLeadId, navigateBackFromLeadDeepDive } = useDashboard();

  const [leadInput, setLeadInput] = useState(selectedLeadId || '');
  const [loadedLeadId, setLoadedLeadId] = useState(selectedLeadId || '');
  const [kibanaBase, setKibanaBase] = useState(KIBANA_BASE_DEFAULT);
  const [leadAssistBase, setLeadAssistBase] = useState(LEAD_ASSIST_DEFAULT);
  const [showSettings, setShowSettings] = useState(false);

  const events = useMemo(() => {
    if (!loadedLeadId) return [];
    return leadEventsMap[loadedLeadId] || [];
  }, [loadedLeadId]);

  const lastEvent = events.length > 0 ? events[events.length - 1] : null;
  const stageReached = lastEvent ? `${lastEvent.stage} → ${lastEvent.substage}` : '—';
  const finalStatus = lastEvent?.status || '—';

  const handleLoad = () => {
    const trimmed = leadInput.trim();
    if (!trimmed) return;
    setLoadedLeadId(trimmed);
    setSelectedLeadId(trimmed);
  };

  const handleSampleClick = (id) => {
    setLeadInput(id);
    setLoadedLeadId(id);
    setSelectedLeadId(id);
  };

  const formatTimestamp = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={navigateBackFromLeadDeepDive} className="hover:text-blue-600 transition-colors">Dashboard</button>
        <span>/</span>
        <button onClick={navigateBackFromLeadDeepDive} className="hover:text-blue-600 transition-colors">Sub-Stage Deep Dive</button>
        <span>/</span>
        <span className="text-slate-900 font-medium">Lead Deep Dive</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h1 className="text-xl font-bold text-slate-900">Lead Deep Dive</h1>
        <p className="text-xs text-slate-400 mt-0.5">Investigate individual lead journeys — view stage progression and link to engineering tools</p>
      </div>

      {/* Lead ID Input Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Lead ID</label>
            <input
              type="text"
              value={leadInput}
              onChange={(e) => setLeadInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
              placeholder="Enter lead ID (e.g., PTM-826401927)"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleLoad}
            disabled={!leadInput.trim()}
            className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            LOAD
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            {showSettings ? 'Hide Settings' : 'Settings'}
          </button>
        </div>

        {/* Sample Lead IDs */}
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Quick Select (Sample Leads)</p>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_LEAD_IDS.slice(0, 8).map(id => (
              <button
                key={id}
                onClick={() => handleSampleClick(id)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-md border transition-colors ${
                  loadedLeadId === id
                    ? 'border-blue-400 bg-blue-50 text-blue-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/30'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Settings (collapsible) */}
        {showSettings && (
          <div className="border-t border-slate-100 pt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Kibana Base URL</label>
              <input
                type="url"
                value={kibanaBase}
                onChange={(e) => setKibanaBase(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Lead Assist Base URL</label>
              <input
                type="url"
                value={leadAssistBase}
                onChange={(e) => setLeadAssistBase(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Lead Summary (only if loaded) */}
      {loadedLeadId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Lead ID</p>
            <p className="text-lg font-bold font-mono text-slate-900 mt-1">{loadedLeadId}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Stage Reached</p>
            <p className="text-sm font-semibold text-slate-800 mt-1">{stageReached}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Final Status</p>
            <p className="mt-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${STATUS_STYLES[finalStatus] || 'bg-slate-100 text-slate-600'}`}>
                {finalStatus}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* External Tool Links */}
      {loadedLeadId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <a
            href={`${kibanaBase}?leadId=${loadedLeadId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl border border-purple-200 p-4 flex items-center gap-4 hover:shadow-md hover:border-purple-400 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-purple-800 group-hover:underline">Open in Kibana</p>
              <p className="text-[10px] text-slate-400">View raw logs and event traces for this lead</p>
            </div>
            <span className="ml-auto text-purple-400 group-hover:text-purple-600 text-lg">→</span>
          </a>
          <a
            href={`${leadAssistBase}/lead/${loadedLeadId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl border border-blue-200 p-4 flex items-center gap-4 hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-800 group-hover:underline">Open Lead Assist</p>
              <p className="text-[10px] text-slate-400">Customer screen, ticket history, and support actions</p>
            </div>
            <span className="ml-auto text-blue-400 group-hover:text-blue-600 text-lg">→</span>
          </a>
        </div>
      )}

      {/* Event Timeline Table */}
      {loadedLeadId && events.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Event Timeline</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Chronological stage transitions for {loadedLeadId}</p>
            </div>
            <span className="text-[10px] font-medium text-slate-500">{events.length} events</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-[40px]">#</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Domain</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Stage</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Substage</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {events.map((evt, idx) => (
                  <tr key={idx} className={`transition-colors ${evt.status === 'FAILURE' ? 'bg-red-50/30' : 'hover:bg-slate-50/60'}`}>
                    <td className="px-4 py-3 text-center text-xs text-slate-400 tabular-nums">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{evt.domain}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{evt.stage.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-800 font-mono">{evt.substage}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${STATUS_STYLES[evt.status] || 'bg-slate-100 text-slate-600'}`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono whitespace-nowrap">{formatTimestamp(evt.created)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {loadedLeadId && events.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-400">No events found for lead <span className="font-mono font-bold">{loadedLeadId}</span></p>
          <p className="text-xs text-slate-300 mt-1">Verify the lead ID or try a different one</p>
        </div>
      )}

      {!loadedLeadId && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-600">Enter a Lead ID to begin investigation</p>
          <p className="text-xs text-slate-400 mt-1">Or select from the sample leads above to explore mock data</p>
        </div>
      )}
    </div>
  );
}
