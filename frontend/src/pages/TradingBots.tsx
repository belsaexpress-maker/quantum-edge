import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import { Play, Square, RefreshCw, Bot, TrendingUp, Zap, Target } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/bots';

const TradingBots: React.FC = () => {
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [exchange, setExchange] = useState('binance');

  const [gridCapital, setGridCapital] = useState(50);
  const [gridLevels, setGridLevels] = useState(5);
  const [gridSpacing, setGridSpacing] = useState(0.01);

  const [scalpCapital, setScalpCapital] = useState(30);
  const [scalpMaxTrades, setScalpMaxTrades] = useState(50);

  const [momCapital, setMomCapital] = useState(20);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/status`);
      setStatus(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const startBot = async (bot: string) => {
    setLoading({ ...loading, [bot]: true });
    try {
      let url = '';
      if (bot === 'grid') url = `${API_URL}/start/grid?symbol=${symbol}&capital=${gridCapital}&grid_levels=${gridLevels}&spacing=${gridSpacing}`;
      else if (bot === 'scalping') url = `${API_URL}/start/scalping?symbol=${symbol}&capital=${scalpCapital}&max_trades=${scalpMaxTrades}`;
      else if (bot === 'momentum') url = `${API_URL}/start/momentum?symbol=${symbol}&capital=${momCapital}`;
      await axios.post(url);
      fetchStatus();
    } catch (err) {}
    setLoading({ ...loading, [bot]: false });
  };

  const stopBot = async (bot: string) => {
    setLoading({ ...loading, [bot]: true });
    try {
      await axios.post(`${API_URL}/stop/${bot}`);
      fetchStatus();
    } catch (err) {}
    setLoading({ ...loading, [bot]: false });
  };

  const stopAll = async () => {
    setLoading({ ...loading, all: true });
    try {
      await axios.post(`${API_URL}/stop/all`);
      fetchStatus();
    } catch (err) {}
    setLoading({ ...loading, all: false });
  };

  const botConfigs = [
    {
      id: 'grid', name: 'Grid Bot', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/20',
      risk: '🟢 Düşük Risk', bestFor: 'Yatay piyasa', expected: '$8-15/gün',
      capital: gridCapital, setCapital: setGridCapital,
      params: [
        { label: 'Grid Seviyesi', value: gridLevels, set: setGridLevels, type: 'number' },
        { label: 'Aralık (%)', value: gridSpacing * 100, set: (v: number) => setGridSpacing(v / 100), type: 'number' },
      ],
    },
    {
      id: 'scalping', name: 'AI Scalping', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/20',
      risk: '🟡 Orta Risk', bestFor: 'Her piyasa', expected: '$10-25/gün',
      capital: scalpCapital, setCapital: setScalpCapital,
      params: [
        { label: 'Max İşlem', value: scalpMaxTrades, set: setScalpMaxTrades, type: 'number' },
      ],
    },
    {
      id: 'momentum', name: 'Momentum', icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/20',
      risk: '🔴 Yüksek Risk', bestFor: 'Trend piyasası', expected: '$15-40/gün',
      capital: momCapital, setCapital: setMomCapital, params: [],
    },
  ];

  return (
    <div className="space-y-3 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-base font-semibold flex items-center gap-2"><Bot size={18} className="text-[var(--color-accent)]" /> Bot Kontrol Paneli</h2>
        <div className="flex items-center gap-2">
          {/* Borsa Seçimi */}
          <select value={exchange} onChange={e => setExchange(e.target.value)} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-white">
            <option value="binance">Binance</option>
            <option value="gateio">Gate.io</option>
          </select>
          {/* Sembol Seçimi */}
          <select value={symbol} onChange={e => setSymbol(e.target.value)} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-white">
            {['BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','ADAUSDT','XRPUSDT','DOGEUSDT'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={stopAll} disabled={loading.all} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">
            <Square size={14} /> Tümünü Durdur
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Card className="p-3 text-center"><div className="text-xs text-[var(--color-text-muted)]">Aktif Bot</div><div className="text-xl font-bold text-[var(--color-accent)]">{status.active_bots || 0}</div></Card>
        <Card className="p-3 text-center"><div className="text-xs text-[var(--color-text-muted)]">Toplam Kâr</div><div className={`text-xl font-bold ${(status.total_profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>${(status.total_profit || 0).toFixed(2)}</div></Card>
        <Card className="p-3 text-center"><div className="text-xs text-[var(--color-text-muted)]">Sembol</div><div className="text-lg font-bold">{symbol.replace('USDT', '/USDT')}</div></Card>
        <Card className="p-3 text-center"><div className="text-xs text-[var(--color-text-muted)]">Toplam Sermaye</div><div className="text-lg font-bold">${gridCapital + scalpCapital + momCapital}</div></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {botConfigs.map(bot => {
          const data = status[bot.id] || {};
          const isActive = data.active;
          return (
            <Card key={bot.id} className={`p-3 ${isActive ? 'border-[var(--color-accent)]/50' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${bot.bg} flex items-center justify-center`}><bot.icon size={18} className={bot.color} /></div>
                  <div><h3 className="text-sm font-bold">{bot.name}</h3><span className={`w-2 h-2 rounded-full inline-block mr-1 ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} /><span className="text-xs text-[var(--color-text-muted)]">{isActive ? 'Çalışıyor' : 'Durdu'}</span></div>
                </div>
                <div className="flex gap-1">
                  {!isActive ? (
                    <button onClick={() => startBot(bot.id)} disabled={loading[bot.id]} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"><Play size={12} /> Başlat</button>
                  ) : (
                    <button onClick={() => stopBot(bot.id)} disabled={loading[bot.id]} className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"><Square size={12} /> Durdur</button>
                  )}
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div><label className="text-xs text-[var(--color-text-muted)]">Sermaye (USDT)</label><input type="number" value={bot.capital} onChange={e => bot.setCapital(parseFloat(e.target.value) || 0)} disabled={isActive} className="w-full mt-0.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded px-3 py-1.5 text-xs text-white disabled:opacity-50" /></div>
                {bot.params.map((param: any) => (
                  <div key={param.label}><label className="text-xs text-[var(--color-text-muted)]">{param.label}</label><input type={param.type} value={param.value} onChange={e => param.set(parseFloat(e.target.value) || 0)} disabled={isActive} className="w-full mt-0.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded px-3 py-1.5 text-xs text-white disabled:opacity-50" /></div>
                ))}
              </div>
              {isActive && (
                <div className="bg-[var(--color-bg-primary)] rounded-lg p-2 space-y-1 text-xs">
                  <div className="flex justify-between"><span>İşlem:</span><span className="font-bold">{data.trade_count || data.trades || 0}</span></div>
                  <div className="flex justify-between"><span>Kazanma:</span><span className="font-bold">{data.win_rate || 0}%</span></div>
                  <div className="flex justify-between"><span>Kâr:</span><span className={`font-bold ${(data.total_profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>${(data.total_profit || 0).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Fiyat:</span><span className="font-bold">${data.current_price?.toFixed(2) || '0'}</span></div>
                </div>
              )}
              <div className="mt-2 text-xs text-[var(--color-text-muted)]"><div>{bot.risk}</div><div>Beklenen: {bot.expected}</div><div>En iyi: {bot.bestFor}</div></div>
            </Card>
          );
        })}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-3 border-b border-[var(--color-border)] flex items-center justify-between"><h3 className="text-sm font-semibold">Son İşlemler</h3><button onClick={fetchStatus} className="flex items-center gap-1 text-xs text-[var(--color-accent)]"><RefreshCw size={12} /> Yenile</button></div>
        <div className="overflow-x-auto max-h-60 overflow-y-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-[var(--color-text-muted)] border-b border-[var(--color-border)]"><th className="py-2 px-3 text-left">Bot</th><th className="py-2 px-3 text-left">Tip</th><th className="py-2 px-3 text-right">Kâr ($)</th><th className="py-2 px-3 text-right">Zaman</th></tr></thead>
            <tbody>
              {Object.entries(status).filter(([k]) => ['grid','scalping','momentum'].includes(k)).map(([name, data]: any) =>
                (data?.recent_trades || data?.trades || []).slice(-5).reverse().map((trade: any, i: number) => (
                  <tr key={`${name}-${i}`} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]">
                    <td className="py-2 px-3 font-medium capitalize">{name}</td>
                    <td className="py-2 px-3">{trade.signal || trade.type || '-'}</td>
                    <td className={`py-2 px-3 text-right font-bold ${(trade.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>${(trade.profit || 0).toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-[var(--color-text-muted)]">{trade.time ? new Date(trade.time).toLocaleTimeString() : '-'}</td>
                  </tr>
                ))
              )}
              {(!status.grid?.recent_trades && !status.scalping?.recent_trades && !status.momentum?.recent_trades) && (
                <tr><td colSpan={4} className="text-center py-4 text-[var(--color-text-muted)]">Henüz işlem yok. Bir bot başlatın.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TradingBots;