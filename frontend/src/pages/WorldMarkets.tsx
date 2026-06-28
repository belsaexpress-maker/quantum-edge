import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import { Globe, TrendingUp, BarChart3, Gem, DollarSign } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const WorldMarkets: React.FC = () => {
  const { t } = useLang();
  const [markets, setMarkets] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('indices');

  useEffect(() => {
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarkets = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/market/world');
      if (res.data?.markets) {
        setMarkets(res.data.markets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'indices', icon: BarChart3, label: t('indices') || 'Indices' },
    { id: 'commodities', icon: Gem, label: t('commodities') || 'Commodities' },
    { id: 'forex', icon: DollarSign, label: t('forex') || 'Forex' },
    { id: 'stocks', icon: TrendingUp, label: t('stocks') || 'Stocks' },
  ];

  const filtered = Object.values(markets).filter(
    (m: any) => m.category === activeTab
  );

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-full overflow-x-hidden">
      <h2 className="text-base font-semibold flex items-center gap-2">
        <Globe size={18} className="text-[var(--color-accent)]" />{' '}
        {t('world_markets') || 'World Markets'}
      </h2>

      <div className="flex gap-1.5 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === cat.id
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
            }`}
          >
            <cat.icon size={14} />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filtered.map((m: any) => (
          <Card key={m.name} className="p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="font-bold text-sm">{m.name}</div>
              <span
                className={`text-xs font-bold ${
                  m.change >= 0
                    ? 'text-[var(--color-success)]'
                    : 'text-[var(--color-danger)]'
                }`}
              >
                {m.change >= 0 ? '+' : ''}
                {m.change_percent?.toFixed(2)}%
              </span>
            </div>
            <div className="text-lg font-bold">
              {m.category === 'forex'
                ? m.price?.toFixed(4)
                : '$' + m.price?.toLocaleString()}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">
              {new Date(m.updated).toLocaleTimeString()}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorldMarkets;