import os
from pathlib import Path

from alembic import command
from alembic.config import Config
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url

TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql://solargrid:solargrid@db:5432/solargrid_test",
)
os.environ["DATABASE_URL"] = TEST_DATABASE_URL

from app.main import app


def ensure_test_database_exists() -> None:
    test_url = make_url(TEST_DATABASE_URL)
    database_name = test_url.database or ""
    if "test" not in database_name:
        raise RuntimeError(
            f"Refusing to run tests against non-test database: {database_name}"
        )

    admin_url = test_url.set(database="postgres")
    admin_engine = create_engine(admin_url, isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as connection:
        database_exists = connection.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :database_name"),
            {"database_name": database_name},
        ).scalar()
        if not database_exists:
            quoted_database_name = connection.dialect.identifier_preparer.quote(
                database_name
            )
            connection.execute(text(f"CREATE DATABASE {quoted_database_name}"))
    admin_engine.dispose()


def reset_test_database() -> None:
    engine = create_engine(TEST_DATABASE_URL)
    with engine.begin() as connection:
        connection.execute(text("DROP SCHEMA IF EXISTS public CASCADE"))
        connection.execute(text("CREATE SCHEMA public"))
    engine.dispose()


@pytest.fixture(scope="session", autouse=True)
def apply_migrations():
    ensure_test_database_exists()
    reset_test_database()
    backend_dir = Path(__file__).resolve().parent.parent
    alembic_cfg = Config(str(backend_dir / "alembic.ini"))
    command.upgrade(alembic_cfg, "head")


@pytest.fixture()
def client():
    with TestClient(app) as test_client:
        yield test_client


def login(client: TestClient, email: str, password: str) -> None:
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200


@pytest.fixture()
def admin_client(client: TestClient):
    login(client, "admin@solargrid.example.com", "admin123")
    return client


@pytest.fixture()
def editor_client(client: TestClient):
    login(client, "editor@solargrid.example.com", "editor123")
    return client


@pytest.fixture()
def viewer_client(client: TestClient):
    login(client, "viewer@solargrid.example.com", "viewer123")
    return client
