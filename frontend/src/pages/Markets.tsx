import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import TradingViewChart from '../components/charts/TradingViewChart';
import { TrendingUp, TrendingDown, Search, Star } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

interface CryptoAsset { symbol: string; name: string; price: number; change_24h: number; market_cap: number; volume_24h: number; cmc_rank: number; }

const Markets: React.FC = () => {
  const { t } = useLang();
  const [coins, setCoins] = useState<CryptoAsset[]>([]);
  const [filtered, setFiltered] = useState<CryptoAsset[]>([]);
  const [selectedCoin, setSelectedCoin] = useState('BTCUSD');
  const [selectedName, setSelectedName] = useState('Bitcoin');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [timeframe, setTimeframe] = useState('60');
  const [watchlist, setWatchlist] = useState<string[]>(['BTC', 'ETH', 'SOL']);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/market/crypto?limit=100');
        if (res.data?.data) { setCoins(res.data.data); setFiltered(res.data.data); }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchCoins();
  }, []);

  useEffect(() => { setFiltered(search ? coins.filter(c => c.symbol.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase())) : coins); }, [search, coins]);

  const handleSelect = (symbol: string, name: string) => { setSelectedCoin(`${symbol}USD`); setSelectedName(name); };
  const toggleWatchlist = (symbol: string) => { setWatchlist(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]); };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="space-y-3 max-w-full overflow-x-hidden">
      {watchlist.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {watchlist.map(sym => {
            const coin = coins.find(c => c.symbol === sym);
            if (!coin) return null;
            return <button key={sym} onClick={() => handleSelect(sym, coin.name)} className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${selectedCoin === `${sym}USD` ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'}`}><Star size={12} className="text-yellow-400" />{sym}<span className={coin.change_24h >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}>{coin.change_24h >= 0 ? '+' : ''}{coin.change_24h.toFixed(1)}%</span></button>;
          })}
        </div>
      )}

      <Card className="p-2">
        <div className="flex items-center justify-between px-2 mb-2 flex-wrap gap-2">
          <h3 className="text-sm font-semibold">{selectedName} ({selectedCoin.replace('USD', '/USD')})</h3>
          <div className="flex gap-1">
            {[{l:'1m',v:'1'},{l:'5m',v:'5'},{l:'15m',v:'15'},{l:'1H',v:'60'},{l:'4H',v:'240'},{l:'1D',v:'1D'}].map(tf => (
              <button key={tf.v} onClick={() => setTimeframe(tf.v)} className={`px-2 py-1 text-xs rounded ${timeframe === tf.v ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'}`}>{tf.l}</button>
            ))}
          </div>
        </div>
        <TradingViewChart symbol={selectedCoin} height={400} interval={timeframe} />
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-3 border-b border-[var(--color-border)]"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" /><input type="text" placeholder={t('search_coin')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]" /></div></div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-[var(--color-text-muted)] border-b border-[var(--color-border)]"><th className="text-left py-2 px-2 w-6"></th><th className="text-left py-2 px-2">#</th><th className="text-left py-2 px-2">{t('name')}</th><th className="text-right py-2 px-2">{t('price')}</th><th className="text-right py-2 px-2">{t('change_24h')}</th><th className="text-right py-2 px-2 hidden md:table-cell">{t('market_cap')}</th><th className="text-right py-2 px-2 hidden lg:table-cell">{t('volume')}</th></tr></thead>
            <tbody>
              {filtered.map((coin) => (
                <tr key={coin.symbol} onClick={() => handleSelect(coin.symbol, coin.name)} className={`border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] cursor-pointer ${selectedCoin === `${coin.symbol}USD` ? 'bg-[var(--color-accent)]/10' : ''}`}>
                  <td className="py-2 px-2" onClick={(e) => { e.stopPropagation(); toggleWatchlist(coin.symbol); }}><Star size={14} className={watchlist.includes(coin.symbol) ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--color-text-muted)]'} /></td>
                  <td className="py-2 px-2 text-[var(--color-text-muted)]">{coin.cmc_rank}</td>
                  <td className="py-2 px-2"><div className="font-medium">{coin.symbol}</div><div className="text-[var(--color-text-muted)] text-xs">{coin.name}</div></td>
                  <td className="py-2 px-2 text-right font-medium">${coin.price < 1 ? coin.price.toFixed(6) : coin.price.toLocaleString()}</td>
                  <td className={`py-2 px-2 text-right font-medium ${coin.change_24h >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}><div className="flex items-center justify-end gap-1">{coin.change_24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{coin.change_24h.toFixed(2)}%</div></td>
                  <td className="py-2 px-2 text-right text-[var(--color-text-secondary)] hidden md:table-cell">${(coin.market_cap / 1e9).toFixed(1)}B</td>
                  <td className="py-2 px-2 text-right text-[var(--color-text-secondary)] hidden lg:table-cell">${(coin.volume_24h / 1e6).toFixed(0)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Markets;