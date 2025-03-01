// Script to import vulnerability data from a JSON file
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function importVulnDataFromJson() {
  try {
    // Read the JSON file
    const jsonPath = path.join(__dirname, 'vuln-data.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const vulnData = JSON.parse(jsonData);
    
    // Get the first user from the database to associate with these reports
    // In a real application, you would determine the correct user for each report
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.error('No user found in the database. Cannot import vulnerability data.');
      return;
    }

    console.log(`Importing ${vulnData.length} vulnerability reports for user ${user.id}...`);
    
    // First, let's delete all existing reports to start fresh
    console.log('Deleting existing vulnerability reports...');
    await prisma.vulnReport.deleteMany({
      where: {
        userId: user.id
      }
    });
    console.log('Existing vulnerability reports deleted.');
    
    // Import each vulnerability report
    for (const vuln of vulnData) {
      try {
        console.log(`Creating report for ${vuln.cveId}...`);
        
        // Create new report
        await prisma.vulnReport.create({
          data: {
            cveId: vuln.cveId,
            cweId: vuln.cweId,
            cveName: vuln.cveName,
            cvssVersion: vuln.cvssVersion,
            cvssScore: vuln.cvssScore,
            originalSeverity: vuln.originalSeverity,
            newSeverity: vuln.newSeverity,
            description: vuln.description,
            ipAddress: vuln.ipAddress,
            device: vuln.device,
            status: vuln.status,
            userId: user.id
          }
        });
        console.log(`Created report for ${vuln.cveId}`);
      } catch (error) {
        console.error(`Error importing vulnerability ${vuln.cveId}:`, error);
      }
    }
    
    console.log('Successfully imported all vulnerability reports from JSON file.');
  } catch (error) {
    console.error('Error importing vulnerability data from JSON:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importVulnDataFromJson(); 