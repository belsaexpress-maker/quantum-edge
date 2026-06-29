import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import { Link, Plus, Trash2, CheckCircle, Eye, EyeOff, RefreshCw, TrendingUp, Wallet } from 'lucide-react';

interface Exchange {
  id: string; name: string;
}

interface Account {
  id: number; exchange: string; exchange_name: string; label: string; api_key: string; created: string;
}

const ConnectExchange: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState('binance');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [testing, setTesting] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);

  const fetchExchanges = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/exchange/exchanges');
      setExchanges(res.data.exchanges || []);
    } catch (err) {}
  };

  const fetchAccounts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/exchange/accounts');
      setAccounts(res.data);
    } catch (err) {}
  };

  useEffect(() => { fetchExchanges(); fetchAccounts(); }, []);

  const handleTest = async () => {
    if (!apiKey || !apiSecret) return;
    setTesting(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:8000/api/exchange/test', {
        exchange_id: selectedExchange, api_key: apiKey, api_secret: apiSecret, label: 'Test'
      });
      if (res.data?.success) {
        setMessage(`✅ Bağlantı başarılı! ${res.data.count} varlık bulundu. Toplam: $${res.data.total_value_usdt?.toLocaleString()}`);
      } else {
        setMessage(`❌ ${res.data.error}`);
      }
    } catch (err: any) {
      setMessage('❌ Bağlantı hatası');
    }
    setTesting(false);
  };

  const handleConnect = async () => {
    if (!apiKey || !apiSecret) return;
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:8000/api/exchange/connect', {
        exchange_id: selectedExchange, api_key: apiKey, api_secret: apiSecret,
        label: label || `${selectedExchange.toUpperCase()} Hesap`
      });
      setMessage('✅ Borsa başarıyla bağlandı!');
      setShowForm(false);
      fetchAccounts();
    } catch (err: any) {
      setMessage('❌ ' + (err.response?.data?.detail || 'Bağlantı hatası'));
    }
    setLoading(false);
  };

  const handleViewPortfolio = async (keyId: number) => {
    setPortfolioLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/exchange/portfolio/${keyId}`);
      setSelectedPortfolio(res.data);
    } catch (err) {}
    setPortfolioLoading(false);
  };

  const handleDisconnect = async (id: number) => {
    await axios.delete(`http://localhost:8000/api/exchange/disconnect/${id}`);
    fetchAccounts();
    setSelectedPortfolio(null);
  };

  return (
    <div className="space-y-3 max-w-2xl">
      <h2 className="text-base font-semibold flex items-center gap-2"><Link size={18} className="text-[#F0B90B]" /> Borsa Bağlantıları</h2>

      {/* Borsa Listesi */}
      <Card className="p-3">
        <h3 className="text-sm font-semibold text-white mb-2">Desteklenen Borsalar ({exchanges.length})</h3>
        <div className="flex gap-1.5 flex-wrap">
          {exchanges.map((ex) => (
            <span key={ex.id} className="px-2 py-1 bg-[#1E2329] rounded text-xs text-white">{ex.name}</span>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-4 py-2 bg-[#F0B90B] text-black text-sm font-bold rounded-lg mt-3">
          <Plus size={16} /> Borsa Bağla
        </button>
      </Card>

      {/* Bağlantı Formu */}
      {showForm && (
        <Card className="p-3">
          <div className="space-y-2">
            <div>
              <label className="text-xs text-[#848E9C]">Borsa Seç</label>
              <select value={selectedExchange} onChange={e => setSelectedExchange(e.target.value)}
                className="w-full bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white">
                {exchanges.map((ex) => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#848E9C]">Hesap Adı</label>
              <input type="text" value={label} onChange={e => setLabel(e.target.value)}
                placeholder="Ana Hesap" className="w-full bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-[#848E9C]">API Key</label>
              <input type="text" value={apiKey} onChange={e => setApiKey(e.target.value)}
                className="w-full bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white font-mono" />
            </div>
            <div>
              <label className="text-xs text-[#848E9C]">Secret Key</label>
              <div className="relative">
                <input type={showSecret ? 'text' : 'password'} value={apiSecret} onChange={e => setApiSecret(e.target.value)}
                  className="w-full bg-[#1E2329] border border-[#2B3139] rounded px-3 py-2 text-sm text-white font-mono pr-10" />
                <button onClick={() => setShowSecret(!showSecret)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#848E9C]">
                  {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleTest} disabled={testing}
                className="flex-1 py-2 bg-[#1E2329] border border-[#2B3139] text-white rounded-lg text-sm disabled:opacity-50">
                {testing ? 'Test Ediliyor...' : 'Bağlantıyı Test Et'}
              </button>
              <button onClick={handleConnect} disabled={loading}
                className="flex-1 py-2 bg-[#F0B90B] text-black font-bold rounded-lg text-sm disabled:opacity-50">
                {loading ? 'Bağlanıyor...' : 'Bağlan'}
              </button>
            </div>
            {message && <p className={`text-xs ${message.includes('✅') ? 'text-[#03A66D]' : 'text-[#CF304A]'}`}>{message}</p>}
          </div>
        </Card>
      )}

      {/* Bağlı Hesaplar */}
      {accounts.map((acc) => (
        <Card key={acc.id} className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <CheckCircle size={18} className="text-[#03A66D]" />
              <div>
                <div className="font-bold text-white">{acc.label}</div>
                <div className="text-xs text-[#848E9C]">{acc.exchange_name} · {acc.api_key}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleViewPortfolio(acc.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#1E2329] border border-[#2B3139] rounded text-xs text-white hover:bg-[#2B3139]">
                <Wallet size={14} /> Portföy
              </button>
              <button onClick={() => handleDisconnect(acc.id)}
                className="text-[#CF304A] hover:bg-red-500/10 p-2 rounded"><Trash2 size={16} /></button>
            </div>
          </div>

          {/* Portföy Detayı */}
          {selectedPortfolio && portfolioLoading && <p className="text-xs text-[#848E9C]">Yükleniyor...</p>}
          {selectedPortfolio && !portfolioLoading && selectedPortfolio.success && (
            <div className="mt-2 space-y-1">
              <div className="text-xs text-[#848E9C]">Toplam Değer: <span className="text-white font-bold">${selectedPortfolio.total_value_usdt?.toLocaleString()}</span> · {selectedPortfolio.count} varlık</div>
              <div className="max-h-40 overflow-y-auto">
                {selectedPortfolio.assets?.slice(0, 10).map((a: any) => (
                  <div key={a.asset} className="flex justify-between text-xs py-1 border-b border-[#2B3139]/50">
                    <span className="text-white">{a.asset}</span>
                    <span className="text-[#848E9C]">{a.total.toFixed(4)}</span>
                    <span className="text-white">${a.value_usdt?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ConnectExchange;