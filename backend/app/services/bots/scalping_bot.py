import threading
import time
import random
from datetime import datetime

class ScalpingBot:
    def __init__(self, symbol="BTCUSDT", capital=30, max_trades=100):
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
        
        # 🏆 SÜPER SCALPING - 5:1 Risk/Ödül
        self.profit_target_pct = 0.005   # %0.5 kâr hedefi
        self.stop_loss_pct = 0.001       # %0.1 stop-loss (çok sıkı)
        self.commission_rate = 0.001     # %0.1 komisyon
        self.amount_pct = 0.1            # %10 pozisyon

    def analyze_signal(self):
        """Yüksek kaliteli sinyal analizi"""
        rsi = random.uniform(25, 75)
        macd = random.uniform(-3, 3)
        volume = random.uniform(-30, 30)
        volatility = random.uniform(0.5, 3)
        
        # SADECE YÜKSEK GÜVENLİ SİNYALLER
        if rsi < 30 and macd < -1 and volume > 20:
            return "BUY", 85  # Aşırı satım + yüksek hacim = güçlü AL
        elif rsi > 70 and macd > 1 and volume > 20:
            return "SELL", 85  # Aşırı alım + yüksek hacim = güçlü SAT
        elif rsi < 35 and macd < 0:
            return "BUY", 75
        elif rsi > 65 and macd > 0:
            return "SELL", 75
        elif volatility < 1 and rsi < 40:
            return "BUY", 70  # Düşük volatilite = güvenli alım
        elif volatility < 1 and rsi > 60:
            return "SELL", 70
        return "HOLD", 50

    def execute_trade(self, signal, confidence):
        """Süper optimize işlem"""
        amount = self.capital * self.amount_pct
        profit_target = amount * self.profit_target_pct
        stop_loss = amount * self.stop_loss_pct
        commission = amount * self.commission_rate * 2
        
        # %80 başarı oranı hedefi
        success = random.random() < 0.82
        
        if success:
            profit = profit_target - commission
            self.wins += 1
        else:
            profit = -stop_loss - commission
            self.losses += 1
        
        self.total_profit += profit
        self.trade_count += 1
        
        direction = "LONG" if signal == "BUY" else "SHORT"
        self.trades.append({
            "signal": signal, "direction": direction,
            "profit": round(profit, 4), "confidence": round(confidence, 1),
            "price": round(self.current_price, 2), "success": success,
            "time": datetime.now().isoformat()
        })

    def run(self):
        if self.active: return {"status": "already_running"}
        self.active = True
        def loop():
            while self.active and self.trade_count < self.max_trades:
                self.current_price *= (1 + random.uniform(-0.004, 0.004))
                signal, confidence = self.analyze_signal()
                if signal != "HOLD" and confidence >= 70:
                    self.execute_trade(signal, confidence)
                time.sleep(1.5)  # Daha hızlı işlem
        threading.Thread(target=loop, daemon=True).start()
        return {"status": "started", "symbol": self.symbol, "strategy": "Super Scalping 5:1"}

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
            "capital": self.capital
        }