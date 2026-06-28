import React from 'react';
import Card from '../components/ui/Card';
import { Check, Zap, Crown, Star } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const Pricing: React.FC = () => {
  const { t } = useLang();

  const plans = [
    { name: 'Free', icon: Zap, price: '$0', color: 'from-gray-500 to-gray-600', features: ['Live price tracking', 'Basic charts', '5 watchlist', 'Daily AI signals', 'News'], missing: ['Advanced analytics', 'Backtesting', 'Priority support', 'API access'] },
    { name: 'Pro', icon: Star, price: '$29', color: 'from-blue-600 to-purple-600', popular: true, features: ['Everything in Free', 'Advanced AI', 'Unlimited watchlist', 'Price alerts', 'Portfolio analytics', 'TradingView Pro', 'Email notifications', 'Priority support'], missing: ['API access', 'Custom strategies'] },
    { name: 'Elite', icon: Crown, price: '$79', color: 'from-yellow-500 to-amber-600', features: ['Everything in Pro', 'API access', 'Backtesting', 'Custom strategies', 'Multi-exchange', 'Auto trading', 'Dedicated support', 'Early access', 'White-label'], missing: [] },
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="text-center mb-4"><h2 className="text-xl font-bold">{t('choose_plan')}</h2><p className="text-sm text-[var(--color-text-muted)] mt-1">Unlock the full power of Quantum Edge</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={`p-0 overflow-hidden ${plan.popular ? 'ring-2 ring-[var(--color-accent)]' : ''}`}>
            {plan.popular && <div className="bg-[var(--color-accent)] text-white text-xs font-bold text-center py-1">{t('most_popular')}</div>}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}><plan.icon size={20} className="text-white" /></div>
                <div><h3 className="font-bold text-sm">{plan.name}</h3><div className="flex items-baseline gap-0.5"><span className="text-2xl font-bold">{plan.price}</span><span className="text-xs text-[var(--color-text-muted)]">/month</span></div></div>
              </div>
              <button className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' : 'bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'}`}>
                {plan.name === 'Free' ? t('get_started') : t('upgrade_now')}
              </button>
              <div className="mt-3 space-y-1.5">
                {plan.features.map((f, i) => (<div key={i} className="flex items-center gap-2 text-xs"><Check size={14} className="text-[var(--color-success)] shrink-0" /><span className="text-[var(--color-text-secondary)]">{f}</span></div>))}
                {plan.missing.map((f, i) => (<div key={i} className="flex items-center gap-2 text-xs opacity-40"><Check size={14} className="shrink-0" /><span className="line-through">{f}</span></div>))}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-4 text-center">
        <h3 className="font-bold text-sm">{t('enterprise')}</h3>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">Custom solutions for large teams and institutions</p>
        <button className="mt-3 px-6 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg text-sm font-medium hover:bg-[var(--color-bg-hover)]">{t('contact_sales')}</button>
      </Card>
    </div>
  );
};

export default Pricing;