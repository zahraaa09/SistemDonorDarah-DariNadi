from sqlalchemy.orm import Session
from sqlalchemy import text # Diimpor untuk persiapan jika ingin menggunakan fitur rumus Haversine nanti
from app.models import Location  
from app.models.user import User
from app.models.hospital import Hospital  
from app.schemas.location import LocationCreate
from app.schemas.hospital import HospitalCreate

def create_location(db: Session, location: LocationCreate):
    db_location = Location(name=location.name)
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location

def get_all_locations(db: Session):
    return db.query(Location).all()

def delete_location(db: Session, location_id: int):
    db_location = db.query(Location).filter(Location.id == location_id).first()
    if db_location:
        db.delete(db_location)
        db.commit()
        return True
    return False

def create_hospital(db: Session, hospital: HospitalCreate):
    db_hospital = Hospital(
        name=hospital.name,
        address=hospital.address, 
        id_location=hospital.id_location,
        latitude=hospital.latitude,
        longitude=hospital.longitude
    )
    db.add(db_hospital)
    db.commit()
    db.refresh(db_hospital)
    return db_hospital

def get_all_hospitals(db: Session):
    return db.query(Hospital).all()

def get_hospitals_by_location(db: Session, location_id: int):
    return db.query(Hospital).filter(Hospital.id_location == location_id).all()

def delete_hospital(db: Session, hospital_id: int):
    db_hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if db_hospital:
        db.delete(db_hospital)
        db.commit()
        return True
    return False

def get_all_users(db: Session, skip: int = 0, limit: int = 100, available_only: bool = False):
    query = db.query(User)
    if available_only:
        query = query.filter(User.is_available == True)
    return query.offset(skip).limit(limit).all()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False