from sqlalchemy.orm import Session
from app.models.hospital import Hospital

def get_hospitals_by_location(db: Session, location_id: int):
    return db.query(Hospital).filter(Hospital.id_location == location_id).all()

def get_nearest_hospital(db: Session, user_lat: float, user_lon: float):
    hospitals = db.query(Hospital).all()
    nearest = min(hospitals, key=lambda h: (h.lat - user_lat)**2 + (h.lon - user_lon)**2)
    return nearest