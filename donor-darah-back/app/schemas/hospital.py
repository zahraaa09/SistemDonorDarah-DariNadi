from pydantic import BaseModel

class HospitalBase(BaseModel):
    name: str
    address: str
    id_location: int

class HospitalCreate(HospitalBase):
    pass

class HospitalResponse(HospitalBase):
    id: int

    class Config:
        from_attributes = True