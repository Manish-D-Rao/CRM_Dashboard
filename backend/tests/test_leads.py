from fastapi.testclient import TestClient

from app.main import app


def test_create_lead():
    payload = {
        "name": "Test Lead",
        "company": "Test Company",
        "email": "testlead@example.com",
        "phone": "9876543210",
        "industry": "Technology",
        "source": "Website",
        "status": "New",
    }

    with TestClient(app) as client:
        response = client.post("/api/leads/", json=payload)

        assert response.status_code == 201

        data = response.json()

        assert data["name"] == "Test Lead"
        assert data["company"] == "Test Company"
        assert data["email"] == "testlead@example.com"
        assert data["phone"] == "9876543210"
        assert data["industry"] == "Technology"
        assert data["source"] == "Website"
        assert data["status"] == "New"
        assert "id" in data


def test_get_leads():
    with TestClient(app) as client:
        response = client.get("/api/leads/")

        assert response.status_code == 200
        assert isinstance(response.json(), list)


def test_get_lead_by_id():
    payload = {
        "name": "Get Test Lead",
        "company": "Get Test Company",
        "email": "getlead@example.com",
        "phone": "9876543211",
    }

    with TestClient(app) as client:
        create_response = client.post(
            "/api/leads/",
            json=payload,
        )

        assert create_response.status_code == 201

        lead_id = create_response.json()["id"]

        response = client.get(f"/api/leads/{lead_id}")

        assert response.status_code == 200

        data = response.json()

        assert data["id"] == lead_id
        assert data["name"] == "Get Test Lead"


def test_get_lead_invalid_id():
    with TestClient(app) as client:
        response = client.get("/api/leads/invalid-id")

        assert response.status_code == 400


def test_get_lead_not_found():
    fake_id = "000000000000000000000000"

    with TestClient(app) as client:
        response = client.get(f"/api/leads/{fake_id}")

        assert response.status_code == 404


def test_update_lead():
    payload = {
        "name": "Update Test Lead",
        "company": "Old Company",
        "email": "updatelead@example.com",
        "phone": "9876543212",
        "industry": "Technology",
    }

    with TestClient(app) as client:
        create_response = client.post(
            "/api/leads/",
            json=payload,
        )

        assert create_response.status_code == 201

        lead_id = create_response.json()["id"]

        update_response = client.patch(
            f"/api/leads/{lead_id}",
            json={
                "company": "New Company",
                "status": "Qualified",
                "phone": None,
                "industry": "Healthcare",
            },
        )

        assert update_response.status_code == 200

        data = update_response.json()

        assert data["id"] == lead_id
        assert data["company"] == "New Company"
        assert data["status"] == "Qualified"
        assert data["phone"] is None
        assert data["industry"] == "Healthcare"

        clear_industry_response = client.patch(
            f"/api/leads/{lead_id}",
            json={"industry": None},
        )

        assert clear_industry_response.status_code == 200
        assert clear_industry_response.json()["industry"] is None


def test_delete_lead():
    payload = {
        "name": "Delete Test Lead",
        "company": "Delete Company",
        "email": "deletelead@example.com",
    }

    with TestClient(app) as client:
        create_response = client.post(
            "/api/leads/",
            json=payload,
        )

        assert create_response.status_code == 201

        lead_id = create_response.json()["id"]

        delete_response = client.delete(
            f"/api/leads/{lead_id}"
        )

        assert delete_response.status_code == 204

        get_response = client.get(
            f"/api/leads/{lead_id}"
        )

        assert get_response.status_code == 404