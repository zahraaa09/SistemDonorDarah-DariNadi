from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    blood_type: str
    id_location: int
    is_available: bool = True

# Digunakan saat registrasi (butuh password)
class UserCreate(UserBase):
    password: str

# Digunakan saat mengembalikan data user (password disembunyikan demi keamanan)
class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True
        
        
# Tambahkan ini di bagian bawah file app/schemas/user.py

class LocationBase(BaseModel):
    name: str

class LocationCreate(LocationBase):
    pass

class LocationResponse(LocationBase):
    id: int

    class Config:
        from_attributes = True  # Supaya Pydantic bisa membaca objek dari SQLAlchemy