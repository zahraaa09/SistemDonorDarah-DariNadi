from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    blood_type = Column(String, nullable=False)
    id_location = Column(Integer, ForeignKey("locations.id"), nullable=False)
    is_available = Column(Boolean, default=True)

    # Relasi
    location = relationship("Location", back_populates="users")
    donor_requests = relationship("DonorRequest", back_populates="user")
    request_responses = relationship("RequestResponse", back_populates="user")
    donations = relationship("Donation", back_populates="donor")