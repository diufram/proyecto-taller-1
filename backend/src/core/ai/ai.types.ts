export type AiProvider = 'gemini' | 'openai-compatible';

export interface AiGenerateOptions {
  temperature?: number;
  maxTokens?: number;
}
