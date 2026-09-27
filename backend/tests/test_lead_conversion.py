from fastapi.testclient import TestClient

from app.main import app


def test_convert_lead():
    payload = {
        "name": "Conversion Test Lead",
        "company": "Conversion Company",
        "email": "conversion@example.com",
        "phone": "9876543210",
        "industry": "Technology",
        "source": "Website",
        "status": "New",
    }

    with TestClient(app) as client:
        create_response = client.post(
            "/api/leads/",
            json=payload,
        )

        assert create_response.status_code == 201

        lead_id = create_response.json()["id"]

        convert_response = client.post(
            f"/api/leads/{lead_id}/convert"
        )

        assert convert_response.status_code == 200

        data = convert_response.json()

        assert "id" in data
        assert data["name"] == "Conversion Test Lead"
        assert data["company"] == "Conversion Company"
        assert data["email"] == "conversion@example.com"
        assert data["phone"] == "9876543210"
        assert data["industry"] == "Technology"


def test_convert_lead_without_industry():
    payload = {
        "name": "Lead Without Industry",
        "company": "No Industry Company",
        "email": "no-industry@example.com",
    }

    with TestClient(app) as client:
        create_response = client.post("/api/leads/", json=payload)
        assert create_response.status_code == 201

        lead_id = create_response.json()["id"]
        convert_response = client.post(f"/api/leads/{lead_id}/convert")

        assert convert_response.status_code == 200
        assert convert_response.json()["industry"] is None


def test_convert_lead_invalid_id():
    with TestClient(app) as client:
        response = client.post(
            "/api/leads/invalid-id/convert"
        )

        assert response.status_code == 400


def test_convert_lead_not_found():
    fake_id = "000000000000000000000000"

    with TestClient(app) as client:
        response = client.post(
            f"/api/leads/{fake_id}/convert"
        )

        assert response.status_code == 404