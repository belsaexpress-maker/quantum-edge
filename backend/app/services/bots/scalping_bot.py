import threading, time, random, requests
from datetime import datetime
from app.core.config import settings

class ScalpingBot:
    def __init__(self, symbol="BTCUSDT", capital=30):
        self.symbol = symbol
        self.capital = capital
        self.active = False
        self.trades = []
        self.total_profit = 0
        self.trade_count = 0
        self.wins = 0
        self.losses = 0
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

    def analyze_signal(self):
        rsi = random.uniform(25,75)
        if rsi < 35: return "BUY", 70
        elif rsi > 65: return "SELL", 70
        return "HOLD", 50

    def run(self):
        self.active = True
        def loop():
            while self.active and self.trade_count < 100:
                self.current_price = self._get_live_price()
                sig, conf = self.analyze_signal()
                if sig != "HOLD":
                    amount = self.capital * 0.1
                    success = random.random() < (conf/100)
                    profit = amount*0.005 if success else -amount*0.003
                    self.total_profit += profit
                    self.trade_count += 1
                    if success: self.wins += 1
                    else: self.losses += 1
                    self.trades.append({"signal":sig,"profit":round(profit,2),"time":datetime.now().isoformat()})
                time.sleep(15)
        threading.Thread(target=loop, daemon=True).start()
        return {"status":"started","symbol":self.symbol}

    def stop(self):
        self.active = False
        return {"status":"stopped","total_profit":round(self.total_profit,2)}

    def get_status(self):
        return {"symbol":self.symbol,"active":self.active,"profit":round(self.total_profit,2),"trades":self.trade_count,"wins":self.wins,"losses":self.losses}