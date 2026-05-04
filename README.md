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

## Variables de entorno (Backend)

Crear `backend/.env` basado en `backend/docker-compose.yaml`:

```
DB_HOST=localhost
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
NODE_ENV=development
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
pnpm run test           # Karma (Angular)
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

## Docker (todo junto)

```bash
# Crear .env desde el ejemplo
cp .env.example .env  # ajustar valores si es necesario

# Levantar todo (db + backend + frontend)
docker compose up -d --build

# Bajar todo
docker compose down -v
```

Para desarrollo local, usar los comandos de arriba de backend/frontend por separado.
