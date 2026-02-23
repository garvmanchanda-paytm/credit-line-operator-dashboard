import { useDashboard } from '../context/DashboardContext';
import UserPulseFilters from '../components/UserPulseFilters';
import IssueOverview from '../components/IssueOverview';
import CohortPanel from '../components/CohortPanel';

export default function UserPulseView() {
  const { selectedIssue } = useDashboard();

  return (
    <>
      <UserPulseFilters />
      <IssueOverview />
      {selectedIssue && <CohortPanel />}
    </>
  );
}
