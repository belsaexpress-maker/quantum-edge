import pandas as pd
import ta

def generate_signals():
    # Bu basit bir örnek sinyal üreticidir
    # İleride buraya teknik analiz kütüphanelerini bağlayacağız
    return [
        {"coin": "BTCUSDT", "signal": "BUY", "price": 64000, "strength": "High"},
        {"coin": "ETHUSDT", "signal": "SELL", "price": 3400, "strength": "Medium"}
    ]