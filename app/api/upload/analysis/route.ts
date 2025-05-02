import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const assetFile = formData.get('assetfile') as File;
    const scanReportFile = formData.get('scan_report') as File;
    
    if (!assetFile || !scanReportFile) {
      return NextResponse.json({ 
        error: 'Both asset classification file and vulnerability scan report are required' 
      }, { status: 400 });
    }

    // Create a new FormData object to send to the external API
    const apiFormData = new FormData();
    apiFormData.append('assetfile', assetFile);
    apiFormData.append('scan_report', scanReportFile);

    // Call the external API
    const response = await fetch('http://127.0.0.1:8000/getLlmResults', {
      method: 'POST',
      body: apiFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.status || data.status !== 'success' || !data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format from API');
    }

    // Store each vulnerability analysis result in the database
    const results = [];
    for (const item of data.data) {
      const analysis = await db.vulnerabilityAnalysis.create({
        data: {
          cveId: item["CVE ID"],
          cveName: item["CVE Name"],
          assetName: item["Asset Name"],
          ipAddress: item["IP Address"],
          vulnerabilitySeverity: item["Vulnerability Severity"],
          predefinedSeverity: item["Predefined Severity"],
          riskLevel: item["risk_level"],
          llmJustification: item["llm_justification"],
          securityDescription: item["security_description"] || "",
          userId: session.user.id
        }
      });
      results.push(analysis);
    }

    return NextResponse.json({ 
      success: true,
      message: `Successfully processed ${results.length} vulnerability analyses`,
      data: results
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process vulnerability analysis' },
      { status: 500 }
    );
  }
} 