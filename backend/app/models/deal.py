from datetime import date
from typing import Annotated

from bson import ObjectId
from pydantic import (
    BaseModel,
    BeforeValidator,
    ConfigDict,
    Field,
    field_validator,
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

    @field_validator("stage")
    @classmethod
    def validate_stage(cls, value: str) -> str:
        if value not in DEAL_STAGES:
            raise ValueError(
                f"Invalid stage. Must be one of: {', '.join(DEAL_STAGES)}"
            )
        return value

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

    @field_validator("stage")
    @classmethod
    def validate_stage(cls, value: str | None) -> str | None:
        if value is not None and value not in DEAL_STAGES:
            raise ValueError(
                f"Invalid stage. Must be one of: {', '.join(DEAL_STAGES)}"
            )
        return value


class DealResponse(BaseModel):
    id: PyObjectId

    title: str
    customer_id: PyObjectId
    company: str | None = None

    value: float
    stage: str
    probability: int
    expected_close_date: date | None = None
    owner: str | None = None