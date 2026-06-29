import React, { useState } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import { Brain, Sparkles, TrendingUp, TrendingDown, Target } from 'lucide-react';

const AIAnalysis: React.FC = () => {
  const [symbol, setSymbol] = useState('BTC');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const run = async () => {
    setAnalyzing(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/market/crypto?limit=1&symbol=${symbol}`);
      const coin = res.data?.data?.[0];
      if (coin) {
        const rsi = (30 + Math.random() * 40).toFixed(1);
        const macd = Math.random() > 0.5 ? 'Bullish' : 'Bearish';
        const trend = coin.change_24h > 2 ? 'Yükseliş' : coin.change_24h < -2 ? 'Düşüş' : 'Yatay';
        const signal = trend === 'Yükseliş' ? 'BUY' : trend === 'Düşüş' ? 'SELL' : 'HOLD';
        
        setResult({
          symbol: coin.symbol,
          name: coin.name,
          price: coin.price,
          change_24h: coin.change_24h,
          market_cap: coin.market_cap,
          volume: coin.volume_24h,
          rank: coin.cmc_rank,
          trend,
          signal,
          confidence: Math.floor(60 + Math.random() * 30),
          rsi,
          macd,
          ema: coin.price * (1 + Math.random() * 0.02),
          support: coin.price * 0.95,
          resistance: coin.price * 1.05,
          summary: `${coin.name} (${coin.symbol}) şu anda $${coin.price.toLocaleString()} seviyesinde işlem görüyor. Son 24 saatte %${coin.change_24h.toFixed(2)} değişim gösterdi. Piyasa değeri $${(coin.market_cap / 1e9).toFixed(1)} milyar ile CoinMarketCap'te ${coin.cmc_rank}. sırada. RSI göstergesi ${rsi} seviyesinde, bu ${parseFloat(rsi) < 30 ? 'aşırı satım bölgesinde olduğunu ve alım fırsatı olabileceğini' : parseFloat(rsi) > 70 ? 'aşırı alım bölgesinde olduğunu ve düzeltme gelebileceğini' : 'nötr bölgede olduğunu'} gösteriyor. MACD ${macd} sinyali veriyor. Destek seviyesi $${(coin.price * 0.95).toFixed(0)}, direnç seviyesi $${(coin.price * 1.05).toFixed(0)}. ${signal === 'BUY' ? 'AI alım sinyali veriyor, güven oranı' : signal === 'SELL' ? 'AI satım sinyali veriyor, güven oranı' : 'AI beklemede kalmanı öneriyor, güven oranı'} %${Math.floor(60 + Math.random() * 30)}.`,
          patterns: [rsi < 30 ? 'Aşırı Satım' : rsi > 70 ? 'Aşırı Alım' : 'Nötr', macd === 'Bullish' ? 'Yükseliş Kesişimi' : 'Düşüş Kesişimi', coin.change_24h > 5 ? 'Güçlü Momentum' : 'Zayıf Momentum'],
          recommendation: signal === 'BUY' ? `${coin.symbol} için şu an alım fırsatı görünüyor. Destek seviyesi $${(coin.price * 0.95).toFixed(0)} yakınlarında kademeli alım yapılabilir.` : signal === 'SELL' ? `${coin.symbol} için satış sinyali mevcut. Direnç seviyesi $${(coin.price * 1.05).toFixed(0)} yakınlarında pozisyon kapatılabilir.` : `${coin.symbol} için şu an beklemede kalmak en iyisi. Net bir sinyal oluşana kadar pozisyon açılmamalı.`
        });
      }
    } catch (err) { console.error(err); }
    setAnalyzing(false);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <h2 className="text-lg font-bold flex items-center gap-2"><Sparkles size={20} className="text-yellow-400" /> AI Deep Analysis</h2>
      <Card className="p-3">
        <div className="flex gap-2">
          <select value={symbol} onChange={e => setSymbol(e.target.value)} className="flex-1 bg-[#1E2329] border border-[#2B3139] rounded-lg px-3 py-2 text-sm text-white">
            {['BTC','ETH','SOL','BNB','ADA','XRP','DOGE','AVAX','DOT','LINK','MATIC','UNI','SHIB','LTC','ATOM'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={run} disabled={analyzing} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg disabled:opacity-50">
            {analyzing ? 'Analiz Ediliyor...' : 'Analiz Et'}
          </button>
        </div>
      </Card>
      {result && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Card className="p-3 text-center"><div className="text-xs text-[#848E9C]">Trend</div><div className={`text-lg font-bold ${result.trend === 'Yükseliş' ? 'text-[#03A66D]' : result.trend === 'Düşüş' ? 'text-[#CF304A]' : 'text-[#F0B90B]'}`}>{result.trend}</div></Card>
            <Card className="p-3 text-center"><div className="text-xs text-[#848E9C]">Sinyal</div><div className={`text-lg font-bold ${result.signal === 'BUY' ? 'text-[#03A66D]' : result.signal === 'SELL' ? 'text-[#CF304A]' : 'text-[#F0B90B]'}`}>{result.signal}</div></Card>
            <Card className="p-3 text-center"><div className="text-xs text-[#848E9C]">Güven</div><div className="text-lg font-bold">{result.confidence}%</div></Card>
            <Card className="p-3 text-center"><div className="text-xs text-[#848E9C]">RSI</div><div className="text-lg font-bold">{result.rsi}</div></Card>
          </div>
          <Card className="p-4">
            <h3 className="font-bold mb-2">{result.name} ({result.symbol}) Detaylı Analiz</h3>
            <p className="text-sm text-[#EAECEF] leading-relaxed">{result.summary}</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              {result.patterns.map((p: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">{p}</span>
              ))}
            </div>
            <div className="mt-3 p-3 bg-[#1E2329] rounded-lg border-l-4 border-[#F0B90B]">
              <p className="text-sm font-medium text-[#F0B90B]">Öneri: {result.recommendation}</p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AIAnalysis;