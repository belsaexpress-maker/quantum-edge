import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import AISignals from './pages/AISignals';
import AIAnalysis from './pages/AIAnalysis';
import News from './pages/News';
import WorldMarkets from './pages/WorldMarkets';
import Portfolio from './pages/Portfolio';
import Alerts from './pages/Alerts';
import SettingsPage from './pages/Settings';
import Pricing from './pages/Pricing';
import Backtesting from './pages/Backtesting';
import Profile from './pages/Profile';
import PriceHistoryPage from './pages/PriceHistory';
import TradingBots from './pages/TradingBots';
import BinanceTrade from './pages/BinanceTrade';
import Trade from './pages/Trade';
import ConnectExchange from './pages/ConnectExchange';
import ProTrade from './pages/ProTrade';


const App: React.FC = () => {
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setPage(hash);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'markets': return <Markets />;
      case 'ai-signals': return <AISignals />;
      case 'ai-analysis': return <AIAnalysis />;
      case 'news': return <News />;
      case 'world': return <WorldMarkets />;
      case 'portfolio': return <Portfolio />;
      case 'alerts': return <Alerts />;
      case 'settings': return <SettingsPage />;
      case 'pricing': return <Pricing />;
      case 'backtesting': return <Backtesting />;
      case 'profile': return <Profile />;
      case 'history': return <PriceHistoryPage />;
      case 'bots': return <TradingBots />;
      case 'binance': return <BinanceTrade />;
      case 'trade': return <Trade />;
      case 'connect-exchange': return <ConnectExchange />;
      case 'pro-trade': return <ProTrade />;
      default: return <Dashboard />;
    }
  };

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Layout>{renderPage()}</Layout>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;