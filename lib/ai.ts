/**
 * AI Model Provider Interface & Configuration
 * ===========================================
 * Defines the local model settings and provider structures for ResumeRank AI.
 * All Google Gemini cloud dependencies have been removed in favor of our local BGE engine.
 */

export const ACTIVE_MODEL_NAME = process.env.AI_MODEL || 'ResumeRank AI (BGE Fine-Tuned)';
export const CUSTOM_MODEL_ENDPOINT = process.env.CUSTOM_MODEL_ENDPOINT || 'http://localhost:8000/evaluate';

export interface AIProviderConfig {
  modelName: string;
  endpoint: string;
  type: 'local' | 'remote';
}

export function getAIProviderConfig(): AIProviderConfig {
  return {
    modelName: ACTIVE_MODEL_NAME,
    endpoint: CUSTOM_MODEL_ENDPOINT,
    type: 'local',
  };
}
