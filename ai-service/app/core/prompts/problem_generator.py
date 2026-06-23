"""Mensajes para el generador de problemas."""

from __future__ import annotations

from ...schemas.grade import GenerarProblemasRequest
from ...storage import json_store


def build(req: GenerarProblemasRequest) -> list[dict[str, str]]:
    system = json_store.get("problem_generator")
    cantidad = req.cantidad
    dificultad = req.dificultad or "segun el nivel"
    user = (
        f"Prompt del usuario: {req.prompt}\n"
        f"Cantidad: {cantidad}\n"
        f"Dificultad: {dificultad}\n"
        "Devuelve un array JSON con exactamente la cantidad de objetos indicada."
    )
    return [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ]
