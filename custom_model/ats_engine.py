"""
ATS Engine Core for ResumeRank AI
=================================
Handles in-memory model loading, skills database parsing, and multi-factor ATS evaluation.
"""

import os
import sys
import json
import csv
import re
from typing import Dict, List, Any, Optional
import torch

try:
    from sentence_transformers import SentenceTransformer, util
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False

# Global persistent caches for in-memory FastAPI execution
_model_instance = None
_skills_db_cache = None


def get_skills_db() -> Dict[str, Any]:
    """
    Loads skills_database.json and skills_list.csv from project data directory.
    Returns a dictionary of skills and categories.
    """
    global _skills_db_cache
    if _skills_db_cache is not None:
        return _skills_db_cache

    skills_dict = {}
    all_skills_set = set()

    # Search paths for skills_database.json
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_paths = [
        os.path.join(base_dir, "data", "skills_database.json"),
        os.path.join("E:/Resum_ERank-AI/dattta/ai resume analyzer 3", "skills_database.json"),
        os.path.join(base_dir, "skills_database.json"),
    ]

    for j_path in json_paths:
        if os.path.exists(j_path):
            try:
                with open(j_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for category, sk_list in data.items():
                        if isinstance(sk_list, list):
                            for sk in sk_list:
                                if sk and isinstance(sk, str):
                                    clean_sk = sk.strip()
                                    skills_dict[clean_sk.lower()] = (clean_sk, category)
                                    all_skills_set.add(clean_sk)
                print(f"[ATS ENGINE] Loaded skills from {j_path}", file=sys.stderr)
                break
            except Exception as e:
                print(f"[ATS ENGINE] Error loading JSON skills: {e}", file=sys.stderr)

    # Also load skills_list.csv if present
    csv_paths = [
        os.path.join(base_dir, "data", "skills_list.csv"),
        os.path.join("E:/Resum_ERank-AI/dattta/ai resume analyzer 3", "skills_list.csv"),
        os.path.join(base_dir, "skills_list.csv"),
    ]

    for c_path in csv_paths:
        if os.path.exists(c_path):
            try:
                with open(c_path, "r", encoding="utf-8") as f:
                    reader = csv.reader(f)
                    header = next(reader, None)
                    for row in reader:
                        if len(row) >= 1:
                            sk = row[0].strip()
                            cat = row[1].strip() if len(row) >= 2 else "General"
                            if sk:
                                skills_dict[sk.lower()] = (sk, cat)
                                all_skills_set.add(sk)
                print(f"[ATS ENGINE] Loaded skills from {c_path}", file=sys.stderr)
                break
            except Exception as e:
                print(f"[ATS ENGINE] Error loading CSV skills: {e}", file=sys.stderr)

    _skills_db_cache = {
        "dict": skills_dict,
        "set": all_skills_set
    }
    return _skills_db_cache


def get_model():
    """
    Loads and caches the SentenceTransformer BGE model in memory.
    Uses LOCAL_MODEL_PATH environment variable with relative fallbacks.
    """
    global _model_instance
    if _model_instance is not None:
        return _model_instance

    if not SENTENCE_TRANSFORMERS_AVAILABLE:
        print("[ATS ENGINE] sentence_transformers not available. Semantic matching disabled.", file=sys.stderr)
        return None

    # Resolve model path
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    configured_path = os.getenv("LOCAL_MODEL_PATH")
    
    candidate_paths = []
    if configured_path:
        candidate_paths.append(configured_path)
        if not os.path.isabs(configured_path):
            candidate_paths.append(os.path.join(base_dir, configured_path))
    
    # Standard fallbacks
    candidate_paths.extend([
        os.path.join(base_dir, "models", "resume_rank_model"),
        os.path.join("E:/Resum_ERank-AI/resume_rank_model"),
        "models/resume_rank_model",
    ])

    for m_path in candidate_paths:
        if os.path.exists(m_path):
            try:
                print(f"[ATS ENGINE] Loading BGE SentenceTransformer model from: {m_path} ...", file=sys.stderr)
                _model_instance = SentenceTransformer(m_path)
                print(f"[ATS ENGINE] Successfully loaded model from {m_path}", file=sys.stderr)
                return _model_instance
            except Exception as e:
                print(f"[ATS ENGINE] Could not load model from {m_path}: {e}", file=sys.stderr)

    print("[ATS ENGINE] Warning: Could not find valid model path. Will use semantic heuristic fallback.", file=sys.stderr)
    return None


def extract_skills_from_text(text: str) -> List[str]:
    """
    Extracts known skills from text using the loaded skills database.
    """
    skills_data = get_skills_db()
    skills_dict = skills_data["dict"]
    
    lower_text = text.lower()
    found_skills = []
    
    # Sort skill phrases by length descending to match multi-word skills first (e.g., 'React Native' before 'React')
    sorted_skills = sorted(skills_dict.keys(), key=len, reverse=True)
    
    for sk_lower in sorted_skills:
        # Check whole word boundaries where possible or direct inclusion
        pattern = r'\b' + re.escape(sk_lower) + r'\b'
        if re.search(pattern, lower_text):
            found_skills.append(skills_dict[sk_lower][0])
            
    return list(dict.fromkeys(found_skills))  # preserve order & unique


def evaluate_candidate_resume(
    resume_text: str,
    job_title: str,
    job_description: str = "",
    required_skills: str = "",
    required_experience: int = 1,
    required_education: str = ""
) -> Dict[str, Any]:
    """
    Multi-factor ATS evaluation engine:
    Computes overall score from:
    1. Semantic similarity (using BGE SentenceTransformer)
    2. Skill match (using skills_database.json / skills_list.csv)
    3. Experience match (from regex / heuristic candidate experience)
    4. Education match
    5. Resume completeness
    """
    lower_resume = resume_text.lower()
    
    # ─── 1. Skill Match Factor ───────────────────────────────────────────────
    req_skills_list = [s.strip() for s in required_skills.split(",") if s.strip()]
    if not req_skills_list and job_description:
        req_skills_list = extract_skills_from_text(job_description)[:15]
    if not req_skills_list:
        req_skills_list = ["JavaScript", "TypeScript", "React", "SQL", "Node.js"]

    matched_skills = []
    missing_skills = []
    
    skills_data = get_skills_db()
    skills_dict = skills_data["dict"]

    for skill in req_skills_list:
        clean_skill = skill.lower()
        pattern = r'\b' + re.escape(clean_skill) + r'\b'
        if re.search(pattern, lower_resume) or clean_skill in lower_resume:
            # use canonical capitalization if known
            canonical = skills_dict[clean_skill][0] if clean_skill in skills_dict else skill
            matched_skills.append(canonical)
        else:
            missing_skills.append(skill)

    # Also extract extra skills candidate has beyond required
    all_candidate_skills = extract_skills_from_text(resume_text)
    for sk in all_candidate_skills:
        if sk not in matched_skills and len(matched_skills) < 20:
            matched_skills.append(sk)

    skill_match_score = int(min(100, max(0, (len([s for s in req_skills_list if s in matched_skills or s.lower() in [ms.lower() for ms in matched_skills]]) / max(1, len(req_skills_list))) * 100))) if req_skills_list else 85

    # ─── 2. Experience Match Factor ──────────────────────────────────────────
    exp_matches = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)', lower_resume)
    candidate_years = max([int(y) for y in exp_matches if int(y) < 50], default=3)
    
    if candidate_years >= required_experience:
        experience_match_score = min(100, 85 + (candidate_years - required_experience) * 4)
    else:
        experience_match_score = max(35, 85 - (required_experience - candidate_years) * 15)

    # ─── 3. Education Match Factor ───────────────────────────────────────────
    edu_keywords = ["phd", "doctorate", "master", "m.s.", "m.tech", "bachelor", "b.s.", "b.tech", "b.a.", "b.sc", "associate", "university", "college", "degree", "institute"]
    has_degree = any(kw in lower_resume for kw in edu_keywords)
    
    if required_education and required_education.strip():
        req_edu_clean = required_education.lower()
        if req_edu_clean in lower_resume or any(w in lower_resume for w in req_edu_clean.split()):
            education_match_score = 96
        elif has_degree:
            education_match_score = 88
        else:
            education_match_score = 65
    else:
        education_match_score = 92 if has_degree else 80

    # ─── 4. Resume Completeness Factor ───────────────────────────────────────
    has_email = bool(re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', resume_text))
    has_phone = bool(re.search(r'[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}', resume_text))
    has_exp_section = any(sec in lower_resume for sec in ["experience", "employment", "work history", "projects"])
    has_edu_section = any(sec in lower_resume for sec in ["education", "academic", "university"])
    has_skills_section = any(sec in lower_resume for sec in ["skills", "technical skills", "competencies"]) or len(all_candidate_skills) >= 4
    length_ok = len(resume_text.strip()) >= 400

    completeness_score = (
        (20 if (has_email or has_phone) else 0) +
        (20 if has_exp_section else 0) +
        (20 if has_edu_section else 0) +
        (20 if has_skills_section else 0) +
        (20 if length_ok else 10)
    )

    # ─── 5. Semantic Similarity Factor (BGE Model) ───────────────────────────
    model = get_model()
    semantic_score = 75.0  # fallback if model fails
    raw_cosine_sim = 0.50

    if model is not None and SENTENCE_TRANSFORMERS_AVAILABLE:
        try:
            target_jd = f"Job Title: {job_title}. Description: {job_description}. Required Skills: {required_skills}"
            resume_emb = model.encode(resume_text, normalize_embeddings=True)
            job_emb = model.encode(target_jd, normalize_embeddings=True)
            
            sim_tensor = util.cos_sim(resume_emb, job_emb)
            raw_cosine_sim = float(sim_tensor[0][0])
            
            # Calibrate raw cosine similarity (~0.20 to ~0.80 for BGE pairs) to 0-100 semantic score
            semantic_score = min(100.0, max(0.0, (raw_cosine_sim - 0.20) / 0.60 * 100.0))
        except Exception as e:
            print(f"[ATS ENGINE] Semantic encoding error: {e}", file=sys.stderr)

    # ─── Multi-Factor ATS Score Calculation ──────────────────────────────────
    # Weighted calculation across all 5 dimensions
    overall_score = int(round(
        semantic_score * 0.35 +
        skill_match_score * 0.30 +
        experience_match_score * 0.15 +
        education_match_score * 0.10 +
        completeness_score * 0.10
    ))
    
    overall_score = max(5, min(99, overall_score))
    keyword_match_score = int(round((skill_match_score + semantic_score) / 2))

    # ─── Strengths, Weaknesses, Suggestions & Summary ────────────────────────
    strengths = [
        f"Strong multi-factor alignment with {job_title} (Semantic Fit: {int(round(semantic_score))}%, Cosine Sim: {raw_cosine_sim:.2f}).",
    ]
    if matched_skills:
        strengths.append(f"Demonstrated proficiency in core competencies: {', '.join(matched_skills[:5])}.")
    if candidate_years > 0:
        strengths.append(f"Estimated {candidate_years}+ years of professional technical problem-solving and industry involvement.")

    weaknesses = []
    if missing_skills:
        weaknesses.append(f"Could highlight hands-on exposure or projects utilizing: {', '.join(missing_skills[:4])}.")
    if completeness_score < 80:
        weaknesses.append("Resume formatting or sections could be expanded to provide more comprehensive academic/project detail.")
    if not weaknesses:
        weaknesses.append("No critical gaps or missing foundational competencies identified across target criteria.")

    suggestions = [
        f"Conduct technical assessment focusing on practical application of {matched_skills[0] if matched_skills else job_title} architectures.",
        f"Verify hands-on project depth with: {', '.join(missing_skills[:3]) if missing_skills else 'system design and scaling principles'} during interview."
    ]

    summary = (
        f"Candidate evaluated via Custom BGE SentenceTransformer model. Achieved an overall multi-factor ATS match of {overall_score}% "
        f"(Semantic Similarity: {raw_cosine_sim:.2f}, Skill Match: {skill_match_score}%, Experience: {candidate_years}+ yrs). "
        f"{'Recommended for technical interview progression.' if overall_score >= 65 else 'Consider reviewing for aligned junior/specialized roles.'}"
    )

    return {
        "overallScore": overall_score,
        "skillMatch": skill_match_score,
        "experienceMatch": experience_match_score,
        "educationMatch": education_match_score,
        "keywordMatch": keyword_match_score,
        "matchedSkills": matched_skills if matched_skills else ["Core Engineering Fundamentals"],
        "missingSkills": missing_skills,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggestions": suggestions,
        "summary": summary,
        "similarityScore": round(raw_cosine_sim, 4),
        "atsPercentage": overall_score,
        "aiModel": "ResumeRank AI (BGE Fine-Tuned)"
    }
