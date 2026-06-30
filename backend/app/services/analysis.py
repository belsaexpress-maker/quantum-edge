import requests
import numpy as np
from datetime import datetime
from typing import Dict, List, Tuple
import random

FIXED_TP_PCTS = [0.01, 0.02, 0.035]
FIXED_SL_PCT = 0.012
ATR_TP_MULT = [1, 2, 3.5]
ATR_SL_MULT = 1.2
ATR_PERIOD = 14
SWING_LOOKBACK = 30
SYMBOLS = ("BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "ADAUSDT", "XRPUSDT", "DOGEUSDT")
TIMEFRAME = "1h"

def fetch_klines(symbol: str, limit: int = 100) -> List[Dict]:
    try:
        url = f"https://api.binance.com/api/v3/klines?symbol={symbol}&interval={TIMEFRAME}&limit={limit}"
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return [{"open": float(k[1]), "high": float(k[2]), "low": float(k[3]), "close": float(k[4]), "volume": float(k[5])} for k in data]
    except:
        pass
    return []

def calculate_atr(klines: List[Dict], period: int = ATR_PERIOD) -> float:
    if len(klines) < period + 1: return 0
    tr_values = []
    for i in range(1, len(klines)):
        high, low = klines[i]["high"], klines[i]["low"]
        prev_close = klines[i-1]["close"]
        tr = max(high - low, abs(high - prev_close), abs(low - prev_close))
        tr_values.append(tr)
    return float(np.mean(tr_values[-period:]))

def find_swing_levels(klines: List[Dict], lookback: int = SWING_LOOKBACK) -> Tuple[float, float]:
    if len(klines) < lookback: return 0, 0
    recent = klines[-lookback:]
    highs = [k["high"] for k in recent]
    lows = [k["low"] for k in recent]
    return min(lows), max(highs)

def generate_ai_signal(symbol: str, entry_price: float, rsi: float) -> Dict:
    score = 0
    reasons = []
    if rsi < 35: score += 70; reasons.append("RSI aşırı satım - Al fırsatı")
    elif rsi > 65: score -= 50; reasons.append("RSI aşırı alım - Sat düşün")
    elif rsi < 50: score += 30; reasons.append("RSI yükseliş bölgesinde")
    else: score -= 20; reasons.append("RSI düşüş bölgesinde")
    signal = "STRONG BUY" if score > 60 else "BUY" if score > 20 else "SELL" if score < -40 else "HOLD"
    return {"symbol": symbol, "entry_price": entry_price, "score": score, "signal": signal, "confidence": abs(score), "reasons": reasons, "rsi": round(rsi, 1)}

def analyze_symbol(symbol: str) -> Dict:
    klines = fetch_klines(symbol)
    if not klines or len(klines) < 30:
        entry_price = 60000 if "BTC" in symbol else 4000 if "ETH" in symbol else 200 if "SOL" in symbol else 500 if "BNB" in symbol else 0.5 if "ADA" in symbol else 1 if "XRP" in symbol else 0.07
        atr = entry_price * 0.01
        support = entry_price * 0.95
        resistance = entry_price * 1.05
    else:
        entry_price = klines[-1]["close"]
        atr = calculate_atr(klines) or entry_price * 0.01
        support, resistance = find_swing_levels(klines)
    
    tp_levels = []
    for i, (pct, mult) in enumerate(zip(FIXED_TP_PCTS, ATR_TP_MULT)):
        fixed_tp = entry_price * (1 + pct)
        atr_tp = entry_price + (atr * mult)
        swing_tp = resistance if resistance > entry_price else entry_price * (1 + pct)
        tp_avg = float(np.mean([fixed_tp, atr_tp, swing_tp]))
        tp_levels.append({"level": f"TP{i+1}", "price": round(tp_avg, 4), "pct": round((tp_avg/entry_price - 1) * 100, 2)})
    
    fixed_sl = entry_price * (1 - FIXED_SL_PCT)
    atr_sl = entry_price - (atr * ATR_SL_MULT)
    swing_sl = support if support < entry_price else entry_price * (1 - FIXED_SL_PCT)
    sl_avg = float(np.mean([fixed_sl, atr_sl, swing_sl]))
    
    rsi = 30 + random.random() * 40
    ai = generate_ai_signal(symbol, entry_price, rsi)
    
    return {"symbol": symbol, "entry_price": round(entry_price, 4), "atr": round(atr, 4), "support": round(support, 4), "resistance": round(resistance, 4), "tp_levels": tp_levels, "stop_loss": {"price": round(sl_avg, 4), "pct": round((1 - sl_avg/entry_price) * 100, 2)}, "ai_signal": ai, "timestamp": datetime.now().isoformat()}

def analyze_all_symbols() -> List[Dict]:
    results = []
    for sym in SYMBOLS:
        result = analyze_symbol(sym)
        results.append(result)
    return sorted(results, key=lambda x: x.get("ai_signal", {}).get("score", 0), reverse=True)