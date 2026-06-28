import React from 'react';
import Card from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { Settings, Sun, Moon, Palette, Bell, Globe, Shield } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLang();

  return (
    <div className="space-y-3 max-w-xl">
      <h2 className="text-base font-semibold flex items-center gap-2"><Settings size={18} className="text-[var(--color-accent)]" /> {t('settings')}</h2>
      <Card className="p-3">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Palette size={16} /> {t('appearance')}</h3>
        <div className="flex items-center justify-between">
          <div><div className="text-sm font-medium">{theme === 'dark' ? t('dark_mode') : t('light_mode')}</div></div>
          <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)]">
            {theme === 'dark' ? <Moon size={16} className="text-blue-400" /> : <Sun size={16} className="text-yellow-400" />}
            <span className="text-sm">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </Card>
      <Card className="p-3">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Globe size={16} /> {t('language')}</h3>
        <div className="flex gap-2">
          <button onClick={() => setLang('en')} className={`px-4 py-2 rounded-lg text-sm transition-all ${lang === 'en' ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]'}`}>🇬🇧 English</button>
          <button onClick={() => setLang('tr')} className={`px-4 py-2 rounded-lg text-sm transition-all ${lang === 'tr' ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]'}`}>🇹🇷 Türkçe</button>
        </div>
      </Card>
      <Card className="p-3">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Bell size={16} /> {t('notifications')}</h3>
        <div className="space-y-2">
          {['Price Alerts', 'AI Signals', 'News', 'Portfolio Updates'].map((item) => (
            <div key={item} className="flex items-center justify-between"><span className="text-sm">{item}</span>
              <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-9 h-5 bg-[var(--color-bg-hover)] rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-accent)]"></div></label>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-3">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Shield size={16} /> {t('security')}</h3>
        <div className="space-y-2">
          <button className="w-full text-left text-sm p-2 rounded-lg hover:bg-[var(--color-bg-hover)]">{t('change_password')}</button>
          <button className="w-full text-left text-sm p-2 rounded-lg hover:bg-[var(--color-bg-hover)]">{t('two_factor')}</button>
          <button className="w-full text-left text-sm p-2 rounded-lg hover:bg-[var(--color-bg-hover)] text-red-400">{t('delete_account')}</button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;