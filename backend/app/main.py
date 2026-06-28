from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import market

app = FastAPI(title="Quantum Edge v2.0", version="2.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
Base.metadata.create_all(bind=engine)
app.include_router(market.router)

@app.get("/")
def root():
    return {"name": "Quantum Edge v2.0", "status": "online", "version": "2.0.0"}

@app.on_event("startup")
async def startup():
    from app.services.news_service import start_news_service
    from app.services.world_market_service import start_world_market_service
    start_news_service()
    start_world_market_service()
    print("All services started")