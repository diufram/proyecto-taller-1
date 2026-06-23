"""Mensajes para el calificador de soluciones."""

from __future__ import annotations

from ...schemas.grade import CalificarRequest
from ...storage import json_store


def build(req: CalificarRequest) -> list[dict[str, str]]:
    system = json_store.get("solution_grader")
    p = req.problema
    lang = req.lenguaje or "desconocido"
    code = req.codigo if len(req.codigo) <= 6000 else req.codigo[:6000] + "\n..."
    user = (
        f"PROBLEMA:\n"
        f"Titulo: {p.titulo}\n"
        f"Descripcion: {p.descripcion}\n"
        f"Formato de entrada: {p.formato_entrada}\n"
        f"Formato de salida: {p.formato_salida}\n\n"
        f"LENGUAJE: {lang}\n\n"
        f"CODIGO:\n```\n{code}\n```\n\n"
        "Devuelve solo el JSON estructurado segun las reglas."
    )
    return [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ]
