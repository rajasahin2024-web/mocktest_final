from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.auth.service import authenticate_admin, create_admin_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str


@router.post("/admin/login", response_model=TokenResponse)
async def admin_login(body: AdminLoginRequest):
    """Authenticate admin and return JWT token."""
    admin = await authenticate_admin(body.email, body.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_admin_token(str(admin["id"]), admin["email"])
    return TokenResponse(
        access_token=token,
        role="admin",
        name=admin["name"],
    )
