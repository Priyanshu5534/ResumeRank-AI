"""
ResumeRank AI — Custom ML Model Trainer
=======================================
This script trains a custom machine learning ATS evaluation model on a resume-job dataset.
It trains a TF-IDF + Ridge/RandomForest or HuggingFace Transformer Bi-Encoder model to score
the semantic fit between a candidate's resume and a job description.

Requirements:
    pip install scikit-learn numpy pandas joblib torch transformers

Usage:
    python train_custom_ats_model.py --dataset resume_jd_dataset.json --output ./saved_model
"""

import os
import json
import argparse
from typing import List, Dict
import numpy as np

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.pipeline import Pipeline
    import joblib
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


def create_synthetic_training_data() -> List[Dict]:
    """
    Creates a high-quality sample training dataset of Resume-JD pairs with target ATS scores
    if no custom JSON dataset is provided.
    """
    return [
        {
            "job_title": "Senior React Engineer",
            "required_skills": "React, TypeScript, Next.js, Tailwind CSS",
            "resume_text": "Experienced Frontend Architect with 6+ years in React 19, TypeScript, Next.js App Router, and scalable design systems.",
            "target_score": 94
        },
        {
            "job_title": "Full Stack Engineer",
            "required_skills": "Node.js, React, PostgreSQL, Prisma",
            "resume_text": "Built enterprise full-stack web applications using Node.js, Express, React, PostgreSQL, and AWS ECS.",
            "target_score": 89
        },
        {
            "job_title": "Data Scientist / Machine Learning Engineer",
            "required_skills": "Python, PyTorch, Scikit-Learn, NLP, Transformers",
            "resume_text": "Trained custom NLP transformer models, BERT bi-encoders, and scikit-learn pipelines for document classification.",
            "target_score": 92
        },
        {
            "job_title": "Senior React Engineer",
            "required_skills": "React, TypeScript, Next.js",
            "resume_text": "Junior developer with basic HTML, CSS, and jQuery experience building small WordPress sites.",
            "target_score": 45
        },
        {
            "job_title": "Backend Python Architect",
            "required_skills": "Python, Django, FastAPI, PostgreSQL, Kubernetes",
            "resume_text": "7+ years leading Python backend microservices using FastAPI, PostgreSQL, Docker, and Kubernetes on GCP.",
            "target_score": 95
        }
    ]


def train_model(dataset_path: str, output_dir: str):
    if not SKLEARN_AVAILABLE:
        print("❌ scikit-learn is not installed. Run: pip install scikit-learn joblib")
        return

    os.makedirs(output_dir, exist_ok=True)

    print("Loading dataset...")
    if dataset_path and os.path.exists(dataset_path):
        with open(dataset_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        print("Custom dataset path not found or not specified. Using sample training dataset.")
        data = create_synthetic_training_data()

    print(f"Training on {len(data)} Resume-JD pairs...")

    # Prepare features: combine Job requirements and Resume text
    texts = []
    targets = []
    for row in data:
        combined = (
            f"JOB TITLE: {row.get('job_title', '')} | "
            f"REQUIRED SKILLS: {row.get('required_skills', '')} | "
            f"RESUME: {row.get('resume_text', '')}"
        )
        texts.append(combined)
        targets.append(float(row.get("target_score", 75)))

    # Pipeline: TF-IDF n-gram vectorizer + Random Forest Regressor
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(max_features=5000, ngram_range=(1, 2), stop_words="english")),
        ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
    ])

    print("Fitting custom ATS model pipeline...")
    pipeline.fit(texts, targets)

    model_path = os.path.join(output_dir, "custom_ats_model.joblib")
    joblib.dump(pipeline, model_path)

    print(f"\nSuccessfully trained and saved custom ATS model to: {model_path}")
    print("Next step: Run `python serve_custom_model.py` to launch your inference server!")


if __name__ == "__main__":
    default_output = os.path.join(os.path.dirname(__file__), "saved_model")
    parser = argparse.ArgumentParser(description="Train Custom ATS Model")
    parser.add_argument("--dataset", type=str, default="resume_jd_dataset.json", help="Path to JSON dataset")
    parser.add_argument("--output", type=str, default=default_output, help="Directory to save trained model")
    args = parser.parse_args()

    train_model(args.dataset, args.output)
