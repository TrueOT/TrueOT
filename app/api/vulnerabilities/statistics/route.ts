import { prisma } from "../../../../lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all vulnerabilities
    const vulnerabilities = await prisma.vulnerabilityAnalysis.findMany({
      select: {
        riskLevel: true,
      }
    });

    // Count by risk level
    const riskLevelCounts = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0
    };

    // Count occurrences of each risk level
    vulnerabilities.forEach(vuln => {
      const riskLevel = vuln.riskLevel?.toUpperCase();
      if (riskLevel) {
        if (riskLevel.includes('CRITICAL')) {
          riskLevelCounts.CRITICAL += 1;
        } else if (riskLevel.includes('HIGH')) {
          riskLevelCounts.HIGH += 1;
        } else if (riskLevel.includes('MEDIUM')) {
          riskLevelCounts.MEDIUM += 1;
        } else if (riskLevel.includes('LOW')) {
          riskLevelCounts.LOW += 1;
        }
      }
    });

    // Calculate total
    const total = Object.values(riskLevelCounts).reduce((acc, count) => acc + count, 0);

    return NextResponse.json({
      riskLevelCounts,
      total
    });
  } catch (error) {
    console.error("Error fetching vulnerability statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch vulnerability statistics" },
      { status: 500 }
    );
  }
} 