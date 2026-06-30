import React, { useEffect, useRef, useState } from 'react';

interface Props {
  symbol?: string;
  height?: number;
  interval?: string;
}

const TradingViewChart: React.FC<Props> = ({ symbol = 'BTCUSDT', height = 400, interval = '60' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
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
      } catch (e) {
        setError(true);
      }
    };
    script.onerror = () => setError(true);
    container.appendChild(script);

    return () => { if (container) container.innerHTML = ''; };
  }, [symbol, interval, height]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: `${height}px` }}>
      {error && (
        <div className="flex items-center justify-center h-full bg-[var(--color-bg-primary)] rounded-lg text-[var(--color-text-muted)] text-sm">
          <div className="text-center">
            <p>📊 Grafik bu sembol için desteklenmiyor</p>
            <p className="text-xs mt-1">Binance'te listeli olmayabilir</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingViewChart;