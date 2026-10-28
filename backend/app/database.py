import logging
import socket
from urllib.parse import urlparse
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

DATABASE_URL = settings.DATABASE_URL
engine = None
connect_args = {}

def _is_postgres_available(url_str: str) -> bool:
    """Fast non-blocking socket probe (0.3s) to verify if PostgreSQL service is running."""
    try:
        parsed = urlparse(url_str)
        host = parsed.hostname or "localhost"
        port = parsed.port or 5432
        with socket.create_connection((host, port), timeout=0.3):
            return True
    except Exception:
        return False

# Smart Database Initialization: PostgreSQL (if online) or SQLite (offline/local fallback)
if DATABASE_URL.startswith("postgresql"):
    if _is_postgres_available(DATABASE_URL):
        try:
            engine = create_engine(DATABASE_URL, pool_pre_ping=True)
            logger.info("Connected to live PostgreSQL database at %s", DATABASE_URL.split("@")[-1])
        except Exception as exc:
            logger.warning("PostgreSQL connect failed (%s). Using SQLite fallback.", str(exc).split("\n")[0])
            DATABASE_URL = "sqlite:///./brandguard.db"
            connect_args = {"check_same_thread": False}
            engine = create_engine(DATABASE_URL, connect_args=connect_args)
    else:
        logger.info("Local PostgreSQL (5432) not reachable. Utilizing SQLite (./brandguard.db) for local development.")
        DATABASE_URL = "sqlite:///./brandguard.db"
        connect_args = {"check_same_thread": False}
        engine = create_engine(DATABASE_URL, connect_args=connect_args)
else:
    if DATABASE_URL.startswith("sqlite"):
        connect_args = {"check_same_thread": False}
    engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI Dependency for database session management."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
