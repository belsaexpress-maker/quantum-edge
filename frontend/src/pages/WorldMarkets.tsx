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
    const fetchMarkets = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/market/world');
        if (res.data?.markets) setMarkets(res.data.markets);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 60000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'indices', icon: BarChart3, label: 'Endeksler' },
    { id: 'commodities', icon: Gem, label: 'Emtia' },
    { id: 'forex', icon: DollarSign, label: 'Forex' },
    { id: 'stocks', icon: TrendingUp, label: 'Hisseler' },
  ];

  const filtered = Object.values(markets).filter((m: any) => m.category === activeTab);

  if (loading) return <div className="text-center py-20 text-white">Piyasalar yükleniyor...</div>;

  return (
    <div className="space-y-3 max-w-full overflow-x-hidden">
      <h2 className="text-base font-semibold flex items-center gap-2"><Globe size={18} className="text-[#F0B90B]" /> Dünya Piyasaları</h2>
      <div className="flex gap-1.5 flex-wrap">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === cat.id ? 'bg-[#F0B90B] text-black' : 'bg-[#1E2329] text-[#848E9C] hover:bg-[#2B3139]'}`}>
            <cat.icon size={14} />{cat.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filtered.map((m: any) => (
          <Card key={m.name} className="p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="font-bold text-sm text-white">{m.name}</div>
              <span className={`text-xs font-bold ${m.change_percent >= 0 ? 'text-[#03A66D]' : 'text-[#CF304A]'}`}>
                {m.change_percent >= 0 ? '+' : ''}{m.change_percent?.toFixed(2)}%
              </span>
            </div>
            <div className="text-lg font-bold text-white">
              {m.category === 'forex' ? m.price?.toFixed(4) : '$' + m.price?.toLocaleString()}
            </div>
            <div className="text-xs text-[#848E9C] mt-1">{new Date(m.updated).toLocaleTimeString()}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorldMarkets;