'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ShieldAlert, Server, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { VulnerabilityAnalysis } from '@prisma/client';

// Define a type for the expected API response structure for the LIST endpoint
interface VulnerabilityListApiResponse {
  status: string;
  data: VulnerabilityAnalysis[]; // Expecting an array
  message?: string;
}

// Define a structure for the detailed vulnerability data expected by the component
// (Adjust this based on the actual structure needed and returned by your API)
interface DetailedVulnerabilityData extends VulnerabilityAnalysis {
  // Add any additional transformed/specific fields if needed
  // For now, let's assume VulnerabilityAnalysis is sufficient
  // If the API returns slightly different fields, map them here or adjust the type
}

export default function DetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [vulnerabilityData, setVulnerabilityData] = useState<DetailedVulnerabilityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid vulnerability ID.");
      setIsLoading(false);
      return;
    }

    const fetchAndFindVulnerability = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch the entire list of vulnerabilities
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/ot-analysis`);

        if (!res.ok) {
          throw new Error(`Failed to fetch vulnerability list: ${res.statusText}`);
        }

        const result: VulnerabilityListApiResponse = await res.json();

        if (result.status === 'success' && Array.isArray(result.data)) {
          // Find the specific vulnerability by ID in the list
          const foundVulnerability = result.data.find(vuln => vuln.id === id);

          if (foundVulnerability) {
            setVulnerabilityData(foundVulnerability as DetailedVulnerabilityData);
          } else {
            // List fetched successfully, but the specific ID was not found
            throw new Error("Vulnerability not found in the list.");
          }
        } else {
          throw new Error(result.message || "Failed to load vulnerability list or invalid format.");
        }
      } catch (err) {
        console.error("Error fetching/finding vulnerability:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
        setVulnerabilityData(null); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFindVulnerability();
  }, [id]); // Re-run effect if ID changes

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2">Loading vulnerability details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!vulnerabilityData) {
    // This case should ideally be caught by the error state now, but keep as a fallback
    return (
      <div className="container mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Vulnerability data could not be loaded.
        </div>
      </div>
    );
  }

  const handleShareViaEmail = () => {
    const subject = `Vulnerability Alert: ${vulnerabilityData.cveId || 'N/A'}`;
    const body = `
Vulnerability Details:

CVE ID: ${vulnerabilityData.cveId || 'N/A'}
CVE Name: ${vulnerabilityData.cveName || 'N/A'}
Severity: ${vulnerabilityData.vulnerabilitySeverity || 'N/A'}
Risk Level: ${vulnerabilityData.riskLevel || 'N/A'}
Justification: ${vulnerabilityData.llmJustification || 'N/A'}

Asset Details:
- Name: ${vulnerabilityData.assetName || 'N/A'}
- IP Address: ${vulnerabilityData.ipAddress || 'N/A'}

// Add other relevant fields from vulnerabilityData if needed
// Example: Created At: ${vulnerabilityData.createdAt ? new Date(vulnerabilityData.createdAt).toLocaleString() : 'N/A'}
    `.trim();

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ShieldAlert className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold">{vulnerabilityData.cveId || 'Vulnerability Details'}</h1>
          <Badge variant={vulnerabilityData.vulnerabilitySeverity?.toLowerCase() === 'critical' ? 'destructive' : 'secondary'}>
            {vulnerabilityData.vulnerabilitySeverity || 'Unknown Severity'}
          </Badge>
          <Badge variant="outline" className="ml-2">
            Status: {vulnerabilityData.status || 'Unknown'}
          </Badge>
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
          Vulnerability Details
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-4">
              {vulnerabilityData.cveName || 'No vulnerability description available.'}
            </p>
          </div>

          {vulnerabilityData.securityDescription && (
            <div>
              <h3 className="font-semibold mb-2">Security Description:</h3>
              <p className="text-muted-foreground mb-4">
                {vulnerabilityData.securityDescription}
              </p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Detected by:</h3>
            <p className="text-muted-foreground mb-4">Vulnerability Assessment Scanning Tool</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">LLM Justification</h3>
            <p className="text-muted-foreground">
              {vulnerabilityData.llmJustification || 'No justification provided.'}
            </p>
          </div>

          {vulnerabilityData.createdAt && (
             <div>
              <h3 className="font-semibold mb-2">Uploaded At:</h3>
               <div className="flex items-center gap-2">
                 <CalendarIcon className="h-4 w-4" />
                 <span>{new Date(vulnerabilityData.createdAt).toLocaleString()}</span>
              </div>
             </div>
          )}

          <div>
              <h3 className="font-semibold mb-2">New Severity:</h3>
              <Badge variant="outline">{vulnerabilityData.riskLevel || 'Unknown'}</Badge>
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
                <p>{vulnerabilityData.assetName || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold">IP ADDRESS:</h3>
                <p>{vulnerabilityData.ipAddress || 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 