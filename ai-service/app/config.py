"""Configuracion desde .env."""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )

    lmstudio_base_url: str = "http://localhost:1234/v1"
    lmstudio_api_key: str = "lm-studio"
    lmstudio_model: str = "qwen2.5-coder-7b-instruct"
    lmstudio_timeout_seconds: float = 120.0

    prompts_file: str = "./data/prompts.json"


settings = Settings()
