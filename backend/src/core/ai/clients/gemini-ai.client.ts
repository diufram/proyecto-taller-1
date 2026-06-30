import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Type } from '@google/genai';
import { AiClient } from '../ai-client.interface';
import { AiGenerateOptions } from '../ai.types';

@Injectable()
export class GeminiAiClient implements AiClient {
  private readonly defaultModel = 'gemini-3.1-flash-lite';
  private readonly maxAttempts = 3;

  constructor(private readonly configService: ConfigService) {}

  async generateJson(
    prompt: string,
    options: AiGenerateOptions = {},
  ): Promise<string> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'GEMINI_API_KEY no está configurada en el backend.',
      );
    }

    const model =
      this.configService.get<string>('GEMINI_MODEL') || this.defaultModel;
    const ai = new GoogleGenAI({ apiKey });

    let lastError: unknown;
    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: this.normalizeModel(model),
          contents: prompt,
          config: {
            temperature: options.temperature ?? 0.7,
            maxOutputTokens: options.maxTokens ?? 5000,
            responseMimeType: 'application/json',
            responseSchema:
              options.responseSchema ?? this.defaultProblemasSchema(),
          },
        });

        const text = response.text?.trim();
        if (!text) {
          throw new BadGatewayException('Gemini devolvió una respuesta vacía.');
        }

        return text;
      } catch (error) {
        lastError = error;
        if (!this.isRetryable(error) || attempt === this.maxAttempts) {
          break;
        }
        await this.sleep(500 * attempt);
      }
    }

    throw new BadGatewayException(
      `Gemini no pudo generar contenido. ${this.getErrorMessage(lastError)}`.trim(),
    );
  }

  private normalizeModel(model: string): string {
    return model.replace(/^models\//, '');
  }

  private defaultProblemasSchema() {
    return {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: [
          'titulo',
          'dificultad',
          'formato_entrada',
          'formato_salida',
          'ejemplo_entrada',
          'ejemplo_salida',
        ],
        properties: {
          titulo: { type: Type.STRING },
          dificultad: {
            type: Type.STRING,
            enum: ['Facil', 'Medio', 'Dificil'],
          },
          formato_entrada: { type: Type.STRING },
          formato_salida: { type: Type.STRING },
          ejemplo_entrada: { type: Type.STRING },
          ejemplo_salida: { type: Type.STRING },
        },
      },
    };
  }

  private isRetryable(error: unknown): boolean {
    const message = this.getErrorMessage(error).toLowerCase();
    return (
      message.includes('503') ||
      message.includes('429') ||
      message.includes('unavailable') ||
      message.includes('high demand') ||
      message.includes('temporar') ||
      message.includes('rate limit')
    );
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Error desconocido del proveedor Gemini.';
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
