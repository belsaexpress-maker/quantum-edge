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

@router.get("/grid/{symbol}")
def grid_bot(symbol: str, price: float = 0):
    return {"strategy": "Grid Bot", "symbol": symbol, "expected_daily": "$8-15", "risk": "Low"}

@router.get("/scalping/{symbol}")
def scalping_bot(symbol: str, price: float = 0):
    return {"strategy": "AI Scalping", "symbol": symbol, "expected_daily": "$10-25", "risk": "Medium"}

@router.get("/momentum/{symbol}")
def momentum_bot(symbol: str, price: float = 0):
    return {"strategy": "Momentum Bot", "symbol": symbol, "expected_daily": "$15-40", "risk": "High"}

@router.get("/all/{symbol}")
def all_bots(symbol: str, price: float = 0):
    return {"symbol": symbol, "strategies": {"grid": "$50", "scalping": "$30", "momentum": "$20"}, "total": "$100", "expected_daily": "$20-40"}