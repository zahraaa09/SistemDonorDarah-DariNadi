from pydantic import BaseModel
from datetime import datetime

class DonationBase(BaseModel):
    id_donor: int
    id_request: int
    status: str = "completed"

class DonationCreate(DonationBase):
    pass

class DonationResponse(DonationBase):
    id: int
    donation_date: datetime

    class Config:
        from_attributes = True