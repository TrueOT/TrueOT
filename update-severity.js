// Script to update the VulnReport table with default values for the new fields
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateVulnReports() {
  try {
    // Get all vulnerability reports
    const vulnReports = await prisma.vulnReport.findMany();
    
    console.log(`Found ${vulnReports.length} vulnerability reports to update.`);
    
    // Update each report with default values if needed
    for (const report of vulnReports) {
      await prisma.vulnReport.update({
        where: { id: report.id },
        data: {
          // If originalSeverity is "Unknown", update it to a more appropriate value
          // You may want to customize this logic based on your data
          originalSeverity: report.originalSeverity === "Unknown" ? "Medium" : report.originalSeverity,
          // Set newSeverity to match originalSeverity
          newSeverity: report.originalSeverity === "Unknown" ? "Medium" : report.originalSeverity,
        },
      });
    }
    
    console.log('Successfully updated all vulnerability reports.');
  } catch (error) {
    console.error('Error updating vulnerability reports:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateVulnReports(); 