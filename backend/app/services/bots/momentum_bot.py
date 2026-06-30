import threading
import time
import random
from datetime import datetime

class MomentumBot:
    def __init__(self, symbol="BTCUSDT", capital=20):
        self.symbol = symbol
        self.capital = capital
        self.active = False
        self.position = None
        self.trades = []
        self.total_profit = 0
        self.current_price = 60000
        self.trade_count = 0

    def detect_trend(self):
        momentum = random.uniform(-3, 3)
        if momentum > 1.5: return "BULLISH", min(60 + abs(momentum) * 10, 95)
        elif momentum < -1.5: return "BEARISH", min(60 + abs(momentum) * 10, 95)
        return "NEUTRAL", 50

    def open_position(self, trend, confidence):
        if trend == "BULLISH":
            self.position = {
                "type": "LONG", "entry": self.current_price,
                "target": self.current_price * 1.02,
                "stop": self.current_price * 0.98
            }
        else:
            self.position = {
                "type": "SHORT", "entry": self.current_price,
                "target": self.current_price * 0.98,
                "stop": self.current_price * 1.02
            }

    def close_position(self, reason="target"):
        if not self.position: return
        if self.position["type"] == "LONG":
            profit_pct = (self.current_price - self.position["entry"]) / self.position["entry"]
        else:
            profit_pct = (self.position["entry"] - self.current_price) / self.position["entry"]
        profit = self.capital * profit_pct
        self.total_profit += profit
        self.trades.append({
            "type": self.position["type"], "entry": round(self.position["entry"], 2),
            "exit": round(self.current_price, 2), "profit": round(profit, 2),
            "reason": reason, "time": datetime.now().isoformat()
        })
        self.trade_count += 1
        self.position = None

    def check_stop_target(self):
        if not self.position: return
        if self.position["type"] == "LONG":
            if self.current_price >= self.position["target"]: self.close_position("target")
            elif self.current_price <= self.position["stop"]: self.close_position("stop")
        else:
            if self.current_price <= self.position["target"]: self.close_position("target")
            elif self.current_price >= self.position["stop"]: self.close_position("stop")

    def run(self):
        if self.active:
            return {"status": "already_running"}
        self.active = True
        def loop():
            while self.active:
                self.current_price *= (1 + random.uniform(-0.005, 0.005))
                if self.position: self.check_stop_target()
                else:
                    trend, confidence = self.detect_trend()
                    if trend != "NEUTRAL" and confidence > 65: self.open_position(trend, confidence)
                time.sleep(5)
        threading.Thread(target=loop, daemon=True).start()
        return {"status": "started", "symbol": self.symbol, "capital": self.capital}

    def stop(self):
        if self.position: self.close_position("stopped")
        self.active = False
        return {"status": "stopped", "total_profit": round(self.total_profit, 2)}

    def get_status(self):
        return {
            "symbol": self.symbol,
            "active": self.active,
            "current_price": round(self.current_price, 2),
            "total_profit": round(self.total_profit, 2),
            "trade_count": self.trade_count,
            "trades": len(self.trades),
            "recent_trades": self.trades[-10:],
            "has_position": self.position is not None,
            "capital": self.capital
        }