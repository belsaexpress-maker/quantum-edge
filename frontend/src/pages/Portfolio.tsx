import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { Briefcase, TrendingUp, TrendingDown, PieChart, Plus } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

interface Holding { symbol: string; name: string; amount: number; buyPrice: number; currentPrice: number; change24h: number; }

const Portfolio: React.FC = () => {
  const { t } = useLang();
  const [holdings] = useState<Holding[]>([
    { symbol: 'BTC', name: 'Bitcoin', amount: 0.5, buyPrice: 95000, currentPrice: 118420, change24h: 2.6 },
    { symbol: 'ETH', name: 'Ethereum', amount: 5, buyPrice: 3800, currentPrice: 4120, change24h: 1.9 },
    { symbol: 'SOL', name: 'Solana', amount: 50, buyPrice: 210, currentPrice: 235, change24h: -0.8 },
    { symbol: 'ADA', name: 'Cardano', amount: 10000, buyPrice: 0.45, currentPrice: 0.52, change24h: 3.2 },
  ]);

  const totalValue = holdings.reduce((s, h) => s + h.amount * h.currentPrice, 0);
  const totalInvested = holdings.reduce((s, h) => s + h.amount * h.buyPrice, 0);
  const totalPnl = totalValue - totalInvested;
  const pnlPercent = (totalPnl / totalInvested) * 100;

  return (
    <div className="space-y-3 max-w-full overflow-x-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Card className="p-3"><div className="text-xs text-[var(--color-text-muted)]">{t('portfolio_value')}</div><div className="text-lg font-bold mt-0.5">${totalValue.toLocaleString()}</div></Card>
        <Card className="p-3"><div className="text-xs text-[var(--color-text-muted)]">{t('gain')}</div><div className="text-lg font-bold mt-0.5">${totalInvested.toLocaleString()}</div></Card>
        <Card className="p-3"><div className="text-xs text-[var(--color-text-muted)]">{t('pnl')}</div><div className={`text-lg font-bold mt-0.5 ${totalPnl >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>{totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()}</div></Card>
        <Card className="p-3"><div className="text-xs text-[var(--color-text-muted)]">{t('return_pct')}</div><div className={`text-lg font-bold mt-0.5 ${pnlPercent >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>{pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%</div></Card>
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="p-3 border-b border-[var(--color-border)] flex items-center justify-between"><h3 className="text-sm font-semibold flex items-center gap-1.5"><Briefcase size={16} className="text-[var(--color-accent)]" /> {t('holdings')}</h3><button className="flex items-center gap-1 px-2 py-1 bg-[var(--color-accent)] text-white text-xs rounded-lg"><Plus size={12} /> {t('add')}</button></div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-[var(--color-text-muted)] border-b border-[var(--color-border)]"><th className="text-left py-2 px-3">{t('symbol')}</th><th className="text-right py-2 px-3">{t('amount')}</th><th className="text-right py-2 px-3 hidden md:table-cell">{t('buy_price')}</th><th className="text-right py-2 px-3">{t('current_price')}</th><th className="text-right py-2 px-3">{t('value')}</th><th className="text-right py-2 px-3">{t('pnl')}</th><th className="text-right py-2 px-3">24h</th></tr></thead>
            <tbody>
              {holdings.map((h) => { const val = h.amount * h.currentPrice; const pnl = val - h.amount * h.buyPrice; return (
                <tr key={h.symbol} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]">
                  <td className="py-2 px-3"><div className="font-medium">{h.symbol}</div><div className="text-[var(--color-text-muted)]">{h.name}</div></td>
                  <td className="py-2 px-3 text-right">{h.amount}</td>
                  <td className="py-2 px-3 text-right hidden md:table-cell">${h.buyPrice.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right">${h.currentPrice.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-medium">${val.toLocaleString()}</td>
                  <td className={`py-2 px-3 text-right font-medium ${pnl >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>{pnl >= 0 ? '+' : ''}${pnl.toLocaleString()}</td>
                  <td className={`py-2 px-3 text-right ${h.change24h >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}><div className="flex items-center justify-end gap-1">{h.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{h.change24h}%</div></td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="p-3">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><PieChart size={16} className="text-purple-400" /> {t('allocation')}</h3>
        <div className="space-y-2">
          {holdings.map((h, idx) => { const val = h.amount * h.currentPrice; const pct = (val / totalValue) * 100; const colors = ['bg-blue-500','bg-purple-500','bg-green-500','bg-yellow-500']; return (
            <div key={h.symbol}><div className="flex justify-between text-xs mb-0.5"><span>{h.symbol}</span><span className="text-[var(--color-text-muted)]">{pct.toFixed(1)}%</span></div><div className="w-full h-2 bg-[var(--color-bg-hover)] rounded-full"><div className={`h-full rounded-full ${colors[idx % 4]}`} style={{width: `${pct}%`}} /></div></div>
          );})}
        </div>
      </Card>
    </div>
  );
};

export default Portfolio;