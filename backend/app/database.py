# Configura el motor de base de datos asíncrono
# y provee la sesión que usan los endpoints

from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    async_sessionmaker,
)
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

# ── Normalizar URL para asyncpg (Railway/Supabase entregan postgresql://) ──
db_url = settings.database_url
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+asyncpg://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# ── Motor asíncrono ────────────────────────────────────────
engine = create_async_engine(
    db_url,
    echo=settings.debug,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    connect_args={"statement_cache_size": 0},  # Requerido para Supabase / Transaction Poolers
)

# ── Fábrica de sesiones ────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,  # Evita errores al acceder a datos post-commit
)


# ── Clase base para los modelos SQLAlchemy ─────────────────
class Base(DeclarativeBase):
    pass


# ── Dependencia de FastAPI ─────────────────────────────────
# Se inyecta en cada endpoint que necesite acceso a la BD
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
