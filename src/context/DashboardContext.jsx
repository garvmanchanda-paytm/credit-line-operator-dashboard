import { createContext, useContext, useState, useCallback } from 'react';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [activeView, setActiveView] = useState('insightLanding');
  const [previousView, setPreviousView] = useState(null);
  const [funnelType, setFunnelType] = useState('open');
  const [selectedMonth, setSelectedMonth] = useState('2026-02');
  const [selectedLender, setSelectedLender] = useState('ALL');

  // Funnel stage detail (full-page, replaces overlay)
  const [drillDownStage, setDrillDownStage] = useState(null);

  const navigateToStageDetail = useCallback((stage) => {
    setPreviousView((prev) => prev || 'snapshot');
    setDrillDownStage(stage);
    setActiveView('stageDetail');
  }, []);

  const navigateBackFromStageDetail = useCallback(() => {
    setDrillDownStage(null);
    setActiveView((prev) => previousView || 'snapshot');
    setPreviousView(null);
  }, [previousView]);

  // User Pulse state
  const [pulseTimeWindow, setPulseTimeWindow] = useState('7d');
  const [charterFilter, setCharterFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState(null);

  const navigateToIssueDetail = useCallback((issueId) => {
    setSelectedIssue(issueId);
    setSelectedCohort(null);
    setActiveView('issueDetail');
  }, []);

  const navigateBackFromIssueDetail = useCallback(() => {
    setSelectedIssue(null);
    setSelectedCohort(null);
    setActiveView('userPulse');
  }, []);

  const openCohortAction = useCallback((cohortKey) => setSelectedCohort(cohortKey), []);
  const closeCohortAction = useCallback(() => setSelectedCohort(null), []);

  // Post-Onboarding state
  const [postOnbTab, setPostOnbTab] = useState('portfolio');
  const [selectedLanDimension, setSelectedLanDimension] = useState(null);
  const [showEmailSection, setShowEmailSection] = useState(false);

  // Bill Recon drill-down state
  const [lanBreakdownConfig, setLanBreakdownConfig] = useState(null);
  const [customer360Lan, setCustomer360Lan] = useState(null);

  const navigateToLanBreakdown = useCallback((config) => {
    setLanBreakdownConfig(config);
    setActiveView('lanBreakdown');
  }, []);

  const navigateBackFromLanBreakdown = useCallback(() => {
    setLanBreakdownConfig(null);
    setActiveView('postOnboarding');
  }, []);

  const navigateToCustomer360 = useCallback((lanId) => {
    setCustomer360Lan(lanId);
    setActiveView('customer360');
  }, []);

  const navigateBackToLanBreakdown = useCallback(() => {
    setCustomer360Lan(null);
    setActiveView('lanBreakdown');
  }, []);

  // Track which view the drill-down was triggered from
  const openDrillDown = useCallback((stage) => {
    setPreviousView((prev) => prev || 'snapshot');
    setDrillDownStage(stage);
    setActiveView('stageDetail');
  }, []);

  const closeDrillDown = useCallback(() => {
    setDrillDownStage(null);
    setActiveView(previousView || 'snapshot');
    setPreviousView(null);
  }, [previousView]);

  // Legacy compat for User Pulse cross-links
  const openIssuePanel = useCallback((issueId) => {
    setSelectedIssue(issueId);
    setSelectedCohort(null);
    setActiveView('issueDetail');
  }, []);

  const closeIssuePanel = useCallback(() => {
    setSelectedIssue(null);
    setSelectedCohort(null);
    setActiveView('userPulse');
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        activeView,
        setActiveView,
        previousView,
        setPreviousView,
        funnelType,
        setFunnelType,
        selectedMonth,
        setSelectedMonth,
        selectedLender,
        setSelectedLender,
        drillDownStage,
        setDrillDownStage,
        navigateToStageDetail,
        navigateBackFromStageDetail,
        openDrillDown,
        closeDrillDown,
        pulseTimeWindow,
        setPulseTimeWindow,
        charterFilter,
        setCharterFilter,
        selectedIssue,
        selectedCohort,
        navigateToIssueDetail,
        navigateBackFromIssueDetail,
        openIssuePanel,
        closeIssuePanel,
        openCohortAction,
        closeCohortAction,
        postOnbTab,
        setPostOnbTab,
        selectedLanDimension,
        setSelectedLanDimension,
        showEmailSection,
        setShowEmailSection,
        lanBreakdownConfig,
        navigateToLanBreakdown,
        navigateBackFromLanBreakdown,
        customer360Lan,
        navigateToCustomer360,
        navigateBackToLanBreakdown,
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
