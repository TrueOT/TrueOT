def test_console_output():
    """Test if console output is limiting the character display."""
    
    # Test with a long string similar to a CVE description
    test_string = "Incorrect Access Control in Beckhoff Automation GmbH & Co. KG CX9020 with firmware version CX9020_CB3011_WEC7_HPS_v602_TC31_B4016.6 allows remote attackers to bypass authentication via the 'CE Remote Display Tool' as it does not close the incoming connection on the Windows CE side if the credentials are incorrect."
    
    # Print the string length
    print(f"String length: {len(test_string)}")
    
    # Print the full string
    print("\nFull string:")
    print(test_string)
    
    # Print specific parts to check if truncation is occurring
    print("\nFirst 50 characters:")
    print(test_string[:50])
    
    print("\nCharacters 50-100:")
    print(test_string[50:100])
    
    print("\nCharacters 100-150:")
    print(test_string[100:150])
    
    print("\nCharacters 150-200:")
    print(test_string[150:200])
    
    print("\nCharacters 200-250:")
    print(test_string[200:250])
    
    # Test for potential console width issues
    print("\nChecking for console width issues:")
    for i in range(0, len(test_string), 50):
        print(f"\nChunk {i//50 + 1}: {test_string[i:i+50]}")

if __name__ == "__main__":
    test_console_output() 