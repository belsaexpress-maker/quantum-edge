import React, { useState } from 'react';
import { LayoutDashboard, TrendingUp, Newspaper, Brain, Briefcase, Bell, Search, Menu, X, ChevronDown, User, Settings, LogOut, BarChart3, Sparkles, Bot, Wallet, Globe, Link } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';

const Header: React.FC = () => {
  const { t } = useLang();
  const [active, setActive] = useState(window.location.hash.replace('#', '') || 'dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : null;

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'markets', icon: TrendingUp, label: t('markets') },
    { id: 'world', icon: Globe, label: 'World' },
    { id: 'ai-signals', icon: Brain, label: t('ai') },
    { id: 'ai-analysis', icon: Sparkles, label: 'AI Analysis' },
    { id: 'news', icon: Newspaper, label: t('news') },
    { id: 'portfolio', icon: Briefcase, label: t('portfolio') },
    { id: 'alerts', icon: Bell, label: t('alerts') },
    { id: 'bots', icon: Bot, label: 'Bots' },
    { id: 'binance', icon: Wallet, label: 'Trade' },
    { id: 'backtesting', icon: BarChart3, label: t('backtesting') },
    { id: 'settings', icon: Settings, label: t('settings') },
    { id: 'bot-control', icon: Bot, label: 'Bot Control' },
    { id: 'trade', icon: TrendingUp, label: 'Trade' },
    { id: 'connect-exchange', icon: Link, label: 'Borsa Bağla' },
  ];

  const handleClick = (id: string) => { setActive(id); window.location.hash = id; window.dispatchEvent(new HashChangeEvent('hashchange')); setMobileOpen(false); setProfileOpen(false); };
  const handleLogout = () => { localStorage.clear(); window.location.reload(); };

  return (
    <>
      <header className="h-16 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] flex items-center justify-between px-4 fixed top-0 right-0 left-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center"><TrendingUp size={18} className="text-white" /></div>
          <div className="hidden sm:block"><h1 className="text-sm font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Quantum Edge</h1><p className="text-xs text-[var(--color-text-muted)]">Pro</p></div>
        </div>
        <nav className="hidden lg:flex items-center gap-1">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => handleClick(item.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${active === item.id ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30' : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-hover)] border border-transparent'}`}><item.icon size={14} /><span>{item.label}</span></button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-1.5">
            <Search size={14} className="text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder={t('search')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const q = (e.target as HTMLInputElement).value;
                  window.location.hash = `markets?search=${q}`;
                  window.dispatchEvent(new HashChangeEvent('hashchange'));
                }
              }}
              className="bg-transparent text-xs text-white placeholder-[var(--color-text-muted)] focus:outline-none w-24 lg:w-32"
            />
          </div>
          <button className="relative p-2 text-[var(--color-text-secondary)] hover:text-white rounded-lg hover:bg-[var(--color-bg-hover)]"><Bell size={16} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" /></button>
          <button onClick={() => handleClick('pricing')} className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-purple-700"><ZapIcon size={12} /> {t('upgrade')}</button>
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[var(--color-bg-hover)]"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">{user?.username?.[0]?.toUpperCase() || 'U'}</div><ChevronDown size={14} className="hidden sm:block text-[var(--color-text-muted)]" /></button>
            {profileOpen && (
              <>
                <div onClick={() => setProfileOpen(false)} className="fixed inset-0 z-40" />
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-xl z-50 py-1">
                  <div className="px-4 py-2 border-b border-[var(--color-border)]"><div className="text-sm font-medium">{user?.username || 'User'}</div><div className="text-xs text-[var(--color-text-muted)]">{user?.email || 'user@email.com'}</div></div>
                  <button onClick={() => handleClick('profile')} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-white"><User size={14} /> {t('profile')}</button>
                  <button onClick={() => handleClick('settings')} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-white"><Settings size={14} /> {t('settings')}</button>
                  <div className="border-t border-[var(--color-border)] mt-1 pt-1"><button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-[var(--color-bg-hover)]"><LogOut size={14} /> {t('sign_out')}</button></div>
                </div>
              </>
            )}
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-[var(--color-text-secondary)] hover:text-white rounded-lg hover:bg-[var(--color-bg-hover)]">{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </header>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="absolute top-16 left-0 right-0 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] p-3 shadow-2xl">
            <div className="grid grid-cols-3 gap-2">
              {menuItems.map((item) => (
                <button key={item.id} onClick={() => handleClick(item.id)} className={`flex flex-col items-center gap-1 p-3 rounded-xl text-xs font-medium transition-all ${active === item.id ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'}`}><item.icon size={20} /><span>{item.label}</span></button>
              ))}
            </div>
            <button onClick={handleLogout} className="w-full mt-2 py-2 text-center text-sm text-red-400 hover:bg-red-500/10 rounded-lg">{t('sign_out')}</button>
          </div>
        </div>
      )}
    </>
  );
};

const ZapIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export default Header;