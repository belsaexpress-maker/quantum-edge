from fastapi import Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
import time
from collections import defaultdict
import re

# Rate Limiting (İstek Sınırlama)
request_counts = defaultdict(list)

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        now = time.time()
        
        # Son 60 saniyedeki istekleri tut
        request_counts[client_ip] = [t for t in request_counts[client_ip] if now - t < 60]
        
        # Dakikada 100'den fazla istek gelirse engelle
        if len(request_counts[client_ip]) >= 100:
            raise HTTPException(status_code=429, detail="Too many requests")
        
        request_counts[client_ip].append(now)
        return await call_next(request)

# SQL Injection Koruması
class SQLInjectionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # URL ve query parametrelerini kontrol et
        sql_patterns = [
            r"(\bUNION\b.*\bSELECT\b)",
            r"(\bDROP\b.*\bTABLE\b)",
            r"(\bINSERT\b.*\bINTO\b)",
            r"(\bDELETE\b.*\bFROM\b)",
            r"(--[^\n]*$)",
            r"(/\*.*\*/)",
        ]
        
        url = str(request.url).lower()
        for pattern in sql_patterns:
            if re.search(pattern, url, re.IGNORECASE):
                raise HTTPException(status_code=403, detail="Forbidden")
        
        return await call_next(request)

# XSS Koruması
class XSSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        xss_patterns = [
            r"<script>",
            r"javascript:",
            r"onerror=",
            r"onload=",
            r"<iframe>",
            r"<embed>",
            r"<object>",
        ]
        
        url = str(request.url).lower()
        for pattern in xss_patterns:
            if re.search(pattern, url, re.IGNORECASE):
                raise HTTPException(status_code=403, detail="XSS detected")
        
        return await call_next(request)