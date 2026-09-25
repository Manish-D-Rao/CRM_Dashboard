from datetime import date
from typing import Annotated

from bson import ObjectId
from pydantic import (
    BaseModel,
    BeforeValidator,
    ConfigDict,
    Field,
)


def validate_object_id(value: str | ObjectId) -> str:
    if isinstance(value, ObjectId):
        return str(value)

    if ObjectId.is_valid(value):
        return value

    raise ValueError("Invalid ObjectId")


PyObjectId = Annotated[str, BeforeValidator(validate_object_id)]


DEAL_STAGES = [
    "Lead",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost",
]


class DealCreate(BaseModel):
    title: str = Field(
        ...,
        min_length=3,
        max_length=100,
    )

    customer_id: PyObjectId

    value: float = Field(
        ...,
        ge=0,
    )

    stage: str = Field(
        default="Lead",
    )

    probability: int = Field(
        default=10,
        ge=0,
        le=100,
    )

    expected_close_date: date | None = None

    owner: str | None = None


class DealUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=100,
    )

    customer_id: PyObjectId | None = None

    value: float | None = Field(
        default=None,
        ge=0,
    )

    stage: str | None = None

    probability: int | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    expected_close_date: date | None = None

    owner: str | None = None


class DealResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")

    title: str
    customer_id: PyObjectId

    value: float
    stage: str
    probability: int

    expected_close_date: date | None = None

    owner: str | None = None

    model_config = ConfigDict(
        populate_by_name=True,
    )