from app.services.bots.grid_bot import GridBot
from app.services.bots.scalping_bot import ScalpingBot
from app.services.bots.momentum_bot import MomentumBot
from app.services.bots.dca_bot import DCABot
from app.services.bots.signal_bot import SignalBot
from app.services.bots.ai_optimize_bot import AIOptimizeBot

class BotManager:
    def __init__(self):
        self.bots = {}
        self.capital = 100

    def start_all(self, symbol="BTCUSDT"):
        results = {}
        if "grid" not in self.bots:
            self.bots["grid"] = GridBot(symbol=symbol, capital=self.capital * 0.2)
            results["grid"] = self.bots["grid"].run()
        if "scalping" not in self.bots:
            self.bots["scalping"] = ScalpingBot(symbol=symbol, capital=self.capital * 0.15)
            results["scalping"] = self.bots["scalping"].run()
        if "momentum" not in self.bots:
            self.bots["momentum"] = MomentumBot(symbol=symbol, capital=self.capital * 0.15)
            results["momentum"] = self.bots["momentum"].run()
        if "dca" not in self.bots:
            self.bots["dca"] = DCABot(symbol=symbol, capital=self.capital * 0.25)
            results["dca"] = self.bots["dca"].run()
        if "signal" not in self.bots:
            self.bots["signal"] = SignalBot(symbol=symbol, capital=self.capital * 0.15)
            results["signal"] = self.bots["signal"].run()
        if "ai" not in self.bots:
            self.bots["ai"] = AIOptimizeBot(symbol=symbol, capital=self.capital * 0.1)
            results["ai"] = self.bots["ai"].run()
        return results

    def stop_all(self):
        results = {}
        for name, bot in self.bots.items():
            results[name] = bot.stop()
        return results

    def get_all_status(self):
        status = {}
        for name, bot in self.bots.items():
            status[name] = bot.get_status()
        return status

bot_manager = BotManager()