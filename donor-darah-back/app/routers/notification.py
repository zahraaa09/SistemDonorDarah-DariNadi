from fastapi import APIRouter, Depends, status
from sqlalchemy import desc
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.notification import NotificationResponse, NotificationCreate
from app.crud import notification as notification_crud
from app import models

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/user/{user_id}", response_model=list[NotificationResponse])
def list_notifications(user_id: int, db: Session = Depends(get_db)):
    """Mengambil semua notifikasi pengguna berdasarkan waktu terbaru."""
    return notification_crud.get_user_notifications(db=db, user_id=user_id)

@router.post("/mark-all-read")
def mark_all_read(user_id: int, db: Session = Depends(get_db)):
    """Menandai semua notifikasi yang belum dibaca sebagai dibaca."""
    notifications = db.query(models.Notification).filter(models.Notification.id_user == user_id, models.Notification.is_read == False).all()
    updated_count = 0
    for note in notifications:
        note.is_read = True
        updated_count += 1
    db.commit()
    return {"message": "Semua notifikasi ditandai sebagai dibaca", "updated": updated_count}


@router.post("/create", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(payload: NotificationCreate, db: Session = Depends(get_db)):
    """Buat notifikasi baru (digunakan oleh server untuk mengirim pemberitahuan ke user)."""
    note = notification_crud.create_notification(db=db, notification_data=payload)
    return note
