from sqlalchemy.orm import Session
from app.models.request_response import RequestResponse
from app.models.donor_request import DonorRequest
from app.models.user import User
from app.schemas.request_response import RequestResponseCreate

def check_duplicate_response(db: Session, request_id: int, user_id: int) -> bool:
    exists = db.query(RequestResponse).filter(
        RequestResponse.id_request == request_id,
        RequestResponse.id_user == user_id
    ).first()
    return exists is not None

def create_response(db: Session, response_data: RequestResponseCreate, user_id: int):
    # Validasi ganda: cek duplikasi
    if check_duplicate_response(db, response_data.id_request, user_id):
        return None 
        
    db_response = RequestResponse(
        id_request=response_data.id_request,
        id_user=user_id,
        status="pending"
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response

def get_my_responses(db: Session, user_id: int):
    return db.query(RequestResponse).filter(RequestResponse.id_user == user_id).all()


# --- FITUR TAMBAHAN 1: LIHAT DAFTAR RESPONS (Berdasarkan ID Request) ---
# Diperlukan di frontend supaya pembuat request bisa memunculkan list nama pendonor
def get_responses_by_request(db: Session, request_id: int):
    return db.query(RequestResponse).filter(RequestResponse.id_request == request_id).all()


# --- FITUR TAMBAHAN 2: UPDATE STATUS (CUMA TERIMA / TOLAK) ---
def update_response_status(db: Session, response_id: int, choice: str, current_user_id: int):
    # Cari data responsnya
    db_response = db.query(RequestResponse).filter(RequestResponse.id == response_id).first()
    if not db_response:
        return {"error": "Data respons tidak ditemukan"}
        
    # Validasi: Pastikan yang klik terima/tolak adalah orang yang membuat DonorRequest tersebut
    donor_request = db.query(DonorRequest).filter(DonorRequest.id == db_response.id_request).first()
    if donor_request.id_user != current_user_id:
        return {"error": "Anda tidak berhak mengubah status respons ini"}
        
    # Set status hanya ke 'accepted' atau 'rejected' sesuai input dari frontend
    if choice == "accept":
        db_response.status = "accepted"
    elif choice == "reject":
        db_response.status = "rejected"
    else:
        return {"error": "Pilihan tidak valid. Gunakan 'accept' atau 'reject'"}
        
    db.commit()
    db.refresh(db_response)
    return db_response