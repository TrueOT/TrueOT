# Vulnerability Upload Template

## Excel File Format

To upload vulnerability data, please use an Excel file (.xlsx) with the following columns:

### Required Columns:
- **CVE ID**: The Common Vulnerabilities and Exposures identifier (e.g., CVE-2021-44228)
- **CVE Name**: The name or title of the vulnerability
- **CVSS Version**: The CVSS version used for scoring (e.g., 2, 3, 3.1)
- **CVSS Score**: The numerical CVSS score (e.g., 7.5, 9.8)
- **Original Severity**: The severity rating (e.g., LOW, MEDIUM, HIGH, CRITICAL)
- **Description**: A description of the vulnerability

### Optional Columns:
- **CWE ID**: The Common Weakness Enumeration identifier (e.g., CWE-79, CWE-119)
- **New Severity**: A custom severity rating that can differ from the original (defaults to Original Severity if not provided)
- **IP Address**: The IP address of the affected system
- **Device**: The name of the affected device
- **Status**: The status of the vulnerability (defaults to "Open" if not provided)

## Column Name Variations

The system recognizes various column name formats. Here are the accepted variations for each field:

- **CVE ID**: CVE ID, CVE-ID, CVEID, cve id, cve-id, cveid, CVE, cve
- **CWE ID**: CWE ID, CWE-ID, CWEID, cwe id, cwe-id, cweid, CWE, cwe
- **CVE Name**: CVE Name, CVE_NAME, CVENAME, Vulnerability Name, Title, Name, TITLE
- **CVSS Version**: CVSS Version, CVSS_VERSION, Version, CVSS, cvss version
- **CVSS Score**: CVSS Score, CVSS_SCORE, Score, SCORE, cvss score
- **Original Severity**: CVSS Severity, Original Severity, CVSS_SEVERITY, Severity, SEVERITY, cvss severity, original severity
- **New Severity**: New Severity, NEW_SEVERITY, Updated Severity, new severity
- **Description**: CVE Description, Description, DESC, Details, DESCRIPTION
- **IP Address**: IP Address, IP, IP_ADDRESS, Host IP, ip address, host ip, Ip address, Ip Address
- **Device**: Device, DEVICE, Device Name, Host Name, device name, host name
- **Status**: Status, STATUS, State, STATE, status

## Example Data

| CVE ID | CWE ID | CVE Name | CVSS Version | CVSS Score | Original Severity | New Severity | Description | IP Address | Device | Status |
|--------|--------|----------|--------------|------------|-------------------|--------------|-------------|------------|--------|--------|
| CVE-2002-0933 | NVD-CWE-Other | Datalex PLC BookIt! | 2 | 7.5 | HIGH | HIGH | Datalex PLC BookIt! vulnerability | 192.168.10.10 | PLC-01 | Open |
| CVE-2011-5007 | CWE-119 | Stack-based buffer overflow | 2 | 10.0 | HIGH | HIGH | Stack-based buffer overflow vulnerability | 192.168.10.11 | SCADA-Server | Open |
| CVE-2012-0929 | CWE-119 | Multiple buffer overflow | 3.1 | 7.5 | HIGH | HIGH | Multiple buffer overflow vulnerability | 192.168.10.12 | HMI-Panel | Open |
| CVE-2012-0930 | CWE-79 | Cross-site scripting | 3.1 | 6.1 | MEDIUM | MEDIUM | Cross-site scripting vulnerability | 192.168.10.13 | RTU-Controller | Open |
| CVE-2012-0931 | CWE-287 | Schneider Electric Modicon | 3.1 | 9.8 | CRITICAL | CRITICAL | Schneider Electric Modicon vulnerability | 192.168.10.14 | Historian-01 | Open |

## Notes

- The system will automatically update existing vulnerabilities if the CVE ID already exists for your account.
- If a required field is missing, the upload will fail with an error message.
- For optional fields, default values will be used if not provided.
- The "New Severity" field will default to the same value as "Original Severity" if not provided.
- The "Status" field will default to "Open" if not provided.
- The system automatically trims whitespace and tab characters from column names, but it's best to avoid them in your Excel file. 