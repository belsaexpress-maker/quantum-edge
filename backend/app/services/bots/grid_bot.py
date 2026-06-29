import threading, time, random, requests
from datetime import datetime
from app.core.config import settings

class GridBot:
    def __init__(self, symbol="BTCUSDT", capital=50, grid_levels=5, grid_spacing=0.01):
        self.symbol = symbol
        self.capital = capital
        self.grid_levels = grid_levels
        self.grid_spacing = grid_spacing
        self.per_level = capital / grid_levels
        self.active = False
        self.positions = []
        self.trades = []
        self.total_profit = 0
        self.current_price = self._get_live_price()

    def _get_live_price(self):
        try:
            url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
            headers = {"X-CMC_PRO_API_KEY": settings.CMC_API_KEY}
            r = requests.get(url, headers=headers, params={"start": 1, "limit": 1000, "convert": "USD"}, timeout=10)
            for coin in r.json().get("data", []):
                if coin["symbol"] == self.symbol.replace("USDT", ""):
                    return coin["quote"]["USD"]["price"]
        except: pass
        return 60000

    def setup_grid(self):
        self.positions = []
        for i in range(self.grid_levels):
            buy = self.current_price * (1 - self.grid_spacing * (i + 1))
            sell = self.current_price * (1 + self.grid_spacing * (i + 1))
            self.positions.append({"level": i+1, "buy": round(buy,2), "sell": round(sell,2), "active": False})

    def run(self):
        self.active = True
        self.setup_grid()
        def loop():
            while self.active:
                self.current_price = self._get_live_price()
                for p in self.positions:
                    if not p["active"] and self.current_price <= p["buy"]:
                        p["active"] = True
                        self.trades.append({"type":"BUY","price":round(self.current_price,2),"level":p["level"],"time":datetime.now().isoformat()})
                    elif p["active"] and self.current_price >= p["sell"]:
                        profit = (p["sell"]-p["buy"])/p["buy"]*self.per_level
                        self.total_profit += profit
                        p["active"] = False
                        self.trades.append({"type":"SELL","price":round(self.current_price,2),"profit":round(profit,2),"level":p["level"],"time":datetime.now().isoformat()})
                time.sleep(30)
        threading.Thread(target=loop, daemon=True).start()
        return {"status":"started","symbol":self.symbol}

    def stop(self):
        self.active = False
        return {"status":"stopped","total_profit":round(self.total_profit,2)}

    def get_status(self):
        return {"symbol":self.symbol,"active":self.active,"price":round(self.current_price,2),"profit":round(self.total_profit,2),"trades":len(self.trades)}