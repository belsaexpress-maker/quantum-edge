import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import { Wallet, Send } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const BinanceTrade: React.FC = () => {
  const { t } = useLang();
  const [balance, setBalance] = useState<any[]>([]);
  const [symbol, setSymbol] = useState('BTC');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchBalance(); }, []);

  const fetchBalance = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/binance/balance');
      if (res.data?.balances) setBalance(res.data.balances.slice(0, 10));
    } catch (err) { console.error(err); }
  };

  const fetchPrice = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/binance/price/${symbol}`);
      if (res.data?.price) setPrice(res.data.price.toFixed(2));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchPrice(); }, [symbol]);

  const handleOrder = async () => {
    if (!quantity) return;
    setLoading(true); setMessage('');
    try {
      const res = await axios.post('http://localhost:8000/api/binance/order', { symbol, side, quantity: parseFloat(quantity), order_type: 'MARKET' });
      if (res.data?.success) { setMessage(`✅ ${t('order_success')}! ID: ${res.data.order_id}`); fetchBalance(); }
      else { setMessage(`❌ ${res.data.error}`); }
    } catch (err: any) { setMessage(`❌ ${err.response?.data?.detail || t('order_error')}`); }
    setLoading(false);
  };

  return (
    <div className="space-y-3 max-w-xl">
      <h2 className="text-base font-semibold flex items-center gap-2"><Wallet size={18} className="text-[var(--color-accent)]" /> {t('binance_trade')}</h2>
      <Card className="p-3">
        <h3 className="text-sm font-semibold mb-2">💰 {t('balance')}</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {balance.map((b) => (<div key={b.asset} className="p-2 bg-[var(--color-bg-primary)] rounded text-center"><div className="text-xs font-bold">{b.asset}</div><div className="text-xs text-[var(--color-text-muted)]">{b.total.toFixed(4)}</div></div>))}
        </div>
        <button onClick={fetchBalance} className="text-xs text-[var(--color-accent)] mt-2">{t('refresh')}</button>
      </Card>
      <Card className="p-3">
        <h3 className="text-sm font-semibold mb-2">📈 Trade</h3>
        <div className="space-y-2">
          <div><label className="text-xs text-[var(--color-text-muted)]">{t('symbol')}</label><select value={symbol} onChange={e => setSymbol(e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-white">{['BTC','ETH','SOL','BNB','ADA','XRP','DOGE'].map(s => <option key={s}>{s}</option>)}</select></div>
          <div><label className="text-xs text-[var(--color-text-muted)]">{t('price')} (USDT)</label><input type="text" value={price} readOnly className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-white" /></div>
          <div className="flex gap-2">
            <button onClick={() => setSide('BUY')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${side === 'BUY' ? 'bg-green-600 text-white' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]'}`}>{t('buy')}</button>
            <button onClick={() => setSide('SELL')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${side === 'SELL' ? 'bg-red-600 text-white' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]'}`}>{t('sell')}</button>
          </div>
          <div><label className="text-xs text-[var(--color-text-muted)]">{t('quantity')}</label><input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0.001" className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-white" /></div>
          <button onClick={handleOrder} disabled={loading} className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${side === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white disabled:opacity-50`}>
            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <><Send size={16} /> {side} {symbol}</>}
          </button>
          {message && <div className="text-xs p-2 rounded bg-[var(--color-bg-primary)]">{message}</div>}
        </div>
      </Card>
    </div>
  );
};

export default BinanceTrade;