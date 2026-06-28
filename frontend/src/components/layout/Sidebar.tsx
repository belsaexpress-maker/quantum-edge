import React, { useState } from 'react';
import { LayoutDashboard, TrendingUp, Newspaper, Brain, Briefcase, Bell, Settings, Menu, X } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'markets', icon: TrendingUp, label: 'Markets' },
  { id: 'news', icon: Newspaper, label: 'News' },
  { id: 'ai-signals', icon: Brain, label: 'AI Signals' },
  { id: 'portfolio', icon: Briefcase, label: 'Portfolio' },
  { id: 'alerts', icon: Bell, label: 'Alerts' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  const [active, setActive] = useState(window.location.hash.replace('#', '') || 'dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (id: string) => {
    setActive(id);
    window.location.hash = id;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile toggle - sadece küçük ekranda görünür */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-3 left-3 z-50 p-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] lg:hidden"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay - sadece mobilde */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar - masaüstünde her zaman görünür, mobilde toggle ile */}
      <div className={`
        w-48 h-screen bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] 
        fixed left-0 top-0 z-40 flex flex-col
        transition-transform duration-300
        lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-3 border-b border-[var(--color-border)]">
          <h1 className="text-base font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ⚡ Quantum Edge
          </h1>
          <span className="text-xs text-[var(--color-text-muted)]">v2.0</span>
        </div>

        <nav className="flex-1 py-2 px-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 transition-all text-left ${
                active === item.id
                  ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-white'
              }`}
            >
              <item.icon size={16} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
              U
            </div>
            <div>
              <div className="text-sm font-medium">User</div>
              <div className="text-xs text-[var(--color-text-muted)]">Free Plan</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;