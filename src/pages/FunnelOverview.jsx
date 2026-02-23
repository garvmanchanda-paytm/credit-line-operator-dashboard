import KPIStrip from '../components/KPIStrip';
import FunnelChart from '../components/FunnelChart';
import ComparisonTable from '../components/ComparisonTable';

export default function FunnelOverview() {
  return (
    <div>
      <KPIStrip />
      <FunnelChart />
      <ComparisonTable />
    </div>
  );
}
