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
        
        # 🏆 PROFESYONEL SCALPING PARAMETRELERİ
        self.profit_target_pct = 0.004  # %0.4 kâr hedefi
        self.stop_loss_pct = 0.002      # %0.2 stop-loss
        self.commission_rate = 0.001    # %0.1 komisyon (Binance)
        self.amount_pct = 0.1           # Sermayenin %10'u ile işlem

    def analyze_signal(self):
        """RSI + MACD + Hacim analizi (simülasyon)"""
        rsi = random.uniform(25, 75)
        
        if rsi < 35:
            return "BUY", random.uniform(70, 85)  # Yüksek güven
        elif rsi > 65:
            return "SELL", random.uniform(70, 85)
        elif rsi < 45:
            return "BUY", random.uniform(55, 70)  # Orta güven
        elif rsi > 55:
            return "SELL", random.uniform(55, 70)
        return "HOLD", 50

    def execute_trade(self, signal, confidence):
        """Profesyonel scalping işlemi gerçekleştir"""
        amount = self.capital * self.amount_pct
        
        # Kâr hedefi ve stop-loss hesaplama
        profit_target = amount * self.profit_target_pct
        stop_loss = amount * self.stop_loss_pct
        commission = amount * self.commission_rate * 2  # Alım + satım
        
        # %70-75 başarı oranı simülasyonu
        success = random.random() < 0.72  # %72 başarı
        
        if success:
            profit = profit_target - commission
            self.wins += 1
        else:
            profit = -stop_loss - commission
            self.losses += 1
        
        self.total_profit += profit
        self.trade_count += 1
        
        self.trades.append({
            "signal": signal,
            "profit": round(profit, 4),
            "confidence": round(confidence, 1),
            "price": round(self.current_price, 2),
            "success": success,
            "time": datetime.now().isoformat()
        })
        
        return profit

    def run(self):
        if self.active:
            return {"status": "already_running"}
        
        self.active = True
        
        def loop():
            while self.active and self.trade_count < self.max_trades:
                # Fiyat hareketi simülasyonu (±%0.3)
                self.current_price *= (1 + random.uniform(-0.003, 0.003))
                
                signal, confidence = self.analyze_signal()
                if signal != "HOLD":
                    self.execute_trade(signal, confidence)
                
                time.sleep(2)  # 2 saniyede bir işlem
        
        threading.Thread(target=loop, daemon=True).start()
        return {
            "status": "started",
            "symbol": self.symbol,
            "capital": self.capital,
            "strategy": "Professional Scalping",
            "profit_target": f"%{self.profit_target_pct * 100}",
            "stop_loss": f"%{self.stop_loss_pct * 100}"
        }

    def stop(self):
        self.active = False
        return {
            "status": "stopped",
            "total_profit": round(self.total_profit, 4),
            "total_trades": self.trade_count,
            "win_rate": f"%{round(self.wins / max(self.trade_count, 1) * 100, 1)}"
        }

    def get_status(self):
        return {
            "symbol": self.symbol,
            "active": self.active,
            "current_price": round(self.current_price, 2),
            "total_profit": round(self.total_profit, 4),
            "trade_count": self.trade_count,
            "wins": self.wins,
            "losses": self.losses,
            "win_rate": round(self.wins / max(self.trade_count, 1) * 100, 1),
            "trades": len(self.trades),
            "recent_trades": self.trades[-10:],
            "capital": self.capital,
            "profit_target_pct": self.profit_target_pct,
            "stop_loss_pct": self.stop_loss_pct
        }