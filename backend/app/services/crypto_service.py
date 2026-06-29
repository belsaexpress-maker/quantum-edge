from cryptography.fernet import Fernet
from app.core.config import settings
import base64
import hashlib

def _get_fernet():
    """SECRET_KEY'den Fernet anahtarı türetir"""
    key = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
    return Fernet(base64.urlsafe_b64encode(key))

def encrypt_api_key(text: str) -> str:
    """API anahtarını AES-256 ile şifrele"""
    if not text:
        return ""
    f = _get_fernet()
    return f.encrypt(text.encode()).decode()

def decrypt_api_key(encrypted_text: str) -> str:
    """API anahtarının şifresini çöz"""
    if not encrypted_text:
        return ""
    f = _get_fernet()
    return f.decrypt(encrypted_text.encode()).decode()