from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.donor_request import DonorRequestCreate, DonorRequestResponse, DirectRequestSchema
from app.crud import donor_request as request_crud
from app import models

router = APIRouter(prefix="/donor-requests", tags=["Donor Requests"])

# =====================================================================
# RUTE STATIS (GET)
# =====================================================================

@router.get("/open", response_model=list[DonorRequestResponse])
def list_open_requests(db: Session = Depends(get_db)):
    """Mengambil semua permintaan donor yang statusnya masih 'pending'."""
    return request_crud.get_open_requests(db=db) or []

@router.get("/my-requests/{user_id}", response_model=list[DonorRequestResponse])
def list_my_requests(user_id: int, db: Session = Depends(get_db)):
    """User 1 melihat daftar permintaan yang dia buat."""
    return request_crud.get_my_requests(db=db, user_id=user_id)

@router.get("/my-responses/{user_id}")
def list_my_responses(user_id: int, db: Session = Depends(get_db)):
    """User 2 melihat daftar respon/undangan yang masuk ke dia."""
    return db.query(models.RequestResponse).filter(models.RequestResponse.id_user == user_id).all()

@router.get("/{request_id}/responses")
def get_request_responses(request_id: int, db: Session = Depends(get_db)):
    """User 1 melihat siapa saja yang sudah merespon permintaan miliknya."""
    return db.query(models.RequestResponse).filter(models.RequestResponse.id_request == request_id).all()

# =====================================================================
# RUTE DINAMIS (GET DETAIL)
# =====================================================================

@router.get("/{request_id}", response_model=DonorRequestResponse)
def get_detail_request(request_id: int, db: Session = Depends(get_db)):
    req = request_crud.get_request_by_id(db=db, request_id=request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Tidak ditemukan")
    return req

# =====================================================================
# RUTE ACTION (POST/PUT)
# =====================================================================

@router.post("/create", response_model=DonorRequestResponse, status_code=status.HTTP_201_CREATED)
def create_request(request_data: DonorRequestCreate, db: Session = Depends(get_db)):
    """
    User 1 membuat request. 
    Jika 'id_donor' disertakan, otomatis membuat entri di tabel RequestResponse.
    """
    # 1. Simpan Request utama melalui CRUD
    new_request = request_crud.create_donor_request(
        db=db, 
        request_data=request_data, 
        current_user_id=request_data.id_user
    )
    
    # 2. Otomatis buat entri di RequestResponse jika ada target pendonor (id_donor)
    if hasattr(request_data, 'id_donor') and request_data.id_donor:
        new_response = models.RequestResponse(
            id_request=new_request.id,
            id_user=request_data.id_donor,
            status="pending"
        )
        db.add(new_response)
        db.commit()
        
    return new_request

@router.post("/direct-request", status_code=status.HTTP_201_CREATED)
def send_direct_blood_request(payload: DirectRequestSchema, db: Session = Depends(get_db)):
    """User 1 mengirim permintaan personal ke User 2 (Pendonor)."""
    try:
        request = db.query(models.DonorRequest).filter(models.DonorRequest.id == payload.id_request).first()
        if not request:
            raise HTTPException(status_code=404, detail="Request tidak ditemukan")

        new_response = models.RequestResponse(
            id_request=payload.id_request,
            id_user=payload.id_donor,
            status="pending"
        )
        db.add(new_response)
        db.commit()
        return {"status": "success", "message": "Permintaan berhasil dikirim"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/response/{response_id}")
def update_response_status(response_id: int, status: str, db: Session = Depends(get_db)):
    """User 2 (Pendonor) memperbarui status respon (accepted/rejected)."""
    resp = db.query(models.RequestResponse).filter(models.RequestResponse.id == response_id).first()
    if not resp:
        raise HTTPException(status_code=404, detail="Undangan tidak ditemukan")

    resp.status = status
    
    # Sinkronisasi Database jika diterima
    if status == 'accepted':
        req = db.query(models.DonorRequest).filter(models.DonorRequest.id == resp.id_request).first()
        if req:
            req.status = 'TERPENUHI'
    
    db.commit()
    return {"message": f"Status telah diubah menjadi {status}"}