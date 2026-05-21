from pathlib import Path

from fastapi.testclient import TestClient


PNG_BYTES = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01"
    b"\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde"
    b"\x00\x00\x00\x0cIDATx\x9cc\xf8\xff\xff?\x00\x05"
    b"\xfe\x02\xfeA\x8d\x9d\x1d\x00\x00\x00\x00IEND\xaeB`\x82"
)


def equipment_payload(model_name: str = "Test Panel API"):
    return {
        "model_name": model_name,
        "equipment_type": "panel",
        "manufacturer_id": 1,
        "power_rating_w": 410,
        "efficiency_percent": "21.50",
        "warranty_years": 25,
        "weight_kg": "20.30",
        "dimensions": {"w": 1722, "h": 1134, "d": 30},
        "price": "275.00",
        "certification": "IEC 61215",
        "release_year": 2026,
        "image_url": None,
        "description": "Created by automated API test.",
        "extra_fields": None,
    }


def test_list_equipment_supports_type_and_manufacturer_filters(client: TestClient):
    all_response = client.get("/api/equipment")
    assert all_response.status_code == 200
    assert all_response.json()

    type_response = client.get("/api/equipment", params={"type": "battery"})
    assert type_response.status_code == 200
    assert type_response.json()
    assert all(item["equipment_type"] == "battery" for item in type_response.json())

    manufacturer_response = client.get(
        "/api/equipment",
        params={"manufacturer_id": 1},
    )
    assert manufacturer_response.status_code == 200
    assert manufacturer_response.json()
    assert all(
        item["manufacturer"]["id"] == 1 for item in manufacturer_response.json()
    )


def test_editor_can_create_and_admin_can_delete_equipment(
    editor_client: TestClient,
    admin_client: TestClient,
):
    create_response = editor_client.post(
        "/api/equipment",
        json=equipment_payload("Editor Created Test Panel"),
    )
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["model_name"] == "Editor Created Test Panel"

    delete_response = admin_client.delete(f"/api/equipment/{created['id']}")
    assert delete_response.status_code == 200
    assert "deleted" in delete_response.json()["message"]


def test_viewer_cannot_create_equipment(viewer_client: TestClient):
    response = viewer_client.post(
        "/api/equipment",
        json=equipment_payload("Viewer Should Not Create"),
    )

    assert response.status_code == 403


def test_openapi_documents_dimensions_fields(client: TestClient):
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schemas = response.json()["components"]["schemas"]
    dimensions_schema = schemas["EquipmentDimensions"]
    assert dimensions_schema["properties"] == {
        "w": {"type": "integer", "title": "W"},
        "h": {"type": "integer", "title": "H"},
        "d": {"type": "integer", "title": "D"},
    }
    assert dimensions_schema["required"] == ["w", "h", "d"]
    assert schemas["EquipmentCreate"]["properties"]["dimensions"] == {
        "$ref": "#/components/schemas/EquipmentDimensions"
    }


def test_image_upload_stores_file_and_returns_database_path(editor_client: TestClient):
    response = editor_client.post(
        "/api/equipment/upload-image",
        files={"image": ("panel.png", PNG_BYTES, "image/png")},
    )

    assert response.status_code == 200
    image_url = response.json()["image_url"]
    assert image_url.startswith("/uploads/equipment/")

    uploaded_file = Path(image_url.lstrip("/"))
    assert uploaded_file.exists()
    assert uploaded_file.read_bytes() == PNG_BYTES

    uploaded_file.unlink()


def test_image_upload_rejects_non_image_files(editor_client: TestClient):
    response = editor_client.post(
        "/api/equipment/upload-image",
        files={"image": ("notes.txt", b"not an image", "text/plain")},
    )

    assert response.status_code == 400
