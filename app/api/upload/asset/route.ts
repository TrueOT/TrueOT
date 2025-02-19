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

    // Map common variations of field names
    const fieldMappings = {
      assetName: ['assetname', 'asset name', 'asset_name', 'name', 'Asset Name', 'AssetName'],
      assetType: ['assettype', 'asset type', 'asset_type', 'type', 'Asset Type', 'AssetType'],
      manufacturer: ['manufacturer', 'vendor', 'Manufacturer', 'Vendor'],
      model: ['model', 'device model', 'Model', 'DeviceModel'],
      serialNumber: ['serialnumber', 'serial number', 'serial_number', 'serial', 'Serial Number', 'SerialNumber'],
      firmwareVersion: ['firmwareversion', 'firmware version', 'firmware_version', 'firmware', 'Firmware Version', 'FirmwareVersion'],
      ipAddress: ['ipaddress', 'ip address', 'ip_address', 'ip', 'IP Address', 'IPAddress', 'IP'],
      location: ['location', 'Location', 'asset_location', 'Asset Location'],
      criticality: ['criticality', 'critical level', 'priority', 'Criticality', 'Critical Level', 'Priority'],
      networkSegment: ['networksegment', 'network segment', 'network_segment', 'segment', 'Network Segment', 'NetworkSegment'],
      lastScannedDate: [
        'lastscandate', 
        'last scan date', 
        'scan_date', 
        'scandate', 
        'date',
        'Last Scan Date',
        'LastScanDate',
        'ScanDate',
        'Last Scanned Date',
        'LastScannedDate',
        'Scan Date',
        'Date Scanned',
        'DateScanned'
      ],
      notes: ['notes', 'comments', 'description', 'Notes', 'Comments', 'Description']
    };

    // Function to find the actual column name in the data
    const findFieldName = (row: any, fieldVariations: string[]) => {
      const rowKeys = Object.keys(row);
      return rowKeys.find(key => fieldVariations.includes(key));
    };

    // Insert assets into database
    for (const row of data as any[]) {
      const assetData: any = {};
      
      // Map each field using the variations
      for (const [field, variations] of Object.entries(fieldMappings)) {
        const foundField = findFieldName(row, variations);
        if (!foundField && field !== 'notes') { // notes is optional
          throw new Error(
            `Missing required field: ${field}. \nAccepted column names are: ${variations.join(', ')}\n` +
            `Found columns: ${Object.keys(row).join(', ')}`
          );
        }
        if (foundField) {
          assetData[field] = field === 'lastScannedDate' 
            ? new Date(row[foundField])
            : row[foundField];
        }
      }

      await db.asset.create({
        data: {
          ...assetData,
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process upload' },
      { status: 500 }
    );
  }
} 