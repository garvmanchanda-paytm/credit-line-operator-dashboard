import { createContext, useContext, useState, useCallback } from 'react';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [activeView, setActiveView] = useState('snapshot');
  const [funnelType, setFunnelType] = useState('open');
  const [selectedMonth, setSelectedMonth] = useState('2026-02');
  const [drillDownStage, setDrillDownStage] = useState(null);

  const openDrillDown = useCallback((stage) => setDrillDownStage(stage), []);
  const closeDrillDown = useCallback(() => setDrillDownStage(null), []);

  // User Pulse state
  const [pulseTimeWindow, setPulseTimeWindow] = useState('7d');
  const [charterFilter, setCharterFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState(null);

  const openIssuePanel = useCallback((issueId) => {
    setSelectedIssue(issueId);
    setSelectedCohort(null);
  }, []);
  const closeIssuePanel = useCallback(() => {
    setSelectedIssue(null);
    setSelectedCohort(null);
  }, []);
  const openCohortAction = useCallback((cohortKey) => setSelectedCohort(cohortKey), []);
  const closeCohortAction = useCallback(() => setSelectedCohort(null), []);

  // Post-Onboarding state
  const [postOnbTab, setPostOnbTab] = useState('portfolio');
  const [selectedLanDimension, setSelectedLanDimension] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <DashboardContext.Provider
      value={{
        activeView,
        setActiveView,
        funnelType,
        setFunnelType,
        selectedMonth,
        setSelectedMonth,
        drillDownStage,
        openDrillDown,
        closeDrillDown,
        pulseTimeWindow,
        setPulseTimeWindow,
        charterFilter,
        setCharterFilter,
        selectedIssue,
        selectedCohort,
        openIssuePanel,
        closeIssuePanel,
        openCohortAction,
        closeCohortAction,
        postOnbTab,
        setPostOnbTab,
        selectedLanDimension,
        setSelectedLanDimension,
        showEmailModal,
        setShowEmailModal,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
}
