from fastapi import APIRouter
from app.services.bots.manager import bot_manager

router = APIRouter(prefix="/api/bots", tags=["Trading Bots"])

@router.post("/start/all")
def start_all(symbol: str = "BTCUSDT"):
    return bot_manager.start_all(symbol)

@router.post("/stop/all")
def stop_all():
    return bot_manager.stop_all()

@router.get("/status")
def get_status():
    return bot_manager.get_all_status()