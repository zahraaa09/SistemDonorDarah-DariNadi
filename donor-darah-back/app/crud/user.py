from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(
        name=user.name,
        email=user.email,
        password=user.password,
        phone=user.phone,
        blood_type=user.blood_type,
        id_location=user.id_location,
        is_available=user.is_available
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_profile(db: Session, user_id: int, update_data: dict):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        if "password" in update_data and update_data["password"]:
            update_data["password"] = pwd_context.hash(update_data["password"])
        for key, value in update_data.items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def update_donor_status(db: Session, user_id: int, is_available: bool):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db_user.is_available = is_available
        db.commit()
        db.refresh(db_user)
    return db_user

