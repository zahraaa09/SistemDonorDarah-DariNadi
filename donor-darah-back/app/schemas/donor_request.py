from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class HospitalMinResponse(BaseModel):
    id: int
    name: str
    address: str

    class Config:
        from_attributes = True

class DonorRequestBase(BaseModel):
    id_hospital: int
    patient_name: str
    blood_type: str
    quantity: int
    contact_phone: str
    status: str = "pending"

class DonorRequestCreate(DonorRequestBase):
    id_user: int
    id_donor: Optional[int] = None # Penambahan agar backend bisa menangkap target pendonor

class DonorRequestResponse(DonorRequestBase):
    id: int
    id_user: int
    created_at: datetime
    hospital: Optional[HospitalMinResponse] = None 

    class Config:
        from_attributes = True

class DonorRequestUpdate(BaseModel):
    id_hospital: int
    patient_name: str
    blood_type: str
    quantity: int
    contact_phone: str
    
class DirectRequestSchema(BaseModel):
    id_user: int
    id_donor: int
    id_request: int
    blood_type: str