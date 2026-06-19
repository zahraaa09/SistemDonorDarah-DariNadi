from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db

# Impor skema pendukung
from app.schemas.location import LocationResponse, LocationCreate
from app.schemas.hospital import HospitalResponse, HospitalCreate 
from app.schemas.user import UserResponse 

# Sudah diperbaiki: Menggunakan satu CRUD pusat untuk panel kendali master
from app.crud import master as master_crud

router = APIRouter(prefix="/master", tags=["Master Controls"])


# =====================================================================
# 📍 CORE 1: MANAJEMEN LOKASI (COORDINATE INTEGRATED)
# =====================================================================

@router.post("/locations", response_model=LocationResponse, status_code=status.HTTP_201_CREATED)
def create_location(location: LocationCreate, db: Session = Depends(get_db)):
    # DIPERBAIKI: Mengubah loc_crud menjadi master_crud
    return master_crud.create_location(db=db, location=location)

@router.get("/locations", response_model=list[LocationResponse])
def get_locations(db: Session = Depends(get_db)):
    # DIPERBAIKI: Mengubah loc_crud menjadi master_crud
    return master_crud.get_all_locations(db=db)

@router.delete("/locations/{location_id}", status_code=status.HTTP_200_OK)
def remove_location(location_id: int, db: Session = Depends(get_db)):
    # DIPERBAIKI: Mengubah loc_crud menjadi master_crud
    success = master_crud.delete_location(db=db, location_id=location_id)
    if not success:
        raise HTTPException(status_code=404, detail="Lokasi tidak ditemukan atau gagal dihapus")
    return {"message": "Lokasi berhasil dihapus"}
# =====================================================================
# 🏥 CORE 2: MANAJEMEN RUMAH SAKIT & RADIUS JARAK
# =====================================================================

@router.post("/hospitals", response_model=HospitalResponse, status_code=status.HTTP_201_CREATED)
def create_hospital(hospital: HospitalCreate, db: Session = Depends(get_db)):
    return master_crud.create_hospital(db=db, hospital=hospital)

# 🚀 LOKASI TERDEKAT: Taruh di atas sebelum path parameter agar tidak tertukar
@router.get("/hospitals/nearby/search")
def get_hospitals_nearby(lat: float, lng: float, radius: float = 10.0, db: Session = Depends(get_db)):
    hospitals = master_crud.get_nearby_hospitals(db=db, user_lat=lat, user_lng=lng, max_radius_km=radius)
    return {"total_found": len(hospitals), "results": hospitals}

# ✅ SEKARANG DI SINI: Rute statis dipindah ke atas rute {location_id}
@router.get("/hospitals", response_model=list[HospitalResponse])
def get_all_hospitals(db: Session = Depends(get_db)):
    """
    Mengambil SELURUH daftar rumah sakit di database tanpa filter lokasi
    """
    return master_crud.get_all_hospitals(db=db)

# 📌 TARUH DI PALING BAWAH: Rute dinamis yang menggunakan kurung kurawal {}
@router.get("/hospitals/{location_id}", response_model=list[HospitalResponse])
def get_hospitals_by_location(location_id: int, db: Session = Depends(get_db)):
    return master_crud.get_hospitals_by_location(db=db, location_id=location_id)

@router.delete("/hospitals/{hospital_id}", status_code=status.HTTP_200_OK)
def remove_hospital(hospital_id: int, db: Session = Depends(get_db)):
    success = master_crud.delete_hospital(db=db, hospital_id=hospital_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rumah sakit tidak ditemukan")
    return {"message": "Data rumah sakit berhasil dihapus"}
# =====================================================================
# 👥 CORE 3: KENDALI KEPENGGUNAAN (USER CONTROLS)
# =====================================================================

@router.get("/users", response_model=list[UserResponse])
def read_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # DIPERBAIKI: Mengubah user_crud menjadi master_crud
    return master_crud.get_all_users(db=db, skip=skip, limit=limit)

@router.get("/users/{user_id}", response_model=UserResponse)
def read_user_by_id(user_id: int, db: Session = Depends(get_db)):
    # DIPERBAIKI: Mengubah user_crud menjadi master_crud
    db_user = master_crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    return db_user

@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
def remove_user(user_id: int, db: Session = Depends(get_db)):
    # DIPERBAIKI: Mengubah user_crud menjadi master_crud
    success = master_crud.delete_user(db=db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User tidak ditemukan atau gagal dihapus")
    return {"message": f"User dengan ID {user_id} berhasil dihapus dari sistem pusat"}