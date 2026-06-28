# Terminalde şu kütüphaneleri yükle:
# pip install pandas pandas_ta ccxt

import pandas as pd
import pandas_ta as ta

def hesapla_teknik_analiz(df):
    # RSI Hesaplama
    df['RSI'] = ta.rsi(df['close'], length=14)
    # MACD Hesaplama
    macd = ta.macd(df['close'])
    df = pd.concat([df, macd], axis=1)
    
    # Süper Algoritma Mantığı
    # Örnek: RSI < 30 ise BUY, RSI > 70 ise SELL
    if df['RSI'].iloc[-1] < 30:
        return "BUY"
    elif df['RSI'].iloc[-1] > 70:
        return "SELL"
    return "HOLD"