import threading
import time
import random
from datetime import datetime

class ScalpingBot:
    def __init__(self, symbol="BTCUSDT", capital=100, max_trades=50):
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
    
    def analyze_signal(self):
        """AI sinyal analizi (RSI + MACD + Hacim)"""
        rsi = random.uniform(25, 75)
        macd = random.uniform(-50, 50)
        volume = random.uniform(-30, 50)
        
        buy_score = 0
        sell_score = 0
        
        if rsi < 35: buy_score += 30
        elif rsi > 65: sell_score += 30
        
        if macd > 10: buy_score += 25
        elif macd < -10: sell_score += 25
        
        if volume > 20: buy_score += 20
        elif volume < -20: sell_score += 20
        
        if buy_score > sell_score + 15:
            return "BUY", min(buy_score, 95)
        elif sell_score > buy_score + 15:
            return "SELL", min(sell_score, 95)
        return "HOLD", 50
    
    def execute_trade(self, signal, confidence):
        """İşlemi gerçekleştir"""
        amount = self.capital * 0.1
        entry = self.current_price
        
        if signal == "BUY":
            target = entry * 1.005  # %0.5 kâr hedefi
            stop_loss = entry * 0.997  # %0.3 stop
        else:
            target = entry * 0.995
            stop_loss = entry * 1.003
        
        # Sonucu simüle et
        success = random.random() < (confidence / 100)
        if success:
            profit = amount * 0.005  # %0.5 kâr
            self.wins += 1
        else:
            profit = -amount * 0.003  # %0.3 zarar
            self.losses += 1
        
        self.total_profit += profit
        self.trade_count += 1
        
        self.trades.append({
            "signal": signal,
            "entry": round(entry, 2),
            "target": round(target, 2),
            "stop": round(stop_loss, 2),
            "profit": round(profit, 2),
            "confidence": confidence,
            "time": datetime.now().isoformat()
        })
    
    def run(self):
        self.active = True
        
        def loop():
            while self.active and self.trade_count < self.max_trades:
                self.current_price *= (1 + random.uniform(-0.01, 0.01))
                signal, confidence = self.analyze_signal()
                if signal != "HOLD":
                    self.execute_trade(signal, confidence)
                time.sleep(5)  # 5 saniyede bir
        
        threading.Thread(target=loop, daemon=True).start()
        return {"status": "started", "symbol": self.symbol}
    
    def stop(self):
        self.active = False
        return {"status": "stopped", "total_profit": round(self.total_profit, 2)}
    
    def get_status(self):
        return {
            "symbol": self.symbol,
            "active": self.active,
            "total_profit": round(self.total_profit, 2),
            "trade_count": self.trade_count,
            "wins": self.wins,
            "losses": self.losses,
            "win_rate": round(self.wins / max(self.trade_count, 1) * 100, 1),
            "recent_trades": self.trades[-10:]
        }