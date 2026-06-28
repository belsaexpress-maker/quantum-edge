from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from app.core.database import engine, Base
from app.api import auth, market, bots, binance
from app.middleware.security import RateLimitMiddleware, SQLInjectionMiddleware, XSSMiddleware

app = FastAPI(title="Quantum Edge v2.0", version="2.0.0")

# Security Headers
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response

# CORS - Sadece belirli kaynaklara izin ver
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://quantum-edge.onrender.com", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

# Güvenlik middleware'leri
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SQLInjectionMiddleware)
app.add_middleware(XSSMiddleware)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(market.router)
app.include_router(bots.router)
app.include_router(binance.router)

@app.get("/")
def root():
    return {"name": "Quantum Edge v2.0", "status": "secure", "version": "2.0.0"}