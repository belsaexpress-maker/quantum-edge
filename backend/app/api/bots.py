from fastapi import APIRouter, Query
from app.services.trading_bot import trading_bot

router = APIRouter(prefix="/api/bots", tags=["Trading Bots"])

@router.get("/grid/{symbol}")
def grid_bot(symbol: str, price: float = Query(default=0)):
    if price == 0:
        return {"error": "Fiyat girin. Örnek: /api/bots/grid/BTC?price=60000"}
    return trading_bot.generate_grid_signals(symbol.upper(), price)

@router.get("/dca/{symbol}")
def dca_bot(symbol: str, price: float = Query(default=0)):
    if price == 0:
        return {"error": "Fiyat girin. Örnek: /api/bots/dca/BTC?price=60000"}
    return trading_bot.generate_dca_signals(symbol.upper(), price)

@router.get("/scalping/{symbol}")
def scalping_bot(symbol: str, price: float = Query(default=0)):
    if price == 0:
        return {"error": "Fiyat girin. Örnek: /api/bots/scalping/BTC?price=60000"}
    return trading_bot.generate_ai_scalping_signals(symbol.upper(), price)

@router.get("/momentum/{symbol}")
def momentum_bot(symbol: str, price: float = Query(default=0)):
    if price == 0:
        return {"error": "Fiyat girin. Örnek: /api/bots/momentum/BTC?price=60000"}
    return trading_bot.generate_momentum_signals(symbol.upper(), price)

@router.get("/all/{symbol}")
def all_bots(symbol: str, price: float = Query(default=0)):
    if price == 0:
        return {"error": "Fiyat girin"}
    return {
        "symbol": symbol.upper(),
        "price": price,
        "strategies": {
            "grid": trading_bot.generate_grid_signals(symbol.upper(), price),
            "dca": trading_bot.generate_dca_signals(symbol.upper(), price),
            "scalping": trading_bot.generate_ai_scalping_signals(symbol.upper(), price),
            "momentum": trading_bot.generate_momentum_signals(symbol.upper(), price)
        },
        "recommendation": trading_bot.generate_ai_scalping_signals(symbol.upper(), price)
    }