from app.services.bots.grid_bot import GridBot
from app.services.bots.scalping_bot import ScalpingBot
from app.services.bots.momentum_bot import MomentumBot

class BotManager:
    def __init__(self):
        self.bots = {}
        self.capital = 100
    
    def start_grid_bot(self, symbol="BTCUSDT"):
        if "grid" not in self.bots:
            self.bots["grid"] = GridBot(symbol=symbol, capital=self.capital * 0.5)
            return self.bots["grid"].run()
        return {"error": "Grid bot zaten çalışıyor"}
    
    def start_scalping_bot(self, symbol="BTCUSDT"):
        if "scalping" not in self.bots:
            self.bots["scalping"] = ScalpingBot(symbol=symbol, capital=self.capital * 0.3)
            return self.bots["scalping"].run()
        return {"error": "Scalping bot zaten çalışıyor"}
    
    def start_momentum_bot(self, symbol="BTCUSDT"):
        if "momentum" not in self.bots:
            self.bots["momentum"] = MomentumBot(symbol=symbol, capital=self.capital * 0.2)
            return self.bots["momentum"].run()
        return {"error": "Momentum bot zaten çalışıyor"}
    
    def start_all(self, symbol="BTCUSDT"):
        return {
            "grid": self.start_grid_bot(symbol),
            "scalping": self.start_scalping_bot(symbol),
            "momentum": self.start_momentum_bot(symbol)
        }
    
    def stop_all(self):
        results = {}
        total_profit = 0
        for name, bot in self.bots.items():
            result = bot.stop()
            results[name] = result
            total_profit += result.get("total_profit", 0)
        results["total_profit"] = round(total_profit, 2)
        return results
    
    def get_all_status(self):
        status = {}
        total_profit = 0
        for name, bot in self.bots.items():
            status[name] = bot.get_status()
            total_profit += bot.total_profit
        status["total_profit"] = round(total_profit, 2)
        status["capital"] = self.capital
        status["roi"] = round((total_profit / self.capital) * 100, 1)
        return status

bot_manager = BotManager()