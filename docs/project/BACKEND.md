# Backend Documentation

> MockTest Pro ka backend **Python FastAPI** framework use karta hai with **asyncpg** (async PostgreSQL driver) aur **JWT** authentication.

---

## Tech Stack

| Technology           | Version   | Purpose                          |
|---------------------|-----------|-----------------------------------|
| Python              | 3.10+     | Programming language              |
| FastAPI             | 0.115.6   | ASGI REST API framework           |
| Uvicorn             | 0.34.0    | ASGI server (development + prod)  |
| asyncpg             | 0.30.0    | Async PostgreSQL connection pool  |
| python-jose         | 3.3.0     | JWT token creation & verification |
| passlib[bcrypt]     | 1.7.4     | Password hashing (12 rounds)      |
| pydantic            | 2.10.4    | Data validation & serialization   |
| pydantic-settings   | 2.7.1     | .env configuration management     |
| razorpay            | 1.4.2     | Payment gateway SDK               |
| python-multipart    | 0.0.20    | Form data parsing                 |
| python-dotenv       | 1.0.1     | .env file loading                 |

---

## Architecture & File Structure

```
backend/
├── .env                 # Environment variables
├── requirements.txt     # Python dependencies
└── app/
    ├── __init__.py      # Package marker
    ├── main.py          # FastAPI app entry point
    ├── config.py        # Settings management (Pydantic)
    ├── database.py      # DB pool + schema + seed
    └── auth/
        ├── __init__.py
        ├── router.py        # API routes (/api/auth/*)
        ├── service.py       # Business logic (JWT, passwords, DB queries)
        └── dependencies.py  # FastAPI dependency injection (auth guards)
```

---

## Module Details

### `main.py` — Application Entry Point

**Responsibilities:**
- FastAPI app initialization with metadata (title, description, version)
- Lifespan context manager (startup → shutdown)
- CORS middleware configuration
- Health check endpoint
- Router registration

**Lifespan Events:**
```
Startup:
  1. create_pool()       → asyncpg connection pool banata hai
  2. init_schema()       → Tables create karta hai (IF NOT EXISTS)
  3. seed_default_admin() → Default admin add karta hai agar koi nahi hai

Shutdown:
  1. close_pool()        → Connection pool gracefully close karta hai
```

**CORS Config:**
- Allowed origins: `FRONTEND_URL` from `.env` + `http://localhost:3000`
- Credentials: Allowed
- Methods: All (`*`)
- Headers: All (`*`)

---

### `config.py` — Settings Management

`pydantic-settings` ka `BaseSettings` use karta hai `.env` file se configuration load karne ke liye.

**Settings Groups:**

| Group     | Variables                                                   |
|-----------|-------------------------------------------------------------|
| Database  | HOST, PORT, NAME, USER, PASSWORD, MIN_POOL, MAX_POOL        |
| JWT       | SECRET_KEY, ALGORITHM, ADMIN_TOKEN_EXPIRE_HOURS, STUDENT_TOKEN_EXPIRE_DAYS |
| Razorpay  | KEY_ID, KEY_SECRET                                          |
| App       | APP_ENV, FRONTEND_URL                                        |

**Properties:**
- `database_dsn` → Full PostgreSQL connection string generate karta hai

**Caching:**
- `@lru_cache()` decorator ensures Settings sirf ek baar load hoti hai

---

### `database.py` — Database Layer

**Connection Pool:**
- asyncpg pool with configurable min/max connections
- 30 second command timeout
- Global `pool` variable module level pe stored hai

**Key Functions:**

| Function             | Purpose                                               |
|---------------------|-------------------------------------------------------|
| `create_pool()`     | asyncpg connection pool initialize karta hai           |
| `close_pool()`      | Pool gracefully close karta hai                        |
| `get_pool()`        | Current pool return karta hai (raises if not init)     |
| `init_schema()`     | 10 tables + 9 indexes create karta hai (idempotent)   |
| `seed_default_admin()`| Default admin create karta hai agar table empty hai |

**Schema Details:**
See [DATABASE.md](./DATABASE.md) for complete schema documentation.

---

### `auth/router.py` — Auth API Routes

**Prefix**: `/api/auth`

| Method | Path           | Handler        | Description        |
|--------|----------------|----------------|--------------------|
| POST   | `/admin/login` | `admin_login`  | Admin authentication|

**Request/Response Models:**
- `AdminLoginRequest` → `{ email: EmailStr, password: str }`
- `TokenResponse` → `{ access_token, token_type, role, name }`

---

### `auth/service.py` — Business Logic

**Password Functions:**
- `hash_password(password)` → bcrypt hash (12 rounds)
- `verify_password(password, hashed)` → bcrypt verify

**JWT Functions:**
- `create_token(data, expires_delta)` → Generic JWT creator
- `create_admin_token(admin_id, email)` → Admin-specific token (24h expiry)
- `create_student_token(student_id, email)` → Student-specific token (7d expiry)
- `decode_token(token)` → JWT decode + verify (returns payload or None)

**DB Functions:**
- `get_admin_by_email(email)` → Admin record fetch karta hai
- `authenticate_admin(email, password)` → Email + password verify karta hai

---

### `auth/dependencies.py` — Auth Guards

FastAPI dependency injection ke liye 2 guards:

#### `get_current_admin`
```python
async def get_current_admin(credentials) -> dict:
    # 1. JWT token extract karta hai
    # 2. Token decode + verify karta hai
    # 3. role == "admin" check karta hai
    # 4. Payload return karta hai ya 401/403 raise karta hai
```

#### `get_current_student`
```python
async def get_current_student(credentials) -> dict:
    # Same as above but checks role == "student"
```

**Usage:**
```python
@router.get("/api/admin/something")
async def protected_endpoint(admin: dict = Depends(get_current_admin)):
    admin_id = admin["sub"]
    admin_email = admin["email"]
```

---

## Running the Backend

### Development

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### API Documentation (Auto-generated)

| Path    | UI Type    |
|---------|------------|
| `/docs` | Swagger UI |
| `/redoc`| ReDoc      |

### Logging

Backend structured logging use karta hai:
```
2026-02-18 02:00:00 [INFO] app.main: Starting up — initializing database pool...
2026-02-18 02:00:01 [INFO] app.database: Database connection pool created (min=5, max=20)
2026-02-18 02:00:01 [INFO] app.database: Database schema initialized successfully
2026-02-18 02:00:01 [INFO] app.database: Default admin seeded: admin@mocktest.com / admin123
2026-02-18 02:00:01 [INFO] app.main: Application started successfully
```

---

## Security Overview

| Feature                  | Implementation                         |
|--------------------------|----------------------------------------|
| Password Storage         | bcrypt with 12 salt rounds             |
| Authentication           | JWT (HS256 algorithm)                  |
| Token Transport          | HTTP Bearer Authorization header       |
| CORS                     | Restricted to frontend URL             |
| Input Validation         | Pydantic models with EmailStr, etc.    |
| SQL Injection Prevention | Parameterized queries ($1, $2, etc.)   |
| Connection Security      | Configurable via DATABASE_HOST         |
