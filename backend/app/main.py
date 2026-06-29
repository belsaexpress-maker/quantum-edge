from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.database import engine, Base
from app.api import auth, market, bots, binance, exchange
from app.services.advanced_security import security
import time

app = FastAPI(title="Quantum Edge v2.0", version="2.0.0")

# CORS - Güvenli kaynaklar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Güvenlik Headers Middleware
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Rate Limit Middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    ip = request.client.host
    if not security.check_rate_limit(ip):
        return JSONResponse(status_code=429, content={"detail": "Çok fazla istek. Lütfen bekleyin."})
    return await call_next(request)

# SQL Injection ve XSS Koruması
@app.middleware("http")
async def injection_protection(request: Request, call_next):
    # URL parametrelerini kontrol et
    url = str(request.url)
    if security.detect_sql_injection(url) or security.detect_xss(url):
        return JSONResponse(status_code=403, content={"detail": "Geçersiz istek"})
    return await call_next(request)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(market.router)
app.include_router(bots.router)
app.include_router(binance.router)
app.include_router(exchange.router)

@app.get("/")
def root():
    return {"name": "Quantum Edge v2.0", "status": "secure", "version": "2.0.0"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "security": "active", "ssl": "enabled"}

@app.get("/api/security/generate-key/{user_id}")
def generate_key(user_id: int):
    return {"api_key": security.generate_api_key(user_id)}