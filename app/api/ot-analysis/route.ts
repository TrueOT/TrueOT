import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ensure the route is dynamically processed
export const dynamic = 'force-dynamic'; 

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    // Although Next.js App Router usually handles this by exported function name,
    // explicit check can be helpful.
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const body = await req.json();

    // Validate the incoming data structure
    if (!body || typeof body !== 'object' || !Array.isArray(body.data)) {
      return NextResponse.json(
        { error: 'Invalid request format: Missing or invalid "data" array.' },
        { status: 400 }
      );
    }

    // Process each item in the data array
    const creationPromises = body.data.map((item: any) => {
      // Basic validation for each item (can be expanded)
      if (!item['CVE ID'] || !item['Asset Name']) {
        console.warn('Skipping item due to missing required fields:', item);
        return Promise.resolve(null); // Resolve to null to skip this item
      }
      
      return prisma.vulnerabilityAnalysis.create({
        data: {
          cveId:               item['CVE ID'] || 'N/A',
          cveName:             item['CVE Name'] || 'N/A',
          assetName:           item['Asset Name'] || 'N/A',
          ipAddress:           item['IP Address'] || 'N/A',
          vulnerabilitySeverity: item['Vulnerability Severity'] || 'Unknown',
          predefinedSeverity:  item['Predefined Severity'] || 'Unknown',
          riskLevel:           item['risk_level'] || 'Unknown',
          llmJustification:    item['llm_justification'] || 'N/A',
        },
      });
    });

    const results = await Promise.all(creationPromises);
    const successfulCreations = results.filter(result => result !== null);

    return NextResponse.json({
      status: 'success',
      message: `Successfully stored ${successfulCreations.length} vulnerability analysis records.`,
      storedCount: successfulCreations.length,
      skippedCount: body.data.length - successfulCreations.length,
    });

  } catch (error: any) {
    console.error('Error processing vulnerability data:', error);
    
    // More specific error handling could be added here (e.g., Prisma errors)
    let errorMessage = 'Failed to process vulnerability data';
    if (error instanceof SyntaxError) {
      errorMessage = 'Invalid JSON format in request body.';
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}

// Optional: Add GET handler to retrieve data
export async function GET(req: Request) {
   if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
  try {
    const vulnerabilities = await prisma.vulnerabilityAnalysis.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      status: 'success',
      data: vulnerabilities,
    });
  } catch (error: any) {
    console.error('Error fetching vulnerability data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vulnerability data', details: error.message },
      { status: 500 }
    );
  }
} 