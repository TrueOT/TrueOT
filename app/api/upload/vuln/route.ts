import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
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
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read the Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'No data found in file' }, { status: 400 });
    }

    // Map common variations of field names - matching the asset implementation style
    const fieldMappings = {
      cveId: ['CVE ID', 'CVE-ID', 'CVEID', 'cve id', 'cve-id', 'cveid', 'CVE', 'cve'],
      cweId: ['CWE ID', 'CWE-ID', 'CWEID', 'cwe id', 'cwe-id', 'cweid', 'CWE', 'cwe'],
      cveName: ['CVE Name', 'CVE_NAME', 'CVENAME', 'Vulnerability Name', 'Title', 'Name', 'TITLE'],
      cvssVersion: ['CVSS Version', 'CVSS_VERSION', 'Version', 'CVSS', 'cvss version'],
      cvssScore: ['CVSS Score', 'CVSS_SCORE', 'Score', 'SCORE', 'cvss score'],
      cvssSeverity: ['CVSS Severity', 'CVSS_SEVERITY', 'Severity', 'SEVERITY', 'cvss severity'],
      description: ['CVE Description', 'Description', 'DESC', 'Details', 'DESCRIPTION']
    };

    // Function to find the actual column name in the data - exact match from asset implementation
    const findFieldName = (row: any, fieldVariations: string[]) => {
      const rowKeys = Object.keys(row);
      return rowKeys.find(key => fieldVariations.includes(key));
    };

    // Process each vulnerability record
    for (const row of data as any[]) {
      const vulnData: any = {};
      
      // Map each field using the variations
      for (const [field, variations] of Object.entries(fieldMappings)) {
        const foundField = findFieldName(row, variations);
        if (!foundField && field !== 'cweId') { // cweId is optional
          throw new Error(
            `Missing required field: ${field}. \nAccepted column names are: ${variations.join(', ')}\n` +
            `Found columns: ${Object.keys(row).join(', ')}`
          );
        }
        if (foundField) {
          // Handle specific field type conversions
          if (field === 'cvssScore') {
            vulnData[field] = parseFloat(row[foundField]);
          } else if (field === 'cvssVersion') {
            vulnData[field] = String(row[foundField]); // Ensure cvssVersion is a string
          } else {
            vulnData[field] = row[foundField];
          }
        }
      }

      // Check if this CVE already exists for this user
      const existingVuln = await db.vulnReport.findUnique({
        where: {
          cveId_userId: {
            cveId: vulnData.cveId,
            userId: session.user.id
          }
        }
      });

      if (existingVuln) {
        // Update the existing record
        await db.vulnReport.update({
          where: {
            cveId_userId: {
              cveId: vulnData.cveId,
              userId: session.user.id
            }
          },
          data: {
            ...vulnData
          }
        });
      } else {
        // Create a new record
        await db.vulnReport.create({
          data: {
            ...vulnData,
            userId: session.user.id
          }
        });
      }
    }

    return NextResponse.json({ 
      success: true,
      message: `Successfully processed ${data.length} vulnerabilities`
    });
  } catch (error) {
    // Log the error for debugging
    console.error('Upload error:', error);
    
    // Fix the error response format
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process upload' },
      { status: 500 }
    );
  }
}