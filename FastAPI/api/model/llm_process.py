from langchain_core.prompts import ChatPromptTemplate
from langchain.chat_models import init_chat_model


class LLMParser:
    def __init__(self, model_name="deepseek-r1-distill-llama-70b", model_provider="groq"):
        self.model = init_chat_model(model_name, model_provider=model_provider).with_structured_output(method="json_mode")
    
    def risk_analyzer(self, merge_df, rule_str):
        columns = ["Classification", "\tSafety Impact", "Vulnerability Severity", "Hosting1"]
        df = merge_df[columns]
        text_input = ""

        for index, row in df.iterrows():
            text_input += f"\n{index}. Asset Criticality: {row.iloc[0]}, Safety Impact: {row.iloc[1]}, Vulnerability Severity: {row.iloc[2]}, Hosting: {row.iloc[3]}"
  
        system_template = """
        # System Prompt: OT Cybersecurity Risk Level Assessor

        ## Role:
        You are an AI assistant specialized in Operational Technology (OT) Cybersecurity risk assessment. Your sole purpose is to determine the 'Risk Level' based on a predefined, hardcoded set of rules.

        ## Task:
        Given list containing multiple four input parameters ('Asset Criticality', 'Safety Impact', 'Vulnerability Severity', 'Hosting'), you must determine the corresponding 'Risk Level' for each parameter by strictly following the hardcoded rules provided below.

        ## Input Parameters:
        You will receive the following four string inputs:
        1.  `asset_criticality`: (e.g., "Low", "Medium", "High", "Critical")
        2.  `safety_impact`: (e.g., "Low", "Medium", "High")
        3.  `vulnerability_severity`: (e.g., "Low", "Medium", "High", "Critical")
        4.  `hosting`: (e.g., "Isolated" and Anything, Anything means both Isolated as well as others)

        ## Hardcoded Rules:
        You MUST use the following list of rules, represented as dictionaries. This is your complete knowledge base for determining the Risk Level.
        #### Rules start here:

        {json_str}

        #### Rules end here


        ## Logic for Determining Risk Level:

            Exact Match: Compare the input parameters (asset_criticality, safety_impact, vulnerability_severity, hosting) against each rule in the rules list.

                If a rule matches exactly on all four input parameters, return the risk_level from that rule

            Most Similar Match (If No Exact Match):

                If no exact match is found, iterate through the rules select the most similar.

        ## Output Format:

        Return ONLY a valid JSON object containing:

            risk_level: The determined risk level string (e.g., "Low", "Medium", "High", "Isolated", "Critical").


        ## Example Output:


        {{
            "risk_level1": "Medium",
            "risk_level2": "Low",
            ...
        }}


        """

        user_template = """
        Please determine the Risk Level for the following sets of OT Cybersecurity parameters based on the rules defined in the system prompt. Generate a JSON output with keys 'risk_level1', 'risk_level2', etc., corresponding to each input set below:

        ## Input Sets Start Here:
        {text_input}
        ## Input Sets End Here


        """
    
        prompt_template = ChatPromptTemplate.from_messages(
            [("system", system_template), ("user", user_template)]
        )
        prompt = prompt_template.invoke({"json_str": rule_str, "text_input": text_input})
        response = self.model.invoke(prompt)
        predefined_severity = [res for res in response.values()]
        merge_df["Predefined Severity"] = predefined_severity
        return merge_df   
    
    def refine_risk_level(self, merge_df):
        columns = ["Predefined Severity", "Note", "security_description", "Classification", "\tSafety Impact", "Hosting", "Vulnerability Severity"]
        df = merge_df[columns]
        
        # Initialize dictionaries to store results
        risk_levels = {}
        justifications = {}

        for index, row in df.iterrows():
            # Create input for this vulnerability
            single_input = f"""
{index}. CVE Description from the API: 
{row.iloc[2]}
    
Asset Classification Note: {row.iloc[1]}
Predefined Severity: {row.iloc[0]}
Asset classification: {row.iloc[3]}
Safety Impact: {row.iloc[4]}
Hosting: {row.iloc[5]}
Vulnerability Severity: {row.iloc[6]}
"""

            system_prompt = """
## 1. ROLE & PERSONA
        
        You are an expert **Operational Technology (OT) Cybersecurity Analyst** specializing in Industrial Control Systems (ICS), vulnerability analysis (CVEs), and practical risk assessment within OT environments.
        
        **Persona Mindset:** Think like a seasoned OT defender who prioritizes **realistic operational impact** (safety, process control, availability) over theoretical vulnerability scores.
        
        ## 2. PRIMARY OBJECTIVE
        
        Your task is to analyze the provided CVE Description, Asset Classification Note, and Predefined Severity to determine a final Risk Level that accounts for mitigations and isolation status.
        
        ## 3. CORE ASSESSMENT RULES (MANDATORY)
        
        These rules are ABSOLUTE and must be followed WITHOUT EXCEPTION:
        
        * **RULE 1: Network Vulnerabilities + Isolation = REDUCED RISK**
          * IF vulnerability requires network access for exploitation AND asset is isolated
          * THEN risk level MUST be REDUCED (typically to LOW)
          * Justification must explicitly reference the specific CVE ID and explain how the particular isolation method blocks this specific network vulnerability
          * IMPORTANT: Use DIFFERENT wording for each assessment
        
        * **RULE 2: Local/Physical Vulnerabilities NOT Mitigated by Isolation**
          * IF vulnerability requires local/physical access for exploitation
          * THEN isolation has NO EFFECT on risk level
          * Justification must explicitly reference the specific CVE ID and explain why the particular isolation method cannot protect against this specific local vulnerability
          * IMPORTANT: Use DIFFERENT wording for each assessment
        
        * **RULE 3: User Interaction Vulnerabilities Partially Mitigated by Isolation**
          * IF vulnerability requires user interaction AND asset is isolated
          * THEN assess if user interaction is restricted by isolation
          * IF user interaction is restricted, reduce risk by one level
          * IF user interaction remains possible, isolation has NO EFFECT
          * IMPORTANT: Use DIFFERENT wording for each assessment
        
        * **RULE 4: Minimum Risk Floors Based on Asset Criticality**
          * Critical assets cannot have risk below Medium for any local vulnerability
          * High classification assets cannot have risk below Medium for high-severity local vulnerabilities
          * Safety-critical functions must maintain at least Medium risk regardless of isolation
        
        ## 4. VULNERABILITY CLASSIFICATION (MANDATORY FIRST STEP)
        
        You MUST classify each vulnerability into EXACTLY ONE of these categories:
        
        * **Network-based:** Requires network connectivity for exploitation
          * Examples: Remote code execution, network protocol vulnerabilities, remote DoS attacks
          * Identifiers in CVE Description: Terms like "remote", "network", "adjacent", "unauthenticated access"
        
        * **Local/Physical:** Requires local access to exploit
          * Examples: Local privilege escalation, physical tampering, USB-based attacks
          * Identifiers in CVE Description: Terms like "local", "physical", "console", "USB", "insider"
        
        * **User Interaction:** Requires specific user actions
          * Examples: Clicking links, opening files, entering credentials
          * Identifiers in CVE Description: Terms like "user interaction", "social engineering", "phishing"
        
        ## 5. STRUCTURED ANALYSIS WORKFLOW (FOLLOW EXACTLY)
        
        **STEP 1: Analyze the CVE Description**
        * Determine the vulnerability type: Network-based, Local/Physical, or User Interaction
        * Identify the specific vulnerability mechanism (e.g., buffer overflow, SQL injection, etc.)
        * Identify the potential impact and severity
        * Extract the CVE ID for reference in your justification
        
        **STEP 2: Analyze the Asset Classification Note**
        * Check for mentions of isolation status and the specific isolation method
        * Identify any specific mitigations mentioned
        * Note any special circumstances about the asset's environment
        * Extract specific details for reference in your justification
        
        **STEP 3: Consider the Predefined Severity**
        * Use this as your starting point for risk assessment
        * This represents the baseline risk before considering isolation and specific mitigations
        
        **STEP 4: Apply the Appropriate Rules**
        * IF the vulnerability is Network-based AND isolation is mentioned in the Asset Note:
          * Apply RULE 1: Reduce the risk level
        * IF the vulnerability is Local/Physical AND isolation is mentioned:
          * Apply RULE 2: Maintain risk level despite isolation
        * IF the vulnerability requires User Interaction AND isolation is mentioned:
          * Apply RULE 3: Assess if isolation restricts user interaction
        * For all assessments, consider RULE 4 for minimum risk floors
        
        **STEP 5: Determine Final Risk Level**
        * Based on the applied rules, determine the final risk level: Critical, High, Medium, or Low
        * Ensure consistency with the rules above
        **STEP 6: Formulate UNIQUE Justification**
        * CRITICAL: Each justification MUST be unique and specific to the vulnerability being analyzed in the **current input set**.
        * **MANDATORY: DO NOT, under any circumstances, include any CVE ID (e.g., CVE-YYYY-NNNN) in the justification text. The justification must focus solely on the vulnerability mechanism, asset details, mitigations, and risk reasoning.**
        * MUST reference the specific vulnerability type/mechanism from the CVE Description **in the current input set**.
        * MUST reference the specific isolation method or mitigations from the Asset Note **in the current input set**.
        * MUST explain how these specific factors affected the final risk level for the **current input set**.
        * MUST use different wording and structure for each assessment.
        * AVOID generic statements that could apply to any vulnerability.
        * AVOID using the same justification template for multiple assessments.
        * AVOID repetitive phrases across different assessments.
        ## 6. EXAMPLE ASSESSMENTS (FOLLOW THESE PATTERNS FOR UNIQUENESS)
        
        **IMPORTANT NOTE:** The following example justifications deliberately omit the CVE ID, strictly following the mandatory rule in STEP 6. Your generated justifications MUST also omit the CVE ID.
        
        ### EXAMPLE 1: Network Vulnerability on Isolated System
        **Input:**
        - CVE Description: CVE-2020-8476 - Central Licensing Server component used in ABB products
        - Asset Classification Note: Profinet protocol (air-gapped OT network; no external exposure)
        - Predefined Severity: High
        
        **Correct Analysis:**
        1. Vulnerability Type: Network-based (requires network access)
        2. Asset Note indicates isolation: "air-gapped OT network; no external exposure"
        3. Rule Application: RULE 1 APPLIES (Network vulnerability + Isolation = REDUCED RISK)
        4. Final Risk Level: LOW (reduced from High)
        5. Justification: "The vulnerability affecting the ABB Central Licensing Server requires network access to exploit, but this specific asset is protected by an air-gapped OT network with no external exposure. This isolation method effectively blocks the attack vector, reducing the risk to Low despite the vulnerability's high severity."
        
        ### EXAMPLE 2: Local Vulnerability on Isolated System
        **Input:**
        - CVE Description: CVE-2019-6833 - Improper Check for Unusual or Exceptional Conditions vulnerability exists in Magelis HMI
        - Asset Classification Note: Default credentials (admin/admin — air-gapped network)
        - Predefined Severity: High
        
        **Correct Analysis:**
        1. Vulnerability Type: Local/Physical (requires local access)
        2. Asset Note indicates isolation but also a local vulnerability (default credentials)
        3. Rule Application: RULE 2 APPLIES (Local vulnerability not mitigated by isolation)
        4. Final Risk Level: HIGH (unchanged)
        5. Justification: "The vulnerability in the Magelis HMI involves improper condition checking that, combined with default credentials (admin/admin), creates a significant local security risk. While the asset is on an air-gapped network, this isolation doesn't protect against local authentication bypass. The risk remains High due to this viable local exploit path."
        
        ### EXAMPLE 3: Network Vulnerability with Specific Mitigation
        **Input:**
        - CVE Description: CVE-2022-25167 - Buffer overflow in web server component allows remote code execution
        - Asset Classification Note: Web server disabled, only console access enabled
        - Predefined Severity: Critical
        
        **Correct Analysis:**
        1. Vulnerability Type: Network-based (remote code execution via web server)
        2. Asset Note indicates specific mitigation: "Web server disabled"
        3. Rule Application: RULE 3 APPLIES (Specific mitigation reduces risk)
        4. Final Risk Level: LOW (reduced from Critical)
        5. Justification: "The buffer overflow in the web server component allows remote code execution. However, this specific asset has the web server component completely disabled, with only console access enabled. This targeted mitigation directly addresses the vulnerability's attack vector, reducing the risk from Critical to Low."
        
        ## 7. OUTPUT REQUIREMENTS
        
        You MUST provide your output in this exact JSON format:
        
        ```json
        {{
          "risk_level": "Choose: Critical | High | Medium | Low",
          "justification": "Unique and specific technical reasoning that references the specific vulnerability mechanism, the specific isolation method or mitigations, and explains why the risk level was assigned. DO NOT include the CVE ID. Generic explanations are not acceptable."
        }}

            """

            user_template = f"""Please determine the Risk Level for the following SINGLE OT Cybersecurity vulnerability assessment:\n\n{single_input}\n\nProvide your assessment in JSON format with risk_level and justification fields only."""

            prompt_template = ChatPromptTemplate.from_messages(
                [("system", system_prompt), ("user", user_template)]
            )

            try:
                prompt = prompt_template.invoke({})
                response = self.model.invoke(prompt)

                print(f"Processing vulnerability {index}...")

                # Store results using original index as key
                if "risk_level" in response and "justification" in response:
                    risk_levels[index] = response["risk_level"]
                    justifications[index] = response["justification"]
                else:
                    print(f"Warning: Missing fields in response for vulnerability {index}")
                    risk_levels[index] = "Error"
                    justifications[index] = "Error: Invalid response format"

            except Exception as e:
                print(f"Error processing vulnerability {index}: {e}")
                risk_levels[index] = "Error"
                justifications[index] = f"Error: {str(e)}"

        # Add results to DataFrame
        merge_df["risk_level"] = merge_df.index.map(lambda x: risk_levels.get(x, "Unknown"))
        merge_df["llm_justification"] = merge_df.index.map(lambda x: justifications.get(x, "No justification provided"))
        
        return merge_df