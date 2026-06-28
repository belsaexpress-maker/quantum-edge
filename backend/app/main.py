from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import auth, market, bots, binance

app = FastAPI(title="Quantum Edge v2.0", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(market.router)
app.include_router(bots.router)
app.include_router(binance.router)

@app.get("/")
def root():
    return {"name": "Quantum Edge v2.0", "status": "online", "version": "2.0.0"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}