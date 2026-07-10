import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'gemini-2.5-flash';

export interface AIProvider {
  generateContent(prompt: string): Promise<string>;
  modelName: string;
}

class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;
  public modelName: string;

  constructor(apiKey: string, model: string) {
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelName = model;
  }

  async generateContent(prompt: string): Promise<string> {
    const model = this.client.getGenerativeModel({ model: this.modelName });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}

export function createAIClient(): AIProvider {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
  }
  return new GeminiProvider(GEMINI_API_KEY, AI_MODEL);
}

export const RESUME_EVALUATION_PROMPT = (resumeText: string, jobTitle: string, jobDescription: string, requiredSkills: string, requiredExperience: number, requiredEducation?: string) => `
You are an expert ATS (Applicant Tracking System) and technical recruiter AI. Evaluate the following resume against the job requirements and provide a detailed, accurate analysis.

## JOB REQUIREMENTS
**Title:** ${jobTitle}
**Description:** ${jobDescription}
**Required Skills:** ${requiredSkills}
**Required Experience:** ${requiredExperience}+ years
**Education Required:** ${requiredEducation || 'Not specified'}

## CANDIDATE RESUME
${resumeText}

## INSTRUCTIONS
Analyze the resume against the job requirements and respond with ONLY a valid JSON object (no markdown, no explanation, just JSON) in this exact format:

{
  "overallScore": <number 0-100>,
  "skillMatch": <number 0-100>,
  "experienceMatch": <number 0-100>,
  "educationMatch": <number 0-100>,
  "keywordMatch": <number 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "summary": "A 2-3 sentence overall assessment of the candidate's fit for this role."
}

Scoring guidelines:
- overallScore: Weighted average (skills 40%, experience 30%, education 15%, keywords 15%)
- skillMatch: % of required skills present in resume
- experienceMatch: How well the experience level matches (years + relevance)
- educationMatch: How well the education matches the requirement
- keywordMatch: % of job description keywords found in resume
- Be realistic and precise. Don't inflate scores.
`;

export const RESUME_PARSING_PROMPT = (resumeText: string) => `
Extract structured information from the following resume text. Respond with ONLY a valid JSON object:

{
  "name": "Full name",
  "email": "email@example.com",
  "phone": "+1234567890",
  "location": "City, State/Country",
  "summary": "Professional summary if present",
  "education": ["Degree - Institution - Year"],
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Jan 2020 - Present",
      "description": "Key responsibilities"
    }
  ],
  "certifications": ["cert1"],
  "projects": [
    {
      "name": "Project Name",
      "description": "What it does",
      "technologies": ["tech1"]
    }
  ]
}

RESUME TEXT:
${resumeText}
`;
