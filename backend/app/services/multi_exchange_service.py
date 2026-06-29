import ccxt
from typing import Dict, Optional

SUPPORTED_EXCHANGES = {
    "binance": "Binance", "bybit": "Bybit", "okx": "OKX",
    "kucoin": "KuCoin", "bitget": "Bitget", "gate": "Gate.io",
    "mexc": "MEXC", "huobi": "HTX", "coinbase": "Coinbase",
    "kraken": "Kraken"
}

def get_exchange_client(exchange_id: str, api_key: str, api_secret: str):
    """Verilen borsa için ccxt client oluşturur"""
    if exchange_id not in SUPPORTED_EXCHANGES:
        raise ValueError(f"Desteklenmeyen borsa: {exchange_id}")
    
    exchange_class = getattr(ccxt, exchange_id)
    return exchange_class({
        'apiKey': api_key,
        'secret': api_secret,
        'enableRateLimit': True,
    })

def get_exchange_list():
    return [{"id": k, "name": v} for k, v in SUPPORTED_EXCHANGES.items()]

def test_connection(exchange_id: str, api_key: str, api_secret: str) -> Dict:
    try:
        exchange = get_exchange_client(exchange_id, api_key, api_secret)
        balance = exchange.fetch_balance()
        non_zero = {}
        for asset, data in balance.get('total', {}).items():
            if data and data > 0:
                non_zero[asset] = {
                    'free': balance.get('free', {}).get(asset, 0),
                    'used': balance.get('used', {}).get(asset, 0),
                    'total': data
                }
        return {"success": True, "exchange": exchange_id, "assets": non_zero, "count": len(non_zero)}
    except Exception as e:
        return {"success": False, "exchange": exchange_id, "error": str(e)}

def get_portfolio(exchange_id: str, api_key: str, api_secret: str) -> Dict:
    try:
        exchange = get_exchange_client(exchange_id, api_key, api_secret)
        balance = exchange.fetch_balance()
        assets = []
        total_usdt = 0
        for asset, total in balance.get('total', {}).items():
            if total and total > 0:
                free = balance.get('free', {}).get(asset, 0)
                used = balance.get('used', {}).get(asset, 0)
                try:
                    ticker = exchange.fetch_ticker(f"{asset}/USDT")
                    price = ticker['last']
                    value = total * price
                    total_usdt += value
                except:
                    price = 0
                    value = 0
                assets.append({"asset": asset, "free": free, "used": used, "total": total, "price": price, "value_usdt": value})
        return {"success": True, "exchange": exchange_id, "total_value_usdt": round(total_usdt, 2), "assets": sorted(assets, key=lambda x: x['value_usdt'], reverse=True), "count": len(assets)}
    except Exception as e:
        return {"success": False, "error": str(e)}

def place_order(exchange_id: str, api_key: str, api_secret: str, symbol: str, side: str, amount: float, price: float = None) -> Dict:
    try:
        exchange = get_exchange_client(exchange_id, api_key, api_secret)
        if price:
            order = exchange.create_limit_order(symbol, side, amount, price)
        else:
            order = exchange.create_market_order(symbol, side, amount)
        return {"success": True, "order_id": order.get('id'), "symbol": order.get('symbol'), "side": order.get('side'), "amount": order.get('amount'), "status": order.get('status')}
    except Exception as e:
        return {"success": False, "error": str(e)}