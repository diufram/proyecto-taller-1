"""Persistencia minima: un solo JSON con los prompts por rol."""

from __future__ import annotations

import json
from pathlib import Path
from threading import Lock

from ..config import settings

_LOCK = Lock()


def _path() -> Path:
    p = Path(settings.prompts_file).expanduser().resolve()
    p.parent.mkdir(parents=True, exist_ok=True)
    return p


DEFAULT_DATA: dict[str, str] = {
    "problem_generator": (
        "Sos un generador de problemas de programacion para una plataforma de "
        "competencias en espanol. Devolves exclusivamente un JSON valido que "
        "sea un array de objetos. Cada objeto tiene exactamente estos campos: "
        "titulo (max 120 chars), descripcion (max 2000), dificultad (Facil|Medio|Dificil), "
        "formato_entrada (max 500), formato_salida (max 500), ejemplo_entrada "
        "(max 1000), ejemplo_salida (max 1000). Sin campos extra. Sin markdown. "
        "Sin bloques de codigo. La respuesta empieza con [ y termina con ]. "
        "Los problemas deben resolverse leyendo de stdin e imprimiendo a stdout."
    ),
    "solution_grader": (
        "Sos un asistente que analiza codigo enviado como solucion a un problema "
        "de competencia. NO ejecutas el codigo: solo lo lees. Devolves "
        "exclusivamente un JSON valido que sea un objeto con estos campos: "
        'veredicto ("aceptable" | "sospechoso" | "incorrecto"), confianza '
        "(numero entre 0 y 1), score_estimado (entero entre 0 y 100), "
        "comentario (texto breve, max 500 caracteres explicando el analisis). "
        "Sin campos extra. Sin markdown. La respuesta empieza con { y termina "
        "con }. Se exigente pero bienveciente con el estilo."
    ),
}


def load_all() -> dict[str, str]:
    """Devuelve {rol: prompt}. Si el archivo no existe, devuelve los defaults."""
    path = _path()
    if not path.exists():
        return dict(DEFAULT_DATA)
    with _LOCK:
        with path.open("r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                return dict(DEFAULT_DATA)
    if not isinstance(data, dict):
        return dict(DEFAULT_DATA)
    return {k: str(v) for k, v in data.items()}


def save_all(data: dict[str, str]) -> None:
    """Sobrescribe el archivo con el dict dado."""
    path = _path()
    with _LOCK:
        tmp = path.with_suffix(".tmp")
        with tmp.open("w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        tmp.replace(path)


def get(role: str) -> str:
    """Devuelve el prompt para el rol, o el default si no existe."""
    return load_all().get(role, DEFAULT_DATA.get(role, ""))


def set(role: str, prompt: str) -> None:
    """Guarda el prompt para el rol."""
    data = load_all()
    data[role] = prompt
    save_all(data)
