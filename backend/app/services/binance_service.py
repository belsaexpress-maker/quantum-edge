import random
import threading
import time
from datetime import datetime

# Binance benzeri demo veri
live_prices = {}
balance = {"USDT": 10000.00, "BTC": 0.15, "ETH": 2.5}
orders = []
trade_history = []

SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "ADAUSDT", "XRPUSDT", "DOGEUSDT"]

def init_prices():
    base = {"BTC": 60000, "ETH": 4000, "SOL": 200, "BNB": 500, "ADA": 0.50, "XRP": 1.00, "DOGE": 0.07}
    for sym in SYMBOLS:
        coin = sym.replace("USDT", "")
        live_prices[sym] = {
            "price": base.get(coin, 100),
            "change_24h": random.uniform(-5, 5),
            "high_24h": base.get(coin, 100) * 1.05,
            "low_24h": base.get(coin, 100) * 0.95,
            "volume": random.uniform(1000000, 10000000),
        }

def price_updater():
    while True:
        for sym in live_prices:
            change = random.uniform(-0.002, 0.002)
            live_prices[sym]["price"] *= (1 + change)
        time.sleep(1)  # Her saniye güncelle

def get_live_prices():
    return live_prices

def get_balance():
    return balance

def place_order(symbol: str, side: str, quantity: float, order_type: str = "MARKET"):
    symbol = symbol.upper()
    if side.upper() == "BUY":
        cost = quantity * live_prices.get(symbol, {}).get("price", 0)
        if balance["USDT"] >= cost:
            balance["USDT"] -= cost
            coin = symbol.replace("USDT", "")
            balance[coin] = balance.get(coin, 0) + quantity * 0.999
            trade_history.append({"symbol": symbol, "side": "BUY", "quantity": quantity, "price": live_prices[symbol]["price"], "time": datetime.now().isoformat()})
            return {"success": True, "message": f"Bought {quantity} {symbol}"}
        return {"success": False, "error": "Yetersiz bakiye"}
    else:
        coin = symbol.replace("USDT", "")
        if balance.get(coin, 0) >= quantity:
            balance[coin] -= quantity
            balance["USDT"] += quantity * live_prices.get(symbol, {}).get("price", 0) * 0.999
            trade_history.append({"symbol": symbol, "side": "SELL", "quantity": quantity, "price": live_prices[symbol]["price"], "time": datetime.now().isoformat()})
            return {"success": True, "message": f"Sold {quantity} {symbol}"}
        return {"success": False, "error": "Yetersiz bakiye"}

init_prices()
threading.Thread(target=price_updater, daemon=True).start()