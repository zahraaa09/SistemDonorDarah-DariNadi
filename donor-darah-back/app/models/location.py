from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    # Relasi
    hospitals = relationship("Hospital", back_populates="location")
    users = relationship("User", back_populates="location")