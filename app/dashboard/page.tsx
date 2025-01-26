import { MetricCards } from "./_components/metric-cards"
import { VulnerabilityTable } from "./_components/vulnerability-table"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <MetricCards />
      <VulnerabilityTable />
    </div>
  )
}