"""Parser para la salida del generador."""

from __future__ import annotations

import json
import re

from ...schemas.grade import GenerarProblemasRequest, Problema

_FENCE = re.compile(r"^```(?:json)?\s*|\s*```$", re.IGNORECASE)


def clean(raw: str) -> str:
    """Quita markdown y deja solo el array."""
    text = raw.strip().lstrip("\ufeff")
    text = _FENCE.sub("", text).strip()
    if text.startswith("[") and text.endswith("]"):
        return text
    start = text.find("[")
    end = text.rfind("]")
    if start >= 0 and end > start:
        return text[start : end + 1].strip()
    return text


def parse_problemas(raw: str, cantidad: int) -> list[Problema]:
    """Parsea y valida contra el schema."""
    text = clean(raw)
    data = json.loads(text)
    if not isinstance(data, list):
        raise ValueError("La IA debe devolver un array.")
    if len(data) != cantidad:
        raise ValueError(
            f"La IA devolvio {len(data)} problemas, se esperaban {cantidad}."
        )
    return [Problema.model_validate(item) for item in data]


def parse_request(payload: dict) -> GenerarProblemasRequest:
    return GenerarProblemasRequest.model_validate(payload)
