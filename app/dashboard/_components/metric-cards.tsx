import db from "@/lib/db";

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
  
  async function getTotalDevices() {
    try {
      const count = await db.vulnerabilityAnalysis.count();
      return count;
    } catch (error) {
      console.error("Error fetching vulnerability analysis count:", error);
      return 0;
    }
  }
  
  async function getCriticalVulnerabilities() {
    try {
      const count = await db.vulnerabilityAnalysis.count({
        where: {
          riskLevel: "Critical"
        }
      });
      return count;
    } catch (error) {
      console.error("Error fetching critical vulnerabilities count:", error);
      return 0;
    }
  }
  
  export async function MetricCards() {
    const totalDevices = await getTotalDevices();
    const criticalVulnerabilities = await getCriticalVulnerabilities();
    
    return (
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Total Devices" value={totalDevices} subtitle="Devices" />
        <MetricCard title="Critical Vulnerabilities" value={criticalVulnerabilities} subtitle="Vulnerabilities" />
        <MetricCard title="Open Vulnerabilities" value={213} subtitle="Vulnerabilities" />
        {/* <MetricCard title="Unpatched Devices" value={27} subtitle="Devices" /> */}
        <MetricCard title="Mitigated Vulnerabilities" value={27} subtitle="Devices" />
      </div>
    );
  }
  