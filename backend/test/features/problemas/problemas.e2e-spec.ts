import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { crearAdminYObtenerToken } from '../../setup/auth.helper';
import { createTestApp } from '../../setup/test-app.factory';

describe('Problemas feature (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let competenciaId: number;

  beforeEach(async () => {
    app = await createTestApp();
    accessToken = await crearAdminYObtenerToken(app);

    const createCompetencia = await request(app.getHttpServer())
      .post('/competencias')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        nombre: `Problemas e2e ${Date.now()}`,
        fecha_inicio: '2026-09-01 10:00:00',
        fecha_fin: '2026-09-10 18:00:00',
        nivel_dificultad: 'Principiante',
        estado: 'Abierta',
        tipo: 'Individual',
        max_participantes: 30,
      })
      .expect(201);

    competenciaId = createCompetencia.body.data.competencia.id;
  });

  it('POST problema + GET lista por competencia', async () => {
    await request(app.getHttpServer())
      .post(`/competencias/${competenciaId}/problemas`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        titulo: 'Suma simple',
        dificultad: 'Facil',
        formato_entrada: 'dos enteros',
        formato_salida: 'suma',
        ejemplo_entrada: '1 2',
        ejemplo_salida: '3',
      })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get(`/competencias/${competenciaId}/problemas`)
      .expect(200);

    expect(list.body.status).toBe('success');
    expect(list.body.data.items.length).toBeGreaterThan(0);
  });

  afterEach(async () => {
    await app.close();
  });
});
