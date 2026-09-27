import os

from pymongo import MongoClient


# Always use the test database when running pytest
os.environ["DATABASE_NAME"] = "crm_test_db"


def pytest_sessionstart(session):
    from dotenv import load_dotenv

    load_dotenv(
        "/run/media/manish/D Drive/GAWC/crm_dashboard/backend/.env"
    )

    client = MongoClient(os.getenv("MONGODB_URL"))
    db = client["crm_test_db"]

    # Clean test collections before every pytest run
    db["customers"].delete_many({})
    db["leads"].delete_many({})
    db["deals"].delete_many({})

    client.close()