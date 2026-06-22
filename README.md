# Proyecto Taller

Stack: NestJS (backend) + Angular 20 (frontend) + PostgreSQL

## Requisitos

- Node.js 20+
- pnpm
- PostgreSQL 15 (o usar Docker)

## Instalación

```bash
# Backend
cd backend
pnpm install

# Frontend
cd frontend
pnpm install
```

## Variables de entorno (Docker Compose)

Crear `.env` en la raíz basado en `.env.example`:

```
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=proyecto_taller
PORT=3000
JWT_ACCESS_SECRET=your-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
SWAGGER_ENABLED=true
NODE_ENV=production
ALLOWED_ORIGIN=http://localhost:4200
```

## Levantar servicios

### Base de datos (Docker)

```bash
cd backend
docker-compose up -d
```

### Backend

```bash
cd backend
pnpm run start:dev     # modo desarrollo con watch
pnpm run start          # modo normal
pnpm run start:prod     # producción (requiere build previo)
```

### Frontend

```bash
cd frontend
pnpm run start          # ng serve — http://localhost:4200
pnpm run build          # producción
pnpm run test           # Jest (unit + integration)
pnpm run test:watch     # Jest en modo watch
```

## Comandos Backend

```bash
# Build y lint
pnpm run build
pnpm run lint

# Tests
pnpm run test              # unit tests
pnpm run test:watch        # watch mode
pnpm run test:cov          # con coverage
pnpm run test:e2e          # e2e tests

# Base de datos (TypeORM)
pnpm run db:generate <nombre>   # generar migración
pnpm run db:migrate             # correr migraciones
pnpm run db:revert              # revertir última
pnpm run db:drop                # borrar todo
pnpm run db:fresh               # drop + migrate
pnpm run db:reset               # revert + migrate
pnpm run db:seed                # sembrar datos iniciales
```

## URLs

- Backend: http://localhost:3000
- Swagger docs: http://localhost:3000/docs (solo en desarrollo)
- Frontend: http://localhost:4200

## Docker

Este proyecto usa una configuración base y overrides por entorno:

- `docker-compose.yml`: base común (db + backend + frontend)
- `docker-compose.local.yml`: puertos locales + servicio `seed`
- `docker-compose.prod.yml`: exposición mínima para producción

### Local (desarrollo con Docker)

```bash
# Crear .env desde el ejemplo
cp .env.example .env  # ajustar valores si es necesario

# Levantar todo (db + seed + backend + frontend)
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build

# Bajar todo
docker compose -f docker-compose.yml -f docker-compose.local.yml down -v
```

Notas local:

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3001`
- PostgreSQL: `localhost:5433`
- El servicio `seed` crea el admin inicial y luego termina (`Exited` es esperado)

Credenciales admin seed:

- Correo: `admin@gmail.com`
- Contraseña: `123123123`

### Producción

```bash
# Crear/editar .env con valores reales de producción
cp .env.example .env

# Levantar stack de producción
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Bajar stack
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

Notas producción:

- Frontend se publica en puerto `4200`
- Backend y DB no se publican al host (solo red interna Docker)
- El servicio `seed` corre antes del backend para crear datos iniciales
- Configura `ALLOWED_ORIGIN` con la URL pública real del frontend
  - Ejemplo: `http://1.1.1.1` o `https://tu-dominio.com`
- El frontend consume la API por `/api` (proxy Nginx)

Para desarrollo local, usar los comandos de arriba de backend/frontend por separado.

## Testing

El proyecto usa **Jest** en backend y frontend (mismo runner).

### Estructura

