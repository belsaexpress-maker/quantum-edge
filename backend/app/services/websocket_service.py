from fastapi import WebSocket
import asyncio
import json
import random

class LiveDataService:
    def __init__(self):
        self.clients = []
        self.prices = {"BTC": 60000, "ETH": 4000, "SOL": 200}
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.clients.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.clients:
            self.clients.remove(websocket)
    
    async def broadcast_prices(self):
        while True:
            for symbol in self.prices:
                change = random.uniform(-0.005, 0.005)
                self.prices[symbol] *= (1 + change)
            
            data = {
                "type": "prices",
                "data": {k: round(v, 2) for k, v in self.prices.items()},
                "time": str(asyncio.get_event_loop().time())
            }
            
            for client in self.clients:
                try:
                    await client.send_text(json.dumps(data))
                except:
                    self.disconnect(client)
            
            await asyncio.sleep(1)  # Her saniye güncelle

live_data = LiveDataService()