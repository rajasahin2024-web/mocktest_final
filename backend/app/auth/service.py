from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from app.config import get_settings
from app.database import get_pool
import logging

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def create_token(data: dict, expires_delta: timedelta) -> str:
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_admin_token(admin_id: str, email: str) -> str:
    settings = get_settings()
    return create_token(
        {"sub": admin_id, "email": email, "role": "admin"},
        timedelta(hours=settings.ADMIN_TOKEN_EXPIRE_HOURS),
    )


def create_student_token(student_id: str, email: str) -> str:
    settings = get_settings()
    return create_token(
        {"sub": student_id, "email": email, "role": "student"},
        timedelta(days=settings.STUDENT_TOKEN_EXPIRE_DAYS),
    )


def decode_token(token: str) -> dict | None:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None


async def get_admin_by_email(email: str) -> dict | None:
    pool = get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, email, password_hash, name FROM admins WHERE email = $1",
            email,
        )
        if row:
            return dict(row)
        return None


async def authenticate_admin(email: str, password: str) -> dict | None:
    admin = await get_admin_by_email(email)
    if not admin:
        return None
    if not verify_password(password, admin["password_hash"]):
        return None
    return admin
