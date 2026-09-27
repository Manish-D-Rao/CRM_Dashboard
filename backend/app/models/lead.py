from typing import Annotated

from bson import ObjectId
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field


def validate_object_id(value: str | ObjectId) -> str:
    if isinstance(value, ObjectId):
        return str(value)

    if ObjectId.is_valid(value):
        return value

    raise ValueError("Invalid ObjectId")


PyObjectId = Annotated[str, BeforeValidator(validate_object_id)]


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    company: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    phone: str | None = None
    industry: str | None = None

    source: str = Field(default="Website")
    status: str = Field(default="New")


class LeadUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2)
    company: str | None = Field(default=None, min_length=2)
    email: str | None = Field(default=None, min_length=5)
    phone: str | None = None
    industry: str | None = None
    source: str | None = None
    status: str | None = None


class LeadResponse(BaseModel):
    id: PyObjectId
    name: str
    company: str
    email: str
    phone: str | None = None
    industry: str | None = None
    source: str
    status: str

    model_config = ConfigDict(
        populate_by_name=True,
    )