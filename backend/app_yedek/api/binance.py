from fastapi import APIRouter, Query
from pydantic import BaseModel
from app.services.binance_service import (
    get_account_balance, get_ticker_price, place_order, get_open_orders, cancel_order
)

router = APIRouter(prefix="/api/binance", tags=["Binance"])

class OrderRequest(BaseModel):
    symbol: str
    side: str  # BUY veya SELL
    quantity: float
    order_type: str = "MARKET"

@router.get("/balance")
def balance():
    return get_account_balance()

@router.get("/price/{symbol}")
def price(symbol: str):
    return get_ticker_price(symbol.upper())

@router.post("/order")
def order(req: OrderRequest):
    return place_order(req.symbol.upper(), req.side, req.quantity, req.order_type)

@router.get("/orders")
def orders(symbol: str = None):
    return get_open_orders(symbol.upper() if symbol else None)

@router.delete("/order/{symbol}/{order_id}")
def cancel(symbol: str, order_id: int):
    return cancel_order(symbol.upper(), order_id)