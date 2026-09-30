from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "NHAA Integrated Support Portal API"
    app_env: str = "development"

    secret_key: str
    access_token_expire_minutes: int = 30

    database_url: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()