import threading
import time
import random
from datetime import datetime

class GridBot:
    def __init__(self, symbol="BTCUSDT", capital=100, grid_levels=5, grid_spacing=0.01):
        self.symbol = symbol
        self.capital = capital
        self.grid_levels = grid_levels
        self.grid_spacing = grid_spacing
        self.per_level = capital / grid_levels
        self.active = False
        self.positions = []
        self.trades = []
        self.total_profit = 0
        self.current_price = 60000  # Başlangıç fiyatı
        
    def setup_grid(self):
        """Grid seviyelerini oluştur"""
        self.positions = []
        for i in range(self.grid_levels):
            buy_price = self.current_price * (1 - self.grid_spacing * (i + 1))
            sell_price = self.current_price * (1 + self.grid_spacing * (i + 1))
            self.positions.append({
                "level": i + 1,
                "buy_price": buy_price,
                "sell_price": sell_price,
                "amount": self.per_level,
                "active": False
            })
    
    def update_price(self):
        """Fiyatı simüle et (gerçekte Binance API'den alınır)"""
        change = random.uniform(-0.02, 0.02)
        self.current_price *= (1 + change)
        return self.current_price
    
    def check_and_trade(self):
        """Alım-satım sinyallerini kontrol et"""
        for pos in self.positions:
            if not pos["active"]:
                # Alım fırsatı
                if self.current_price <= pos["buy_price"]:
                    pos["active"] = True
                    self.trades.append({
                        "type": "BUY",
                        "price": self.current_price,
                        "amount": pos["amount"],
                        "level": pos["level"],
                        "time": datetime.now().isoformat()
                    })
            else:
                # Satım fırsatı
                if self.current_price >= pos["sell_price"]:
                    profit = (pos["sell_price"] - pos["buy_price"]) * (pos["amount"] / pos["buy_price"])
                    self.total_profit += profit
                    pos["active"] = False
                    self.trades.append({
                        "type": "SELL",
                        "price": self.current_price,
                        "profit": round(profit, 2),
                        "level": pos["level"],
                        "time": datetime.now().isoformat()
                    })
    
    def run(self):
        """Botu başlat"""
        self.active = True
        self.setup_grid()
        
        def loop():
            while self.active:
                self.update_price()
                self.check_and_trade()
                time.sleep(10)  # 10 saniyede bir kontrol
        
        threading.Thread(target=loop, daemon=True).start()
        return {"status": "started", "symbol": self.symbol, "capital": self.capital}
    
    def stop(self):
        self.active = False
        return {"status": "stopped", "total_profit": round(self.total_profit, 2)}
    
    def get_status(self):
        return {
            "symbol": self.symbol,
            "active": self.active,
            "current_price": round(self.current_price, 2),
            "total_profit": round(self.total_profit, 2),
            "positions": self.positions,
            "recent_trades": self.trades[-10:]
        }