import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { Brain, Sparkles } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const AIAnalysis: React.FC = () => {
  const { t } = useLang();
  const [symbol, setSymbol] = useState('BTC');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const run = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        symbol, trend: t('bullish'), confidence: 87, prediction: '$' + (60000 + Math.random() * 5000).toFixed(0),
        rsi: (30 + Math.random() * 40).toFixed(1), macd: 'Bullish crossover', ema: 'Above EMA 50/200',
        support: 58000, resistance: 65000, volume: 'Increasing',
        patterns: ['Bull flag', 'Golden cross', 'Accumulation'],
        summary: `${symbol} shows strong bullish momentum. AI recommends BUY with 87% confidence.`,
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-3 max-w-2xl">
      <h2 className="text-base font-semibold flex items-center gap-2"><Sparkles size={18} className="text-yellow-400" /> {t('ai_analysis')}</h2>
      <Card className="p-3">
        <div className="flex gap-2">
          <select value={symbol} onChange={e => setSymbol(e.target.value)} className="flex-1 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-white">
            {['BTC','ETH','SOL','BNB','ADA','XRP','DOGE'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={run} disabled={analyzing} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg disabled:opacity-50 flex items-center gap-2">
            {analyzing ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <Brain size={16} />}
            {analyzing ? '...' : t('analyze')}
          </button>
        </div>
      </Card>
      {result && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Card className="p-3 text-center"><div className="text-xs text-[var(--color-text-muted)]">{t('trend')}</div><div className="text-lg font-bold text-[var(--color-success)]">{result.trend}</div></Card>
            <Card className="p-3 text-center"><div className="text-xs text-[var(--color-text-muted)]">{t('confidence')}</div><div className="text-lg font-bold">{result.confidence}%</div></Card>
            <Card className="p-3 text-center"><div className="text-xs text-[var(--color-text-muted)]">{t('prediction')}</div><div className="text-lg font-bold">{result.prediction}</div></Card>
            <Card className="p-3 text-center"><div className="text-xs text-[var(--color-text-muted)]">RSI</div><div className="text-lg font-bold">{result.rsi}</div></Card>
          </div>
          <Card className="p-3">
            <h3 className="text-sm font-semibold mb-2">{t('technical')}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="p-2 bg-[var(--color-bg-primary)] rounded"><span className="text-[var(--color-text-muted)]">MACD:</span> <b>{result.macd}</b></div>
              <div className="p-2 bg-[var(--color-bg-primary)] rounded"><span className="text-[var(--color-text-muted)]">EMA:</span> <b>{result.ema}</b></div>
              <div className="p-2 bg-[var(--color-bg-primary)] rounded"><span className="text-[var(--color-text-muted)]">Support:</span> <b>${result.support}</b></div>
              <div className="p-2 bg-[var(--color-bg-primary)] rounded"><span className="text-[var(--color-text-muted)]">Resistance:</span> <b>${result.resistance}</b></div>
            </div>
            <h4 className="text-sm font-semibold mb-2">{t('patterns')}</h4>
            <div className="flex gap-2 flex-wrap mb-3">{result.patterns.map((p: string, i: number) => (<span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">{p}</span>))}</div>
            <h4 className="text-sm font-semibold mb-2">{t('summary')}</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">{result.summary}</p>
          </Card>
        </>
      )}
    </div>
  );
};

export default AIAnalysis;