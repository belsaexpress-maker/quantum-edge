import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import { Bot, TrendingUp, Zap, Target, Grid3X3, BarChart3, Play, Square, RefreshCw, Activity } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const TradingBots: React.FC = () => {
  const { t } = useLang();
  const [symbol, setSymbol] = useState('BTC');
  const [price, setPrice] = useState('60000');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [botStatus, setBotStatus] = useState<any>({});
  const [startLoading, setStartLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchBots = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/bots/all/${symbol}?price=${price}`);
      setResult(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchStatus = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/bots/status');
      setBotStatus(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartAll = async () => {
    setStartLoading(true);
    setMessage('');
    try {
      await axios.post(`http://localhost:8000/api/bots/start/all?symbol=${symbol}USDT`);
      setMessage('✅ Botlar başlatıldı!');
      fetchStatus();
    } catch (err: any) {
      setMessage('❌ ' + (err.response?.data?.detail || 'Başlatma hatası'));
    }
    setStartLoading(false);
  };

  const handleStopAll = async () => {
    setStartLoading(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:8000/api/bots/stop/all');
      setMessage('🛑 Botlar durduruldu');
      setBotStatus(res.data);
    } catch (err: any) {
      setMessage('❌ Hata');
    }
    setStartLoading(false);
  };

  const botIcons: any = { grid: Grid3X3, scalping: Zap, momentum: TrendingUp, dca: BarChart3, signal: Activity, ai: Target };

  return (
    <div className="space-y-3 max-w-4xl">
      <h2 className="text-base font-semibold flex items-center gap-2"><Bot size={18} className="text-[#F0B90B]" /> AI Trading Bots</h2>
      
      <Card className="p-3">
        <div className="flex gap-2 flex-wrap items-end">
          <div>
            <label className="text-xs text-[#848E9C] block mb-1">Coin</label>
            <select value={symbol} onChange={e => setSymbol(e.target.value)} className="bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white">
              {['BTC','ETH','SOL','BNB','ADA','XRP','DOGE','AVAX','DOT','LINK'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#848E9C] block mb-1">Fiyat (USD)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-28 bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white" />
          </div>
          <button onClick={fetchBots} disabled={loading} className="px-4 py-2 bg-[#F0B90B] text-black font-bold rounded-lg text-sm disabled:opacity-50">
            {loading ? 'Yükleniyor...' : 'Stratejileri Göster'}
          </button>
          <button onClick={handleStartAll} disabled={startLoading} className="px-4 py-2 bg-[#03A66D] text-white font-bold rounded-lg text-sm flex items-center gap-1.5 disabled:opacity-50">
            <Play size={16} /> Botları Başlat
          </button>
          <button onClick={handleStopAll} disabled={startLoading} className="px-4 py-2 bg-[#CF304A] text-white font-bold rounded-lg text-sm flex items-center gap-1.5 disabled:opacity-50">
            <Square size={16} /> Durdur
          </button>
        </div>
        {message && (
          <div className={`mt-2 text-xs p-2 rounded ${message.includes('✅') ? 'bg-green-500/10 text-[#03A66D]' : message.includes('🛑') ? 'bg-yellow-500/10 text-[#F0B90B]' : 'bg-red-500/10 text-[#CF304A]'}`}>
            {message}
          </div>
        )}
      </Card>

      {/* Canlı Bot Durumu */}
      {Object.keys(botStatus).length > 3 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(botStatus)
            .filter(([key]) => !['total_profit', 'capital', 'roi'].includes(key))
            .slice(0, 6)
            .map(([name, data]: any) => {
              const Icon = botIcons[name] || Activity;
              const isActive = data?.active;
              return (
                <Card key={name} className={`p-2 text-center ${isActive ? 'border border-[#03A66D]/50' : ''}`}>
                  <Icon size={20} className={`mx-auto mb-1 ${isActive ? 'text-[#03A66D]' : 'text-[#848E9C]'}`} />
                  <div className="text-xs font-bold capitalize text-white">{name}</div>
                  <div className={`text-xs ${isActive ? 'text-[#03A66D]' : 'text-[#848E9C]'}`}>
                    {isActive ? 'Çalışıyor' : 'Durdu'}
                  </div>
                  {data?.total_profit !== undefined && (
                    <div className={`text-xs mt-1 font-bold ${data.total_profit >= 0 ? 'text-[#03A66D]' : 'text-[#CF304A]'}`}>
                      ${data.total_profit?.toFixed(2)}
                    </div>
                  )}
                </Card>
              );
            })}
        </div>
      )}

      {result && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <Card className="p-3"><div className="text-xs text-[#848E9C]">Sermaye</div><div className="text-lg font-bold text-white">{result.total_capital}</div></Card>
            <Card className="p-3"><div className="text-xs text-[#848E9C]">Günlük Beklenti</div><div className="text-lg font-bold text-[#03A66D]">{result.total_expected_daily}</div></Card>
            <Card className="p-3"><div className="text-xs text-[#848E9C]">Aylık Projeksiyon</div><div className="text-lg font-bold text-[#F0B90B]">{result.monthly_projection}</div></Card>
            <Card className="p-3"><div className="text-xs text-[#848E9C]">Strateji</div><div className="text-lg font-bold text-white">4</div></Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(result.strategies).map(([key, strat]: any) => (
              <Card key={key} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white">{strat.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                    strat.risk === 'Düşük' ? 'bg-green-500/20 text-[#03A66D]' :
                    strat.risk === 'Yüksek' ? 'bg-red-500/20 text-[#CF304A]' :
                    'bg-yellow-500/20 text-[#F0B90B]'
                  }`}>{strat.risk} Risk</span>
                </div>
                <p className="text-xs text-[#848E9C] mb-3">{strat.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div className="p-2 bg-[#1E2329] rounded">
                    <div className="text-[#848E9C]">Sermaye</div>
                    <div className="text-white font-bold">{strat.capital}</div>
                  </div>
                  <div className="p-2 bg-[#1E2329] rounded">
                    <div className="text-[#848E9C]">Günlük</div>
                    <div className="text-[#03A66D] font-bold">{strat.expected_daily}</div>
                  </div>
                </div>

                {strat.entry_example && (
                  <div className="grid grid-cols-3 gap-1 text-xs mb-2">
                    <div className="p-1.5 bg-[#1E2329] rounded text-center">
                      <div className="text-[#848E9C]">Giriş</div>
                      <div className="text-white">${strat.entry_example}</div>
                    </div>
                    <div className="p-1.5 bg-[#1E2329] rounded text-center">
                      <div className="text-[#848E9C]">Hedef</div>
                      <div className="text-[#03A66D]">${strat.target_example}</div>
                    </div>
                    {strat.stop_example && (
                      <div className="p-1.5 bg-[#1E2329] rounded text-center">
                        <div className="text-[#848E9C]">Stop</div>
                        <div className="text-[#CF304A]">${strat.stop_example}</div>
                      </div>
                    )}
                  </div>
                )}

                {strat.levels && (
                  <div className="space-y-1 mb-2">
                    {strat.levels.map((lvl: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs p-1.5 bg-[#1E2329] rounded">
                        <span className="text-[#848E9C]">{lvl.drop} düşüş</span>
                        <span className="text-white">Alış: ${lvl.buy}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-xs text-[#848E9C]">
                  <span className="text-[#F0B90B]">En uygun:</span> {strat.best_for}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TradingBots;