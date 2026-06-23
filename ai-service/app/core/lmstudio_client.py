"""Cliente HTTP simple hacia LM Studio."""

from __future__ import annotations

import httpx

from ..config import settings


class LmStudioError(RuntimeError):
    """LM Studio no respondio o devolvio algo inesperado."""


_client: httpx.AsyncClient | None = None


def get_client() -> httpx.AsyncClient:
    global _client
    if _client is None:
        _client = httpx.AsyncClient(
            base_url=settings.lmstudio_base_url,
            timeout=settings.lmstudio_timeout_seconds,
            headers={
                "Authorization": f"Bearer {settings.lmstudio_api_key}",
                "Content-Type": "application/json",
            },
        )
    return _client


async def close_client() -> None:
    global _client
    if _client is not None:
        await _client.aclose()
        _client = None


async def chat(messages: list[dict[str, str]]) -> str:
    """Llama a /v1/chat/completions y devuelve el contenido del assistant."""
    client = get_client()
    try:
        res = await client.post(
            "/chat/completions",
            json={
                "model": settings.lmstudio_model,
                "messages": messages,
                "temperature": 0.2,
                "max_tokens": 2000,
                "stream": False,
            },
        )
        res.raise_for_status()
    except httpx.RequestError as exc:
        raise LmStudioError(f"LM Studio no accesible: {exc}") from exc
    except httpx.HTTPStatusError as exc:
        raise LmStudioError(
            f"LM Studio respondio HTTP {exc.response.status_code}"
        ) from exc

    data = res.json()
    try:
        return data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as exc:
        raise LmStudioError("LM Studio devolvio una respuesta sin contenido.") from exc


async def reachable() -> bool:
    """Ping suave a /v1/models."""
    client = get_client()
    try:
        res = await client.get("/models")
        return res.status_code < 400
    except httpx.RequestError:
        return False
