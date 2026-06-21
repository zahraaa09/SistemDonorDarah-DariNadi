from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate

def create_notification(db: Session, notification_data: NotificationCreate):
    payload = notification_data.dict(exclude_unset=True)
    note = Notification(**payload)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

def get_user_notifications(db: Session, user_id: int):
    return db.query(Notification).filter(Notification.id_user == user_id).order_by(Notification.created_at.desc()).all()
