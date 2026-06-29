import threading, time, requests, random
from datetime import datetime
from app.core.config import settings

class AIOptimizeBot:
    def __init__(self, symbol="BTCUSDT", capital=100):
        self.symbol = symbol
        self.capital = capital
        self.active = False
        self.current_price = 60000
        self.position = None
        self.trades = []
        self.total_profit = 0
        self.risk_profile = "balanced"  # conservative, balanced, aggressive
        self.ml_scores = {"buy":0,"sell":0,"hold":0}

    def _get_market_data(self):
        """CoinMarketCap'ten piyasa verilerini çeker"""
        try:
            url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
            headers = {"X-CMC_PRO_API_KEY": settings.CMC_API_KEY}
            r = requests.get(url, headers=headers, params={"start":1,"limit":100,"convert":"USD"}, timeout=10)
            for coin in r.json().get("data",[]):
                if coin["symbol"] == self.symbol.replace("USDT",""):
                    return {
                        "price": coin["quote"]["USD"]["price"],
                        "change_1h": coin["quote"]["USD"]["percent_change_1h"],
                        "change_24h": coin["quote"]["USD"]["percent_change_24h"],
                        "volume": coin["quote"]["USD"]["volume_24h"],
                        "market_cap": coin["quote"]["USD"]["market_cap"]
                    }
        except: pass
        return None

    def ai_analyze(self):
        """Yapay zeka analizi - çoklu gösterge değerlendirmesi"""
        data = self._get_market_data()
        if not data: return "HOLD", 50
        
        scores = {"buy":0, "sell":0}
        reasons = []

        # RSI benzeri hesaplama
        change = data.get("change_1h", 0)
        if change < -3: scores["buy"] += 25; reasons.append("Aşırı satım bölgesi")
        elif change > 3: scores["sell"] += 25; reasons.append("Aşırı alım bölgesi")

        # Hacim analizi
        volume = data.get("volume", 0)
        if volume > 1e10: scores["buy"] += 15; reasons.append("Yüksek hacim")

        # Trend analizi
        change_24h = data.get("change_24h", 0)
        if change_24h > 5: scores["sell"] += 15; reasons.append("Güçlü yükseliş - düzeltme beklenebilir")
        elif change_24h < -5: scores["buy"] += 20; reasons.append("Güçlü düşüş - toparlanma beklenebilir")

        # Risk profiline göre ayarla
        if self.risk_profile == "aggressive":
            scores["buy"] *= 1.3; scores["sell"] *= 1.3
        elif self.risk_profile == "conservative":
            scores["buy"] *= 0.7; scores["sell"] *= 0.7

        total = scores["buy"] + scores["sell"]
        if scores["buy"] > scores["sell"] * 1.3:
            confidence = min((scores["buy"] / (total or 1)) * 100, 95)
            return "BUY", confidence
        elif scores["sell"] > scores["buy"] * 1.3:
            confidence = min((scores["sell"] / (total or 1)) * 100, 95)
            return "SELL", confidence
        return "HOLD", 50

    def run(self):
        self.active = True
        def loop():
            while self.active:
                self.current_price = self._get_market_data()["price"] if self._get_market_data() else self.current_price
                signal, confidence = self.ai_analyze()
                
                if not self.position and signal != "HOLD" and confidence > 65:
                    if signal == "BUY":
                        self.position = {"type":"LONG","entry":self.current_price,"amount":self.capital*0.5,"confidence":confidence}
                    else:
                        self.position = {"type":"SHORT","entry":self.current_price,"amount":self.capital*0.5,"confidence":confidence}
                
                if self.position:
                    if self.position["type"] == "LONG":
                        pnl_pct = (self.current_price - self.position["entry"]) / self.position["entry"]
                    else:
                        pnl_pct = (self.position["entry"] - self.current_price) / self.position["entry"]
                    
                    if pnl_pct > 0.03 or pnl_pct < -0.02:
                        profit = self.position["amount"] * pnl_pct
                        self.total_profit += profit
                        self.trades.append({"type":self.position["type"],"entry":self.position["entry"],"exit":round(self.current_price,2),"profit":round(profit,2),"time":datetime.now().isoformat()})
                        self.position = None
                
                time.sleep(30)
        threading.Thread(target=loop, daemon=True).start()
        return {"status":"started","symbol":self.symbol,"risk_profile":self.risk_profile}

    def stop(self):
        self.active = False
        return {"status":"stopped","total_profit":round(self.total_profit,2)}

    def get_status(self):
        return {"symbol":self.symbol,"active":self.active,"price":round(self.current_price,2),"profit":round(self.total_profit,2),"position":self.position is not None}