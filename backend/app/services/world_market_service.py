import requests
import threading
import time
from datetime import datetime

world_prices = {}
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

# Yahoo Finance sembolleri
TICKERS = {
    "indices": {
        "^GSPC": "S&P 500", "^DJI": "Dow Jones", "^IXIC": "NASDAQ",
        "^FTSE": "FTSE 100", "^N225": "Nikkei 225", "^GDAXI": "DAX", "^HSI": "Hang Seng"
    },
    "commodities": {
        "GC=F": "Gold", "SI=F": "Silver", "CL=F": "Crude Oil",
        "NG=F": "Natural Gas", "HG=F": "Copper"
    },
    "forex": {
        "EURUSD=X": "EUR/USD", "GBPUSD=X": "GBP/USD",
        "USDJPY=X": "USD/JPY", "USDTRY=X": "USD/TRY"
    },
    "stocks": {
        "AAPL": "Apple", "TSLA": "Tesla", "MSFT": "Microsoft",
        "GOOGL": "Google", "AMZN": "Amazon", "NVDA": "NVIDIA"
    }
}

def fetch_single(symbol):
    try:
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d"
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            meta = r.json()['chart']['result'][0]['meta']
            price = meta.get('regularMarketPrice', 0)
            prev = meta.get('previousClose', 1)
            return {"price": price, "change_percent": ((price - prev) / prev * 100) if prev else 0}
    except:
        pass
    return None

def fetch_prices():
    global world_prices
    for cat, syms in TICKERS.items():
        for sym, name in syms.items():
            data = fetch_single(sym)
            if data:
                world_prices[sym] = {
                    "name": name, "price": data["price"],
                    "change_percent": data["change_percent"],
                    "category": cat, "updated": datetime.now().isoformat()
                }
            else:
                world_prices[sym] = {
                    "name": name, "price": 100 if cat == "forex" else 1000,
                    "change_percent": 0, "category": cat,
                    "updated": datetime.now().isoformat(), "demo": True
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