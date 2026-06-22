from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.donation import DonationCreate, DonationResponse
from app.crud import donation as donation_crud

router = APIRouter(prefix="/donations", tags=["Donations"])

@router.post("/", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
def record_donation(donation_data: DonationCreate, db: Session = Depends(get_db)):
    return donation_crud.record_successful_donation(db=db, donation_data=donation_data)

@router.get("/my-donations/{user_id}")
def get_my_donations(user_id: int, db: Session = Depends(get_db)):
    from app import models
    from sqlalchemy.orm import joinedload
    
    donations = db.query(models.Donation)\
                  .options(
                      joinedload(models.Donation.donor_request).joinedload(models.DonorRequest.hospital)
                  )\
                  .filter(models.Donation.id_donor == user_id).all()
                  
    result = []
    for d in donations:
        req = d.donor_request
        result.append({
            "id": d.id,
            "id_donor": d.id_donor,
            "id_request": d.id_request,
            "status": d.status,
            "donation_date": d.donation_date,
            "request": {
                "id": req.id,
                "blood_type": req.blood_type,
                "status": req.status,
                "hospital": {
                    "name": req.hospital.name if req.hospital else "Rumah Sakit"
                } if req.hospital else None
            } if req else None
        })
    return result