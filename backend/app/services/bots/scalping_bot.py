import threading
import time
import random
from datetime import datetime

class ScalpingBot:
    def __init__(self, symbol="BTCUSDT", capital=30):
        self.symbol = symbol
        self.capital = capital
        self.active = False
        self.trades = []
        self.total_profit = 0
        self.current_price = 60000
        self.trade_count = 0
        self.wins = 0
        self.losses = 0

    def analyze_signal(self):
        rsi = random.uniform(25, 75)
        if rsi < 35: return "BUY", 70
        elif rsi > 65: return "SELL", 70
        return "HOLD", 50

    def execute_trade(self, signal, confidence):
        amount = self.capital * 0.1
        success = random.random() < (confidence / 100)
        if success:
            profit = amount * 0.005
            self.wins += 1
        else:
            profit = -amount * 0.003
            self.losses += 1
        self.total_profit += profit
        self.trade_count += 1
        self.trades.append({
            "signal": signal, "profit": round(profit, 2),
            "confidence": confidence, "time": datetime.now().isoformat()
        })

    def run(self):
        self.active = True
        def loop():
            while self.active:
                self.current_price *= (1 + random.uniform(-0.005, 0.005))
                signal, confidence = self.analyze_signal()
                if signal != "HOLD":
                    self.execute_trade(signal, confidence)
                time.sleep(5)
        threading.Thread(target=loop, daemon=True).start()
        return {"status": "started", "symbol": self.symbol}

    def stop(self):
        self.active = False
        return {"status": "stopped", "total_profit": round(self.total_profit, 2)}

    def get_status(self):
        return {
            "symbol": self.symbol, "active": self.active,
            "total_profit": round(self.total_profit, 2),
            "trade_count": self.trade_count, "wins": self.wins, "losses": self.losses,
            "win_rate": round(self.wins / max(self.trade_count, 1) * 100, 1)
        }