from fastapi import APIRouter
from pydantic import BaseModel
from app.services.binance_service import get_balance, place_order, get_real_price

router = APIRouter(prefix="/api/binance", tags=["Binance"])

class OrderRequest(BaseModel):
    symbol: str
    side: str
    quantity: float
    order_type: str = "MARKET"

@router.get("/balance")
def balance():
    return get_balance()

@router.get("/price/{symbol}")
def price(symbol: str):
    p = get_real_price(symbol.upper())
    return {"symbol": symbol.upper(), "price": p or 0}

@router.post("/order")
def order(req: OrderRequest):
    return place_order(req.symbol.upper(), req.side, req.quantity)