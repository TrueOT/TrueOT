import io
import os
from pathlib import Path

import pandas as pd
import pymupdf
from dotenv import load_dotenv
from fastapi import FastAPI, File
from fastapi.responses import JSONResponse
from typing_extensions import Annotated

from model.llm_process import LLMParser
from utils.utils import get_security_description, read_predefined_rules

# Initialize FastAPI app
app = FastAPI(
    title="OT Data Preprocessing API",
    description="Upload Asset Classification Excel and Vulnerability Scan PDF to get a preprocessed DataFrame."
)

# Load environment variables
load_dotenv()

# API configuration
API_KEYS = [
    os.getenv("API_KEY_1"),
    os.getenv("API_KEY_2"),
    os.getenv("API_KEY_3")
]

# File paths and constants
BASE_DIR = Path(__file__).parent
PATH_RULE = BASE_DIR / "data" / "predefined roles.csv"

# Output columns
RESULT_COLUMNS = ["CVE ID", "CVE Name", "Asset Name", "IP Address", "Vulnerability Severity", "Predefined Severity", "risk_level", "llm_justification", "security_description"]

# Initialize LLM model
llm = LLMParser(model_name="deepseek-r1-distill-llama-70b", model_provider="groq")


def clean_text(text):
    """Remove newlines and strip whitespace from text."""
    return text.replace("\n", " ").strip()


@app.get("/")
def root():
    """Root endpoint that returns API information."""
    return {
        "message": "OT Analysis FastAPI Endpoints, Check documentation at /docs"
    }


@app.post("/getLlmResults")
def process_files(
    assetfile: Annotated[bytes, File(description="An excel file with .xlsx extension")],
    scan_report: Annotated[bytes, File(description="A pdf file with .pdf extension")]
):
    """
    Process asset classification file and vulnerability scan report.
    
    Args:
        assetfile: Excel file containing asset data
        scan_report: PDF file containing vulnerability scan results
    
    Returns:
        JSON response with processed data
    """
    # Process asset classification Excel file
    asset_df = load_excel_file(assetfile)
    
    # Process vulnerability scan PDF file
    scan_df = load_pdf_tables(scan_report)
    
    # Merge and process dataframes
    result_df = process_data(asset_df, scan_df)
    
    # Add metadata about description lengths to help diagnose truncation issues
    description_metadata = {}
    if 'security_description' in result_df.columns:
        for i, desc in enumerate(result_df['security_description']):
            if desc and desc != 'None':
                description_metadata[i] = {
                    'cve_id': result_df.iloc[i].get('CVE ID', 'unknown'),
                    'length': len(desc),
                    'preview': desc[:50] + '...' if len(desc) > 50 else desc
                }
    
    # Create a copy of the data with explicit string conversion
    record_list = []
    for _, row in result_df.iterrows():
        record = {}
        for col in result_df.columns:
            # Ensure each value is properly converted to string
            if col == 'security_description' and row[col] and row[col] != 'None':
                # Handle description carefully
                full_desc = str(row[col]).strip()
                record[col] = full_desc
            else:
                record[col] = str(row[col]) if not pd.isna(row[col]) else ""
        record_list.append(record)
    
    # Return the data as JSON with special handling
    return JSONResponse(
        content={
            "status": "success",
            "data": record_list,  # Use our carefully prepared records
            "columns": RESULT_COLUMNS,
            "description_metadata": description_metadata
        }
    )


def load_excel_file(file_bytes):
    """Load and preprocess Excel file."""
    excel_stream = io.BytesIO(file_bytes)
    df = pd.read_excel(excel_stream)
    df.columns = df.iloc[0]
    df = df.iloc[1:].reset_index(drop=True)
    excel_stream.close()
    return df


def load_pdf_tables(file_bytes):
    """Extract tables from PDF file."""
    pdf_doc = pymupdf.open(stream=file_bytes, filetype="pdf")
    
    pdf_table = []
    for page in pdf_doc:
        tables = page.find_tables()
        if tables:
            for table in tables:
                table_data = table.extract()
                pdf_table.extend(table_data)
    
    # Clean text in table cells
    pdf_table = [[clean_text(text) for text in row] for row in pdf_table]
    
    df = pd.DataFrame(pdf_table)
    df.columns = df.iloc[0]
    df = df.iloc[1:].reset_index(drop=True)
    return df


def process_data(asset_df, scan_df):
    """Merge and process the dataframes."""
    # Merge dataframes
    merged_df = pd.merge(asset_df, scan_df, on=["Asset Name", "Asset Name"], how="right")
    merged_df.dropna(inplace=True)
    merged_df = merged_df.set_index("#")
    merged_df.reset_index(drop=True, inplace=True)
    
    # Process hosting information
    merged_df["Hosting1"] = merged_df["Hosting"].apply(
        lambda x: "Isolated" if "Isolated" in x else "Anything"
    )
    
    # Get security descriptions and analyze risks
    print("Getting security descriptions from NVD API...")
    security_descriptions = []
    for cve_id in merged_df["CVE ID"]:
        desc = get_security_description(cve_id, API_KEYS)
        # Store as string and ensure it's not None
        if desc:
            # Clean and validate the description
            desc = str(desc).strip()
            security_descriptions.append(desc)
        else:
            security_descriptions.append("")
    
    # Add the descriptions to the dataframe
    merged_df["security_description"] = security_descriptions
    
    # Ensure descriptions are properly stored as strings
    merged_df["security_description"] = merged_df["security_description"].astype(str)
    merged_df["security_description"] = merged_df["security_description"].apply(
        lambda x: x if x != "None" and x != "nan" else ""
    )
    
    # Add debug print to check description lengths
    print("Security Description Lengths:")
    for idx, desc in enumerate(merged_df["security_description"]):
        if desc and desc != "None" and desc != "nan":
            print(f"Description {idx}: Length={len(desc)}, Preview={desc[:50]}...")
    
    rule_str = read_predefined_rules(PATH_RULE)
    
    # Apply LLM processing
    merged_df = llm.risk_analyzer(merged_df, rule_str)
    merged_df = llm.refine_risk_level(merged_df)
    
    # Save intermediate result to verify full descriptions are preserved
    merged_df.to_csv("debug_merge_df.csv", encoding='utf-8')
    
    # Select only the required columns
    return merged_df[RESULT_COLUMNS]