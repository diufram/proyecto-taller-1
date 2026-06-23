import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiClient } from '../ai-client.interface';
import { AiGenerateOptions } from '../ai.types';

type OpenAiCompatibleResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

@Injectable()
export class OpenAiCompatibleAiClient implements AiClient {
  constructor(private readonly configService: ConfigService) {}

  async generateJson(
    prompt: string,
    options: AiGenerateOptions = {},
  ): Promise<string> {
    const baseUrl = this.configService.get<string>(
      'OPENAI_COMPATIBLE_BASE_URL',
    );
    const model = this.configService.get<string>('OPENAI_COMPATIBLE_MODEL');
    const apiKey =
      this.configService.get<string>('OPENAI_COMPATIBLE_API_KEY') || 'local';

    if (!baseUrl || !model) {
      throw new ServiceUnavailableException(
        'OPENAI_COMPATIBLE_BASE_URL y OPENAI_COMPATIBLE_MODEL deben estar configurados.',
      );
    }

    const response = await fetch(
      `${baseUrl.replace(/\/$/, '')}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 1800,
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new BadGatewayException(
        `El proveedor OpenAI-compatible no pudo generar contenido. ${detail}`.trim(),
      );
    }

    const completion = (await response.json()) as OpenAiCompatibleResponse;
    const text = completion.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new BadGatewayException(
        'El proveedor OpenAI-compatible devolvió una respuesta vacía.',
      );
    }

    return text;
  }
}
