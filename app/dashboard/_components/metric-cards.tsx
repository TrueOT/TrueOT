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
  
  export function MetricCards() {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Total Devices" value={781} subtitle="Devices" />
        <MetricCard title="Critical Vulnerabilities" value={102} subtitle="Vulnerabilities" />
        <MetricCard title="Open Vulnerabilities" value={213} subtitle="Vulnerabilities" />
        <MetricCard title="Unpatched Devices" value={27} subtitle="Devices" />
      </div>
    );
  }
  