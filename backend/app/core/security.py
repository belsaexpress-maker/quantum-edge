from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings
import hashlib
import hmac
import base64
from collections import defaultdict
import time

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

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

# API Key doğrulama (iç servisler için)
def verify_api_key(api_key: str) -> bool:
    expected = hashlib.sha256(settings.SECRET_KEY.encode()).hexdigest()
    provided = hashlib.sha256(api_key.encode()).hexdigest()
    return hmac.compare_digest(expected, provided)

# Brute force koruması
login_attempts = defaultdict(list)

def check_login_attempts(ip: str) -> bool:
    now = time.time()
    attempts = [t for t in login_attempts[ip] if now - t < 300]  # 5 dakika
    if len(attempts) >= 5:  # 5 başarısız deneme
        return False
    login_attempts[ip].append(now)
    return True