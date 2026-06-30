import requests
import random
import statistics
from datetime import datetime
from typing import Dict, List

FIXED_TP_PCTS = [0.01, 0.02, 0.035]
FIXED_SL_PCT = 0.012
SYMBOLS = ("BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "ADAUSDT", "XRPUSDT", "DOGEUSDT")

def analyze_symbol(symbol: str) -> Dict:
    # Demo fiyat
    prices = {"BTCUSDT": 60000, "ETHUSDT": 4000, "SOLUSDT": 200, "BNBUSDT": 500, "ADAUSDT": 0.50, "XRPUSDT": 1.00, "DOGEUSDT": 0.07}
    entry_price = prices.get(symbol, 100)
    atr = entry_price * 0.01
    support = entry_price * 0.95
    resistance = entry_price * 1.05
    
    tp_levels = []
    for i, pct in enumerate(FIXED_TP_PCTS):
        tp_price = entry_price * (1 + pct)
        tp_levels.append({"level": f"TP{i+1}", "price": round(tp_price, 4), "pct": round(pct * 100, 2)})
    
    sl_price = entry_price * (1 - FIXED_SL_PCT)
    
    rsi = 30 + random.random() * 40
    score = 70 if rsi < 35 else -50 if rsi > 65 else 30 if rsi < 50 else -20
    signal = "STRONG BUY" if score > 60 else "BUY" if score > 20 else "SELL" if score < -40 else "HOLD"
    reasons = ["RSI aşırı satım - Al fırsatı"] if rsi < 35 else ["RSI aşırı alım - Sat düşün"] if rsi > 65 else ["RSI yükseliş bölgesinde"] if rsi < 50 else ["RSI düşüş bölgesinde"]
    
    return {
        "symbol": symbol, "entry_price": round(entry_price, 4),
        "atr": round(atr, 4), "support": round(support, 4), "resistance": round(resistance, 4),
        "tp_levels": tp_levels,
        "stop_loss": {"price": round(sl_price, 4), "pct": round(FIXED_SL_PCT * 100, 2)},
        "ai_signal": {"symbol": symbol, "entry_price": entry_price, "score": score, "signal": signal, "confidence": abs(score), "reasons": reasons, "rsi": round(rsi, 1)},
        "timestamp": datetime.now().isoformat()
    }

def analyze_all_symbols() -> List[Dict]:
    results = [analyze_symbol(sym) for sym in SYMBOLS]
    return sorted(results, key=lambda x: x.get("ai_signal", {}).get("score", 0), reverse=True)