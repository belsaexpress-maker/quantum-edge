import threading, time, requests
from datetime import datetime
from app.core.config import settings

class DCABot:
    def __init__(self, symbol="BTCUSDT", capital=100, drop_threshold=5, max_buys=5):
        self.symbol = symbol
        self.capital = capital
        self.drop_threshold = drop_threshold  # % düşüş
        self.max_buys = max_buys
        self.per_buy = capital / max_buys
        self.active = False
        self.base_price = self._get_live_price()
        self.buys = []
        self.total_coins = 0
        self.total_spent = 0
        self.buy_count = 0
        self.current_price = self.base_price

    def _get_live_price(self):
        try:
            url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
            headers = {"X-CMC_PRO_API_KEY": settings.CMC_API_KEY}
            r = requests.get(url, headers=headers, params={"start":1,"limit":100,"convert":"USD"}, timeout=10)
            for coin in r.json().get("data",[]):
                if coin["symbol"] == self.symbol.replace("USDT",""):
                    return coin["quote"]["USD"]["price"]
        except: pass
        return 60000

    def run(self):
        self.active = True
        self.base_price = self._get_live_price()
        def loop():
            while self.active and self.buy_count < self.max_buys:
                self.current_price = self._get_live_price()
                drop_pct = ((self.base_price - self.current_price) / self.base_price) * 100
                if drop_pct >= self.drop_threshold * (self.buy_count + 1):
                    coins = self.per_buy / self.current_price
                    self.total_coins += coins
                    self.total_spent += self.per_buy
                    self.buy_count += 1
                    self.buys.append({
                        "level": self.buy_count, "price": round(self.current_price,2),
                        "drop": round(drop_pct,1), "coins": round(coins,6),
                        "spent": round(self.per_buy,2),
                        "time": datetime.now().isoformat()
                    })
                time.sleep(30)
        threading.Thread(target=loop, daemon=True).start()
        return {"status":"started","symbol":self.symbol,"base_price":self.base_price}

    def stop(self):
        self.active = False
        avg_price = self.total_spent / self.total_coins if self.total_coins > 0 else 0
        return {
            "status":"stopped","total_spent":round(self.total_spent,2),
            "total_coins":round(self.total_coins,6),
            "avg_price":round(avg_price,2),
            "current_price":round(self.current_price,2),
            "pnl_pct":round(((self.current_price - avg_price)/avg_price)*100,1) if avg_price > 0 else 0
        }

    def get_status(self):
        avg_price = self.total_spent / self.total_coins if self.total_coins > 0 else 0
        return {
            "symbol":self.symbol,"active":self.active,"base_price":self.base_price,
            "current_price":round(self.current_price,2),"buys":self.buy_count,
            "total_spent":round(self.total_spent,2),"total_coins":round(self.total_coins,6),
            "avg_price":round(avg_price,2)
        }