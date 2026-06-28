import threading
import time
import random
from datetime import datetime

class MomentumBot:
    def __init__(self, symbol="BTCUSDT", capital=100):
        self.symbol = symbol
        self.capital = capital
        self.active = False
        self.position = None
        self.trades = []
        self.total_profit = 0
        self.current_price = 60000
    
    def detect_trend(self):
        """Trend tespiti"""
        momentum = random.uniform(-3, 3)
        volume = random.uniform(0.5, 4)
        
        if momentum > 1.5 and volume > 2:
            return "BULLISH", min(60 + abs(momentum) * 10, 95)
        elif momentum < -1.5 and volume > 2:
            return "BEARISH", min(60 + abs(momentum) * 10, 95)
        return "NEUTRAL", 50
    
    def open_position(self, trend, confidence):
        """Pozisyon aç"""
        amount = self.capital * 0.5
        
        if trend == "BULLISH":
            entry = self.current_price
            target = entry * (1 + random.uniform(0.02, 0.05))
            stop = entry * 0.98
        else:
            entry = self.current_price
            target = entry * (1 - random.uniform(0.02, 0.05))
            stop = entry * 1.02
        
        self.position = {
            "type": "LONG" if trend == "BULLISH" else "SHORT",
            "entry": entry,
            "target": target,
            "stop": stop,
            "amount": amount,
            "confidence": confidence,
            "time": datetime.now().isoformat()
        }
    
    def close_position(self):
        """Pozisyon kapat"""
        if not self.position:
            return
        
        if self.position["type"] == "LONG":
            profit_pct = (self.current_price - self.position["entry"]) / self.position["entry"]
        else:
            profit_pct = (self.position["entry"] - self.current_price) / self.position["entry"]
        
        profit = self.position["amount"] * profit_pct
        self.total_profit += profit
        
        self.trades.append({
            "type": self.position["type"],
            "entry": self.position["entry"],
            "exit": self.current_price,
            "profit": round(profit, 2),
            "time": datetime.now().isoformat()
        })
        
        self.position = None
    
    def check_stop_target(self):
        """Stop loss ve hedef kontrolü"""
        if not self.position:
            return
        
        if self.position["type"] == "LONG":
            if self.current_price >= self.position["target"]:
                self.close_position()
            elif self.current_price <= self.position["stop"]:
                self.close_position()
        else:
            if self.current_price <= self.position["target"]:
                self.close_position()
            elif self.current_price >= self.position["stop"]:
                self.close_position()
    
    def run(self):
        self.active = True
        
        def loop():
            while self.active:
                self.current_price *= (1 + random.uniform(-0.02, 0.02))
                
                if self.position:
                    self.check_stop_target()
                else:
                    trend, confidence = self.detect_trend()
                    if trend != "NEUTRAL" and confidence > 65:
                        self.open_position(trend, confidence)
                
                time.sleep(15)
        
        threading.Thread(target=loop, daemon=True).start()
        return {"status": "started", "symbol": self.symbol}
    
    def stop(self):
        if self.position:
            self.close_position()
        self.active = False
        return {"status": "stopped", "total_profit": round(self.total_profit, 2)}
    
    def get_status(self):
        return {
            "symbol": self.symbol,
            "active": self.active,
            "current_price": round(self.current_price, 2),
            "total_profit": round(self.total_profit, 2),
            "position": self.position,
            "recent_trades": self.trades[-10:]
        }