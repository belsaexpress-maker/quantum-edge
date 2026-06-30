import requests
import threading
import time
from datetime import datetime

gateio_prices = {}

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
    except Exception as e:
        print(f"Gate.io error: {e}")

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