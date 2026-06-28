from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings
from collections import defaultdict
import time

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
login_attempts = defaultdict(list)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except:
        return None

def check_login_attempts(ip: str) -> bool:
    now = time.time()
    attempts = [t for t in login_attempts[ip] if now - t < 300]
    if len(attempts) >= 5:
        return False
    login_attempts[ip].append(now)
    return True