import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'en' | 'tr';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Menü
    dashboard: 'Dashboard', markets: 'Markets', news: 'News', ai: 'AI Signals', portfolio: 'Portfolio',
    alerts: 'Alerts', settings: 'Settings', backtesting: 'Backtest', pricing: 'Pricing',
    search: 'Search...', upgrade: 'Upgrade Pro', total: 'Total', buy: 'BUY', sell: 'SELL', hold: 'HOLD',
    strength: 'Strength', watchlist: 'Watchlist', live_prices: 'Live Prices', run_backtest: 'Run Backtest',
    total_profit: 'Total Profit', win_rate: 'Win Rate', trades: 'Trades', language: 'Language',
    notifications: 'Notifications', security: 'Security', dark_mode: 'Dark Mode', light_mode: 'Light Mode',
    profile: 'Profile', sign_out: 'Sign Out',
    // Dashboard
    portfolio_value: 'Portfolio Value', gain: 'Gain', signals: 'Signals', latest_news: 'Latest News',
    ai_signals: 'AI Signals', btc_usd: 'Bitcoin / USD',
    // Markets
    all_markets: 'All Markets', price: 'Price', change_24h: '24h Change', market_cap: 'Market Cap',
    volume: 'Volume', search_coin: 'Search coin...', name: 'Name',
    // World Markets
    world_markets: 'World Markets', indices: 'Indices',
    // AI
    ai_analysis: 'AI Deep Analysis', analyze: 'Analyze', trend: 'Trend', confidence: 'Confidence',
    prediction: 'Prediction', risk: 'Risk', technical: 'Technical Indicators', patterns: 'Patterns Detected',
    summary: 'AI Summary', bullish: 'Bullish', bearish: 'Bearish',
    // News
    financial_news: 'Financial News', search_news: 'Search news...', all: 'All', crypto: 'Crypto',
    stocks: 'Stocks', forex: 'Forex', commodities: 'Commodities', economy: 'Economy',
    // Portfolio
    holdings: 'Holdings', add: 'Add', amount: 'Amount', buy_price: 'Buy Price', current_price: 'Current Price',
    value: 'Value', pnl: 'P&L', return_pct: 'Return', allocation: 'Allocation', symbol: 'Symbol',
    // Alerts
    price_alerts: 'Price Alerts', new_alert: 'New Alert', above: 'Above', below: 'Below',
    active: 'Active', paused: 'Paused', delete: 'Delete', no_alerts: 'No alerts yet',
    // Settings
    appearance: 'Appearance', theme: 'Theme', save: 'Save', cancel: 'Cancel', edit: 'Edit', saved: 'Saved!',
    // Pricing
    choose_plan: 'Choose Your Plan', most_popular: 'MOST POPULAR', get_started: 'Get Started',
    upgrade_now: 'Upgrade Now', contact_sales: 'Contact Sales', enterprise: 'Enterprise',
    // Bots
    trading_bots: 'AI Trading Bots', all_bots: 'All Bots', scalping: 'AI Scalping', grid: 'Grid Bot',
    dca: 'DCA Bot', momentum: 'Momentum', entry: 'Entry', target: 'Target', stop_loss: 'Stop Loss',
    best_for: 'Best for', reasons: 'Reasons',
    // Trade
    binance_trade: 'Binance Trade', balance: 'Balance', refresh: 'Refresh', order_success: 'Order successful',
    order_error: 'Error', quantity: 'Quantity',
    // Backtesting
    strategy: 'Strategy', timeframe: 'Timeframe', period: 'Period', avg_profit: 'Avg Profit',
    date: 'Date', reason: 'Reason', type: 'Type', exit: 'Exit', profit: 'Profit',
    // Auth
    sign_in: 'Sign In', register: 'Register', username: 'Username', email: 'Email', password: 'Password',
    create_account: 'Create Account', already_have: 'Already have an account?', dont_have: "Don't have an account?",
    or_continue: 'or continue with',
    // History
    price_history: 'Price History', time: 'Time', change: 'Change',
    // Güvenlik
    change_password: 'Change Password', two_factor: 'Two-Factor Authentication', delete_account: 'Delete Account',
  },
  tr: {
    // Menü
    dashboard: 'Panel', markets: 'Piyasalar', news: 'Haberler', ai: 'Yapay Zeka', portfolio: 'Portföy',
    alerts: 'Alarmlar', settings: 'Ayarlar', backtesting: 'Test', pricing: 'Fiyatlandırma',
    search: 'Ara...', upgrade: 'Pro\'ya Yükselt', total: 'Toplam', buy: 'AL', sell: 'SAT', hold: 'BEKLE',
    strength: 'Güç', watchlist: 'İzleme Listesi', live_prices: 'Canlı Fiyatlar', run_backtest: 'Testi Çalıştır',
    total_profit: 'Toplam Kâr', win_rate: 'Kazanma Oranı', trades: 'İşlemler', language: 'Dil',
    notifications: 'Bildirimler', security: 'Güvenlik', dark_mode: 'Karanlık Mod', light_mode: 'Aydınlık Mod',
    profile: 'Profil', sign_out: 'Çıkış Yap',
    // Dashboard
    portfolio_value: 'Portföy Değeri', gain: 'Kazanç', signals: 'Sinyaller', latest_news: 'Son Haberler',
    ai_signals: 'Yapay Zeka Sinyalleri', btc_usd: 'Bitcoin / USD',
    // Markets
    all_markets: 'Tüm Piyasalar', price: 'Fiyat', change_24h: '24s Değişim', market_cap: 'Piyasa Değeri',
    volume: 'Hacim', search_coin: 'Coin ara...', name: 'İsim',
    // World Markets
    world_markets: 'Dünya Piyasaları', indices: 'Endeksler',
    // AI
    ai_analysis: 'Yapay Zeka Derin Analiz', analyze: 'Analiz Et', trend: 'Trend', confidence: 'Güven',
    prediction: 'Tahmin', risk: 'Risk', technical: 'Teknik Göstergeler', patterns: 'Tespit Edilen Formasyonlar',
    summary: 'Yapay Zeka Özeti', bullish: 'Yükseliş', bearish: 'Düşüş',
    // News
    financial_news: 'Finans Haberleri', search_news: 'Haber ara...', all: 'Tümü', crypto: 'Kripto',
    stocks: 'Hisse', forex: 'Forex', commodities: 'Emtia', economy: 'Ekonomi',
    // Portfolio
    holdings: 'Varlıklar', add: 'Ekle', amount: 'Miktar', buy_price: 'Alış Fiyatı', current_price: 'Güncel Fiyat',
    value: 'Değer', pnl: 'K/Z', return_pct: 'Getiri', allocation: 'Dağılım', symbol: 'Sembol',
    // Alerts
    price_alerts: 'Fiyat Alarmları', new_alert: 'Yeni Alarm', above: 'Üstünde', below: 'Altında',
    active: 'Aktif', paused: 'Duraklatıldı', delete: 'Sil', no_alerts: 'Henüz alarm yok',
    // Settings
    appearance: 'Görünüm', theme: 'Tema', save: 'Kaydet', cancel: 'İptal', edit: 'Düzenle', saved: 'Kaydedildi!',
    // Pricing
    choose_plan: 'Planını Seç', most_popular: 'EN POPÜLER', get_started: 'Başla',
    upgrade_now: 'Yükselt', contact_sales: 'Satışla İletişim', enterprise: 'Kurumsal',
    // Bots
    trading_bots: 'Yapay Zeka Botları', all_bots: 'Tüm Botlar', scalping: 'AI Scalping', grid: 'Grid Bot',
    dca: 'DCA Bot', momentum: 'Momentum', entry: 'Giriş', target: 'Hedef', stop_loss: 'Zarar Durdur',
    best_for: 'En uygun', reasons: 'Nedenler',
    // Trade
    binance_trade: 'Binance İşlem', balance: 'Bakiye', refresh: 'Yenile', order_success: 'Emir başarılı',
    order_error: 'Hata', quantity: 'Miktar',
    // Backtesting
    strategy: 'Strateji', timeframe: 'Zaman Dilimi', period: 'Periyot', avg_profit: 'Ort. Kâr',
    date: 'Tarih', reason: 'Neden', type: 'Tip', exit: 'Çıkış', profit: 'Kâr',
    // Auth
    sign_in: 'Giriş Yap', register: 'Kayıt Ol', username: 'Kullanıcı Adı', email: 'E-posta', password: 'Şifre',
    create_account: 'Hesap Oluştur', already_have: 'Zaten hesabın var mı?', dont_have: 'Hesabın yok mu?',
    or_continue: 'veya şununla devam et',
    // History
    price_history: 'Fiyat Geçmişi', time: 'Zaman', change: 'Değişim',
    // Güvenlik
    change_password: 'Şifre Değiştir', two_factor: 'İki Faktörlü Doğrulama', delete_account: 'Hesabı Sil',
  },
};

const LanguageContext = createContext<LangContextType>({ lang: 'en', setLang: () => {}, t: (k) => k });

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'en');
  useEffect(() => { localStorage.setItem('lang', lang); }, [lang]);
  const t = (key: string): string => translations[lang]?.[key] || key;
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
};

export const useLang = () => useContext(LanguageContext);