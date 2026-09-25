from fastapi import APIRouter, status

from ..models.customer import (
    CustomerCreate,
    CustomerResponse,
    CustomerUpdate,
)
from ..services import customer_service


router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.post(
    "/",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_customer(customer: CustomerCreate):
    return await customer_service.create_customer(customer)


@router.get(
    "/",
    response_model=list[CustomerResponse],
)
async def list_customers():
    return await customer_service.get_customers()


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse,
)
async def get_customer(customer_id: str):
    return await customer_service.get_customer(customer_id)


@router.patch(
    "/{customer_id}",
    response_model=CustomerResponse,
)
async def update_customer(
    customer_id: str,
    customer: CustomerUpdate,
):
    return await customer_service.update_customer(
        customer_id,
        customer,
    )


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_customer(customer_id: str):
    await customer_service.delete_customer(customer_id)