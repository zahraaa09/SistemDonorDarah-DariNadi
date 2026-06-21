from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.schemas.request_response import RequestResponseCreate, RequestResponseResponse # Resuaikan nama skemamu
from app.crud import request_response as response_crud
from app import models

router = APIRouter(prefix="/request-responses", tags=["Request Responses"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def respond_to_request(response_data: RequestResponseCreate, user_id: int, db: Session = Depends(get_db)):
    new_response = response_crud.create_response(db=db, response_data=response_data, user_id=user_id)
    if not new_response:
        raise HTTPException(status_code=400, detail="Anda sudah merespons permintaan ini")
    return {"message": "Berhasil mengajukan diri sebagai pendonor", "data": new_response}

@router.get("/my-responses/{user_id}")
def list_my_responses(user_id: int, db: Session = Depends(get_db)):
    responses = db.query(models.RequestResponse)\
                    .options(
                        joinedload(models.RequestResponse.donor_request).joinedload(models.DonorRequest.hospital)
                    )\
                    .filter(models.RequestResponse.id_user == user_id).all()
    
    result = []
    for r in responses:
        req = r.donor_request
        result.append({
            "id": r.id,
            "id_request": r.id_request,
            "id_user": r.id_user,
            "status": r.status,
            "created_at": r.created_at,
            "request": {
                "id": req.id,
                "blood_type": req.blood_type,
                "status": req.status,
                "created_at": req.created_at,
                "hospital": {
                    "name": req.hospital.name if req.hospital else "Rumah Sakit"
                } if req.hospital else None
            } if req else None
        })
    return result

@router.get("/request/{request_id}")
def list_responses_by_request(request_id: int, db: Session = Depends(get_db)):
    return response_crud.get_responses_by_request(db=db, request_id=request_id)

@router.patch("/{response_id}/decide")
def decide_donor_response(response_id: int, user_id: int, action: str, db: Session = Depends(get_db)):
    result = response_crud.update_response_status(db=db, response_id=response_id, choice=action, current_user_id=user_id)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return {"message": f"Respons berhasil di-{result.status}", "data": result}