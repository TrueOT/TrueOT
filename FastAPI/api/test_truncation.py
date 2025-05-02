import io
import os
import json
import requests
from dotenv import load_dotenv
from utils.utils import get_security_description

# Load environment variables
load_dotenv()

# API configuration
API_KEYS = [
    os.getenv("API_KEY_1"),
    os.getenv("API_KEY_2"),
    os.getenv("API_KEY_3")
]

def test_description_truncation():
    # Test CVE for Beckhoff Automation
    cve_id = "CVE-2020-13577"
    
    # Get description directly from NVD API
    desc = get_security_description(cve_id, API_KEYS)
    print(f"\nOriginal NVD API Response for {cve_id}:")
    print(f"Length: {len(desc) if desc else 0}")
    print(f"Full description: {desc}")
    
    # Make a direct raw request to NVD API to check response format
    base_url = "https://services.nvd.nist.gov/rest/json/cves/2.0"
    url = f"{base_url}?cveId={cve_id}"
    
    for api_key in API_KEYS:
        if not api_key:
            continue
        
        headers = {"apiKey": api_key}
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('totalResults', 0) > 0:
                cve_data = data['vulnerabilities'][0]['cve']
                
                # Print all descriptions to see what's available
                print("\nAll descriptions from NVD API:")
                for i, desc in enumerate(cve_data.get('descriptions', [])):
                    print(f"Description {i}:")
                    print(f"  Language: {desc.get('lang')}")
                    print(f"  Value: {desc.get('value')}")
                    print(f"  Length: {len(desc.get('value', ''))}")
                
                # Test extracting English description with different methods
                for desc in cve_data.get('descriptions', []):
                    if desc.get('lang') == 'en':
                        full_desc = desc.get('value')
                        print(f"\nExtracted English description:")
                        print(f"Length: {len(full_desc)}")
                        print(f"Full text: {full_desc}")
                
                break
    
    print("\nThis should help identify if the truncation happens in the API response or database storage.")

if __name__ == "__main__":
    test_description_truncation() 