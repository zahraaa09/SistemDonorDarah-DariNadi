from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    id_donor = Column(Integer, ForeignKey("users.id"), nullable=False)
    id_request = Column(Integer, ForeignKey("donor_request.id"), nullable=False)
    status = Column(String, default="completed")
    donation_date = Column(DateTime(timezone=True), server_default=func.now())

    # Relasi
    donor = relationship("User", back_populates="donations")
    donor_request = relationship("DonorRequest", back_populates="donations")