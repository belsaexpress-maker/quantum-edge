import React, { useEffect, useRef, useState } from 'react';

interface Props {
  symbol?: string;
  height?: number;
  interval?: string;
  price?: number;
}

const TradingViewChart: React.FC<Props> = ({ symbol = 'BTCUSDT', height = 400, interval = '60', price }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(false);
    setLoading(true);
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    const cleanSymbol = symbol.replace('_', '').toUpperCase();
    const tvSymbol = `BINANCE:${cleanSymbol}`;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (!window.TradingView) {
        setError(true);
        setLoading(false);
        return;
      }
      try {
        new window.TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: `tv_${cleanSymbol}`,
          hide_side_toolbar: true,
          studies: ['RSI@tv-basicstudies'],
          width: '100%',
          height: height,
        });
        setTimeout(() => setLoading(false), 1500);
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    };
    script.onerror = () => {
      setError(true);
      setLoading(false);
    };
    container.appendChild(script);

    // 5 saniye sonra hâlâ yüklenmediyse fallback göster
    const timeout = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      if (container) container.innerHTML = '';
    };
  }, [symbol, interval, height]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: `${height}px` }}>
      {loading && !error && (
        <div className="flex items-center justify-center h-full bg-[var(--color-bg-primary)] rounded-lg text-[var(--color-text-muted)] text-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p>Grafik yükleniyor...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center h-full bg-[var(--color-bg-primary)] rounded-lg text-[var(--color-text-muted)] text-sm">
          <div className="text-center">
            <p className="text-4xl font-bold text-[var(--color-accent)] mb-2">
              ${price ? price.toFixed(4) : '0.00'}
            </p>
            <p>{symbol?.replace('USDT', '/USDT')}</p>
            <p className="text-xs mt-1">Grafik bu sembol için desteklenmiyor</p>
            <p className="text-xs">Binance'te listeli olmayabilir</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingViewChart;