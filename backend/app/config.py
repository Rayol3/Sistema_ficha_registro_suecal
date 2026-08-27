from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Base de datos
    database_url: str = "postgresql://postgres:NLnsmEQUxMLiIWyIBpqYUtMfcycKRZed@sakura.proxy.rlwy.net:32109/railway"

    # Cloudinary
    cloudinary_cloud_name: str = "tgllmu3d"
    cloudinary_api_key: str = "123456789"
    cloudinary_api_secret: str = "secret"

    # App
    app_name: str = "Ficha Digital UNAMBA 2025"
    app_version: str = "1.0.0"
    debug: bool = True

    # Admin — credenciales y JWT con valores por defecto seguros
    admin_usuario: str = "admin"
    admin_contrasena: str = "unamba2026!"
    admin_secret_key: str = "unamba_jwt_secret_key_2025_suboficina_escalafon_secure"
    admin_token_hours: int = 8

    # CORS — acepta formato JSON ["url1","url2"] desde el .env
    allowed_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://sistemaficharegistrosuecal-production.up.railway.app",
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # Permite leer listas con formato ["a","b"] desde el .env
        env_parse_default_factory = True


# Instancia única reutilizable en toda la app
settings = Settings()
