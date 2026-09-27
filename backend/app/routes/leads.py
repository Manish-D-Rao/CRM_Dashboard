from fastapi import APIRouter, status

from ..models.lead import (
    LeadCreate,
    LeadResponse,
    LeadUpdate,
)
from ..services import lead_service
from ..models.customer import CustomerResponse


router = APIRouter(
    prefix="/leads",
    tags=["Leads"],
)


@router.post(
    "/",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_lead(lead: LeadCreate):
    result = await lead_service.create_lead(lead)

    print("ROUTE RESULT:", result)
    print("ROUTE RESULT KEYS:", result.keys())

    return result

@router.get(
    "/",
    response_model=list[LeadResponse],
)
async def list_leads():
    return await lead_service.get_leads()


@router.get(
    "/{lead_id}",
    response_model=LeadResponse,
)
async def get_lead(lead_id: str):
    return await lead_service.get_lead(lead_id)


@router.patch(
    "/{lead_id}",
    response_model=LeadResponse,
)
async def update_lead(
    lead_id: str,
    lead: LeadUpdate,
):
    return await lead_service.update_lead(
        lead_id,
        lead,
    )


@router.delete(
    "/{lead_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_lead(lead_id: str):
    await lead_service.delete_lead(lead_id)


@router.post(
    "/{lead_id}/convert",
    response_model=CustomerResponse,
)
async def convert_lead(lead_id: str):
    return await lead_service.convert_lead(lead_id)