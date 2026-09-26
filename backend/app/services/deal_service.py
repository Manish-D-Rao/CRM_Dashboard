from bson import ObjectId
from fastapi import HTTPException, status

from ..database import get_database
from ..models.deal import DealCreate, DealUpdate


COLLECTION_NAME = "deals"


async def create_deal(deal: DealCreate):
    db = get_database()

    result = await db[COLLECTION_NAME].insert_one(
        deal.model_dump()
    )

    created_deal = await db[COLLECTION_NAME].find_one(
        {"_id": result.inserted_id}
    )

    if created_deal is None:
        raise RuntimeError("Failed to retrieve created deal")

    created_deal["id"] = str(created_deal.pop("_id"))
    return created_deal


async def get_deals():
    db = get_database()

    deals = await db[COLLECTION_NAME].find().to_list(length=1000)

    for deal in deals:
        deal["id"] = str(deal.pop("_id"))

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

    update_data = deal.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update",
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