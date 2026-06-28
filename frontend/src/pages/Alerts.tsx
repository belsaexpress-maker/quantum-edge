import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

interface Alert { id: number; symbol: string; type: 'above' | 'below'; price: number; active: boolean; }

const Alerts: React.FC = () => {
  const { t } = useLang();
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, symbol: 'BTC', type: 'above', price: 120000, active: true },
    { id: 2, symbol: 'ETH', type: 'below', price: 3800, active: true },
    { id: 3, symbol: 'SOL', type: 'above', price: 250, active: false },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newType, setNewType] = useState<'above' | 'below'>('above');
  const [newPrice, setNewPrice] = useState('');

  const addAlert = () => {
    if (!newSymbol || !newPrice) return;
    setAlerts([...alerts, { id: Date.now(), symbol: newSymbol.toUpperCase(), type: newType, price: parseFloat(newPrice), active: true }]);
    setNewSymbol(''); setNewPrice(''); setShowForm(false);
  };

  const toggleAlert = (id: number) => setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  const deleteAlert = (id: number) => setAlerts(alerts.filter(a => a.id !== id));

  return (
    <div className="space-y-3 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold flex items-center gap-2"><Bell size={18} className="text-[var(--color-accent)]" /> {t('price_alerts')}</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] text-white text-xs font-medium rounded-lg"><Plus size={14} /> {t('new_alert')}</button>
      </div>
      {showForm && (
        <Card className="p-3">
          <div className="flex gap-2 flex-wrap">
            <input type="text" placeholder={t('symbol')} value={newSymbol} onChange={(e) => setNewSymbol(e.target.value)} className="flex-1 min-w-[80px] bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none" />
            <select value={newType} onChange={(e) => setNewType(e.target.value as 'above' | 'below')} className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-white">
              <option value="above">{t('above')}</option>
              <option value="below">{t('below')}</option>
            </select>
            <input type="number" placeholder={t('price')} value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-24 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-white" />
            <button onClick={addAlert} className="px-4 py-1.5 bg-green-600 text-white text-xs rounded-lg">{t('add')}</button>
          </div>
        </Card>
      )}
      <div className="space-y-2">
        {alerts.map((alert) => (
          <Card key={alert.id} className={`p-3 ${!alert.active ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${alert.type === 'above' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {alert.type === 'above' ? <TrendingUp size={16} className="text-green-400" /> : <TrendingDown size={16} className="text-red-400" />}
                </div>
                <div>
                  <div className="font-bold text-sm">{alert.symbol}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{alert.type === 'above' ? t('above') : t('below')} ${alert.price.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleAlert(alert.id)} className={`px-2 py-1 text-xs rounded ${alert.active ? 'bg-green-500/20 text-green-400' : 'bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]'}`}>{alert.active ? t('active') : t('paused')}</button>
                <button onClick={() => deleteAlert(alert.id)} className="p-1 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </Card>
        ))}
        {alerts.length === 0 && <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">{t('no_alerts')}</div>}
      </div>
    </div>
  );
};

export default Alerts;