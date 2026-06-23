"""Schemas simples para los 2 endpoints del servicio."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


Dificultad = Literal["Facil", "Medio", "Dificil"]
Veredicto = Literal["aceptable", "sospechoso", "incorrecto"]
Rol = Literal["problem_generator", "solution_grader"]


class Problema(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=120)
    descripcion: str = Field(..., min_length=1, max_length=2000)
    dificultad: Dificultad
    formato_entrada: str = Field(..., min_length=1, max_length=500)
    formato_salida: str = Field(..., min_length=1, max_length=500)
    ejemplo_entrada: str = Field(..., min_length=1, max_length=1000)
    ejemplo_salida: str = Field(..., min_length=1, max_length=1000)


class GenerarProblemasRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    cantidad: int = Field(default=3, ge=1, le=10)
    dificultad: Dificultad | None = None


class GenerarProblemasResponse(BaseModel):
    problemas: list[Problema]


class ProblemaContexto(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=120)
    descripcion: str = Field(..., min_length=1, max_length=2000)
    formato_entrada: str = Field(..., min_length=1, max_length=500)
    formato_salida: str = Field(..., min_length=1, max_length=500)


class CalificarRequest(BaseModel):
    problema: ProblemaContexto
    codigo: str = Field(..., min_length=1, max_length=20000)
    lenguaje: str | None = None


class CalificarResponse(BaseModel):
    veredicto: Veredicto
    confianza: float = Field(..., ge=0.0, le=1.0)
    score_estimado: int = Field(..., ge=0, le=100)
    comentario: str = Field(..., max_length=500)


class PromptResponse(BaseModel):
    rol: Rol
    prompt: str


class PromptUpdate(BaseModel):
    prompt: str = Field(..., min_length=10)
