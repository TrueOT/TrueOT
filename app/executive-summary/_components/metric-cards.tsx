import { prisma } from "@/lib/db/prisma";
import { BarChart3, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, color, icon }: MetricCardProps) {
  return (
    <div className={`p-6 rounded-lg flex justify-between items-center ${color}`}>
      <div>
        <h3 className="text-sm font-medium text-white">
          {title}
        </h3>
        <p className="text-3xl font-bold text-white mt-2">
          {value}
        </p>
      </div>
      <div className="text-white opacity-80">
        {icon}
      </div>
    </div>
  );
}

export async function MetricCards() {
  // Fetch total assets count
  const totalAssets = await prisma.asset.count();
  
  // Fetch critical vulnerabilities
  const criticalVulnerabilities = await prisma.vulnerabilityAnalysis.count({
    where: {
      riskLevel: {
        contains: "Critical",
        mode: "insensitive",
      }
    }
  });
  
  // Fetch open vulnerabilities
  const openVulnerabilities = await prisma.vulnerabilityAnalysis.count({
    where: {
      status: "Open"
    }
  });
  
  // Fetch mitigated vulnerabilities
  const mitigatedVulnerabilities = await prisma.vulnerabilityAnalysis.count({
    where: {
      status: {
        in: ["Closed", "Mitigated"]
      }
    }
  });

  return (
    <>
      <MetricCard 
        title="Total Devices" 
        value={totalAssets} 
        color="bg-[#8E3A59]"
        icon={<BarChart3 size={24} />}
      />
      <MetricCard 
        title="Critical Vulnerabilities" 
        value={criticalVulnerabilities} 
        color="bg-[#8E3A59]"
        icon={<AlertTriangle size={24} />}
      />
      <MetricCard 
        title="Open Vulnerabilities" 
        value={openVulnerabilities} 
        color="bg-[#8E3A59]"
        icon={<AlertCircle size={24} />}
      />
      <MetricCard 
        title="Mitigated Vulnerabilities" 
        value={mitigatedVulnerabilities} 
        color="bg-[#8E3A59]"
        icon={<CheckCircle2 size={24} />}
      />
    </>
  );
} 