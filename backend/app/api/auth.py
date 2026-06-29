from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, check_login_attempts
from app.models.user import User
import random, string, pyotp

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class RegisterRequest(BaseModel): username: str; email: str; password: str
class LoginRequest(BaseModel): username: str; password: str
class ResetRequest(BaseModel): email: str
class TwoFactorRequest(BaseModel): username: str; code: str

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(400, "Kullanıcı adı zaten var")
    user = User(username=req.username, email=req.email, password=hash_password(req.password))
    db.add(user); db.commit(); db.refresh(user)
    token = create_access_token({"sub": user.username, "user_id": user.id})
    return {"access_token": token, "user": {"id": user.id, "username": user.username, "email": user.email}}

@router.post("/login")
def login(req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    ip = request.client.host
    if not check_login_attempts(ip): raise HTTPException(429, "Çok fazla deneme")
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.password):
        raise HTTPException(401, "Hatalı kullanıcı adı veya şifre")
    token = create_access_token({"sub": user.username, "user_id": user.id})
    return {"access_token": token, "user": {"id": user.id, "username": user.username, "email": user.email}}

@router.post("/forgot-password")
def forgot_password(req: ResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if user:
        new_pass = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
        user.password = hash_password(new_pass)
        db.commit()
        return {"message": "Yeni şifre oluşturuldu", "new_password": new_pass}
    raise HTTPException(404, "Email bulunamadı")

@router.post("/change-password")
def change_password(username: str, old_pass: str, new_pass: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(old_pass, user.password):
        raise HTTPException(400, "Mevcut şifre hatalı")
    user.password = hash_password(new_pass)
    db.commit()
    return {"message": "Şifre değiştirildi"}

@router.get("/google/login")
def google_login():
    return {"url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:8000/api/auth/google/callback&response_type=code&scope=email%20profile"}

@router.get("/2fa/setup/{username}")
def setup_2fa(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user: raise HTTPException(404, "Kullanıcı bulunamadı")
    secret = pyotp.random_base32()
    user.two_factor_secret = secret
    db.commit()
    uri = pyotp.totp.TOTP(secret).provisioning_uri(name=username, issuer_name="Quantum Edge")
    return {"secret": secret, "uri": uri, "qr": f"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={uri}"}

@router.post("/2fa/verify")
def verify_2fa(req: TwoFactorRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not user.two_factor_secret: raise HTTPException(400, "2FA kurulmamış")
    totp = pyotp.TOTP(user.two_factor_secret)
    if totp.verify(req.code):
        return {"message": "2FA doğrulandı"}
    raise HTTPException(400, "Geçersiz kod")