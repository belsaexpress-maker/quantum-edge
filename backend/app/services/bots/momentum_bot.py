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
        self.wins = 0
        self.losses = 0
        
        # 🏆 SÜPER MOMENTUM
        self.profit_target_pct = 0.03   # %3 kâr hedefi
        self.stop_loss_pct = 0.005      # %0.5 stop-loss (çok sıkı)
        self.commission_rate = 0.001

    def detect_trend(self):
        momentum = random.uniform(-5, 5)
        # Sadece güçlü trendlerde işlem aç
        if momentum > 2.0: return "BULLISH", min(65 + abs(momentum) * 5, 95)
        elif momentum < -2.0: return "BEARISH", min(65 + abs(momentum) * 5, 95)
        return "NEUTRAL", 50

    def open_position(self, trend, confidence):
        if trend == "BULLISH":
            self.position = {
                "type": "LONG", "entry": self.current_price,
                "target": self.current_price * (1 + self.profit_target_pct),
                "stop": self.current_price * (1 - self.stop_loss_pct)
            }
        else:
            self.position = {
                "type": "SHORT", "entry": self.current_price,
                "target": self.current_price * (1 - self.profit_target_pct),
                "stop": self.current_price * (1 + self.stop_loss_pct)
            }

    def close_position(self, reason="target"):
        if not self.position: return
        if self.position["type"] == "LONG":
            profit_pct = (self.current_price - self.position["entry"]) / self.position["entry"]
        else:
            profit_pct = (self.position["entry"] - self.current_price) / self.position["entry"]
        
        gross_profit = self.capital * profit_pct
        commission = self.capital * self.commission_rate * 2
        net_profit = gross_profit - commission
        
        self.total_profit += net_profit
        self.trade_count += 1
        if net_profit > 0: self.wins += 1
        else: self.losses += 1
        
        self.trades.append({
            "type": self.position["type"],
            "entry": round(self.position["entry"], 2),
            "exit": round(self.current_price, 2),
            "profit": round(net_profit, 4), "reason": reason,
            "time": datetime.now().isoformat()
        })
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
        if self.active: return {"status": "already_running"}
        self.active = True
        def loop():
            while self.active:
                self.current_price *= (1 + random.uniform(-0.008, 0.008))
                if self.position: self.check_stop_target()
                else:
                    trend, confidence = self.detect_trend()
                    if trend != "NEUTRAL" and confidence > 70:
                        self.open_position(trend, confidence)
                time.sleep(4)
        threading.Thread(target=loop, daemon=True).start()
        return {"status": "started", "symbol": self.symbol, "strategy": "Super Momentum 6:1"}

    def stop(self):
        if self.position: self.close_position("stopped")
        self.active = False
        return {"status": "stopped", "total_profit": round(self.total_profit, 4)}

    def get_status(self):
        return {
            "symbol": self.symbol, "active": self.active,
            "current_price": round(self.current_price, 2),
            "total_profit": round(self.total_profit, 4),
            "trade_count": self.trade_count, "wins": self.wins,
            "losses": self.losses,
            "win_rate": round(self.wins / max(self.trade_count, 1) * 100, 1),
            "has_position": self.position is not None,
            "position_type": self.position["type"] if self.position else None,
            "recent_trades": self.trades[-10:], "capital": self.capital
        }