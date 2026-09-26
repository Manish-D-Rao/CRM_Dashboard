from fastapi.testclient import TestClient

from app.main import app


def test_get_deals():
    with TestClient(app) as client:
        response = client.get("/api/deals/")

        assert response.status_code == 200

        data = response.json()

        assert isinstance(data, list)

def test_create_deal_invalid_probability():
    payload = {
        "title": "Invalid Deal",
        "customer_id": "000000000000000000000000",
        "value": 100000,
        "stage": "Lead",
        "probability": 150
    }

    with TestClient(app) as client:
        response = client.post("/api/deals/", json=payload)

        assert response.status_code == 422

def test_create_deal_negative_value():
    payload = {
        "title": "Invalid Deal",
        "customer_id": "000000000000000000000000",
        "value": -50000,
        "stage": "Lead",
        "probability": 10
    }

    with TestClient(app) as client:
        response = client.post("/api/deals/", json=payload)

        assert response.status_code == 422

def test_create_deal_invalid_stage():
    payload = {
        "title": "Invalid Stage",
        "customer_id": "000000000000000000000000",
        "value": 100000,
        "stage": "Banana",
        "probability": 20
    }

    with TestClient(app) as client:
        response = client.post("/api/deals/", json=payload)

        assert response.status_code == 422

def test_create_deal():
    payload = {
        "title": "Test Enterprise Deal",
        "customer_id": "000000000000000000000000",
        "value": 250000,
        "stage": "Qualified",
        "probability": 40,
    }

    with TestClient(app) as client:
        response = client.post("/api/deals/", json=payload)

        assert response.status_code == 201

        data = response.json()

        assert data["title"] == "Test Enterprise Deal"
        assert data["value"] == 250000
        assert data["stage"] == "Qualified"
        assert data["probability"] == 40
        assert "id" in data

def test_get_deal():
    payload = {
        "title": "Single Deal Test",
        "customer_id": "000000000000000000000000",
        "value": 100000,
        "stage": "Qualified",
        "probability": 40,
    }

    with TestClient(app) as client:
        create_response = client.post("/api/deals/", json=payload)

        assert create_response.status_code == 201

        deal_id = create_response.json()["id"]

        response = client.get(f"/api/deals/{deal_id}")

        assert response.status_code == 200

        data = response.json()

        assert data["id"] == deal_id
        assert data["title"] == "Single Deal Test"
        assert data["value"] == 100000

def test_get_deal_invalid_id():
    with TestClient(app) as client:
        response = client.get("/api/deals/abc")

        assert response.status_code == 400
        assert response.json()["detail"] == "Invalid deal ID"

def test_get_deal_not_found():
    with TestClient(app) as client:
        response = client.get(
            "/api/deals/000000000000000000000000"
        )

        assert response.status_code == 404
        assert response.json()["detail"] == "Deal not found"

def test_get_deal_by_id():
    payload = {
        "title": "Get Test Deal",
        "customer_id": "000000000000000000000000",
        "value": 100000,
        "stage": "Lead",
        "probability": 10,
    }

    with TestClient(app) as client:
        create_response = client.post("/api/deals/", json=payload)

        assert create_response.status_code == 201

        deal_id = create_response.json()["id"]

        response = client.get(f"/api/deals/{deal_id}")

        assert response.status_code == 200

        data = response.json()

        assert data["id"] == deal_id
        assert data["title"] == "Get Test Deal"

def test_update_deal():
    payload = {
        "title": "Update Test Deal",
        "customer_id": "000000000000000000000000",
        "value": 100000,
        "stage": "Lead",
        "probability": 10,
    }

    with TestClient(app) as client:
        create_response = client.post("/api/deals/", json=payload)

        assert create_response.status_code == 201

        deal_id = create_response.json()["id"]

        update_response = client.put(
            f"/api/deals/{deal_id}",
            json={
                "stage": "Negotiation",
                "probability": 70,
                "value": 250000,
            },
        )

        assert update_response.status_code == 200

        data = update_response.json()

        assert data["id"] == deal_id
        assert data["stage"] == "Negotiation"
        assert data["probability"] == 70
        assert data["value"] == 250000

def test_delete_deal():
    payload = {
        "title": "Delete Test Deal",
        "customer_id": "000000000000000000000000",
        "value": 50000,
        "stage": "Lead",
        "probability": 10,
    }

    with TestClient(app) as client:
        create_response = client.post("/api/deals/", json=payload)

        assert create_response.status_code == 201

        deal_id = create_response.json()["id"]

        delete_response = client.delete(
            f"/api/deals/{deal_id}"
        )

        assert delete_response.status_code == 204

        get_response = client.get(
            f"/api/deals/{deal_id}"
        )

        assert get_response.status_code == 404