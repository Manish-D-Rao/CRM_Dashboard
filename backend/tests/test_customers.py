from fastapi.testclient import TestClient

from app.main import app


def test_create_customer():
    payload = {
        "name": "Test Customer",
        "email": "testcustomer@example.com",
        "company": "Test Company",
        "phone": "9876543210",
    }

    with TestClient(app) as client:
        response = client.post("/api/customers/", json=payload)

        assert response.status_code == 201

        data = response.json()

        assert data["name"] == "Test Customer"
        assert data["email"] == "testcustomer@example.com"
        assert data["company"] == "Test Company"
        assert data["phone"] == "9876543210"
        assert "id" in data


def test_get_customers():
    with TestClient(app) as client:
        response = client.get("/api/customers/")

        assert response.status_code == 200
        assert isinstance(response.json(), list)


def test_get_customer_by_id():
    payload = {
        "name": "Get Test Customer",
        "email": "gettest@example.com",
        "company": "Get Test Company",
        "phone": "9876543211",
    }

    with TestClient(app) as client:
        create_response = client.post(
            "/api/customers/",
            json=payload,
        )

        assert create_response.status_code == 201

        customer_id = create_response.json()["id"]

        response = client.get(
            f"/api/customers/{customer_id}"
        )

        assert response.status_code == 200

        data = response.json()

        assert data["id"] == customer_id
        assert data["name"] == "Get Test Customer"


def test_get_customer_invalid_id():
    with TestClient(app) as client:
        response = client.get(
            "/api/customers/invalid-id"
        )

        assert response.status_code == 400


def test_get_customer_not_found():
    fake_id = "000000000000000000000000"

    with TestClient(app) as client:
        response = client.get(
            f"/api/customers/{fake_id}"
        )

        assert response.status_code == 404


def test_update_customer():
    payload = {
        "name": "Update Test Customer",
        "email": "update@example.com",
        "company": "Old Company",
        "phone": "9876543212",
    }

    with TestClient(app) as client:
        create_response = client.post(
            "/api/customers/",
            json=payload,
        )

        assert create_response.status_code == 201

        customer_id = create_response.json()["id"]

        update_response = client.patch(
            f"/api/customers/{customer_id}",
            json={
                "company": "New Company",
                "phone": None,
                "industry": None,
            },
        )

        assert update_response.status_code == 200

        data = update_response.json()

        assert data["id"] == customer_id
        assert data["company"] == "New Company"
        assert data["name"] == "Update Test Customer"
        assert data["phone"] is None
        assert data["industry"] is None


def test_delete_customer():
    payload = {
        "name": "Delete Test Customer",
        "email": "delete@example.com",
        "company": "Delete Company",
        "phone": "9876543213",
    }

    with TestClient(app) as client:
        create_response = client.post(
            "/api/customers/",
            json=payload,
        )

        assert create_response.status_code == 201

        customer_id = create_response.json()["id"]

        delete_response = client.delete(
            f"/api/customers/{customer_id}"
        )

        assert delete_response.status_code == 204

        get_response = client.get(
            f"/api/customers/{customer_id}"
        )

        assert get_response.status_code == 404

