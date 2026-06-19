from sqlalchemy.orm import Session
from app.models.donation import Donation
from app.schemas.donation import DonationCreate

def record_successful_donation(db: Session, donation_data: DonationCreate):
    db_donation = Donation(
        id_donor=donation_data.id_donor,
        id_request=donation_data.id_request,
        status="completed"
    )
    db.add(db_donation)
    
    from app.models.donor_request import DonorRequest
    req = db.query(DonorRequest).filter(DonorRequest.id == donation_data.id_request).first()
    if req:
        req.status = "completed"
        
    db.commit()
    db.refresh(db_donation)
    return db_donation