import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import TradingViewChart from '../components/charts/TradingViewChart';
import { Search, Star, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface Coin {
  symbol: string; name: string; price: number; change_24h: number; volume_24h: number;
}

const Trade: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState('BTCUSD');
  const [selectedName, setSelectedName] = useState('Bitcoin');
  const [livePrice, setLivePrice] = useState(0);
  const [liveChange, setLiveChange] = useState(0);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'market' | 'limit'>('market');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>(['BTC', 'ETH', 'SOL']);
  const [activeTab, setActiveTab] = useState<'orders' | 'history'>('orders');

  const fetchCoins = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/market/crypto?limit=50');
      if (res.data?.data) setCoins(res.data.data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchLivePrice = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/market/live-prices');
      if (res.data?.[selectedCoin.replace('USD', '')]) {
        const data = res.data[selectedCoin.replace('USD', '')];
        if (livePrice > 0 && data.price > livePrice) setFlash('up');
        else if (livePrice > 0 && data.price < livePrice) setFlash('down');
        setLivePrice(data.price);
        setLiveChange(data.change_24h);
        setTimeout(() => setFlash(null), 500);
      }
    } catch (err) {}
  }, [selectedCoin, livePrice]);

  useEffect(() => { fetchCoins(); }, [fetchCoins]);
  useEffect(() => {
    fetchLivePrice();
    const interval = setInterval(fetchLivePrice, 2000);
    return () => clearInterval(interval);
  }, [fetchLivePrice]);

  useEffect(() => { setTotal(Number(amount || 0) * livePrice); }, [amount, livePrice]);

  const handleSelect = (symbol: string, name: string) => {
    setSelectedCoin(`${symbol}USD`);
    setSelectedName(name);
  };

  const filtered = search ? coins.filter(c => c.symbol.toLowerCase().includes(search.toLowerCase())) : coins;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Üst Bar - 24s Özet */}
      <div className="flex items-center gap-4 px-4 py-2 bg-[#0B0E11] border-b border-[#2B3139] text-xs">
        <span className="text-[#EAECEF] font-bold">{selectedName}</span>
        <span className={`font-mono font-bold transition-colors duration-300 ${flash === 'up' ? 'text-[#03A66D]' : flash === 'down' ? 'text-[#CF304A]' : 'text-[#EAECEF]'}`}>
          ${livePrice?.toLocaleString()}
        </span>
        <span className={`${liveChange >= 0 ? 'text-[#03A66D]' : 'text-[#CF304A]'}`}>
          {liveChange >= 0 ? '+' : ''}{liveChange?.toFixed(2)}%
        </span>
        <span className="text-[#848E9C] ml-auto">24s Hacim: ${(coins.find(c => c.symbol === selectedCoin.replace('USD', ''))?.volume_24h || 0)?.toLocaleString()}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sol Panel - Coin Listesi */}
        <div className="w-64 bg-[#0B0E11] border-r border-[#2B3139] flex flex-col">
          <div className="p-2">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#848E9C]" />
              <input type="text" placeholder="Ara..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#1E2329] border border-[#2B3139] rounded pl-8 pr-2 py-1.5 text-xs text-white placeholder-[#848E9C] focus:outline-none focus:border-[#F0B90B]" />
            </div>
          </div>
          <div className="flex text-xs text-[#848E9C] px-3 py-1 border-b border-[#2B3139]">
            <span className="flex-1">Coin</span>
            <span className="w-20 text-right">Fiyat</span>
            <span className="w-16 text-right">Değişim</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((coin) => (
              <div key={coin.symbol}
                onClick={() => handleSelect(coin.symbol, coin.name)}
                className={`flex items-center px-3 py-2 cursor-pointer hover:bg-[#1E2329] text-xs border-b border-[#2B3139]/50 ${selectedCoin === `${coin.symbol}USD` ? 'bg-[#1E2329] border-l-2 border-l-[#F0B90B]' : ''}`}>
                <Star size={12} className={`mr-2 ${watchlist.includes(coin.symbol) ? 'text-[#F0B90B] fill-[#F0B90B]' : 'text-[#848E9C]'}`}
                  onClick={(e) => { e.stopPropagation(); setWatchlist(prev => prev.includes(coin.symbol) ? prev.filter(s => s !== coin.symbol) : [...prev, coin.symbol]); }} />
                <span className="flex-1 font-medium text-[#EAECEF]">{coin.symbol}</span>
                <span className="w-20 text-right text-[#EAECEF]">${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}</span>
                <span className={`w-16 text-right ${coin.change_24h >= 0 ? 'text-[#03A66D]' : 'text-[#CF304A]'}`}>{coin.change_24h >= 0 ? '+' : ''}{coin.change_24h.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orta Panel - Grafik */}
        <div className="flex-1 flex flex-col bg-[#0B0E11]">
          <TradingViewChart symbol={selectedCoin} height={window.innerHeight - 200} interval="60" />
        </div>

        {/* Sağ Panel - Alım Satım */}
        <div className="w-80 bg-[#0B0E11] border-l border-[#2B3139] flex flex-col">
          <div className="flex border-b border-[#2B3139]">
            <button onClick={() => setTab('market')} className={`flex-1 py-2 text-xs font-medium ${tab === 'market' ? 'text-[#F0B90B] border-b-2 border-[#F0B90B]' : 'text-[#848E9C]'}`}>Market</button>
            <button onClick={() => setTab('limit')} className={`flex-1 py-2 text-xs font-medium ${tab === 'limit' ? 'text-[#F0B90B] border-b-2 border-[#F0B90B]' : 'text-[#848E9C]'}`}>Limit</button>
          </div>
          <div className="p-3 space-y-3">
            <div>
              <label className="text-xs text-[#848E9C]">Miktar ({selectedCoin.replace('USD', '')})</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F0B90B]" placeholder="0.00" />
            </div>
            <div>
              <label className="text-xs text-[#848E9C]">Toplam (USDT)</label>
              <input type="text" value={total.toFixed(2)} readOnly
                className="w-full bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white" />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-[#03A66D] hover:bg-[#038D5B] text-white font-bold rounded text-sm">BUY</button>
              <button className="flex-1 py-3 bg-[#CF304A] hover:bg-[#B0283E] text-white font-bold rounded text-sm">SELL</button>
            </div>
          </div>
          <div className="flex-1 border-t border-[#2B3139]">
            <div className="flex border-b border-[#2B3139]">
              <button onClick={() => setActiveTab('orders')} className={`flex-1 py-2 text-xs ${activeTab === 'orders' ? 'text-[#EAECEF] border-b-2 border-[#F0B90B]' : 'text-[#848E9C]'}`}>Açık Emirler</button>
              <button onClick={() => setActiveTab('history')} className={`flex-1 py-2 text-xs ${activeTab === 'history' ? 'text-[#EAECEF] border-b-2 border-[#F0B90B]' : 'text-[#848E9C]'}`}>Geçmiş</button>
            </div>
            <div className="p-3 text-xs text-[#848E9C] text-center">Henüz işlem yok</div>
          </div>
          <div className="p-3 border-t border-[#2B3139] flex items-center gap-2 text-xs">
            <Wallet size={14} className="text-[#848E9C]" />
            <span className="text-[#EAECEF]">Bakiye: 0.00 USDT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;