from app.services.bots.grid_bot import GridBot
from app.services.bots.scalping_bot import ScalpingBot
from app.services.bots.momentum_bot import MomentumBot

class BotManager:
    def __init__(self):
        self.bots = {}
        self.capital = 100
    
    def start_all(self, symbol="BTCUSDT"):
        results = {}
        if "grid" not in self.bots:
            self.bots["grid"] = GridBot(symbol=symbol, capital=self.capital * 0.5)
            results["grid"] = self.bots["grid"].run()
        if "scalping" not in self.bots:
            self.bots["scalping"] = ScalpingBot(symbol=symbol, capital=self.capital * 0.3)
            results["scalping"] = self.bots["scalping"].run()
        if "momentum" not in self.bots:
            self.bots["momentum"] = MomentumBot(symbol=symbol, capital=self.capital * 0.2)
            results["momentum"] = self.bots["momentum"].run()
        return results
    
    def stop_all(self):
        results = {}
        total = 0
        for name, bot in self.bots.items():
            result = bot.stop()
            results[name] = result
            total += result.get("total_profit", 0)
        results["total_profit"] = round(total, 2)
        return results
    
    def get_all_status(self):
        status = {}
        total = 0
        for name, bot in self.bots.items():
            status[name] = bot.get_status()
            total += bot.total_profit
        status["total_profit"] = round(total, 2)
        status["capital"] = self.capital
        if self.capital > 0:
            status["roi"] = round((total / self.capital) * 100, 1)
        return status

bot_manager = BotManager()