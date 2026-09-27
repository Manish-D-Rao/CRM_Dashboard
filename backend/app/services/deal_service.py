from datetime import datetime, time

from bson import ObjectId
from fastapi import HTTPException, status

from ..database import get_database
from ..models.deal import DealCreate, DealUpdate


COLLECTION_NAME = "deals"


async def ensure_customer_exists(db, customer_id: str) -> None:
    customer = await db["customers"].find_one(
        {"_id": ObjectId(str(customer_id))}
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )


async def add_company_to_deal(db, deal):
    """Add company name from the related customer."""
    customer_id = deal.get("customer_id")

    if not customer_id:
        deal["company"] = None
        return deal

    try:
        customer_object_id = (
            customer_id
            if isinstance(customer_id, ObjectId)
            else ObjectId(str(customer_id))
        )

        customer = await db["customers"].find_one(
            {"_id": customer_object_id}
        )

        deal["company"] = (
            customer.get("company")
            if customer
            else None
        )

    except Exception:
        deal["company"] = None

    return deal


async def create_deal(deal: DealCreate):
    db = get_database()
    await ensure_customer_exists(db, deal.customer_id)

    deal_data = deal.model_dump()

    if deal_data.get("expected_close_date"):
        deal_data["expected_close_date"] = datetime.combine(
            deal_data["expected_close_date"],
            time.min,
        )

    result = await db[COLLECTION_NAME].insert_one(deal_data)

    created_deal = await db[COLLECTION_NAME].find_one(
        {"_id": result.inserted_id}
    )

    if created_deal is None:
        raise RuntimeError("Failed to retrieve created deal")

    created_deal["id"] = str(created_deal.pop("_id"))

    await add_company_to_deal(db, created_deal)

    return created_deal


async def get_deals():
    db = get_database()

    deals = await db[COLLECTION_NAME].find().to_list(length=1000)

    for deal in deals:
        deal["id"] = str(deal.pop("_id"))
        await add_company_to_deal(db, deal)

    return deals


async def get_deal(deal_id: str):
    db = get_database()

    if not ObjectId.is_valid(deal_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid deal ID",
        )

    deal = await db[COLLECTION_NAME].find_one(
        {"_id": ObjectId(deal_id)}
    )

    if deal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found",
        )

    deal["id"] = str(deal.pop("_id"))

    await add_company_to_deal(db, deal)

    return deal


async def update_deal(
    deal_id: str,
    deal: DealUpdate,
):
    db = get_database()

    if not ObjectId.is_valid(deal_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid deal ID",
        )

    if "customer_id" in deal.model_fields_set:
        if deal.customer_id is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="customer_id cannot be null",
            )
        await ensure_customer_exists(db, deal.customer_id)

    update_data = deal.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )
    for field in ("expected_close_date", "owner"):
        if field in deal.model_fields_set and getattr(deal, field) is None:
            update_data[field] = None

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update",
        )

    if update_data.get("expected_close_date"):
        update_data["expected_close_date"] = datetime.combine(
            update_data["expected_close_date"],
            time.min,
        )

    result = await db[COLLECTION_NAME].update_one(
        {"_id": ObjectId(deal_id)},
        {"$set": update_data},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found",
        )

    return await get_deal(deal_id)


async def delete_deal(deal_id: str):
    db = get_database()

    if not ObjectId.is_valid(deal_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid deal ID",
        )

    result = await db[COLLECTION_NAME].delete_one(
        {"_id": ObjectId(deal_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found",
        )

    return True