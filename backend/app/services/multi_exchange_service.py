import ccxt
from typing import Dict, List, Optional

SUPPORTED_EXCHANGES = {
    "binance": "Binance",
    "bybit": "Bybit",
    "okx": "OKX",
    "kucoin": "KuCoin",
    "bitget": "Bitget",
    "gate": "Gate.io",
    "mexc": "MEXC",
    "huobi": "HTX (Huobi)",
    "coinbase": "Coinbase",
    "kraken": "Kraken",
    "bingx": "BingX",
    "bitfinex": "Bitfinex",
    "crypto.com": "Crypto.com",
}

def get_exchange_list() -> List[Dict]:
    """Desteklenen borsaların listesini döndürür"""
    return [{"id": k, "name": v} for k, v in SUPPORTED_EXCHANGES.items()]

def test_connection(exchange_id: str, api_key: str, api_secret: str) -> Dict:
    """Borsa bağlantısını test eder ve bakiye bilgilerini getirir"""
    try:
        exchange_class = getattr(ccxt, exchange_id)
        exchange = exchange_class({
            'apiKey': api_key,
            'secret': api_secret,
            'enableRateLimit': True,
        })
        
        # Test bağlantısı - bakiye çek
        balance = exchange.fetch_balance()
        
        # Sadece 0'dan büyük bakiyeleri al
        non_zero = {}
        for asset, data in balance.get('total', {}).items():
            if data and data > 0:
                non_zero[asset] = {
                    'free': balance.get('free', {}).get(asset, 0),
                    'used': balance.get('used', {}).get(asset, 0),
                    'total': data
                }
        
        return {
            "success": True,
            "exchange": exchange_id,
            "total_value_usdt": balance.get('total', {}).get('USDT', 0),
            "assets": non_zero,
            "count": len(non_zero)
        }
    except Exception as e:
        return {
            "success": False,
            "exchange": exchange_id,
            "error": str(e)
        }

def get_portfolio(exchange_id: str, api_key: str, api_secret: str) -> Dict:
    """Tüm portföy bilgisini getirir"""
    try:
        exchange_class = getattr(ccxt, exchange_id)
        exchange = exchange_class({
            'apiKey': api_key,
            'secret': api_secret,
            'enableRateLimit': True,
        })
        
        balance = exchange.fetch_balance()
        
        # USDT cinsinden toplam değer
        total_usdt = 0
        assets = []
        
        for asset, data in balance.get('total', {}).items():
            if data and data > 0:
                free = balance.get('free', {}).get(asset, 0)
                used = balance.get('used', {}).get(asset, 0)
                total = data
                
                # Fiyat çek (varsa)
                try:
                    ticker = exchange.fetch_ticker(f"{asset}/USDT")
                    price = ticker['last']
                    value = total * price
                    total_usdt += value
                except:
                    price = 0
                    value = 0
                
                assets.append({
                    "asset": asset,
                    "free": free,
                    "used": used,
                    "total": total,
                    "price": price,
                    "value_usdt": value
                })
        
        return {
            "success": True,
            "exchange": exchange_id,
            "total_value_usdt": round(total_usdt, 2),
            "assets": sorted(assets, key=lambda x: x['value_usdt'], reverse=True),
            "count": len(assets)
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

def place_order(exchange_id: str, api_key: str, api_secret: str, 
                symbol: str, side: str, amount: float, price: float = None) -> Dict:
    """Emir verir"""
    try:
        exchange_class = getattr(ccxt, exchange_id)
        exchange = exchange_class({
            'apiKey': api_key,
            'secret': api_secret,
            'enableRateLimit': True,
        })
        
        if price:
            order = exchange.create_limit_order(symbol, side, amount, price)
        else:
            order = exchange.create_market_order(symbol, side, amount)
        
        return {
            "success": True,
            "order_id": order.get('id'),
            "symbol": order.get('symbol'),
            "side": order.get('side'),
            "amount": order.get('amount'),
            "price": order.get('price') or order.get('average'),
            "status": order.get('status')
        }
    except Exception as e:
        return {"success": False, "error": str(e)}