import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { crearAdminYObtenerToken } from '../../setup/auth.helper';
import { createTestApp } from '../../setup/test-app.factory';

describe('Dashboard feature (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await createTestApp();
    });

    it('GET /dashboard/admin sin token responde 401', () => {
        return request(app.getHttpServer())
            .get('/dashboard/admin')
            .expect(401)
            .expect((res) => {
                expect(res.body.status).toBe('fail');
            });
    });

    it('GET /dashboard/admin con admin devuelve el resumen con summary y competenciasPorEstado', async () => {
        const token = await crearAdminYObtenerToken(app);

        const res = await request(app.getHttpServer())
            .get('/dashboard/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.status).toBe('success');
        expect(res.body.data.summary).toBeDefined();
        expect(res.body.data.summary).toHaveProperty('totalCompetencias');
        expect(res.body.data.summary).toHaveProperty('tasaAcierto');
        expect(res.body.data.competenciasPorEstado).toBeDefined();
        expect(res.body.data.problemasPorDificultad).toBeDefined();
    });

    afterEach(async () => {
        await app.close();
    });
});