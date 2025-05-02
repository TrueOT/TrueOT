import { MetricCards } from "./_components/metric-cards"
import { VulnerabilityTableContainer } from "./_components/vulnerability-table-container"
import { SeverityChart } from "./_components/severity-chart"

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <MetricCards />
        </div>
        <div className="lg:col-span-1">
          <SeverityChart />
        </div>
      </div>
      <VulnerabilityTableContainer />
    </div>
  )
}