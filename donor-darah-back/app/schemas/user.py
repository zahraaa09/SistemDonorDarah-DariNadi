from pydantic import BaseModel, EmailStr
from typing import Optional, Union, Any
from datetime import date

class LocationBase(BaseModel):
    name: str

class LocationCreate(LocationBase):
    pass

class LocationResponse(LocationBase):
    id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    blood_type: str
    id_location: int
    is_available: bool = True
    dob: Optional[Union[str, date, None]] = None
    gender: Optional[str] = None
    weight: Optional[Union[str, int, float, None]] = None
    address: Optional[str] = None
    email_notify: Optional[bool] = None
    wa_notify: Optional[bool] = None
    public_profile: Optional[bool] = None

    class Config:
        from_attributes = True
        extra = "ignore"

class UserCreate(UserBase):
    password: str

class UserResetPasswordRequest(BaseModel):
    email: EmailStr

class UserResetPasswordConfirm(BaseModel):
    token: str
    new_password: str

class UserResponse(UserBase):
    id: int
    location: Optional[LocationResponse] = None

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    blood_type: Optional[str] = None
    id_location: Optional[int] = None
    is_available: Optional[bool] = None
    dob: Optional[Union[str, date, None]] = None
    gender: Optional[str] = None
    weight: Optional[Union[str, int, float, None]] = None
    address: Optional[str] = None
    email_notify: Optional[bool] = None
    wa_notify: Optional[bool] = None
    public_profile: Optional[bool] = None

    class Config:
        from_attributes = True 
