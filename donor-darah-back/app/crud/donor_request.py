import random
from sqlalchemy.orm import Session, joinedload
from app.models.donor_request import DonorRequest
from app.models.user import User
from app.models.request_response import RequestResponse
from app.schemas.donor_request import DonorRequestCreate, DonorRequestUpdate
from app.models import Hospital
from sqlalchemy import func

def create_donor_request(db: Session, request_data: DonorRequestCreate, current_user_id: int):
    target_hospital_id = request_data.id_hospital
    is_manual = getattr(request_data, "is_manual", True)
    patient_name = request_data.patient_name
    contact_phone = request_data.contact_phone
    if target_hospital_id == 0:
        is_manual = False
        user = db.query(User).filter(User.id == current_user_id).first()
        if user:
            patient_name = user.name
            contact_phone = user.phone
            if user.id_location:
                hospitals_in_area = db.query(Hospital).filter(Hospital.id_location == user.id_location).all()
                if hospitals_in_area:
                    nearest_hospital = random.choice(hospitals_in_area)
                    target_hospital_id = nearest_hospital.id
                else:
                    all_hospitals = db.query(Hospital).all()
                    if all_hospitals:
                        target_hospital_id = random.choice(all_hospitals).id
                    else:
                        target_hospital_id = 1
            else:
                target_hospital_id = 1
        else:
            target_hospital_id = 1

    db_request = DonorRequest(
        id_user=current_user_id,
        id_hospital=target_hospital_id, 
        patient_name=patient_name,
        blood_type=request_data.blood_type,
        quantity=request_data.quantity,
        contact_phone=contact_phone,
        status="pending",
        urgency=getattr(request_data, "urgency", "Siaga"),
        is_manual=is_manual
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def get_my_requests(db: Session, user_id: int):
    """
    Mengambil data permintaan milik user tertentu lengkap dengan objek rumah sakit,
    user pembuat request, dan respon dari pendonor
    """
    return db.query(DonorRequest)\
                .options(
                    joinedload(DonorRequest.hospital),
                    joinedload(DonorRequest.user),
                    joinedload(DonorRequest.responses).joinedload(RequestResponse.user)
                )\
                .filter(DonorRequest.id_user == user_id)\
                .order_by(DonorRequest.id.desc())\
                .all()

def get_open_requests(db: Session):
    return db.query(DonorRequest)\
                .options(
                    joinedload(DonorRequest.hospital),
                    joinedload(DonorRequest.user)
                )\
                .filter(DonorRequest.status == "pending", DonorRequest.is_manual == True)\
                .all()

def get_request_by_id(db: Session, request_id: int):
    return db.query(DonorRequest)\
                .options(
                    joinedload(DonorRequest.hospital),
                    joinedload(DonorRequest.user)
                )\
                .filter(DonorRequest.id == request_id)\
                .first()

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