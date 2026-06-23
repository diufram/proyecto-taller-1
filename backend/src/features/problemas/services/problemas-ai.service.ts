import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { AI_CLIENT } from '../../../core/ai/ai.constants';
import { AiClient } from '../../../core/ai/ai-client.interface';
import { Dificultad } from '../../../database/entities/problema.entity';
import { GenerateProblemasDto } from '../dto/generate-problemas.dto';
import { CreateProblemaDto } from '../dto/create-problema.dto';

@Injectable()
export class ProblemasAiService {
  constructor(@Inject(AI_CLIENT) private readonly aiClient: AiClient) {}

  async generate(dto: GenerateProblemasDto): Promise<{
    problemas: CreateProblemaDto[];
    message: string;
  }> {
    const text = await this.aiClient.generateJson(this.buildPrompt(dto), {
      temperature: 0.2,
      maxTokens: 1800,
    });
    const problemas = this.parseAndValidateProblems(text, dto.cantidad ?? 3);

    return {
      problemas,
      message: 'Problemas generados correctamente.',
    };
  }

  private buildPrompt(dto: GenerateProblemasDto): string {
    const cantidad = dto.cantidad ?? 3;
    const dificultad = dto.dificultad
      ? `- Dificultad fija: ${dto.dificultad}`
      : '- Dificultad: según el nivel solicitado';
    const tema = dto.tema ? `- Tema: ${dto.tema}` : '';
    const nivel = dto.nivel ? `- Nivel: ${dto.nivel}` : '';

    return `Genera problemas de programación para una plataforma de competencias.

Devuelve exclusivamente un JSON válido.

Reglas estrictas de formato de respuesta:
- La respuesta debe empezar exactamente con el carácter [.
- La respuesta debe terminar exactamente con el carácter ].
- No escribas markdown.
- No escribas bloques de código.
- No escribas \`\`\`json.
- No escribas explicaciones.
- No escribas texto antes del JSON.
- No escribas texto después del JSON.
- El resultado debe poder parsearse directamente con JSON.parse().
- La respuesta debe ser un array JSON con exactamente ${cantidad} objeto(s).

Cada objeto debe cumplir exactamente esta estructura y no agregar campos extra:

{
  "titulo": "Suma de dos números",
  "descripcion": "Dados dos números enteros A y B, imprimir la suma de ambos.",
  "dificultad": "Facil",
  "formato_entrada": "Una línea con dos enteros A y B separados por espacio.",
  "formato_salida": "Un entero que representa la suma de A y B.",
  "ejemplo_entrada": "3 5",
  "ejemplo_salida": "8"
}

Reglas obligatorias:
- No agregues campos extra.
- No uses comentarios.
- "dificultad" debe ser exactamente uno de estos valores: "Facil", "Medio" o "Dificil".
- Todos los campos deben ser strings no vacíos.
- "titulo" debe tener máximo 120 caracteres.
- "descripcion" debe tener máximo 2000 caracteres.
- "formato_entrada" debe tener máximo 500 caracteres.
- "formato_salida" debe tener máximo 500 caracteres.
- "ejemplo_entrada" debe tener máximo 1000 caracteres.
- "ejemplo_salida" debe tener máximo 1000 caracteres.
- Los ejemplos deben ser coherentes con la descripción, el formato de entrada y el formato de salida.
- Si un ejemplo tiene varias líneas, usa "\\n" dentro del string JSON.
- Los problemas deben poder resolverse leyendo desde entrada estándar e imprimiendo en salida estándar.
- Evita problemas ambiguos o que dependan de interacción con el usuario, archivos externos, bases de datos, APIs o librerías especiales.

Solicitud del usuario:
${dto.prompt}

Parámetros:
- Cantidad: ${cantidad}
${dificultad}
${tema}
${nivel}
- Idioma: español

Devuelve únicamente el array JSON final.`;
  }

  private parseAndValidateProblems(
    rawText: string,
    expectedCount: number,
  ): CreateProblemaDto[] {
    const cleanText = this.stripCodeFence(rawText);
    let parsed: unknown;

    try {
      parsed = JSON.parse(cleanText);
    } catch {
      throw new BadGatewayException('La IA devolvió JSON inválido.');
    }

    if (!Array.isArray(parsed)) {
      throw new BadGatewayException(
        'La IA debe devolver un array de problemas.',
      );
    }

    if (parsed.length !== expectedCount) {
      throw new BadGatewayException(
        `La IA debe devolver exactamente ${expectedCount} problema(s).`,
      );
    }

    return parsed.map((item, index) => this.validateProblem(item, index));
  }

  private stripCodeFence(value: string): string {
    const cleaned = value
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
      return cleaned;
    }

    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    if (start >= 0 && end > start) {
      return cleaned.slice(start, end + 1).trim();
    }

    return cleaned;
  }

  private validateProblem(item: unknown, index: number): CreateProblemaDto {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new BadGatewayException(
        `El problema ${index + 1} no tiene una estructura válida.`,
      );
    }

    const problem = item as Record<string, unknown>;
    const requiredFields: Array<keyof CreateProblemaDto> = [
      'titulo',
      'descripcion',
      'dificultad',
      'formato_entrada',
      'formato_salida',
      'ejemplo_entrada',
      'ejemplo_salida',
    ];

    const extraFields = Object.keys(problem).filter(
      (key) => !requiredFields.includes(key as keyof CreateProblemaDto),
    );
    if (extraFields.length > 0) {
      throw new BadGatewayException(
        `El problema ${index + 1} contiene campos extra: ${extraFields.join(', ')}.`,
      );
    }

    for (const field of requiredFields) {
      if (typeof problem[field] !== 'string' || !problem[field].trim()) {
        throw new BadGatewayException(
          `El problema ${index + 1} tiene el campo "${field}" vacío o inválido.`,
        );
      }
    }

    const dificultad = problem.dificultad as string;
    if (!Object.values(Dificultad).includes(dificultad as Dificultad)) {
      throw new BadGatewayException(
        `El problema ${index + 1} tiene una dificultad inválida.`,
      );
    }

    this.assertMaxLength(problem.titulo as string, 'titulo', 120, index);
    this.assertMaxLength(
      problem.descripcion as string,
      'descripcion',
      2000,
      index,
    );
    this.assertMaxLength(
      problem.formato_entrada as string,
      'formato_entrada',
      500,
      index,
    );
    this.assertMaxLength(
      problem.formato_salida as string,
      'formato_salida',
      500,
      index,
    );
    this.assertMaxLength(
      problem.ejemplo_entrada as string,
      'ejemplo_entrada',
      1000,
      index,
    );
    this.assertMaxLength(
      problem.ejemplo_salida as string,
      'ejemplo_salida',
      1000,
      index,
    );

    return {
      titulo: (problem.titulo as string).trim(),
      descripcion: (problem.descripcion as string).trim(),
      dificultad: dificultad as Dificultad,
      formato_entrada: (problem.formato_entrada as string).trim(),
      formato_salida: (problem.formato_salida as string).trim(),
      ejemplo_entrada: problem.ejemplo_entrada as string,
      ejemplo_salida: problem.ejemplo_salida as string,
    };
  }

  private assertMaxLength(
    value: string,
    field: string,
    max: number,
    index: number,
  ): void {
    if (value.length > max) {
      throw new BadGatewayException(
        `El problema ${index + 1} supera el máximo de ${max} caracteres en "${field}".`,
      );
    }
  }
}
