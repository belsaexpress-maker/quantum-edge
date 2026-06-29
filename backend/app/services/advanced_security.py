import hashlib
import hmac
import time
import re
from collections import defaultdict
from fastapi import Request, HTTPException

class AdvancedSecurity:
    def __init__(self):
        self.rate_limit = defaultdict(list)
        self.blocked_ips = set()
        self.api_keys = {}
    
    # Rate Limiting (IP başına dakikada 100 istek)
    def check_rate_limit(self, ip: str, max_requests: int = 100, window: int = 60) -> bool:
        now = time.time()
        self.rate_limit[ip] = [t for t in self.rate_limit[ip] if now - t < window]
        if len(self.rate_limit[ip]) >= max_requests:
            self.blocked_ips.add(ip)
            return False
        self.rate_limit[ip].append(now)
        return True
    
    # SQL Injection Koruması
    def detect_sql_injection(self, text: str) -> bool:
        patterns = [
            r"(\bUNION\b.*\bSELECT\b)", r"(\bDROP\b.*\bTABLE\b)",
            r"(\bINSERT\b.*\bINTO\b)", r"(\bDELETE\b.*\bFROM\b)",
            r"(--[^\n]*$)", r"(/\*.*\*/)", r"(\bOR\b.*=.*\b)"
        ]
        return any(re.search(p, text, re.IGNORECASE) for p in patterns)
    
    # XSS Koruması
    def detect_xss(self, text: str) -> bool:
        patterns = [
            r"<script>", r"javascript:", r"onerror=", r"onload=",
            r"<iframe>", r"<embed>", r"<object>", r"eval\("
        ]
        return any(re.search(p, text, re.IGNORECASE) for p in patterns)
    
    # API Anahtarı Oluşturma (HMAC-SHA256)
    def generate_api_key(self, user_id: int) -> str:
        timestamp = str(int(time.time()))
        secret = "quantum-edge-master-secret"
        message = f"{user_id}:{timestamp}"
        signature = hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest()
        return f"qe_{user_id}_{timestamp}_{signature[:16]}"
    
    # İstek İmzası Doğrulama (HMAC)
    def verify_signature(self, payload: str, signature: str, secret: str) -> bool:
        expected = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)
    
    # Hassas Veri Maskeleme
    def mask_sensitive(self, text: str, show_chars: int = 4) -> str:
        if len(text) <= show_chars:
            return "*" * len(text)
        return text[:show_chars] + "*" * (len(text) - show_chars)

security = AdvancedSecurity()