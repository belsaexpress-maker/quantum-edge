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

@app.on_event("startup")
async def startup():
    try:
        from app.services.news_service import start_news_service
        start_news_service()
        print("News service started")
    except Exception as e:
        print(f"News service error: {e}")
    
    try:
        from app.services.world_market_service import start_world_market_service
        start_world_market_service()
        print("World market service started")
    except Exception as e:
        print(f"World market service error: {e}")

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}