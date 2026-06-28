from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, verify_token
from app.models.user import User
from app.core.config import settings

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == req.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Kullanıcı adı zaten var")
    
    user = User(
        username=req.username,
        email=req.email,
        password=hash_password(req.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    token = create_access_token({"sub": user.username, "user_id": user.id})
    return {"access_token": token, "user": {"id": user.id, "username": user.username, "email": user.email}}

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail="Hatalı kullanıcı adı veya şifre")
    
    token = create_access_token({"sub": user.username, "user_id": user.id})
    return {"access_token": token, "user": {"id": user.id, "username": user.username, "email": user.email}}

# Google OAuth (çalışması için GOOGLE_CLIENT_ID ve GOOGLE_CLIENT_SECRET .env'de tanımlanmalı)
# Şimdilik devre dışı - hazır olduğunda aktif edilecek