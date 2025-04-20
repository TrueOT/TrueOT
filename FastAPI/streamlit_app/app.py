import streamlit as st
import pandas as pd
import requests

# Set page configuration
st.set_page_config(
    page_title="OT Cybersecurity Analysis",
    page_icon="🔒",
    layout="wide"
)

# App title and description
st.title("OT Cybersecurity Analysis")
st.markdown("""
This application analyzes cybersecurity risks in Operational Technology (OT) environments 
by processing asset classification data and vulnerability scan reports.
""")

# Define the FastAPI server URL
API_URL = "http://127.0.0.1:8000/getLlmResults"

# Create sidebar for file uploads
with st.sidebar:
    st.header("Upload Files")
    
    # File upload widgets
    asset_file = st.file_uploader(
        "Upload Asset Classification File", 
        type=["xlsx"],
        help="Excel file containing asset classification data"
    )
    
    scan_file = st.file_uploader(
        "Upload Vulnerability Scan Report", 
        type=["pdf"],
        help="PDF file containing vulnerability scan results"
    )
    
    # Process button
    process_button = st.button("Process Files", type="primary", disabled=not (asset_file and scan_file))

# Main content area
if not asset_file or not scan_file:
    st.info("Please upload both required files in the sidebar to begin analysis.")
    
# When process button is clicked and files are uploaded
if process_button and asset_file and scan_file:
    # Show processing status
    with st.spinner("Processing files... Please wait."):
        try:
            # Prepare files for API request
            files = {
                "assetfile": (asset_file.name, asset_file.getvalue(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
                "scan_report": (scan_file.name, scan_file.getvalue(), "application/pdf")
            }
            
            # Send request to API
            response = requests.post(API_URL, files=files)
            
            # Check if request was successful
            if response.status_code == 200:
                results = response.json()
                
                if results["status"] == "success" and "data" in results:
                    # Create dataframe from results
                    df = pd.DataFrame(results["data"])
                    
                    # Display results header
                    st.subheader("Analysis Results")
                    
                    # Display the full results table
                    st.dataframe(df, use_container_width=True)
                    
                    # Add download button for CSV export
                    csv = df.to_csv(index=False)
                    st.download_button(
                        "Download Results as CSV",
                        csv,
                        "ot_cybersecurity_analysis.csv",
                        "text/csv",
                        key="download-csv"
                    )
                else:
                    st.error("API returned success status but no data was found.")
            else:
                st.error(f"Error from API: {response.status_code}")
                if hasattr(response, 'json'):
                    try:
                        st.json(response.json())
                    except:
                        st.text(response.text)
        
        except Exception as e:
            st.error(f"An error occurred: {str(e)}")

# Add footer with additional information
st.markdown("---")
st.caption("This application uses a FastAPI backend to analyze OT cybersecurity risks.")
