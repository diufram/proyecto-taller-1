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
import {
  EstadoSolucion,
  Lenguaje,
  CriterioEvaluacionSolucion,
} from '../../../database/entities/solucion.entity';

export const RUBRICA_SOLUCION: Array<
  Pick<CriterioEvaluacionSolucion, 'criterio' | 'peso' | 'tipo'>
> = [
  { criterio: 'Correctitud', peso: 40, tipo: 'Obligatorio' },
  { criterio: 'Tiempo', peso: 20, tipo: 'Objetivo' },
  { criterio: 'Memoria', peso: 15, tipo: 'Objetivo' },
  { criterio: 'Calidad del código', peso: 10, tipo: 'Objetivo' },
  { criterio: 'Complejidad algorítmica', peso: 5, tipo: 'Objetivo' },
  { criterio: 'Uso de estructuras de datos', peso: 5, tipo: 'Objetivo' },
  { criterio: 'Robustez', peso: 5, tipo: 'Objetivo' },
];

export interface SugerenciaCalificacion {
  estado: EstadoSolucion;
  confianza: number;
  puntaje_total: number;
  justificacion: string;
  criterios: CriterioEvaluacionSolucion[];
}

export interface DatosSolucionParaSugerir {
  problemaTitulo: string;
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
        required: [
          'estado',
          'confianza',
          'puntaje_total',
          'justificacion',
          'criterios',
        ],
        properties: {
          estado: {
            type: Type.STRING,
            enum: [
              EstadoSolucion.REVISION,
              EstadoSolucion.REVISADO,
            ],
          },
          confianza: { type: Type.NUMBER },
          puntaje_total: { type: Type.NUMBER },
          justificacion: { type: Type.STRING },
          criterios: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['criterio', 'peso', 'tipo', 'puntaje', 'comentario'],
              properties: {
                criterio: { type: Type.STRING },
                peso: { type: Type.NUMBER },
                tipo: {
                  type: Type.STRING,
                  enum: ['Obligatorio', 'Objetivo'],
                },
                puntaje: { type: Type.NUMBER },
                comentario: { type: Type.STRING },
              },
            },
          },
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
  "estado": "Revisado",
  "confianza": 0.85,
  "puntaje_total": 82,
  "justificacion": "La respuesta resuelve el problema correctamente siguiendo el formato solicitado.",
  "criterios": [
    {
      "criterio": "Correctitud",
      "peso": 40,
      "tipo": "Obligatorio",
      "puntaje": 38,
      "comentario": "Resuelve correctamente los casos principales."
    }
  ]
}

Reglas obligatorias:
- "estado" debe ser exactamente uno de: "Revisado" o "En revisión".
- "confianza" debe ser un número entre 0 y 1 que represente tu seguridad en la sugerencia.
- "puntaje_total" debe ser un número entero entre 0 y 100.
- "justificacion" debe ser un texto breve (máximo 500 caracteres) que explique el razonamiento.
- "criterios" debe contener exactamente estos 7 criterios, en este orden, con estos pesos y tipos:
${RUBRICA_SOLUCION.map((c) => `  - ${c.criterio}: peso ${c.peso}, tipo ${c.tipo}`).join('\n')}
- En cada criterio, "puntaje" debe estar entre 0 y el peso del criterio.
- La suma de puntajes de criterios debe coincidir con "puntaje_total".
- Correctitud es obligatorio: si Correctitud es 0 o muy baja, asigná puntaje bajo aunque otros criterios tengan buen puntaje.
- Cada "comentario" debe ser breve y específico.
- Si la respuesta es ambigua, está vacía o no podés evaluarla con seguridad, sugerí "En revisión" con confianza baja.
- Si podés evaluar la respuesta con la rúbrica, sugerí "Revisado". El puntaje_total define la calificación, incluso si es baja.
- No agregues campos extra.
- No uses comentarios.

Problema:
- Título: ${datos.problemaTitulo}
- Dificultad: ${datos.problemaDificultad}
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
      !Object.values(EstadoSolucion).includes(obj.estado as EstadoSolucion) ||
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

    if (typeof obj.puntaje_total !== 'number' || isNaN(obj.puntaje_total)) {
      throw new BadGatewayException(
        'La sugerencia no incluye "puntaje_total" numérico.',
      );
    }

    if (typeof obj.justificacion !== 'string' || !obj.justificacion.trim()) {
      throw new BadGatewayException(
        'La sugerencia no incluye "justificacion" textual.',
      );
    }

    const confianza = Math.max(0, Math.min(1, obj.confianza));
    const justificacion = obj.justificacion.trim();
    const criterios = this.parseCriterios(obj.criterios);
    const puntaje_total = criterios.reduce((sum, c) => sum + c.puntaje, 0);

    if (justificacion.length > 600) {
      throw new BadGatewayException(
        'La justificación excede el máximo de 500 caracteres permitidos.',
      );
    }

    return {
      estado: obj.estado as EstadoSolucion,
      confianza,
      puntaje_total,
      justificacion,
      criterios,
    };
  }

  private parseCriterios(value: unknown): CriterioEvaluacionSolucion[] {
    if (!Array.isArray(value)) {
      throw new BadGatewayException(
        'La sugerencia no incluye la lista de criterios.',
      );
    }

    if (value.length !== RUBRICA_SOLUCION.length) {
      throw new BadGatewayException(
        'La sugerencia debe incluir todos los criterios de evaluación.',
      );
    }

    return RUBRICA_SOLUCION.map((esperado, index) => {
      const item = value[index] as Record<string, unknown> | undefined;
      if (!item || typeof item !== 'object') {
        throw new BadGatewayException('Un criterio de evaluación es inválido.');
      }

      if (item.criterio !== esperado.criterio) {
        throw new BadGatewayException(
          `La IA devolvió un criterio inesperado: ${String(item.criterio)}.`,
        );
      }

      if (Number(item.peso) !== esperado.peso || item.tipo !== esperado.tipo) {
        throw new BadGatewayException(
          `La IA devolvió metadatos inválidos para ${esperado.criterio}.`,
        );
      }

      if (typeof item.puntaje !== 'number' || isNaN(item.puntaje)) {
        throw new BadGatewayException(
          `El criterio ${esperado.criterio} no incluye puntaje numérico.`,
        );
      }

      if (typeof item.comentario !== 'string' || !item.comentario.trim()) {
        throw new BadGatewayException(
          `El criterio ${esperado.criterio} no incluye comentario.`,
        );
      }

      const puntaje = Math.max(
        0,
        Math.min(esperado.peso, Math.round(item.puntaje)),
      );

      return {
        ...esperado,
        puntaje,
        comentario: item.comentario.trim().slice(0, 240),
      };
    });
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

    const parseMessage = error instanceof Error ? error.message : String(error);
    this.logger.warn(
      `La IA devolvió JSON inválido. ${parseMessage} (rawLength=${rawText.length}, cleanLength=${cleanText.length}, preview=${cleanText.slice(0, 400)})`,
    );
  }
}
