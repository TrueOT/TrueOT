// Script to import vulnerability data into the database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importVulnData() {
  try {
    // Sample data from the table in the image
    const vulnData = [
      {
        cveId: "CVE-2002-0933",
        cweId: "NVD-CWE-Other",
        cveName: "Datalex PLC BookIt!",
        cvssVersion: "2",
        cvssScore: 7.5,
        originalSeverity: "HIGH",
        newSeverity: "HIGH",
        description: "Datalex PLC BookIt! vulnerability",
        ipAddress: "192.168.10.10",
        device: "PLC-01",
        status: "Open"
      },
      {
        cveId: "CVE-2011-5007",
        cweId: "CWE-119",
        cveName: "Stack-based buffer overflow",
        cvssVersion: "2",
        cvssScore: 10.0,
        originalSeverity: "HIGH",
        newSeverity: "HIGH",
        description: "Stack-based buffer overflow vulnerability",
        ipAddress: "192.168.10.11",
        device: "SCADA-Server",
        status: "Open"
      },
      {
        cveId: "CVE-2012-0929",
        cweId: "CWE-119",
        cveName: "Multiple buffer overflow",
        cvssVersion: "3.1",
        cvssScore: 7.5,
        originalSeverity: "HIGH",
        newSeverity: "HIGH",
        description: "Multiple buffer overflow vulnerability",
        ipAddress: "192.168.10.12",
        device: "HMI-Panel",
        status: "Open"
      },
      {
        cveId: "CVE-2012-0930",
        cweId: "CWE-79",
        cveName: "Cross-site scripting",
        cvssVersion: "3.1",
        cvssScore: 6.1,
        originalSeverity: "MEDIUM",
        newSeverity: "MEDIUM",
        description: "Cross-site scripting vulnerability",
        ipAddress: "192.168.10.13",
        device: "RTU-Controller",
        status: "Open"
      },
      {
        cveId: "CVE-2012-0931",
        cweId: "CWE-287",
        cveName: "Schneider Electric Modicon",
        cvssVersion: "3.1",
        cvssScore: 9.8,
        originalSeverity: "CRITICAL",
        newSeverity: "CRITICAL",
        description: "Schneider Electric Modicon vulnerability",
        ipAddress: "192.168.10.14",
        device: "Historian-01",
        status: "Open"
      },
      {
        cveId: "CVE-2012-3037",
        cweId: "CWE-295",
        cveName: "The Siemens SIMATIC",
        cvssVersion: "2",
        cvssScore: 4.3,
        originalSeverity: "MEDIUM",
        newSeverity: "MEDIUM",
        description: "The Siemens SIMATIC vulnerability",
        ipAddress: "192.168.10.15",
        device: "Switch-01",
        status: "Open"
      },
      {
        cveId: "CVE-2012-3040",
        cweId: "CWE-79",
        cveName: "Cross-site scripting",
        cvssVersion: "2",
        cvssScore: 4.3,
        originalSeverity: "MEDIUM",
        newSeverity: "MEDIUM",
        description: "Cross-site scripting vulnerability",
        ipAddress: "192.168.10.16",
        device: "RTU-01",
        status: "Open"
      },
      {
        cveId: "CVE-2012-4605",
        cweId: "CWE-200",
        cveName: "The default configuration",
        cvssVersion: "2",
        cvssScore: 5.0,
        originalSeverity: "MEDIUM",
        newSeverity: "MEDIUM",
        description: "The default configuration vulnerability",
        ipAddress: "192.168.10.17",
        device: "Gateway-01",
        status: "Open"
      },
      {
        cveId: "CVE-2012-4690",
        cweId: "CWE-16",
        cveName: "Rockwell Automation",
        cvssVersion: "2",
        cvssScore: 7.1,
        originalSeverity: "HIGH",
        newSeverity: "HIGH",
        description: "Rockwell Automation vulnerability",
        ipAddress: "192.168.10.18",
        device: "Robot-Arm-01",
        status: "Open"
      }
    ];

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
        // Print more detailed error information
        if (error.code) {
          console.error(`Error code: ${error.code}`);
        }
        if (error.meta) {
          console.error(`Error meta:`, error.meta);
        }
      }
    }
    
    console.log('Successfully imported all vulnerability reports.');
  } catch (error) {
    console.error('Error importing vulnerability data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importVulnData(); 