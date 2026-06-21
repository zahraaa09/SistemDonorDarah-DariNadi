from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.crud import user as user_crud

router = APIRouter(prefix="/users", tags=["Users / Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    return user_crud.create_user(db=db, user=user)

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Email atau password salah")
    
    return {
        "message": "Login berhasil", 
        "user_id": db_user.id, 
        "name": db_user.name,
        "blood_type": db_user.blood_type 
    }
    
@router.put("/{user_id}/profile", response_model=UserResponse)
def update_profile(user_id: int, name: str, phone: str, db: Session = Depends(get_db)):
    update_data = {"name": name, "phone": phone}
    updated = user_crud.update_user_profile(db, user_id=user_id, update_data=update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    return updated

@router.patch("/{user_id}/status")
def update_status(user_id: int, is_available: bool, db: Session = Depends(get_db)):
    updated = user_crud.update_donor_status(db, user_id=user_id, is_available=is_available)
    if not updated:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    return {"message": "Status donor berhasil diperbarui", "is_available": updated.is_available}

