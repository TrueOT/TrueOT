import { prisma } from "../../../lib/db/prisma";

interface MetricCardProps {
    title: string;
    value: number;
    subtitle: string;
  }
  
  function MetricCard({ title, value, subtitle }: MetricCardProps) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    );
  }
  
  export async function MetricCards() {
    // Fetch counts from the database
    const vulnerabilityCount = await prisma.vulnerabilityAnalysis.count();
    const criticalVulnerabilities = await prisma.vulnerabilityAnalysis.count({
      where: {
        riskLevel: "Critical"
      }
    });
    const openVulnerabilities = await prisma.vulnerabilityAnalysis.count({
      where: {
        status: "Open"
      }
    });
    const mitigatedVulnerabilities = await prisma.vulnerabilityAnalysis.count({
      where: {
        status: {
          in: ["Closed", "Mitigated"]
        }
      }
    });    

    return (
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Total Devices" value={vulnerabilityCount} subtitle="Vulnerabilities" />
        <MetricCard title="Critical Vulnerabilities" value={criticalVulnerabilities} subtitle="Vulnerabilities" />
        <MetricCard title="Open Vulnerabilities" value={openVulnerabilities} subtitle="Vulnerabilities" />
        {/* <MetricCard title="Unpatched Devices" value={27} subtitle="Devices" /> */}
        <MetricCard title="Mitigated Vulnerabilities" value={mitigatedVulnerabilities} subtitle="Devices" />
      </div>
    );
  }
  