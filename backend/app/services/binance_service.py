import os
from binance.client import Client
from binance.exceptions import BinanceAPIException
from app.core.config import settings

# Binance client - gerçek API
try:
    client = Client(settings.BINANCE_API_KEY, settings.BINANCE_SECRET_KEY)
    client.ping()
    binance_available = True
    print("✅ Binance API bağlantısı başarılı")
except Exception as e:
    client = None
    binance_available = False
    print(f"⚠️ Binance API yok - Demo mod: {e}")

def get_account_balance():
    if not binance_available:
        return {"USDT": 10000, "BTC": 0.15, "ETH": 2.5, "demo": True}
    try:
        account = client.get_account()
        balances = {}
        for b in account['balances']:
            free = float(b['free'])
            if free > 0:
                balances[b['asset']] = free
        return balances
    except:
        return {"USDT": 10000, "BTC": 0.15, "ETH": 2.5, "demo": True}

def get_real_price(symbol: str):
    if not binance_available:
        return None
    try:
        ticker = client.get_symbol_ticker(symbol=f"{symbol}USDT")
        return float(ticker['price'])
    except:
        return None

def place_real_order(symbol: str, side: str, quantity: float):
    if not binance_available:
        return {"success": False, "error": "Binance bağlantısı yok"}
    try:
        order = client.create_order(
            symbol=f"{symbol}USDT",
            side=side.upper(),
            type="MARKET",
            quantity=quantity
        )
        return {"success": True, "order_id": order['orderId']}
    except BinanceAPIException as e:
        return {"success": False, "error": str(e)}