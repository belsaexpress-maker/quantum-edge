import ccxt
import os
from dotenv import load_dotenv

load_dotenv()

# Binance bağlantısı
exchange = ccxt.binance({
    'apiKey': os.getenv('6uHGGninRfDv7LSHGXA9jv4wY52oqIqv2UxmjOepKAujih64st0X026U55DxEua6Y'),
    'secret': os.getenv('UhGAiI55Wv20Jakp8THtkBzskzHIcvmVc021UahtXbqtutJzu3A3VXjlDNs8UW04'),
    'enableRateLimit': True,
    'options': {'defaultType': 'spot'}
})

def execute_order(symbol, action, amount):
    try:
        # Action: 'BUY' veya 'SELL'
        if action == 'BUY':
            order = exchange.create_market_buy_order(symbol, amount)
        else:
            order = exchange.create_market_sell_order(symbol, amount)
        return {"status": "success", "order_id": order['id']}
    except Exception as e:
        return {"status": "error", "message": str(e)}