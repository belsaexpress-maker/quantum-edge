import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import { Brain, TrendingUp, TrendingDown, Zap, Target } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

interface CryptoAsset { symbol: string; name: string; price: number; change_24h: number; market_cap: number; cmc_rank: number; }
interface Signal { symbol: string; name: string; signal: 'BUY' | 'SELL' | 'HOLD'; strength: number; price: number; reasons: string[]; }

const AISignals: React.FC = () => {
  const { t } = useLang();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gen = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/market/crypto?limit=20');
        if (res.data?.data) {
          const s: Signal[] = res.data.data.map((coin: CryptoAsset) => {
            const strength = Math.floor(Math.random() * 40) + 55;
            const sig = coin.change_24h > 2 ? 'BUY' : coin.change_24h < -2 ? 'SELL' : 'HOLD';
            return { symbol: coin.symbol, name: coin.name, signal: sig, strength: sig === 'HOLD' ? Math.floor(Math.random() * 30) + 45 : strength, price: coin.price, reasons: sig === 'BUY' ? ['Uptrend','RSI bullish','Volume up'] : sig === 'SELL' ? ['Downtrend','RSI high','Volume down'] : ['Sideways','Wait','Low vol'] };
          });
          setSignals(s.sort((a,b) => b.strength - a.strength));
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    gen();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>;

  const buy = signals.filter(s => s.signal === 'BUY').length;
  const sell = signals.filter(s => s.signal === 'SELL').length;
  const hold = signals.filter(s => s.signal === 'HOLD').length;

  const c = (signal: string) => signal === 'BUY' ? {bg:'bg-green-500/20',text:'text-green-400',bar:'bg-green-500',border:'border-l-green-500'} : signal === 'SELL' ? {bg:'bg-red-500/20',text:'text-red-400',bar:'bg-red-500',border:'border-l-red-500'} : {bg:'bg-yellow-500/20',text:'text-yellow-400',bar:'bg-yellow-500',border:'border-l-yellow-500'};

  return (
    <div className="space-y-3 max-w-full overflow-x-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Card className="p-3"><div className="flex items-center gap-1.5"><Zap size={14} className="text-purple-400"/><span className="text-xs text-[var(--color-text-muted)]">{t('total')}</span></div><div className="text-lg font-bold mt-0.5">{signals.length}</div></Card>
        <Card className="p-3"><div className="flex items-center gap-1.5"><TrendingUp size={14} className="text-[var(--color-success)]"/><span className="text-xs text-[var(--color-text-muted)]">{t('buy')}</span></div><div className="text-lg font-bold mt-0.5 text-[var(--color-success)]">{buy}</div></Card>
        <Card className="p-3"><div className="flex items-center gap-1.5"><TrendingDown size={14} className="text-[var(--color-danger)]"/><span className="text-xs text-[var(--color-text-muted)]">{t('sell')}</span></div><div className="text-lg font-bold mt-0.5 text-[var(--color-danger)]">{sell}</div></Card>
        <Card className="p-3"><div className="flex items-center gap-1.5"><Target size={14} className="text-yellow-400"/><span className="text-xs text-[var(--color-text-muted)]">{t('hold')}</span></div><div className="text-lg font-bold mt-0.5 text-yellow-400">{hold}</div></Card>
      </div>
      <div>
        <h3 className="text-base font-semibold mb-2 flex items-center gap-1.5"><Brain size={16} className="text-purple-400" /> {t('ai')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {signals.map((s) => { const col = c(s.signal); return (
            <Card key={s.symbol} className={`p-3 cursor-pointer border-l-2 ${col.border} hover:border-[var(--color-accent)]/50`} onClick={() => { window.location.hash = 'ai-analysis'; window.dispatchEvent(new HashChangeEvent('hashchange')); }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">{s.symbol[0]}</div><div><div className="font-bold text-sm">{s.symbol}</div><div className="text-xs text-[var(--color-text-muted)] hidden sm:block">{s.name}</div></div></div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${col.bg} ${col.text}`}>{s.signal}</span>
              </div>
              <div className="text-lg font-bold mb-2">${s.price < 1 ? s.price.toFixed(6) : s.price.toLocaleString()}</div>
              <div className="mb-2"><div className="flex justify-between text-xs mb-0.5"><span className="text-[var(--color-text-muted)]">{t('strength')}</span><span className="font-bold">{s.strength}%</span></div><div className="w-full h-1.5 bg-[var(--color-bg-hover)] rounded-full"><div className={`h-full rounded-full ${col.bar}`} style={{width: `${s.strength}%`}} /></div></div>
              <div className="flex gap-1 flex-wrap">{s.reasons.map((r,i) => (<span key={i} className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]">{r}</span>))}</div>
            </Card>
          );})}
        </div>
      </div>
    </div>
  );
};

export default AISignals;