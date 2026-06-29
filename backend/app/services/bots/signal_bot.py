import threading, time, requests
from datetime import datetime

class SignalBot:
    def __init__(self, symbol="BTCUSDT", capital=100, signal_source="tradingview"):
        self.symbol = symbol
        self.capital = capital
        self.signal_source = signal_source
        self.active = False
        self.positions = []  # Aynı anda hem LONG hem SHORT tutabilir
        self.trades = []
        self.total_profit = 0
        self.current_price = 60000

    def fetch_signal(self):
        """Harici sinyal kaynağından sinyal çeker (şimdilik simüle)"""
        import random
        signals = ["STRONG_BUY", "BUY", "NEUTRAL", "SELL", "STRONG_SELL"]
        weights = [0.15, 0.25, 0.3, 0.2, 0.1]
        return random.choices(signals, weights=weights)[0]

    def execute_signal(self, signal):
        if signal in ["STRONG_BUY", "BUY"]:
            if len([p for p in self.positions if p["type"] == "LONG"]) == 0:
                amount = self.capital * (0.5 if signal == "STRONG_BUY" else 0.3)
                self.positions.append({
                    "type":"LONG","entry":self.current_price,
                    "amount":amount,"target":self.current_price*1.02,
                    "stop":self.current_price*0.98,"signal":signal,
                    "time":datetime.now().isoformat()
                })
        elif signal in ["STRONG_SELL", "SELL"]:
            if len([p for p in self.positions if p["type"] == "SHORT"]) == 0:
                amount = self.capital * (0.5 if signal == "STRONG_SELL" else 0.3)
                self.positions.append({
                    "type":"SHORT","entry":self.current_price,
                    "amount":amount,"target":self.current_price*0.98,
                    "stop":self.current_price*1.02,"signal":signal,
                    "time":datetime.now().isoformat()
                })

    def check_positions(self):
        for pos in self.positions[:]:
            if pos["type"] == "LONG":
                if self.current_price >= pos["target"] or self.current_price <= pos["stop"]:
                    profit = pos["amount"] * ((self.current_price - pos["entry"]) / pos["entry"])
                    self.total_profit += profit
                    self.trades.append({"type":"LONG","entry":pos["entry"],"exit":round(self.current_price,2),"profit":round(profit,2),"signal":pos["signal"],"time":datetime.now().isoformat()})
                    self.positions.remove(pos)
            else:
                if self.current_price <= pos["target"] or self.current_price >= pos["stop"]:
                    profit = pos["amount"] * ((pos["entry"] - self.current_price) / pos["entry"])
                    self.total_profit += profit
                    self.trades.append({"type":"SHORT","entry":pos["entry"],"exit":round(self.current_price,2),"profit":round(profit,2),"signal":pos["signal"],"time":datetime.now().isoformat()})
                    self.positions.remove(pos)

    def run(self):
        self.active = True
        def loop():
            while self.active:
                self.current_price *= (1 + __import__('random').uniform(-0.01, 0.01))
                signal = self.fetch_signal()
                self.execute_signal(signal)
                self.check_positions()
                time.sleep(20)
        threading.Thread(target=loop, daemon=True).start()
        return {"status":"started","symbol":self.symbol,"source":self.signal_source}

    def stop(self):
        self.active = False
        for pos in self.positions:
            if pos["type"] == "LONG":
                profit = pos["amount"] * ((self.current_price - pos["entry"]) / pos["entry"])
            else:
                profit = pos["amount"] * ((pos["entry"] - self.current_price) / pos["entry"])
            self.total_profit += profit
        self.positions = []
        return {"status":"stopped","total_profit":round(self.total_profit,2)}

    def get_status(self):
        return {"symbol":self.symbol,"active":self.active,"positions":len(self.positions),"total_profit":round(self.total_profit,2),"trades":len(self.trades)}