import random
from datetime import datetime, timedelta
from typing import Dict, List

class AITradingBot:
    def __init__(self):
        self.grid_bots = {}
        self.dca_bots = {}
        self.signal_bots = {}
    
    def generate_grid_signals(self, symbol: str, price: float) -> Dict:
        """Grid Bot - Yatay piyasada al/sat seviyeleri"""
        grid_levels = 5
        grid_spacing = price * 0.01  # %1 aralık
        
        levels = []
        for i in range(grid_levels):
            buy_price = price - (grid_spacing * (i + 1))
            sell_price = price + (grid_spacing * (i + 1))
            levels.append({
                "level": i + 1,
                "buy": round(buy_price, 2),
                "sell": round(sell_price, 2),
                "profit": round(grid_spacing, 2)
            })
        
        return {
            "strategy": "Grid Bot",
            "symbol": symbol,
            "current_price": price,
            "grid_spacing": round(grid_spacing, 2),
            "levels": levels,
            "expected_daily_profit": f"%{1.5 * grid_levels:.1f}",
            "risk": "Low",
            "best_for": "Sideways/Yatay piyasa"
        }
    
    def generate_dca_signals(self, symbol: str, price: float) -> Dict:
        """DCA Bot - Düşüşlerde kademeli alım"""
        drops = [5, 10, 15, 20, 30]  # % düşüş seviyeleri
        base_amount = 100  # $ baz alım
        
        levels = []
        total_cost = 0
        total_coins = 0
        
        for i, drop in enumerate(drops):
            buy_price = price * (1 - drop / 100)
            coins = base_amount / buy_price
            total_cost += base_amount
            total_coins += coins
            
            levels.append({
                "level": i + 1,
                "drop_percent": drop,
                "buy_price": round(buy_price, 2),
                "amount": base_amount,
                "coins": round(coins, 6)
            })
        
        avg_price = total_cost / total_coins if total_coins > 0 else price
        
        return {
            "strategy": "DCA Bot",
            "symbol": symbol,
            "current_price": price,
            "total_investment": total_cost,
            "average_price": round(avg_price, 2),
            "levels": levels,
            "expected_profit": "%15-30 (piyasa toparlanınca)",
            "risk": "Medium",
            "best_for": "Düşüş trendi/Bear market"
        }
    
    def generate_ai_scalping_signals(self, symbol: str, price: float) -> Dict:
        """AI Scalping - Anlık al/sat sinyalleri"""
        rsi = round(random.uniform(25, 75), 1)
        macd = round(random.uniform(-50, 50), 1)
        volume_change = round(random.uniform(-30, 50), 1)
        
        # AI karar mantığı
        buy_score = 0
        sell_score = 0
        reasons = []
        
        if rsi < 35:
            buy_score += 30
            reasons.append(f"RSI oversold ({rsi})")
        elif rsi > 65:
            sell_score += 30
            reasons.append(f"RSI overbought ({rsi})")
        
        if macd > 10:
            buy_score += 25
            reasons.append("MACD bullish cross")
        elif macd < -10:
            sell_score += 25
            reasons.append("MACD bearish cross")
        
        if volume_change > 20:
            buy_score += 20
            reasons.append(f"Volume spike +{volume_change}%")
        elif volume_change < -20:
            sell_score += 20
            reasons.append(f"Volume drop {volume_change}%")
        
        # Momentum skoru
        momentum = round(random.uniform(-3, 3), 2)
        if momentum > 1:
            buy_score += 15
            reasons.append(f"Momentum +{momentum}%")
        elif momentum < -1:
            sell_score += 15
            reasons.append(f"Momentum {momentum}%")
        
        # Volatilite
        volatility = round(random.uniform(0.5, 4), 1)
        if volatility > 3:
            reasons.append(f"High volatility ({volatility}%) - Dikkat!")
        
        # Karar
        if buy_score > sell_score + 15:
            signal = "STRONG BUY"
            confidence = min(buy_score, 95)
            entry = round(price * 0.998, 2)
            target = round(price * 1.015, 2)
            stop_loss = round(price * 0.992, 2)
        elif sell_score > buy_score + 15:
            signal = "STRONG SELL"
            confidence = min(sell_score, 95)
            entry = round(price * 1.002, 2)
            target = round(price * 0.985, 2)
            stop_loss = round(price * 1.008, 2)
        elif buy_score > sell_score:
            signal = "BUY"
            confidence = buy_score
            entry = round(price * 0.999, 2)
            target = round(price * 1.01, 2)
            stop_loss = round(price * 0.995, 2)
        elif sell_score > buy_score:
            signal = "SELL"
            confidence = sell_score
            entry = round(price * 1.001, 2)
            target = round(price * 0.99, 2)
            stop_loss = round(price * 1.005, 2)
        else:
            signal = "HOLD"
            confidence = 50
            entry = price
            target = price
            stop_loss = price
        
        risk_reward = round(abs(target - entry) / abs(entry - stop_loss), 2) if entry != stop_loss else 0
        
        return {
            "strategy": "AI Scalping Bot",
            "symbol": symbol,
            "signal": signal,
            "confidence": confidence,
            "entry_price": entry,
            "target_price": target,
            "stop_loss": stop_loss,
            "risk_reward_ratio": risk_reward,
            "indicators": {
                "rsi": rsi,
                "macd": macd,
                "volume_change": volume_change,
                "momentum": momentum,
                "volatility": volatility
            },
            "reasons": reasons,
            "expected_profit_per_trade": "%0.5-2",
            "risk": "Low-Medium",
            "best_for": "Her piyasa/Scalping"
        }
    
    def generate_momentum_signals(self, symbol: str, price: float) -> Dict:
        """Momentum Bot - Trend takibi"""
        trend = random.choice(["Bullish", "Bearish", "Neutral"])
        strength = round(random.uniform(60, 95), 1) if trend != "Neutral" else round(random.uniform(40, 55), 1)
        
        if trend == "Bullish":
            signal = "BUY"
            target = round(price * (1 + random.uniform(0.02, 0.08)), 2)
            stop = round(price * 0.97, 2)
        elif trend == "Bearish":
            signal = "SELL"
            target = round(price * (1 - random.uniform(0.02, 0.08)), 2)
            stop = round(price * 1.03, 2)
        else:
            signal = "HOLD"
            target = price
            stop = price
        
        return {
            "strategy": "Momentum Bot",
            "symbol": symbol,
            "signal": signal,
            "trend": trend,
            "strength": strength,
            "target": target,
            "stop_loss": stop,
            "expected_monthly_profit": "%10-30",
            "risk": "Medium-High",
            "best_for": "Trend piyasası"
        }

trading_bot = AITradingBot()