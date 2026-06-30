import threading
import time
from datetime import datetime
from app.services.bots.grid_bot import GridBot
from app.services.bots.momentum_bot import MomentumBot
from app.services.bots.scalping_bot import ScalpingBot

class BotManager:
    def __init__(self):
        self.bots = {}
        self.bot_types = {
            'grid': GridBot,
            'momentum': MomentumBot,
            'scalping': ScalpingBot
        }
        self.active_bots = {}
        self.monitoring = False
        
    def create_bot(self, bot_type, symbol="BTCUSDT", capital=50, **kwargs):
        """Yeni bir bot oluştur"""
        if bot_type not in self.bot_types:
            return {"error": f"Bilinmeyen bot tipi: {bot_type}"}
            
        bot_id = f"{bot_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Bot parametrelerini hazırla
        bot_class = self.bot_types[bot_type]
        if bot_type == 'grid':
            bot = bot_class(
                symbol=symbol,
                capital=capital,
                grid_levels=kwargs.get('grid_levels', 5),
                grid_spacing=kwargs.get('grid_spacing', 0.01)
            )
        elif bot_type == 'momentum':
            bot = bot_class(
                symbol=symbol,
                capital=capital
            )
        elif bot_type == 'scalping':
            bot = bot_class(
                symbol=symbol,
                capital=capital,
                max_trades=kwargs.get('max_trades', 50)
            )
        
        self.bots[bot_id] = bot
        self.active_bots[bot_id] = False
        return {"bot_id": bot_id, "type": bot_type, "symbol": symbol, "capital": capital}
    
    def start_bot(self, bot_id):
        """Botu başlat"""
        if bot_id not in self.bots:
            return {"error": "Bot bulunamadı"}
        
        bot = self.bots[bot_id]
        result = bot.run()
        self.active_bots[bot_id] = True
        return result
    
    def stop_bot(self, bot_id):
        """Botu durdur"""
        if bot_id not in self.bots:
            return {"error": "Bot bulunamadı"}
        
        bot = self.bots[bot_id]
        result = bot.stop()
        self.active_bots[bot_id] = False
        return result
    
    def get_bot_status(self, bot_id):
        """Bot durumunu al"""
        if bot_id not in self.bots:
            return {"error": "Bot bulunamadı"}
        
        bot = self.bots[bot_id]
        status = bot.get_status()
        status['bot_id'] = bot_id
        status['is_active'] = self.active_bots.get(bot_id, False)
        return status
    
    def get_all_bots(self):
        """Tüm botların listesini al"""
        return {
            bot_id: {
                'type': bot.__class__.__name__,
                'symbol': bot.symbol,
                'active': self.active_bots.get(bot_id, False),
                'profit': bot.total_profit,
                'trades': bot.trade_count
            }
            for bot_id, bot in self.bots.items()
        }
    
    def stop_all_bots(self):
        """Tüm botları durdur"""
        results = {}
        for bot_id in list(self.bots.keys()):
            results[bot_id] = self.stop_bot(bot_id)
        return results
    
    def get_total_profit(self):
        """Tüm botların toplam karı"""
        total = 0
        for bot in self.bots.values():
            total += bot.total_profit
        return round(total, 2)
    
    def start_monitoring(self):
        """Botların durumunu izlemeye başla"""
        if self.monitoring:
            return {"status": "already_monitoring"}
        
        self.monitoring = True
        def monitor_loop():
            while self.monitoring:
                print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Bot Durumları:")
                for bot_id, bot in self.bots.items():
                    status = bot.get_status()
                    active = "ACTIVE" if self.active_bots.get(bot_id, False) else "STOPPED"
                    print(f"  {bot_id}: {active} | Profit: ${status['total_profit']:.2f} | Trades: {status['trade_count']}")
                print(f"Toplam Kar: ${self.get_total_profit():.2f}")
                time.sleep(15)
        
        threading.Thread(target=monitor_loop, daemon=True).start()
        return {"status": "monitoring_started"}
    
    def stop_monitoring(self):
        """İzlemeyi durdur"""
        self.monitoring = False
        return {"status": "monitoring_stopped"}