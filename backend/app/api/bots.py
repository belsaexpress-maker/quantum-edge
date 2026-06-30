from fastapi import APIRouter
from app.services.bots.manager import bot_manager

router = APIRouter(prefix="/api/bots", tags=["Trading Bots"])

@router.post("/start/grid")
def start_grid(symbol: str = "BTCUSDT", capital: float = 50, grid_levels: int = 5, spacing: float = 0.01):
    return bot_manager.start_grid_bot(symbol, capital, grid_levels, spacing)

@router.post("/start/scalping")
def start_scalping(symbol: str = "BTCUSDT", capital: float = 30, max_trades: int = 50):
    return bot_manager.start_scalping_bot(symbol, capital, max_trades)

@router.post("/start/momentum")
def start_momentum(symbol: str = "BTCUSDT", capital: float = 20):
    return bot_manager.start_momentum_bot(symbol, capital)

@router.post("/stop/grid")
def stop_grid():
    return bot_manager.stop_bot("grid")

@router.post("/stop/scalping")
def stop_scalping():
    return bot_manager.stop_bot("scalping")

@router.post("/stop/momentum")
def stop_momentum():
    return bot_manager.stop_bot("momentum")

@router.post("/stop/all")
def stop_all():
    return bot_manager.stop_all()

@router.get("/status")
def get_status():
    return bot_manager.get_all_status()