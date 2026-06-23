import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '@/core/services/http/api.service';
import { Dificultad } from '../models/problema.model';

export type NivelCompetencia = 'Principiante' | 'Intermedio' | 'Avanzado';
export type TipoCompetencia = 'Individual' | 'Grupal';

export interface GeneratedProblem {
    titulo: string;
    descripcion: string;
    dificultad: Dificultad;
    formato_entrada: string;
    formato_salida: string;
    ejemplo_entrada: string;
    ejemplo_salida: string;
    sourceKeyword: string;
}

export interface GenerateOptions {
    prompt: string;
    cantidad: number;
    dificultad?: Dificultad | null;
    competenciaNombre: string;
    competenciaDescripcion: string;
    nivelDificultad: NivelCompetencia;
    tipo: TipoCompetencia;
}

interface GenerateProblemasResponse {
    problemas: Array<Omit<GeneratedProblem, 'sourceKeyword'>>;
}

@Injectable({ providedIn: 'root' })
export class ProblemGeneratorService {
    private api = inject(ApiService);

    generate(opts: GenerateOptions): Observable<GeneratedProblem[]> {
        const prompt = opts.prompt.trim();

        return this.api
            .post<GenerateProblemasResponse>('problemas/generar-ia', {
                prompt: this.buildPrompt({ ...opts, prompt }),
                cantidad: opts.cantidad,
                dificultad: opts.dificultad ?? undefined,
                ...(prompt ? { tema: prompt } : {}),
                nivel: opts.nivelDificultad,
            })
            .pipe(
                map((res) =>
                    res.problemas.map((problema) => ({
                        ...problema,
                        sourceKeyword: 'ia',
                    })),
                ),
            );
    }

    private buildPrompt(opts: GenerateOptions): string {
        return [
            opts.prompt,
            `Competencia: ${opts.competenciaNombre}`,
            opts.competenciaDescripcion
                ? `Descripción de competencia: ${opts.competenciaDescripcion}`
                : null,
            `Nivel: ${opts.nivelDificultad}`,
            `Tipo: ${opts.tipo}`,
        ]
            .filter(Boolean)
            .join('\n');
    }
}
