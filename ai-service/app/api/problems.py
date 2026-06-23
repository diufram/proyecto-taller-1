"""POST /generate/problems."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..core.lmstudio_client import LmStudioError, chat
from ..core.parsers import problem_parser
from ..core.prompts import problem_generator
from ..schemas.grade import GenerarProblemasRequest, GenerarProblemasResponse

router = APIRouter(tags=["problems"])


@router.post("/generate/problems", response_model=GenerarProblemasResponse)
async def generate_problems(body: GenerarProblemasRequest) -> GenerarProblemasResponse:
    try:
        text = await chat(problem_generator.build(body))
        problemas = problem_parser.parse_problemas(text, body.cantidad)
    except LmStudioError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except (ValueError, Exception) as exc:
        raise HTTPException(
            status_code=502, detail=f"Salida invalida de la IA: {exc}"
        ) from exc
    return GenerarProblemasResponse(problemas=problemas)
