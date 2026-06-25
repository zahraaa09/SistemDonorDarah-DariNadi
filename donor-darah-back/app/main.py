from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database import engine, Base
import app.models
from app.routers import user, donor_request, request_response, donation, master, notification

Base.metadata.create_all(bind=engine)

with engine.connect() as conn:
    conn.execute(text(
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR UNIQUE"
    ))
    conn.execute(text(
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires_at TIMESTAMP"
    ))

app = FastAPI(
    title="API Sistem Donor Darah",
    version="1.0.0"
)
origins = [
    "http://localhost:3000",  
    "http://localhost:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(user.router)
app.include_router(donor_request.router)
app.include_router(request_response.router)
app.include_router(donation.router)
app.include_router(master.router)
app.include_router(notification.router)

@app.get("/", tags=["Root"])
def home():
    return {
        "status": "Berjalan", 
        "message": "Aplikasi Berhasil Berjalan dan Database Terkoneksi!",
        "docs_url": "/docs"
    }