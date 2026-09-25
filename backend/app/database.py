import os

from dotenv import load_dotenv
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "crm_db")

if not MONGODB_URL:
    raise RuntimeError("MONGODB_URL is not configured")

client: AsyncMongoClient | None = None
db: AsyncDatabase | None = None


async def connect_to_mongo() -> None:
    global client, db

    client = AsyncMongoClient(MONGODB_URL)

    await client.admin.command("ping")

    db = client[DATABASE_NAME]

    print("Connected to MongoDB.")


async def close_mongo_connection() -> None:
    global client

    if client is not None:
        await client.close()
        client = None

    print("MongoDB connection closed.")


def get_database() -> AsyncDatabase:
    if db is None:
        raise RuntimeError("Database is not initialized")

    return db