import requests
import threading
import time
from datetime import datetime

world_prices = {}
HEADERS = {'User-Agent': 'Mozilla/5.0'}
TICKERS = {
    "indices": {"^GSPC": "S&P 500", "^IXIC": "NASDAQ"},
    "commodities": {"GC=F": "Gold", "CL=F": "Oil"},
    "forex": {"EURUSD=X": "EUR/USD"},
    "stocks": {"AAPL": "Apple", "TSLA": "Tesla"}
}

def fetch_prices():
    global world_prices
    for cat, syms in TICKERS.items():
        for sym, name in syms.items():
            try:
                url = f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}?interval=1d&range=1d"
                r = requests.get(url, headers=HEADERS, timeout=10)
                if r.status_code == 200:
                    meta = r.json()['chart']['result'][0]['meta']
                    world_prices[sym] = {
                        "name": name, "price": meta['regularMarketPrice'],
                        "change_percent": 0, "category": cat,
                        "updated": datetime.now().isoformat()
                    }
            except:
                world_prices[sym] = {
                    "name": name, "price": 100, "change_percent": 0,
                    "category": cat, "updated": datetime.now().isoformat(), "demo": True
                }

def start_world_market_service():
    fetch_prices()
    def updater():
        while True:
            time.sleep(300)
            fetch_prices()
    threading.Thread(target=updater, daemon=True).start()

def get_world_prices():
    return world_prices