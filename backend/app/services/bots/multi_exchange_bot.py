from app.services.bots.grid_bot import GridBot
from app.services.bots.scalping_bot import ScalpingBot
from app.services.bots.momentum_bot import MomentumBot
from app.services.binance_service import get_real_price as binance_price
from app.services.gateio_service import get_gateio_price

class MultiExchangeBot:
    def __init__(self, bot_type, symbol, capital, exchange="binance", **kwargs):
        self.exchange = exchange
        self.bot = None
        full_symbol = f"{symbol}USDT"
        if bot_type == 'grid':
            self.bot = GridBot(symbol=full_symbol, capital=capital, **kwargs)
        elif bot_type == 'scalping':
            self.bot = ScalpingBot(symbol=full_symbol, capital=capital, **kwargs)
        elif bot_type == 'momentum':
            self.bot = MomentumBot(symbol=full_symbol, capital=capital, **kwargs)

    def get_price(self):
        if self.exchange == "binance":
            return binance_price(self.bot.symbol) or self.bot.current_price
        elif self.exchange == "gateio":
            return get_gateio_price(self.bot.symbol) or self.bot.current_price
        return self.bot.current_price

    def run(self):
        return self.bot.run()

    def stop(self):
        return self.bot.stop()

    def get_status(self):
        status = self.bot.get_status()
        status["exchange"] = self.exchange
        return status