import yfinance as yf
from sqlalchemy.orm import sessionmaker
from main import engine, Signal

SYMBOLS = ["BTC-USD", "ETH-USD", "SOL-USD", "XRP-USD", "ADA-USD", "AVAX-USD"]

def calculate_rsi(data, period=14):
    delta = data.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def run_engine():
    print("🚀 Teknik analiz motoru başlatıldı...")
    
    for symbol in SYMBOLS:
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="60d") # RSI için yeterli veri
            
            # Hesaplamalar
            hist['EMA_50'] = hist['Close'].ewm(span=50, adjust=False).mean()
            hist['RSI'] = calculate_rsi(hist['Close'])
            
            price = hist['Close'].iloc[-1]
            rsi = hist['RSI'].iloc[-1]
            ema = hist['EMA_50'].iloc[-1]
            
            # Strateji
            signal_type = None
            if rsi < 30 and price > ema:
                signal_type = "BUY"
            elif rsi > 70 and price < ema:
                signal_type = "SELL"
                
            if signal_type:
                db = sessionmaker(bind=engine)()
                new_signal = Signal(symbol=symbol, type=signal_type, price=float(price))
                db.add(new_signal)
                db.commit()
                db.close()
                print(f"🎯 {symbol} için {signal_type} sinyali! Fiyat: {price:.2f}")
            else:
                print(f"➖ {symbol} takip ediliyor (RSI: {rsi:.1f})")
                
        except Exception as e:
            print(f"❌ {symbol} hatası: {e}")

if __name__ == "__main__":
    run_engine()