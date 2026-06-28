import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import { Play, Square, RefreshCw, TrendingUp, Zap, Target } from 'lucide-react';

const BotControl: React.FC = () => {
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/bots/status');
      setStatus(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const startAll = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/bots/start/all?symbol=BTCUSDT');
      fetchStatus();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const stopAll = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/bots/stop/all');
      setStatus(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">🤖 Bot Kontrol Paneli</h2>
        <div className="flex gap-2">
          <button onClick={startAll} disabled={loading} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
            <Play size={16} /> Tümünü Başlat
          </button>
          <button onClick={stopAll} disabled={loading} className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
            <Square size={16} /> Tümünü Durdur
          </button>
        </div>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <div className="text-xs text-[var(--color-text-muted)]">Sermaye</div>
          <div className="text-xl font-bold">${status.capital || 100}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xs text-[var(--color-text-muted)]">Toplam Kâr</div>
          <div className={`text-xl font-bold ${(status.total_profit || 0) >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
            ${status.total_profit?.toFixed(2) || '0.00'}
          </div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xs text-[var(--color-text-muted)]">ROI</div>
          <div className={`text-xl font-bold ${(status.roi || 0) >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
            %{status.roi || 0}
          </div>
        </Card>
      </div>

      {/* Bot Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {['grid', 'scalping', 'momentum'].map((bot) => {
          const data = status[bot] || {};
          const icons: any = { grid: TrendingUp, scalping: Zap, momentum: Target };
          const Icon = icons[bot];
          return (
            <Card key={bot} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold capitalize flex items-center gap-1.5">
                  <Icon size={16} className="text-[var(--color-accent)]" />
                  {bot} Bot
                </h3>
                <span className={`w-2 h-2 rounded-full ${data.active ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span>İşlem:</span><span>{data.trade_count || 0}</span></div>
                <div className="flex justify-between"><span>Kazanma:</span><span>{data.win_rate || 0}%</span></div>
                <div className="flex justify-between"><span>Kâr:</span><span className={data.total_profit >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}>${data.total_profit?.toFixed(2) || '0.00'}</span></div>
                <div className="flex justify-between"><span>Fiyat:</span><span>${data.current_price?.toLocaleString() || '0'}</span></div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Son İşlemler */}
      <Card className="p-0 overflow-hidden">
        <div className="p-3 border-b border-[var(--color-border)]">
          <h3 className="text-sm font-semibold">Son İşlemler</h3>
        </div>
        <div className="overflow-x-auto max-h-60 overflow-y-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-[var(--color-text-muted)]"><th className="py-2 px-3 text-left">Bot</th><th className="py-2 px-3 text-left">Tip</th><th className="py-2 px-3 text-right">Kâr</th><th className="py-2 px-3 text-right">Zaman</th></tr></thead>
            <tbody>
              {Object.entries(status).filter(([k]) => k !== 'total_profit' && k !== 'capital' && k !== 'roi').map(([name, data]: any) =>
                (data?.recent_trades || []).slice(-3).map((trade: any, i: number) => (
                  <tr key={`${name}-${i}`} className="border-b border-[var(--color-border)]">
                    <td className="py-2 px-3 capitalize">{name}</td>
                    <td className="py-2 px-3">{trade.signal || trade.type}</td>
                    <td className={`py-2 px-3 text-right ${trade.profit >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>${trade.profit}</td>
                    <td className="py-2 px-3 text-right text-[var(--color-text-muted)]">{new Date(trade.time).toLocaleTimeString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default BotControl;