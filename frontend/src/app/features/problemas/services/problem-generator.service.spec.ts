import { firstValueFrom } from 'rxjs';
import { ProblemGeneratorService } from './problem-generator.service';

describe('ProblemGeneratorService', () => {
    let service: ProblemGeneratorService;

    const baseOpts = {
        competenciaNombre: 'Compex Test',
        competenciaDescripcion: 'Test',
        nivelDificultad: 'Intermedio' as const,
        tipo: 'Individual' as const,
    };

    beforeEach(() => {
        service = new ProblemGeneratorService();
    });

    it('detecta la keyword "suma" y devuelve problemas con esa keyword', async () => {
        const result = await firstValueFrom(
            service.generate({
                ...baseOpts,
                prompt: 'Genera 2 problemas de suma',
                cantidad: 2,
                dificultad: 'Facil',
            }),
        );

        expect(result.length).toBe(2);
        for (const p of result) {
            expect(p.sourceKeyword).toBe('suma');
            expect(p.dificultad).toBe('Facil');
        }
    });

    it('usa templates por defecto cuando el prompt no contiene keywords', async () => {
        const result = await firstValueFrom(
            service.generate({
                ...baseOpts,
                prompt: 'lorem ipsum random text',
                cantidad: 1,
                dificultad: 'Facil',
            }),
        );

        expect(result.length).toBe(1);
        expect(result[0].sourceKeyword).toBe('general');
        expect(result[0].titulo).toBeTruthy();
        expect(result[0].descripcion).toBeTruthy();
        expect(result[0].formato_entrada).toBeTruthy();
        expect(result[0].formato_salida).toBeTruthy();
        expect(result[0].ejemplo_entrada).toBeTruthy();
        expect(result[0].ejemplo_salida).toBeTruthy();
    });

    it('respeta la cantidad pedida, con clamp entre 1 y 5', async () => {
        const lower = await firstValueFrom(
            service.generate({
                ...baseOpts,
                prompt: 'sumas',
                cantidad: 0,
                dificultad: 'Facil',
            }),
        );
        expect(lower.length).toBe(1);

        const tooMany = await firstValueFrom(
            service.generate({
                ...baseOpts,
                prompt: 'sumas',
                cantidad: 99,
                dificultad: 'Facil',
            }),
        );
        expect(tooMany.length).toBe(5);
    });
});