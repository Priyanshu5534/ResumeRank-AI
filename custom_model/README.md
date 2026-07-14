# 🧠 Custom AI Model Guide for ResumeRank AI

This directory provides everything you need to replace Google Gemini with your own custom-trained open-source AI model (e.g., **Llama 3.1 8B**, **Mistral 7B**, **Qwen 2.5**, or custom BERT/Sentence-Transformer bi-encoders).

---

## 1. How to Connect Your Custom Model to ResumeRank AI
ResumeRank AI supports custom inference endpoints out of the box.

### Step 1: Start your local/custom inference server
Run the provided FastAPI server:
```bash
pip install fastapi uvicorn pydantic
python serve_custom_model.py
```
This starts an inference server on `http://localhost:8000/evaluate`.

### Step 2: Add to `.env`
Open your `.env` file in the project root and add:
```env
CUSTOM_MODEL_ENDPOINT="http://localhost:8000/evaluate"
```
Once added, ResumeRank AI will automatically route all resume evaluations to your custom server instead of Google Gemini!

---

## 2. Where to Find High-Quality Training Datasets
To fine-tune your own ATS scoring model, you can use high-quality public resume & job description datasets:

1. **Hugging Face ATS & Resume Pairs**:
   - `jacob-hugging-face/job-descriptions` (20,000+ structured job descriptions & skills)
   - `cnmoro/resume-job-description-fit` (Resume to JD match scores & labels)
   - `dvilasuero/fine-tuning-resume-parser` (Labeled skills and experience structures)
2. **Kaggle Resume Datasets**:
   - *Resume Dataset (2,400+ resumes labeled by job category)*
   - *IT Job Descriptions & Resumes Match Dataset*

---

## 3. Recommended Fine-Tuning Approaches

### Option A: LoRA Fine-Tuning (Llama 3.1 / Mistral 7B)
Using [Unsloth](https://github.com/unslothai/unsloth) or HuggingFace TRL, format your dataset as Instruction Pairs:
```json
{
  "instruction": "Evaluate the candidate resume against the job description and output JSON ATS evaluation.",
  "input": "Job: Senior React Engineer | Required Skills: React, TypeScript, Next.js\nResume: ...",
  "output": "{\"overallScore\": 92, \"skillMatch\": 95, ...}"
}
```
Fine-tune for 2-3 epochs using QLoRA (4-bit quantization) on a single 16GB GPU (like RTX 4080 or Google Colab T4).

### Option B: Using Ollama Locally (Zero Code Required)
If you want to run an open-source model immediately without fine-tuning:
1. Install [Ollama](https://ollama.com).
2. Pull a strong model: `ollama pull llama3.1` or `ollama pull qwen2.5`.
3. Update `serve_custom_model.py` to forward the prompt to `http://localhost:11434/api/generate`.
