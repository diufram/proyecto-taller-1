"""POST /grade/solution."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..core.lmstudio_client import LmStudioError, chat
from ..core.parsers import grade_parser
from ..core.prompts import solution_grader
from ..schemas.grade import CalificarRequest, CalificarResponse

router = APIRouter(tags=["grading"])


@router.post("/grade/solution", response_model=CalificarResponse)
async def grade_solution(body: CalificarRequest) -> CalificarResponse:
    try:
        text = await chat(solution_grader.build(body))
        return grade_parser.parse_calificacion(text)
    except LmStudioError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except (ValueError, Exception) as exc:
        raise HTTPException(
            status_code=502, detail=f"Salida invalida de la IA: {exc}"
        ) from exc
