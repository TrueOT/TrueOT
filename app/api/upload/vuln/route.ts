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

    // Preprocess the data to clean up column names
    const cleanedData = data.map(row => {
      const cleanedRow: any = {};
      Object.entries(row as object).forEach(([key, value]) => {
        // Trim whitespace and tabs from column names
        const cleanKey = key.trim();
        cleanedRow[cleanKey] = value;
      });
      return cleanedRow;
    });

    // Debug: Log the column names found in the first row
    if (cleanedData.length > 0) {
      const columns = Object.keys(cleanedData[0]);
      console.log('Columns found in uploaded file (after cleaning):', columns);
      
      // Debug: Log column names with their character codes to identify special characters
      console.log('Column names with character codes:');
      columns.forEach(col => {
        const charCodes = Array.from(col).map(c => c.charCodeAt(0));
        console.log(`"${col}": ${JSON.stringify(charCodes)}`);
      });
    }

    // Map common variations of field names - matching the asset implementation style
    const fieldMappings = {
      cveId: ['CVE ID', 'CVE-ID', 'CVEID', 'cve id', 'cve-id', 'cveid', 'CVE', 'cve'],
      cweId: ['CWE ID', 'CWE-ID', 'CWEID', 'cwe id', 'cwe-id', 'cweid', 'CWE', 'cwe'],
      cveName: ['CVE Name', 'CVE_NAME', 'CVENAME', 'Vulnerability Name', 'Title', 'Name', 'TITLE'],
      cvssVersion: ['CVSS Version', 'CVSS_VERSION', 'Version', 'CVSS', 'cvss version'],
      cvssScore: ['CVSS Score', 'CVSS_SCORE', 'Score', 'SCORE', 'cvss score'],
      originalSeverity: ['CVSS Severity', 'Original Severity', 'CVSS_SEVERITY', 'Severity', 'SEVERITY', 'cvss severity', 'original severity'],
      newSeverity: ['New Severity', 'NEW_SEVERITY', 'Updated Severity', 'new severity'],
      description: ['CVE Description', 'Description', 'DESC', 'Details', 'DESCRIPTION'],
      ipAddress: ['IP Address', 'IP', 'IP_ADDRESS', 'Host IP', 'ip address', 'host ip', 'Ip address', 'Ip Address', 'IP Address\t', 'ipAddress'],
      device: ['Device', 'DEVICE', 'Device Name', 'Host Name', 'device name', 'host name'],
      status: ['Status', 'STATUS', 'State', 'STATE', 'status']
    };

    // Function to find the actual column name in the data - exact match from asset implementation
    const findFieldName = (row: any, fieldVariations: string[]) => {
      const rowKeys = Object.keys(row);
      // First try exact match
      const exactMatch = rowKeys.find(key => fieldVariations.includes(key));
      if (exactMatch) return exactMatch;
      
      // If no exact match, try trimming whitespace and tabs
      return rowKeys.find(key => {
        const trimmedKey = key.trim();
        return fieldVariations.includes(trimmedKey);
      });
    };

    // Process each vulnerability record
    for (const row of cleanedData as any[]) {
      const vulnData: any = {};
      const missingRequiredFields: string[] = [];
      
      // Map each field using the variations
      for (const [field, variations] of Object.entries(fieldMappings)) {
        const foundField = findFieldName(row, variations);
        // Only cweId, ipAddress, device, newSeverity, and status are optional
        if (!foundField && !['cweId', 'ipAddress', 'device', 'newSeverity', 'status'].includes(field)) {
          missingRequiredFields.push(`${field} (accepted names: ${variations.join(', ')})`);
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

      // If there are missing required fields, throw an error
      if (missingRequiredFields.length > 0) {
        throw new Error(
          `Missing required fields: ${missingRequiredFields.join(', ')}\n` +
          `Found columns: ${Object.keys(row).join(', ')}`
        );
      }

      // Set default values for optional fields if not provided
      if (!vulnData.newSeverity && vulnData.originalSeverity) {
        vulnData.newSeverity = vulnData.originalSeverity;
      }
      
      if (!vulnData.status) {
        vulnData.status = 'Open';
      }

      // Check if this CVE already exists for this user
      const existingVuln = await db.vulnReport.findFirst({
        where: {
          cveId: vulnData.cveId,
          userId: session.user.id
        }
      });

      if (existingVuln) {
        // Update the existing record
        await db.vulnReport.update({
          where: {
            id: existingVuln.id
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