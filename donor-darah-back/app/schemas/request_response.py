from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# 1. Skema Dasar untuk Respon
class RequestResponseBase(BaseModel):
    id_request: int
    status: str = "pending"  # pending, accepted, rejected

# 2. Skema untuk membuat respon baru (saat User 1 undang User 2)
class RequestResponseCreate(RequestResponseBase):
    pass

# 3. Skema untuk menampilkan respon (dengan tambahan info User & Request)
# Kita tambahkan info pendonor agar User 1 tahu siapa yang merespon
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
    user: Optional[UserMinResponse] = None # Menambahkan detail user pendonor

    class Config:
        from_attributes = True