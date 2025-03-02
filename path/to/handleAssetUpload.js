function handleAssetUpload(data) {
  // Define mapping of accepted column variations
  const columnMappings = {
    model: ['model', 'device model', 'Model', 'DeviceModel', 'Asset Name'],
    assetName: ['Asset Name', 'asset name', 'Name', 'AssetName'],
    assetType: ['Asset Type', 'asset type', 'Type', 'AssetType'],
    manufacturer: ['Manufacturer', 'manufacturer', 'Make', 'Vendor'],
    firmwareVersion: ['Firmware Version', 'firmware version', 'Firmware', 'FirmwareVersion'],
    ipAddress: ['IP Address', 'ip address', 'IP', 'IPAddress'],
    criticality: ['Criticality', 'criticality', 'Priority'],
    networkSegment: ['Network Segment', 'network segment', 'Segment', 'NetworkSegment']
  };

  // Function to find matching column name
  const findMatchingColumn = (headers, possibleNames) => {
    return headers.find(header => possibleNames.includes(header));
  };

  // Get the headers from the data
  const headers = Object.keys(data[0]);

  // Map the found columns to standardized names
  const mappedData = data.map(row => {
    const mappedRow = {};
    
    // Process each field with fallback values
    for (const [standardField, possibleNames] of Object.entries(columnMappings)) {
      const foundColumn = findMatchingColumn(headers, possibleNames);
      
      // Special handling for model field
      if (standardField === 'model' && !foundColumn) {
        // If model is missing, use Asset Name or a default value
        const assetNameColumn = findMatchingColumn(headers, columnMappings.assetName);
        mappedRow[standardField] = assetNameColumn ? row[assetNameColumn] : 'Unknown Model';
      } else {
        mappedRow[standardField] = foundColumn ? row[foundColumn] : '';
      }
    }

    return mappedRow;
  });

  // Ensure the data is valid before returning
  if (!mappedData.length) {
    throw new Error('No data found in the uploaded file');
  }

  return mappedData;
} 