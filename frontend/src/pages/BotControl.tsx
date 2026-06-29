import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import { Play, Square, RefreshCw, TrendingUp, Zap, Target, Grid3X3, BarChart3, Activity, Settings, DollarSign } from 'lucide-react';

const BotControl: React.FC = () => {
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [capital, setCapital] = useState('100');
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [showSettings, setShowSettings] = useState(false);
  const [allocation, setAllocation] = useState({
    grid: 20, dca: 25, scalping: 15, momentum: 15, signal: 15, ai: 10
  });

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

  const handleStartAll = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Önce sermayeyi ayarla
      await axios.post('http://localhost:8000/api/bots/set-capital', {
        amount: parseFloat(capital),
        allocation: {
          grid: allocation.grid / 100,
          dca: allocation.dca / 100,
          scalping: allocation.scalping / 100,
          momentum: allocation.momentum / 100,
          signal: allocation.signal / 100,
          ai: allocation.ai / 100
        }
      });
      // Sonra botları başlat
      const res = await axios.post(`http://localhost:8000/api/bots/start/all?symbol=${symbol}`);
      setMessage('✅ Botlar başlatıldı!');
      fetchStatus();
    } catch (err: any) {
      setMessage('❌ ' + (err.response?.data?.detail || 'Başlatma hatası'));
    }
    setLoading(false);
  };

  const handleStopAll = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:8000/api/bots/stop/all');
      setMessage('🛑 Botlar durduruldu');
      setStatus(res.data);
    } catch (err: any) {
      setMessage('❌ Hata');
    }
    setLoading(false);
  };

  const botIcons: any = { grid: Grid3X3, scalping: Zap, momentum: TrendingUp, dca: BarChart3, signal: Activity, ai: Target };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">🤖 Bot Kontrol Paneli</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1E2329] border border-[#2B3139] text-white text-sm rounded-lg">
            <Settings size={16} /> Ayarlar
          </button>
          <button onClick={handleStartAll} disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#03A66D] hover:bg-[#038D5B] text-white text-sm rounded-lg font-bold disabled:opacity-50">
            <Play size={16} /> Başlat
          </button>
          <button onClick={handleStopAll} disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#CF304A] hover:bg-[#B0283E] text-white text-sm rounded-lg font-bold disabled:opacity-50">
            <Square size={16} /> Durdur
          </button>
        </div>
      </div>

      {message && (
        <div className={`text-sm p-3 rounded-lg ${message.includes('✅') ? 'bg-green-500/10 text-[#03A66D]' : message.includes('🛑') ? 'bg-yellow-500/10 text-[#F0B90B]' : 'bg-red-500/10 text-[#CF304A]'}`}>
          {message}
        </div>
      )}

      {/* Ayarlar Paneli */}
      {showSettings && (
        <Card className="p-3">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><DollarSign size={16} className="text-[#F0B90B]" /> Bot Ayarları</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#848E9C] block mb-1">Toplam Sermaye ($)</label>
              <input type="number" value={capital} onChange={e => setCapital(e.target.value)}
                className="w-full bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-[#848E9C] block mb-1">İşlem Çifti</label>
              <input type="text" value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())}
                className="w-full bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-[#848E9C] block mb-1">Grid Bot (%)</label>
              <input type="number" value={allocation.grid} onChange={e => setAllocation({...allocation, grid: parseInt(e.target.value)})}
                className="w-full bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-[#848E9C] block mb-1">DCA Bot (%)</label>
              <input type="number" value={allocation.dca} onChange={e => setAllocation({...allocation, dca: parseInt(e.target.value)})}
                className="w-full bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-[#848E9C] block mb-1">Scalping (%)</label>
              <input type="number" value={allocation.scalping} onChange={e => setAllocation({...allocation, scalping: parseInt(e.target.value)})}
                className="w-full bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-[#848E9C] block mb-1">Momentum (%)</label>
              <input type="number" value={allocation.momentum} onChange={e => setAllocation({...allocation, momentum: parseInt(e.target.value)})}
                className="w-full bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white" />
            </div>
          </div>
        </Card>
      )}

      {/* Bot Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(status)
          .filter(([key]) => !['total_profit', 'capital', 'roi'].includes(key))
          .map(([name, data]: any) => {
            const Icon = botIcons[name] || Activity;
            const isActive = data?.active;
            return (
              <Card key={name} className={`p-3 ${isActive ? 'border-l-4 border-l-[#03A66D]' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold capitalize flex items-center gap-1.5">
                    <Icon size={16} className="text-[#F0B90B]" />
                    {name} Bot
                  </h3>
                  <span className={`w-3 h-3 rounded-full ${isActive ? 'bg-[#03A66D] animate-pulse' : 'bg-gray-500'}`} />
                </div>
                <div className="space-y-1 text-xs">
                  {data?.symbol && <div className="flex justify-between"><span className="text-[#848E9C]">Sembol:</span><span className="text-white">{data.symbol}</span></div>}
                  {data?.current_price !== undefined && <div className="flex justify-between"><span className="text-[#848E9C]">Fiyat:</span><span className="text-white">${data.current_price?.toLocaleString()}</span></div>}
                  {data?.total_profit !== undefined && <div className="flex justify-between"><span className="text-[#848E9C]">Kâr:</span><span className={data.total_profit >= 0 ? 'text-[#03A66D]' : 'text-[#CF304A]'}>${data.total_profit?.toFixed(2)}</span></div>}
                  {data?.trades !== undefined && <div className="flex justify-between"><span className="text-[#848E9C]">İşlem:</span><span className="text-white">{data.trades}</span></div>}
                  {data?.trade_count !== undefined && <div className="flex justify-between"><span className="text-[#848E9C]">İşlem:</span><span className="text-white">{data.trade_count}</span></div>}
                  {data?.wins !== undefined && <div className="flex justify-between"><span className="text-[#848E9C]">K/Z:</span><span className="text-white">{data.wins}W / {data.losses}L</span></div>}
                  {data?.buys !== undefined && <div className="flex justify-between"><span className="text-[#848E9C]">Alım:</span><span className="text-white">{data.buys}</span></div>}
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default BotControl;