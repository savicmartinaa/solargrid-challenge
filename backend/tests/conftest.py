from pathlib import Path

from alembic import command
from alembic.config import Config
import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="session", autouse=True)
def apply_migrations():
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
