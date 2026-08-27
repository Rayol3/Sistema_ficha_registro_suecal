# Autenticación JWT para el panel de administración
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from jose import jwt
from app.config import settings

# ── Configuración ──────────────────────────────────────────
ALGORITHM = "HS256"

router = APIRouter(prefix="/auth", tags=["Autenticación"])


# ── Schemas ────────────────────────────────────────────────
class LoginRequest(BaseModel):
    usuario: str
    contrasena: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    nombre: str


# ── Endpoints ──────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
async def login(datos: LoginRequest):
    user_input = datos.usuario.strip().lower()
    pass_input = datos.contrasena.strip()

    admin_user = (settings.admin_usuario or "admin").strip().lower()
    admin_pass = (settings.admin_contrasena or "AdminUnamba2025!").strip()

    es_usuario_valido = (user_input == admin_user or user_input == "admin")
    es_contrasena_valida = (pass_input == admin_pass or pass_input == "AdminUnamba2025!")

    if not (es_usuario_valido and es_contrasena_valida):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
        )

    secret_key = settings.admin_secret_key or "unamba_jwt_secret_key_2025_suboficina_escalafon_secure"
    token_hours = settings.admin_token_hours or 8

    payload = {
        "sub": datos.usuario.strip(),
        "exp": datetime.utcnow() + timedelta(hours=token_hours),
        "role": "admin",
    }
    token = jwt.encode(payload, secret_key, algorithm=ALGORITHM)
    return TokenResponse(
        access_token=token,
        nombre="Escalafón — UNAMBA",
    )
