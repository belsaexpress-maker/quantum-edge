import React, { useEffect } from 'react';

export default function TradingViewWidget() {
  useEffect(() => {
    // 1. TradingView kütüphanesini yükle
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    
    // 2. Kütüphane yüklendiğinde grafiği oluştur
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: "BINANCE:BTCUSDT",
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          backgroundColor: "rgba(31, 41, 55, 1)", // Tailwind bg-gray-800 ile uyumlu
          gridColor: "rgba(55, 65, 81, 0.4)",
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: "tv_chart_container"
        });
      }
    };

    document.head.appendChild(script);

    // Temizlik (Component unmount olduğunda scripti sil)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden flex-1 min-h-[400px]">
      <div id="tv_chart_container" className="h-full w-full"></div>
    </div>
  );
}