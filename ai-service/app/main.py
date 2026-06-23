"""Punto de entrada FastAPI."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI

from .api import grading, health, models_registry, problems
from .core.lmstudio_client import close_client


@asynccontextmanager
async def _lifespan(app: FastAPI):
    yield
    await close_client()


app = FastAPI(
    title="ai-service",
    version="1.0.0",
    description=(
        "Microservicio IA para Compex. Genera problemas y califica soluciones "
        "usando LM Studio (OpenAI-compatible)."
    ),
    lifespan=_lifespan,
)

app.include_router(health.router)
app.include_router(problems.router)
app.include_router(grading.router)
app.include_router(models_registry.router)
