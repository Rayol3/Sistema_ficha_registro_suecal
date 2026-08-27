# Dependencias reutilizables para proteger endpoints
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.config import settings

ALGORITHM = "HS256"

bearer = HTTPBearer()


def verificar_token(
    credenciales: HTTPAuthorizationCredentials = Depends(bearer),
) -> dict:
    try:
        secret_key = settings.admin_secret_key or "unamba_jwt_secret_key_2025_suboficina_escalafon_secure"
        payload = jwt.decode(
            credenciales.credentials,
            secret_key,
            algorithms=[ALGORITHM],
        )
        if payload.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Sin permisos de administrador",
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        )
