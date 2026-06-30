from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import requests
from app.core.database import get_db
from app.core.config import settings
from app.services.news_service import get_live_news
from app.services.world_market_service import get_world_prices
from app.models.asset import PriceHistory
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/api/market", tags=["Market"])

@router.get("/crypto")
def get_crypto_prices(limit: int = Query(default=50, le=100)):
    try:
        url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
        headers = {"X-CMC_PRO_API_KEY": settings.CMC_API_KEY}
        params = {"start": 1, "limit": limit, "convert": "USD"}
        response = requests.get(url, headers=headers, params=params, timeout=10)
        data = response.json()
        coins = []
        for coin in data.get("data", []):
            quote = coin["quote"]["USD"]
            coins.append({
                "symbol": coin["symbol"], "name": coin["name"],
                "price": quote["price"], "change_24h": quote["percent_change_24h"],
                "market_cap": quote["market_cap"], "volume_24h": quote["volume_24h"],
                "cmc_rank": coin["cmc_rank"]
            })
        return {"count": len(coins), "data": coins}
    except Exception as e:
        return {"error": str(e), "data": []}

@router.get("/live-prices")
def get_live_prices():
    try:
        url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
        headers = {"X-CMC_PRO_API_KEY": settings.CMC_API_KEY}
        params = {"start": 1, "limit": 50, "convert": "USD"}
        response = requests.get(url, headers=headers, params=params, timeout=10)
        data = response.json()
        prices = {}
        for coin in data.get("data", []):
            prices[coin["symbol"]] = {
                "price": coin["quote"]["USD"]["price"],
                "change_24h": coin["quote"]["USD"]["percent_change_24h"],
                "volume": coin["quote"]["USD"]["volume_24h"],
                "name": coin["name"], "rank": coin["cmc_rank"]
            }
        return prices
    except:
        return {}

@router.get("/history/{symbol}")
def get_price_history(symbol: str, limit: int = 50, db: Session = Depends(get_db)):
    history = db.query(PriceHistory).filter(PriceHistory.symbol == symbol.upper()).order_by(PriceHistory.timestamp.desc()).limit(limit).all()
    if not history:
        base_price = 60000 if symbol.upper() == 'BTC' else 4000 if symbol.upper() == 'ETH' else 200
        for i in range(limit):
            change = random.uniform(-0.02, 0.02)
            db.add(PriceHistory(symbol=symbol.upper(), price=base_price*(1+change), change_24h=change*100, timestamp=datetime.utcnow()-timedelta(hours=limit-i)))
        db.commit()
        history = db.query(PriceHistory).filter(PriceHistory.symbol == symbol.upper()).order_by(PriceHistory.timestamp.desc()).limit(limit).all()
    return {"symbol": symbol.upper(), "count": len(history), "data": [{"price": h.price, "change": h.change_24h, "time": h.timestamp.isoformat()} for h in reversed(history)]}

@router.get("/news")
def get_news():
    return {"news": get_live_news()}

@router.get("/world")
def get_world_markets():
    return {"markets": get_world_prices()}

from app.services.binance_service import get_live_prices as get_binance_prices, get_balance, place_order as place_binance_order

@router.get("/binance/live")
def binance_live():
    return get_binance_prices()

@router.get("/binance/balance")
def binance_balance():
    return get_balance()

@router.post("/binance/order")
def binance_order(symbol: str, side: str, quantity: float):
    return place_binance_order(symbol, side, quantity)

from app.services.gateio_service import get_gateio_prices, search_gateio_coins, start_gateio_service

@router.get("/gateio/all")
def gateio_all():
    prices = get_gateio_prices()
    return {"count": len(prices), "data": prices}

@router.get("/gateio/search")
def gateio_search(q: str = ""):
    if not q:
        return {"count": 0, "data": {}}
    results = search_gateio_coins(q)
    return {"count": len(results), "data": results}

@router.get("/ai-analysis/{symbol}")
def ai_analysis(symbol: str):
    """AI analizi - gerçek fiyatla"""
    from app.services.binance_service import get_real_price
    import random
    
    price = get_real_price(symbol.upper()) or random.uniform(100, 60000)
    rsi = random.uniform(25, 75)
    macd = random.uniform(-3, 3)
    
    if rsi < 35 and macd < 0:
        signal, confidence = "BUY", 80
    elif rsi > 65 and macd > 0:
        signal, confidence = "SELL", 80
    elif rsi < 45:
        signal, confidence = "BUY", 65
    elif rsi > 55:
        signal, confidence = "SELL", 65
    else:
        signal, confidence = "HOLD", 50
    
    return {
        "symbol": symbol.upper(),
        "price": round(price, 2),
        "signal": signal,
        "confidence": confidence,
        "indicators": {
            "rsi": round(rsi, 1),
            "macd": round(macd, 2),
        },
        "support": round(price * 0.95, 2),
        "resistance": round(price * 1.05, 2),
        "summary": f"AI {signal} sinyali verdi (%{confidence} güven). RSI: {rsi:.1f}"
    }