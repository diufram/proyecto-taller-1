import { Module, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AI_CLIENT } from './ai.constants';
import { AiProvider } from './ai.types';
import { GeminiAiClient } from './clients/gemini-ai.client';
import { OpenAiCompatibleAiClient } from './clients/openai-compatible-ai.client';

@Module({
  providers: [
    GeminiAiClient,
    OpenAiCompatibleAiClient,
    {
      provide: AI_CLIENT,
      useFactory: (
        configService: ConfigService,
        geminiClient: GeminiAiClient,
        openAiCompatibleClient: OpenAiCompatibleAiClient,
      ) => {
        const provider =
          configService.get<AiProvider>('AI_PROVIDER') || 'gemini';

        switch (provider) {
          case 'gemini':
            return geminiClient;
          case 'openai-compatible':
            return openAiCompatibleClient;
          default:
            throw new ServiceUnavailableException(
              `AI_PROVIDER inválido: ${provider}`,
            );
        }
      },
      inject: [ConfigService, GeminiAiClient, OpenAiCompatibleAiClient],
    },
  ],
  exports: [AI_CLIENT],
})
export class AiModule {}