```
backend/
├── src/
│   └── features/
│       └── auth/
│           ├── auth.service.ts
│           └── auth.service.spec.ts          ← unit
├── test/
│   ├── setup/
│   │   ├── test-app.factory.ts              ← bootstrap para e2e
│   │   └── auth.helper.ts                   ← crea admin + login
│   └── features/
│       └── dashboard/
│           └── dashboard.e2e-spec.ts         ← e2e

frontend/
├── jest.config.js
├── setup-jest.ts
├── src/
│   ├── testing/                             ← mocks compartidos
│   │   ├── mock-api.service.ts
│   │   ├── mock-router.ts
│   │   ├── jwt.helper.ts
│   │   └── style-mock.js
│   └── app/
│       └── features/
│           └── auth/
│               └── services/
│                   └── auth.service.spec.ts  ← unit
```

### Frontend (Jest)

Stack: `jest@29`, `jest-preset-angular@14`, `@angular-builders/jest@20`, `jsdom@26`.

Karma/Jasmine fueron removidos del proyecto. El builder de `angular.json` apunta a `@angular-builders/jest:run` y `pnpm run test` ejecuta Jest directamente.

```bash
cd frontend
pnpm run test                  # corre todos los specs
pnpm run test:watch            # modo watch
pnpm run build                 # valida que compila

# Correr un spec puntual
npx jest --config jest.config.js src/app/features/auth/services/auth.service.spec.ts

# Con coverage
npx jest --config jest.config.js --coverage
```

Specs disponibles:

- `auth.service.spec.ts` — `isTokenExpired`, `clearSession`, `logout`, `hasValidAccessToken`.
- `auth.guard.spec.ts` — permite acceso con token válido, redirige si no.
- `auth.interceptor.spec.ts` — header `Authorization`, urls públicas, refresh exitoso/fallido.
- `problem-generator.service.spec.ts` — keyword `suma`, defaults, clamp 1-5.
- `competencias.service.spec.ts`, `problemas.service.spec.ts`, `dashboard.service.spec.ts` — integration con `HttpTestingController`.

Helpers en `frontend/src/testing/`:

- `mock-api.service.ts` — mock programable de `ApiService`.
- `mock-router.ts` — captura `navigate`.
- `jwt.helper.ts` — `makeJwt`, `futureExp`, `pastExp`.

### Backend (Jest)

Stack: `jest@30`, `supertest`, `ts-jest`.

Hay dos tipos de specs:

- **Unit** (`*.spec.ts` dentro de `src/`): mockean repositorios.
- **E2E** (`*.e2e-spec.ts` dentro de `test/`): levantan `AppModule` real contra Postgres.

```bash
cd backend
pnpm run test                  # unit (sin DB)
pnpm run test:watch            # unit watch
pnpm run test:cov              # unit + coverage
pnpm run test:e2e              # e2e (requiere DB activa y migrada)

# Spec puntual
npx jest src/features/dashboard/dashboard.service.spec.ts
```

Specs disponibles:

- **Unit**:
  - `auth.service.spec.ts` — `login` inválido, `refresh` válido/inválido.
  - `dashboard.service.spec.ts` — `tasaAcierto`, distribuciones con ceros.
  - `problemas.repository.spec.ts` — `contarPorDificultad`.
  - `ranking.service.spec.ts` — `computeTrend`, `capitalize`.
  - `competencias.service.spec.ts` — validación de rango de fechas.
- **E2E**:
  - `auth.e2e-spec.ts`, `competencias.e2e-spec.ts`, `response-format.e2e-spec.ts` (existentes).
  - `dashboard.e2e-spec.ts` — `GET /dashboard/admin` con/sin token.
  - `problemas.e2e-spec.ts` — crear problema y listarlo por competencia.

### CI / buenas prácticas

- Correr `pnpm run build` en backend y frontend antes de mergear.
- Backend: correr `pnpm run test` en CI con servicio de Postgres para también correr e2e.
- Frontend: el script `pnpm run test` ya apunta a Jest, no requiere navegador.
- Cuando se agregue un nuevo spec:
  - Frontend: archivo junto al `.ts` que cubre, nombre `*.spec.ts`.
  - Backend unit: dentro de `src/features/<feature>/`.
  - Backend e2e: dentro de `test/features/<feature>/`, reusando `createTestApp` y `crearAdminYObtenerToken`.
