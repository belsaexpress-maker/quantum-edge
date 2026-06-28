import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { TrendingUp, TrendingDown, BarChart3, Play, Settings } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

interface TradeResult { id: number; symbol: string; type: 'BUY'|'SELL'; entryPrice: number; exitPrice: number; profit: number; profitPercent: number; date: string; reason: string; }

const Backtesting: React.FC = () => {
  const { t } = useLang();
  const [strategy, setStrategy] = useState('rsi');
  const [symbol, setSymbol] = useState('BTC');
  const [timeframe, setTimeframe] = useState('1h');
  const [period, setPeriod] = useState('30d');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TradeResult[]>([]);

  const run = () => {
    setRunning(true);
    setTimeout(() => {
      setResults([
        { id:1, symbol:'BTC', type:'BUY', entryPrice:58000, exitPrice:62000, profit:4000, profitPercent:6.89, date:'2026-06-15', reason:'RSI oversold' },
        { id:2, symbol:'BTC', type:'SELL', entryPrice:62000, exitPrice:59500, profit:2500, profitPercent:4.03, date:'2026-06-18', reason:'RSI overbought' },
        { id:3, symbol:'BTC', type:'BUY', entryPrice:59500, exitPrice:64000, profit:4500, profitPercent:7.56, date:'2026-06-20', reason:'EMA cross' },
        { id:4, symbol:'BTC', type:'SELL', entryPrice:64000, exitPrice:61000, profit:3000, profitPercent:4.68, date:'2026-06-22', reason:'Divergence' },
        { id:5, symbol:'BTC', type:'BUY', entryPrice:61000, exitPrice:63500, profit:2500, profitPercent:4.09, date:'2026-06-25', reason:'Support bounce' },
      ]);
      setRunning(false);
    }, 2000);
  };

  const totalProfit = results.reduce((s,r) => s + r.profit, 0);
  const winRate = results.length > 0 ? (results.filter(r => r.profit > 0).length / results.length * 100) : 0;
  const avgProfit = results.length > 0 ? (results.reduce((s,r) => s + r.profitPercent, 0) / results.length) : 0;

  return (
    <div className="space-y-3 max-w-3xl max-w-full overflow-x-hidden">
      <h2 className="text-base font-semibold flex items-center gap-2"><BarChart3 size={18} className="text-[var(--color-accent)]" /> {t('backtesting')}</h2>
      <Card className="p-3">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Settings size={16} /> {t('strategy')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div><label className="text-xs text-[var(--color-text-muted)] block mb-0.5">{t('strategy')}</label><select value={strategy} onChange={e=>setStrategy(e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded px-2 py-1.5 text-xs text-white"><option value="rsi">RSI</option><option value="macd">MACD</option><option value="ema">EMA</option><option value="bb">Bollinger</option></select></div>
          <div><label className="text-xs text-[var(--color-text-muted)] block mb-0.5">{t('symbol')}</label><select value={symbol} onChange={e=>setSymbol(e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded px-2 py-1.5 text-xs text-white"><option>BTC</option><option>ETH</option><option>SOL</option></select></div>
          <div><label className="text-xs text-[var(--color-text-muted)] block mb-0.5">{t('timeframe')}</label><select value={timeframe} onChange={e=>setTimeframe(e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded px-2 py-1.5 text-xs text-white"><option>15m</option><option>1h</option><option>4h</option><option>1d</option></select></div>
          <div><label className="text-xs text-[var(--color-text-muted)] block mb-0.5">{t('period')}</label><select value={period} onChange={e=>setPeriod(e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded px-2 py-1.5 text-xs text-white"><option>7d</option><option>30d</option><option>90d</option><option>1y</option></select></div>
        </div>
        <button onClick={run} disabled={running} className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-[var(--color-accent)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50">{running ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <Play size={16} />}{running ? '...' : t('run_backtest')}</button>
      </Card>
      {results.length > 0 && (<>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Card className="p-3"><div className="text-xs text-[var(--color-text-muted)]">{t('total_profit')}</div><div className={`text-lg font-bold mt-0.5 ${totalProfit>=0?'text-[var(--color-success)]':'text-[var(--color-danger)]'}`}>${totalProfit.toLocaleString()}</div></Card>
          <Card className="p-3"><div className="text-xs text-[var(--color-text-muted)]">{t('win_rate')}</div><div className="text-lg font-bold mt-0.5">{winRate.toFixed(0)}%</div></Card>
          <Card className="p-3"><div className="text-xs text-[var(--color-text-muted)]">{t('avg_profit')}</div><div className={`text-lg font-bold mt-0.5 ${avgProfit>=0?'text-[var(--color-success)]':'text-[var(--color-danger)]'}`}>{avgProfit.toFixed(1)}%</div></Card>
          <Card className="p-3"><div className="text-xs text-[var(--color-text-muted)]">{t('trades')}</div><div className="text-lg font-bold mt-0.5">{results.length}</div></Card>
        </div>
        <Card className="p-0 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="text-[var(--color-text-muted)] border-b border-[var(--color-border)]"><th className="text-left py-2 px-2">#</th><th className="text-left py-2 px-2">{t('type')}</th><th className="text-right py-2 px-2">{t('entry')}</th><th className="text-right py-2 px-2">{t('exit')}</th><th className="text-right py-2 px-2">{t('profit')}</th><th className="text-left py-2 px-2 hidden lg:table-cell">{t('date')}</th><th className="text-left py-2 px-2 hidden lg:table-cell">{t('reason')}</th></tr></thead><tbody>{results.map(r=>(<tr key={r.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]"><td className="py-2 px-2">{r.id}</td><td className="py-2 px-2"><span className={`flex items-center gap-1 ${r.type==='BUY'?'text-[var(--color-success)]':'text-[var(--color-danger)]'}`}>{r.type==='BUY'?<TrendingUp size={12}/>:<TrendingDown size={12}/>}{r.type}</span></td><td className="py-2 px-2 text-right">${r.entryPrice.toLocaleString()}</td><td className="py-2 px-2 text-right">${r.exitPrice.toLocaleString()}</td><td className={`py-2 px-2 text-right font-medium ${r.profit>=0?'text-[var(--color-success)]':'text-[var(--color-danger)]'}`}>+${r.profit} ({r.profitPercent}%)</td><td className="py-2 px-2 text-[var(--color-text-muted)] hidden lg:table-cell">{r.date}</td><td className="py-2 px-2 text-[var(--color-text-muted)] hidden lg:table-cell">{r.reason}</td></tr>))}</tbody></table></div></Card>
      </>)}
    </div>
  );
};

export default Backtesting;