from fastapi.testclient import TestClient


def test_login_with_valid_credentials_returns_user(client: TestClient):
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@solargrid.example.com", "password": "admin123"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == "admin@solargrid.example.com"
    assert data["user"]["role"] == "admin"
    assert "access_token" in response.cookies


def test_login_with_invalid_credentials_returns_401(client: TestClient):
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@solargrid.example.com", "password": "wrong"},
    )

    assert response.status_code == 401


def test_me_requires_authentication(client: TestClient):
    response = client.get("/api/auth/me")

    assert response.status_code == 401


def test_me_returns_current_user_when_authenticated(admin_client: TestClient):
    response = admin_client.get("/api/auth/me")

    assert response.status_code == 200
    assert response.json()["email"] == "admin@solargrid.example.com"


def test_logout_succeeds_for_authenticated_user(admin_client: TestClient):
    response = admin_client.post("/api/auth/logout")

    assert response.status_code == 200
    assert response.json()["message"] == "Logged out"
