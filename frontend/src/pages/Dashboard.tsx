import { useWebSocket } from '../hooks/useWebSocket';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import TradingViewChart from '../components/charts/TradingViewChart';
import { TrendingUp, Brain, Newspaper } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  market_cap: number;
  volume_24h: number;
  cmc_rank: number;
}

const Dashboard: React.FC = () => {
  const { t } = useLang();
  const [cryptoData, setCryptoData] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSD');
  const [selectedName, setSelectedName] = useState('Bitcoin');
  const { prices, flashSymbols } = useWebSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/market/crypto?limit=12');
        if (res.data?.data) setCryptoData(res.data.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectCoin = (symbol: string, name: string) => {
    setSelectedSymbol(`${symbol}USD`);
    setSelectedName(name);
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="space-y-3 max-w-full overflow-x-hidden">
      {/* Live Ticker Bar - Anlık fiyatlar */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
        {cryptoData.slice(0, 10).map((coin) => (
          <div key={coin.symbol} onClick={() => handleSelectCoin(coin.symbol, coin.name)}
            className={`shrink-0 px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${selectedSymbol === `${coin.symbol}USD` ? 'bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40' : 'bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50'}`}>
            <span className="font-bold">{coin.symbol}</span>
            <span className={`ml-1 transition-all duration-300 ${flashSymbols.has(coin.symbol) ? 'text-yellow-400 scale-110 font-bold' : ''}`}>
              ${prices[coin.symbol]?.toFixed(2) || (coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString())}
            </span>
            <span className={`ml-1 ${coin.change_24h >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>{coin.change_24h >= 0 ? '+' : ''}{coin.change_24h.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Card className="p-3"><div className="text-xs text-[var(--color-text-muted)]">{t('portfolio_value')}</div><div className="text-lg font-bold mt-0.5">$124K</div><div className="text-xs text-[var(--color-success)]">+2.3%</div></Card>
        <Card className="p-3"><div className="text-xs text-[var(--color-text-muted)]">{t('gain')}</div><div className="text-lg font-bold mt-0.5">+$2,340</div><div className="text-xs text-[var(--color-success)]">+1.8%</div></Card>
        <Card className="p-3"><div className="text-xs text-[var(--color-text-muted)]">{t('signals')}</div><div className="text-lg font-bold mt-0.5">12</div><div className="text-xs text-[var(--color-text-muted)]">8B · 4S</div></Card>
        <Card className="p-3"><div className="text-xs text-[var(--color-text-muted)]">{t('win_rate')}</div><div className="text-lg font-bold mt-0.5">87%</div><div className="text-xs text-[var(--color-text-muted)]">30 days</div></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="p-3">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><TrendingUp size={16} className="text-[var(--color-accent)]" /> {t('watchlist')}</h3>
          <div className="space-y-0.5 max-h-80 overflow-y-auto">
            {cryptoData.map((coin) => (
              <div key={coin.symbol} onClick={() => handleSelectCoin(coin.symbol, coin.name)}
                className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${selectedSymbol === `${coin.symbol}USD` ? 'bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30' : 'hover:bg-[var(--color-bg-hover)]'}`}>
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">{coin.symbol[0]}</div><div><div className="text-xs font-medium">{coin.symbol}</div><div className="text-xs text-[var(--color-text-muted)] hidden sm:block">{coin.name}</div></div></div>
                <div className="text-right">
                  <div className={`text-xs font-medium transition-all duration-300 ${flashSymbols.has(coin.symbol) ? 'text-yellow-400 font-bold' : ''}`}>
                    ${prices[coin.symbol]?.toFixed(2) || (coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString())}
                  </div>
                  <div className={`text-xs ${coin.change_24h >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>{coin.change_24h >= 0 ? '+' : ''}{coin.change_24h.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-2 p-2">
          <h3 className="text-sm font-semibold mb-1 px-1">{selectedName} / USD</h3>
          <TradingViewChart symbol={selectedSymbol} height={320} interval="60" />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="p-3">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Brain size={16} className="text-purple-400" /> {t('ai_signals')}</h3>
          {[{ s: 'BTC', sig: 'BUY' as const, str: 92, price: 118420, name: 'Bitcoin' },{ s: 'ETH', sig: 'HOLD' as const, str: 71, price: 4120, name: 'Ethereum' },{ s: 'SOL', sig: 'SELL' as const, str: 85, price: 235, name: 'Solana' }].map((x) => (
            <div key={x.s} onClick={() => handleSelectCoin(x.s, x.name)} className="flex items-center justify-between p-2 bg-[var(--color-bg-primary)] rounded-lg mb-1.5 cursor-pointer hover:bg-[var(--color-bg-hover)]">
              <div className="flex items-center gap-2"><span className="font-bold text-xs">{x.s}</span><span className={`px-1.5 py-0.5 rounded text-xs font-bold ${x.sig === 'BUY' ? 'bg-green-500/20 text-green-400' : x.sig === 'SELL' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{x.sig}</span></div>
              <div className="flex items-center gap-2"><span className="text-xs text-[var(--color-text-muted)]">${x.price.toLocaleString()}</span><div className="w-12 h-1 bg-[var(--color-bg-hover)] rounded-full"><div className={`h-full rounded-full ${x.sig === 'BUY' ? 'bg-green-500' : x.sig === 'SELL' ? 'bg-red-500' : 'bg-yellow-500'}`} style={{width: `${x.str}%`}} /></div><span className="text-xs font-bold">{x.str}%</span></div>
            </div>
          ))}
        </Card>
        <Card className="p-3">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Newspaper size={16} className="text-cyan-400" /> {t('latest_news')}</h3>
          {[{ t: 'BTC Breaks $118K', src: 'CoinDesk', time: '2m ago' },{ t: 'Fed Signals Rate Cut', src: 'Reuters', time: '15m ago' },{ t: 'SEC Approves ETH ETF', src: 'Bloomberg', time: '1h ago' },{ t: 'Gold Hits $3,380', src: 'CNBC', time: '2h ago' }].map((n, i) => (
            <div key={i} className="p-2 bg-[var(--color-bg-primary)] rounded-lg mb-1.5 cursor-pointer hover:bg-[var(--color-bg-hover)]"><div className="text-xs font-medium">{n.t}</div><div className="text-xs text-[var(--color-text-muted)] mt-0.5">{n.src} · {n.time}</div></div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;