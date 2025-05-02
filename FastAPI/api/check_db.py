import json
import pandas as pd
from utils.utils import get_security_description

def test_data_serialization():
    """Test if data is being truncated during serialization to JSON or other formats."""
    
    # Example CVE for Beckhoff Automation
    test_string = """Incorrect Access Control in Beckhoff Automation GmbH & Co. KG CX9020 with firmware version CX9020_CB3011_WEC7_HPS_v602_TC31_B4016.6 allows remote attackers to bypass authentication via the 'CE Remote Display Tool' as it does not close the incoming connection on the Windows CE side if the credentials are incorrect."""
    
    # Open a file to write results (to avoid console truncation)
    with open("serialization_test_results.txt", "w") as f:
        f.write(f"Original string length: {len(test_string)}\n")
        f.write(f"Original string: {test_string}\n\n")
        
        # Test different serialization methods
        
        # 1. JSON serialization
        data = {"description": test_string}
        json_str = json.dumps(data)
        json_data = json.loads(json_str)
        f.write(f"After JSON serialization, length: {len(json_data['description'])}\n")
        f.write(f"JSON serialized: {json_data['description']}\n\n")
        
        # 2. DataFrame serialization
        df = pd.DataFrame({"description": [test_string]})
        
        # 2.1 CSV serialization (common for database exports)
        df.to_csv("test_desc.csv", index=False)
        df_csv = pd.read_csv("test_desc.csv")
        f.write(f"After CSV serialization, length: {len(df_csv.iloc[0]['description'])}\n")
        f.write(f"CSV serialized: {df_csv.iloc[0]['description']}\n\n")
        
        # 2.2 JSON serialization via pandas
        json_records = df.to_json(orient="records")
        df_json = pd.read_json(json_records)
        f.write(f"After DataFrame JSON serialization, length: {len(df_json.iloc[0]['description'])}\n")
        f.write(f"DataFrame JSON serialized: {df_json.iloc[0]['description']}\n\n")
        
        # 3. Dictionary conversion (used in API responses)
        df_dict = df.to_dict(orient="records")
        f.write(f"After dict conversion, length: {len(df_dict[0]['description'])}\n")
        f.write(f"Dict conversion: {df_dict[0]['description']}\n\n")
        
        # 5. Test combinations used in the actual code
        test_df = pd.DataFrame({
            "CVE ID": ["CVE-2020-20741"],
            "security_description": [test_string],
            "Predefined Severity": ["Medium"],
            "risk_level": ["High"],
            "llm_justification": ["Test justification"]
        })
        
        # Select columns (as done in the main code)
        result_columns = ["CVE ID", "security_description", "Predefined Severity", "risk_level", "llm_justification"]
        result_df = test_df[result_columns]
        
        # Convert to JSON response (as in the API)
        api_response = {
            "status": "success",
            "data": result_df.to_dict(orient="records"),
            "columns": result_columns
        }
        
        # Serialize and deserialize (simulating API transport)
        api_json = json.dumps(api_response)
        received_data = json.loads(api_json)
        
        # Check final data
        f.write("\nFinal data check:\n")
        f.write(f"Original length: {len(test_string)}\n")
        f.write(f"After API serialization, length: {len(received_data['data'][0]['security_description'])}\n")
        f.write(f"API serialized: {received_data['data'][0]['security_description']}\n")
    
    print("Test completed. Results written to serialization_test_results.txt")

    # Now let's test if the issue is with pandas.to_csv (used in your debug code)
    # Create a test DataFrame with the problematic description
    test_df = pd.DataFrame({
        "CVE ID": ["CVE-2020-20741"],
        "security_description": [test_string],
        "Predefined Severity": ["Medium"]
    })
    
    # Export to CSV (as done in your debugging code)
    test_df.to_csv("debug_csv_test.csv", encoding='utf-8')
    
    # Read back the CSV to check if descriptions are truncated
    read_df = pd.read_csv("debug_csv_test.csv")
    
    # Print the results
    print(f"Checking CSV storage: Original length={len(test_string)}")
    csv_desc = read_df.iloc[0]["security_description"]
    print(f"After CSV read: Length={len(csv_desc)}")
    print(f"First 60 chars: {csv_desc[:60]}")

if __name__ == "__main__":
    test_data_serialization() 