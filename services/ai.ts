import { createAIClient, RESUME_EVALUATION_PROMPT, RESUME_PARSING_PROMPT } from '@/lib/ai';
import type { AIEvaluation, ParsedResumeData } from '@/types';

export async function evaluateResume(
  resumeText: string,
  jobTitle: string,
  jobDescription: string,
  requiredSkills: string,
  requiredExperience: number,
  requiredEducation?: string
): Promise<AIEvaluation> {
  const client = createAIClient();

  const prompt = RESUME_EVALUATION_PROMPT(
    resumeText,
    jobTitle,
    jobDescription,
    requiredSkills,
    requiredExperience,
    requiredEducation
  );

  const rawResponse = await client.generateContent(prompt);

  // Strip markdown code fences if present
  const cleaned = rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let parsed: AIEvaluation;
  try {
    parsed = JSON.parse(cleaned) as AIEvaluation;
  } catch (e) {
    console.error('Failed to parse AI response:', rawResponse);
    // Return a safe fallback so the app doesn't crash
    parsed = {
      overallScore: 0,
      skillMatch: 0,
      experienceMatch: 0,
      educationMatch: 0,
      keywordMatch: 0,
      matchedSkills: [],
      missingSkills: [],
      strengths: ['Could not parse AI response'],
      weaknesses: [],
      suggestions: ['Please try re-analyzing this resume'],
      summary: 'AI analysis failed to parse. Please try again.',
    };
  }

  // Clamp all scores to 0-100
  const clamp = (n: number) => Math.max(0, Math.min(100, Number(n) || 0));
  return {
    ...parsed,
    overallScore: clamp(parsed.overallScore),
    skillMatch: clamp(parsed.skillMatch),
    experienceMatch: clamp(parsed.experienceMatch),
    educationMatch: clamp(parsed.educationMatch),
    keywordMatch: clamp(parsed.keywordMatch),
  };
}

export async function parseResumeWithAI(resumeText: string): Promise<ParsedResumeData> {
  const client = createAIClient();
  const prompt = RESUME_PARSING_PROMPT(resumeText);
  const rawResponse = await client.generateContent(prompt);
  const cleaned = rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    return JSON.parse(cleaned) as ParsedResumeData;
  } catch {
    return {};
  }
}
