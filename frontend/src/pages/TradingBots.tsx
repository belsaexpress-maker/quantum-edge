import React, { useState } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import { Bot, TrendingUp, TrendingDown, Zap, Target, Grid3X3, BarChart3 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const TradingBots: React.FC = () => {
  const { t } = useLang();
  const [symbol, setSymbol] = useState('BTC');
  const [price, setPrice] = useState('60000');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  const fetchBot = async (endpoint: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/bots/${endpoint}/${symbol}?price=${price}`);
      setResult({ type: endpoint, data: res.data });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const tabs = [
    { id: 'all', icon: Bot, label: t('all_bots') },
    { id: 'scalping', icon: Zap, label: t('scalping') },
    { id: 'grid', icon: Grid3X3, label: t('grid') },
    { id: 'dca', icon: BarChart3, label: t('dca') },
    { id: 'momentum', icon: TrendingUp, label: t('momentum') },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold flex items-center gap-2"><Bot size={18} className="text-[var(--color-accent)]" /> {t('trading_bots')}</h2>
      <Card className="p-3">
        <div className="flex gap-2 flex-wrap">
          <select value={symbol} onChange={e => setSymbol(e.target.value)} className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-white">
            {['BTC','ETH','SOL','BNB','ADA','XRP','DOGE'].map(s => <option key={s}>{s}</option>)}
          </select>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder={t('price')} className="w-24 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-white" />
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); if(tab.id !== 'all') fetchBot(tab.id); else fetchBot('all'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === tab.id ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'}`}>
              <tab.icon size={14} />{tab.label}
            </button>
          ))}
        </div>
      </Card>
      {loading && <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>}
      {result && !loading && (
        <div className="space-y-3">
          {result.data?.strategies ? (
            Object.entries(result.data.strategies).map(([key, strat]: any) => (
              <Card key={key} className="p-3">
                <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-bold">{strat.strategy}</h3><span className="text-xs px-2 py-0.5 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent)]">{strat.risk} Risk</span></div>
                {strat.signal && <div className="flex items-center gap-3 mb-2"><span className={`px-3 py-1 rounded-lg text-sm font-bold ${strat.signal.includes('BUY') ? 'bg-green-500/20 text-green-400' : strat.signal.includes('SELL') ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{strat.signal}</span><span className="text-sm">{t('confidence')}: <b>{strat.confidence}%</b></span></div>}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {strat.entry_price && <div className="p-2 bg-[var(--color-bg-primary)] rounded"><div className="text-[var(--color-text-muted)]">{t('entry')}</div><div className="font-bold">${strat.entry_price}</div></div>}
                  {strat.target_price && <div className="p-2 bg-[var(--color-bg-primary)] rounded"><div className="text-[var(--color-text-muted)]">{t('target')}</div><div className="font-bold text-[var(--color-success)]">${strat.target_price}</div></div>}
                  {strat.stop_loss && <div className="p-2 bg-[var(--color-bg-primary)] rounded"><div className="text-[var(--color-text-muted)]">{t('stop_loss')}</div><div className="font-bold text-[var(--color-danger)]">${strat.stop_loss}</div></div>}
                </div>
                {strat.reasons && <div className="flex gap-1.5 mt-2 flex-wrap">{strat.reasons.map((r: string, i: number) => <span key={i} className="text-xs px-2 py-0.5 rounded bg-[var(--color-bg-hover)]">{r}</span>)}</div>}
                <div className="text-xs text-[var(--color-text-muted)] mt-2">{t('best_for')}: {strat.best_for || 'All markets'}</div>
              </Card>
            ))
          ) : (
            <Card className="p-3">
              <h3 className="text-sm font-bold mb-2">{result.data?.strategy}</h3>
              {result.data?.signal && <div className="flex items-center gap-3 mb-2"><span className={`px-3 py-1 rounded-lg text-sm font-bold ${result.data.signal.includes('BUY') ? 'bg-green-500/20 text-green-400' : result.data.signal.includes('SELL') ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{result.data.signal}</span><span className="text-sm">{t('confidence')}: <b>{result.data.confidence}%</b></span></div>}
              <div className="grid grid-cols-3 gap-2 text-xs">
                {result.data?.entry_price && <div className="p-2 bg-[var(--color-bg-primary)] rounded"><div className="text-[var(--color-text-muted)]">{t('entry')}</div><div className="font-bold">${result.data.entry_price}</div></div>}
                {result.data?.target_price && <div className="p-2 bg-[var(--color-bg-primary)] rounded"><div className="text-[var(--color-text-muted)]">{t('target')}</div><div className="font-bold text-[var(--color-success)]">${result.data.target_price}</div></div>}
                {result.data?.stop_loss && <div className="p-2 bg-[var(--color-bg-primary)] rounded"><div className="text-[var(--color-text-muted)]">{t('stop_loss')}</div><div className="font-bold text-[var(--color-danger)]">${result.data.stop_loss}</div></div>}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default TradingBots;