from fastapi import APIRouter, status

from ..models.deal import (
    DealCreate,
    DealResponse,
    DealUpdate,
)
from ..services import deal_service


router = APIRouter(
    prefix="/deals",
    tags=["Deals"],
)


@router.post(
    "/",
    response_model=DealResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_deal(deal: DealCreate):
    return await deal_service.create_deal(deal)


@router.get(
    "/",
    response_model=list[DealResponse],
)
async def list_deals():
    return await deal_service.get_deals()


@router.get(
    "/{deal_id}",
    response_model=DealResponse,
)
async def get_deal(deal_id: str):
    return await deal_service.get_deal(deal_id)


@router.patch(
    "/{deal_id}",
    response_model=DealResponse,
)
async def update_deal(
    deal_id: str,
    deal: DealUpdate,
):
    return await deal_service.update_deal(
        deal_id,
        deal,
    )


@router.delete(
    "/{deal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_deal(deal_id: str):
    await deal_service.delete_deal(deal_id)

@router.put("/{deal_id}")
async def update_deal(
    deal_id: str,
    deal: DealUpdate,
):
    return await deal_service.update_deal(deal_id, deal)