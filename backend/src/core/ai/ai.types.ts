export type AiProvider = 'gemini' | 'openai-compatible';

/**
 * Schema arbitrario para `responseSchema` en Gemini.
 * Usamos un tipo permisivo (`unknown`) para no acoplar este módulo a la
 * estructura concreta de `@google/genai` (los callers pueden importar
 * `Type` desde ahí y armar el schema).
 */
export interface AiSchemaNode {
  type: string;
  [key: string]: unknown;
}

export interface AiGenerateOptions {
  temperature?: number;
  maxTokens?: number;
  responseSchema?: AiSchemaNode;
}
