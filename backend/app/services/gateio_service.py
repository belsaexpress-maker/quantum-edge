import requests
import threading
import time
import hmac
import hashlib
import json
from datetime import datetime
from app.core.config import settings

gateio_prices = {}
gateio_available = False

# Gerçek API testi
try:
    if settings.GATEIO_API_KEY and settings.GATEIO_SECRET_KEY:
        # Gate.io v4 API testi - doğru imza formatı
        import hashlib, hmac, time
        
        host = "https://api.gateio.ws"
        prefix = "/api/v4"
        url = "/spot/accounts"
        query_param = ''
        
        timestamp = str(int(time.time()))
        sign_string = f"{prefix}{url}\n{query_param}\n{hashlib.sha512(b'').hexdigest()}\n{timestamp}"
        signature = hmac.new(
            settings.GATEIO_SECRET_KEY.encode(),
            sign_string.encode(),
            hashlib.sha512
        ).hexdigest()
        
        test_headers = {
            'KEY': settings.GATEIO_API_KEY,
            'Timestamp': timestamp,
            'SIGN': signature,
            'Accept': 'application/json'
        }
        
        test_response = requests.get(f"{host}{prefix}{url}", headers=test_headers, timeout=10)
        if test_response.status_code == 200:
            gateio_available = True
            print("✅ Gate.io API bağlantısı BAŞARILI - Gerçek bakiye aktif")
        else:
            gateio_available = False
            print(f"❌ Gate.io API hatası: {test_response.status_code} - {test_response.text[:200]}")
    else:
        gateio_available = False
        print("⚠️ Gate.io API key'leri .env dosyasında yok - Demo mod")
except Exception as e:
    gateio_available = False
    print(f"❌ Gate.io API bağlantı hatası: {e}")

def fetch_gateio_prices():
    global gateio_prices
    try:
        url = "https://api.gateio.ws/api/v4/spot/tickers"
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            for ticker in data:
                symbol = ticker.get("currency_pair", "")
                if symbol.endswith("_USDT"):
                    coin = symbol.replace("_USDT", "")
                    gateio_prices[coin] = {
                        "symbol": coin, "name": coin,
                        "price": float(ticker.get("last", 0)),
                        "change_24h": float(ticker.get("change_percentage", 0)),
                        "high_24h": float(ticker.get("high_24h", 0)),
                        "low_24h": float(ticker.get("low_24h", 0)),
                        "volume": float(ticker.get("base_volume", 0)),
                        "exchange": "Gate.io"
                    }
            print(f"Gate.io: {len(gateio_prices)} coin çekildi")
    except Exception as e:
        print(f"Gate.io error: {e}")

def get_gateio_balance():
    """Gate.io bakiyesini getir (gerçek API)"""
    if not gateio_available:
        return {"USDT": 5000, "BTC": 0.1, "ETH": 1.5, "demo": True}
    try:
        url = "https://api.gateio.ws/api/v4/spot/accounts"
        timestamp = str(int(time.time()))
        signature = hmac.new(
            settings.GATEIO_SECRET_KEY.encode(),
            b'',
            hashlib.sha512
        ).hexdigest()
        headers = {
            'KEY': settings.GATEIO_API_KEY,
            'Timestamp': timestamp,
            'SIGN': signature
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            balances = {}
            for item in data:
                available = float(item.get('available', 0))
                locked = float(item.get('locked', 0))
                if available > 0 or locked > 0:
                    balances[item['currency']] = available + locked
            return balances
        else:
            print(f"Balance hatası: {response.status_code} - {response.text[:100]}")
    except Exception as e:
        print(f"Gate.io balance error: {e}")
    return {"USDT": 5000, "BTC": 0.1, "ETH": 1.5, "demo": True}

def place_gateio_order(symbol: str, side: str, amount: float):
    """Gate.io'da emir ver (gerçek API)"""
    if not gateio_available:
        return {"success": False, "error": "Gate.io API bağlantısı yok"}
    try:
        url = "https://api.gateio.ws/api/v4/spot/orders"
        body = json.dumps({
            "currency_pair": f"{symbol}_USDT",
            "type": "market",
            "side": side.lower(),
            "amount": str(amount),
            "time_in_force": "ioc"
        })
        timestamp = str(int(time.time()))
        signature = hmac.new(
            settings.GATEIO_SECRET_KEY.encode(),
            (body + timestamp).encode(),
            hashlib.sha512
        ).hexdigest()
        headers = {
            'KEY': settings.GATEIO_API_KEY,
            'Timestamp': timestamp,
            'SIGN': signature,
            'Content-Type': 'application/json'
        }
        response = requests.post(url, headers=headers, data=body, timeout=10)
        if response.status_code in [200, 201]:
            return {"success": True, "order": response.json()}
        return {"success": False, "error": response.text}
    except Exception as e:
        return {"success": False, "error": str(e)}

def start_gateio_service():
    fetch_gateio_prices()
    def updater():
        while True:
            time.sleep(30)
            fetch_gateio_prices()
    threading.Thread(target=updater, daemon=True).start()

def get_gateio_prices():
    return gateio_prices

def get_gateio_price(symbol: str):
    symbol = symbol.upper().replace("USDT", "")
    return gateio_prices.get(symbol, {}).get("price")

def search_gateio_coins(query: str):
    query = query.upper()
    results = {}
    for symbol, data in gateio_prices.items():
        if query in symbol:
            results[symbol] = data
    return results