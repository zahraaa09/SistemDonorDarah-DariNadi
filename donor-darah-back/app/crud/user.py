from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from passlib.context import CryptContext
from datetime import datetime, timedelta
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except ValueError:
        return plain_password == hashed_password


def get_password_hash(password: str):
    return pwd_context.hash(password)


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate):
    db_user = User(
        name=user.name,
        email=user.email,
        password=get_password_hash(user.password),
        phone=user.phone,
        blood_type=user.blood_type,
        id_location=user.id_location,
        is_available=user.is_available
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_password_reset_token(db: Session, email: str):
    db_user = get_user_by_email(db, email=email)
    if not db_user:
        return None

    token = str(uuid.uuid4())
    db_user.reset_password_token = token
    db_user.reset_password_expires_at = datetime.utcnow() + timedelta(minutes=30)
    db.commit()
    db.refresh(db_user)
    return token


def reset_user_password(db: Session, token: str, new_password: str):
    db_user = db.query(User).filter(User.reset_password_token == token).first()
    if not db_user:
        return None, "Token tidak valid"
    if not db_user.reset_password_expires_at or datetime.utcnow() > db_user.reset_password_expires_at:
        return None, "Token reset password sudah kedaluwarsa"

    db_user.password = get_password_hash(new_password)
    db_user.reset_password_token = None
    db_user.reset_password_expires_at = None
    db.commit()
    db.refresh(db_user)
    return db_user, None


def update_user_profile(db: Session, user_id: int, update_data: dict):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    
    for key, value in update_data.items():
        if value == "":
            setattr(user, key, None)
            continue

        if key == "weight" and value is not None:
            try:
                setattr(user, key, int(value))
            except (ValueError, TypeError):
                setattr(user, key, value)
        elif key == "dob" and value is not None:
            from datetime import datetime, date
            if isinstance(value, (datetime, date)):
                setattr(user, key, value.isoformat())
            elif isinstance(value, str):
                parsed_date = None
                for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y"):
                    try:
                        parsed_date = datetime.strptime(value, fmt).date()
                        break
                    except ValueError:
                        continue
                if parsed_date:
                    setattr(user, key, parsed_date.isoformat())
                else:
                    setattr(user, key, value)
            else:
                setattr(user, key, value)
        else:
            setattr(user, key, value)

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise
    db.refresh(user)
    return user


def update_donor_status(db: Session, user_id: int, is_available: bool):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db_user.is_available = is_available
        db.commit()
        db.refresh(db_user)
    return db_user

