from sqlalchemy import Column, Integer, String, ForeignKey, Float # 1. Import Float
from sqlalchemy.orm import relationship
from app.database import Base

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    id_location = Column(Integer, ForeignKey("locations.id"), nullable=False)
    latitude = Column(Float, nullable=False) 
    longitude = Column(Float, nullable=False)

    # Relasi
    location = relationship("Location", back_populates="hospitals")
    donor_requests = relationship("DonorRequest", back_populates="hospital")