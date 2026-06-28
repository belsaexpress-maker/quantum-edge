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

  useEffect(() => { fetchNews(); const interval = setInterval(fetchNews, 120000); return () => clearInterval(interval); }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/market/news');
      if (res.data?.news) setNews(res.data.news);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const filtered = search ? news.filter(n => n.title.toLowerCase().includes(search.toLowerCase())) : news;

  return (
    <div className="space-y-3 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-base font-semibold flex items-center gap-2"><Newspaper size={18} className="text-[var(--color-accent)]" /> {t('financial_news')}</h2>
        <input type="text" placeholder={t('search_news')} value={search} onChange={(e) => setSearch(e.target.value)} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] w-full sm:w-48" />
      </div>
      <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>{t('live_prices')} • {news.length} {t('news').toLowerCase()}</div>
      {loading ? <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div> :
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((n, i) => (
            <Card key={i} className="p-3 hover:border-[var(--color-accent)]/50 cursor-pointer" onClick={() => window.open(n.url, '_blank')}>
              <h4 className="font-medium text-sm mb-2">{n.title}</h4>
              <p className="text-xs text-[var(--color-text-secondary)] mb-2">{n.summary}</p>
              <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]"><span className="flex items-center gap-1"><Globe size={10} />{n.source}</span><span className="flex items-center gap-1"><Clock size={10} />{new Date(n.time).toLocaleTimeString()}</span><ExternalLink size={10} /></div>
            </Card>
          ))}
        </div>
      }
    </div>
  );
};

export default News;