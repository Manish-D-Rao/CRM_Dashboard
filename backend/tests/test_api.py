from fastapi.testclient import TestClient

from app.main import app


def test_cors_allows_vite_fallback_port():
    with TestClient(app) as client:
        response = client.options(
            "/api/leads/",
            headers={
                "Origin": "http://localhost:5174",
                "Access-Control-Request-Method": "GET",
            },
        )

        assert response.status_code == 200
        assert response.headers["access-control-allow-origin"] == "http://localhost:5174"


def create_test_customer(client):
    response = client.post(
        "/api/customers/",
        json={
            "name": "Deal Test Customer",
            "company": "Deal Test Company",
            "email": "deal-test@example.com",
        },
    )
    assert response.status_code == 201
    return response.json()["id"]


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
        "value": 250000,
        "stage": "Qualified",
        "probability": 40,
    }

    with TestClient(app) as client:
        customer_id = create_test_customer(client)
        payload["customer_id"] = customer_id
        response = client.post("/api/deals/", json=payload)

        assert response.status_code == 201

        data = response.json()

        assert data["title"] == "Test Enterprise Deal"
        assert data["value"] == 250000
        assert data["stage"] == "Qualified"
        assert data["probability"] == 40
        assert data["customer_id"] == customer_id
        assert "id" in data


def test_customer_can_have_multiple_deals():
    with TestClient(app) as client:
        customer_id = create_test_customer(client)
        deal_ids = []

        for title in ("First Customer Deal", "Second Customer Deal"):
            response = client.post(
                "/api/deals/",
                json={
                    "title": title,
                    "customer_id": customer_id,
                    "value": 100000,
                    "stage": "Lead",
                    "probability": 10,
                },
            )

            assert response.status_code == 201
            data = response.json()
            assert data["customer_id"] == customer_id
            deal_ids.append(data["id"])

        assert deal_ids[0] != deal_ids[1]


def test_create_deal_requires_existing_customer():
    payload = {
        "title": "Orphan Deal",
        "customer_id": "000000000000000000000000",
        "value": 100000,
        "stage": "Lead",
        "probability": 10,
    }

    with TestClient(app) as client:
        response = client.post("/api/deals/", json=payload)

        assert response.status_code == 404
        assert response.json()["detail"] == "Customer not found"

def test_get_deal():
    payload = {
        "title": "Single Deal Test",
        "value": 100000,
        "stage": "Qualified",
        "probability": 40,
    }

    with TestClient(app) as client:
        payload["customer_id"] = create_test_customer(client)
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
        "value": 100000,
        "stage": "Lead",
        "probability": 10,
    }

    with TestClient(app) as client:
        payload["customer_id"] = create_test_customer(client)
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
        "expected_close_date": "2026-12-15",
        "owner": "Sales representative",
        "value": 100000,
        "stage": "Lead",
        "probability": 10,
    }

    with TestClient(app) as client:
        payload["customer_id"] = create_test_customer(client)
        create_response = client.post("/api/deals/", json=payload)

        assert create_response.status_code == 201

        deal_id = create_response.json()["id"]

        update_response = client.patch(
            f"/api/deals/{deal_id}",
            json={
                "stage": "Negotiation",
                "probability": 70,
                "value": 250000,
                "expected_close_date": None,
                "owner": None,
            },
        )

        assert update_response.status_code == 200

        data = update_response.json()

        assert data["id"] == deal_id
        assert data["stage"] == "Negotiation"
        assert data["probability"] == 70
        assert data["value"] == 250000
        assert data["expected_close_date"] is None
        assert data["owner"] is None

def test_delete_deal():
    payload = {
        "title": "Delete Test Deal",
        "value": 50000,
        "stage": "Lead",
        "probability": 10,
    }

    with TestClient(app) as client:
        payload["customer_id"] = create_test_customer(client)
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