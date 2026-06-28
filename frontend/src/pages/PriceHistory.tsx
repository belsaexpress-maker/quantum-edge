import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import { TrendingUp, TrendingDown, History } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

interface PriceRecord { price: number; change: number; time: string; }

const PriceHistoryPage: React.FC = () => {
  const { t } = useLang();
  const [symbol, setSymbol] = useState('BTC');
  const [data, setData] = useState<PriceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/market/history/${symbol}?limit=30`);
      if (res.data?.data) setData(res.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchHistory(); }, [symbol]);

  return (
    <div className="space-y-3 max-w-2xl">
      <h2 className="text-base font-semibold flex items-center gap-2"><History size={18} className="text-[var(--color-accent)]" /> {t('price_history')}</h2>
      <Card className="p-3">
        <div className="flex gap-2">
          <select value={symbol} onChange={e => setSymbol(e.target.value)} className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-white">
            {['BTC','ETH','SOL','BNB','ADA','XRP','DOGE'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={fetchHistory} disabled={loading} className="px-4 py-2 bg-[var(--color-accent)] text-white text-sm rounded-lg disabled:opacity-50">{loading ? '...' : t('refresh')}</button>
        </div>
      </Card>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-[var(--color-text-muted)] border-b border-[var(--color-border)]"><th className="text-left py-2 px-3">{t('time')}</th><th className="text-right py-2 px-3">{t('price')}</th><th className="text-right py-2 px-3">{t('change')}</th></tr></thead>
            <tbody>
              {data.map((r, i) => (
                <tr key={i} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]">
                  <td className="py-2 px-3 text-[var(--color-text-muted)]">{new Date(r.time).toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-medium">${r.price?.toLocaleString()}</td>
                  <td className={`py-2 px-3 text-right ${r.change >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}><span className="flex items-center justify-end gap-1">{r.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{r.change?.toFixed(2)}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PriceHistoryPage;