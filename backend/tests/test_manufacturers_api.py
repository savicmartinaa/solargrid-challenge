from fastapi.testclient import TestClient


def test_list_manufacturers_returns_seeded_manufacturers(client: TestClient):
    response = client.get("/api/manufacturers")

    assert response.status_code == 200
    manufacturers = response.json()
    assert manufacturers
    assert {"id", "name", "slug", "country", "city", "logo_url"}.issubset(
        manufacturers[0].keys()
    )


def test_list_manufacturers_includes_known_seed_record(client: TestClient):
    response = client.get("/api/manufacturers")

    assert response.status_code == 200
    names = {manufacturer["name"] for manufacturer in response.json()}
    assert "SunVolt Energy" in names
