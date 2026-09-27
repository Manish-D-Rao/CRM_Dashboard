from bson import ObjectId
from fastapi import HTTPException, status

from ..database import get_database
from ..models.lead import LeadCreate, LeadUpdate


COLLECTION_NAME = "leads"


async def create_lead(lead: LeadCreate):
    db = get_database()

    result = await db[COLLECTION_NAME].insert_one(
        lead.model_dump()
    )

    created_lead = await db[COLLECTION_NAME].find_one(
        {"_id": result.inserted_id}
    )

    if created_lead is None:
        raise RuntimeError("Failed to retrieve created lead")

    created_lead["id"] = str(created_lead.pop("_id"))
    print("LEAD SERVICE RETURN:", created_lead)
    return created_lead

async def get_leads():
    db = get_database()

    leads = await db[COLLECTION_NAME].find().to_list(length=1000)

    for lead in leads:
        lead["id"] = str(lead.pop("_id"))

    return leads


async def get_lead(lead_id: str):
    db = get_database()

    if not ObjectId.is_valid(lead_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid lead ID",
        )

    lead = await db[COLLECTION_NAME].find_one(
        {"_id": ObjectId(lead_id)}
    )

    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )

    lead["id"] = str(lead.pop("_id"))

    return lead


async def update_lead(
    lead_id: str,
    lead: LeadUpdate,
):
    db = get_database()

    if not ObjectId.is_valid(lead_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid lead ID",
        )

    update_data = lead.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update",
        )

    result = await db[COLLECTION_NAME].update_one(
        {"_id": ObjectId(lead_id)},
        {"$set": update_data},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )

    return await get_lead(lead_id)


async def delete_lead(lead_id: str):
    db = get_database()

    if not ObjectId.is_valid(lead_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid lead ID",
        )

    result = await db[COLLECTION_NAME].delete_one(
        {"_id": ObjectId(lead_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )

async def convert_lead(lead_id: str):
    db = get_database()

    if not ObjectId.is_valid(lead_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid lead ID",
        )

    lead = await db["leads"].find_one(
        {"_id": ObjectId(lead_id)}
    )

    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )

    if lead.get("status") == "Converted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lead is already converted",
        )

    customer = {
        "name": lead["name"],
        "company": lead["company"],
        "email": lead["email"],
        "phone": lead.get("phone"),
        "industry": None,
        "status": "Active",
    }

    customer_result = await db["customers"].insert_one(
        customer
    )

    customer_id = customer_result.inserted_id

    await db["leads"].update_one(
        {"_id": ObjectId(lead_id)},
        {
            "$set": {
                "status": "Converted",
                "converted_customer_id": customer_id,
            }
        },
    )

    return await db["customers"].find_one(
        {"_id": customer_id}
    )