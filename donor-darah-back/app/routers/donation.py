from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.donation import DonationCreate, DonationResponse
from app.crud import donation as donation_crud

router = APIRouter(prefix="/donations", tags=["Donations"])

@router.post("/", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
def record_donation(donation_data: DonationCreate, db: Session = Depends(get_db)):
    return donation_crud.record_successful_donation(db=db, donation_data=donation_data)