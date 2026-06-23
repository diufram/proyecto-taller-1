import {
  BadGatewayException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Type } from '@google/genai';
import { AI_CLIENT } from '../../../core/ai/ai.constants';
import { AiClient } from '../../../core/ai/ai-client.interface';
import { EstadoSolucion, Lenguaje } from '../../../database/entities/solucion.entity';

export interface SugerenciaCalificacion {
  estado: EstadoSolucion;
  confianza: number;
  justificacion: string;
}

export interface DatosSolucionParaSugerir {
  problemaTitulo: string;
  problemaDescripcion: string;
  problemaFormatoEntrada: string;
  problemaFormatoSalida: string;
  problemaEjemploEntrada: string;
  problemaEjemploSalida: string;
  problemaDificultad: string;
  lenguaje: Lenguaje;
  respuesta: string;
  instruccionesExtra?: string;
}

@Injectable()
export class SolucionesAiService {
  private readonly logger = new Logger(SolucionesAiService.name);

  constructor(
    @Inject(AI_CLIENT) private readonly aiClient: AiClient,
    private readonly configService: ConfigService,
  ) {}

  async sugerir(
    datos: DatosSolucionParaSugerir,
  ): Promise<SugerenciaCalificacion> {
    const prompt = this.buildPrompt(datos);

    const text = await this.aiClient.generateJson(prompt, {
      temperature: 0.2,
      maxTokens: 800,
      responseSchema: {
        type: Type.OBJECT,
        required: ['estado', 'confianza', 'justificacion'],
        properties: {
          estado: {
            type: Type.STRING,
            enum: [
              EstadoSolucion.CORRECTO,
              EstadoSolucion.INCORRECTO,
              EstadoSolucion.REVISION,
            ],
          },
          confianza: { type: Type.NUMBER },
          justificacion: { type: Type.STRING },
        },
      },
    });

    return this.parseAndValidate(text);
  }

  private buildPrompt(datos: DatosSolucionParaSugerir): string {
    return `Sos un asistente que ayuda a un administrador a calificar la respuesta enviada por un estudiante a un problema de programación.

Devuelve exclusivamente un JSON válido.

Reglas estrictas de formato de respuesta:
- La respuesta debe empezar exactamente con el carácter {.
- La respuesta debe terminar exactamente con el carácter }.
- No escribas markdown.
- No escribas bloques de código.
- No escribas \`\`\`json.
- No escribas explicaciones.
- No escribas texto antes del JSON.
- No escribas texto después del JSON.
- El resultado debe poder parsearse directamente con JSON.parse().

Estructura obligatoria del JSON de respuesta:

{
  "estado": "Correcto",
  "confianza": 0.85,
  "justificacion": "La respuesta resuelve el problema correctamente siguiendo el formato solicitado."
}

Reglas obligatorias:
- "estado" debe ser exactamente uno de: "Correcto", "Incorrecto" o "En revisión".
- "confianza" debe ser un número entre 0 y 1 que represente tu seguridad en la sugerencia.
- "justificacion" debe ser un texto breve (máximo 500 caracteres) que explique el razonamiento.
- Si la respuesta es ambigua, está vacía, no compila o no resuelve el problema, sugerí "Incorrecto" o "En revisión" con confianza baja.
- Si la respuesta resuelve el problema correctamente, sugerí "Correcto" con confianza alta.
- No agregues campos extra.
- No uses comentarios.

Problema:
- Título: ${datos.problemaTitulo}
- Dificultad: ${datos.problemaDificultad}
- Descripción: ${datos.problemaDescripcion}
- Formato de entrada: ${datos.problemaFormatoEntrada}
- Formato de salida: ${datos.problemaFormatoSalida}
- Ejemplo de entrada: ${datos.problemaEjemploEntrada}
- Ejemplo de salida: ${datos.problemaEjemploSalida}

Respuesta enviada por el estudiante:
- Lenguaje: ${datos.lenguaje}
- Respuesta:
${datos.respuesta}

${
  datos.instruccionesExtra
    ? `Instrucciones adicionales del administrador:\n${datos.instruccionesExtra}\n`
    : ''
}
Devuelve únicamente el objeto JSON final.`;
  }

  private parseAndValidate(rawText: string): SugerenciaCalificacion {
    const cleanText = this.stripCodeFence(rawText);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanText);
    } catch (error) {
      this.logInvalidJson(rawText, cleanText, error);
      throw new BadGatewayException('La IA devolvió JSON inválido.');
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new BadGatewayException(
        'La IA debe devolver un objeto JSON con la sugerencia.',
      );
    }

    const obj = parsed as Record<string, unknown>;

    if (typeof obj.estado !== 'string') {
      throw new BadGatewayException(
        'La sugerencia no incluye el campo "estado".',
      );
    }

    if (
      !Object.values(EstadoSolucion).includes(
        obj.estado as EstadoSolucion,
      ) ||
      obj.estado === EstadoSolucion.PENDIENTE
    ) {
      throw new BadGatewayException(
        `La IA devolvió un estado no permitido: ${obj.estado}.`,
      );
    }

    if (typeof obj.confianza !== 'number' || isNaN(obj.confianza)) {
      throw new BadGatewayException(
        'La sugerencia no incluye "confianza" numérica.',
      );
    }

    if (typeof obj.justificacion !== 'string' || !obj.justificacion.trim()) {
      throw new BadGatewayException(
        'La sugerencia no incluye "justificacion" textual.',
      );
    }

    const confianza = Math.max(0, Math.min(1, obj.confianza));
    const justificacion = obj.justificacion.trim();

    if (justificacion.length > 600) {
      throw new BadGatewayException(
        'La justificación excede el máximo de 500 caracteres permitidos.',
      );
    }

    return {
      estado: obj.estado as EstadoSolucion,
      confianza,
      justificacion,
    };
  }

  private stripCodeFence(value: string): string {
    const cleaned = value
      .trim()
      .replace(/^\uFEFF/, '')
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      return cleaned;
    }

    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return cleaned.slice(start, end + 1).trim();
    }

    return cleaned;
  }

  private logInvalidJson(rawText: string, cleanText: string, error: unknown) {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      return;
    }

    const parseMessage =
      error instanceof Error ? error.message : String(error);
    this.logger.warn(
      `La IA devolvió JSON inválido. ${parseMessage} (rawLength=${rawText.length}, cleanLength=${cleanText.length}, preview=${cleanText.slice(0, 400)})`,
    );
  }
}
