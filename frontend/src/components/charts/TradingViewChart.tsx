import React, { useEffect, useRef } from 'react';

interface Props {
  symbol?: string;
  height?: number;
  interval?: string;
}

const TradingViewChart: React.FC<Props> = ({ symbol = 'BTCUSD', height = 400, interval = '60' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartId = useRef(`tv_${Date.now()}`);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const div = document.createElement('div');
    div.id = chartId.current;
    div.style.width = '100%';
    div.style.height = `${height}px`;
    container.appendChild(div);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}`,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: chartId.current,
          hide_side_toolbar: true,
          studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
          width: '100%',
          height: height,
        });
      }
    };
    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [symbol, height, interval]);

  return <div ref={containerRef} style={{ width: '100%' }} />;
};

export default TradingViewChart;