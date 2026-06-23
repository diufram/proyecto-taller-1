"""Health check."""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from ..core.lmstudio_client import reachable
from ..config import settings

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    status: str
    lmstudio_reachable: bool
    model: str


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    ok = await reachable()
    return HealthResponse(
        status="ok" if ok else "degraded",
        lmstudio_reachable=ok,
        model=settings.lmstudio_model,
    )
