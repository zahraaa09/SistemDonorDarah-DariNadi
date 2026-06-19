# app/models/request_response.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class RequestResponse(Base):
    __tablename__ = "request_responses"

    id = Column(Integer, primary_key=True, index=True)
    id_request = Column(Integer, ForeignKey("donor_request.id"), nullable=False)
    id_user = Column(Integer, ForeignKey("users.id"), nullable=False) # ID Pendonor
    # Status: 'pending', 'accepted', 'rejected'
    status = Column(String, default="pending") 

    # Relasi
    donor_request = relationship("DonorRequest", back_populates="responses")
    user = relationship("User", back_populates="request_responses")