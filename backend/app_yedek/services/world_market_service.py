import requests
import threading
import time
from datetime import datetime

world_prices = {}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

TICKERS = {
    "indices": {
        "^GSPC": "S&P 500",
        "^DJI": "Dow Jones",
        "^IXIC": "NASDAQ",
        "^FTSE": "FTSE 100",
        "^N225": "Nikkei 225",
        "^GDAXI": "DAX",
        "^HSI": "Hang Seng"
    },
    "commodities": {
        "GC=F": "Gold",
        "SI=F": "Silver",
        "CL=F": "Crude Oil",
        "NG=F": "Natural Gas",
        "HG=F": "Copper"
    },
    "forex": {
        "EURUSD=X": "EUR/USD",
        "GBPUSD=X": "GBP/USD",
        "USDJPY=X": "USD/JPY",
        "USDTRY=X": "USD/TRY"
    },
    "stocks": {
        "AAPL": "Apple",
        "TSLA": "Tesla",
        "MSFT": "Microsoft",
        "GOOGL": "Google",
        "AMZN": "Amazon",
        "NVDA": "NVIDIA"
    }
}

def fetch_single_price(symbol):
    try:
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d"
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            data = response.json()
            result = data.get('chart', {}).get('result', [])
            if result:
                meta = result[0].get('meta', {})
                return {
                    "price": meta.get('regularMarketPrice', 0),
                    "previous_close": meta.get('previousClose', 0),
                    "change": meta.get('regularMarketPrice', 0) - meta.get('previousClose', 0),
                    "change_percent": ((meta.get('regularMarketPrice', 0) - meta.get('previousClose', 0)) / meta.get('previousClose', 1) * 100) if meta.get('previousClose', 0) else 0
                }
        return None
    except:
        return None

def fetch_prices():
    global world_prices
    for category, symbols in TICKERS.items():
        for sym, name in symbols.items():
            price_data = fetch_single_price(sym)
            if price_data:
                world_prices[sym] = {
                    "name": name,
                    "symbol": sym,
                    "price": price_data["price"],
                    "change": price_data["change"],
                    "change_percent": price_data["change_percent"],
                    "category": category,
                    "updated": datetime.now().isoformat()
                }
            else:
                # Demo veri
                world_prices[sym] = {
                    "name": name,
                    "symbol": sym,
                    "price": 100 if category == "forex" else 1000,
                    "change": 0,
                    "change_percent": 0,
                    "category": category,
                    "updated": datetime.now().isoformat(),
                    "demo": True
                }

def start_world_market_service():
    try:
        fetch_prices()
        print(f"World market service started with {len(world_prices)} assets")
    except Exception as e:
        print(f"World market service error: {e}")
    def updater():
        while True:
            time.sleep(300)
            fetch_prices()
    threading.Thread(target=updater, daemon=True).start()

def get_world_prices():
    return world_prices