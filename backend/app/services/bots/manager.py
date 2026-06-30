from app.services.bots.grid_bot import GridBot
from app.services.bots.scalping_bot import ScalpingBot
from app.services.bots.momentum_bot import MomentumBot

class BotManager:
    def __init__(self):
        self.bots = {}
    
    def start_grid_bot(self, symbol="BTCUSDT", capital=50, grid_levels=5, spacing=0.01):
        if "grid" in self.bots and self.bots["grid"].active:
            return {"error": "Grid bot zaten çalışıyor"}
        self.bots["grid"] = GridBot(symbol=symbol, capital=capital, grid_levels=grid_levels, grid_spacing=spacing)
        return self.bots["grid"].run()
    
    def start_scalping_bot(self, symbol="BTCUSDT", capital=30, max_trades=50):
        if "scalping" in self.bots and self.bots["scalping"].active:
            return {"error": "Scalping bot zaten çalışıyor"}
        self.bots["scalping"] = ScalpingBot(symbol=symbol, capital=capital, max_trades=max_trades)
        return self.bots["scalping"].run()
    
    def start_momentum_bot(self, symbol="BTCUSDT", capital=20):
        if "momentum" in self.bots and self.bots["momentum"].active:
            return {"error": "Momentum bot zaten çalışıyor"}
        self.bots["momentum"] = MomentumBot(symbol=symbol, capital=capital)
        return self.bots["momentum"].run()
    
    def stop_bot(self, name: str):
        if name in self.bots:
            return self.bots[name].stop()
        return {"error": f"{name} botu bulunamadı"}
    
    def stop_all(self):
        results = {}
        for name, bot in self.bots.items():
            results[name] = bot.stop()
        return results
    
    def get_all_status(self):
        status = {}
        for name, bot in self.bots.items():
            s = bot.get_status()
            status[name] = s
        status["total_profit"] = round(sum(b.total_profit for b in self.bots.values()), 2)
        status["active_bots"] = sum(1 for b in self.bots.values() if b.active)
        return status

bot_manager = BotManager()