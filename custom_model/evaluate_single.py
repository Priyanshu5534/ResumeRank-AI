"""
Single Request Evaluation Fallback Script
=========================================
Called directly via subprocess from Node.js if the local FastAPI server (`/evaluate`) is unreachable.
Reads JSON payload from stdin and writes JSON evaluation output to stdout.
"""

import sys
import json
import os

# Add custom_model dir to sys.path so we can import ats_engine
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from ats_engine import evaluate_candidate_resume

def main():
    try:
        input_data = sys.stdin.read()
        if not input_data.strip():
            print(json.dumps({"error": "No input payload received"}), file=sys.stderr)
            sys.exit(1)

        payload = json.loads(input_data)
        
        result = evaluate_candidate_resume(
            resume_text=payload.get("resumeText", ""),
            job_title=payload.get("jobTitle", "Target Role"),
            job_description=payload.get("jobDescription", ""),
            required_skills=payload.get("requiredSkills", ""),
            required_experience=int(payload.get("requiredExperience", 1)),
            required_education=payload.get("requiredEducation", "")
        )

        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
