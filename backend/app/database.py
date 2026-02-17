import asyncpg
import logging
import uuid as _uuid
from app.config import get_settings

logger = logging.getLogger(__name__)

pool: asyncpg.Pool | None = None


async def create_pool() -> asyncpg.Pool:
    """Create and return the asyncpg connection pool."""
    global pool
    settings = get_settings()
    pool = await asyncpg.create_pool(
        host=settings.DATABASE_HOST,
        port=settings.DATABASE_PORT,
        database=settings.DATABASE_NAME,
        user=settings.DATABASE_USER,
        password=settings.DATABASE_PASSWORD,
        min_size=settings.DATABASE_MIN_POOL,
        max_size=settings.DATABASE_MAX_POOL,
        command_timeout=30,
    )
    logger.info("Database connection pool created (min=%d, max=%d)", settings.DATABASE_MIN_POOL, settings.DATABASE_MAX_POOL)
    return pool


async def close_pool():
    """Close the connection pool gracefully."""
    global pool
    if pool:
        await pool.close()
        pool = None
        logger.info("Database connection pool closed")


def get_pool() -> asyncpg.Pool:
    """Get the current connection pool. Raises if not initialized."""
    if pool is None:
        raise RuntimeError("Database pool is not initialized. Call create_pool() first.")
    return pool


async def init_schema():
    """Initialize database schema — creates all tables if they don't exist."""
    p = get_pool()
    async with p.acquire() as conn:
        await conn.execute("""
            -- Admins
            CREATE TABLE IF NOT EXISTS admins (
                id VARCHAR(36) PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- Packages
            CREATE TABLE IF NOT EXISTS packages (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price_paise INTEGER NOT NULL DEFAULT 0,
                validity_days INTEGER NOT NULL DEFAULT 30,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- Categories
            CREATE TABLE IF NOT EXISTS categories (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                description TEXT
            );

            -- Students
            CREATE TABLE IF NOT EXISTS students (
                id VARCHAR(36) PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                package_id VARCHAR(36) REFERENCES packages(id) ON DELETE SET NULL,
                package_expiry TIMESTAMPTZ,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- Questions
            CREATE TABLE IF NOT EXISTS questions (
                id VARCHAR(36) PRIMARY KEY,
                category_id VARCHAR(36) REFERENCES categories(id) ON DELETE SET NULL,
                question_text TEXT NOT NULL,
                option_a VARCHAR(500) NOT NULL,
                option_b VARCHAR(500) NOT NULL,
                option_c VARCHAR(500) NOT NULL,
                option_d VARCHAR(500) NOT NULL,
                correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A','B','C','D')),
                marks INTEGER DEFAULT 1,
                explanation TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- Tests
            CREATE TABLE IF NOT EXISTS tests (
                id VARCHAR(36) PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                description TEXT,
                category_id VARCHAR(36) REFERENCES categories(id) ON DELETE SET NULL,
                duration_minutes INTEGER NOT NULL DEFAULT 30,
                total_marks INTEGER NOT NULL DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                package_id VARCHAR(36) REFERENCES packages(id) ON DELETE SET NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- Test Questions (junction)
            CREATE TABLE IF NOT EXISTS test_questions (
                id VARCHAR(36) PRIMARY KEY,
                test_id VARCHAR(36) NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
                question_id VARCHAR(36) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
                question_order INTEGER DEFAULT 0,
                UNIQUE(test_id, question_id)
            );

            -- Test Attempts
            CREATE TABLE IF NOT EXISTS test_attempts (
                id VARCHAR(36) PRIMARY KEY,
                student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
                test_id VARCHAR(36) NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
                started_at TIMESTAMPTZ DEFAULT NOW(),
                submitted_at TIMESTAMPTZ,
                score INTEGER DEFAULT 0,
                status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress','submitted','timed_out'))
            );

            -- Attempt Answers
            CREATE TABLE IF NOT EXISTS attempt_answers (
                id VARCHAR(36) PRIMARY KEY,
                attempt_id VARCHAR(36) NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
                question_id VARCHAR(36) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
                selected_option CHAR(1) CHECK (selected_option IN ('A','B','C','D')),
                is_correct BOOLEAN DEFAULT FALSE,
                UNIQUE(attempt_id, question_id)
            );

            -- Learning Materials
            CREATE TABLE IF NOT EXISTS learning_materials (
                id VARCHAR(36) PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                content TEXT,
                category_id VARCHAR(36) REFERENCES categories(id) ON DELETE SET NULL,
                package_id VARCHAR(36) REFERENCES packages(id) ON DELETE SET NULL,
                material_type VARCHAR(50) DEFAULT 'article',
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- Payments
            CREATE TABLE IF NOT EXISTS payments (
                id VARCHAR(36) PRIMARY KEY,
                student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
                package_id VARCHAR(36) NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
                amount_paise INTEGER NOT NULL,
                razorpay_order_id VARCHAR(255),
                razorpay_payment_id VARCHAR(255),
                razorpay_signature VARCHAR(255),
                status VARCHAR(20) DEFAULT 'created' CHECK (status IN ('created','paid','failed')),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- Indexes for performance
            CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category_id);
            CREATE INDEX IF NOT EXISTS idx_tests_category ON tests(category_id);
            CREATE INDEX IF NOT EXISTS idx_tests_package ON tests(package_id);
            CREATE INDEX IF NOT EXISTS idx_test_questions_test ON test_questions(test_id);
            CREATE INDEX IF NOT EXISTS idx_test_attempts_student ON test_attempts(student_id);
            CREATE INDEX IF NOT EXISTS idx_test_attempts_test ON test_attempts(test_id);
            CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt ON attempt_answers(attempt_id);
            CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
            CREATE INDEX IF NOT EXISTS idx_students_package ON students(package_id);
        """)
        logger.info("Database schema initialized successfully")


async def seed_default_admin():
    """Seed a default admin account if none exists."""
    from app.auth.service import hash_password
    p = get_pool()
    async with p.acquire() as conn:
        existing = await conn.fetchval("SELECT COUNT(*) FROM admins")
        if existing == 0:
            hashed = hash_password("admin123")
            await conn.execute(
                "INSERT INTO admins (id, email, password_hash, name) VALUES ($1, $2, $3, $4)",
                str(_uuid.uuid4()), "admin@mocktest.com", hashed, "Super Admin"
            )
            logger.info("Default admin seeded: admin@mocktest.com / admin123")
        else:
            logger.info("Admin(s) already exist, skipping seed")
