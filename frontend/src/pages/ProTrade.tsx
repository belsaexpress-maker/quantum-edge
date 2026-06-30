import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TradingViewChart from '../components/charts/TradingViewChart';
import { Search, Wallet, TrendingUp, TrendingDown, Star } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

const ProTrade: React.FC = () => {
  const [symbol, setSymbol] = useState('BTC');
  const [prices, setPrices] = useState<any>({});
  const [balance, setBalance] = useState<any>({});
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState('');
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any>({});
  const [flash, setFlash] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['BTC','ETH','SOL','BNB','ADA']));

  // Tüm coinleri çek
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get(`${API_URL}/market/gateio/all`);
        if (res.data?.data) {
          setPrices(prev => {
            const changed = new Set<string>();
            Object.entries(res.data.data).forEach(([s, p]: any) => {
              if (prev[s] && Math.abs(prev[s].price - p.price) > 0.0001) changed.add(s);
            });
            if (changed.size > 0) { setFlash(changed); setTimeout(() => setFlash(new Set()), 500); }
            return res.data.data;
          });
        }
      } catch (err) {}
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  // Arama
  useEffect(() => {
    if (search.length >= 2) {
      axios.get(`${API_URL}/market/gateio/search?q=${search}`)
        .then(res => setSearchResults(res.data?.data || {}))
        .catch(() => {});
    } else {
      setSearchResults({});
    }
  }, [search]);

  const toggleFavorite = (sym: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(sym)) next.delete(sym);
      else next.add(sym);
      return next;
    });
  };

  const handleOrder = async () => {
    if (!quantity) return;
    try {
      const res = await axios.post(`${API_URL}/market/binance/order?symbol=${symbol}USDT&side=${side}&quantity=${quantity}`);
      setMsg(res.data.success ? '✅ ' + res.data.message : '❌ ' + res.data.error);
    } catch (err) { setMsg('❌ Hata'); }
  };

  const current = prices[symbol] || { price: 0, change_24h: 0, high_24h: 0, low_24h: 0, volume: 0 };
  const total = quantity ? (parseFloat(quantity) * current.price).toFixed(2) : '0.00';

  // Gösterilecek coinler: arama varsa sonuçlar, yoksa favoriler + popülerler
  const displayCoins = search.length >= 2 
    ? Object.entries(searchResults)
    : Object.entries(prices).filter(([sym]) => favorites.has(sym)).concat(
        Object.entries(prices).filter(([sym]) => !favorites.has(sym)).slice(0, 20)
      );

  return (
    <div className="flex flex-col lg:flex-row gap-3 max-w-full overflow-x-hidden">
      {/* Sol - Coin Listesi */}
      <div className="lg:w-72 shrink-0">
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-3">
          {/* Arama Çubuğu */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Coin ara... (örn: BTC)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          {/* Favoriler */}
          {search.length < 2 && (
            <div className="mb-2 text-xs text-[var(--color-text-muted)]">⭐ Favoriler</div>
          )}

          {/* Coin Listesi */}
          <div className="space-y-0.5 max-h-[500px] overflow-y-auto">
            {displayCoins.map(([sym, data]: any) => (
              <div
                key={sym}
                onClick={() => setSymbol(sym)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all text-xs ${
                  symbol === sym ? 'bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30' : 'hover:bg-[var(--color-bg-hover)]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(sym); }} className="text-[var(--color-text-muted)] hover:text-yellow-400">
                    <Star size={12} className={favorites.has(sym) ? 'text-yellow-400 fill-yellow-400' : ''} />
                  </button>
                  <span className="font-bold">{sym}</span>
                </div>
                <span className={`transition-all duration-300 ${flash.has(sym) ? (data.change_24h >= 0 ? 'text-green-400 scale-110' : 'text-red-400 scale-110') : ''}`}>
                  ${data.price < 0.01 ? data.price.toFixed(6) : data.price.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orta - Grafik */}
      <div className="flex-1 min-w-0">
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-sm font-bold">{symbol}/USDT</h3>
            <div className="flex gap-4 text-xs">
              <span className={`${current.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {current.change_24h >= 0 ? '+' : ''}{current.change_24h?.toFixed(2)}%
              </span>
              <span className="text-[var(--color-text-muted)]">H: {current.high_24h?.toFixed(4)}</span>
              <span className="text-[var(--color-text-muted)]">L: {current.low_24h?.toFixed(4)}</span>
            </div>
          </div>
          <TradingViewChart symbol={`${symbol}USDT`} height={400} interval="60" price={current.price} />
        </div>
      </div>

      {/* Sağ - Alım Satım */}
      <div className="lg:w-72 shrink-0">
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-3">
          <div className="flex mb-3">
            <button onClick={() => setSide('BUY')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${side === 'BUY' ? 'bg-green-600 text-white' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]'}`}>BUY</button>
            <button onClick={() => setSide('SELL')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${side === 'SELL' ? 'bg-red-600 text-white' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]'}`}>SELL</button>
          </div>
          <label className="text-xs text-[var(--color-text-muted)] block mb-1">Miktar</label>
          <input type="number" placeholder="0.001" value={quantity} onChange={e => setQuantity(e.target.value)}
            className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-white mb-2" />
          <div className="text-xs text-[var(--color-text-muted)] mb-3">Toplam: ${total}</div>
          <button onClick={handleOrder}
            className={`w-full py-2.5 rounded-lg text-sm font-bold ${side === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}>
            {side} {symbol}
          </button>
          {msg && <div className="text-xs mt-2 text-center">{msg}</div>}
        </div>

        {/* Bakiye */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-3 mt-3">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Wallet size={16} /> Bakiye</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between"><span className="font-bold">USDT</span><span>10,000.00</span></div>
            <div className="flex justify-between"><span className="font-bold">BTC</span><span>0.15</span></div>
            <div className="flex justify-between"><span className="font-bold">ETH</span><span>2.50</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProTrade;