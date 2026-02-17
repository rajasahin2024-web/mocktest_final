import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import create_pool, close_pool, init_schema, seed_default_admin
from app.auth.router import router as auth_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create pool, init schema, seed data. Shutdown: close pool."""
    logger.info("Starting up — initializing database pool...")
    await create_pool()
    await init_schema()
    await seed_default_admin()
    logger.info("Application started successfully")
    yield
    logger.info("Shutting down — closing database pool...")
    await close_pool()


app = FastAPI(
    title="MockTest Platform API",
    description="Backend API for the online mock test platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "mocktest-api"}
