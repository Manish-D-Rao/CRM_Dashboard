from bson import ObjectId
from fastapi import HTTPException, status

from ..database import get_database
from ..models.customer import (
    CustomerCreate,
    CustomerUpdate,
)


COLLECTION_NAME = "customers"


async def create_customer(customer: CustomerCreate):
    db = get_database()

    result = await db[COLLECTION_NAME].insert_one(
        customer.model_dump()
    )

    return await db[COLLECTION_NAME].find_one(
        {"_id": result.inserted_id}
    )


async def get_customers():
    db = get_database()

    return await (
        db[COLLECTION_NAME]
        .find()
        .sort("_id", -1)
        .to_list(length=100)
    )


async def get_customer(customer_id: str):
    db = get_database()

    if not ObjectId.is_valid(customer_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid customer ID",
        )

    customer = await db[COLLECTION_NAME].find_one(
        {"_id": ObjectId(customer_id)}
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return customer


async def update_customer(
    customer_id: str,
    customer: CustomerUpdate,
):
    db = get_database()

    if not ObjectId.is_valid(customer_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid customer ID",
        )

    update_data = customer.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update",
        )

    result = await db[COLLECTION_NAME].update_one(
        {"_id": ObjectId(customer_id)},
        {"$set": update_data},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return await get_customer(customer_id)


async def delete_customer(customer_id: str):
    db = get_database()

    if not ObjectId.is_valid(customer_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid customer ID",
        )

    result = await db[COLLECTION_NAME].delete_one(
        {"_id": ObjectId(customer_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )