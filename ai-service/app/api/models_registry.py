"""GET/PUT /prompts/{rol} — edicion de prompts del sistema."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..schemas.grade import PromptResponse, PromptUpdate, Rol
from ..storage import json_store

router = APIRouter(tags=["prompts"])

ROLES = ("problem_generator", "solution_grader")


@router.get("/prompts", response_model=list[PromptResponse])
async def list_prompts() -> list[PromptResponse]:
    data = json_store.load_all()
    return [PromptResponse(rol=rol, prompt=data.get(rol, "")) for rol in ROLES]


@router.get("/prompts/{rol}", response_model=PromptResponse)
async def get_prompt(rol: Rol) -> PromptResponse:
    return PromptResponse(rol=rol, prompt=json_store.get(rol))


@router.put("/prompts/{rol}", response_model=PromptResponse)
async def update_prompt(rol: Rol, body: PromptUpdate) -> PromptResponse:
    json_store.set(rol, body.prompt)
    return PromptResponse(rol=rol, prompt=body.prompt)
