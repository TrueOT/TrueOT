// Script to check what vulnerability reports are currently in the database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkVulnReports() {
  try {
    // Get all vulnerability reports
    const vulnReports = await prisma.vulnReport.findMany({
      orderBy: {
        cveId: 'asc'
      }
    });
    
    console.log(`Found ${vulnReports.length} vulnerability reports in the database:\n`);
    
    // Print details of each report
    vulnReports.forEach((report, index) => {
      console.log(`Report #${index + 1}: ${report.cveId}`);
      console.log(`----------------------------------------`);
      console.log(`ID: ${report.id}`);
      console.log(`CVE ID: ${report.cveId}`);
      console.log(`CWE ID: ${report.cweId || 'N/A'}`);
      console.log(`CVE Name: ${report.cveName}`);
      console.log(`CVSS Version: ${report.cvssVersion}`);
      console.log(`CVSS Score: ${report.cvssScore}`);
      console.log(`Original Severity: ${report.originalSeverity}`);
      console.log(`New Severity: ${report.newSeverity}`);
      console.log(`IP Address: ${report.ipAddress || 'N/A'}`);
      console.log(`Device: ${report.device || 'N/A'}`);
      console.log(`Status: ${report.status}`);
      console.log(`Created At: ${report.createdAt.toISOString()}`);
      console.log(`Updated At: ${report.updatedAt.toISOString()}`);
      console.log(`User ID: ${report.userId}`);
      console.log(`----------------------------------------\n`);
    });
  } catch (error) {
    console.error('Error checking vulnerability reports:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVulnReports(); 