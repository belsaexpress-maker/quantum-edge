import React, { useEffect, useRef } from 'react';

interface Props {
  symbol?: string;
  height?: number;
  interval?: string;
  price?: number;
}

const TradingViewChart: React.FC<Props> = ({ symbol = 'BTCUSDT', height = 400, interval = '60', price }) => {
  const containerId = useRef(`tv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`);

  useEffect(() => {
    const container = document.getElementById(containerId.current);
    if (!container) return;

    // Önceki widget'ı temizle
    container.innerHTML = '';

    const cleanSymbol = (symbol || 'BTCUSDT').replace('_', '').toUpperCase();
    const tvSymbol = `BINANCE:${cleanSymbol}`;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
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
            container_id: containerId.current,
            hide_side_toolbar: true,
            width: '100%',
            height: height,
          });
        } catch (e) {
          // Widget yüklenemezse sessizce devam et
        }
      }
    };

    container.appendChild(script);

    return () => {
      // Temizlik - güvenli
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [symbol, interval, height]);

  return (
    <div id={containerId.current} style={{ width: '100%', height: `${height}px` }}>
      {price && (
        <div className="flex items-center justify-center h-full bg-[var(--color-bg-primary)] rounded-lg">
          <p className="text-3xl font-bold text-[var(--color-accent)]">${price.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
};

export default TradingViewChart;