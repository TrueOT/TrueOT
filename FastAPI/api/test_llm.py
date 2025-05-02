import pandas as pd
from model.llm_process import LLMParser
from main import get_security_description, API_KEYS

def test_llm_with_security_description():
    # Initialize LLM model
    llm = LLMParser(model_name="deepseek-r1-distill-llama-70b", model_provider="groq")
    
    # Test CVE IDs
    cve_ids = ['CVE-2021-42392', 'CVE-2022-30190']
    
    # Create test dataframe
    test_data = []
    for i, cve_id in enumerate(cve_ids):
        # Get full security description
        desc = get_security_description(cve_id, API_KEYS)
        print(f"\nOriginal CVE Description for {cve_id}:")
        print(f"Length: {len(desc) if desc else 0}")
        print(f"Content: {desc}\n")
        
        # Add to test data
        test_data.append({
            'Predefined Severity': 'Medium',
            'Note': 'Test note',
            'security_description': desc,
            'Classification': 'Medium',
            '\tSafety Impact': 'Medium',
            'Hosting': 'Isolated',
            'Vulnerability Severity': 'Medium'
        })
    
    # Create test dataframe
    test_df = pd.DataFrame(test_data)
    
    # Call LLM refine_risk_level
    result_df = llm.refine_risk_level(test_df)
    
    # Check results
    print("\nResults after LLM processing:")
    for i, row in result_df.iterrows():
        print(f"Risk Level {i}: {row.get('risk_level')}")
        print(f"Justification {i}: {row.get('llm_justification')[:100]}...")

if __name__ == "__main__":
    test_llm_with_security_description() 