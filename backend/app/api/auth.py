from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, check_login_attempts
from app.models.user import User

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
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Kullanıcı adı zaten var")
    user = User(username=req.username, email=req.email, password=hash_password(req.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.username, "user_id": user.id})
    return {"access_token": token, "user": {"id": user.id, "username": user.username, "email": user.email}}

@router.post("/login")
def login(req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    ip = request.client.host
    if not check_login_attempts(ip):
        raise HTTPException(status_code=429, detail="Çok fazla deneme. 5 dakika bekleyin.")
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail="Hatalı kullanıcı adı veya şifre")
    token = create_access_token({"sub": user.username, "user_id": user.id})
    return {"access_token": token, "user": {"id": user.id, "username": user.username, "email": user.email}}