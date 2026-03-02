import { useMemo, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { funnelMTD, funnelByLender, LENDER_OPTIONS } from '../mockData/funnelMTD';
import { allStages } from '../mockData/allStages';
import { getLeadsBySubStage } from '../mockData/leadEvents';
import { subStageApiHealth, getSubStageTrend } from '../mockData/subStageApi';
import { formatNumber } from '../utils/rag';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TIME_TABS = [
  { id: 'intraday', label: 'INTRADAY' },
  { id: 'mtd', label: 'MTD' },
  { id: 'ltd', label: 'LTD' },
];

const KIBANA_BASE = 'https://kibana.internal.paytm.com/app/discover';

function getStatus(convRate, lmtdDelta) {
  if (lmtdDelta < -3 || convRate < 5) return 'CRITICAL';
  if (lmtdDelta < -1 || convRate < 20) return 'WARNING';
  return 'OK';
}

const STATUS_STYLES = {
  CRITICAL: 'bg-red-100 text-red-700',
  WARNING: 'bg-amber-100 text-amber-700',
  OK: 'bg-emerald-100 text-emerald-700',
};

function SubStageRow({ ss, isSelected, onSelect, onDebug, onOpenLeadDeepDive, navigateToStageDetail }) {
  const status = getStatus(ss.convRate, ss.lmtdDelta);
  const trendData = useMemo(() => getSubStageTrend(ss.subStage, ss.convRate), [ss.subStage, ss.convRate]);
  const leads = useMemo(() => isSelected ? getLeadsBySubStage(ss.parentStage, ss.subStage) : [], [isSelected, ss.parentStage, ss.subStage]);

  return (
    <>
      <tr
        onClick={() => onSelect(ss.subStage)}
        className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/60'}`}
      >
        <td className="px-4 py-3 text-[10px] text-slate-400 uppercase font-medium">{ss.category}</td>
        <td className="px-4 py-3">
          <p className="text-xs font-medium text-slate-800">{ss.displayLabel}</p>
          <p className="text-[10px] text-slate-400 font-mono">{ss.subStage}</p>
        </td>
        <td className="px-4 py-3 text-right tabular-nums text-xs font-medium text-slate-700">{formatNumber(ss.mtdCount)}</td>
        <td className="px-4 py-3 text-right tabular-nums text-xs font-semibold text-slate-800">{ss.convRate.toFixed(1)}%</td>
        <td className={`px-4 py-3 text-right tabular-nums text-xs font-bold ${ss.lmtdDelta < 0 ? 'text-red-600' : ss.lmtdDelta > 0.1 ? 'text-emerald-600' : 'text-slate-400'}`}>
          {ss.lmtdDelta > 0 ? '+' : ''}{ss.lmtdDelta.toFixed(1)}pp
        </td>
        <td className="px-4 py-3 text-center">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${STATUS_STYLES[status]}`}>{status}</span>
        </td>
        <td className="px-4 py-3 text-center">
          <button
            onClick={(e) => { e.stopPropagation(); onDebug(ss); }}
            className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md hover:bg-blue-100 transition-colors"
          >
            DEBUG
          </button>
        </td>
      </tr>
      {isSelected && (
        <tr>
          <td colSpan={7} className="px-4 py-4 bg-blue-50/30 border-t border-blue-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Trend Chart */}
              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">7-Day Trend</h4>
                <div className="h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                      <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [`${v.toFixed(1)}%`, 'Conv']} />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2, fill: '#3b82f6' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Issue Lead IDs */}
              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Issue Lead IDs</h4>
                  <span className="text-[9px] text-slate-400">{leads.length} leads</span>
                </div>
                {leads.length === 0 ? (
                  <p className="text-[10px] text-slate-400 py-4 text-center">No leads found for this sub-stage</p>
                ) : (
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                    {leads.map((lead) => (
                      <div key={lead.leadId} className="flex items-center justify-between bg-slate-50 rounded-md px-2.5 py-1.5">
                        <div>
                          <p className="text-xs font-mono font-medium text-slate-800">{lead.leadId}</p>
                          <p className="text-[10px] text-slate-400">{lead.stage} · {lead.status}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); onOpenLeadDeepDive(lead.leadId); }}
                            className="text-[9px] font-bold text-blue-600 hover:underline"
                          >
                            OPEN LEAD DEEP DIVE
                          </button>
                          <a
                            href={`${KIBANA_BASE}?leadId=${lead.leadId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[9px] font-bold text-purple-600 hover:underline"
                          >
                            Kibana
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* API Health for this sub-stage */}
            {subStageApiHealth[ss.subStage] && (
              <div className="mt-3 bg-white rounded-lg border border-slate-200 p-3">
                <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">API Health</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <th className="text-left px-3 py-2">API</th>
                        <th className="text-right px-3 py-2">Success %</th>
                        <th className="text-right px-3 py-2">Latency (ms)</th>
                        <th className="text-right px-3 py-2">Error %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {subStageApiHealth[ss.subStage].map((api, i) => (
                        <tr key={i}>
                          <td className="px-3 py-1.5 font-medium text-slate-700">{api.apiName}</td>
                          <td className={`px-3 py-1.5 text-right tabular-nums ${api['7d'].successRate < 99 ? 'text-red-600 font-bold' : 'text-emerald-600'}`}>
                            {api['7d'].successRate}%
                          </td>
                          <td className={`px-3 py-1.5 text-right tabular-nums ${api['7d'].latency > 3000 ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                            {api['7d'].latency}
                          </td>
                          <td className={`px-3 py-1.5 text-right tabular-nums ${api['7d'].errorRate > 0.1 ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                            {api['7d'].errorRate}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default function SubStageDeepDivePage() {
  const {
    navigateBackFromSubStageDeepDive,
    deepDiveStage,
    deepDiveSubStage,
    navigateToLeadDeepDive,
    navigateToStageDetail,
    selectedLender,
    setSelectedLender,
  } = useDashboard();

  const [selectedStage, setSelectedStage] = useState(deepDiveStage || '');
  const [selectedSubStageFilter, setSelectedSubStageFilter] = useState(deepDiveSubStage || '');
  const [timeTab, setTimeTab] = useState('mtd');
  const [dateFrom, setDateFrom] = useState('2026-02-01');
  const [dateTo, setDateTo] = useState('2026-02-22');
  const [expandedSubStage, setExpandedSubStage] = useState(null);

  const stageOptions = useMemo(() => {
    const seen = new Set();
    return allStages.reduce((acc, s) => {
      if (!seen.has(s.parentStage)) {
        seen.add(s.parentStage);
        const funnelEntry = funnelMTD.find(f => f.stage === s.parentStage);
        acc.push({
          stage: s.parentStage,
          label: funnelEntry?.displayLabel || s.parentStage.replace(/_/g, ' '),
        });
      }
      return acc;
    }, []);
  }, []);

  const subStageOptions = useMemo(() => {
    if (!selectedStage) return [];
    return allStages.filter(s => s.parentStage === selectedStage);
  }, [selectedStage]);

  const timeMultiplier = timeTab === 'intraday' ? 0.05 : timeTab === 'ltd' ? 3.5 : 1;

  const filteredSubStages = useMemo(() => {
    let result = selectedStage
      ? allStages.filter(s => s.parentStage === selectedStage)
      : allStages;

    if (selectedSubStageFilter) {
      result = result.filter(s => s.subStage === selectedSubStageFilter);
    }

    const lenderFactor = selectedLender === 'SSFB' ? 0.62 : selectedLender === 'JANA' ? 0.38 : 1;

    return result.map(s => ({
      ...s,
      mtdCount: Math.round(s.mtdCount * timeMultiplier * lenderFactor),
    }));
  }, [selectedStage, selectedSubStageFilter, timeMultiplier, selectedLender]);

  const clearFilters = () => {
    setSelectedStage('');
    setSelectedSubStageFilter('');
    setExpandedSubStage(null);
  };

  const handleDebug = (ss) => {
    const kibanaUrl = `${KIBANA_BASE}?stage=${ss.parentStage}&substage=${ss.subStage}&from=${dateFrom}&to=${dateTo}`;
    window.open(kibanaUrl, '_blank');
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={navigateBackFromSubStageDeepDive} className="hover:text-blue-600 transition-colors">Dashboard</button>
        <span>/</span>
        <button onClick={navigateBackFromSubStageDeepDive} className="hover:text-blue-600 transition-colors">Funnel</button>
        <span>/</span>
        <span className="text-slate-900 font-medium">Sub-Stage Deep Dive</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h1 className="text-xl font-bold text-slate-900">Sub-Stage Deep Dive</h1>
        <p className="text-xs text-slate-400 mt-0.5">Filter by stage, sub-stage, and time window to drill into funnel conversion issues</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* Lender */}
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Lender</label>
            <div className="flex gap-1">
              {LENDER_OPTIONS.map(l => (
                <button
                  key={l}
                  onClick={() => setSelectedLender(l)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    selectedLender === l ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {l === 'ALL' ? 'All' : l}
                </button>
              ))}
            </div>
          </div>

          {/* Stage Dropdown */}
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Stage</label>
            <select
              value={selectedStage}
              onChange={(e) => { setSelectedStage(e.target.value); setSelectedSubStageFilter(''); setExpandedSubStage(null); }}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
            >
              <option value="">All Stages</option>
              {stageOptions.map(s => (
                <option key={s.stage} value={s.stage}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Substage Dropdown */}
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Sub-stage</label>
            <select
              value={selectedSubStageFilter}
              onChange={(e) => { setSelectedSubStageFilter(e.target.value); setExpandedSubStage(null); }}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]"
              disabled={!selectedStage}
            >
              <option value="">All Sub-stages</option>
              {subStageOptions.map(s => (
                <option key={s.subStage} value={s.subStage}>{s.displayLabel}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Clear Filter */}
          {(selectedStage || selectedSubStageFilter) && (
            <button onClick={clearFilters} className="text-xs font-semibold text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors">
              CLEAR FILTER
            </button>
          )}
        </div>

        {/* Time Tabs */}
        <div className="flex gap-1 mt-4 pt-3 border-t border-slate-100">
          {TIME_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTimeTab(tab.id)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                timeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-800">{filteredSubStages.length}</span> sub-stages
          {selectedStage && <> under <span className="font-medium text-blue-700">{stageOptions.find(s => s.stage === selectedStage)?.label}</span></>}
        </p>
        <p className="text-[10px] text-slate-400">{timeTab.toUpperCase()} · {dateFrom} → {dateTo} · {selectedLender === 'ALL' ? 'All Lenders' : selectedLender}</p>
      </div>

      {/* Sub-Stage Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-[100px]">Category</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Sub-stage</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Count</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Conv %</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Delta vs LMTD</th>
                <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSubStages.map(ss => (
                <SubStageRow
                  key={ss.subStage}
                  ss={ss}
                  isSelected={expandedSubStage === ss.subStage}
                  onSelect={(s) => setExpandedSubStage(prev => prev === s ? null : s)}
                  onDebug={handleDebug}
                  onOpenLeadDeepDive={(leadId) => navigateToLeadDeepDive(leadId)}
                  navigateToStageDetail={navigateToStageDetail}
                />
              ))}
            </tbody>
          </table>
        </div>
        {filteredSubStages.length === 0 && (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-slate-400">No sub-stages match the current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
