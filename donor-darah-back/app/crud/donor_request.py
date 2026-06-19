from sqlalchemy.orm import Session, joinedload
from app.models.donor_request import DonorRequest
from app.models.user import User
from app.schemas.donor_request import DonorRequestCreate, DonorRequestUpdate
from app.models import Hospital
# Tambahkan ini di paling atas file
from sqlalchemy import func

def create_donor_request(db: Session, request_data: DonorRequestCreate, current_user_id: int):
    target_hospital_id = request_data.id_hospital

    # LOGIKA OTOMATIS: Jika id_hospital == 0, cari yang terdekat
    if target_hospital_id == 0:
        # Kita asumsikan user punya koordinat di profil atau request_data
        # Ganti user_lat/lon dengan data lokasi user saat ini
        user_lat = -5.1477 # Contoh: Latitude Makassar
        user_lon = 119.4327 # Contoh: Longitude Makassar
        
        # Mencari rumah sakit dengan jarak terdekat menggunakan SQL (Power of 2)
        nearest_hospital = db.query(Hospital).order_by(
            func.pow(Hospital.latitude - user_lat, 2) + 
            func.pow(Hospital.longitude - user_lon, 2)
        ).first()
        
        if nearest_hospital:
            target_hospital_id = nearest_hospital.id
        else:
            # Fallback jika tidak ada rumah sakit di DB
            target_hospital_id = 1 

    db_request = DonorRequest(
        id_user=current_user_id,
        id_hospital=target_hospital_id, # Menggunakan ID yang sudah dipastikan valid
        patient_name=request_data.patient_name,
        blood_type=request_data.blood_type,
        quantity=request_data.quantity,
        contact_phone=request_data.contact_phone,
        status="pending"
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request
def get_my_requests(db: Session, user_id: int):
    """
    Mengambil data permintaan milik user tertentu lengkap dengan objek rumah sakit
    """
    return db.query(DonorRequest)\
             .options(joinedload(DonorRequest.hospital))\
             .filter(DonorRequest.id_user == user_id)\
             .order_by(DonorRequest.id.desc())\
             .all()

def get_open_requests(db: Session):
    # ✅ Tambahkan joinedload juga di sini agar halaman publik luar ikut menampilkan nama RS asli
    return db.query(DonorRequest).options(joinedload(DonorRequest.hospital)).filter(DonorRequest.status == "pending").all()

def get_request_by_id(db: Session, request_id: int):
    return db.query(DonorRequest).options(joinedload(DonorRequest.hospital)).filter(DonorRequest.id == request_id).first()

def close_donor_request(db: Session, request_id: int, user_id: int):
    db_request = db.query(DonorRequest).filter(DonorRequest.id == request_id, DonorRequest.id_user == user_id).first()
    if db_request:
        db_request.status = "closed"
        db.commit()
        db.refresh(db_request)
    return db_request

def get_matching_donors(db: Session, blood_type: str, location_id: int):
    return db.query(User).filter(
        User.blood_type == blood_type,
        User.id_location == location_id,
        User.is_available == True
    ).all()

def delete_donor_request(db: Session, request_id: int, user_id: int):
    db_request = db.query(DonorRequest).filter(
        DonorRequest.id == request_id, 
        DonorRequest.id_user == user_id
    ).first()
    if db_request:
        db.delete(db_request)
        db.commit()
        return True
    return False

def update_donor_request(db: Session, request_id: int, user_id: int, update_data: DonorRequestUpdate):
    db_request = db.query(DonorRequest).filter(
        DonorRequest.id == request_id,
        DonorRequest.id_user == user_id
    ).first()
    if db_request:
        for key, value in update_data.model_dump().items():
            setattr(db_request, key, value)
        db.commit()
        db.refresh(db_request)
        return db_request
    return None