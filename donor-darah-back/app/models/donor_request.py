from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class DonorRequest(Base):
    __tablename__ = "donor_request"

    id = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, ForeignKey("users.id"), nullable=False)
    id_hospital = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    patient_name = Column(String, nullable=False)
    blood_type = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    contact_phone = Column(String, nullable=False)
    status = Column(String, default="pending")
    urgency = Column(String, default="Siaga")  # Siaga / Darurat / Kritis
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_manual = Column(Boolean, default=True)

    # Relasi
    user = relationship("User", back_populates="donor_requests")
    hospital = relationship("Hospital", back_populates="donor_requests")
    responses = relationship("RequestResponse", back_populates="donor_request")
    donations = relationship("Donation", back_populates="donor_request")