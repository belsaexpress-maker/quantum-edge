from fastapi import APIRouter
from pydantic import BaseModel
from app.services.bots.manager import bot_manager

router = APIRouter(prefix="/api/bots", tags=["Trading Bots"])

class CapitalRequest(BaseModel):
    amount: float
    allocation: dict = None

@router.post("/start/all")
def start_all(symbol: str = "BTCUSDT"):
    return bot_manager.start_all(symbol)

@router.post("/stop/all")
def stop_all():
    return bot_manager.stop_all()

@router.get("/status")
def get_status():
    return bot_manager.get_all_status()

@router.post("/set-capital")
def set_capital(req: CapitalRequest):
    return bot_manager.set_capital(req.amount, req.allocation)

@router.get("/all/{symbol}")
def all_bots(symbol: str, price: float = 0):
    p = price if price > 0 else 60000
    return {
        "symbol": symbol.upper(),
        "price": p,
        "strategies": {
            "grid": {
                "name": "Grid Bot", "capital": "$50",
                "description": "Yatay piyasada %1 aralıklarla al-sat yapar",
                "expected_daily": "$8-15", "risk": "Düşük",
                "entry_example": round(p * 0.99, 2), "target_example": round(p * 1.01, 2),
                "best_for": "Yatay piyasa"
            },
            "dca": {
                "name": "DCA Bot", "capital": "$25",
                "description": "Fiyat düştükçe kademeli alım yapar, maliyeti düşürür",
                "expected_daily": "$10-20", "risk": "Orta",
                "levels": [
                    {"drop": "%5", "buy": round(p * 0.95, 2)},
                    {"drop": "%10", "buy": round(p * 0.90, 2)},
                    {"drop": "%15", "buy": round(p * 0.85, 2)}
                ],
                "best_for": "Düşüş trendi"
            },
            "scalping": {
                "name": "AI Scalping", "capital": "$15",
                "description": "RSI, MACD, hacim ile anlık al-sat sinyalleri",
                "expected_daily": "$10-25", "risk": "Orta",
                "entry_example": round(p * 0.999, 2), "target_example": round(p * 1.005, 2),
                "stop_example": round(p * 0.995, 2), "best_for": "Her piyasa"
            },
            "momentum": {
                "name": "Momentum Bot", "capital": "$10",
                "description": "Güçlü trendleri yakalar, büyük hareketlerden kazanır",
                "expected_daily": "$15-40", "risk": "Yüksek",
                "entry_example": p, "target_example": round(p * 1.03, 2),
                "stop_example": round(p * 0.97, 2), "best_for": "Trend piyasası"
            }
        },
        "total_capital": "$100",
        "total_expected_daily": "$20-50",
        "monthly_projection": "$600-1,500"
    }