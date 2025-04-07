'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ShieldAlert, Server, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

// This would typically come from an API
const getVulnerabilityData = (id: string) => {
  // Mock data - in a real app, this would be an API call
  const vulnerabilities = {
    "CVE-2024-101": {
      title: "PLC Firmware Exploit",
      severity: "Critical",
      whatHappened: "Exploiting vulnerabilities in this firmware can allow attackers to Modify the PLC's instructions, potentially disrupting industrial processes Disable safety protocols, leading to unsafe operating conditions.",
      occurredAt: "17/10/24, 22:05",
      lastSeen: "17/10/24, 22:05",
      state: "UNRESOLVED",
      detectedBy: "Scanning tool execution",
      sourceAsset: {
        name: "PLC-01",
        ipAddress: "192.168.10.10",
        zones: ["ZONE A"]
      },
      recommendations: [
        "Regular Firmware Updates: Keep PLC firmware up to date to patch known vulnerabilities.",
        "Isolate PLCs from external networks to limit exposure.",
        "Implement strict authentication and authorization protocols."
      ]
    },
    "CVE-2023-215": {
      title: "SCADA Command Injection",
      severity: "High",
      whatHappened: "A command injection vulnerability in the SCADA system could allow unauthorized command execution, potentially leading to system compromise.",
      occurredAt: "15/10/24, 14:30",
      lastSeen: "17/10/24, 09:15",
      state: "MITIGATED",
      detectedBy: "Security Audit",
      sourceAsset: {
        name: "SCADA-Server",
        ipAddress: "10.10.5",
        zones: ["ZONE B"]
      },
      recommendations: [
        "Apply latest security patches",
        "Implement input validation",
        "Enable comprehensive logging and monitoring"
      ]
    }
  };
  
  return vulnerabilities[id as keyof typeof vulnerabilities];
};

export default function DetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Invalid vulnerability ID
        </div>
      </div>
    );
  }

  const vulnerabilityData = getVulnerabilityData(id);

  if (!vulnerabilityData) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Vulnerability not found
        </div>
      </div>
    );
  }

  const handleShareViaEmail = () => {
    const subject = `Vulnerability Alert: ${vulnerabilityData.title}`;
    const body = `
Vulnerability Details:

Title: ${vulnerabilityData.title}
Severity: ${vulnerabilityData.severity}
State: ${vulnerabilityData.state}

What Happened:
${vulnerabilityData.whatHappened}

Timeline:
- Occurred At: ${vulnerabilityData.occurredAt}
- Last Seen: ${vulnerabilityData.lastSeen}
- Detected By: ${vulnerabilityData.detectedBy}

Source Asset Details:
- Name: ${vulnerabilityData.sourceAsset.name}
- IP Address: ${vulnerabilityData.sourceAsset.ipAddress}
- Zones: ${vulnerabilityData.sourceAsset.zones.join(', ')}

Recommendations:
${vulnerabilityData.recommendations.map(rec => `- ${rec}`).join('\n')}
    `.trim();

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ShieldAlert className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold">{vulnerabilityData.title}</h1>
          <Badge variant="destructive">{vulnerabilityData.severity}</Badge>
        </div>
        <Button
          variant="outline"
          onClick={handleShareViaEmail}
          className="flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          Share via Email
        </Button>
      </div>

      <Card>
        <CardHeader className="text-lg font-semibold">
          Detection Information
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">WHAT HAPPENED</h3>
            <p className="text-muted-foreground">
              {vulnerabilityData.whatHappened}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">OCCURRED AT:</h3>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{vulnerabilityData.occurredAt}</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">LAST SEEN:</h3>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{vulnerabilityData.lastSeen}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">STATE:</h3>
              <Badge variant="outline">{vulnerabilityData.state}</Badge>
            </div>
            <div>
              <h3 className="font-semibold mb-2">DETECTED BY:</h3>
              <span>{vulnerabilityData.detectedBy}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-lg font-semibold">
          Source Asset Details
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <Server className="h-12 w-12" />
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold">NAME:</h3>
                <p>{vulnerabilityData.sourceAsset.name}</p>
              </div>
              <div>
                <h3 className="font-semibold">IP ADDRESS:</h3>
                <p>{vulnerabilityData.sourceAsset.ipAddress}</p>
              </div>
              <div>
                <h3 className="font-semibold">ZONES:</h3>
                <div className="flex gap-2">
                  {vulnerabilityData.sourceAsset.zones.map((zone) => (
                    <Badge key={zone} variant="secondary">
                      {zone}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-lg font-semibold">
          Recommendation
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            {vulnerabilityData.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 