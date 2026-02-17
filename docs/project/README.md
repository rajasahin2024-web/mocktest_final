# MockTest Pro — Project Documentation

> **MockTest Pro** ek online mock test platform hai jisme students timed MCQ tests de sakte hain, instant results dekhte hain, leaderboard pe compete karte hain, aur curated learning materials access karte hain. Admins ek powerful dashboard se pura platform manage karte hain.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Current Status & Roadmap](#current-status--roadmap)

---

## Project Overview

MockTest Pro ek full-stack web application hai jo **exam preparation** ke liye banaya gaya hai. Platform ke do main users hain:

| Role      | Description                                                        |
|-----------|--------------------------------------------------------------------|
| **Admin** | Tests, questions, packages, categories, aur students ko manage karta hai |
| **Student** | Register karta hai, package subscribe karta hai, tests deta hai, results dekhta hai |

### Key Features (Planned)

- ✅ **Timed Mock Tests** — Real exam conditions ke saath auto-submission
- ✅ **Instant Results** — Score, correct answers, explanations immediately
- ✅ **Leaderboard** — Student rankings aur performance comparison
- ✅ **Learning Materials** — Category-wise study notes aur guides
- ✅ **Performance Analytics** — Detailed progress tracking
- ✅ **Razorpay Payments** — Secure online package subscription
- ✅ **JWT Authentication** — Role-based secure login (Admin/Student)

---

## Tech Stack

### Backend

| Technology          | Version    | Purpose                             |
|---------------------|------------|-------------------------------------|
| **Python**          | 3.10+      | Programming language                |
| **FastAPI**         | 0.115.6    | REST API framework                  |
| **asyncpg**         | 0.30.0     | Async PostgreSQL driver             |
| **PostgreSQL**      | —          | Relational database                 |
| **python-jose**     | 3.3.0      | JWT token creation/verification     |
| **passlib[bcrypt]** | 1.7.4      | Password hashing (bcrypt, 12 rounds)|
| **pydantic-settings**| 2.7.1     | Settings management via `.env`      |
| **Razorpay SDK**    | 1.4.2      | Payment gateway integration         |
| **Uvicorn**         | 0.34.0     | ASGI server                         |

### Frontend

| Technology       | Version | Purpose                          |
|------------------|---------|----------------------------------|
| **Next.js**      | 16.1.6  | React framework (App Router)     |
| **React**        | 19.2.3  | UI library                       |
| **Tailwind CSS** | 4.x     | Utility-first CSS framework      |
| **Inter Font**   | —       | Typography (Google Fonts)        |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│               Next.js 16 (App Router)                   │
│                                                         │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Landing  │  │ Admin Login  │  │ Student Login/    │   │
│  │ Page     │  │ + Dashboard  │  │ Register          │   │
│  └──────────┘  └──────────────┘  └──────────────────┘   │
│                        │                                 │
│              ┌─────────┴──────────┐                      │
│              │   lib/api.js       │                      │
│              │  (API Helper +     │                      │
│              │   Auth Manager)    │                      │
│              └─────────┬──────────┘                      │
└────────────────────────┼────────────────────────────────┘
                         │ HTTP (REST API)
                         │ JWT Bearer Token
┌────────────────────────┼────────────────────────────────┐
│                      BACKEND                            │
│                FastAPI (Python)                          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │                  main.py                          │   │
│  │  - FastAPI app with lifespan                      │   │
│  │  - CORS middleware                                │   │
│  │  - Health check endpoint (/api/health)            │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                    │
│  ┌──────────────────┴───────────────────────────────┐   │
│  │              auth/ module                         │   │
│  │  router.py     → POST /api/auth/admin/login       │   │
│  │  service.py    → JWT, bcrypt, DB queries          │   │
│  │  dependencies.py → get_current_admin/student      │   │
│  └──────────────────────────────────────────────────┘   │
│                     │                                    │
│  ┌──────────────────┴───────────────────────────────┐   │
│  │              database.py                          │   │
│  │  - asyncpg connection pool                        │   │
│  │  - Schema initialization (10 tables)              │   │
│  │  - Default admin seeding                          │   │
│  └──────────────────┬───────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────┘
                      │
              ┌───────┴───────┐
              │  PostgreSQL   │
              │  Database     │
              └───────────────┘
```

### Request Flow

1. **User** browser se Next.js frontend access karta hai
2. **Frontend** `lib/api.js` → `apiFetch()` use karke backend ko HTTP request bhejta hai
3. **JWT token** localStorage se inject hota hai har request mein
4. **Backend** FastAPI request handle karta hai, JWT verify karta hai
5. **Database** asyncpg pool ke through PostgreSQL se data fetch/save hota hai
6. **Response** JSON format mein frontend ko wapas aata hai

---

## Project Structure

```
mocktest/
├── backend/
│   ├── .env                    # Environment variables (database, JWT, Razorpay)
│   ├── requirements.txt        # Python dependencies
│   └── app/
│       ├── __init__.py
│       ├── main.py             # FastAPI app entry point + lifespan
│       ├── config.py           # Pydantic Settings (load from .env)
│       ├── database.py         # asyncpg pool + schema init + admin seed
│       └── auth/
│           ├── __init__.py
│           ├── router.py       # Auth API endpoints
│           ├── service.py      # JWT + password + DB logic
│           └── dependencies.py # FastAPI dependency injection (auth guards)
│
├── frontend/
│   ├── package.json            # Node.js dependencies
│   ├── next.config.mjs         # Next.js configuration
│   ├── postcss.config.mjs      # PostCSS config (Tailwind)
│   ├── jsconfig.json           # Path aliases (@/ → src/)
│   ├── public/                 # Static assets (SVG icons)
│   └── src/
│       ├── app/
│       │   ├── layout.js       # Root layout (Inter font, metadata)
│       │   ├── globals.css     # Global styles + Tailwind theme + animations
│       │   ├── page.js         # Landing page (Hero, Features, Pricing, About)
│       │   ├── admin/
│       │   │   ├── login/page.js      # Admin login page
│       │   │   └── dashboard/page.js  # Admin dashboard
│       │   └── student/
│       │       └── login/page.js      # Student login/register page
│       ├── components/
│       │   └── ui/
│       │       ├── Button.js         # Reusable button (5 variants, 3 sizes)
│       │       ├── FloatingInput.js  # Floating label input field
│       │       └── Skeleton.js       # Loading skeleton component
│       └── lib/
│           └── api.js          # API fetch wrapper + auth helpers
│
└── docs/
    └── project/                # 📁 Project documentation (you are here)
```

---

## Setup & Installation

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **PostgreSQL** database (local ya remote)

### Backend Setup

```bash
# 1. Navigate to backend folder
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Configure .env file (see Environment Variables section)
# 6. Run the server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev
```

---

## Environment Variables

Backend `.env` file mein ye variables set karo:

```env
# ── Database ──
DATABASE_HOST=localhost          # PostgreSQL host
DATABASE_PORT=5432               # PostgreSQL port
DATABASE_NAME=mockdb             # Database name
DATABASE_USER=mockdb             # Database user
DATABASE_PASSWORD=your_password  # Database password
DATABASE_MIN_POOL=5              # Minimum pool connections
DATABASE_MAX_POOL=20             # Maximum pool connections

# ── JWT ──
JWT_SECRET_KEY=your_secret_key   # ⚠️ Production mein strong random key use karo
JWT_ALGORITHM=HS256              # JWT algorithm
ADMIN_TOKEN_EXPIRE_HOURS=24      # Admin token validity
STUDENT_TOKEN_EXPIRE_DAYS=7      # Student token validity

# ── Razorpay ──
RAZORPAY_KEY_ID=your_key_id      # Razorpay API Key
RAZORPAY_KEY_SECRET=your_secret  # Razorpay Secret Key

# ── App ──
APP_ENV=development              # Environment mode
FRONTEND_URL=http://localhost:3000  # Frontend URL for CORS
```

> ⚠️ **Important**: Production mein `.env` file ko git mein commit mat karo. Strong JWT secret aur actual Razorpay keys use karo.

---

## Running the Project

### Development Mode

```bash
# Terminal 1 — Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### Access URLs

| Service          | URL                         |
|------------------|-----------------------------|
| Frontend         | http://localhost:3000        |
| Backend API      | http://localhost:8000        |
| API Docs (Swagger)| http://localhost:8000/docs  |
| Health Check     | http://localhost:8000/api/health |

### Default Admin Credentials

| Field    | Value               |
|----------|----------------------|
| Email    | admin@mocktest.com   |
| Password | admin123             |

> ⚠️ First startup pe backend automatically default admin seed karta hai. Production mein ye credentials immediately change karo.

---

## Current Status & Roadmap

### ✅ Completed (Phase 1-2)

- [x] Project structure setup (monorepo: backend + frontend)
- [x] FastAPI backend with asyncpg connection pool
- [x] Complete database schema (10 tables with indexes)
- [x] JWT authentication system (admin login)
- [x] Password hashing with bcrypt (12 rounds)
- [x] Pydantic Settings for configuration management
- [x] CORS middleware configuration
- [x] Next.js 16 frontend with React 19 + Tailwind CSS 4
- [x] Landing page (Hero, Features, Pricing, About, Footer)
- [x] Admin login page with form validation
- [x] Admin dashboard (skeleton with quick action cards)
- [x] Student login/register page (UI ready)
- [x] Reusable UI components (Button, FloatingInput, Skeleton)
- [x] API fetch utility with JWT injection
- [x] Auth helpers (saveAuth, clearAuth, getAuth)
- [x] Schema auto-seeding (default admin on first run)

### 🔲 Pending (Phase 3-5+)

- [ ] Admin CRUD APIs — Questions, Tests, Categories, Packages, Learning Materials
- [ ] Admin Dashboard — Full management UI with data tables
- [ ] Student Auth — Registration, Login, Profile management
- [ ] Student Dashboard — Test list, attempt history, analytics
- [ ] Test Engine — Timed test-taking with auto-submission
- [ ] Results & Analytics — Score breakdown, explanations, charts
- [ ] Leaderboard — Ranking system across tests
- [ ] Razorpay Payment Integration — Package subscription flow
- [ ] Learning Materials — Content viewer for students
- [ ] Deployment — Production setup, CI/CD pipeline
