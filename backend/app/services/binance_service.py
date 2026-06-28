from binance.client import Client
from binance.exceptions import BinanceAPIException
from app.core.config import settings
import os

# Binance client - hata alırsa None olarak kalsın
client = None
binance_available = False

try:
    if settings.BINANCE_API_KEY and settings.BINANCE_SECRET_KEY:
        client = Client(settings.BINANCE_API_KEY, settings.BINANCE_SECRET_KEY)
        client.ping()
        binance_available = True
        print("✅ Binance API bağlantısı başarılı")
    else:
        print("⚠️ Binance API anahtarları .env dosyasında tanımlı değil")
except Exception as e:
    print(f"⚠️ Binance bağlantısı kurulamadı (Türkiye erişim engeli olabilir): {e}")
    print("🔄 Demo modda devam ediliyor...")

def get_account_balance():
    if not binance_available:
        return {
            "success": True,
            "demo": True,
            "balances": [
                {"asset": "BTC", "free": 0.0, "locked": 0.0, "total": 0.0},
                {"asset": "ETH", "free": 0.0, "locked": 0.0, "total": 0.0},
                {"asset": "USDT", "free": 0.0, "locked": 0.0, "total": 0.0},
            ],
            "message": "Demo mod - Gerçek bakiye gösterilmiyor"
        }
    try:
        account = client.get_account()
        balances = []
        for b in account['balances']:
            free = float(b['free'])
            locked = float(b['locked'])
            if free > 0 or locked > 0:
                balances.append({"asset": b['asset'], "free": free, "locked": locked, "total": free + locked})
        return {"success": True, "balances": balances}
    except BinanceAPIException as e:
        return {"success": False, "error": str(e)}

def get_ticker_price(symbol: str):
    if not binance_available:
        return {"symbol": symbol, "price": 0, "demo": True, "message": "Demo mod"}
    try:
        ticker = client.get_symbol_ticker(symbol=f"{symbol}USDT")
        return {"symbol": symbol, "price": float(ticker['price'])}
    except:
        return {"error": "Fiyat alınamadı"}

def place_order(symbol: str, side: str, quantity: float, order_type: str = "MARKET"):
    if not binance_available:
        return {"success": False, "error": "Binance bağlantısı yok - Demo modda işlem yapılamaz"}
    try:
        order = client.create_order(
            symbol=f"{symbol}USDT",
            side=side.upper(),
            type=order_type,
            quantity=quantity
        )
        return {
            "success": True,
            "order_id": order['orderId'],
            "symbol": order['symbol'],
            "side": order['side'],
            "quantity": order['origQty'],
            "status": order['status']
        }
    except BinanceAPIException as e:
        return {"success": False, "error": str(e)}

def get_open_orders(symbol: str = None):
    if not binance_available:
        return {"success": True, "orders": [], "demo": True}
    try:
        orders = client.get_open_orders(symbol=f"{symbol}USDT") if symbol else client.get_open_orders()
        return {"success": True, "orders": orders}
    except BinanceAPIException as e:
        return {"success": False, "error": str(e)}

def cancel_order(symbol: str, order_id: int):
    if not binance_available:
        return {"success": False, "error": "Demo mod"}
    try:
        client.cancel_order(symbol=f"{symbol}USDT", orderId=order_id)
        return {"success": True, "message": "Emir iptal edildi"}
    except BinanceAPIException as e:
        return {"success": False, "error": str(e)}