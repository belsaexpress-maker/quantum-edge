import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import { Newspaper, Globe, Clock, ExternalLink } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const News: React.FC = () => {
  const { t } = useLang();
  const [news, setNews] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/market/news');
        if (res.data?.news) setNews(res.data.news);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchNews();
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, []);

  const filtered = search ? news.filter(n => n.title.toLowerCase().includes(search.toLowerCase())) : news;

  if (loading) return <div className="text-center py-20 text-white">Haberler yükleniyor...</div>;

  return (
    <div className="space-y-3 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-base font-semibold flex items-center gap-2"><Newspaper size={18} className="text-[#F0B90B]" /> {t('financial_news')}</h2>
        <input type="text" placeholder={t('search_news')} value={search} onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1E2329] border border-[#2B3139] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#848E9C] focus:outline-none focus:border-[#F0B90B] w-full sm:w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((n, i) => (
          <Card key={i} className="p-3 hover:border-[#F0B90B]/50 cursor-pointer" onClick={() => window.open(n.url, '_blank')}>
            <h4 className="font-medium text-sm text-white mb-2">{n.title}</h4>
            <p className="text-xs text-[#848E9C] mb-2">{n.summary?.slice(0, 150)}</p>
            <div className="flex items-center gap-3 text-xs text-[#848E9C]">
              <span className="flex items-center gap-1"><Globe size={10} />{n.source}</span>
              <span className="flex items-center gap-1"><Clock size={10} />{new Date(n.time).toLocaleTimeString()}</span>
              <ExternalLink size={10} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default News;