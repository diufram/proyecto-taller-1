import { AiGenerateOptions } from './ai.types';

export interface AiClient {
  generateJson(prompt: string, options?: AiGenerateOptions): Promise<string>;
}
