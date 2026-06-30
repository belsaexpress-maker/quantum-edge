import threading
import time
import random
from datetime import datetime

class ScalpingBot:
    def __init__(self, symbol="BTCUSDT", capital=30, max_trades=50):
        self.symbol = symbol
        self.capital = capital
        self.max_trades = max_trades
        self.active = False
        self.trades = []
        self.total_profit = 0
        self.current_price = 60000
        self.trade_count = 0
        self.wins = 0
        self.losses = 0
        
        # 🏆 PROFESYONEL PARAMETRELER
        self.profit_target_pct = 0.004  # %0.4
        self.stop_loss_pct = 0.002      # %0.2
        self.commission_rate = 0.001    # %0.1
        self.amount_pct = 0.1           # %10

    def analyze_signal(self):
        """RSI + MACD + Hacim analizi (simülasyon)"""
        rsi = random.uniform(20, 80)
        macd = random.uniform(-3, 3)
        volume = random.uniform(-30, 30)
        
        # 🎯 ÇİFT YÖNLÜ SİNYAL
        if rsi < 30 and macd < 0:
            return "BUY", random.uniform(75, 90)  # Aşırı satım = AL
        elif rsi > 70 and macd > 0:
            return "SELL", random.uniform(75, 90)  # Aşırı alım = SAT
        elif rsi < 40 and volume > 10:
            return "BUY", random.uniform(60, 75)
        elif rsi > 60 and volume > 10:
            return "SELL", random.uniform(60, 75)
        elif macd > 1:
            return "BUY", random.uniform(55, 65)
        elif macd < -1:
            return "SELL", random.uniform(55, 65)
        return "HOLD", 50

    def execute_trade(self, signal, confidence):
        """Profesyonel işlem - LONG ve SHORT"""
        amount = self.capital * self.amount_pct
        
        profit_target = amount * self.profit_target_pct
        stop_loss = amount * self.stop_loss_pct
        commission = amount * self.commission_rate * 2
        
        success = random.random() < 0.72
        
        if success:
            profit = profit_target - commission
            self.wins += 1
        else:
            profit = -stop_loss - commission
            self.losses += 1
        
        self.total_profit += profit
        self.trade_count += 1
        
        # SHORT işlemlerde fiyat düşüşünden kazanır
        direction = "LONG" if signal == "BUY" else "SHORT"
        
        self.trades.append({
            "signal": signal,
            "direction": direction,
            "profit": round(profit, 4),
            "confidence": round(confidence, 1),
            "price": round(self.current_price, 2),
            "success": success,
            "time": datetime.now().isoformat()
        })

    def run(self):
        if self.active:
            return {"status": "already_running"}
        self.active = True
        def loop():
            while self.active and self.trade_count < self.max_trades:
                self.current_price *= (1 + random.uniform(-0.005, 0.005))
                signal, confidence = self.analyze_signal()
                if signal != "HOLD":
                    self.execute_trade(signal, confidence)
                time.sleep(2)
        threading.Thread(target=loop, daemon=True).start()
        return {"status": "started", "symbol": self.symbol, "mode": "LONG+SHORT"}

    def stop(self):
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
            "recent_trades": self.trades[-10:],
            "capital": self.capital, "mode": "LONG+SHORT"
        }