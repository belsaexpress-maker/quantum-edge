import threading
import time
import random
from datetime import datetime

class GridBot:
    def __init__(self, symbol="BTCUSDT", capital=50, grid_levels=5, grid_spacing=0.01):
        self.symbol = symbol
        self.capital = capital
        self.grid_levels = grid_levels
        self.grid_spacing = grid_spacing
        self.per_level = capital / grid_levels
        self.active = False
        self.positions = []
        self.trades = []
        self.total_profit = 0
        self.current_price = 60000
        self.trade_count = 0

    def setup_grid(self):
        self.positions = []
        for i in range(self.grid_levels):
            buy_price = self.current_price * (1 - self.grid_spacing * (i + 1))
            sell_price = self.current_price * (1 + self.grid_spacing * (i + 1))
            self.positions.append({
                "level": i + 1,
                "buy_price": round(buy_price, 2),
                "sell_price": round(sell_price, 2),
                "active": False
            })

    def update_price(self):
        from app.services.binance_service import get_real_price
        real_price = get_real_price(self.symbol)
        if real_price:
            self.current_price = real_price
        else:
            change = random.uniform(-0.003, 0.003)
            self.current_price *= (1 + change)

    def check_and_trade(self):
        for pos in self.positions:
            if not pos["active"] and self.current_price <= pos["buy_price"]:
                pos["active"] = True
                self.trades.append({
                    "type": "BUY", "price": round(self.current_price, 2),
                    "level": pos["level"], "time": datetime.now().isoformat(),
                    "profit": 0
                })
                self.trade_count += 1
            elif pos["active"] and self.current_price >= pos["sell_price"]:
                profit = (pos["sell_price"] - pos["buy_price"]) / pos["buy_price"] * self.per_level
                self.total_profit += profit
                pos["active"] = False
                self.trades.append({
                    "type": "SELL", "price": round(self.current_price, 2),
                    "profit": round(profit, 2), "level": pos["level"],
                    "time": datetime.now().isoformat()
                })
                self.trade_count += 1

    def run(self):
        if self.active:
            return {"status": "already_running", "symbol": self.symbol}
        self.active = True
        self.setup_grid()
        def loop():
            while self.active:
                self.update_price()
                self.check_and_trade()
                time.sleep(3)
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
            "trade_count": self.trade_count,
            "trades": len(self.trades),
            "recent_trades": self.trades[-10:],
            "capital": self.capital
        }