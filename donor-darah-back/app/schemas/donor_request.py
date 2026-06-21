from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class HospitalMinResponse(BaseModel):
    id: int
    name: str
    address: str

    class Config:
        from_attributes = True

class UserMinResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    blood_type: str

    class Config:
        from_attributes = True

class RequestResponseMin(BaseModel):
    id: int
    id_user: int
    status: str
    user: Optional[UserMinResponse] = None

    class Config:
        from_attributes = True

class DonorRequestBase(BaseModel):
    id_hospital: int
    patient_name: str
    blood_type: str
    quantity: int
    contact_phone: str
    status: str = "pending"
    urgency: Optional[str] = None
    is_manual: bool = True

class DonorRequestCreate(DonorRequestBase):
    id_user: int
    id_donor: Optional[int] = None 

class DonorRequestResponse(DonorRequestBase):
    id: int
    id_user: int
    created_at: datetime
    hospital: Optional[HospitalMinResponse] = None 
    user: Optional[UserMinResponse] = None
    responses: Optional[list[RequestResponseMin]] = []

    class Config:
        from_attributes = True

class DonorRequestUpdate(BaseModel):
    id_hospital: int
    patient_name: str
    blood_type: str
    quantity: int
    contact_phone: str
    urgency: Optional[str] = "Siaga"
    
class DirectRequestSchema(BaseModel):
    id_user: int
    id_donor: int
    id_request: int
    blood_type: str

class RespondRequestSchema(BaseModel):
    request_id: int
    donor_id: int