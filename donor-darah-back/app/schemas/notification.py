from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationBase(BaseModel):
    id_user: int
    type: str
    title: str
    description: str
    request_id: Optional[int] = None
    is_read: bool = False

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True