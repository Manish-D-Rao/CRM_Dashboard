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


class CustomerCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    company: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    email: str = Field(
        ...,
        min_length=5,
        max_length=150,
    )

    phone: str | None = None

    industry: str | None = None

    status: str = Field(
        default="Active",
    )


class CustomerUpdate(BaseModel):
    name: str | None = None
    company: str | None = None
    email: str | None = None
    phone: str | None = None
    industry: str | None = None
    status: str | None = None


class CustomerResponse(BaseModel):
    id: PyObjectId

    name: str
    company: str
    email: str
    phone: str | None = None
    industry: str | None = None
    status: str

    model_config = ConfigDict(
        populate_by_name=True,
    )