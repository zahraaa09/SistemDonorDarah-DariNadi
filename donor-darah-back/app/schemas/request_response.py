from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# 1. Skema Dasar untuk Respon
class RequestResponseBase(BaseModel):
    id_request: int
    status: str = "pending" 

class RequestResponseCreate(RequestResponseBase):
    pass

class UserMinResponse(BaseModel):
    id: int
    name: str
    blood_type: str
    phone: str

    class Config:
        from_attributes = True

class RequestResponseResponse(RequestResponseBase):
    id: int
    id_user: int
    user: Optional[UserMinResponse] = None 

    class Config:
        from_attributes = True