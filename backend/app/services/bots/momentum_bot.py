import threading, time, random, requests
from datetime import datetime
from app.core.config import settings

class MomentumBot:
    def __init__(self, symbol="BTCUSDT", capital=20):
        self.symbol = symbol
        self.capital = capital
        self.active = False
        self.position = None
        self.trades = []
        self.total_profit = 0
        self.current_price = self._get_live_price()

    def _get_live_price(self):
        try:
            url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
            headers = {"X-CMC_PRO_API_KEY": settings.CMC_API_KEY}
            r = requests.get(url, headers=headers, params={"start":1,"limit":1000,"convert":"USD"}, timeout=10)
            for coin in r.json().get("data",[]):
                if coin["symbol"] == self.symbol.replace("USDT",""):
                    return coin["quote"]["USD"]["price"]
        except: pass
        return 60000

    def run(self):
        self.active = True
        def loop():
            while self.active:
                self.current_price = self._get_live_price()
                if self.position:
                    if self.position["type"] == "LONG":
                        if self.current_price >= self.position["target"] or self.current_price <= self.position["stop"]:
                            profit = self.capital * ((self.current_price - self.position["entry"]) / self.position["entry"])
                            self.total_profit += profit
                            self.trades.append({"type":"LONG","profit":round(profit,2),"time":datetime.now().isoformat()})
                            self.position = None
                else:
                    if random.random() > 0.7:
                        self.position = {"type":"LONG","entry":self.current_price,"target":self.current_price*1.02,"stop":self.current_price*0.98}
                time.sleep(30)
        threading.Thread(target=loop, daemon=True).start()
        return {"status":"started","symbol":self.symbol}

    def stop(self):
        self.active = False
        return {"status":"stopped","total_profit":round(self.total_profit,2)}

    def get_status(self):
        return {"symbol":self.symbol,"active":self.active,"price":round(self.current_price,2),"profit":round(self.total_profit,2),"trades":len(self.trades)}