from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.schemas.donor_request import DonorRequestCreate, DonorRequestResponse, DirectRequestSchema, RespondRequestSchema
from app.crud import donor_request as request_crud
from app.crud import notification as notification_crud
from app.schemas.notification import NotificationCreate
from app import models

router = APIRouter(prefix="/donor-requests", tags=["Donor Requests"])

COMPATIBILITY_MATRIX = {
    "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    "O+": ["O+", "A+", "B+", "AB+"],
    "A-": ["A-", "A+", "AB-", "AB+"],
    "A+": ["A+", "AB+"],
    "B-": ["B-", "B+", "AB-", "AB+"],
    "B+": ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"],
}

def is_blood_compatible(donor_blood: str, patient_blood: str) -> bool:
    donor = donor_blood.strip().upper()
    patient = patient_blood.strip().upper()
    if donor in COMPATIBILITY_MATRIX:
        return patient in COMPATIBILITY_MATRIX[donor]
    return False

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
    """User 1 (Pendonor) melihat daftar respon/undangan yang masuk ke dia."""
    responses = db.query(models.RequestResponse)\
                    .options(
                        joinedload(models.RequestResponse.donor_request).joinedload(models.DonorRequest.hospital)
                    )\
                    .filter(models.RequestResponse.id_user == user_id).all()
    
    result = []
    for r in responses:
        req = r.donor_request
        result.append({
            "id": r.id,
            "id_request": r.id_request,
            "id_user": r.id_user,
            "status": r.status,
            # Untuk sinkronisasi HistoryPage (sorting & tampilkan tanggal)
            # Jika kolom created_at tidak ada di RequestResponse, frontend tetap fallback.
            "created_at": getattr(r, "created_at", None),
            "request": {
                "id": req.id,
                "blood_type": req.blood_type,
                "status": req.status,
                "created_at": getattr(req, "created_at", None),
                "hospital": {
                    "name": req.hospital.name if req.hospital else "Rumah Sakit"
                } if req.hospital else None
            } if req else None
        })
    return result

@router.get("/{request_id}/responses")
def get_request_responses(request_id: int, db: Session = Depends(get_db)):
    """User 1 melihat siapa saja yang sudah merespon permintaan miliknya."""
    return db.query(models.RequestResponse).filter(models.RequestResponse.id_request == request_id).all()

@router.get("/{request_id}", response_model=DonorRequestResponse)
def get_detail_request(request_id: int, db: Session = Depends(get_db)):
    req = request_crud.get_request_by_id(db=db, request_id=request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Tidak ditemukan")
    return req

@router.post("/create", response_model=DonorRequestResponse, status_code=status.HTTP_201_CREATED)
def create_request(request_data: DonorRequestCreate, db: Session = Depends(get_db)):
    """
    User 1 membuat request. 
    Jika 'id_donor' disertakan, otomatis membuat entri di tabel RequestResponse.
    """
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

        try:
            note = NotificationCreate(
                id_user=request_data.id_donor,
                type="DARURAT",
                title="Permintaan Darah Pribadi",
                description=f"Anda menerima permintaan donor terkait request #{new_request.id}",
                request_id=new_request.id,
            )
            notification_crud.create_notification(db=db, notification_data=note)
        except Exception:
            db.rollback()

    try:
        note_owner = NotificationCreate(
            id_user=request_data.id_user,
            type="INFORMASI",
            title="Permintaan Disimpan",
            description=f"Permintaan donor Anda #{new_request.id} berhasil dibuat",
            request_id=new_request.id,
        )
        notification_crud.create_notification(db=db, notification_data=note_owner)
    except Exception:
        db.rollback()

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
        try:
            note = NotificationCreate(
                id_user=payload.id_donor,
                type="DARURAT",
                title="Permintaan Darah Pribadi",
                description=f"Anda menerima permintaan donor terkait request #{payload.id_request}.",
                request_id=payload.id_request,
            )
            notification_crud.create_notification(db=db, notification_data=note)
        except Exception:
            db.rollback()
        return {"status": "success", "message": "Permintaan berhasil dikirim"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/respond")
def respond_request(payload: RespondRequestSchema, db: Session = Depends(get_db)):
    """Menanggapi permintaan dan mengubah statusnya menjadi terpenuhi (closed)."""
    req = db.query(models.DonorRequest).filter(models.DonorRequest.id == payload.request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Permintaan tidak ditemukan")
        
    donor = db.query(models.User).filter(models.User.id == payload.donor_id).first()
    if not donor:
        raise HTTPException(status_code=404, detail="Pendonor tidak ditemukan")

    if not is_blood_compatible(donor.blood_type, req.blood_type):
        raise HTTPException(status_code=400, detail=f"Golongan darah tidak cocok: {donor.blood_type} -> {req.blood_type}")
        
    existing_resp = db.query(models.RequestResponse).filter(
        models.RequestResponse.id_request == payload.request_id,
        models.RequestResponse.id_user == payload.donor_id
    ).first()
    
    if not existing_resp:
        new_resp = models.RequestResponse(
            id_request=payload.request_id,
            id_user=payload.donor_id,
            status="accepted"
        )
        db.add(new_resp)
    else:
        existing_resp.status = "accepted"
        
    req.status = "closed"

    # Record donation in donations table
    existing_donation = db.query(models.Donation).filter(
        models.Donation.id_donor == payload.donor_id,
        models.Donation.id_request == payload.request_id
    ).first()
    if not existing_donation:
        new_donation = models.Donation(
            id_donor=payload.donor_id,
            id_request=payload.request_id,
            status="completed"
        )
        db.add(new_donation)

    db.commit()
    return {"message": "Permintaan berhasil ditanggapi dan status diperbarui menjadi terpenuhi"}

@router.post("/{request_id}/close")
def close_request(request_id: int, user_id: int, db: Session = Depends(get_db)):
    """Menutup atau menandai permintaan sebagai terpenuhi oleh pemiliknya."""
    req = request_crud.close_donor_request(db=db, request_id=request_id, user_id=user_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request tidak ditemukan atau bukan milik Anda")
    return {"message": "Permintaan berhasil ditutup", "status": "closed"}

@router.put("/response/{response_id}")
def update_response_status(response_id: int, status: str, db: Session = Depends(get_db)):
    """User 2 (Pendonor) memperbarui status respon (accepted/rejected)."""
    resp = db.query(models.RequestResponse).filter(models.RequestResponse.id == response_id).first()
    if not resp:
        raise HTTPException(status_code=404, detail="Undangan tidak ditemukan")

    resp.status = status
    
    if status == 'accepted':
        req = db.query(models.DonorRequest).filter(models.DonorRequest.id == resp.id_request).first()
        if req:
            req.status = 'closed'
            
            # Record donation in donations table
            existing_donation = db.query(models.Donation).filter(
                models.Donation.id_donor == resp.id_user,
                models.Donation.id_request == resp.id_request
            ).first()
            if not existing_donation:
                new_donation = models.Donation(
                    id_donor=resp.id_user,
                    id_request=resp.id_request,
                    status="completed"
                )
                db.add(new_donation)

            try:
                note_owner = NotificationCreate(
                    id_user=req.id_user,
                    type="SUKSES",
                    title="Donor Diterima",
                    description=f"Permintaan Anda #{req.id} telah diterima oleh pendonor.",
                    request_id=req.id,
                )
                notification_crud.create_notification(db=db, notification_data=note_owner)
            except Exception:
                db.rollback()
    
    db.commit()
    return {"message": f"Status telah diubah menjadi {status}"}