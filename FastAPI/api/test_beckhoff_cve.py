import os
import json
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

def test_beckhoff_cve():
    """Direct test for the Beckhoff CVE to ensure we get the full description."""
    cve_id = "CVE-2020-20741"  # Beckhoff CVE
    
    # Get the description directly
    desc = get_security_description(cve_id, API_KEYS)
    
    print(f"\nOriginal description for {cve_id}:")
    print(f"Length: {len(desc) if desc else 0}")
    print(f"Content: {desc}")
    
    # Write to a file to avoid console truncation
    with open("beckhoff_cve_test.txt", "w", encoding="utf-8") as f:
        f.write(f"CVE ID: {cve_id}\n")
        f.write(f"Description length: {len(desc) if desc else 0}\n")
        f.write(f"Full description: {desc}\n")
    
    print("\nDescription saved to beckhoff_cve_test.txt for full inspection")
    
    # Test JSON serialization (to simulate API response)
    test_data = {"cve_id": cve_id, "description": desc}
    json_str = json.dumps(test_data)
    
    # Save JSON to file
    with open("beckhoff_cve_json.json", "w", encoding="utf-8") as f:
        f.write(json_str)
    
    print("JSON serialization saved to beckhoff_cve_json.json")
    
    # Test deserialization
    with open("beckhoff_cve_json.json", "r", encoding="utf-8") as f:
        loaded_data = json.loads(f.read())
    
    print(f"\nAfter JSON round-trip:")
    print(f"Length: {len(loaded_data['description'])}")
    print(f"First 60 chars: {loaded_data['description'][:60]}...")

if __name__ == "__main__":
    test_beckhoff_cve() 