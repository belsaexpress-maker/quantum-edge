from fastapi import APIRouter
from app.services.bots.manager import bot_manager

router = APIRouter(prefix="/api/bots", tags=["Trading Bots"])

@router.post("/start/grid")
def start_grid(symbol: str = "BTCUSDT"):
    return bot_manager.start_grid_bot(symbol)

@router.post("/start/scalping")
def start_scalping(symbol: str = "BTCUSDT"):
    return bot_manager.start_scalping_bot(symbol)

@router.post("/start/momentum")
def start_momentum(symbol: str = "BTCUSDT"):
    return bot_manager.start_momentum_bot(symbol)

@router.post("/start/all")
def start_all(symbol: str = "BTCUSDT"):
    return bot_manager.start_all(symbol)

@router.post("/stop/all")
def stop_all():
    return bot_manager.stop_all()

@router.get("/status")
def get_status():
    return bot_manager.get_all_status()

@router.get("/grid")
def grid_bot(symbol: str = "BTCUSDT", price: float = 0):
    return {
        "strategy": "Grid Bot",
        "symbol": symbol,
        "capital": 100,
        "grid_levels": 5,
        "grid_spacing": "1%",
        "expected_daily": "$8-15",
        "risk": "Low"
    }

@router.get("/scalping/{symbol}")
def scalping_bot(symbol: str, price: float = 0):
    return {
        "strategy": "AI Scalping",
        "symbol": symbol,
        "capital": 100,
        "max_trades": 50,
        "expected_daily": "$10-25",
        "risk": "Medium"
    }

@router.get("/momentum/{symbol}")
def momentum_bot(symbol: str, price: float = 0):
    return {
        "strategy": "Momentum Bot",
        "symbol": symbol,
        "capital": 100,
        "expected_daily": "$15-40",
        "risk": "High"
    }

@router.get("/all/{symbol}")
def all_bots(symbol: str, price: float = 0):
    return {
        "symbol": symbol,
        "strategies": {
            "grid": {"capital": "$50", "expected_daily": "$8-15", "risk": "Low"},
            "scalping": {"capital": "$30", "expected_daily": "$10-25", "risk": "Medium"},
            "momentum": {"capital": "$20", "expected_daily": "$15-40", "risk": "High"}
        },
        "total_capital": "$100",
        "total_expected_daily": "$20-40",
        "monthly_projection": "$600-1,200"
    }