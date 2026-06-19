from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.request_response import RequestResponseCreate, RequestResponseResponse # Sesuaikan nama skemamu
from app.crud import request_response as response_crud

router = APIRouter(prefix="/request-responses", tags=["Request Responses"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def respond_to_request(response_data: RequestResponseCreate, user_id: int, db: Session = Depends(get_db)):
    new_response = response_crud.create_response(db=db, response_data=response_data, user_id=user_id)
    if not new_response:
        raise HTTPException(status_code=400, detail="Anda sudah merespons permintaan ini")
    return {"message": "Berhasil mengajukan diri sebagai pendonor", "data": new_response}

@router.get("/my-responses/{user_id}")
def list_my_responses(user_id: int, db: Session = Depends(get_db)):
    return response_crud.get_my_responses(db=db, user_id=user_id)

# Endpoint untuk melihat siapa saja pendonor yang masuk di postingan tertentu
@router.get("/request/{request_id}")
def list_responses_by_request(request_id: int, db: Session = Depends(get_db)):
    return response_crud.get_responses_by_request(db=db, request_id=request_id)

# Endpoint aksi Terima atau Tolak dari Pembuat Request
@router.patch("/{response_id}/decide")
def decide_donor_response(response_id: int, user_id: int, action: str, db: Session = Depends(get_db)):
    # parameter 'action' diisi string 'accept' atau 'reject' dari frontend
    result = response_crud.update_response_status(db=db, response_id=response_id, choice=action, current_user_id=user_id)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return {"message": f"Respons berhasil di-{result.status}", "data": result}