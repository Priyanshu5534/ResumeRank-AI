"""
Custom AI Model Inference Server for ResumeRank AI
===================================================
Runs a persistent FastAPI server that loads the fine-tuned BGE SentenceTransformer
model into memory at startup and serves multi-factor ATS evaluation requests.

Launch:
    python serve_custom_model.py
    # or: uvicorn serve_custom_model:app --host 0.0.0.0 --port 8000
"""

import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from ats_engine import get_model, get_skills_db, evaluate_candidate_resume

app = FastAPI(
    title="ResumeRank AI Custom Model Server",
    description="Custom fine-tuned ATS resume evaluation inference server (SentenceTransformers BGE)",
    version="2.0.0"
)

# Load model and skills DB into memory at startup
@app.on_event("startup")
async def startup_event():
    print("[SERVER STARTUP] Initializing skills database...")
    get_skills_db()
    print("[SERVER STARTUP] Loading fine-tuned BGE model into persistent memory...")
    get_model()
    print("[SERVER STARTUP] Ready to serve ATS evaluation requests!")


class EvaluateRequest(BaseModel):
    resumeText: str
    jobTitle: str
    jobDescription: Optional[str] = ""
    requiredSkills: Optional[str] = ""
    requiredExperience: Optional[int] = 1
    requiredEducation: Optional[str] = ""


class AIEvaluationResponse(BaseModel):
    overallScore: int
    skillMatch: int
    experienceMatch: int
    educationMatch: int
    keywordMatch: int
    matchedSkills: List[str]
    missingSkills: List[str]
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    summary: str
    similarityScore: Optional[float] = 0.0
    atsPercentage: Optional[int] = 0
    aiModel: Optional[str] = "ResumeRank AI (BGE Fine-Tuned)"


@app.post("/evaluate", response_model=AIEvaluationResponse)
async def evaluate_resume(payload: EvaluateRequest):
    """
    Evaluates a candidate resume against job requirements using persistent in-memory BGE model.
    """
    try:
        result = evaluate_candidate_resume(
            resume_text=payload.resumeText,
            job_title=payload.jobTitle,
            job_description=payload.jobDescription or "",
            required_skills=payload.requiredSkills or "",
            required_experience=payload.requiredExperience or 1,
            required_education=payload.requiredEducation or ""
        )
        return AIEvaluationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {"status": "ok", "model_loaded": get_model() is not None}


if __name__ == "__main__":
    uvicorn.run("serve_custom_model:app", host="0.0.0.0", port=8000, reload=False)
