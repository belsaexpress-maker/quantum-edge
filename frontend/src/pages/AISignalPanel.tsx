import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import { Brain, Target, Shield, TrendingUp, TrendingDown } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/market';

const AISignalPanel: React.FC = () => {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTCUSDT');
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    loadSignals();
    const interval = setInterval(loadSignals, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSignals = async () => {
    try {
      const res = await axios.get(`${API_URL}/ai-signals`);
      if (res.data?.signals) setSignals(res.data.signals);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadDetail = async (symbol: string) => {
    setSelectedSymbol(symbol);
    try {
      const res = await axios.get(`${API_URL}/ai-signals/${symbol.replace('USDT', '')}`);
      setDetail(res.data);
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="space-y-3 max-w-full overflow-x-hidden">
      <h2 className="text-base font-semibold flex items-center gap-2">
        <Brain size={18} className="text-[var(--color-accent)]" /> AI Sinyal & TP/SL Panosu
      </h2>

      {/* Sinyal Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {signals.map((s: any) => {
          const ai = s.ai_signal || {};
          const isBuy = ai.signal?.includes('BUY');
          const isSell = ai.signal === 'SELL';
          
          return (
            <Card 
              key={s.symbol} 
              className={`p-3 cursor-pointer border-l-4 hover:border-[var(--color-accent)]/50 transition-all ${
                selectedSymbol === s.symbol ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/5' : 
                isBuy ? 'border-l-green-500' : isSell ? 'border-l-red-500' : 'border-l-yellow-500'
              }`}
              onClick={() => loadDetail(s.symbol)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold">{s.symbol?.replace('USDT', '/USDT')}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  isBuy ? 'bg-green-500/20 text-green-400' : 
                  isSell ? 'bg-red-500/20 text-red-400' : 
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {ai.signal || 'HOLD'}
                </span>
              </div>

              <div className="text-lg font-bold mb-2">${s.entry_price?.toLocaleString()}</div>

              {/* AI Skor Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--color-text-muted)]">AI Skor</span>
                  <span className="font-bold">{ai.score || 0}</span>
                </div>
                <div className="w-full h-2 bg-[var(--color-bg-hover)] rounded-full">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      (ai.score || 0) > 40 ? 'bg-green-500' : (ai.score || 0) < -20 ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.abs(ai.score || 0)}%` }}
                  />
                </div>
              </div>

              {/* TP Seviyeleri */}
              <div className="space-y-1 mb-2 text-xs">
                <div className="text-[var(--color-text-muted)] mb-1">🎯 Hedef Seviyeleri:</div>
                {s.tp_levels?.map((tp: any) => (
                  <div key={tp.level} className="flex justify-between text-green-400">
                    <span>{tp.level}</span>
                    <span>${tp.price?.toLocaleString()} <span className="text-[var(--color-text-muted)]">(+{tp.pct}%)</span></span>
                  </div>
                ))}
                <div className="flex justify-between text-red-400 pt-1 border-t border-[var(--color-border)]">
                  <span>🛑 Stop-Loss</span>
                  <span>${s.stop_loss?.price?.toLocaleString()} <span className="text-[var(--color-text-muted)]">(-{s.stop_loss?.pct}%)</span></span>
                </div>
              </div>

              {/* AI Sebepler */}
              {ai.reasons?.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {ai.reasons.map((r: string, i: number) => (
                    <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]">{r}</span>
                  ))}
                </div>
              )}

              {/* Destek/Direnç */}
              <div className="flex justify-between text-xs mt-2 pt-2 border-t border-[var(--color-border)]">
                <span className="text-green-400">📈 Direnç: ${s.resistance?.toLocaleString()}</span>
                <span className="text-red-400">📉 Destek: ${s.support?.toLocaleString()}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detay Modal */}
      {detail && (
        <Card className="p-3 border-2 border-[var(--color-accent)]/30">
          <h3 className="text-sm font-bold mb-3">📊 {detail.symbol} Detaylı Analiz</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3">
            <div className="p-2 bg-[var(--color-bg-primary)] rounded">
              <div className="text-[var(--color-text-muted)]">Giriş Fiyatı</div>
              <div className="font-bold">${detail.entry_price}</div>
            </div>
            <div className="p-2 bg-[var(--color-bg-primary)] rounded">
              <div className="text-[var(--color-text-muted)]">ATR (14)</div>
              <div className="font-bold">{detail.atr}</div>
            </div>
            <div className="p-2 bg-[var(--color-bg-primary)] rounded">
              <div className="text-[var(--color-text-muted)]">RSI</div>
              <div className="font-bold">{detail.ai_signal?.rsi}</div>
            </div>
            <div className="p-2 bg-[var(--color-bg-primary)] rounded">
              <div className="text-[var(--color-text-muted)]">Güven</div>
              <div className="font-bold">{detail.ai_signal?.confidence}%</div>
            </div>
          </div>
          <div className="text-xs text-[var(--color-text-muted)]">
            <p>📐 <b>Hesaplama Yöntemi:</b> Sabit % + ATR + Destek/Direnç ortalaması</p>
            <p>⏱️ <b>Zaman Dilimi:</b> 1 saatlik</p>
            <p>📊 <b>Güncelleme:</b> 30 saniyede bir</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AISignalPanel;