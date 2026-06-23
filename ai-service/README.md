# ai-service

Microservicio FastAPI que conecta con **LM Studio** (OpenAI-compatible en
`http://localhost:1234/v1`) para ofrecer dos servicios al backend de Compex:

| Método | Path | Descripción |
|---|---|---|
| `GET` | `/health` | Estado del servicio + alcance a LM Studio |
| `POST` | `/generate/problems` | Genera N problemas en JSON |
| `POST` | `/grade/solution` | Analiza código y devuelve veredicto + score |
| `GET` / `PUT` | `/prompts/{rol}` | Ver / editar los prompts del sistema |

## Ejecutar

```bash
cd ai-service
python -m venv .venv && source .venv/bin/activate
pip install -e .
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

LM Studio debe estar corriendo con un modelo cargado y el Local Server en
puerto 1234.

## Variables de entorno

| Variable | Default |
|---|---|
| `LMSTUDIO_BASE_URL` | `http://localhost:1234/v1` |
| `LMSTUDIO_MODEL` | `qwen2.5-coder-7b-instruct` |
| `LMSTUDIO_TIMEOUT_SECONDS` | `120` |
| `AI_SERVICE_HOST` | `0.0.0.0` |
| `AI_SERVICE_PORT` | `8000` |
| `AI_SERVICE_DATA_DIR` | `./data` |
