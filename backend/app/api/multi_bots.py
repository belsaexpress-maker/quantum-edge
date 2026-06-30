from fastapi import APIRouter
from app.services.bots.multi_exchange_bot import MultiExchangeBot

router = APIRouter(prefix="/api/multi-bots", tags=["Multi-Exchange Bots"])
active_bots = {}

@router.post("/start")
def start_bot(bot_type: str, symbol: str, capital: float, exchange: str = "binance"):
    bot_id = f"{exchange}_{bot_type}_{symbol}"
    if bot_type == "grid":
        bot = MultiExchangeBot("grid", symbol, capital, exchange, grid_levels=5, grid_spacing=0.01)
    elif bot_type == "scalping":
        bot = MultiExchangeBot("scalping", symbol, capital, exchange, max_trades=50)
    elif bot_type == "momentum":
        bot = MultiExchangeBot("momentum", symbol, capital, exchange)
    else:
        return {"error": "Bilinmeyen bot tipi"}
    active_bots[bot_id] = bot
    result = bot.run()
    result["exchange"] = exchange
    result["bot_id"] = bot_id
    return result

@router.post("/stop/{bot_id}")
def stop_bot(bot_id: str):
    if bot_id in active_bots:
        return active_bots[bot_id].stop()
    return {"error": "Bot bulunamadı"}

@router.get("/status")
def get_status():
    return {bot_id: bot.get_status() for bot_id, bot in active_bots.items()}

@router.post("/stop/all")
def stop_all():
    for bot in active_bots.values():
        bot.stop()
    active_bots.clear()
    return {"status": "all_stopped"}