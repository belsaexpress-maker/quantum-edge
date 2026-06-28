import asyncio
import json
import websocket
import threading
from datetime import datetime

# Canlı fiyat verileri
live_prices = {}
ws_connected = False

def on_message(ws, message):
    data = json.loads(message)
    if data.get("e") == "24hrTicker":
        symbol = data.get("s", "")
        live_prices[symbol] = {
            "symbol": symbol,
            "price": float(data.get("c", 0)),
            "change": float(data.get("p", 0)),
            "change_percent": float(data.get("P", 0)),
            "high": float(data.get("h", 0)),
            "low": float(data.get("l", 0)),
            "volume": float(data.get("v", 0)),
            "updated_at": datetime.now().isoformat()
        }

def on_error(ws, error):
    global ws_connected
    ws_connected = False
    print(f"Binance WS Error: {error}")

def on_close(ws, status, msg):
    global ws_connected
    ws_connected = False
    print("Binance WS Disconnected")

def on_open(ws):
    global ws_connected
    ws_connected = True
    print("Binance WS Connected")
    
    # Popüler coin'leri takip et
    streams = [
        "btcusdt@ticker", "ethusdt@ticker", "bnbusdt@ticker",
        "solusdt@ticker", "adausdt@ticker", "dogeusdt@ticker",
        "xrpusdt@ticker", "dotusdt@ticker", "maticusdt@ticker",
        "linkusdt@ticker", "avaxusdt@ticker", "uniusdt@ticker"
    ]
    
    subscribe = {
        "method": "SUBSCRIBE",
        "params": streams,
        "id": 1
    }
    ws.send(json.dumps(subscribe))

def start_binance_ws():
    ws = websocket.WebSocketApp(
        "wss://stream.binance.com:9443/ws",
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )
    
    ws_thread = threading.Thread(target=ws.run_forever, daemon=True)
    ws_thread.start()

def get_live_prices():
    return live_prices