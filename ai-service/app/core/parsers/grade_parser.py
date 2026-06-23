"""Parser para la salida del calificador."""

from __future__ import annotations

import json
import re

from ...schemas.grade import CalificarResponse

_FENCE = re.compile(r"^```(?:json)?\s*|\s*```$", re.IGNORECASE)
VEREDICTOS = {"aceptable", "sospechoso", "incorrecto"}


def clean(raw: str) -> str:
    """Quita markdown y deja solo el objeto."""
    text = raw.strip().lstrip("\ufeff")
    text = _FENCE.sub("", text).strip()
    if text.startswith("{") and text.endswith("}"):
        return text
    start = text.find("{")
    end = text.rfind("}")
    if start >= 0 and end > start:
        return text[start : end + 1].strip()
    return text


def parse_calificacion(raw: str) -> CalificarResponse:
    """Parsea y valida contra el schema."""
    text = clean(raw)
    data = json.loads(text)
    if not isinstance(data, dict):
        raise ValueError("La IA debe devolver un objeto JSON.")
    if data.get("veredicto") not in VEREDICTOS:
        raise ValueError(f"veredicto invalido: {data.get('veredicto')!r}")
    return CalificarResponse.model_validate(data)
